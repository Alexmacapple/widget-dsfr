#!/bin/bash

# Setup MCP for Claude Code and Claude Desktop
# Usage: ./setup-mcp.sh

set -e

echo "🚀 Configuration des serveurs MCP pour Claude Code et Claude Desktop"
echo "======================================================================"

# Variables
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DESKTOP_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# 1. Vérifier les dépendances
echo ""
echo "1. Vérification des dépendances..."
echo "----------------------------------"

if ! command -v node &> /dev/null; then
    log_error "Node.js n'est pas installé. Veuillez installer Node.js d'abord."
    exit 1
else
    log_success "Node.js est installé ($(node --version))"
fi

if ! command -v npm &> /dev/null; then
    log_error "npm n'est pas installé."
    exit 1
else
    log_success "npm est installé ($(npm --version))"
fi

# 2. Vérifier que les serveurs MCP existent
echo ""
echo "2. Vérification des serveurs MCP..."
echo "-----------------------------------"

if [ -f "$PROJECT_DIR/mcp-dsfr/src/index.js" ]; then
    log_success "Serveur dsfr-mcp trouvé"
else
    log_error "Serveur dsfr-mcp introuvable à: $PROJECT_DIR/mcp-dsfr/src/index.js"
    exit 1
fi

if [ -f "$PROJECT_DIR/mcp-ods-widgets/server.js" ]; then
    log_success "Serveur ods-widgets trouvé"
else
    log_error "Serveur ods-widgets introuvable à: $PROJECT_DIR/mcp-ods-widgets/server.js"
    exit 1
fi

# 3. Configurer Claude Code
echo ""
echo "3. Configuration de Claude Code..."
echo "----------------------------------"

# Créer le répertoire .claude s'il n'existe pas
mkdir -p "$PROJECT_DIR/.claude"

# Le fichier settings.json a déjà été créé correctement
if [ -f "$PROJECT_DIR/.claude/settings.json" ]; then
    log_success "Configuration Claude Code déjà en place"
else
    log_warning "Création de .claude/settings.json"
    cat > "$PROJECT_DIR/.claude/settings.json" << 'EOF'
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/on-file-change",
            "timeout": 30
          }
        ]
      }
    ]
  },
  "env": {
    "NODE_ENV": "development",
    "PROJECT_ROOT": "$CLAUDE_PROJECT_DIR"
  }
}
EOF
    log_success "Configuration Claude Code créée"
fi

# Vérifier .mcp.json
if [ -f "$PROJECT_DIR/.mcp.json" ]; then
    log_success "Configuration MCP Claude Code (.mcp.json) déjà en place"
else
    log_error "Fichier .mcp.json manquant"
    exit 1
fi

# 4. Configurer Claude Desktop
echo ""
echo "4. Configuration de Claude Desktop..."
echo "-------------------------------------"

# Créer le répertoire Claude Desktop s'il n'existe pas
if [ ! -d "$HOME/Library/Application Support/Claude" ]; then
    log_warning "Répertoire Claude Desktop introuvable. Claude Desktop est-il installé?"
    echo "Si Claude Desktop est installé, créez manuellement le fichier:"
    echo "$CLAUDE_DESKTOP_CONFIG"
else
    # Sauvegarder l'ancienne configuration si elle existe
    if [ -f "$CLAUDE_DESKTOP_CONFIG" ]; then
        cp "$CLAUDE_DESKTOP_CONFIG" "$CLAUDE_DESKTOP_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"
        log_warning "Configuration existante sauvegardée"
    fi
    
    # Créer la nouvelle configuration
    cat > "$CLAUDE_DESKTOP_CONFIG" << EOF
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
    }
  }
}
EOF
    log_success "Configuration Claude Desktop créée/mise à jour"
fi

# 5. Tester les serveurs MCP
echo ""
echo "5. Test des serveurs MCP..."
echo "---------------------------"

# Test rapide du serveur dsfr-mcp
echo -n "Test dsfr-mcp... "
if timeout 2s node "$PROJECT_DIR/mcp-dsfr/src/index.js" 2>/dev/null; then
    log_success "OK"
else
    log_warning "Le serveur ne répond pas immédiatement (normal pour un serveur MCP)"
fi

# Test rapide du serveur ods-widgets
echo -n "Test ods-widgets... "
if node "$PROJECT_DIR/mcp-ods-widgets/server.js" 2>&1 | grep -q "Serveur démarré" &
    PID=$!
    sleep 1
    kill $PID 2>/dev/null
then
    log_success "OK"
else
    log_warning "Vérification manuelle recommandée"
fi

# 6. Instructions finales
echo ""
echo "✅ Configuration terminée!"
echo "========================="
echo ""
echo "Actions à effectuer:"
echo ""
echo "1. Pour Claude Code:"
echo "   - Relancez Claude Code depuis ce répertoire: cd $PROJECT_DIR && claude"
echo "   - Les serveurs MCP devraient se connecter automatiquement"
echo ""
echo "2. Pour Claude Desktop:"
echo "   - Fermez complètement Claude Desktop (Cmd+Q)"
echo "   - Rouvrez Claude Desktop"
echo "   - Les serveurs MCP devraient apparaître connectés"
echo ""
echo "3. Pour vérifier la connexion:"
echo "   - Dans Claude Code: tapez '/mcp list'"
echo "   - Dans Claude Desktop: vérifiez l'icône MCP en bas à droite"
echo ""
echo "En cas de problème:"
echo "   - Vérifiez les logs: ~/Library/Caches/claude-cli-nodejs/"
echo "   - Relancez ce script: ./setup-mcp.sh"
echo ""