# Guide de Génération des Widgets HTML DSFR/ODS

## Principe Fondamental
Chaque widget est un fichier HTML complet autonome basé sur le gabarit `widget.html`, avec identification unique et connexion directe à data.economie.gouv.fr.

---

## Structure d'Identification des Widgets

### Convention de Nommage
```
[DATASET]-[TYPE]-[VERSION]
```

Exemples :
- `SIGNALCONSO-TABLE-001`
- `ANNUAIRE-CARDS-002`
- `BUDGET-CHART-001`

### Intégration dans le HTML
```html
<!-- DÉBUT ZONE WIDGET SIGNALCONSO-TABLE-001 -->
<div class="widget-container" id="widget-signalconso-table-001">
    <!-- Widget ODS avec composants DSFR -->
</div>
<!-- FIN ZONE WIDGET SIGNALCONSO-TABLE-001 -->
```

---

## Processus de Génération avec MCP Obligatoire

### Étape 1 : Vérification des Composants DSFR
Avant toute génération, consultation obligatoire du MCP DSFR :

```javascript
// Vérification obligatoire via MCP
async function validateDSFRComponents(widgetType) {
    // 1. Récupérer les composants DSFR disponibles
    const dsfrComponents = await mcpDSFR.getComponentDetails(widgetType);
    
    // 2. Vérifier les classes CSS correctes
    const validClasses = dsfrComponents.classes;
    
    // 3. Vérifier l'accessibilité RGAA
    const accessibilityRules = dsfrComponents.accessibility;
    
    return {
        components: dsfrComponents,
        validated: true
    };
}
```

### Étape 2 : Configuration du Dataset
```javascript
const datasetConfig = {
    domain: 'data.economie.gouv.fr',  // Domaine fixe
    dataset: 'signalconso',           // Dataset sélectionné
    realtime: true,                   // Connexion temps réel
    cache: false                      // Pas de cache local
};
```

### Étape 3 : Génération du Widget
```javascript
async function generateWidget(dataset, type) {
    // 1. Validation DSFR obligatoire
    const dsfrValidation = await validateDSFRComponents(type);
    
    // 2. Génération du widget ODS
    const odsWidget = await generateODSWidget(dataset, type);
    
    // 3. Application des composants DSFR validés
    const dsfrWidget = applyDSFRStyles(odsWidget, dsfrValidation);
    
    // 4. Génération HTML complet
    return generateCompleteHTML(dsfrWidget, dataset, type);
}
```

---

## Composants DSFR Obligatoires par Type de Widget

### Widget Table
Composants DSFR requis (vérifiés via MCP) :
- `fr-table` : Structure de tableau
- `fr-table--bordered` : Bordures
- `fr-table--no-scroll` : Sans scroll horizontal
- `caption` : Description obligatoire pour accessibilité

```html
<!-- DÉBUT ZONE WIDGET SIGNALCONSO-TABLE-001 -->
<div class="fr-table fr-table--bordered">
    <table>
        <caption>Signalements consommateurs - data.economie.gouv.fr</caption>
        <thead>
            <tr>
                <th scope="col">Date</th>
                <th scope="col">Établissement</th>
                <th scope="col">Catégorie</th>
                <th scope="col">Ville</th>
            </tr>
        </thead>
        <tbody>
            <!-- Données ODS -->
        </tbody>
    </table>
</div>
<!-- FIN ZONE WIDGET SIGNALCONSO-TABLE-001 -->
```

### Widget Cards
Composants DSFR requis :
- `fr-card` : Conteneur carte
- `fr-card__body` : Corps de carte
- `fr-card__title` : Titre
- `fr-card__desc` : Description
- `fr-tag` : Tags catégories

```html
<!-- DÉBUT ZONE WIDGET ANNUAIRE-CARDS-001 -->
<div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12 fr-col-md-6 fr-col-lg-4">
        <div class="fr-card">
            <div class="fr-card__body">
                <h3 class="fr-card__title">Nom établissement</h3>
                <p class="fr-card__desc">
                    <span class="fr-tag">Catégorie</span>
                </p>
            </div>
        </div>
    </div>
</div>
<!-- FIN ZONE WIDGET ANNUAIRE-CARDS-001 -->
```

