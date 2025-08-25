/**
 * ApiClient - Système centralisé de gestion des appels API
 * Gère le cache, la déduplication, le retry et la synchronisation des données
 */

class ApiClient {
  constructor(config = {}) {
    this.config = {
      baseURL: config.baseURL || 'https://data.economie.gouv.fr',
      timeout: config.timeout || 30000,
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
      cacheEnabled: config.cacheEnabled !== false,
      cacheDuration: config.cacheDuration || 5 * 60 * 1000, // 5 minutes
      maxCacheSize: config.maxCacheSize || 100,
      debug: config.debug || false,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...config.headers
      }
    };
        
    // Cache stores
    this.memoryCache = new Map();
    this.pendingRequests = new Map();
        
    // Statistics
    this.stats = {
      requests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      errors: 0,
      totalResponseTime: 0,
      averageResponseTime: 0
    };
        
    // Event emitter for real-time updates
    this.listeners = new Map();
        
    // Initialize localStorage cleanup
    this.initStorageCleanup();
        
    // Data synchronization manager
    this.dataSync = new DataSync(this);
  }
    
  /**
     * Initialize periodic cleanup of expired cache entries
     */
  initStorageCleanup() {
    // Clean expired entries every minute
    setInterval(() => {
      this.cleanExpiredCache();
    }, 60000);
        
    // Initial cleanup
    this.cleanExpiredCache();
  }
    
  /**
     * Clean expired cache entries from memory and localStorage
     */
  cleanExpiredCache() {
    const now = Date.now();
    let cleaned = 0;
        
    // Clean memory cache
    for (const [key, value] of this.memoryCache.entries()) {
      if (now - value.timestamp > this.config.cacheDuration) {
        this.memoryCache.delete(key);
        cleaned++;
      }
    }
        
    // Clean localStorage
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('api_cache_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            if (now - data.timestamp > this.config.cacheDuration) {
              localStorage.removeItem(key);
              cleaned++;
            }
          } catch (e) {
            // Remove corrupted entries
            localStorage.removeItem(key);
          }
        }
      });
    } catch (e) {
      console.warn('Failed to clean localStorage:', e);
    }
        
    if (this.config.debug && cleaned > 0) {
      console.log(`[ApiClient] Cleaned ${cleaned} expired cache entries`);
    }
  }
    
  /**
     * Generate cache key from URL and options
     */
  getCacheKey(url, options = {}) {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    const params = options.params ? JSON.stringify(options.params) : '';
    return `${method}:${url}:${params}:${body}`;
  }
    
  /**
     * Get data from cache
     */
  getFromCache(key) {
    // Check memory cache first
    if (this.memoryCache.has(key)) {
      const cached = this.memoryCache.get(key);
      if (Date.now() - cached.timestamp < this.config.cacheDuration) {
        this.stats.cacheHits++;
        this.emit('cache:hit', { key, data: cached.data });
        return cached.data;
      }
      this.memoryCache.delete(key);
    }
        
    // Check localStorage
    try {
      const stored = localStorage.getItem(`api_cache_${key}`);
      if (stored) {
        const cached = JSON.parse(stored);
        if (Date.now() - cached.timestamp < this.config.cacheDuration) {
          // Restore to memory cache for faster access
          this.memoryCache.set(key, cached);
          this.stats.cacheHits++;
          this.emit('cache:hit', { key, data: cached.data });
          return cached.data;
        }
        localStorage.removeItem(`api_cache_${key}`);
      }
    } catch (e) {
      console.warn('Failed to read from localStorage:', e);
    }
        
    this.stats.cacheMisses++;
    this.emit('cache:miss', { key });
    return null;
  }
    
  /**
     * Save data to cache
     */
  saveToCache(key, data) {
    const cacheEntry = {
      data: data,
      timestamp: Date.now(),
      url: key.split(':')[1]
    };
        
    // Limit memory cache size
    if (this.memoryCache.size >= this.config.maxCacheSize) {
      const firstKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(firstKey);
    }
        
    // Save to memory
    this.memoryCache.set(key, cacheEntry);
        
    // Save to localStorage
    try {
      localStorage.setItem(`api_cache_${key}`, JSON.stringify(cacheEntry));
    } catch (e) {
      // Handle quota exceeded
      if (e.name === 'QuotaExceededError') {
        this.clearOldestCacheEntries();
        try {
          localStorage.setItem(`api_cache_${key}`, JSON.stringify(cacheEntry));
        } catch (e2) {
          console.warn('Failed to save to localStorage after cleanup:', e2);
        }
      }
    }
        
    this.emit('cache:set', { key, data });
  }
    
  /**
     * Clear oldest cache entries when storage is full
     */
  clearOldestCacheEntries() {
    const cacheKeys = [];
    const keys = Object.keys(localStorage);
        
    keys.forEach(key => {
      if (key.startsWith('api_cache_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          cacheKeys.push({ key, timestamp: data.timestamp });
        } catch (e) {
          localStorage.removeItem(key);
        }
      }
    });
        
    // Sort by timestamp and remove oldest 25%
    cacheKeys.sort((a, b) => a.timestamp - b.timestamp);
    const toRemove = Math.floor(cacheKeys.length * 0.25);
        
    for (let i = 0; i < toRemove; i++) {
      localStorage.removeItem(cacheKeys[i].key);
    }
  }
    
  /**
     * Main request method with caching and retry logic
     */
  async request(url, options = {}) {
    // Normalize URL
    if (!url.startsWith('http')) {
      url = `${this.config.baseURL}${url}`;
    }
        
    // Merge options with defaults
    options = {
      method: 'GET',
      ...options,
      headers: {
        ...this.config.headers,
        ...options.headers
      }
    };
        
    // Handle query parameters
    if (options.params) {
      const params = new URLSearchParams(options.params);
      url += (url.includes('?') ? '&' : '?') + params.toString();
    }
        
    const cacheKey = this.getCacheKey(url, options);
        
    // Check cache for GET requests
    if (this.config.cacheEnabled && options.method === 'GET') {
      const cachedData = this.getFromCache(cacheKey);
      if (cachedData) {
        if (this.config.debug) {
          console.log(`[ApiClient] Cache hit for: ${url}`);
        }
        return cachedData;
      }
    }
        
    // Check for pending identical request
    if (this.pendingRequests.has(cacheKey)) {
      if (this.config.debug) {
        console.log(`[ApiClient] Deduplicating request: ${url}`);
      }
      return this.pendingRequests.get(cacheKey);
    }
        
    // Create request promise
    const requestPromise = this.executeRequest(url, options, cacheKey);
        
    // Store as pending for deduplication
    this.pendingRequests.set(cacheKey, requestPromise);
        
    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }
    
  /**
     * Execute the actual HTTP request with retry logic
     */
  async executeRequest(url, options, cacheKey, attempt = 1) {
    const startTime = Date.now();
        
    try {
      this.stats.requests++;
      this.emit('request:start', { url, options });
            
      // Add timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
            
      options.signal = controller.signal;
            
      if (this.config.debug) {
        console.log(`[ApiClient] ${options.method} ${url}`);
      }
            
      const response = await fetch(url, options);
      clearTimeout(timeoutId);
            
      const responseTime = Date.now() - startTime;
      this.stats.totalResponseTime += responseTime;
      this.stats.averageResponseTime = Math.round(
        this.stats.totalResponseTime / this.stats.requests
      );
            
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
            
      const data = await response.json();
            
      // Cache successful GET requests
      if (this.config.cacheEnabled && options.method === 'GET') {
        this.saveToCache(cacheKey, data);
      }
            
      this.emit('request:success', { url, data, responseTime });
            
      return data;
            
    } catch (error) {
      this.stats.errors++;
            
      // Retry logic
      if (attempt < this.config.retryAttempts) {
        const delay = this.config.retryDelay * attempt;
                
        if (this.config.debug) {
          console.log(`[ApiClient] Retry ${attempt}/${this.config.retryAttempts} after ${delay}ms: ${url}`);
        }
                
        this.emit('request:retry', { url, attempt, error: error.message });
                
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.executeRequest(url, options, cacheKey, attempt + 1);
      }
            
      this.emit('request:error', { url, error: error.message });
      throw error;
    }
  }
    
  /**
     * Convenience methods for different HTTP verbs
     */
  async get(url, params = {}, options = {}) {
    return this.request(url, { ...options, method: 'GET', params });
  }
    
  async post(url, data = {}, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
    
  async put(url, data = {}, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
    
  async delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }
    
  /**
     * Batch requests - execute multiple requests in parallel
     */
  async batch(requests) {
    const promises = requests.map(req => {
      if (typeof req === 'string') {
        return this.get(req);
      }
      return this.request(req.url, req.options);
    });
        
    return Promise.all(promises);
  }
    
  /**
     * Clear all cache
     */
  clearCache() {
    this.memoryCache.clear();
        
    // Clear localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('api_cache_')) {
        localStorage.removeItem(key);
      }
    });
        
    this.emit('cache:clear');
        
    if (this.config.debug) {
      console.log('[ApiClient] Cache cleared');
    }
  }
    
  /**
     * Get statistics
     */
  getStats() {
    const cacheHitRate = this.stats.requests > 0
      ? Math.round((this.stats.cacheHits / this.stats.requests) * 100)
      : 0;
            
    return {
      ...this.stats,
      cacheHitRate,
      memoryCacheSize: this.memoryCache.size,
      pendingRequests: this.pendingRequests.size
    };
  }
    
  /**
     * Event emitter methods
     */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }
    
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
    
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (e) {
          console.error(`Error in event listener for ${event}:`, e);
        }
      });
    }
  }
}

