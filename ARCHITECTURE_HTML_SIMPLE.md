# Architecture Widget Builder HTML - Génération DSFR/ODS

## Vue d'ensemble
Système de génération de widgets HTML complets autonomes, basés sur le gabarit `/Users/alex/Desktop/widget-dsfr/_old/html/widget.html`, avec identification unique des zones widget et connexion directe à data.economie.gouv.fr.

---

## 📋 Principe de Fonctionnement

### Flux de Génération avec MCP
```
1. Sélection Dataset → 2. Consultation MCP DSFR → 3. Génération Widget → 4. HTML Complet
```

### Identification Unique des Widgets
Chaque widget est identifié dans le HTML :
```html
<!-- DÉBUT ZONE WIDGET SIGNALCONSO-TABLE-001 -->
[Widget ODS avec composants DSFR validés]
<!-- FIN ZONE WIDGET SIGNALCONSO-TABLE-001 -->
```

### Connexion Directe aux Données
- **Domaine unique** : data.economie.gouv.fr
- **Connexion temps réel** : Pas de cache local
- **Datasets disponibles** : SignalConso, Annuaire DGCCRF, Budget Vert, etc.

---

## 🏗️ Architecture Simplifiée

```
widget-builder-html/
├── templates/                      # Gabarits HTML
│   ├── base/
│   │   └── widget.html            # Template DSFR de base
│   ├── widgets/                   # Fragments de widgets
│   │   ├── table.html
│   │   ├── chart.html
│   │   ├── map.html
│   │   └── ...
│   └── complete/                  # Pages HTML complètes
│       ├── signalconso.html
│       ├── annuaire.html
│       └── ...
├── generator/                      # Générateur de widgets
│   ├── index.html                 # Interface de génération
│   ├── js/
│   │   ├── widget-generator.js
│   │   ├── dataset-configs.js
│   │   └── mcp-connector.js
│   └── css/
│       └── builder.css
├── output/                         # Widgets générés
│   └── [widgets HTML générés]
└── docs/
    └── integration-drupal.md
```

---

## Types de Sortie

### Sortie Unique : HTML Complet Autonome
Chaque widget génère un fichier HTML complet basé sur le gabarit `widget.html` avec :
```html
<!-- Fragment à copier dans la zone widget -->
<ods-dataset-context 
    context="signalconso"
    data-domain="data.economie.gouv.fr"
    data-dataset="signalconso">
    
    <!-- Barre de recherche DSFR -->
    <div class="fr-search-bar fr-mb-3w">
        <input class="fr-input" 
               type="search" 
               ng-model="signalconso.parameters['q']"
               placeholder="Rechercher un signalement...">
        <button class="fr-btn">Rechercher</button>
    </div>
    
    <!-- Tableau avec style DSFR -->
    <div class="fr-table">
        <ods-table context="signalconso"
                   displayed-fields="['date_creation','nom_etablissement','categorie','ville']">
        </ods-table>
    </div>
</ods-dataset-context>
```

- **Structure DSFR complète** : Header, footer, navigation
- **Dépendances incluses** : CSS/JS ODS et DSFR
- **Widget identifié** : Zone unique avec ID
- **Connexion data.economie.gouv.fr** : Configuration dataset intégrée
```html
<!-- Code à donner pour embarquer -->
<iframe 
    src="https://votre-domaine.fr/widgets/signalconso.html"
    width="100%" 
    height="600"
    frameborder="0">
</iframe>
```

---

## 📊 Configuration des Widgets

### Structure de Configuration
```javascript
// dataset-configs.js
const WidgetConfigs = {
  signalconso: {
    // Informations dataset
    domain: 'data.economie.gouv.fr',
    dataset: 'signalconso',
    
    // Configuration du widget
    widget: {
      type: 'table-cards',  // table, chart, map, cards
      title: 'Signalements consommateurs',
      description: 'Tableau des derniers signalements',
      
      // Champs à afficher
      fields: {
        display: ['date_creation', 'nom_etablissement', 'categorie', 'ville'],
        labels: {
          date_creation: 'Date',
          nom_etablissement: 'Établissement',
          categorie: 'Catégorie',
          ville: 'Ville'
        }
      },
      
      // Options DSFR
      dsfr: {
        container: 'fr-card',
        tableClass: 'fr-table',
        searchBar: true,
        pagination: true,
        itemsPerPage: 20
      },
      
      // Filtres
      filters: {
        facets: ['categorie', 'region', 'dep'],
        dateRange: true,
        search: true
      }
    }
  }
};
```

---

## 🎨 Interface de Génération

