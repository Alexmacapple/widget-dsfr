# Intégration des Nouveaux MCP avec les Agents

## Vue d'ensemble

Ce document décrit comment les 11 serveurs MCP peuvent être intégrés avec les 4 agents d'orchestration pour améliorer le workflow de migration des widgets.

## Matrice d'Intégration Agents × MCP

| Agent | MCP Utilisés | Nouveaux MCP à Intégrer | Bénéfices |
|-------|-------------|------------------------|-----------|
| **Widget Explorer** | dsfr-mcp, ods-widgets | sequential-thinking, basic-memory | Planification intelligente, mémorisation patterns |
| **Widget Generator** | dsfr-mcp, ods-widgets | git, context7 | Versioning automatique, docs frameworks |
| **DSFR Validator** | dsfr-mcp | playwright, semgrep | Tests navigateur, sécurité |
| **Migration Assistant** | Tous les agents | basic-memory, knowledge-graph, github | Orchestration intelligente, tracking |

## Améliorations Proposées par Agent

### 1. Widget Explorer - Enrichissement

```bash
# Avant (basique)
Task: widget-explorer "Analyser widget table"

# Après (avec MCP)
Task: widget-explorer "Analyser widget table avec mémorisation"
  ├── mcp__sequential-thinking__plan : Planifier l'analyse
  ├── mcp__ods-widgets__analyze : Analyser structure
  ├── mcp__basic-memory__save : Mémoriser patterns trouvés
  └── mcp__knowledge-graph__add_relation : Documenter relations
```

### 2. Widget Generator - Qualité Code

```bash
# Workflow amélioré
Task: widget-generator "Créer table DSFR pour signalconso"
  ├── mcp__context7__get-library-docs : Vérifier docs Angular/DSFR
  ├── mcp__ods-widgets__create_widget : Générer widget
  ├── mcp__dsfr-mcp__generate_dsfr_component : Wrapper DSFR
  └── mcp__git__commit : Versionner le widget
```

### 3. DSFR Validator - Tests Complets

```bash
# Validation enrichie
Task: dsfr-validator "Valider signalconso-table.html"
  ├── mcp__dsfr-mcp__validate_dsfr_html : Validation DSFR
  ├── mcp__dsfr-mcp__check_accessibility : Test RGAA
  ├── mcp__semgrep__scan : Analyse sécurité
  ├── mcp__playwright__test : Test navigateur réel
  └── mcp__basic-memory__save : Sauver résultats validation
```

### 4. Migration Assistant - Orchestration Intelligente

```bash
# Orchestration avancée
Task: migration-assistant "Migration batch widgets"
  ├── mcp__sequential-thinking__plan : Planifier migration
  ├── mcp__knowledge-graph__query : Analyser dépendances
  ├── mcp__basic-memory__get : Récupérer patterns connus
  ├── Pour chaque widget:
  │   ├── Agents spécialisés avec MCP
  │   └── mcp__git__commit : Commit par batch
  ├── mcp__github__create_issue : Créer issues pour problèmes
  └── mcp__github__create_pr : PR de migration
```

## Nouveaux Workflows avec MCP

### Workflow 1: Migration avec Mémorisation

```javascript
// 1. Début migration
mcp__sequential-thinking__plan({
  task: "Migrer 70 widgets ODS vers DSFR",
  steps: ["Explorer", "Planifier", "Générer", "Valider"]
});

// 2. Mémoriser patterns
mcp__basic-memory__save({
  key: "pattern-table-sorting",
  value: "Utiliser fr-table__sort avec aria-labels"
});

// 3. Créer relations
mcp__knowledge-graph__add_relation({
  from: "ods-table",
  to: "fr-table",
  type: "transforms_to",
  properties: { complexity: "simple", reusable: true }
});
```

### Workflow 2: Tests Automatisés

