# Guide d'Installation Complète - Widget DSFR

## 🎯 Objectif
Installer et configurer le projet Widget DSFR depuis zéro avec tous les serveurs MCP automatisés.

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

## 🚀 Installation Rapide (Script Automatique)

```bash
# Cloner le dépôt
git clone https://github.com/votre-org/widget-dsfr.git
cd widget-dsfr

# Lancer l'installation automatique
./install.sh

# C'est tout ! Les MCP sont configurés et prêts
```

---

## 📦 Installation Manuelle Détaillée

### Étape 1 : Cloner le projet

```bash
# Créer le répertoire de travail
mkdir -p ~/Desktop
cd ~/Desktop

# Cloner le dépôt
git clone https://github.com/votre-org/widget-dsfr.git
cd widget-dsfr
```

### Étape 2 : Installer les dépendances

```bash
# Installer les dépendances du projet principal
npm install

# Installer les dépendances des serveurs MCP locaux
cd mcp-dsfr && npm install && cd ..
cd mcp-ods-widgets && npm install && cd ..

# Installer les outils globaux optionnels
npm install -g @anthropic-ai/claude-cli  # Pour Claude Code CLI
brew install jq  # Pour Mac - parsing JSON (optionnel)
```

### Étape 3 : Configurer Claude Code CLI

```bash
# Si Claude Code CLI n'est pas installé
npm install -g @anthropic-ai/claude-cli

# Vérifier l'installation
claude --version

# Se connecter (première fois seulement)
claude login
```

### Étape 4 : Configurer Claude Desktop

#### Sur macOS
```bash
# Créer le répertoire de configuration si nécessaire
mkdir -p ~/Library/Application\ Support/Claude

# Copier la configuration MCP
cp config/claude_desktop_config.json ~/Library/Application\ Support/Claude/

# Relancer Claude Desktop pour appliquer
osascript -e 'quit app "Claude"'
sleep 2
open -a Claude
```

#### Sur Windows (WSL2)
```bash
# Copier la configuration dans AppData
cp config/claude_desktop_config.json /mnt/c/Users/$USER/AppData/Roaming/Claude/

# Relancer Claude Desktop depuis Windows
```

#### Sur Linux
```bash
# Créer le répertoire de configuration
mkdir -p ~/.config/Claude

# Copier la configuration
cp config/claude_desktop_config.json ~/.config/Claude/

# Relancer Claude Desktop
pkill -f Claude && sleep 2 && claude-desktop &
```

### Étape 5 : Vérifier l'installation

```bash
# Vérifier les serveurs MCP dans Claude Code
./start-claude.sh

# Lancer Claude Code avec MCP
claude

# Dans Claude, taper:
/mcp list

# Vous devriez voir:
# ✅ dsfr-mcp
# ✅ ods-widgets
# ✅ context7
# ✅ angular-mcp
```

---

## 🔧 Configuration des Serveurs MCP

### Structure des fichiers de configuration

```
widget-dsfr/
├── .mcp.json                    # Config Claude Code (dans le repo)
├── config/
│   └── claude_desktop_config.json  # Template pour Claude Desktop
├── mcp-dsfr/                   # Serveur MCP DSFR local
│   ├── package.json
│   └── src/index.js
├── mcp-ods-widgets/            # Serveur MCP ODS local
│   ├── package.json
│   └── server.js
└── start-claude.sh             # Script de vérification
```

### Personnalisation des chemins (si nécessaire)

Si vous installez dans un répertoire différent, mettez à jour :

1. **`.mcp.json`** (pour Claude Code)
```json
{
  "mcpServers": {
    "dsfr-mcp": {
      "args": ["/VOTRE/CHEMIN/widget-dsfr/mcp-dsfr/src/index.js"]
    }
  }
}
```

2. **`claude_desktop_config.json`** (pour Claude Desktop)
```json
{
  "mcpServers": {
    "dsfr-mcp": {
      "args": ["/VOTRE/CHEMIN/widget-dsfr/mcp-dsfr/src/index.js"]
    }
  }
}
```

---

## 🐛 Résolution des Problèmes Courants

### Problème : "command not found: claude"

**Solution :**
```bash
# Installer Claude CLI
npm install -g @anthropic-ai/claude-cli

# Vérifier le PATH
echo $PATH | grep npm

# Si npm n'est pas dans le PATH
export PATH="$PATH:$(npm bin -g)"
echo 'export PATH="$PATH:$(npm bin -g)"' >> ~/.zshrc
```

### Problème : "MCP servers not connected"

**Solution :**
```bash
# Vérifier les permissions
chmod +x start-claude.sh
chmod +x mcp-dsfr/src/index.js
chmod +x mcp-ods-widgets/server.js

# Vérifier Node.js
which node
node --version

# Tester les serveurs directement
node mcp-dsfr/src/index.js
node mcp-ods-widgets/server.js
```

### Problème : "EACCES permission denied"

**Solution :**
```bash
# Corriger les permissions npm
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}

# Ou utiliser un préfixe local
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

### Problème : Claude Desktop ne voit pas les MCP

**Solution :**
1. Fermer complètement Claude Desktop (Cmd+Q sur Mac)
2. Vérifier le fichier de config :
```bash
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
```
3. S'assurer que les chemins sont absolus et corrects
4. Rouvrir Claude Desktop

---

## ✅ Test de Validation Complète

Après l'installation, exécutez ces tests :

```bash
# 1. Test des serveurs MCP
./start-claude.sh
# Doit afficher : ✅ Tous les serveurs connectés

# 2. Test de génération de widget
claude
# Dans Claude :
Task: widget-generator "Créer une table test"

# 3. Test du dashboard exemple
open examples/signalconso-dashboard-dsfr.html
# Doit ouvrir le dashboard dans le navigateur

# 4. Test VSCode integration
code widget-dsfr.code-workspace
# Puis Cmd+Shift+B pour lancer avec MCP
```

---

## 📚 Ressources d'Aide

### Documentation
- [CLAUDE.md](CLAUDE.md) - Instructions pour Claude
- [AUTOMATISATION_MCP.md](AUTOMATISATION_MCP.md) - Guide MCP détaillé
- [README.md](README.md) - Vue d'ensemble du projet

### Support
- **Issues GitHub** : https://github.com/votre-org/widget-dsfr/issues
- **Documentation DSFR** : https://www.systeme-de-design.gouv.fr/
- **Documentation ODS** : https://help.opendatasoft.com/widgets/

### Commandes d'aide
```bash
# Aide Claude CLI
claude --help

# Liste des serveurs MCP
claude mcp list

# Logs de debug
./start-claude.sh --debug
```

---

## 🎉 Installation Réussie !

Si tout fonctionne, vous devriez voir :

```
✅ Node.js et npm installés
✅ Projet cloné et dépendances installées
✅ Claude Code CLI configuré
✅ 4 serveurs MCP connectés :
   - dsfr-mcp (local)
   - ods-widgets (local)
   - context7 (npm)
   - angular-mcp (npm)
✅ Dashboards exemples fonctionnels
```

**Prochaine étape** : Consultez le [README.md](README.md) pour commencer à générer des widgets !

---

*Guide d'installation v1.0 - Testé sur macOS, Linux Ubuntu, Windows WSL2*