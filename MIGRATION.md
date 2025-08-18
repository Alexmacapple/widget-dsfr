# Guide de Migration - Version 4.0 avec 12 Serveurs MCP

## 🆕 Changements Majeurs v4.0

### Nouveaux Serveurs MCP (8 ajouts)

Le projet passe de 4 à **12 serveurs MCP** pour un environnement de développement professionnel :

| Catégorie | Serveurs Ajoutés | Fonction |
|-----------|-----------------|----------|
| **Développement** | prettier | Formatage automatique du code |
| | sequential-thinking | Planification structurée |
| | semgrep | Analyse de sécurité |
| | git | Gestion de version intégrée |
| **Avancé** | basic-memory | Mémorisation des patterns |
| | knowledge-graph | Relations entre widgets |
| | playwright | Tests navigateur automatisés |
| | github | Intégration GitHub (issues, PRs) |

### Nouveaux Dossiers Créés

```
widget-dsfr/
├── memory/               # NEW: Stockage patterns et décisions
│   └── widget-relations/ # NEW: Knowledge graph data
├── tests/
│   └── playwright/       # NEW: Tests E2E automatisés
```

### Nouveaux Fichiers

- `MCP_USAGE_GUIDE.md` - Guide détaillé des 12 serveurs
- `.semgrep.yml` - Règles de sécurité personnalisées
- `.gitmessage` - Template de commit Git
- `tests/playwright/test-widgets.spec.js` - Tests navigateur

## 📦 Migration depuis v3.0

### 1. Script d'Installation Unifié

```bash
# Migration automatique
./setup.sh --clean

# Ou mise à jour incrémentale
./setup.sh
```

Le script :
- ✅ Configure automatiquement les 12 serveurs
- ✅ Crée les nouveaux dossiers
- ✅ Demande le token GitHub (optionnel)
- ✅ Préserve vos configurations existantes

### 2. Configuration Token GitHub

```bash
# Nouveau prompt interactif lors de l'installation
# Ou manuellement :
echo "GITHUB_PERSONAL_ACCESS_TOKEN=ghp_votre_token" >> .env
```

### 3. Vérification Post-Migration

```bash
# Relancer Claude
exit && cd widget-dsfr && claude

# Vérifier les 12 serveurs
/mcp list

# Devrait afficher :
✅ dsfr-mcp         ✅ prettier
✅ ods-widgets      ✅ sequential-thinking
✅ context7         ✅ semgrep
✅ angular-mcp      ✅ git
                   ✅ basic-memory
                   ✅ knowledge-graph
                   ✅ playwright
                   ✅ github
```

## 🔄 Changements de Workflow

### Ancien Workflow (v3.0)
```bash
# Simple génération
mcp__ods-widgets__create_widget
mcp__dsfr-mcp__validate_dsfr_html
```

### Nouveau Workflow (v4.0)
```bash
# Workflow professionnel complet
mcp__sequential-thinking__plan        # 1. Planifier
mcp__basic-memory__get                # 2. Vérifier patterns
mcp__ods-widgets__create_widget       # 3. Générer
mcp__prettier__format                 # 4. Formater
mcp__semgrep__scan                   # 5. Sécurité
mcp__playwright__test                 # 6. Tester
mcp__git__commit                      # 7. Commiter
mcp__github__create_pr                # 8. PR
```

## ⚠️ Points d'Attention

1. **Hooks Claude** : Le hook `on-file-change` a été supprimé par défaut
2. **Permissions** : Les nouveaux scripts de test nécessitent des permissions d'exécution
3. **Mémoire** : Le dossier `memory/` stocke des données persistantes
4. **GitHub** : Token nécessaire pour utiliser le serveur `github`

## 🆘 Problèmes Courants

### Serveurs non connectés
```bash
./setup.sh --clean
```

### Token GitHub manquant
```bash
# Ajouter dans .env
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_...
```

### Tests Playwright échouent
```bash
# Installer les navigateurs
npx playwright install
```

## 📚 Documentation Mise à Jour

- `CLAUDE.md` v4.0 - Instructions avec 12 serveurs
- `README.md` - Architecture et utilisation complète
- `MCP_USAGE_GUIDE.md` - Guide détaillé de chaque serveur
- `QUICKSTART.md` - Démarrage rapide avec workflow complet

---

*Migration vers v4.0 - Janvier 2025*
*De 4 à 12 serveurs MCP pour un développement professionnel*