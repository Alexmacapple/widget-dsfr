# MCP ODS Widgets Complete - Documentation

## Vue d'ensemble

Le serveur MCP ODS Widgets Complete offre une intégration complète de **TOUS** les widgets OpenDataSoft disponibles avec le Design System France (DSFR).

## Widgets disponibles (50+ widgets)

### 📊 Visualisation de données
- **table** : Affichage tabulaire des données
- **chart** : Graphiques (colonnes, lignes, aires, pie, etc.)
- **map** : Cartes interactives avec marqueurs et couches

### 🔍 Filtrage et recherche
- **facets** : Filtres à facettes
- **facetResults** : Résultats de facettes
- **searchbox** : Boîte de recherche
- **textSearch** : Recherche textuelle dans les champs
- **clearAllFilters** : Effacer tous les filtres
- **filterSummary** : Résumé des filtres appliqués

### 📈 Agrégation et analyse
- **aggregation** : Calculs d'agrégation (COUNT, SUM, AVG, etc.)
- **analysis** : Analyse statistique des données
- **gauge** : Jauge visuelle
- **subaggregation** : Agrégations imbriquées
- **crossTable** : Tableau croisé dynamique

### 📅 Widgets temporels
- **calendar** : Calendrier avec événements
- **timerange** : Sélecteur de plage de dates
- **timescale** : Timeline avec échelle de temps
- **datetime** : Affichage date/heure formaté

### 📋 Affichage de résultats
- **results** : Liste de résultats
- **resultEnumerator** : Énumération des résultats
- **infiniteScrollResults** : Défilement infini
- **paginationBlock** : Bloc de pagination

### 🖼️ Médias
- **mediaGallery** : Galerie d'images
- **slideshow** : Diaporama
- **recordImage** : Image d'un enregistrement

### 📚 Catalogue
- **catalogContext** : Contexte de catalogue
- **mostPopularDatasets** : Datasets populaires
- **mostUsedThemes** : Thèmes populaires
- **lastDatasetsFeed** : Derniers datasets
- **domainStatistics** : Statistiques du domaine
- **datasetSchema** : Schéma du dataset

### 🏷️ Tags et thèmes
- **tagCloud** : Nuage de tags
- **themeBoxes** : Boîtes de thèmes
- **themePicto** : Pictogrammes de thèmes

### 📢 Social et partage
- **socialButtons** : Boutons de partage sociaux
- **disqus** : Commentaires Disqus
- **reuses** : Réutilisations
- **lastReusesFeed** : Dernières réutilisations

### 🛠️ Utilitaires
- **spinner** : Indicateur de chargement
- **picto** : Pictogrammes
- **toggleModel** : Interrupteur on/off
- **autoResize** : Redimensionnement automatique
- **pageRefresh** : Rafraîchissement de page

### 🌍 Géographique
- **geotooltip** : Infobulles géographiques

### 🔗 Contenu externe
- **gist** : Intégration GitHub Gist
- **hubspotForm** : Formulaires HubSpot

### 📊 Autres
- **topPublishers** : Top éditeurs
- **datasetContext** : Contexte de dataset (widget de base)

## Utilisation via MCP

### 1. Créer un widget simple

```javascript
// Via l'outil MCP create_widget
{
  "type": "table",
  "dataset": "signalconso",
  "domain": "data.economie.gouv.fr",
  "theme": "dsfr",
  "options": {
    "displayed-fields": ["nom_etablissement", "categorie", "dep"],
    "sort": "-date_creation",
    "page-size": "20"
  }
}
```

### 2. Lister tous les widgets

```javascript
// Via l'outil MCP list_widgets
{
  "category": "visualization" // optionnel
}
```

### 3. Générer un dashboard complet

```javascript
// Via l'outil MCP generate_dashboard
{
  "dataset": "signalconso",
  "domain": "data.economie.gouv.fr",
  "widgets": ["table", "chart", "map", "facets", "aggregation", "calendar"],
  "theme": "dsfr"
}
```

### 4. Obtenir le code d'un widget