### Widget Chart
Composants DSFR requis :
- `fr-container` : Conteneur responsive
- `fr-callout` : Zone de graphique
- Classes d'espacement : `fr-mt-3w`, `fr-mb-3w`

---

## Configuration Fixe des Datasets

### SignalConso
```javascript
const SIGNALCONSO_CONFIG = {
    domain: 'data.economie.gouv.fr',
    dataset: 'signalconso',
    fields: {
        required: ['date_creation', 'nom_etablissement', 'categorie', 'ville'],
        optional: ['sous_categorie', 'statut_promesse', 'siret'],
        sort: '-date_creation'
    },
    display: {
        itemsPerPage: 20,
        type: 'table',
        search: true,
        filters: ['categorie', 'region', 'dep']
    }
};
```

### Annuaire DGCCRF
```javascript
const ANNUAIRE_CONFIG = {
    domain: 'data.economie.gouv.fr',
    dataset: 'dgccrf_annuaire_services_deconcentres',
    fields: {
        required: ['libelle', 'adresse', 'telephone'],
        optional: ['courriel', 'horaires'],
        sort: 'libelle'
    },
    display: {
        itemsPerPage: 50,
        type: 'table',
        search: true,
        filters: ['region']
    }
};
```

---

## Template HTML Complet Généré

```html
<!DOCTYPE html>
<html lang="fr" data-fr-theme="light">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Widget DSFR - [DATASET]</title>
    
    <!-- CSS ODS puis DSFR (ordre important) -->
    <link rel="stylesheet" href="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.min.css">
    
    <!-- Styles harmonisation -->
    <style>
        .widget-container {
            min-height: 400px;
            background-color: var(--background-alt-grey);
            padding: 1.5rem;
        }
        
        /* Harmonisation ODS/DSFR */
        .ods-widget .odswidget-table th {
            background-color: var(--background-contrast-grey);
            font-weight: 700;
        }
    </style>
</head>
<body>
    <!-- Header DSFR complet -->
    <header role="banner" class="fr-header">
        <!-- ... header du gabarit ... -->
    </header>

    <!-- Contenu principal -->
    <main id="content" role="main">
        <div class="fr-container fr-py-6w">
            <h1>Widget [DATASET]</h1>
            
            <!-- DÉBUT ZONE WIDGET [DATASET]-[TYPE]-[VERSION] -->
            <div class="widget-container" ng-app="ods-widgets">
                <ods-dataset-context 
                    context="ctx"
                    data-domain="data.economie.gouv.fr"
                    data-dataset="[DATASET_ID]">
                    
                    <!-- Widget ODS avec composants DSFR validés -->
                    [WIDGET_CONTENT]
                    
                </ods-dataset-context>
            </div>
            <!-- FIN ZONE WIDGET [DATASET]-[TYPE]-[VERSION] -->
        </div>
    </main>

    <!-- Footer DSFR complet -->
    <footer class="fr-footer" role="contentinfo">
        <!-- ... footer du gabarit ... -->
    </footer>

    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.2/angular.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-sanitize/1.8.2/angular-sanitize.min.js"></script>
    <script src="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.module.min.js"></script>
</body>
</html>
```

---

## Validation Obligatoire

### Checklist avant génération
- [ ] Composants DSFR vérifiés via MCP
- [ ] Classes CSS validées
- [ ] Accessibilité RGAA contrôlée
- [ ] Dataset configuré sur data.economie.gouv.fr
- [ ] Zone widget avec ID unique
- [ ] Gabarit widget.html utilisé

### Tests de validation
```javascript
function validateWidget(widgetHTML) {
    const validations = {
        hasDSFRComponents: checkDSFRClasses(widgetHTML),
        hasUniqueID: checkWidgetID(widgetHTML),
        hasDataConnection: checkDataDomain(widgetHTML),
        hasAccessibility: checkARIALabels(widgetHTML)
    };
    
    return Object.values(validations).every(v => v === true);
}
```

---

## Exemples de Widgets Complets

