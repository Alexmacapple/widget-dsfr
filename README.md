# Widget Builder DSFR - Générateur de Widgets OpenDataSoft

## 🎯 Mission
Porter les 70+ widgets OpenDataSoft en composants conformes au Design System France (DSFR), avec génération de fichiers HTML autonomes directement intégrables dans Drupal.

## 📥 Installation depuis Zéro

### Installation automatique (Recommandé)
```bash
# Cloner et installer en une commande
git clone https://github.com/votre-org/widget-dsfr.git && cd widget-dsfr && ./install.sh
```

### Installation manuelle
Consultez le guide complet : **[INSTALLATION_COMPLETE.md](INSTALLATION_COMPLETE.md)**

### Prérequis
- Node.js 18+ et npm 9+
- Git 2.30+
- Claude Desktop ou Claude Code CLI
- 8 GB RAM, 2 GB d'espace disque

## ✅ État actuel du projet

### Réalisations
- ✅ **Intégration MCP DSFR** locale (migration Docker → Local réussie)
- ✅ **Service DSFRValidator** opérationnel avec mappings ODS→DSFR
- ✅ **4 templates DSFR** créés (table, chart, map, kpi)
- ✅ **Dashboard SignalConso** fonctionnel avec 15+ widgets
- ✅ **Tests d'intégration** 5/5 réussis (score DSFR : 90-100/100)

### Architecture simplifiée
```
widget-dsfr/
├── mcp-dsfr/              # MCP DSFR local (25MB, 213 docs)
├── mcp-ods-widgets/       # MCP ODS Widgets avec DSFRValidator
├── examples/              # Dashboards et widgets fonctionnels
├── agents/                # Agents d'automatisation
└── templates/             # Templates HTML DSFR
```

## 🚀 Quick Start

### 1. Installation et configuration automatique

#### Avec Claude Code (CLI)
```bash
# Dans le répertoire du projet
cd /Users/alex/Desktop/widget-dsfr

# Vérifier l'état des serveurs MCP
./start-claude.sh

# Lancer Claude Code avec MCP pré-connectés
./start-claude.sh --start
# ou simplement
claude
```

#### Avec VSCode
```bash
# Ouvrir le workspace avec automatisation
code widget-dsfr.code-workspace
# Puis Cmd+Shift+B pour lancer Claude avec MCP
```

#### Avec Claude Desktop
Les serveurs MCP se connectent automatiquement au démarrage.
Configuration dans : `~/Library/Application Support/Claude/claude_desktop_config.json`

### 2. Utilisation des widgets

#### Ouvrir un dashboard existant
```bash
open examples/signalconso-dashboard-dsfr.html
```

#### Générer un nouveau widget
```bash
# Dans Claude Code, utiliser les commandes MCP
/mcp list                     # Lister les serveurs disponibles

# Générer via MCP ODS-Widgets
mcp__ods-widgets__create_widget type:"table" dataset:"signalconso"

# Ou via l'agent Task
Task: widget-generator "Créer table DSFR pour signalconso"
```

#### Valider la conformité DSFR
```bash
# Via MCP DSFR
mcp__dsfr-mcp__validate_dsfr_html html_code:"<votre html>"

# Ou via l'agent Task
Task: dsfr-validator "Valider signalconso-table-001.html"
```

## 📦 Serveurs MCP configurés

| Serveur | Status | Rôle | Commandes principales |
|---------|--------|------|----------------------|
| **dsfr-mcp** | ✅ Local | 208 composants DSFR, validation RGAA | `validate_dsfr_html`, `generate_dsfr_component`, `check_accessibility` |
| **ods-widgets** | ✅ Local | 70+ widgets ODS, intégration DSFR | `create_widget`, `analyze_dataset`, `generate_dashboard` |
| **context7** | ✅ NPM | Documentation et patterns | `resolve-library-id`, `get-library-docs` |
| **angular-mcp** | ✅ NPM | Support Angular/Kendo UI | `kendo_angular_assistant` |

### Automatisation des serveurs MCP

