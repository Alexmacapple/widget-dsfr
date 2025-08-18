# Guide d'Utilisation des Serveurs MCP - Widget DSFR

## 🧠 Basic Memory - Mémorisation des Décisions

Mémorise les patterns de transformation pour réutilisation.

```bash
# Sauvegarder une décision de transformation
mcp__basic-memory__save key:"table-sorting-pattern" value:"Utiliser fr-table__sort pour colonnes triables"

# Rappeler une décision
mcp__basic-memory__get key:"table-sorting-pattern"

# Lister toutes les décisions mémorisées
mcp__basic-memory__list pattern:"table-*"
```

### Cas d'usage :
- Patterns de transformation récurrents
- Mappings ODS → DSFR
- Solutions aux problèmes rencontrés

## 🕸️ Knowledge Graph - Relations entre Widgets

Cartographie les dépendances et relations.

```bash
# Créer une relation
mcp__knowledge-graph__add_relation from:"signalconso-table" to:"fr-table" type:"uses"

# Ajouter des métadonnées
mcp__knowledge-graph__add_node id:"signalconso-dashboard" properties:{
  "widgets": ["table", "chart", "kpi", "map"],
  "dataset": "signalconso",
  "score_dsfr": 95
}

# Requêter le graphe
mcp__knowledge-graph__query pattern:"MATCH (w:Widget)-[:USES]->(c:Component) WHERE c.type = 'fr-table' RETURN w"
```

### Cas d'usage :
- Identifier widgets similaires
- Analyser dépendances
- Planifier migrations par groupe

## 🎭 Playwright - Tests Navigateur

Tests automatisés dans un vrai navigateur.

```bash
# Lancer un test spécifique
mcp__playwright__test file:"tests/playwright/test-widgets.spec.js"

# Capturer une screenshot
mcp__playwright__screenshot url:"http://localhost:8000/examples/signalconso-dashboard-dsfr.html" 

# Tester l'accessibilité
mcp__playwright__accessibility url:"http://localhost:8000/examples/widget.html"

# Mesurer les performances
mcp__playwright__performance url:"http://localhost:8000/examples/dashboard.html"
```

### Cas d'usage :
- Validation visuelle
- Tests d'interaction
- Vérification responsive
- Mesures de performance

## 🐙 GitHub - Intégration Repository

Gestion des issues, PRs et workflows.

```bash
# Créer une issue pour un widget
mcp__github__create_issue title:"Widget Chart Budget-Vert" body:"Migration du widget chart pour le dataset budget-vert" labels:["widget", "todo"]

# Lister les issues widgets
mcp__github__list_issues labels:"widget"

# Créer une PR
mcp__github__create_pr title:"feat: Migration widgets table" body:"Migration des 5 widgets table" base:"main" head:"feat/widgets-table"

# Vérifier le statut CI/CD
mcp__github__workflow_status
```

### Configuration Token GitHub

1. Créer un token : https://github.com/settings/tokens
2. Ajouter dans `.env` :
```bash
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_votre_token_ici
```

## 🔄 Workflow Complet avec tous les MCP

```bash
# 1. Planifier avec sequential-thinking
mcp__sequential-thinking__plan task:"Migrer widget chart signalconso"

# 2. Vérifier décisions précédentes
mcp__basic-memory__get key:"chart-migration-pattern"

# 3. Analyser relations
mcp__knowledge-graph__neighbors node:"signalconso-chart"

# 4. Générer le widget
mcp__ods-widgets__create_widget type:"chart" dataset:"signalconso"

# 5. Valider DSFR
mcp__dsfr-mcp__validate_dsfr_html html_code:"..."

# 6. Formater le code
mcp__prettier__format file:"examples/signalconso-chart-001.html"

# 7. Analyser la sécurité
mcp__semgrep__scan file:"examples/signalconso-chart-001.html"

# 8. Tester dans le navigateur
mcp__playwright__test file:"tests/playwright/test-chart.spec.js"

# 9. Sauvegarder la décision
mcp__basic-memory__save key:"chart-signalconso-solution" value:"Utiliser Chart.js avec wrapper DSFR"

# 10. Commit via Git
mcp__git__commit message:"feat(chart): Migration chart SignalConso"

# 11. Créer PR sur GitHub
mcp__github__create_pr title:"feat: Widget chart SignalConso"
```

## 📊 Tableau Récapitulatif

| Serveur | Fonction Principale | Commande Clé |
|---------|-------------------|--------------|
| **dsfr-mcp** | Composants DSFR | `validate_dsfr_html` |
| **ods-widgets** | Création widgets | `create_widget` |
| **prettier** | Formatage | `format` |
| **sequential-thinking** | Planification | `plan` |
| **semgrep** | Sécurité | `scan` |
| **git** | Version control | `commit` |
| **basic-memory** | Mémorisation | `save/get` |
| **knowledge-graph** | Relations | `add_relation` |
| **playwright** | Tests browser | `test` |
| **github** | Intégration repo | `create_issue` |

---

**Note** : Redémarrez Claude Code après l'ajout des serveurs : `exit && claude`