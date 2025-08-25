# 📚 Guide de Déploiement Production - Widget DSFR

## 🎯 Vue d'ensemble

Ce guide détaille le déploiement en production des widgets DSFR avec le système API centralisé pour une intégration dans Drupal ou tout autre CMS.

## 📋 Pré-requis

- ✅ Node.js 18+ (pour le build uniquement)
- ✅ Serveur web (Apache/Nginx)
- ✅ Accès CDN ou serveur de fichiers statiques
- ✅ HTTPS obligatoire en production

## 🚀 Déploiement Express (5 minutes)

### 1. Build des assets

```bash
# Cloner le projet
git clone <votre-repo>
cd widget-dsfr

# Installer les dépendances
npm install

# Créer les bundles optimisés
npm run build

# Les fichiers sont dans dist/
# - api-bundle-complete.min.js (21KB)
# - api-bundle.min.js (Bundle sans wrapper)
```

### 2. Upload sur votre serveur

```bash
# Structure recommandée sur le serveur
/var/www/html/
├── assets/
│   ├── js/
│   │   └── api-bundle-complete.min.js
│   ├── css/
│   │   └── custom-dsfr.css (optionnel)
│   └── widgets/
│       ├── signalconso-dashboard.html
│       └── ... (vos widgets)
```

### 3. Intégration dans votre page

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <!-- DSFR CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.min.css">
    
    <!-- Bundle API (une seule ligne !) -->
    <script src="/assets/js/api-bundle-complete.min.js"></script>
</head>
<body>
    <!-- Vos widgets ici -->
    <div id="widget-signalconso"></div>
    
    <script>
        // Le cache et monitoring sont automatiques !
        // Juste faire vos appels API normalement
        fetch('https://data.economie.gouv.fr/api/...')
            .then(response => response.json())
            .then(data => {
                // Vos données avec cache automatique
            });
    </script>
</body>
</html>
```

## 🔧 Configuration Production

### Variables d'environnement (.env)

```bash
# Créer un fichier .env à la racine
API_BASE_URL=https://data.economie.gouv.fr
CACHE_DURATION=300000  # 5 minutes
ENABLE_MONITORING=true
DEBUG_MODE=false
```

### Configuration JavaScript

```javascript
// Dans votre HTML ou JS principal
<script>
    // Configuration globale
    window.API_CONFIG = {
        baseURL: 'https://data.economie.gouv.fr',
        cacheDuration: 5 * 60 * 1000, // 5 minutes
        enableMonitoring: false, // Désactiver en prod
        debug: false
    };
    
    // Appliquer la config
    if (window.apiClient) {
        window.apiClient.config = Object.assign(
            window.apiClient.config,
            window.API_CONFIG
        );
    }
</script>
```

## 🌐 Configuration Serveur Web

### Apache (.htaccess)

```apache
# Compression Gzip
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json
</IfModule>

# Cache navigateur (1 semaine pour les assets)
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/javascript "access plus 1 week"
    ExpiresByType application/javascript "access plus 1 week"
    ExpiresByType text/css "access plus 1 week"
</IfModule>

# CORS pour les API
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
</IfModule>
```

### Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name votre-domaine.fr;
    
    # Compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/javascript application/json;
    
    # Cache navigateur
    location ~* \.(js|css)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
    
    # CORS
    location /api {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
    }
    
    # Fichiers statiques
    location /assets {
        alias /var/www/html/assets;
    }
}
```

## 📦 Intégration CDN

### Option 1: CDN Public (jsDelivr)

```html
<!-- Utiliser jsDelivr pour servir depuis GitHub -->
<script src="https://cdn.jsdelivr.net/gh/votre-username/widget-dsfr@latest/dist/api-bundle-complete.min.js"></script>
```

### Option 2: CDN Privé (CloudFlare/AWS)

```bash
# Upload vers S3
aws s3 cp dist/api-bundle-complete.min.js s3://votre-bucket/assets/js/

# Ou CloudFlare
# Configurer dans le dashboard CloudFlare
```

### Configuration CDN recommandée

```javascript
// Headers à configurer sur le CDN
Cache-Control: public, max-age=604800, immutable
Content-Type: application/javascript
Content-Encoding: gzip
```

## 🔌 Intégration Drupal

### 1. Module Custom

Créer un module Drupal `widget_dsfr`:

```php
// widget_dsfr.module
<?php

/**
 * Implements hook_page_attachments().
 */
function widget_dsfr_page_attachments(array &$attachments) {
  // Ajouter le bundle API sur toutes les pages
  $attachments['#attached']['library'][] = 'widget_dsfr/api-bundle';
}

/**
 * Implements hook_theme().
 */
function widget_dsfr_theme() {
  return [
    'widget_signalconso' => [
      'variables' => [
        'dataset' => 'signalconso',
        'limit' => 20,
      ],
    ],
  ];
}
```