```javascript
// Via l'outil MCP get_widget_code
{
  "type": "chart",
  "context": "mydata",
  "options": {
    "align-month": true,
    "display-legend": true
  },
  "wrapped": true // Envelopper dans DSFR
}
```

## Exemples de code généré

### Widget Table avec DSFR

```html
<div class="fr-card">
    <div class="fr-card__body">
        <div class="fr-card__content">
            <h3 class="fr-card__title">Table de données</h3>
            <div class="fr-card__desc">
                <ods-table context="ctx" 
                          displayed-fields="['field1', 'field2']"
                          sort="-date">
                </ods-table>
            </div>
        </div>
    </div>
</div>
```

### Widget Chart avec DSFR

```html
<div class="fr-card">
    <div class="fr-card__body">
        <div class="fr-card__content">
            <h3 class="fr-card__title">Graphique</h3>
            <div class="fr-card__desc">
                <ods-chart align-month="true">
                    <ods-chart-query context="ctx" field-x="category">
                        <ods-chart-serie chart-type="column" 
                                        function-y="COUNT" 
                                        color="#0063cb">
                        </ods-chart-serie>
                    </ods-chart-query>
                </ods-chart>
            </div>
        </div>
    </div>
</div>
```

### Dashboard complet

Le serveur génère automatiquement une page HTML complète avec :
- Header DSFR
- Navigation
- Grille responsive
- Tous les widgets demandés
- Footer DSFR
- Scripts nécessaires (Angular, ODS, DSFR)

## Configuration avancée

### Options communes à tous les widgets

```javascript
{
  "context": "nom_du_contexte",     // Contexte Angular
  "domain": "domaine.opendata.fr",  // Domaine ODS
  "dataset": "id_dataset",          // ID du dataset
  "theme": "dsfr|classic"           // Thème à appliquer
}
```

### Options spécifiques par widget

Chaque widget accepte des options spécifiques. Exemples :

**Table** :
- `displayed-fields` : Champs à afficher
- `sort` : Tri des données
- `page-size` : Nombre de lignes

**Chart** :
- `field-x` : Champ pour l'axe X
- `chart-type` : Type de graphique
- `function-y` : Fonction d'agrégation

**Map** :
- `location` : Position initiale
- `basemap` : Fond de carte
- `display` : Mode d'affichage (clustered, raw, heatmap)

## Intégration dans une application

### 1. Installation

```bash
cd mcp-ods-widgets
npm install
```

### 2. Configuration MCP

Dans `.mcp.json` :

```json
{
  "mcpServers": {
    "ods-widgets": {
      "command": "node",
      "args": ["/path/to/mcp-ods-widgets/src/index-complete.js"],
      "env": {
        "NODE_ENV": "production",
        "MCP_CLIENT": "true"
      }
    }
  }
}
```

### 3. Utilisation dans Claude

```
@ods-widgets create_widget type="map" dataset="mon-dataset"
```

## Support des datasets

Le serveur supporte tous les datasets OpenDataSoft, particulièrement :
- data.economie.gouv.fr
- public.opendatasoft.com
- Tout portail OpenDataSoft custom

## Compatibilité

- **Angular** : 1.8.2+
- **jQuery** : 3.6.0+
- **DSFR** : 1.14.0+
- **ODS Widgets** : latest-v2
- **Node.js** : 18.0.0+

## Dépannage

### Le widget ne s'affiche pas
- Vérifier que Angular est chargé
- Vérifier l'ordre des scripts
- Vérifier le contexte du dataset

### Erreur de connexion au dataset
- Vérifier le domaine et l'ID du dataset
- Vérifier les permissions d'accès

### Styles DSFR non appliqués
- Vérifier que le CSS DSFR est chargé
- Utiliser `theme: "dsfr"` dans les options

## Ressources

- [Documentation ODS Widgets](https://help.opendatasoft.com/widgets/)
- [Design System France](https://www.systeme-de-design.gouv.fr/)
- [API OpenDataSoft](https://help.opendatasoft.com/apis/)

## Licence

MIT - Ministère de l'Économie