```javascript
// Test complet d'un widget
async function testWidget(widgetPath) {
  // 1. Validation statique
  const dsfr = await mcp__dsfr-mcp__validate_dsfr_html({
    html_code: readFile(widgetPath)
  });
  
  // 2. Test navigateur
  const browser = await mcp__playwright__test({
    file: widgetPath,
    tests: ["accessibility", "responsive", "interactions"]
  });
  
  // 3. Analyse sécurité
  const security = await mcp__semgrep__scan({
    file: widgetPath
  });
  
  return { dsfr, browser, security };
}
```

### Workflow 3: Documentation Automatique

```javascript
// Générer documentation
async function generateDocs(widget) {
  // 1. Récupérer docs framework
  const angularDocs = await mcp__context7__get_library_docs({
    library: "angular",
    topic: widget.type
  });
  
  // 2. Exporter docs DSFR
  const dsfrDocs = await mcp__dsfr-mcp__export_documentation({
    components: [widget.dsfr_component],
    format: "markdown"
  });
  
  // 3. Créer issue GitHub
  await mcp__github__create_issue({
    title: `Documentation ${widget.name}`,
    body: combineDocs(angularDocs, dsfrDocs)
  });
}
```

## Configuration Recommandée

### Variables d'environnement (.env)

```bash
# GitHub Integration
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxx

# Memory paths
MEMORY_PATH=/Users/alex/Desktop/widget-dsfr/memory
KNOWLEDGE_GRAPH_PATH=/Users/alex/Desktop/widget-dsfr/memory/widget-relations

# Test configuration
PLAYWRIGHT_BROWSERS_PATH=/Users/alex/Desktop/widget-dsfr/browsers
SEMGREP_RULES_PATH=/Users/alex/Desktop/widget-dsfr/.semgrep.yml
```

### Mise à jour AGENTS_ORCHESTRATION.md

Ajouter dans la section "Communication Inter-Agents":

```json
{
  "mcp_services": {
    "memory": "basic-memory",
    "graph": "knowledge-graph",
    "test": "playwright",
    "security": "semgrep",
    "version": "git",
    "docs": "context7",
    "github": "github"
  }
}
```

## Commandes Enrichies

### Migration avec tous les MCP

```bash
# Migration complète avec orchestration MCP
/epct migrate-all-widgets --with-mcp

# Ce qui active:
- Planification avec sequential-thinking
- Mémorisation avec basic-memory
- Relations avec knowledge-graph
- Tests avec playwright
- Sécurité avec semgrep
- Versioning avec git
- Documentation avec context7
- Issues/PR avec github
```

### Commandes unitaires MCP

```bash
# Mémoriser un pattern
Task: memory-save "pattern-table-responsive" "Utiliser fr-table--no-scroll sur mobile"

# Créer relation widget
Task: graph-relate "ods-chart" "fr-chart" "transforms_to"

# Tester dans navigateur
Task: playwright-test "examples/signalconso-table.html"

# Analyser sécurité
Task: semgrep-scan "examples/*.html"
```

## Résolution des Erreurs MCP

### Pour les MCP en erreur (git, playwright):

1. **Vérifier npx**:
```bash
npx --version  # Doit être 7.0.0+
```

2. **Tester directement**:
```bash
npx -y mcp-git --version
npx -y @playwright/mcp --version
```

3. **Si erreur persiste**, installer localement:
```bash
npm install -g mcp-git
npm install -g @playwright/mcp
```

## Bénéfices de l'Intégration

1. **Qualité**: Code formaté, testé, sécurisé
2. **Traçabilité**: Versioning, mémorisation, documentation
3. **Efficacité**: Réutilisation patterns, parallélisation
4. **Fiabilité**: Tests automatisés, validation continue
5. **Collaboration**: Issues/PR automatiques, docs à jour

## Prochaines Étapes

1. ✅ Tous les serveurs MCP sont maintenant connectés
2. ⏳ Mettre à jour les 4 agents avec intégrations MCP
3. ⏳ Créer workflows automatisés utilisant tous les MCP
4. ⏳ Documenter les nouveaux patterns dans CLAUDE.md