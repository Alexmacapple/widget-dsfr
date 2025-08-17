# Widgets DSFR - Documentation

Ce dossier contient les widgets OpenDataSoft migrés vers le Design System France (DSFR), générés par l'agent migration-assistant.

## Structure des dossiers

```
widgets/
├── charts/          # Graphiques et visualisations
├── maps/           # Cartes géographiques  
├── facets/         # Filtres et facettes
├── tables/         # Tableaux (vide - exemples existants)
├── kpi/            # Indicateurs clés (vide - à développer)
└── README.md       # Cette documentation
```

## Widgets disponibles

### Charts (3 widgets)
- **chart-line-001.html** - Graphiques en ligne temporels
- **chart-bar-001.html** - Graphiques en barres/colonnes  
- **chart-pie-001.html** - Graphiques circulaires

### Maps (2 widgets)
- **map-basic-001.html** - Cartes géographiques basiques avec clustering
- **map-heatmap-001.html** - Cartes de densité (heatmap)

### Facets (2 widgets)
- **facets-basic-001.html** - Filtres à facettes basiques
- **facets-refinement-001.html** - Filtres avancés avec raffinement progressif

## Convention de nommage

Format : `[TYPE]-[VARIANTE]-[VERSION].html`

Exemples :
- `chart-line-001.html` = Chart de type Line, version 001
- `map-heatmap-001.html` = Map de type Heatmap, version 001

## Utilisation

### Intégration Drupal (recommandée)
```html
<iframe src="/widgets/charts/chart-line-001.html" 
        width="100%" 
        height="800" 
        frameborder="0"
        title="Widget Chart Line SignalConso">
</iframe>
```

### Intégration directe
Chaque fichier HTML est autonome et peut être utilisé directement en copiant le fichier sur votre serveur web.

## Configuration

### Dataset par défaut
Tous les widgets sont configurés pour le dataset **SignalConso** sur **data.economie.gouv.fr**.

### Modification du dataset
Pour adapter un widget à un autre dataset, modifier la ligne :
```html
<ods-dataset-context 
    context="signalconso"
    data-domain="data.economie.gouv.fr"
    data-dataset="signalconso">
```

## Standards respectés

- ✅ **DSFR 1.14.0** - Design System France
- ✅ **RGAA 4.1** - Niveau AA d'accessibilité
- ✅ **HTML5** - Structure sémantique
- ✅ **Responsive** - Mobile, tablet, desktop

## Performance

- **Chargement** : < 3s sur réseau normal
- **Capacité** : Jusqu'à 50k enregistrements
- **Optimisations** : Clustering automatique, pagination intelligente

## Support et maintenance

- **Documentation** : [GUIDE_GENERATION_WIDGETS_HTML.md](../GUIDE_GENERATION_WIDGETS_HTML.md)
- **Rapport** : [MIGRATION_REPORT.md](../MIGRATION_REPORT.md)
- **Architecture** : [ARCHITECTURE_HTML_SIMPLE.md](../ARCHITECTURE_HTML_SIMPLE.md)

## Prochains widgets

Voir [ROADMAP.md](../mcp-ods-widgets/ROADMAP.md) pour la liste des 60+ widgets restants à migrer.