### Page de Génération Simple
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <title>Générateur de Widgets DSFR/ODS</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.min.css">
</head>
<body>
    <div class="fr-container">
        <h1>Générateur de Widgets DSFR</h1>
        
        <!-- Étape 1 : Choix du dataset -->
        <div class="fr-select-group">
            <label class="fr-label">Dataset</label>
            <select class="fr-select" id="dataset-select">
                <option value="signalconso">SignalConso</option>
                <option value="annuaire">Annuaire DGCCRF</option>
                <option value="budget-vert">Budget Vert</option>
            </select>
        </div>
        
        <!-- Étape 2 : Type de widget -->
        <fieldset class="fr-fieldset">
            <legend>Type de widget</legend>
            <div class="fr-radio-group">
                <input type="radio" id="type-table" name="widget-type" value="table">
                <label for="type-table">Tableau</label>
            </div>
            <div class="fr-radio-group">
                <input type="radio" id="type-cards" name="widget-type" value="cards">
                <label for="type-cards">Cartes</label>
            </div>
            <div class="fr-radio-group">
                <input type="radio" id="type-chart" name="widget-type" value="chart">
                <label for="type-chart">Graphique</label>
            </div>
        </fieldset>
        
        <!-- Étape 3 : Options -->
        <div class="fr-checkbox-group">
            <input type="checkbox" id="opt-search" checked>
            <label for="opt-search">Barre de recherche</label>
        </div>
        <div class="fr-checkbox-group">
            <input type="checkbox" id="opt-filters" checked>
            <label for="opt-filters">Filtres</label>
        </div>
        <div class="fr-checkbox-group">
            <input type="checkbox" id="opt-pagination" checked>
            <label for="opt-pagination">Pagination</label>
        </div>
        
        <!-- Bouton de génération -->
        <button class="fr-btn" onclick="generateWidget()">
            Générer le widget
        </button>
        
        <!-- Zone de preview -->
        <div class="fr-card fr-mt-3w">
            <div class="fr-card__body">
                <h2>Aperçu</h2>
                <div id="preview-zone">
                    <!-- Preview du widget -->
                </div>
            </div>
        </div>
        
        <!-- Code généré -->
        <div class="fr-card fr-mt-3w">
            <div class="fr-card__body">
                <h2>Code HTML à copier</h2>
                <pre><code id="generated-code">
                    <!-- Code HTML généré -->
                </code></pre>
                <button class="fr-btn fr-btn--secondary" onclick="copyCode()">
                    Copier le code
                </button>
            </div>
        </div>
    </div>
    
    <script src="js/widget-generator.js"></script>
</body>
</html>
```

---

## 🚀 Générateur JavaScript

### widget-generator.js
```javascript
class WidgetGenerator {
    constructor() {
        this.configs = WidgetConfigs;
        this.mcpGateway = new MCPGateway();
    }
    
    async generateWidget(dataset, type, options) {
        // 1. Récupérer la config
        const config = this.configs[dataset];
        
        // 2. Appeler les MCP pour générer le code
        const [odsWidget, dsfrStyles] = await Promise.all([
            this.mcpGateway.generateODSWidget(config, type),
            this.mcpGateway.getDSFRStyles(type)
        ]);
        
        // 3. Merger ODS et DSFR
        const html = this.mergeODSWithDSFR(odsWidget, dsfrStyles, options);
        
        // 4. Retourner le HTML
        return {
            fragment: html,           // Pour insertion dans gabarit
            complete: this.wrapInTemplate(html),  // Page complète
            preview: this.createPreview(html)     // Pour l'aperçu
        };
    }
    
    mergeODSWithDSFR(ods, dsfr, options) {
        let html = `
        <ods-dataset-context 
            context="${ods.context}"
            data-domain="${ods.domain}"
            data-dataset="${ods.dataset}">
        `;
        
        // Ajouter recherche si demandée
        if (options.search) {
            html += `
            <div class="fr-search-bar fr-mb-3w">
                <input class="fr-input" type="search" 
                       ng-model="${ods.context}.parameters['q']"
                       placeholder="Rechercher...">
                <button class="fr-btn">Rechercher</button>
            </div>`;
        }
        
        // Ajouter le widget principal
        html += ods.widgetHTML;
        
        // Ajouter pagination si demandée
        if (options.pagination) {
            html += `
            <div class="fr-pagination fr-mt-3w">
                <ods-pager context="${ods.context}"></ods-pager>
            </div>`;
        }
        
        html += `</ods-dataset-context>`;
        
        return html;
    }
    
