/**
 * Client API centralisé pour data.economie.gouv.fr
 * Gère la connexion, le cache et la gestion des erreurs
 */

class ApiClient {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || 'https://data.economie.gouv.fr/api';
    this.version = config.version || 'records/1.0';
    this.cache = new Map();
    this.cacheTimeout = config.cacheTimeout || 5 * 60 * 1000; // 5 minutes par défaut
    this.retryAttempts = config.retryAttempts || 3;
    this.retryDelay = config.retryDelay || 1000;
    this.requestTimeout = config.requestTimeout || 10000;
    
    // Indicateurs de performance
    this.stats = {
      requests: 0,
      cacheHits: 0,
      errors: 0,
      totalResponseTime: 0
    };
    
    // WebSocket pour temps réel (optionnel)
    this.websocket = null;
    this.realTimeEnabled = config.realTime || false;
  }

  /**
   * Construit l'URL complète de l'API
   */
  buildUrl(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}/${this.version}/${endpoint}`);
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    
    return url.toString();
  }

  /**
   * Récupère depuis le cache si disponible
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      this.stats.cacheHits++;
      return cached.data;
    }
    
    return null;
  }

  /**
   * Stocke en cache
   */
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Nettoyer le cache si trop grand
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Effectue une requête avec retry et timeout
   */
  async fetchWithRetry(url, options = {}, attempt = 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.requestTimeout);
    
    try {
      const startTime = Date.now();
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      
      this.stats.totalResponseTime += Date.now() - startTime;
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      clearTimeout(timeout);
      
      if (attempt < this.retryAttempts) {
        await new Promise(resolve => 
          setTimeout(resolve, this.retryDelay * attempt)
        );
        return this.fetchWithRetry(url, options, attempt + 1);
      }
      
      this.stats.errors++;
      throw error;
    }
  }

  /**
   * API principale de récupération des données
   */
  async search(dataset, options = {}) {
    const params = {
      dataset,
      rows: options.rows || 20,
      start: options.start || 0,
      sort: options.sort || '-creationdate',
      q: options.query || '',
      facet: options.facets || [],
      ...options.filters
    };
    
    const url = this.buildUrl('search', params);
    const cacheKey = url;
    
    // Vérifier le cache
    const cached = this.getFromCache(cacheKey);
    if (cached && !options.noCache) {
      return cached;
    }
    
    // Effectuer la requête
    this.stats.requests++;
    const data = await this.fetchWithRetry(url);
    
    // Mettre en cache
    this.setCache(cacheKey, data);
    
    return data;
  }

  /**
   * Récupère les facettes d'un dataset
   */
  async getFacets(dataset, facetNames = []) {
    const params = {
      dataset,
      rows: 0,
      facet: facetNames
    };
    
    const url = this.buildUrl('search', params);
    const data = await this.fetchWithRetry(url);
    
    const facets = {};
    if (data.facet_groups) {
      data.facet_groups.forEach(group => {
        facets[group.name] = group.facets;
      });
    }
    
    return facets;
  }

  /**
   * Récupère un enregistrement spécifique
   */
  async getRecord(dataset, recordId) {
    const params = {
      dataset,
      q: `recordid:${recordId}`
    };
    
    const url = this.buildUrl('search', params);
    const data = await this.fetchWithRetry(url);
    
    return data.records && data.records[0];
  }

  /**
   * Exporte les données dans différents formats
   */
  async export(dataset, format = 'csv', options = {}) {
    const params = {
      dataset,
      format,
      ...options
    };
    
    const url = this.buildUrl('download', params);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }
    
    return response.blob();
  }

  /**
   * Agrégation des données
   */
  async aggregate(dataset, groupBy, aggregations = {}) {
    const data = await this.search(dataset, {
      rows: 10000,
      facets: [groupBy]
    });
    
    const results = {};
    
    data.records.forEach(record => {
      const key = record.fields[groupBy] || 'Non renseigné';
      
      if (!results[key]) {
        results[key] = {
          count: 0,
          ...Object.keys(aggregations).reduce((acc, field) => {
            acc[field] = aggregations[field] === 'sum' ? 0 : [];
            return acc;
          }, {})
        };
      }
      
      results[key].count++;
      
      Object.keys(aggregations).forEach(field => {
        const value = record.fields[field];
        if (aggregations[field] === 'sum' && typeof value === 'number') {
          results[key][field] += value;
        } else if (aggregations[field] === 'avg') {
          results[key][field].push(value);
        }
      });
    });
    
    // Calculer les moyennes
    Object.keys(results).forEach(key => {
      Object.keys(aggregations).forEach(field => {
        if (aggregations[field] === 'avg' && results[key][field].length > 0) {
          const sum = results[key][field].reduce((a, b) => a + b, 0);
          results[key][field] = sum / results[key][field].length;
        }
      });
    });
    
    return results;
  }

  /**
   * Connexion WebSocket pour temps réel
   */
  connectRealTime(dataset, onUpdate) {
    if (!this.realTimeEnabled) return;
    
    const wsUrl = this.baseUrl.replace('https:', 'wss:').replace('http:', 'ws:');
    this.websocket = new WebSocket(`${wsUrl}/realtime/${dataset}`);
    
    this.websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onUpdate(data);
    };
    
    this.websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.reconnectRealTime(dataset, onUpdate);
    };
  }

  /**
   * Reconnexion automatique WebSocket
   */
  reconnectRealTime(dataset, onUpdate) {
    setTimeout(() => {
      this.connectRealTime(dataset, onUpdate);
    }, 5000);
  }

  /**
   * Nettoie le cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Récupère les statistiques de performance
   */
  getStats() {
    const avgResponseTime = this.stats.requests > 0 
      ? this.stats.totalResponseTime / this.stats.requests 
      : 0;
    
    return {
      ...this.stats,
      avgResponseTime,
      cacheHitRate: this.stats.requests > 0 
        ? (this.stats.cacheHits / this.stats.requests) * 100 
        : 0
    };
  }

  /**
   * Détruit l'instance et nettoie les ressources
   */
  destroy() {
    if (this.websocket) {
      this.websocket.close();
    }
    this.clearCache();
  }
}

// Export pour utilisation dans les widgets
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApiClient;
} else {
  window.ApiClient = ApiClient;
}