Les serveurs MCP se connectent automatiquement grâce à :
- **`.mcp.json`** : Configuration pour Claude Code (dans le repo)
- **`claude_desktop_config.json`** : Configuration pour Claude Desktop
- **`start-claude.sh`** : Script de vérification et lancement
- **`widget-dsfr.code-workspace`** : Intégration VSCode

## 📊 Widgets supportés (70+)

### Catégories principales
- **Visualisation** : table, chart, map, gauge, timeline
- **Filtrage** : facets, searchbox, dateRange
- **Analyse** : aggregation, crossTable, kpi
- **Export** : CSV, Excel, GeoJSON

## 🏗️ Technologies

- **Frontend** : Angular.js 1.8.2, DSFR 1.14.0, ODS Widgets v2
- **Backend** : Node.js avec Model Context Protocol (MCP)
- **Validation** : RGAA niveau AA, score DSFR 90-100/100

## 📚 Documentation essentielle

- **[CLAUDE.md](CLAUDE.md)** - Instructions pour Claude Code
- **[AUTOMATISATION_MCP.md](AUTOMATISATION_MCP.md)** - Guide complet d'automatisation MCP
- **[ARCHITECTURE_HTML_SIMPLE.md](ARCHITECTURE_HTML_SIMPLE.md)** - Architecture actuelle
- **[INTEGRATION_MCP_DSFR.md](INTEGRATION_MCP_DSFR.md)** - Guide d'intégration
- **[GUIDE_EPCT.md](GUIDE_EPCT.md)** - Méthode de développement
- **[AGENTS_ORCHESTRATION.md](AGENTS_ORCHESTRATION.md)** - Orchestration des agents

## 🎯 Prochaines étapes

1. Migration des 70+ widgets restants
2. Création d'une interface de génération
3. Tests d'intégration Drupal
4. Documentation utilisateur finale

## 📈 Métriques

- **Widgets portés** : 15/70+ (21%)
- **Score DSFR moyen** : 95/100
- **Performance** : Migration Docker→Local = 10x plus rapide
- **Taille optimisée** : 25MB (vs 178MB initial)

## 🛠️ Commandes utiles

### Claude Code (CLI)
```bash
# Navigation et état
claude mcp list              # Lister les serveurs MCP
claude mcp status            # État des connexions
/mcp list                    # Dans Claude, lister les MCP

# Génération de widgets
Task: widget-explorer "Analyser widgets ODS"
Task: widget-generator "Créer [type] pour [dataset]"
Task: dsfr-validator "Valider [fichier].html"
Task: migration-assistant "Migration batch widgets"

# Workflow EPCT
/epct [description de la tâche]
```

### Scripts d'automatisation
```bash
./start-claude.sh            # Vérifier l'état des MCP
./start-claude.sh --start    # Lancer Claude avec MCP
code widget-dsfr.code-workspace  # VSCode avec automatisation
```

### Raccourcis VSCode
- **Cmd+Shift+B** : Lancer Claude avec MCP
- **Terminal → Run Task** : Diverses tâches MCP
- **Cmd+Shift+P** : Palette de commandes

## 🔧 Configuration

- **`.mcp.json`** : Configuration des serveurs MCP pour Claude Code
- **`claude_desktop_config.json`** : Configuration pour Claude Desktop
- **`widget-dsfr.code-workspace`** : Workspace VSCode avec automatisation
- **`start-claude.sh`** : Script de vérification et lancement

## 🐛 Dépannage

### Serveurs MCP non connectés
```bash
# Vérifier la configuration
cat .mcp.json

# Tester un serveur directement
node mcp-dsfr/src/index.js
node mcp-ods-widgets/server.js

# Relancer Claude
exit
claude
```

### Claude Desktop ne voit pas les MCP
1. Fermer complètement Claude Desktop (Cmd+Q)
2. Vérifier `~/Library/Application Support/Claude/claude_desktop_config.json`
3. Rouvrir Claude Desktop

## 📝 Licence

Ministère de l'Économie, des Finances et de la Souveraineté industrielle et numérique

---

*Version 2.1 - Projet en production active avec automatisation MCP*