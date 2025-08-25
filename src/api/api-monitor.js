/**
 * Service de monitoring des appels API
 * Surveille les performances, erreurs et utilisation
 */

class ApiMonitor {
  constructor(options = {}) {
    this.enabled = options.enabled !== false;
    this.maxHistory = options.maxHistory || 100;
    this.alertThresholds = {
      responseTime: options.responseTimeThreshold || 3000, // 3s
      errorRate: options.errorRateThreshold || 0.1, // 10%
      cacheHitRate: options.cacheHitRateThreshold || 0.3 // 30%
    };
    
    // Historique des requêtes
    this.requestHistory = [];
    
    // Métriques en temps réel
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      cacheHits: 0,
      totalResponseTime: 0,
      dataTransferred: 0,
      requestsByEndpoint: new Map(),
      errorsByType: new Map(),
      performanceByHour: new Array(24).fill(null).map(() => ({
        requests: 0,
        avgResponseTime: 0,
        errors: 0
      }))
    };
    
    // Alertes
    this.alerts = [];
    this.alertCallbacks = new Set();
    
    // Dashboard HTML element
    this.dashboardElement = null;
    
    this.startMonitoring();
  }

  /**
   * Démarre le monitoring
   */
  startMonitoring() {
    if (!this.enabled) return;
    
    // Intercepter fetch pour monitoring
    this.interceptFetch();
    
    // Mise à jour périodique des métriques
    this.metricsInterval = setInterval(() => {
      this.updateHourlyMetrics();
      this.checkAlerts();
    }, 60000); // Chaque minute
  }

  /**
   * Intercepte les appels fetch
   */
  interceptFetch() {
    const originalFetch = window.fetch;
    const monitor = this;
    
    window.fetch = function(...args) {
      const startTime = performance.now();
      const url = args[0];
      const method = args[1]?.method || 'GET';
      
      return originalFetch.apply(this, args)
        .then(response => {
          const endTime = performance.now();
          const duration = endTime - startTime;
          
          monitor.recordRequest({
            url,
            method,
            status: response.status,
            duration,
            success: response.ok,
            size: parseInt(response.headers.get('content-length') || 0),
            cached: response.headers.get('x-cache') === 'HIT',
            timestamp: new Date()
          });
          
          return response;
        })
        .catch(error => {
          const endTime = performance.now();
          const duration = endTime - startTime;
          
          monitor.recordRequest({
            url,
            method,
            status: 0,
            duration,
            success: false,
            error: error.message,
            timestamp: new Date()
          });
          
          throw error;
        });
    };
  }

  /**
   * Enregistre une requête
   */
  recordRequest(request) {
    if (!this.enabled) return;
    
    // Ajouter à l'historique
    this.requestHistory.push(request);
    if (this.requestHistory.length > this.maxHistory) {
      this.requestHistory.shift();
    }
    
    // Mettre à jour les métriques
    this.metrics.totalRequests++;
    
    if (request.success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
      
      const errorType = request.error || `HTTP ${request.status}`;
      this.metrics.errorsByType.set(
        errorType,
        (this.metrics.errorsByType.get(errorType) || 0) + 1
      );
    }
    
    if (request.cached) {
      this.metrics.cacheHits++;
    }
    
    this.metrics.totalResponseTime += request.duration;
    this.metrics.dataTransferred += request.size || 0;
    
    // Métriques par endpoint
    const endpoint = this.extractEndpoint(request.url);
    const endpointMetrics = this.metrics.requestsByEndpoint.get(endpoint) || {
      count: 0,
      avgDuration: 0,
      errors: 0
    };
    
    endpointMetrics.count++;
    endpointMetrics.avgDuration = 
      (endpointMetrics.avgDuration * (endpointMetrics.count - 1) + request.duration) / 
      endpointMetrics.count;
    
    if (!request.success) {
      endpointMetrics.errors++;
    }
    
    this.metrics.requestsByEndpoint.set(endpoint, endpointMetrics);
    
    // Vérifier les seuils
    if (request.duration > this.alertThresholds.responseTime) {
      this.createAlert('performance', `Temps de réponse élevé: ${request.duration.toFixed(0)}ms pour ${endpoint}`);
    }
  }

  /**
   * Extrait l'endpoint d'une URL
   */
  extractEndpoint(url) {
    try {
      const parsed = new URL(url);
      return parsed.pathname;
    } catch {
      return url;
    }
  }

  /**
   * Met à jour les métriques horaires
   */
  updateHourlyMetrics() {
    const hour = new Date().getHours();
    const recentRequests = this.requestHistory.filter(r => 
      new Date() - r.timestamp < 3600000 // Dernière heure
    );
    
    this.metrics.performanceByHour[hour] = {
      requests: recentRequests.length,
      avgResponseTime: recentRequests.length > 0 
        ? recentRequests.reduce((sum, r) => sum + r.duration, 0) / recentRequests.length
        : 0,
      errors: recentRequests.filter(r => !r.success).length
    };
  }

  /**
   * Vérifie les alertes
   */
  checkAlerts() {
    const errorRate = this.getErrorRate();
    const cacheHitRate = this.getCacheHitRate();
    const avgResponseTime = this.getAverageResponseTime();
    
    if (errorRate > this.alertThresholds.errorRate) {
      this.createAlert('error', `Taux d'erreur élevé: ${(errorRate * 100).toFixed(1)}%`);
    }
    
    if (cacheHitRate < this.alertThresholds.cacheHitRate) {
      this.createAlert('cache', `Taux de cache faible: ${(cacheHitRate * 100).toFixed(1)}%`);
    }
    
    if (avgResponseTime > this.alertThresholds.responseTime) {
      this.createAlert('performance', `Temps de réponse moyen élevé: ${avgResponseTime.toFixed(0)}ms`);
    }
  }

  /**
   * Crée une alerte
   */
  createAlert(type, message) {
    const alert = {
      type,
      message,
      timestamp: new Date(),
      id: Date.now()
    };
    
    this.alerts.push(alert);
    
    // Garder seulement les 50 dernières alertes
    if (this.alerts.length > 50) {
      this.alerts.shift();
    }
    
    // Notifier les callbacks
    this.alertCallbacks.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Alert callback error:', error);
      }
    });
  }

  /**
   * Ajoute un callback d'alerte
   */
  onAlert(callback) {
    this.alertCallbacks.add(callback);
    return () => this.alertCallbacks.delete(callback);
  }

  /**
   * Obtient le taux d'erreur
   */
  getErrorRate() {
    if (this.metrics.totalRequests === 0) return 0;
    return this.metrics.failedRequests / this.metrics.totalRequests;
  }

  /**
   * Obtient le taux de cache
   */
  getCacheHitRate() {
    if (this.metrics.totalRequests === 0) return 0;
    return this.metrics.cacheHits / this.metrics.totalRequests;
  }

  /**
   * Obtient le temps de réponse moyen
   */
  getAverageResponseTime() {
    if (this.metrics.totalRequests === 0) return 0;
    return this.metrics.totalResponseTime / this.metrics.totalRequests;
  }

  /**
   * Génère un rapport
   */
  generateReport() {
    const report = {
      summary: {
        totalRequests: this.metrics.totalRequests,
        successRate: ((this.metrics.successfulRequests / this.metrics.totalRequests) * 100).toFixed(1) + '%',
        errorRate: (this.getErrorRate() * 100).toFixed(1) + '%',
        cacheHitRate: (this.getCacheHitRate() * 100).toFixed(1) + '%',
        avgResponseTime: this.getAverageResponseTime().toFixed(0) + 'ms',
        dataTransferred: this.formatBytes(this.metrics.dataTransferred)
      },
      endpoints: Array.from(this.metrics.requestsByEndpoint.entries())
        .map(([endpoint, metrics]) => ({
          endpoint,
          requests: metrics.count,
          avgDuration: metrics.avgDuration.toFixed(0) + 'ms',
          errorRate: ((metrics.errors / metrics.count) * 100).toFixed(1) + '%'
        }))
        .sort((a, b) => b.requests - a.requests),
      errors: Array.from(this.metrics.errorsByType.entries())
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count),
      recentAlerts: this.alerts.slice(-10).reverse(),
      hourlyPerformance: this.metrics.performanceByHour.map((data, hour) => ({
        hour: `${hour}:00`,
        ...data
      }))
    };
    
    return report;
  }

  /**
   * Affiche le dashboard de monitoring
   */
  renderDashboard(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const report = this.generateReport();
    
    container.innerHTML = `
      <div class="api-monitor-dashboard">
        <h3>Monitoring API</h3>
        
        <div class="monitor-stats">
          <div class="stat">
            <span class="stat-label">Requêtes totales</span>
            <span class="stat-value">${report.summary.totalRequests}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Taux de succès</span>
            <span class="stat-value">${report.summary.successRate}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Temps moyen</span>
            <span class="stat-value">${report.summary.avgResponseTime}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Cache hits</span>
            <span class="stat-value">${report.summary.cacheHitRate}</span>
          </div>
        </div>
        
        <div class="monitor-endpoints">
          <h4>Top Endpoints</h4>
          <table>
            <thead>
              <tr>
                <th>Endpoint</th>
                <th>Requêtes</th>
                <th>Temps moy.</th>
                <th>Erreurs</th>
              </tr>
            </thead>
            <tbody>
              ${report.endpoints.slice(0, 5).map(e => `
                <tr>
                  <td>${e.endpoint}</td>
                  <td>${e.requests}</td>
                  <td>${e.avgDuration}</td>
                  <td>${e.errorRate}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        ${report.recentAlerts.length > 0 ? `
          <div class="monitor-alerts">
            <h4>Alertes récentes</h4>
            <ul>
              ${report.recentAlerts.map(a => `
                <li class="alert-${a.type}">
                  ${a.message} - ${new Date(a.timestamp).toLocaleTimeString()}
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
      
      <style>
        .api-monitor-dashboard {
          font-family: system-ui, -apple-system, sans-serif;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 0.5rem;
        }
        .monitor-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin: 1rem 0;
        }
        .stat {
          background: white;
          padding: 1rem;
          border-radius: 0.25rem;
          text-align: center;
        }
        .stat-label {
          display: block;
          color: #666;
          font-size: 0.875rem;
        }
        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
          color: #000091;
          margin-top: 0.5rem;
        }
        .monitor-endpoints table {
          width: 100%;
          background: white;
          border-collapse: collapse;
        }
        .monitor-endpoints th,
        .monitor-endpoints td {
          padding: 0.5rem;
          border-bottom: 1px solid #e5e5e5;
          text-align: left;
        }
        .monitor-alerts {
          margin-top: 1rem;
        }
        .monitor-alerts ul {
          list-style: none;
          padding: 0;
        }
        .monitor-alerts li {
          padding: 0.5rem;
          margin: 0.25rem 0;
          border-radius: 0.25rem;
        }
        .alert-error { background: #fee9e7; }
        .alert-performance { background: #fff4e6; }
        .alert-cache { background: #e8f5ff; }
      </style>
    `;
  }

  /**
   * Formate les bytes
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Réinitialise les métriques
   */
  reset() {
    this.requestHistory = [];
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      cacheHits: 0,
      totalResponseTime: 0,
      dataTransferred: 0,
      requestsByEndpoint: new Map(),
      errorsByType: new Map(),
      performanceByHour: new Array(24).fill(null).map(() => ({
        requests: 0,
        avgResponseTime: 0,
        errors: 0
      }))
    };
    this.alerts = [];
  }

  /**
   * Arrête le monitoring
   */
  stop() {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
    this.enabled = false;
  }

  /**
   * Exporte les métriques
   */
  export() {
    return {
      metrics: this.metrics,
      history: this.requestHistory,
      alerts: this.alerts,
      report: this.generateReport()
    };
  }
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApiMonitor;
} else {
  window.ApiMonitor = ApiMonitor;
}