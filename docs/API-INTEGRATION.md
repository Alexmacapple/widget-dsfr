# Guide d'Intégration API data.economie.gouv.fr

## Vue d'ensemble

Le système d'intégration API centralisé fournit une connexion robuste et performante à l'API data.economie.gouv.fr avec gestion du cache, synchronisation temps réel et monitoring.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Widgets                              │
│  (Tables, Charts, Maps, Forms)                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                     ApiClient                                │
│  • Cache management                                          │
│  • Retry logic                                              │
│  • Error handling                                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  DataSyncService                             │
│  • Real-time updates                                        │
│  • Polling management                                       │
│  • State synchronization                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    ApiMonitor                                │
│  • Performance tracking                                     │
│  • Error monitoring                                         │
│  • Usage analytics                                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              data.economie.gouv.fr API                       │
└──────────────────────────────────────────────────────────────┘
```

## Composants

### 1. ApiClient (`src/api/api-client.js`)

Client API principal pour toutes les requêtes.

#### Fonctionnalités
- ✅ Cache intelligent (5 min par défaut)
- ✅ Retry automatique (3 tentatives)
- ✅ Timeout configurable (10s par défaut)
- ✅ Statistiques de performance
- ✅ Support WebSocket (optionnel)

#### Utilisation basique

```javascript
// Initialisation
const apiClient = new ApiClient({
  cacheTimeout: 300000,      // 5 minutes
  retryAttempts: 3,
  retryDelay: 1000,
  requestTimeout: 10000
});

// Recherche simple
const data = await apiClient.search('signalconso', {
  rows: 20,
  sort: '-creationdate',
  query: 'search term'
});

// Avec facettes
const facets = await apiClient.getFacets('signalconso', [
  'companyregion',
  'status',
  'category'
]);

// Agrégation
const aggregated = await apiClient.aggregate('signalconso', 'region', {
  count: 'sum',
  amount: 'avg'
});
```

### 2. DataSyncService (`src/api/data-sync.js`)

Service de synchronisation pour mises à jour temps réel.

#### Fonctionnalités
- ✅ Polling automatique
- ✅ Détection des changements
- ✅ Gestion état global
- ✅ Reconnexion automatique
- ✅ Mode hors ligne

#### Utilisation

```javascript
// Initialisation
const dataSync = new DataSyncService(apiClient);

// S'abonner aux mises à jour
const subscriptionId = dataSync.subscribe('signalconso', {
  query: { rows: 100 },
  interval: 30000, // 30 secondes
  onUpdate: (data, meta) => {
    console.log('Données mises à jour:', data);
    console.log('Meta:', meta); // { isInitial, hasChanges, dataset }
  }
});

// Écouter les événements globaux
dataSync.addListener(event => {
  switch(event.type) {
    case 'dataUpdate':
      console.log('Mise à jour:', event.dataset);
      break;
    case 'error':
      console.error('Erreur:', event.error);
      break;
    case 'offline':
      console.log('Mode hors ligne');
      break;
    case 'online':
      console.log('Reconnecté');
      break;
  }
});

// Contrôles
dataSync.pauseAll();    // Pause toutes les synchros
dataSync.resumeAll();   // Reprendre
dataSync.syncAll();     // Forcer la synchronisation
```

### 3. ApiMonitor (`src/api/api-monitor.js`)

Monitoring et analytics des appels API.

#### Fonctionnalités
- ✅ Interception automatique des fetch
- ✅ Métriques de performance
- ✅ Alertes configurables
- ✅ Dashboard HTML
- ✅ Export des données

#### Utilisation

```javascript
// Initialisation
const monitor = new ApiMonitor({
  enabled: true,
  maxHistory: 100,
  responseTimeThreshold: 3000,  // 3s
  errorRateThreshold: 0.1,      // 10%
  cacheHitRateThreshold: 0.3    // 30%
});

// Écouter les alertes
monitor.onAlert(alert => {
  console.warn(`Alerte ${alert.type}: ${alert.message}`);
});

// Afficher le dashboard
monitor.renderDashboard('monitor-container');

// Obtenir un rapport
const report = monitor.generateReport();
console.log(report.summary);

// Exporter les métriques
const metrics = monitor.export();
```

## Intégration dans les Widgets

### Exemple : Table avec synchronisation

```html
<!DOCTYPE html>
<html>
<head>
  <title>Table SignalConso</title>
  <link rel="stylesheet" href="dsfr.min.css">
