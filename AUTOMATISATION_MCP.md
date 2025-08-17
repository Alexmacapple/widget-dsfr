# Automatisation des Serveurs MCP

## 🚀 Vue d'ensemble

Ce document explique comment automatiser la connexion aux serveurs MCP pour Claude Code et Claude Desktop.

---

## 📦 Claude Code - Automatisation dans le repo

### Configuration automatique via `.mcp.json`

Le fichier `.mcp.json` à la racine du projet configure automatiquement les serveurs MCP :

```json
{
  "mcpServers": {
    "dsfr-mcp": { ... },
    "ods-widgets": { ... },
    "context7": { ... },
    "angular-mcp": { ... }
  }
}
```

**Les serveurs MCP se connectent automatiquement** quand vous lancez `claude` dans le répertoire du projet.

### Script de vérification `start-claude.sh`

Utilisation :
```bash
# Vérifier l'état des serveurs MCP
./start-claude.sh

# Vérifier et lancer Claude Code
./start-claude.sh --start
```

### Intégration VSCode

Ouvrez le workspace avec :
```bash
code widget-dsfr.code-workspace
```

Raccourcis VSCode disponibles :
- **Cmd+Shift+B** : Lance Claude avec MCP (tâche par défaut)
- **Terminal → Run Task** : Plusieurs options MCP disponibles
- **Automatique** : Les MCP se vérifient à l'ouverture du workspace

---

## 🖥️ Claude Desktop - Configuration globale

### Fichier de configuration

Emplacement : `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "dsfr-mcp": {
      "command": "node",
      "args": ["/Users/alex/Desktop/widget-dsfr/mcp-dsfr/src/index.js"]
    },
    // ... autres serveurs
  }
}
```

### Automatisation au démarrage de macOS

#### Option 1 : LaunchAgent (Recommandé)

Créer le fichier `~/Library/LaunchAgents/com.claude.mcp.plist` :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.claude.mcp</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/alex/Desktop/widget-dsfr/start-claude-desktop.sh</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/claude-mcp.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/claude-mcp-error.log</string>
</dict>
</plist>
```

Activer :
```bash
launchctl load ~/Library/LaunchAgents/com.claude.mcp.plist
```

#### Option 2 : Script de démarrage

Créer `~/Desktop/widget-dsfr/start-claude-desktop.sh` :

```bash
#!/bin/bash
# Vérifier que les serveurs MCP sont accessibles
servers=(
    "/Users/alex/Desktop/widget-dsfr/mcp-dsfr/src/index.js"
    "/Users/alex/Desktop/widget-dsfr/mcp-ods-widgets/server.js"
)

for server in "${servers[@]}"; do
    if [ ! -f "$server" ]; then
        echo "⚠️ Serveur MCP manquant: $server"
    fi
done

# Optionnel : lancer Claude Desktop
# open -a "Claude"
```

### Automatisation avec Automator

1. Ouvrir **Automator**
2. Créer une **Application**
3. Ajouter action **Run Shell Script**
4. Coller :
```bash
cd /Users/alex/Desktop/widget-dsfr
./start-claude.sh --start
```
5. Sauvegarder comme "Claude avec MCP"
6. Ajouter aux **Éléments de connexion** dans Préférences Système

---

## 🔍 Vérification et Debug

### Commandes de vérification

```bash
# Claude Code - Lister les serveurs MCP
claude mcp list

# Vérifier la configuration Claude Desktop
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Logs des serveurs MCP
tail -f /tmp/claude-mcp.log

# Tester un serveur MCP directement
node /Users/alex/Desktop/widget-dsfr/mcp-dsfr/src/index.js
```

### Résolution des problèmes

#### Serveurs MCP non connectés

1. **Vérifier les chemins** dans les fichiers de config
2. **Redémarrer** Claude Code/Desktop
3. **Permissions** : `chmod +x` sur les scripts
4. **Dependencies** : `npm install` dans les dossiers MCP

#### Claude Desktop ne voit pas les MCP

1. **Fermer complètement** Claude Desktop (Cmd+Q)
2. **Vérifier** le fichier `claude_desktop_config.json`
3. **Rouvrir** Claude Desktop
4. Les serveurs devraient se connecter automatiquement

---

## 📋 Checklist d'installation

### Pour Claude Code
- [ ] Fichier `.mcp.json` présent à la racine
- [ ] Script `start-claude.sh` exécutable
- [ ] Workspace VSCode configuré
- [ ] Test avec `claude mcp list`

### Pour Claude Desktop
- [ ] Fichier `claude_desktop_config.json` configuré
- [ ] Chemins corrects vers les serveurs MCP
- [ ] Redémarrage de Claude Desktop effectué
- [ ] Serveurs visibles dans l'interface

---

## 🎯 Usage quotidien

### Workflow recommandé

1. **Ouvrir VSCode** avec le workspace
2. **Terminal intégré** lance automatiquement la vérification MCP
3. **Cmd+Shift+B** pour lancer Claude Code avec MCP
4. **Claude Desktop** : Les MCP sont déjà connectés au démarrage

### Commandes rapides

```bash
# Dans le terminal du projet
./start-claude.sh        # Vérifier l'état
./start-claude.sh -s      # Lancer Claude Code

# Dans Claude (slash commands)
/mcp list                 # Lister les serveurs
/mcp status              # État des connexions
```

---

## 🔄 Mise à jour des serveurs MCP

Lors d'une mise à jour :

1. **Modifier** les fichiers de configuration
2. **Redémarrer** Claude Code/Desktop
3. **Vérifier** avec `claude mcp list`

---

*Documentation mise à jour : Session actuelle*
*Compatible avec : Claude Code CLI et Claude Desktop*