    wrapInTemplate(widgetHTML) {
        // Charger le template de base
        const template = this.loadTemplate();
        
        // Insérer le widget dans la zone dédiée
        return template.replace(
            /<!-- DÉBUT ZONE WIDGET -->[\s\S]*<!-- FIN ZONE WIDGET -->/,
            `<!-- DÉBUT ZONE WIDGET -->\n${widgetHTML}\n<!-- FIN ZONE WIDGET -->`
        );
    }
}
```

---

## 📦 Widgets Pré-configurés

### 1. Widget SignalConso (Table + Cartes)
```html
<!-- widgets/signalconso-complete.html -->
<ods-dataset-context 
    context="data"
    data-domain="data.economie.gouv.fr"
    data-dataset="signalconso">
    
    <!-- En-tête avec KPIs -->
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3w">
        <div class="fr-col-4">
            <div class="fr-tile">
                <div class="fr-tile__body">
                    <ods-aggregation context="data" function="COUNT">
                        <h3 class="fr-tile__title">{{ result }}</h3>
                        <p>Signalements totaux</p>
                    </ods-aggregation>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Filtres et résultats -->
    <div class="fr-grid-row fr-grid-row--gutters">
        <!-- Filtres -->
        <div class="fr-col-3">
            <ods-facets context="data">
                <h3>Filtrer par</h3>
                <ods-facet name="categorie"></ods-facet>
                <ods-facet name="region"></ods-facet>
            </ods-facets>
        </div>
        
        <!-- Résultats en cartes -->
        <div class="fr-col-9">
            <ods-result-enumerator context="data" max="12">
                <div class="fr-grid-row fr-grid-row--gutters">
                    <div ng-repeat="item in results" class="fr-col-12 fr-col-md-6 fr-col-lg-4">
                        <div class="fr-card">
                            <div class="fr-card__body">
                                <h4 class="fr-card__title">
                                    {{item.fields.nom_etablissement || 'Non renseigné'}}
                                </h4>
                                <p class="fr-card__desc">
                                    <span class="fr-tag">{{item.fields.categorie}}</span><br>
                                    {{item.fields.ville}} ({{item.fields.dep}})
                                </p>
                                <p class="fr-text--sm">
                                    {{item.fields.date_creation | date:'dd/MM/yyyy'}}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </ods-result-enumerator>
            
            <!-- Pagination -->
            <nav class="fr-pagination fr-mt-3w" aria-label="Pagination">
                <ods-pager context="data" page-size="12"></ods-pager>
            </nav>
        </div>
    </div>
</ods-dataset-context>
```

### 2. Widget Annuaire (Table simple)
```html
<!-- widgets/annuaire-simple.html -->
<ods-dataset-context 
    context="annuaire"
    data-domain="data.economie.gouv.fr"
    data-dataset="dgccrf_annuaire_services_deconcentres">
    
    <div class="fr-table">
        <ods-table context="annuaire"
                   displayed-fields="['libelle','adresse','telephone','courriel']"
                   sort="libelle">
        </ods-table>
    </div>
</ods-dataset-context>
```

---

## 🔄 Processus de Génération avec MCP

```javascript
// mcp-connector.js
class MCPGateway {
    async generateCompleteWidget(params) {
        const { dataset, widgetType, options } = params;
        
        // Appels parallèles aux 4 MCP
        const [odsWidget, dsfrComponent, documentation, examples] = await Promise.all([
            this.callMCP('ods-widgets', 'createWidget', { type: widgetType, dataset }),
            this.callMCP('dsfr-mcp', 'generateComponent', { type: widgetType }),
            this.callMCP('ods-docs', 'getWidget', { name: widgetType }),
            this.callMCP('context7', 'getExamples', { query: `angular ${widgetType}` })
        ]);
        
        // Fusion intelligente
        return this.mergeResults({
            ods: odsWidget,
            dsfr: dsfrComponent,
            docs: documentation,
            examples: examples,
            options: options
        });
    }
    
    mergeResults(results) {
        // Génération du HTML final avec :
        // - Structure DSFR (containers, grilles)
        // - Widget ODS au centre
        // - Styles harmonisés
        // - Options demandées (search, filters, etc.)
        
        return {
            html: this.generateHTML(results),
            css: this.generateCSS(results),
            preview: this.generatePreview(results)
        };
    }
}
```

---

## 📝 Guide d'Intégration Drupal

### Méthode 1 : Copier/Coller Direct
1. Générer le widget via l'interface
2. Copier le code HTML fragment
3. Dans Drupal : Créer un bloc "HTML personnalisé"
4. Coller le code dans le bloc
5. S'assurer que les dépendances JS/CSS sont chargées

### Méthode 2 : Page HTML Complète
1. Générer la page HTML complète
2. Héberger le fichier sur votre serveur
3. Dans Drupal : Créer un iframe pointant vers la page

### Méthode 3 : Module Drupal Custom (Avancé)
1. Créer un module Drupal
2. Inclure les dépendances ODS/DSFR
3. Utiliser les templates générés

---

## ✅ Avantages de cette Approche

1. **Simplicité** : Pas de développement Drupal nécessaire
2. **Autonomie** : Widgets HTML indépendants
3. **Réutilisabilité** : Templates prêts à l'emploi
4. **Flexibilité** : 3 modes de sortie (fragment, page, iframe)
5. **Maintenance** : Mise à jour facile des widgets
6. **Performance** : Pas de dépendance serveur

---

## 🎯 Livrables

### Pour chaque widget :
1. **Fragment HTML** : Code à insérer dans le gabarit
2. **Page complète** : HTML autonome avec header/footer DSFR
3. **Documentation** : Guide d'intégration spécifique
4. **Exemples** : Avec différents datasets

### Package final :
```
livrable/
├── generator/           # Interface de génération
├── widgets/            # 70+ widgets pré-configurés
├── templates/          # Gabarits réutilisables
├── examples/           # Exemples d'intégration
└── docs/              # Documentation complète
```

Cette architecture simplifiée permet de générer rapidement des widgets HTML DSFR/ODS sans aucun développement côté Drupal.