/**
 * API Monitor - Composant de monitoring temps réel pour fetchCompat
 * Affiche les statistiques d'utilisation de l'API et du cache
 */

class ApiMonitor {
  constructor(options = {}) {
    this.options = {
      containerId: options.containerId || 'api-monitor',
      updateInterval: options.updateInterval || 2000, // 2 secondes
      theme: options.theme || 'light', // light ou dark
      position: options.position || 'bottom-right', // bottom-right, bottom-left, top-right, top-left
      autoStart: options.autoStart !== false,
      collapsed: options.collapsed || false,
      ...options
    };
        
    this.intervalId = null;
    this.container = null;
    this.isCollapsed = this.options.collapsed;
        
    if (this.options.autoStart) {
      this.init();
    }
  }
    
  init() {
    // Créer le conteneur si nécessaire
    this.createContainer();
        
    // Démarrer la mise à jour automatique
    this.start();
        
    // Premier rendu
    this.render();
  }
    
  createContainer() {
    // Vérifier si le conteneur existe déjà
    this.container = document.getElementById(this.options.containerId);
        
    if (!this.container) {
      // Créer un nouveau conteneur
      this.container = document.createElement('div');
      this.container.id = this.options.containerId;
      this.container.className = `api-monitor api-monitor--${this.options.position} api-monitor--${this.options.theme}`;
            
      // Ajouter les styles CSS
      this.injectStyles();
            
      // Ajouter au body
      document.body.appendChild(this.container);
    }
        
    // Ajouter les événements
    this.attachEvents();
  }
    
  injectStyles() {
    if (document.getElementById('api-monitor-styles')) return;
        
    const styles = document.createElement('style');
    styles.id = 'api-monitor-styles';
    styles.textContent = `
            .api-monitor {
                position: fixed;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                font-size: 12px;
                transition: all 0.3s ease;
                user-select: none;
            }
            
            .api-monitor--bottom-right {
                bottom: 20px;
                right: 20px;
            }
            
            .api-monitor--bottom-left {
                bottom: 20px;
                left: 20px;
            }
            
            .api-monitor--top-right {
                top: 20px;
                right: 20px;
            }
            
            .api-monitor--top-left {
                top: 20px;
                left: 20px;
            }
            
            .api-monitor--light {
                background: white;
                color: #333;
                border: 1px solid #e0e0e0;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            
            .api-monitor--dark {
                background: #1e1e1e;
                color: #e0e0e0;
                border: 1px solid #444;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            
            .api-monitor__header {
                padding: 10px 15px;
                border-bottom: 1px solid currentColor;
                opacity: 0.2;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                background: rgba(0,0,0,0.02);
            }
            
            .api-monitor--dark .api-monitor__header {
                background: rgba(255,255,255,0.02);
            }
            
            .api-monitor__title {
                font-weight: 600;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .api-monitor__toggle {
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                opacity: 0.6;
                transition: opacity 0.2s;
            }
            
            .api-monitor__toggle:hover {
                opacity: 1;
            }
            
            .api-monitor__body {
                padding: 15px;
                max-height: 400px;
                overflow-y: auto;
                min-width: 320px;
            }
            
            .api-monitor--collapsed .api-monitor__body {
                display: none;
            }
            
            .api-monitor__stats {
                display: grid;
                gap: 12px;
            }
            
            .api-monitor__stat {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                background: rgba(0,0,0,0.02);
                border-radius: 6px;
            }
            
            .api-monitor--dark .api-monitor__stat {
                background: rgba(255,255,255,0.05);
            }
            
            .api-monitor__stat-label {
                font-weight: 500;
                opacity: 0.8;
            }
            
            .api-monitor__stat-value {
                font-weight: 600;
                font-size: 14px;
            }
            
            .api-monitor__stat-value--success {
                color: #10b981;
            }
            
            .api-monitor__stat-value--warning {
                color: #f59e0b;
            }
            
            .api-monitor__stat-value--error {
                color: #ef4444;
            }
            
            .api-monitor__progress {
                margin-top: 12px;
                padding: 12px;
                background: rgba(0,0,0,0.02);
                border-radius: 6px;
            }
            
            .api-monitor--dark .api-monitor__progress {
                background: rgba(255,255,255,0.05);
            }
            
            .api-monitor__progress-bar {
                height: 8px;
                background: rgba(0,0,0,0.1);
                border-radius: 4px;
                overflow: hidden;
                margin-top: 8px;
            }
            
            .api-monitor--dark .api-monitor__progress-bar {
                background: rgba(255,255,255,0.1);
            }
            
            .api-monitor__progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #10b981, #06b6d4);
                border-radius: 4px;
                transition: width 0.5s ease;
            }
            
            .api-monitor__actions {
                margin-top: 15px;
                display: flex;
                gap: 10px;
            }
            
            .api-monitor__button {
                flex: 1;
                padding: 8px 12px;
                border: 1px solid currentColor;
                opacity: 0.2;
                background: transparent;
                color: inherit;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                font-weight: 500;
                transition: all 0.2s;
            }
            
            .api-monitor__button:hover {
                opacity: 0.3;
                transform: translateY(-1px);
            }
            
            .api-monitor__indicator {
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin-right: 4px;
                animation: pulse 2s infinite;
            }
            
            .api-monitor__indicator--active {
                background: #10b981;
            }
            
            .api-monitor__indicator--idle {
                background: #f59e0b;
                animation: none;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            
            .api-monitor__badge {
                display: inline-block;
                padding: 2px 6px;
                background: rgba(16, 185, 129, 0.1);
                color: #10b981;
                border-radius: 3px;
                font-size: 10px;
                font-weight: 600;
                margin-left: 8px;
            }
            
            .api-monitor--dark .api-monitor__badge {
                background: rgba(16, 185, 129, 0.2);
            }
        `;
        
    document.head.appendChild(styles);
  }
    
