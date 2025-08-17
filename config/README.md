# Configuration des Serveurs MCP

Ce dossier contient les templates de configuration pour les serveurs MCP.

## Fichiers

### claude_desktop_config.json
Template de configuration pour Claude Desktop. Le script `install.sh` remplacera automatiquement `CURRENT_DIR` par le chemin absolu de votre installation.

## Installation

Le script d'installation `../install.sh` :
1. Détecte votre système d'exploitation
2. Localise le dossier de configuration Claude Desktop
3. Copie et adapte la configuration avec les bons chemins

## Emplacements par défaut

- **macOS** : `~/Library/Application Support/Claude/`
- **Linux** : `~/.config/Claude/`
- **Windows** : `%APPDATA%\Claude\`

## Configuration manuelle

Si nécessaire, remplacez `CURRENT_DIR` dans `claude_desktop_config.json` par le chemin absolu de votre installation, puis copiez le fichier dans le dossier approprié.