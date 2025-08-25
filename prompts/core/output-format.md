# Module: Format de sortie

## Structure attendue

### Pour génération HTML
```html
<!-- DÉBUT ZONE WIDGET {{DATASET_NAME}}-{{WIDGET_TYPE}}-{{TIMESTAMP}} -->
<div id="widget-{{WIDGET_ID}}" class="widget-container fr-container">
  <!-- Contenu DSFR -->
</div>
<!-- FIN ZONE WIDGET {{DATASET_NAME}}-{{WIDGET_TYPE}}-{{TIMESTAMP}} -->
```

### Pour réponse JSON
```json
{
  "widget": {
    "id": "string",
    "type": "string",
    "dataset": "string",
    "html": "string",
    "css": "string (optionnel)",
    "js": "string (optionnel)",
    "dependencies": {
      "dsfr": "string",
      "angular": "boolean",
      "ods": "boolean"
    },
    "metadata": {
      "generated": "ISO 8601",
      "compliance": {
        "dsfr": "boolean",
        "rgaa": "boolean"
      },
      "performance": {
        "maxRows": "number",
        "estimatedLoadTime": "string"
      }
    }
  }
}
```

### Pour documentation
```markdown
## Widget: [Nom]
- **Dataset**: [source]
- **Type**: [table|chart|map|kpi|facets]
- **Conformité DSFR**: ✓
- **Accessibilité RGAA**: AA
- **Dépendances**: [liste]

### Configuration
[Paramètres disponibles]

### Intégration
[Instructions d'installation]
```

## Règles de formatage
1. HTML indenté à 2 espaces
2. Attributs dans l'ordre: id, class, data-*, aria-*, autres
3. CSS groupé par composant
4. JavaScript en modules ES6 si possible