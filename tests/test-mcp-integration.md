# Tests d'Intégration MCP avec Agents

## Vue d'ensemble

Ce document contient des workflows de test pour valider l'intégration des 12 serveurs MCP avec les 4 agents d'orchestration.

## Tests par Agent

### 1. Test Widget Explorer avec MCP

```bash
# Test 1: Explorer avec planification
Task: widget-explorer "Analyser widget table avec planification MCP"

# Workflow attendu:
# 1. mcp__sequential-thinking__plan : Planifier l'analyse
# 2. Explorer le widget
# 3. mcp__basic-memory__save : Sauvegarder patterns trouvés
# 4. mcp__knowledge-graph__add_node : Documenter le widget

# Vérification:
mcp__basic-memory__get key:"widget-table-patterns"
mcp__knowledge-graph__query pattern:"MATCH (w:Widget {name:'table'}) RETURN w"
```

### 2. Test Widget Generator avec MCP

```bash
# Test 2: Générer widget avec tous les MCP
Task: widget-generator "Créer table DSFR pour signalconso avec MCP complet"

# Workflow attendu:
# 1. mcp__context7__resolve-library-id libraryName:"angular"
# 2. mcp__basic-memory__get key:"table-pattern-*"
# 3. mcp__ods-widgets__create_widget
# 4. mcp__dsfr-mcp__generate_dsfr_component
# 5. mcp__basic-memory__save : Nouveau pattern
# 6. mcp__knowledge-graph__add_relation

# Vérification:
Read examples/signalconso-table-mcp.html
```

### 3. Test DSFR Validator avec MCP

```bash
# Test 3: Validation complète avec MCP
Task: dsfr-validator "Valider signalconso-table.html avec tous les tests MCP"

# Workflow attendu:
# 1. mcp__dsfr-mcp__validate_dsfr_html
# 2. mcp__dsfr-mcp__check_accessibility
# 3. mcp__basic-memory__save : Erreurs trouvées
# 4. mcp__knowledge-graph__add_relation : Documenter validation

# Si playwright fonctionne:
# - mcp__playwright__test

# Si semgrep fonctionne:
# - mcp__semgrep__scan

# Vérification:
mcp__basic-memory__get key:"validation-errors-*"
```

### 4. Test Migration Assistant avec MCP

```bash
# Test 4: Migration batch avec orchestration MCP
Task: migration-assistant "Migrer 3 widgets tests avec orchestration MCP complète"

# Widgets tests: table, chart, facets

# Workflow attendu:
# 1. mcp__sequential-thinking__plan
# 2. mcp__knowledge-graph__create_entities : Widgets à migrer
# 3. Pour chaque widget:
#    - Explorer avec MCP
#    - Générer avec MCP
#    - Valider avec MCP
#    - mcp__basic-memory__save : Patterns
# 4. mcp__github__create_issue : Si problèmes
# 5. Rapport final

# Vérification:
mcp__knowledge-graph__read_graph
mcp__basic-memory__list pattern:"migration-*"
```

## Tests d'Intégration Complète

### Test 5: Workflow EPCT Complet avec MCP

```bash
# Explorer
Task: widget-explorer "Explorer tous widgets examples/ avec MCP"

# Planifier
mcp__sequential-thinking__sequentialthinking thought:"Planifier migration widgets explorés"

# Coder
Task: widget-generator "Générer widgets DSFR depuis exploration"

# Tester
Task: dsfr-validator "Valider tous widgets générés"

# Vérifier mémoire
mcp__basic-memory__list
mcp__knowledge-graph__search_nodes query:"widget"
```

### Test 6: Mémorisation et Réutilisation

```bash
# Premier widget
Task: widget-generator "Créer table pour signalconso"
mcp__basic-memory__save key:"table-signalconso-solution" value:"[HTML généré]"

# Deuxième widget similaire
mcp__basic-memory__get key:"table-signalconso-solution"
Task: widget-generator "Créer table pour budget-vert en réutilisant pattern mémorisé"

# Vérifier réutilisation
mcp__basic-memory__list pattern:"table-*"
```

### Test 7: Relations et Dépendances

```bash
# Créer graphe de widgets
mcp__knowledge-graph__create_entities entities:[
  {name:"dashboard-signalconso", entityType:"Dashboard", observations:["Contient 5 widgets"]},
  {name:"table-signalconso", entityType:"Widget", observations:["Type table"]},
  {name:"chart-signalconso", entityType:"Widget", observations:["Type chart"]}
]

# Créer relations
mcp__knowledge-graph__create_relations relations:[
  {from:"dashboard-signalconso", to:"table-signalconso", relationType:"contains"},
  {from:"dashboard-signalconso", to:"chart-signalconso", relationType:"contains"}
]

# Requêter
mcp__knowledge-graph__query pattern:"MATCH (d:Dashboard)-[:contains]->(w:Widget) RETURN d,w"
```

## Tests de Robustesse

### Test 8: Gestion d'Erreurs MCP

```bash
# Tester avec MCP en erreur
Task: widget-generator "Générer widget même si certains MCP échouent"

# Devrait:
# - Détecter MCP en erreur (git, prettier, playwright)
# - Continuer avec MCP disponibles
# - Logger les erreurs
# - Compléter la tâche

# Vérification manuelle des logs
```

### Test 9: Performance avec MCP

```bash
# Mesurer temps avec/sans MCP
time Task: widget-generator "Créer table simple sans MCP"
time Task: widget-generator "Créer table avec tous MCP actifs"

# Comparer:
# - Temps d'exécution
# - Qualité du résultat
# - Informations mémorisées
```

## Checklist de Validation

### MCP Fonctionnels ✅
- [x] dsfr-mcp
- [x] ods-widgets
- [x] context7
- [x] angular-mcp
- [x] sequential-thinking
- [x] basic-memory
- [x] knowledge-graph
- [x] github

### MCP en Erreur 🔴
- [ ] git
- [ ] prettier
- [ ] playwright
- [ ] semgrep (pas configuré)

### Intégrations Testées
- [ ] Widget Explorer + MCP
- [ ] Widget Generator + MCP
- [ ] DSFR Validator + MCP
- [ ] Migration Assistant + MCP
- [ ] Workflow EPCT complet
- [ ] Mémorisation patterns
- [ ] Graphe de relations
- [ ] Gestion erreurs
- [ ] Performance

## Commandes de Test Rapide

```bash
# Test minimal
Task: widget-generator "Test MCP table simple"

# Test complet
Task: migration-assistant "Test migration complète 3 widgets avec tous MCP"

# Vérifier état
mcp__basic-memory__list
mcp__knowledge-graph__read_graph
```

## Résultats Attendus

1. **Agents fonctionnent** même si certains MCP échouent
2. **Patterns mémorisés** réutilisables
3. **Relations documentées** dans le graphe
4. **Performance acceptable** (<30s par widget)
5. **Logs clairs** sur MCP utilisés/échoués