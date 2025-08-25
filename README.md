# Widget DSFR - Générateur de Widgets OpenDataSoft

[![CI](https://github.com/votre-org/widget-dsfr/actions/workflows/ci.yml/badge.svg)](https://github.com/votre-org/widget-dsfr/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![DSFR Compliant](https://img.shields.io/badge/DSFR-Compliant-blue.svg)](https://www.systeme-de-design.gouv.fr/)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

Transformez les widgets OpenDataSoft en composants conformes au Design System France (DSFR) pour une intégration directe dans Drupal.

## 🚀 Installation Rapide

```bash
# Cloner le projet
git clone https://github.com/votre-org/widget-dsfr.git
cd widget-dsfr

# Installer tout l'environnement
./setup.sh
```

## 📋 Prérequis

- **Node.js** 18.0+ ([nodejs.org](https://nodejs.org/))
- **Git** 2.0+ ([git-scm.com](https://git-scm.com/))
- **Claude Desktop** ou **Claude CLI** ([claude.ai](https://claude.ai))

## 🛠 Installation Détaillée

### 1. Installation Standard

```bash
# Installation complète avec toutes les options
./setup.sh
```

### 2. Options d'Installation

```bash
# Installation propre (réinitialise les configurations)
./setup.sh --clean

# Sans Claude CLI (si déjà installé)
./setup.sh --skip-claude-cli

# Sans configuration Claude Desktop
./setup.sh --skip-desktop

# Voir toutes les options
./setup.sh --help
```

### 3. Installation Manuelle

Si le script automatique ne fonctionne pas :

```bash
# 1. Installer les dépendances npm
npm install
cd mcp-dsfr && npm install && cd ..
cd mcp-ods-widgets && npm install && cd ..

# 2. Installer Claude CLI (optionnel)
npm install -g @anthropic-ai/claude-cli

# 3. Lancer Claude Code
claude
```

## 📦 Architecture du Projet

```
widget-dsfr/
├── setup.sh                # Script d'installation unifié
├── mcp-dsfr/              # Serveur MCP DSFR (208 composants)
├── mcp-ods-widgets/       # Serveur MCP ODS Widgets (70+ widgets)
├── agents/                # 4 agents d'automatisation EPCT
├── examples/              # Dashboards et widgets fonctionnels
├── templates/             # Templates HTML DSFR
├── tests/                 # Tests de validation DSFR
│   └── playwright/        # Tests automatisés navigateur
├── memory/                # Mémorisation décisions et relations
├── .mcp.json             # Configuration des 11 serveurs MCP
└── MCP_USAGE_GUIDE.md    # Guide d'utilisation des serveurs
```

## 🎯 Utilisation

### 1. Démarrer Claude Code

```bash
cd widget-dsfr
claude
```

### 2. Vérifier les Serveurs MCP

Dans Claude, tapez :
```
/mcp list
```

Vous devriez voir 11 serveurs :

#### Serveurs Principaux
- ✅ **dsfr-mcp** - Composants DSFR
- ✅ **ods-widgets** - Widgets OpenDataSoft
- ✅ **context7** - Documentation
- ✅ **angular-mcp** - Support Angular

#### Serveurs de Développement
- ✅ **prettier** - Formatage de code
- ✅ **sequential-thinking** - Planification
- ✅ **semgrep** - Analyse de sécurité
- ✅ **git** - Gestion de version

#### Serveurs Avancés
- ✅ **basic-memory** - Mémorisation
- ✅ **knowledge-graph** - Relations widgets
- ✅ **playwright** - Tests navigateur
- ✅ **github** - Intégration GitHub

### 3. Créer un Widget

```
# Créer un tableau DSFR pour SignalConso
mcp__ods-widgets__create_widget type:"table" dataset:"signalconso"

# Valider la conformité DSFR
mcp__dsfr-mcp__validate_dsfr_html html_code:"<votre html>"
```

### 4. Utiliser les Agents

```
# Explorer les widgets disponibles
Task: widget-explorer "Analyser widgets ODS"

# Générer un widget DSFR
Task: widget-generator "Créer graphique pour budget-vert"

# Valider un fichier
Task: dsfr-validator "Valider examples/mon-widget.html"
```

## 📊 Datasets Disponibles

1. **SignalConso** - Signalements consommateurs
2. **Annuaire DGCCRF** - Annuaire des services
3. **Budget Vert** - Budget environnemental PLF25
4. **Tarifs Bancaires** - Tarifs CCSF
5. **Démarches Simplifiées** - Etikraine
6. **Taux de Change** - Taux DGFIP

## 🧪 Tests et Validation

```bash
# Tester un widget spécifique
node tests/validate-dsfr.js examples/mon-widget.html

# Lancer tous les tests
npm test

# Serveur de développement
npm run serve
```

## 📖 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Instructions pour Claude Code
- **[MCP_USAGE_GUIDE.md](MCP_USAGE_GUIDE.md)** - Guide complet des 11 serveurs MCP
- **[TODO.md](TODO.md)** - Liste des widgets à implémenter
- **[AGENTS_ORCHESTRATION.md](AGENTS_ORCHESTRATION.md)** - Guide des agents
- **[MIGRATION.md](MIGRATION.md)** - Guide de migration depuis ancienne version

## 🆘 Dépannage

### Les serveurs MCP ne se connectent pas

```bash
# Réinstaller proprement
./setup.sh --clean

# Vérifier les logs
cat ~/Library/Caches/claude-cli-nodejs/*.log
```

### Claude Desktop ne voit pas les serveurs

1. Exécutez le script de configuration :
   ```bash
   ./configure-claude-desktop.sh
   ```
2. Fermez complètement Claude Desktop (Cmd+Q sur Mac)
3. Rouvrez Claude Desktop
4. Vérifiez l'icône MCP en bas à droite (11 serveurs)

### Erreurs npm audit

Les vulnérabilités signalées sont liées aux anciennes versions d'Angular requises par ODS Widgets. Elles sont nécessaires pour la compatibilité.

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/mon-widget`)
3. Committez vos changements (`git commit -m 'Ajout widget X'`)
4. Push sur la branche (`git push origin feature/mon-widget`)
5. Créez une Pull Request

## 📝 Licence

MIT - Voir [LICENSE](LICENSE)

## 🏆 État du Projet

- ✅ **70+ widgets** OpenDataSoft identifiés
- ✅ **4 agents EPCT** opérationnels
- ✅ **11 serveurs MCP** configurés et opérationnels
- ✅ **15+ widgets** SignalConso implémentés
- ✅ **Score DSFR** : 90-100/100 sur les tests
- 🚧 **En cours** : Migration complète des 55 widgets restants

---

*Développé avec ❤️ pour la transformation numérique de l'État français*