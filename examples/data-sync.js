/**
 * Service de synchronisation des données en temps réel
 * Gère le polling, les notifications et l'état global
 */

class DataSyncService {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.subscriptions = new Map();
    this.pollingIntervals = new Map();
    this.globalState = new Map();
    this.listeners = new Set();
    this.defaultPollingInterval = 30000; // 30 secondes
    
    // État de synchronisation
    this.syncStatus = {
      isOnline: navigator.onLine,
      lastSync: null,
      pendingSync: 0,
      errors: []
    };
    
    this.initEventListeners();
  }

  /**
   * Initialise les écouteurs d'événements système
   */
  initEventListeners() {
    // Détection de la connexion/déconnexion
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
    
    // Synchronisation quand la page devient visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.syncAll();
      }
    });
  }

  /**
   * S'abonne aux mises à jour d'un dataset
   */
  subscribe(dataset, options = {}) {
    const subscriptionId = `${dataset}_${Date.now()}`;
    
    const subscription = {
      dataset,
      query: options.query || {},
      interval: options.interval || this.defaultPollingInterval,
      callback: options.onUpdate,
      lastData: null,
      lastHash: null
    };
    
    this.subscriptions.set(subscriptionId, subscription);
    
    // Démarrer le polling
    if (options.autoStart !== false) {
      this.startPolling(subscriptionId);
    }
    
    // Charger les données initiales
    this.fetchAndUpdate(subscriptionId);
    
    return subscriptionId;
  }

  /**
   * Se désabonne d'un dataset
   */
  unsubscribe(subscriptionId) {
    this.stopPolling(subscriptionId);
    this.subscriptions.delete(subscriptionId);
  }

  /**
   * Démarre le polling pour une souscription
   */
  startPolling(subscriptionId) {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return;
    
    // Nettoyer l'ancien interval si existe
    this.stopPolling(subscriptionId);
    
    const intervalId = setInterval(() => {
      this.fetchAndUpdate(subscriptionId);
    }, subscription.interval);
    
    this.pollingIntervals.set(subscriptionId, intervalId);
  }

  /**
   * Arrête le polling pour une souscription
   */
  stopPolling(subscriptionId) {
    const intervalId = this.pollingIntervals.get(subscriptionId);
    if (intervalId) {
      clearInterval(intervalId);
      this.pollingIntervals.delete(subscriptionId);
    }
  }

  /**
   * Récupère et met à jour les données
   */
  async fetchAndUpdate(subscriptionId) {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return;
    
    try {
      this.syncStatus.pendingSync++;
      
      const data = await this.apiClient.search(subscription.dataset, subscription.query);
      const dataHash = this.hashData(data);
      
      // Vérifier si les données ont changé
      if (dataHash !== subscription.lastHash) {
        subscription.lastData = data;
        subscription.lastHash = dataHash;
        
        // Mettre à jour l'état global
        this.updateGlobalState(subscription.dataset, data);
        
        // Notifier le callback
        if (subscription.callback) {
          subscription.callback(data, {
            isInitial: subscription.lastHash === null,
            hasChanges: true,
            dataset: subscription.dataset
          });
        }
        
        // Notifier les listeners globaux
        this.notifyListeners({
          type: 'dataUpdate',
          dataset: subscription.dataset,
          data
        });
      }
      
      this.syncStatus.lastSync = new Date();
      this.syncStatus.pendingSync--;
      
    } catch (error) {
      this.syncStatus.pendingSync--;
      this.handleError(error, subscription.dataset);
    }
  }

  /**
   * Synchronise toutes les souscriptions
   */
  async syncAll() {
    const promises = Array.from(this.subscriptions.keys()).map(id => 
      this.fetchAndUpdate(id)
    );
    
    await Promise.allSettled(promises);
  }

  /**
   * Hash simple pour détecter les changements
   */
  hashData(data) {
    return JSON.stringify({
      nhits: data.nhits,
      records: data.records?.map(r => r.recordid)
    });
  }

  /**
   * Met à jour l'état global
   */
  updateGlobalState(dataset, data) {
    this.globalState.set(dataset, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Récupère l'état global d'un dataset
   */
  getState(dataset) {
    return this.globalState.get(dataset);
  }

  /**
   * Ajoute un listener global
   */
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notifie tous les listeners
   */
  notifyListeners(event) {
    this.listeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }

  /**
   * Gestion de la reconnexion
   */
  handleOnline() {
    this.syncStatus.isOnline = true;
    this.notifyListeners({ type: 'online' });
    this.syncAll();
  }

  /**
   * Gestion de la déconnexion
   */
  handleOffline() {
    this.syncStatus.isOnline = false;
    this.notifyListeners({ type: 'offline' });
    
    // Arrêter tous les pollings
    this.pollingIntervals.forEach((_, id) => this.stopPolling(id));
  }

  /**
   * Gestion des erreurs
   */
  handleError(error, dataset) {
    const errorInfo = {
      dataset,
      error: error.message,
      timestamp: new Date()
    };
    
    this.syncStatus.errors.push(errorInfo);
    
    // Garder seulement les 10 dernières erreurs
    if (this.syncStatus.errors.length > 10) {
      this.syncStatus.errors.shift();
    }
    
    this.notifyListeners({
      type: 'error',
      ...errorInfo
    });
  }

  /**
   * Configuration du polling par défaut
   */
  setDefaultInterval(interval) {
    this.defaultPollingInterval = interval;
  }

  /**
   * Récupère le statut de synchronisation
   */
  getStatus() {
    return {
      ...this.syncStatus,
      activeSubscriptions: this.subscriptions.size,
      pollingActive: this.pollingIntervals.size
    };
  }

  /**
   * Pause toutes les synchronisations
   */
  pauseAll() {
    this.pollingIntervals.forEach((_, id) => this.stopPolling(id));
  }

  /**
   * Reprend toutes les synchronisations
   */
  resumeAll() {
    this.subscriptions.forEach((_, id) => this.startPolling(id));
  }

  /**
   * Nettoie toutes les ressources
   */
  destroy() {
    this.pauseAll();
    this.subscriptions.clear();
    this.globalState.clear();
    this.listeners.clear();
  }
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataSyncService;
} else {
  window.DataSyncService = DataSyncService;
}