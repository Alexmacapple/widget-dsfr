# Guide d'Installation Complète - Widget DSFR v4.1

## 🎯 Objectif
Installer et configurer le projet Widget DSFR avec les 11 serveurs MCP pour un environnement de développement professionnel complet.

---

## 📋 Prérequis Système

### Minimum requis
- **macOS** 12+ / **Linux** Ubuntu 20.04+ / **Windows** 10+ avec WSL2
- **Node.js** 18.0+ et npm 9.0+
- **Git** 2.30+
- **Claude Desktop** ou **Claude Code CLI**
- **8 GB RAM** minimum (16 GB recommandé)
- **2 GB d'espace disque**

### Vérification des prérequis
```bash
# Vérifier Node.js
node --version  # Doit afficher v18.0.0 ou plus

# Vérifier npm
npm --version   # Doit afficher 9.0.0 ou plus

# Vérifier Git
git --version   # Doit afficher 2.30 ou plus
```

---

## 🚀 Installation Automatique (Recommandée)

```bash
# Cloner le dépôt
git clone https://github.com/votre-org/widget-dsfr.git
cd widget-dsfr

# Lancer l'installation complète
./install-mcp-complete.sh
```

### Options d'installation
```bash
# Le script gère automatiquement :
# - Installation des dépendances Node.js
# - Installation des 11 serveurs MCP
# - Configuration de Claude Desktop/Code
# - Installation de Semgrep (macOS/Linux)

# Sans configurer Claude Desktop
./setup.sh --skip-desktop

# Voir l'aide
./setup.sh --help
```

---

## 📦 Installation Manuelle Détaillée

### Étape 1 : Cloner et préparer
```bash
git clone https://github.com/votre-org/widget-dsfr.git
cd widget-dsfr
```

### Étape 2 : Installer les dépendances
```bash
# Dépendances principales
npm install

# MCP DSFR
cd mcp-dsfr && npm install && cd ..

# MCP ODS Widgets
cd mcp-ods-widgets && npm install && cd ..
```

### Étape 3 : Créer les dossiers nécessaires
```bash
mkdir -p .claude .claude/hooks
mkdir -p memory/widget-relations
mkdir -p tests/playwright
```

### Étape 4 : Installer Claude CLI (si nécessaire)
```bash
npm install -g @anthropic-ai/claude-cli
```

### Étape 5 : Configurer les serveurs MCP
Créer `.mcp.json` avec les 12 serveurs (voir le contenu dans setup.sh).

### Étape 6 : Configuration GitHub (optionnel)
```bash
# Créer un token sur https://github.com/settings/tokens
echo "GITHUB_PERSONAL_ACCESS_TOKEN=ghp_votre_token" >> .env
```

---

## 🔧 Configuration des 12 Serveurs MCP

### Serveurs Core (4)
1. **dsfr-mcp** - Composants et validation DSFR
2. **ods-widgets** - Génération de widgets OpenDataSoft
3. **context7** - Documentation à jour
4. **angular-mcp** - Support Angular/Kendo

### Serveurs Développement (4)
5. **prettier** - Formatage automatique du code
6. **sequential-thinking** - Planification structurée
7. **semgrep** - Analyse de sécurité
8. **git** - Gestion de version intégrée

### Serveurs Avancés (4)
9. **basic-memory** - Mémorisation des patterns
10. **knowledge-graph** - Relations entre widgets
11. **playwright** - Tests navigateur automatisés
12. **github** - Intégration GitHub

---

## ✅ Vérification de l'Installation

### 1. Lancer Claude Code
```bash
cd widget-dsfr
claude
```

### 2. Vérifier les serveurs MCP
```
/mcp list
```

Vous devriez voir les 12 serveurs avec le statut ✅ connected.

### 3. Tester un serveur
```bash
# Tester la génération DSFR
mcp__dsfr-mcp__list_dsfr_categories

# Tester la planification
mcp__sequential-thinking__plan task:"Test installation"
```

---

## 🛠 Configuration Claude Desktop

### macOS
Le fichier est créé automatiquement dans :
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

### Linux
```
~/.config/Claude/claude_desktop_config.json
```

### Windows
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Important** : Redémarrez Claude Desktop après l'installation.

---

## 📁 Structure Créée

```
widget-dsfr/
├── .claude/
│   ├── settings.json         # Configuration Claude Code
│   └── hooks/               # Hooks personnalisés
├── memory/
│   └── widget-relations/    # Knowledge graph data
├── tests/
│   └── playwright/          # Tests E2E
├── .mcp.json               # Configuration 12 serveurs
├── .env                    # Variables d'environnement
├── .semgrep.yml           # Règles de sécurité
└── .gitmessage           # Template commits Git
```

---

## 🚨 Dépannage

### Problème : Serveurs MCP non connectés
```bash
# Solution 1 : Réinstallation propre
./setup.sh --clean

# Solution 2 : Vérifier les logs
cat ~/Library/Caches/claude-cli-nodejs/*.log
```

### Problème : Token GitHub manquant
```bash
echo "GITHUB_PERSONAL_ACCESS_TOKEN=ghp_..." >> .env
source .env
```

### Problème : Tests Playwright échouent
```bash
# Installer les navigateurs
npx playwright install
```

### Problème : Permission denied
```bash
chmod +x setup.sh
chmod +x .claude/hooks/*
```

---

## 🎯 Prochaines Étapes

1. **Lire la documentation**
   - `MCP_USAGE_GUIDE.md` - Guide des 12 serveurs
   - `CLAUDE.md` - Instructions complètes
   - `QUICKSTART.md` - Démarrage rapide

2. **Créer votre premier widget**
   ```bash
   mcp__sequential-thinking__plan task:"Créer widget table"
   mcp__ods-widgets__create_widget type:"table" dataset:"signalconso"
   ```

3. **Explorer les exemples**
   ```bash
   npm run serve
   # Ouvrir http://localhost:8000/examples/
   ```

---

## 📞 Support

- **Issues GitHub** : https://github.com/votre-org/widget-dsfr/issues
- **Documentation Claude** : https://docs.anthropic.com/claude-code
- **DSFR** : https://www.systeme-de-design.gouv.fr/

---

*Installation complète v4.0 - Janvier 2025*
*12 serveurs MCP pour un développement professionnel*