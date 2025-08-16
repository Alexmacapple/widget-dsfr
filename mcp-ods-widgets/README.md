# MCP ODS Widgets - Intégration OpenDataSoft x DSFR

## 🎯 Objectif

Ce MCP (Model Context Protocol) permet l'intégration transparente des widgets OpenDataSoft avec le Design System France (DSFR), offrant une solution clé en main pour créer des tableaux de bord gouvernementaux conformes et accessibles.

## ✨ Fonctionnalités

- **🔄 Transformation automatique** : Conversion des widgets ODS en composants DSFR
- **🎨 Thématisation DSFR** : Application automatique des styles et couleurs officiels
- **📊 Widgets supportés** : Table, Chart, Map, Facets, KPI, Timeline, Calendar
- **♿ Accessibilité RGAA** : Conformité niveau AA garantie
- **🌙 Mode sombre** : Support natif du thème sombre DSFR
- **📱 Responsive** : Adaptation automatique mobile/tablet/desktop

## 🚀 Installation rapide

### 1. Cloner le repository

```bash
git clone https://github.com/gouv-fr/mcp-ods-widgets.git
cd mcp-ods-widgets
npm install
```

### 2. Configurer dans Claude

Ajouter dans `.mcp.json` :

```json
{
  "mcpServers": {
    "ods-widgets": {
      "command": "node",
      "args": ["./mcp-ods-widgets/src/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### 3. Utiliser dans Claude

```javascript
// Créer un widget table DSFR
const widget = await mcp__ods_widgets__create_widget({
  type: 'table',
  dataset: 'signalconso',
  theme: 'dsfr'
});
```

## 📚 Documentation

- [API complète](docs/API.md)
- [Exemples d'intégration](examples/)
- [Guide DSFR](https://www.systeme-de-design.gouv.fr/)

## 🏗️ Architecture

```
mcp-ods-widgets/
├── src/
│   ├── index.js           # Serveur MCP principal
│   ├── widgets/           # Générateurs de widgets
│   ├── adapters/          # Adaptateurs DSFR
│   └── utils/             # Analyseurs et recommandeurs
├── examples/              # Exemples d'utilisation
└── docs/                  # Documentation
```

## 🔧 Widgets disponibles

### Table
Tableau de données avec tri, pagination et recherche
```javascript
{ type: 'table', options: { pagination: true, search: true }}
```

### Chart
Graphiques (colonnes, lignes, camembert, aires)
```javascript
{ type: 'chart', options: { chartType: 'column', xAxis: 'date' }}
```

### Map
Carte interactive avec clustering
```javascript
{ type: 'map', options: { clustering: true, basemap: 'jawg.light' }}
```

### Facets
Filtres à facettes style DSFR
```javascript
{ type: 'facets', options: { layout: 'sidemenu', showCount: true }}
```

### KPI
Indicateurs clés de performance
```javascript
{ type: 'kpi', options: { showTrend: true, layout: 'grid' }}
```

## 🎨 Personnalisation

### Variables CSS DSFR

Le MCP applique automatiquement les variables CSS DSFR :

```css
:root {
  --primary: #0063cb;      /* Bleu France */
  --secondary: #e1000f;    /* Rouge Marianne */
  --background: #f6f6f6;   /* Gris clair */
  --text: #161616;         /* Noir texte */
}
```

### Mode sombre

Support automatique avec `data-fr-theme="dark"` :

```html
<body data-fr-theme="dark">
  <!-- Widgets adaptés automatiquement -->
</body>
```

## 📊 Datasets supportés

Optimisé pour les datasets gouvernementaux :

- **SignalConso** : Signalements consommateurs
- **Budget Vert** : PLF 2025
- **DGCCRF** : Annuaire services déconcentrés
- **Tarifs Bancaires** : Comparatif CCSF
- **Taux de Change** : DGFIP

## 🔍 Analyse automatique

Le MCP analyse automatiquement les datasets pour recommander les meilleurs widgets :

```javascript
const analysis = await mcp__ods_widgets__analyze_dataset({
  dataset: 'signalconso'
});

// Retourne :
// - Types de données détectés
// - Widgets recommandés avec score
// - Configuration optimale
```

## 🚦 Roadmap

- [x] Phase 1 : Widgets de base (Table, Chart, Map)
- [x] Phase 2 : Thématisation DSFR
- [x] Phase 3 : Analyse et recommandations
- [ ] Phase 4 : Templates avancés
- [ ] Phase 5 : Export et partage
- [ ] Phase 6 : Intégration Drupal native

## 🤝 Contribution

Les contributions sont bienvenues ! Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour les guidelines.

## 📜 Licence

MIT - Ministère de l'Économie

## 🆘 Support

- **Issues** : [GitHub Issues](https://github.com/gouv-fr/mcp-ods-widgets/issues)
- **Email** : support-widgets@economie.gouv.fr
- **Documentation DSFR** : [systeme-de-design.gouv.fr](https://www.systeme-de-design.gouv.fr/)

## 🏆 Crédits

Développé par le Ministère de l'Économie, des Finances et de la Souveraineté industrielle et numérique.

---

*Ce projet fait partie de l'initiative de modernisation des outils numériques de l'État français.*