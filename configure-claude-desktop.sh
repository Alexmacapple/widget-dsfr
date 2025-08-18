#!/bin/bash

# Script pour configurer Claude Desktop avec les 11 serveurs MCP
# Version 4.1 - Configuration mise à jour
# Usage: ./configure-claude-desktop.sh

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Configuration de Claude Desktop pour Widget DSFR v4.1${NC}"
echo -e "${BLUE}======================================================${NC}"

# Détection de l'OS
OS="unknown"
CONFIG_DIR=""

if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
    CONFIG_DIR="$HOME/Library/Application Support/Claude"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
    CONFIG_DIR="$HOME/.config/Claude"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
    OS="Windows"
    CONFIG_DIR="$APPDATA/Claude"
fi

echo -e "${GREEN}✓${NC} Système détecté : $OS"

if [ "$OS" == "unknown" ] || [ -z "$CONFIG_DIR" ]; then
    echo -e "${RED}✗${NC} Système non supporté"
    exit 1
fi

# Créer le répertoire si nécessaire
mkdir -p "$CONFIG_DIR"

# Sauvegarder la configuration existante
if [ -f "$CONFIG_DIR/claude_desktop_config.json" ]; then
    BACKUP_FILE="$CONFIG_DIR/claude_desktop_config.backup.$(date +%Y%m%d_%H%M%S).json"
    cp "$CONFIG_DIR/claude_desktop_config.json" "$BACKUP_FILE"
    echo -e "${GREEN}✓${NC} Configuration existante sauvegardée dans :"
    echo "  $BACKUP_FILE"
fi

# Obtenir le chemin absolu du projet
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Copier la configuration
echo -e "\n${YELLOW}Configuration des 11 serveurs MCP...${NC}"

# Créer la configuration avec les chemins corrects
cat > "$CONFIG_DIR/claude_desktop_config.json" << EOF
{
  "mcpServers": {
    "dsfr-mcp": {
      "command": "node",
      "args": [
        "$PROJECT_DIR/mcp-dsfr/src/index.js"
      ],
      "env": {
        "NODE_ENV": "production",
        "MCP_CLIENT": "true"
      }
    },
    "ods-widgets": {
      "command": "node",
      "args": [
        "$PROJECT_DIR/mcp-ods-widgets/server.js"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    },
    "context7": {
      "command": "npx",
      "args": [
        "-y",
        "@upstash/context7-mcp@latest"
      ]
    },
    "angular-mcp": {
      "command": "npx",
      "args": [
        "@progress/kendo-angular-mcp"
      ]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sequential-thinking"
      ]
    },
    "semgrep": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-server-semgrep"
      ]
    },
    "git": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-git"
      ]
    },
    "basic-memory": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-memory"
      ]
    },
    "knowledge-graph": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-knowledge-graph"
      ],
      "env": {
        "MEMORY_PATH": "$PROJECT_DIR/memory/widget-relations"
      }
    },
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp"
      ]
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN:-}"
      }
    }
  }
}
EOF

echo -e "${GREEN}✓${NC} Configuration créée dans :"
echo "  $CONFIG_DIR/claude_desktop_config.json"

# Vérifier si .env existe et contient le token GitHub
if [ -f "$PROJECT_DIR/.env" ] && grep -q "GITHUB_PERSONAL_ACCESS_TOKEN" "$PROJECT_DIR/.env"; then
    echo -e "${GREEN}✓${NC} Token GitHub détecté dans .env"
else
    echo -e "${YELLOW}⚠${NC}  Token GitHub non configuré"
    echo "  Pour utiliser le serveur GitHub, ajoutez dans .env :"
    echo "  GITHUB_PERSONAL_ACCESS_TOKEN=ghp_votre_token"
fi

echo -e "\n${BLUE}Liste des 11 serveurs MCP configurés :${NC}"
echo ""
echo -e "${GREEN}Serveurs Locaux (2) :${NC}"
echo "  ✅ dsfr-mcp           - Composants et validation DSFR"
echo "  ✅ ods-widgets        - Widgets OpenDataSoft"
echo ""
echo -e "${GREEN}Documentation & Support (2) :${NC}"
echo "  ✅ context7           - Documentation à jour"
echo "  ✅ angular-mcp        - Support Angular/Kendo"
echo ""
echo -e "${GREEN}Outils de Développement (3) :${NC}"
echo "  ✅ sequential-thinking - Planification de tâches"
echo "  ✅ semgrep            - Analyse de sécurité"
echo "  ✅ git                - Gestion de version"
echo ""
echo -e "${GREEN}Fonctionnalités Avancées (4) :${NC}"
echo "  ✅ basic-memory       - Mémorisation des patterns"
echo "  ✅ knowledge-graph    - Relations widgets/composants"
echo "  ✅ playwright         - Tests automatisés"
echo "  ✅ github             - Intégration GitHub"

echo -e "\n${GREEN}✅ Configuration terminée !${NC}"
echo -e "\n${YELLOW}Actions requises :${NC}"
echo "  1. Fermez complètement Claude Desktop (Cmd+Q sur Mac)"
echo "  2. Rouvrez Claude Desktop"
echo "  3. Vérifiez l'icône MCP en bas à droite"
echo ""
echo "Les 11 serveurs devraient apparaître connectés."
echo ""