/**
 * DataSync - Manages real-time data synchronization across widgets
 */
class DataSync {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.subscriptions = new Map();
    this.updateInterval = 30000; // 30 seconds default
    this.isRunning = false;
        
    // BroadcastChannel for cross-tab synchronization
    this.initBroadcastChannel();
  }
    
  initBroadcastChannel() {
    if (typeof BroadcastChannel !== 'undefined') {
      this.channel = new BroadcastChannel('api_data_sync');
            
      this.channel.onmessage = (event) => {
        if (event.data.type === 'cache_update') {
          // Update local cache with data from other tab
          const { key, data } = event.data;
          this.apiClient.saveToCache(key, data);
                    
          // Notify subscribers
          this.notifySubscribers(key, data);
        }
      };
    }
  }
    
  /**
     * Subscribe to data updates for a specific URL
     */
  subscribe(url, callback, options = {}) {
    const key = this.apiClient.getCacheKey(url, options);
        
    if (!this.subscriptions.has(key)) {
      this.subscriptions.set(key, {
        url,
        options,
        callbacks: [],
        lastUpdate: 0
      });
    }
        
    const subscription = this.subscriptions.get(key);
    subscription.callbacks.push(callback);
        
    // Start auto-refresh if not running
    if (!this.isRunning) {
      this.start();
    }
        
    // Return unsubscribe function
    return () => {
      const index = subscription.callbacks.indexOf(callback);
      if (index > -1) {
        subscription.callbacks.splice(index, 1);
      }
            
      // Stop if no more subscriptions
      if (subscription.callbacks.length === 0) {
        this.subscriptions.delete(key);
      }
            
      if (this.subscriptions.size === 0) {
        this.stop();
      }
    };
  }
    
  /**
     * Start auto-refresh
     */
  start() {
    if (this.isRunning) return;
        
    this.isRunning = true;
    this.refreshInterval = setInterval(() => {
      this.refreshAll();
    }, this.updateInterval);
        
    // Initial refresh
    this.refreshAll();
  }
    
  /**
     * Stop auto-refresh
     */
  stop() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    this.isRunning = false;
  }
    
  /**
     * Refresh all subscribed data
     */
  async refreshAll() {
    const now = Date.now();
        
    for (const [key, subscription] of this.subscriptions.entries()) {
      // Skip if recently updated
      if (now - subscription.lastUpdate < this.updateInterval * 0.9) {
        continue;
      }
            
      try {
        const data = await this.apiClient.request(subscription.url, {
          ...subscription.options,
          bypassCache: true // Force fresh data
        });
                
        subscription.lastUpdate = now;
                
        // Notify all subscribers
        this.notifySubscribers(key, data);
                
        // Broadcast to other tabs
        if (this.channel) {
          this.channel.postMessage({
            type: 'cache_update',
            key,
            data
          });
        }
                
      } catch (error) {
        console.error(`Failed to refresh data for ${subscription.url}:`, error);
      }
    }
  }
    
  /**
     * Notify all subscribers of a data update
     */
  notifySubscribers(key, data) {
    const subscription = this.subscriptions.get(key);
        
    if (subscription && subscription.callbacks.length > 0) {
      subscription.callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (e) {
          console.error('Error in subscription callback:', e);
        }
      });
    }
  }
    
  /**
     * Set update interval
     */
  setUpdateInterval(interval) {
    this.updateInterval = interval;
        
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }
}

// Create global instance
window.apiClient = new ApiClient({
  debug: window.location.hostname === 'localhost',
  cacheEnabled: true,
  cacheDuration: 5 * 60 * 1000, // 5 minutes
  retryAttempts: 3,
  retryDelay: 1000
});

// Expose for convenience
window.ApiClient = ApiClient;
window.DataSync = DataSync;

// Auto-replace fetch if configured
if (window.AUTO_REPLACE_FETCH !== false) {
  const originalFetch = window.fetch;
    
  window.fetch = function(url, options) {
    // Only intercept data.economie.gouv.fr calls
    if (typeof url === 'string' && url.includes('data.economie.gouv.fr')) {
      return window.apiClient.request(url, options).then(data => {
        // Return a Response-like object
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      });
    }
        
    return originalFetch(url, options);
  };
    
  console.log('[ApiClient] Fetch auto-replaced for data.economie.gouv.fr');
}

console.log('[ApiClient] Initialized with DataSync support');