### 1. SignalConso Table
```html
<!-- DÉBUT ZONE WIDGET SIGNALCONSO-TABLE-001 -->
<div class="widget-container" ng-app="ods-widgets">
    <ods-dataset-context 
        context="signalconso"
        data-domain="data.economie.gouv.fr"
        data-dataset="signalconso">
        
        <!-- Recherche DSFR -->
        <div class="fr-search-bar fr-mb-3w">
            <label class="fr-label" for="search-signalconso">
                Rechercher dans les signalements
            </label>
            <input class="fr-input" 
                   id="search-signalconso"
                   type="search" 
                   ng-model="signalconso.parameters['q']"
                   placeholder="Nom, ville, catégorie...">
            <button class="fr-btn">Rechercher</button>
        </div>
        
        <!-- Tableau DSFR -->
        <div class="fr-table">
            <table>
                <caption>Liste des signalements consommateurs</caption>
                <ods-table context="signalconso"
                           displayed-fields="['date_creation','nom_etablissement','categorie','ville','statut_promesse']">
                </ods-table>
            </table>
        </div>
        
        <!-- Pagination DSFR -->
        <nav class="fr-pagination fr-mt-3w" aria-label="Pagination">
            <ods-pager context="signalconso" page-size="20"></ods-pager>
        </nav>
    </ods-dataset-context>
</div>
<!-- FIN ZONE WIDGET SIGNALCONSO-TABLE-001 -->
```

### 2. Annuaire Cards
```html
<!-- DÉBUT ZONE WIDGET ANNUAIRE-CARDS-001 -->
<div class="widget-container" ng-app="ods-widgets">
    <ods-dataset-context 
        context="annuaire"
        data-domain="data.economie.gouv.fr"
        data-dataset="dgccrf_annuaire_services_deconcentres">
        
        <!-- Filtres DSFR -->
        <div class="fr-grid-row fr-grid-row--gutters">
            <div class="fr-col-12 fr-col-md-3">
                <ods-facets context="annuaire">
                    <h3>Filtrer par région</h3>
                    <ods-facet name="region"></ods-facet>
                </ods-facets>
            </div>
            
            <!-- Cartes DSFR -->
            <div class="fr-col-12 fr-col-md-9">
                <ods-result-enumerator context="annuaire" max="12">
                    <div class="fr-grid-row fr-grid-row--gutters">
                        <div ng-repeat="item in results" 
                             class="fr-col-12 fr-col-md-6 fr-col-lg-4">
                            <div class="fr-card">
                                <div class="fr-card__body">
                                    <h3 class="fr-card__title">
                                        {{item.fields.libelle}}
                                    </h3>
                                    <p class="fr-card__desc">
                                        {{item.fields.adresse}}<br>
                                        <strong>Tél :</strong> {{item.fields.telephone}}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ods-result-enumerator>
            </div>
        </div>
    </ods-dataset-context>
</div>
<!-- FIN ZONE WIDGET ANNUAIRE-CARDS-001 -->
```

---

## Intégration dans Drupal

### Méthode recommandée
1. Générer le fichier HTML complet avec widget identifié
2. Héberger le fichier sur le serveur Drupal
3. Inclure via iframe ou bloc HTML personnalisé
4. L'identification unique permet le tracking et la maintenance

### Code d'intégration Drupal
```html
<!-- Dans un bloc Drupal -->
<iframe src="/widgets/signalconso-table-001.html" 
        width="100%" 
        height="800" 
        frameborder="0"
        title="Widget SignalConso">
</iframe>
```

---

## Maintenance et Versioning

### Gestion des versions
- Incrémenter le numéro de version : `001`, `002`, `003`
- Garder l'historique des versions générées
- Documenter les changements entre versions

### Mise à jour
1. Regénérer avec nouveau numéro de version
2. Tester le nouveau widget
3. Remplacer l'ancien dans Drupal
4. Archiver l'ancienne version

---

## Respect Absolu des Standards

### DSFR
- Utilisation exclusive des composants validés MCP
- Respect des classes CSS officielles
- Pas de styles custom sur les composants DSFR

### Accessibilité RGAA
- Labels et descriptions obligatoires
- Navigation clavier complète
- Contrastes respectés
- Structure sémantique HTML5

### Performance
- Connexion directe sans cache intermédiaire
- Pagination pour grands datasets
- Lazy loading des données