# Structure modulaire des prompts pour le Widget Builder DSFR

## Architecture des composants de prompt

Chaque prompt est composé de modules indépendants qui peuvent être assemblés selon les besoins :

```
prompts/
├── core/                    # Composants de base réutilisables
│   ├── task-description.md
│   ├── tone-context.md
│   ├── output-format.md
│   └── safety-rules.md
├── datasets/               # Contexte spécifique par dataset
│   ├── signalconso.md
│   ├── annuaire-dgccrf.md
│   ├── budget-vert.md
│   └── tarifs-bancaires.md
├── widgets/                # Instructions par type de widget
│   ├── table.md
│   ├── chart.md
│   ├── map.md
│   ├── kpi.md
│   └── facets.md
├── examples/               # Exemples annotés
│   ├── table-examples.md
│   ├── chart-examples.md
│   └── map-examples.md
└── templates/              # Templates assemblés
    ├── widget-generator.md
    ├── data-analyzer.md
    └── dsfr-validator.md
```

## Principe de composition

### 1. Template de base
```markdown
{{TASK_DESCRIPTION}}
{{TONE_CONTEXT}}
{{DATASET_CONTEXT}}
{{WIDGET_INSTRUCTIONS}}
{{EXAMPLES}}
{{OUTPUT_FORMAT}}
{{SAFETY_RULES}}
```

### 2. Variables dynamiques
- `{{DATASET_NAME}}` : nom du dataset actuel
- `{{WIDGET_TYPE}}` : type de widget à générer
- `{{USER_QUERY}}` : requête utilisateur
- `{{SCHEMA_DATA}}` : structure des données
- `{{DSFR_VERSION}}` : version DSFR cible

### 3. Contrôle du contexte
- Injection sélective des composants
- Exclusion des éléments non pertinents
- Gestion de l'historique par fenêtre glissante