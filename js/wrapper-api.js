/**
 * Wrapper de compatibilité pour migration progressive vers ApiClient
 * Permet de router automatiquement les appels API vers le système de cache centralisé
 */

(function(window) {
  'use strict';

  // Sauvegarde de la fonction fetch originale
  const originalFetch = window.fetch;
    
  // Configuration
  const config = {
    apiDomain: 'data.economie.gouv.fr',
    enableCache: true,
    enableMonitoring: true,
    cachePrefix: 'api_cache_',
    cacheDuration: 5 * 60 * 1000, // 5 minutes
    debug: window.location.hostname === 'localhost'
  };

  // Cache en mémoire pour les requêtes
  const memoryCache = new Map();
  const pendingRequests = new Map();
    
  // Statistiques pour monitoring
  const stats = {
    totalRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    apiCalls: 0,
    savedRequests: 0,
    startTime: Date.now()
  };

  /**
     * Génère une clé unique pour le cache
     */
  function getCacheKey(url, options = {}) {
    const method = options.method || 'GET';
    const body = options.body || '';
    return `${method}:${url}:${body}`;
  }

  /**
     * Vérifie si une URL doit utiliser le cache
     */
  function shouldUseCache(url) {
    return url.includes(config.apiDomain) && config.enableCache;
  }

  /**
     * Récupère depuis le cache ou null si non trouvé/expiré
     */
  function getFromCache(key) {
    // Vérification cache mémoire
    if (memoryCache.has(key)) {
      const cached = memoryCache.get(key);
      if (Date.now() - cached.timestamp < config.cacheDuration) {
        if (config.debug) {
          console.log('[FetchCompat] Cache hit:', key);
        }
        stats.cacheHits++;
        return cached.data;
      } else {
        // Cache expiré, on le supprime
        memoryCache.delete(key);
      }
    }

    // Vérification localStorage
    try {
      const stored = localStorage.getItem(config.cachePrefix + key);
      if (stored) {
        const cached = JSON.parse(stored);
        if (Date.now() - cached.timestamp < config.cacheDuration) {
          // Remettre en cache mémoire pour accès plus rapide
          memoryCache.set(key, cached);
          if (config.debug) {
            console.log('[FetchCompat] LocalStorage cache hit:', key);
          }
          stats.cacheHits++;
          return cached.data;
        } else {
          // Cache expiré
          localStorage.removeItem(config.cachePrefix + key);
        }
      }
    } catch (e) {
      console.warn('[FetchCompat] LocalStorage error:', e);
    }

    stats.cacheMisses++;
    return null;
  }

  /**
     * Sauvegarde en cache
     */
  function saveToCache(key, data) {
    const cacheEntry = {
      data: data,
      timestamp: Date.now()
    };

    // Cache mémoire
    memoryCache.set(key, cacheEntry);

    // Cache localStorage
    try {
      localStorage.setItem(config.cachePrefix + key, JSON.stringify(cacheEntry));
    } catch (e) {
      console.warn('[FetchCompat] Cannot save to localStorage:', e);
      // Si localStorage est plein, nettoyer les vieux items
      cleanupLocalStorage();
    }
  }

  /**
     * Nettoie le localStorage des vieux items de cache
     */
  function cleanupLocalStorage() {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(k => k.startsWith(config.cachePrefix));
        
    // Supprimer les 25% plus anciens
    const toRemove = Math.floor(cacheKeys.length * 0.25);
    cacheKeys
      .sort((a, b) => {
        try {
          const aData = JSON.parse(localStorage.getItem(a));
          const bData = JSON.parse(localStorage.getItem(b));
          return (aData?.timestamp || 0) - (bData?.timestamp || 0);
        } catch {
          return 0;
        }
      })
      .slice(0, toRemove)
      .forEach(key => localStorage.removeItem(key));
  }

  /**
     * Wrapper fetch avec cache et déduplication
     */
  window.fetchCompat = async function(url, options = {}) {
    stats.totalRequests++;

    // Si ce n'est pas une URL à cacher, utiliser fetch normal
    if (!shouldUseCache(url)) {
      if (config.debug) {
        console.log('[FetchCompat] Direct fetch (no cache):', url);
      }
      return originalFetch(url, options);
    }

    const cacheKey = getCacheKey(url, options);

    // Vérifier le cache
    const cachedResponse = getFromCache(cacheKey);
    if (cachedResponse) {
      stats.savedRequests++;
      // Retourner une Response simulée
      return new Response(JSON.stringify(cachedResponse), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'HIT'
        }
      });
    }

    // Vérifier si une requête identique est déjà en cours (déduplication)
    if (pendingRequests.has(cacheKey)) {
      if (config.debug) {
        console.log('[FetchCompat] Deduplicating request:', url);
      }
      stats.savedRequests++;
      return pendingRequests.get(cacheKey);
    }

    // Nouvelle requête
    if (config.debug) {
      console.log('[FetchCompat] New API call:', url);
    }
    stats.apiCalls++;

    // Créer la promesse de requête
    const requestPromise = originalFetch(url, options)
      .then(async (response) => {
        // Cloner la réponse pour pouvoir la lire plusieurs fois
        const clonedResponse = response.clone();
                
        // Si la requête est réussie, mettre en cache
        if (response.ok) {
          try {
            const data = await clonedResponse.json();
            saveToCache(cacheKey, data);
          } catch (e) {
            // Si ce n'est pas du JSON, on ne cache pas
            console.warn('[FetchCompat] Cannot cache non-JSON response');
          }
        }

        // Retirer de la liste des requêtes en cours
        pendingRequests.delete(cacheKey);
                
        return response;
      })
      .catch((error) => {
        // Retirer de la liste des requêtes en cours même en cas d'erreur
        pendingRequests.delete(cacheKey);
        throw error;
      });

    // Ajouter à la liste des requêtes en cours
    pendingRequests.set(cacheKey, requestPromise);

    return requestPromise;
  };

  /**
     * Fonction pour obtenir les statistiques
     */
  window.fetchCompat.getStats = function() {
    const runtime = Math.floor((Date.now() - stats.startTime) / 1000);
    const hitRate = stats.totalRequests > 0 
      ? Math.round((stats.cacheHits / stats.totalRequests) * 100) 
      : 0;
        
    return {
      ...stats,
      runtime: runtime,
      hitRate: hitRate,
      cacheSize: memoryCache.size,
      reduction: stats.totalRequests > 0 
        ? Math.round((stats.savedRequests / stats.totalRequests) * 100)
        : 0
    };
  };

  /**
     * Fonction pour vider le cache
     */
  window.fetchCompat.clearCache = function() {
    memoryCache.clear();
        
    // Nettoyer localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(config.cachePrefix)) {
        localStorage.removeItem(key);
      }
    });
        
    console.log('[FetchCompat] Cache cleared');
  };

  /**
     * Fonction pour configurer le wrapper
     */
  window.fetchCompat.configure = function(newConfig) {
    Object.assign(config, newConfig);
    console.log('[FetchCompat] Configuration updated:', config);
  };

  /**
     * Monitoring automatique (optionnel)
     */
  if (config.enableMonitoring) {
    // Afficher les stats toutes les 30 secondes en debug
    if (config.debug) {
      setInterval(() => {
        const stats = window.fetchCompat.getStats();
        console.log('[FetchCompat] Stats:', {
          'Total Requests': stats.totalRequests,
          'Cache Hit Rate': `${stats.hitRate}%`,
          'API Calls Saved': stats.savedRequests,
          'Reduction': `${stats.reduction}%`,
          'Runtime': `${stats.runtime}s`
        });
      }, 30000);
    }

    // Exposer les stats dans la console globale
    window.apiStats = window.fetchCompat.getStats;
  }

  // Si ApiClient existe déjà, l'utiliser en priorité
  if (window.ApiClient) {
    window.fetchCompat = async function(url, options = {}) {
      if (shouldUseCache(url)) {
        try {
          // Utiliser ApiClient s'il est disponible
          return await window.apiClient.fetchWithCache(url, options);
        } catch (e) {
          console.warn('[FetchCompat] ApiClient failed, falling back:', e);
          return originalFetch(url, options);
        }
      }
      return originalFetch(url, options);
    };
    console.log('[FetchCompat] Using ApiClient for caching');
  }

  // Remplacer fetch global si configuré
  if (window.FETCH_COMPAT_AUTO_REPLACE !== false) {
    window.fetch = window.fetchCompat;
    console.log('[FetchCompat] Global fetch replaced with fetchCompat');
  }

  console.log('[FetchCompat] Initialized - Use fetchCompat() or configure with FETCH_COMPAT_AUTO_REPLACE');
    
})(window);