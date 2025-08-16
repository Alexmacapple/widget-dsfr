# API MCP ODS Widgets

## Vue d'ensemble

Le MCP ODS Widgets fournit une interface unifiée pour créer des widgets OpenDataSoft avec le thème DSFR (Design System France).

## Installation

```bash
npm install @gouv-fr/mcp-ods-widgets
```

## Configuration dans Claude

Ajoutez dans votre fichier `.mcp.json` ou `settings.local.json` :

```json
{
  "mcpServers": {
    "ods-widgets": {
      "command": "node",
      "args": ["/path/to/mcp-ods-widgets/src/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

## Fonctions disponibles

### 1. create_widget

Crée un widget ODS avec thème DSFR.

#### Paramètres

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `type` | string | ✅ | Type de widget : `table`, `chart`, `map`, `facets`, `kpi` |
| `dataset` | string | ✅ | ID du dataset OpenDataSoft |
| `domain` | string | ❌ | Domaine ODS (défaut: `data.economie.gouv.fr`) |
| `theme` | string | ❌ | Thème à appliquer : `dsfr` ou `classic` (défaut: `dsfr`) |
| `options` | object | ❌ | Options spécifiques au widget |

#### Options par type de widget

##### Table
```javascript
{
  pagination: true,        // Activer la pagination
  pageSize: 20,           // Nombre de lignes par page
  search: true,           // Barre de recherche
  export: true,           // Boutons d'export
  fields: ['field1'],     // Champs à afficher
  sort: '-date'          // Tri par défaut
}
```

##### Chart
```javascript
{
  chartType: 'column',    // Type: column, line, pie, area
  xAxis: 'date',         // Champ axe X
  yAxis: 'value',        // Champ axe Y
  function: 'COUNT',     // Fonction: COUNT, SUM, AVG, MIN, MAX
  maxPoints: 20,         // Nombre max de points
  height: 400,           // Hauteur en pixels
  colors: ['#0063cb']    // Couleurs personnalisées
}
```

##### Map
```javascript
{
  height: 500,           // Hauteur en pixels
  location: '12,46.5,2.5', // Zoom initial (zoom,lat,lon)
  basemap: 'jawg.light', // Fond de carte
  clustering: true,      // Regroupement des points
  geoField: 'geo_point', // Champ géographique
  popupFields: ['name']  // Champs dans popup
}
```

##### Facets
```javascript
{
  facets: [              // Liste des facettes
    {
      field: 'category',
      label: 'Catégorie',
      disjunctive: true
    }
  ],
  layout: 'sidemenu',    // Layout: sidemenu ou inline
  showCount: true,       // Afficher les compteurs
  maxItems: 10          // Nombre max d'items par facette
}
```

##### KPI
```javascript
{
  kpis: [                // Liste des KPIs
    {
      field: 'amount',
      function: 'SUM',
      label: 'Total',
      icon: 'fr-icon-bar-chart-box-line'
    }
  ],
  layout: 'grid',        // Layout: grid ou list
  showTrend: true       // Afficher les tendances
}
```

#### Exemple d'utilisation

```javascript
// Dans Claude
const result = await mcp__ods_widgets__create_widget({
  type: 'table',
  dataset: 'signalconso',
  theme: 'dsfr',
  options: {
    pagination: true,
    search: true,
    fields: ['date_creation', 'nom_etablissement', 'categorie', 'ville']
  }
});
```

### 2. analyze_dataset

Analyse un dataset et recommande les widgets appropriés.

#### Paramètres

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `dataset` | string | ✅ | ID du dataset à analyser |
| `domain` | string | ❌ | Domaine ODS (défaut: `data.economie.gouv.fr`) |

#### Réponse

```javascript
{
  dataset: 'signalconso',
  title: 'SignalConso',
  recordsCount: 10000,
  fields: {
    totalFields: 15,
    textFields: [...],
    numberFields: [...],
    dateFields: [...],
    geoFields: [...],
    categoryFields: [...]
  },
  recommendations: [
    {
      widget: 'table',
      reason: 'Affichage détaillé des données',
      score: 100,
      config: {...}
    },
    {
      widget: 'map',
      reason: 'Données géographiques disponibles',
      score: 95,
      config: {...}
    }
  ],
  facets: [...],
  geoEnabled: true,
  timeEnabled: true
}
```

### 3. generate_template

Génère un template HTML complet avec widgets intégrés.

#### Paramètres

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `templateName` | string | ✅ | Type de template : `dashboard`, `search`, `detail`, `comparison` |
| `dataset` | string | ✅ | ID du dataset |
| `widgets` | array | ❌ | Liste des widgets à inclure |

#### Templates disponibles

- **dashboard** : Tableau de bord complet avec KPIs, graphiques, carte et table
- **search** : Interface de recherche avec filtres et résultats
- **detail** : Vue détaillée d'un enregistrement
- **comparison** : Comparaison de données

#### Exemple

```javascript
const template = await mcp__ods_widgets__generate_template({
  templateName: 'dashboard',
  dataset: 'signalconso',
  widgets: ['kpi', 'chart', 'map', 'table']
});
```

## Intégration avec le Widget Builder

Le MCP peut être utilisé directement dans le Widget Builder Pro V2 :

```javascript
// Dans widget-builder-controller.js
$scope.generateWithMCP = async function() {
  const widget = await mcp__ods_widgets__create_widget({
    type: $scope.selectedWidgetType,
    dataset: $scope.selectedDataset,
    options: $scope.widgetOptions
  });
  
  $scope.generatedCode = widget.html;
};
```

## Styles CSS personnalisés

Le MCP applique automatiquement les variables CSS DSFR :

```css
--primary: #0063cb;        /* Bleu France */
--secondary: #e1000f;      /* Rouge Marianne */
--success: #18753c;        /* Vert succès */
--warning: #b34000;        /* Orange avertissement */
--error: #ce0500;          /* Rouge erreur */
```

## Support du mode sombre

Les widgets supportent automatiquement le mode sombre DSFR :

```html
<body data-fr-theme="dark">
  <!-- Les widgets s'adaptent automatiquement -->
