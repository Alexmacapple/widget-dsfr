# Widget DSFR - Guide de Démarrage Rapide

## 🚀 Installation en 30 secondes

```bash
git clone https://github.com/votre-org/widget-dsfr.git
cd widget-dsfr
./setup.sh
```

## ✅ Vérification

```bash
# Lancer Claude Code
claude

# Dans Claude, vérifier les 12 serveurs
/mcp list
```

Vous devriez voir :
- ✅ dsfr-mcp, ods-widgets, context7, angular-mcp
- ✅ prettier, sequential-thinking, semgrep, git
- ✅ basic-memory, knowledge-graph, playwright, github

## 🎯 Premier Widget avec Workflow Complet

```bash
# 1. Planifier la tâche
mcp__sequential-thinking__plan task:"Créer tableau SignalConso"

# 2. Générer le widget
mcp__ods-widgets__create_widget type:"table" dataset:"signalconso"

# 3. Valider
mcp__dsfr-mcp__validate_dsfr_html html_code:"[contenu]"

# 4. Tester la sécurité
mcp__semgrep__scan file:"examples/signalconso-table.html"

# 5. Sauvegarder le pattern
mcp__basic-memory__save key:"table-pattern" value:"fr-table avec tri"
```

## 📖 Documentation Essentielle

- **[MCP_USAGE_GUIDE.md](MCP_USAGE_GUIDE.md)** - Guide des 11 serveurs MCP
- **[CLAUDE.md](CLAUDE.md)** - Instructions complètes
- **[README.md](README.md)** - Vue d'ensemble

## 🆘 Problème ?

```bash
# Réinstallation propre
./setup.sh --clean

# Token GitHub manquant ?
echo "GITHUB_PERSONAL_ACCESS_TOKEN=ghp_..." >> .env
```

---

**Astuce** : Utilisez `mcp__` + Tab pour l'autocomplétion des commandes MCP !