</head>
<body>
  <div id="table-container"></div>
  <div id="monitor-container"></div>
  
  <script src="/src/api/api-client.js"></script>
  <script src="/src/api/data-sync.js"></script>
  <script src="/src/api/api-monitor.js"></script>
  
  <script>
    // Configuration
    const apiClient = new ApiClient();
    const dataSync = new DataSyncService(apiClient);
    const monitor = new ApiMonitor();
    
    // Widget Table
    class SignalConsoTable {
      constructor(container) {
        this.container = container;
        this.subscriptionId = null;
      }
      
      start() {
        // S'abonner aux données
        this.subscriptionId = dataSync.subscribe('signalconso', {
          query: {
            rows: 50,
            sort: '-creationdate'
          },
          interval: 30000,
          onUpdate: this.render.bind(this)
        });
      }
      
      render(data) {
        const html = `
          <table class="fr-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Entreprise</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              ${data.records.map(r => `
                <tr>
                  <td>${r.fields.creationdate}</td>
                  <td>${r.fields.companyname}</td>
                  <td>${r.fields.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
        this.container.innerHTML = html;
      }
      
      stop() {
        if (this.subscriptionId) {
          dataSync.unsubscribe(this.subscriptionId);
        }
      }
    }
    
    // Initialiser
    const table = new SignalConsoTable(
      document.getElementById('table-container')
    );
    table.start();
    
    // Afficher monitoring
    monitor.renderDashboard('monitor-container');
  </script>
</body>
</html>
```

### Exemple : Graphique temps réel

```javascript
class RealtimeChart {
  constructor(canvas) {
    this.chart = new Chart(canvas, {
      type: 'line',
      data: { labels: [], datasets: [] },
      options: { animation: false }
    });
    
    this.startSync();
  }
  
  async startSync() {
    const apiClient = new ApiClient();
    const dataSync = new DataSyncService(apiClient);
    
    dataSync.subscribe('signalconso', {
      query: { rows: 0, facet: 'creationdate' },
      interval: 10000, // 10 secondes
      onUpdate: (data) => {
        this.updateChart(data);
      }
    });
  }
  
  updateChart(data) {
    // Extraire les données temporelles
    const timeSeries = this.processData(data);
    
    // Mettre à jour le graphique
    this.chart.data.labels = timeSeries.labels;
    this.chart.data.datasets[0].data = timeSeries.values;
    this.chart.update('none');
  }
}
```

## Patterns et Bonnes Pratiques

### 1. Gestion des erreurs

```javascript
try {
  const data = await apiClient.search('signalconso');
  // Traiter les données
} catch (error) {
  // Afficher erreur utilisateur
  showError('Impossible de charger les données');
  
  // Logger pour monitoring
  console.error('API Error:', error);
  
  // Utiliser données en cache si disponible
  const cached = apiClient.getFromCache(cacheKey);
  if (cached) {
    useBackupData(cached);
  }
}
```

### 2. Optimisation des performances

```javascript
// Batch des requêtes
const promises = datasets.map(dataset => 
  apiClient.search(dataset, { rows: 10 })
);
const results = await Promise.all(promises);

// Utiliser le cache agressivement
const data = await apiClient.search('signalconso', {
  rows: 100,
  noCache: false // Utiliser le cache
});

// Limiter le polling
dataSync.setDefaultInterval(60000); // 1 minute minimum
```

### 3. Mode hors ligne

```javascript
dataSync.addListener(event => {
  if (event.type === 'offline') {
    // Basculer en mode hors ligne
    showOfflineIndicator();
    useLocalStorage();
  } else if (event.type === 'online') {
    // Resynchroniser
    hideOfflineIndicator();
    syncWithServer();
  }
});
```

## Configuration Avancée

### Variables d'environnement

```javascript
const config = {
  API_BASE_URL: process.env.API_URL || 'https://data.economie.gouv.fr/api',
  CACHE_TIMEOUT: parseInt(process.env.CACHE_TIMEOUT) || 300000,
  RETRY_ATTEMPTS: parseInt(process.env.RETRY_ATTEMPTS) || 3,
  POLLING_INTERVAL: parseInt(process.env.POLLING_INTERVAL) || 30000
};

const apiClient = new ApiClient(config);
```

### Intercepteurs personnalisés

```javascript
// Ajouter headers d'authentification
apiClient.addInterceptor('request', (config) => {
  config.headers['X-API-Key'] = 'your-api-key';
  return config;
});

// Logger toutes les réponses
apiClient.addInterceptor('response', (response) => {
  console.log(`API Response: ${response.status}`);
  return response;
});
```

## Troubleshooting

### Problèmes courants

| Problème | Cause | Solution |
|----------|-------|----------|
| Timeout fréquents | Réseau lent | Augmenter `requestTimeout` |
| Cache hits faibles | Timeout trop court | Augmenter `cacheTimeout` |
| Données obsolètes | Polling trop lent | Réduire `interval` |
| Trop de requêtes | Pas de cache | Activer cache, augmenter timeout |
| Erreurs 429 | Rate limiting | Implémenter backoff exponentiel |

### Debug

```javascript
// Activer logs détaillés
apiClient.debug = true;
dataSync.debug = true;

// Inspecter les stats
console.log('API Stats:', apiClient.getStats());
console.log('Sync Status:', dataSync.getStatus());
console.log('Monitor Report:', monitor.generateReport());

// Vider le cache
apiClient.clearCache();

// Réinitialiser monitoring
monitor.reset();
```

## Tests

### Tests unitaires

```bash
npm test tests/api-client.test.js
```

### Tests d'intégration

```bash
# Avec l'API réelle
SKIP_INTEGRATION_TESTS=false npm test

# Tests E2E Playwright
npx playwright test tests/e2e/api-integration.spec.js
```

## Performance

### Métriques clés

- **Temps de réponse moyen** : < 500ms (cache), < 2s (API)
- **Taux de cache** : > 30%
- **Taux d'erreur** : < 1%
- **Utilisation mémoire** : < 50MB

### Optimisations

1. **Cache stratégique** : Cache plus long pour données stables
2. **Pagination** : Limiter `rows` au nécessaire
3. **Facettes sélectives** : Ne demander que les facettes utilisées
4. **Compression** : Activer gzip sur le serveur
5. **CDN** : Utiliser un CDN pour assets statiques

## Sécurité

### Bonnes pratiques

- ✅ Pas de credentials dans le code
- ✅ HTTPS obligatoire
- ✅ Validation des entrées
- ✅ Échappement des sorties
- ✅ Rate limiting côté client
- ✅ Timeout sur toutes les requêtes

## Ressources

- [API data.economie.gouv.fr](https://data.economie.gouv.fr/api)
- [Documentation ODS](https://help.opendatasoft.com/apis/ods-search-v2/)
- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API)