</body>
```

## Exemples complets

### Dashboard complet

```javascript
// 1. Analyser le dataset
const analysis = await mcp__ods_widgets__analyze_dataset({
  dataset: 'signalconso'
});

// 2. Créer les widgets recommandés
for (const recommendation of analysis.recommendations) {
  const widget = await mcp__ods_widgets__create_widget({
    type: recommendation.widget,
    dataset: 'signalconso',
    options: recommendation.config
  });
  
  // Insérer le widget dans la page
  document.getElementById(`widget-${recommendation.widget}`).innerHTML = widget.html;
}

// 3. Ou générer un template complet
const dashboard = await mcp__ods_widgets__generate_template({
  templateName: 'dashboard',
  dataset: 'signalconso'
});
```

### Widget embarqué

```javascript
// Créer un widget autonome pour Drupal
const embeddedWidget = await mcp__ods_widgets__create_widget({
  type: 'table',
  dataset: 'signalconso',
  theme: 'dsfr',
  options: {
    pagination: true,
    pageSize: 10,
    fields: ['date_creation', 'nom_etablissement', 'categorie'],
    syncWithUrl: true  // Synchroniser avec l'URL
  }
});
```

## Débogage

Pour activer les logs de débogage :

```bash
NODE_ENV=development node src/index.js
```

## Limitations

- Nécessite Angular.js 1.8.2+ et ODS Widgets v2
- Les widgets géographiques nécessitent des coordonnées valides
- Maximum 10 000 enregistrements pour l'export CSV
- Le mode sombre nécessite DSFR 1.14.0+

## Support

Pour toute question ou problème :
- GitHub : https://github.com/gouv-fr/mcp-ods-widgets
- Email : support-widgets@economie.gouv.fr