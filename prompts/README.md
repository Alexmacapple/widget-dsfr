# Système de Prompts Modulaires - Widget Builder DSFR

## 🎯 Objectif

Ce système permet de créer des prompts structurés et optimisés pour la génération de widgets DSFR à partir de datasets OpenDataSoft. Chaque prompt est composé de modules indépendants qui peuvent être assemblés dynamiquement selon les besoins.

## 🏗️ Architecture

```
prompts/
├── core/                    # Modules de base réutilisables
│   ├── task-description.md # Description de la tâche
│   ├── tone-context.md     # Contexte et ton
│   ├── output-format.md    # Formats de sortie
│   └── safety-rules.md     # Règles de sécurité/conformité
├── datasets/               # Contexte par dataset
│   ├── signalconso.md
│   ├── annuaire-dgccrf.md
│   ├── budget-vert.md
│   └── tarifs-bancaires.md
├── widgets/                # Instructions par type
│   ├── table.md
│   ├── chart.md
│   ├── map.md
│   ├── kpi.md
│   └── facets.md
├── examples/               # Exemples annotés
│   ├── table-examples.md
│   └── chart-examples.md
├── templates/              # Templates pré-assemblés
│   ├── widget-generator.md
│   ├── data-analyzer.md
│   └── dsfr-validator.md
├── assembler.js           # Système d'assemblage
├── test-prompts.js        # Tests du système
└── README.md              # Documentation
```

## 🚀 Utilisation

### Installation

```bash
# Installer les dépendances (optionnel, pour les tests)
npm install chalk
```

### Utilisation basique

```javascript
const PromptAssembler = require('./assembler');

// Créer une instance
const assembler = new PromptAssembler();

// Charger les modules nécessaires
await assembler.loadModules({
  dataset: 'signalconso',
  widgetType: 'table',
  includeExamples: true
});

// Définir les variables
assembler.setVariables({
  DATASET_NAME: 'signalconso',
  WIDGET_TYPE: 'table',
  WIDGET_ID: 'sc-table-001'
});

// Construire le prompt
const prompt = assembler.build({
  userQuery: 'Créer une table des signalements récents',
  includeDataset: true,
  includeExamples: false,
  outputFormat: 'html'
});

// Optimiser (réduire les tokens)
const optimized = assembler.optimize(prompt);

// Analyser les statistiques
assembler.analyzePrompt(optimized);
```

### Options de construction

```javascript
// Prompt minimal (moins de tokens)
const minimal = assembler.buildMinimal(userQuery, widgetType);

// Prompt complet (avec exemples)
const complete = assembler.buildComplete(userQuery);

// Prompt personnalisé
const custom = assembler.build({
  userQuery: 'Ma requête',
  includeDataset: true,      // Inclure contexte dataset
  includeExamples: false,    // Inclure exemples
  minimal: false,             // Mode minimal
  outputFormat: 'html'        // Format: html, json, markdown
});
```

## 🧪 Tests

### Exécuter tous les tests

```bash
node test-prompts.js
```

### Options disponibles

```bash
# Sauvegarder les prompts générés
node test-prompts.js --save

# Tests unitaires seulement
node test-prompts.js --unit

# Aide
node test-prompts.js --help
```

## 📋 Templates disponibles

### 1. Widget Generator
Génère un widget DSFR complet à partir d'un dataset.

```javascript
// Utilise: templates/widget-generator.md
// Variables: DATASET_NAME, WIDGET_TYPE, USER_QUERY
```

### 2. Data Analyzer
Analyse un dataset et recommande les meilleurs widgets.

```javascript
// Utilise: templates/data-analyzer.md
// Variables: DATASET_NAME, USER_QUERY
```

### 3. DSFR Validator
Valide la conformité DSFR et RGAA d'un code HTML.

```javascript
// Utilise: templates/dsfr-validator.md
// Variables: HTML_CODE
```

## 🔧 Personnalisation

### Ajouter un nouveau dataset

1. Créer `datasets/mon-dataset.md`
2. Documenter la structure des données
3. Inclure les requêtes OQL fréquentes
4. Ajouter les cas d'usage typiques

### Ajouter un type de widget

1. Créer `widgets/mon-widget.md`
2. Documenter les instructions de génération
3. Inclure les patterns HTML/CSS/JS
4. Ajouter des exemples dans `examples/`

### Créer un nouveau template

1. Créer `templates/mon-template.md`
2. Utiliser les placeholders `{{VARIABLE}}`
3. Structurer avec des sections markdown
4. Tester avec `test-prompts.js`

## 📊 Optimisation des tokens

### Stratégies implémentées

1. **Compression contextuelle**
   - Historique limité aux 3 derniers échanges
   - Exclusion des tools non pertinents
   - Résumé des outputs longs

2. **Modules conditionnels**
   - Chargement à la demande
   - Cache après première utilisation
   - Exemples uniquement si nécessaire

3. **Code tronqué**
   - Blocs >20 lignes automatiquement réduits
   - Préservation début/fin pour contexte
   - Indication claire de la troncature

### Estimation des tokens

```javascript
const tokens = assembler.estimateTokens(prompt);
// Approximation: ~1 token pour 4 caractères
```

## 🎯 Bonnes pratiques

### DO ✅

- Utiliser les modules existants comme base
- Versionner les prompts comme du code
- Tester les changements avec `test-prompts.js`
- Optimiser pour <4000 tokens si possible
- Documenter les variables utilisées

### DON'T ❌

- Hardcoder des valeurs dans les modules
- Ignorer les règles de sécurité
- Dépasser 8000 tokens sans raison
- Mélanger les responsabilités des modules
- Oublier l'interpolation des variables

## 📚 Variables disponibles

### Variables système
- `{{TIMESTAMP}}` - ISO 8601 timestamp
- `{{DSFR_VERSION}}` - Version DSFR (défaut: 1.12.1)

### Variables dataset
- `{{DATASET_NAME}}` - Nom du dataset
- `{{API_ENDPOINT}}` - URL de l'API

### Variables widget
- `{{WIDGET_TYPE}}` - Type (table, chart, map, kpi, facets)
- `{{WIDGET_ID}}` - Identifiant unique

### Variables utilisateur
- `{{USER_QUERY}}` - Requête complète
- Variables personnalisées via `setVariables()`

## 🔍 Débogage

### Analyser un prompt

```javascript
const stats = assembler.analyzePrompt(prompt);
console.log(stats);
// {
//   totalLength: 12500,
//   estimatedTokens: 3200,
//   lineCount: 450,
//   sectionCount: 12,
//   codeBlockCount: 8,
//   variableCount: 15
// }
```

### Vérifier les variables non résolues

```javascript
const unresolved = prompt.match(/\{\{(\w+)\}\}/g);
if (unresolved) {
  console.log('Variables manquantes:', unresolved);
}
```

## 📈 Métriques de performance

### Temps de génération moyen
- Prompt minimal: ~50ms
- Prompt standard: ~100ms
- Prompt complet: ~150ms

### Taille des prompts
- Minimal: 2000-3000 tokens
- Standard: 3000-4500 tokens
- Complet: 4500-6000 tokens

## 🤝 Contribution

Pour ajouter de nouveaux modules ou améliorer le système :

1. Créer une branche feature
2. Ajouter les modules dans le bon dossier
3. Mettre à jour les tests si nécessaire
4. Documenter les changements
5. Tester avec `npm test`

## 📝 License

Système développé pour le projet Widget DSFR - MIT License