### 2. Libraries (widget_dsfr.libraries.yml)

```yaml
api-bundle:
  version: 1.0.0
  js:
    /libraries/widget-dsfr/dist/api-bundle-complete.min.js: { minified: true, preprocess: false }
  dependencies:
    - core/drupal
```

### 3. Template Twig

```twig
{# widget-signalconso.html.twig #}
<div id="widget-signalconso-{{ dataset }}" class="widget-container">
  <div class="loading">Chargement...</div>
</div>

<script>
(function() {
  // Utilise automatiquement le cache grâce au bundle
  fetch('https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/{{ dataset }}/records?limit={{ limit }}')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('widget-signalconso-{{ dataset }}');
      // Afficher les données
      container.innerHTML = `
        <h2>${data.total_count} signalements</h2>
        <table class="fr-table">
          ${data.results.map(r => `
            <tr>
              <td>${r.fields.category}</td>
              <td>${r.fields.reg_name}</td>
            </tr>
          `).join('')}
        </table>
      `;
    });
})();
</script>
```

## 🚦 GitHub Actions CI/CD

Créer `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: |
        npm test
        npm run validate
        
    - name: Build bundles
      run: npm run build
      
    - name: Upload artifacts
      uses: actions/upload-artifact@v3
      with:
        name: dist-files
        path: dist/
        
    - name: Deploy to Server
      if: github.ref == 'refs/heads/main'
      uses: appleboy/scp-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        source: "dist/*"
        target: "/var/www/html/assets/"
```

## 📊 Monitoring Production

### 1. Analytics personnalisés

```javascript
// Ajouter dans votre page
if (window.apiClient) {
    // Logger les métriques
    setInterval(() => {
        const stats = apiClient.getStats();
        
        // Envoyer à votre système d'analytics
        if (window.gtag) {
            gtag('event', 'api_performance', {
                'cache_hit_rate': stats.cacheHitRate,
                'total_requests': stats.requests,
                'average_time': stats.averageResponseTime
            });
        }
        
        // Ou Matomo
        if (window._paq) {
            _paq.push(['trackEvent', 'API', 'Performance', 'CacheHitRate', stats.cacheHitRate]);
        }
    }, 60000); // Toutes les minutes
}
```

### 2. Monitoring visuel (dev uniquement)

```javascript
// Activer uniquement en développement
if (window.location.hostname === 'localhost' || window.location.hostname === 'dev.votre-site.fr') {
    new ApiMonitor({ 
        position: 'bottom-right',
        collapsed: true 
    });
}
```

## ✅ Checklist de Mise en Production

### Avant le déploiement

- [ ] Tests passent à 100% (`npm test`)
- [ ] Validation DSFR OK (`npm run validate`)
- [ ] Bundle créé (`npm run build`)
- [ ] Taille bundle < 25KB
- [ ] Configuration production dans `.env`
- [ ] HTTPS configuré sur le serveur
- [ ] Headers de cache configurés
- [ ] CORS configuré si nécessaire

### Déploiement

- [ ] Upload des fichiers dist/
- [ ] Vérifier les permissions (644 pour les fichiers)
- [ ] Tester une page avec le widget
- [ ] Vérifier le cache fonctionne (DevTools)
- [ ] Monitoring des erreurs JS

### Après déploiement

- [ ] Surveiller les logs serveur
- [ ] Vérifier les métriques de performance
- [ ] Tester sur mobile
- [ ] Valider l'accessibilité
- [ ] Documentation mise à jour

## 🔍 Debugging

### Vérifier que le cache fonctionne

```javascript
// Dans la console du navigateur
console.log(window.apiClient.getStats());
// Doit montrer cacheHitRate > 0 après quelques requêtes

// Voir le cache localStorage
Object.keys(localStorage)
  .filter(k => k.startsWith('api_cache_'))
  .forEach(k => console.log(k, JSON.parse(localStorage[k])));
```

### Activer les logs

```javascript
// Temporairement en production
window.apiClient.config.debug = true;
window.fetchCompat.configure({ debug: true });
```

### Vider le cache

```javascript
// Si nécessaire
window.apiClient.clearCache();
window.fetchCompat.clearCache();
```

## 🚨 Troubleshooting

| Problème | Solution |
|----------|----------|
| Bundle ne se charge pas | Vérifier le path et les permissions |
| Cache ne fonctionne pas | Vérifier localStorage n'est pas bloqué |
| CORS errors | Configurer les headers sur le serveur |
| Performance lente | Augmenter cacheDuration |
| Quota localStorage dépassé | Le système nettoie automatiquement |

## 📞 Support

- Documentation : `/API-README.md`
- Exemples : `/examples/`
- Tests : `http://votre-site.fr/test-api-monitor.html`

---

*Version 1.0.0 - Guide de déploiement production*