  attachEvents() {
    // Toggle collapse
    this.container.addEventListener('click', (e) => {
      if (e.target.closest('.api-monitor__header') || e.target.closest('.api-monitor__toggle')) {
        this.toggle();
      }
            
      if (e.target.closest('.api-monitor__button--clear')) {
        this.clearCache();
      }
            
      if (e.target.closest('.api-monitor__button--export')) {
        this.exportStats();
      }
    });
  }
    
  toggle() {
    this.isCollapsed = !this.isCollapsed;
    this.container.classList.toggle('api-monitor--collapsed', this.isCollapsed);
  }
    
  start() {
    if (this.intervalId) return;
        
    this.intervalId = setInterval(() => {
      this.render();
    }, this.options.updateInterval);
  }
    
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
    
  getStats() {
    // Récupérer les stats depuis fetchCompat
    if (window.fetchCompat && typeof window.fetchCompat.getStats === 'function') {
      return window.fetchCompat.getStats();
    }
        
    // Stats par défaut si fetchCompat n'est pas disponible
    return {
      totalRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      apiCalls: 0,
      savedRequests: 0,
      hitRate: 0,
      cacheSize: 0,
      reduction: 0,
      runtime: 0
    };
  }
    
  formatTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  }
    
  formatNumber(num) {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }
    
  render() {
    const stats = this.getStats();
    const isActive = stats.totalRequests > 0;
        
    this.container.innerHTML = `
            <div class="api-monitor__header">
                <div class="api-monitor__title">
                    <span class="api-monitor__indicator api-monitor__indicator--${isActive ? 'active' : 'idle'}"></span>
                    API Monitor
                    ${stats.reduction > 0 ? `<span class="api-monitor__badge">-${stats.reduction}%</span>` : ''}
                </div>
                <div class="api-monitor__toggle">
                    ${this.isCollapsed ? '▶' : '▼'}
                </div>
            </div>
            
            <div class="api-monitor__body">
                <div class="api-monitor__stats">
                    <div class="api-monitor__stat">
                        <span class="api-monitor__stat-label">Total Requests</span>
                        <span class="api-monitor__stat-value">${this.formatNumber(stats.totalRequests)}</span>
                    </div>
                    
                    <div class="api-monitor__stat">
                        <span class="api-monitor__stat-label">Cache Hits</span>
                        <span class="api-monitor__stat-value api-monitor__stat-value--success">
                            ${this.formatNumber(stats.cacheHits)} (${stats.hitRate}%)
                        </span>
                    </div>
                    
                    <div class="api-monitor__stat">
                        <span class="api-monitor__stat-label">API Calls</span>
                        <span class="api-monitor__stat-value api-monitor__stat-value--warning">
                            ${this.formatNumber(stats.apiCalls)}
                        </span>
                    </div>
                    
                    <div class="api-monitor__stat">
                        <span class="api-monitor__stat-label">Saved Requests</span>
                        <span class="api-monitor__stat-value api-monitor__stat-value--success">
                            ${this.formatNumber(stats.savedRequests)}
                        </span>
                    </div>
                    
                    <div class="api-monitor__stat">
                        <span class="api-monitor__stat-label">Cache Size</span>
                        <span class="api-monitor__stat-value">${stats.cacheSize} items</span>
                    </div>
                    
                    <div class="api-monitor__stat">
                        <span class="api-monitor__stat-label">Runtime</span>
                        <span class="api-monitor__stat-value">${this.formatTime(stats.runtime)}</span>
                    </div>
                </div>
                
                ${stats.hitRate > 0 ? `
                    <div class="api-monitor__progress">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span class="api-monitor__stat-label">Cache Efficiency</span>
                            <span class="api-monitor__stat-value api-monitor__stat-value--success">${stats.hitRate}%</span>
                        </div>
                        <div class="api-monitor__progress-bar">
                            <div class="api-monitor__progress-fill" style="width: ${stats.hitRate}%"></div>
                        </div>
                    </div>
                ` : ''}
                
                <div class="api-monitor__actions">
                    <button class="api-monitor__button api-monitor__button--clear">Clear Cache</button>
                    <button class="api-monitor__button api-monitor__button--export">Export Stats</button>
                </div>
            </div>
        `;
  }
    
  clearCache() {
    if (window.fetchCompat && typeof window.fetchCompat.clearCache === 'function') {
      window.fetchCompat.clearCache();
      this.render();
      console.log('[ApiMonitor] Cache cleared');
    }
  }
    
  exportStats() {
    const stats = this.getStats();
    const data = {
      timestamp: new Date().toISOString(),
      ...stats
    };
        
    // Créer un blob CSV
    const csv = this.convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
        
    // Télécharger
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-stats-${Date.now()}.csv`;
    a.click();
        
    URL.revokeObjectURL(url);
    console.log('[ApiMonitor] Stats exported');
  }
    
  convertToCSV(data) {
    const headers = Object.keys(data);
    const values = Object.values(data);
        
    return `${headers.join(',')}\n${values.join(',')}`;
  }
    
  destroy() {
    this.stop();
    if (this.container) {
      this.container.remove();
    }
  }
}

// Auto-initialisation si configuré
if (typeof window !== 'undefined') {
  window.ApiMonitor = ApiMonitor;
    
  // Auto-start si configuré dans les meta tags
  document.addEventListener('DOMContentLoaded', () => {
    const metaAutoStart = document.querySelector('meta[name="api-monitor-autostart"]');
    if (metaAutoStart && metaAutoStart.content === 'true') {
      window.apiMonitor = new ApiMonitor();
    }
  });
}