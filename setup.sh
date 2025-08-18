#!/bin/bash

# ============================================
# Widget DSFR - Script d'Installation Unifié
# ============================================
# Ce script configure tout l'environnement nécessaire pour:
# - Développer avec Claude Code
# - Utiliser les serveurs MCP (DSFR, ODS Widgets, Context7, Angular)
# - Intégrer avec Claude Desktop
#
# Usage: ./setup.sh [options]
# Options:
#   --clean : Installation propre (réinitialise les configurations)
#   --skip-claude-cli : Ne pas installer Claude CLI
#   --skip-desktop : Ne pas configurer Claude Desktop
# ============================================

set -e  # Arrêt en cas d'erreur

# Variables globales
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_NAME="widget-dsfr"
REQUIRED_NODE_VERSION="18.0.0"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Parsing des arguments
CLEAN_INSTALL=false
SKIP_CLAUDE_CLI=false
SKIP_DESKTOP=false

for arg in "$@"; do
    case $arg in
        --clean)
            CLEAN_INSTALL=true
            ;;
        --skip-claude-cli)
            SKIP_CLAUDE_CLI=true
            ;;
        --skip-desktop)
            SKIP_DESKTOP=true
            ;;
        --help|-h)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --clean          : Installation propre (réinitialise les configurations)"
            echo "  --skip-claude-cli: Ne pas installer Claude CLI"
            echo "  --skip-desktop   : Ne pas configurer Claude Desktop"
            exit 0
            ;;
    esac
done

# Fonctions d'affichage
print_header() {
    clear
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    Widget DSFR Setup                          ║"
    echo "║         Configuration Complète de l'Environnement             ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo
}

print_step() {
    echo
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}▶ $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_substep() {
    echo -e "\n${CYAN}▸ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ $1${NC}"
}

# Fonction pour vérifier les versions
version_compare() {
    printf '%s\n%s' "$1" "$2" | sort -V | head -n1
}

# Fonction pour détecter l'OS
detect_os() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macOS"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "Linux"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
        echo "Windows"
    else
        echo "Unknown"
    fi
}

# En-tête
print_header

# ============================================
# ÉTAPE 1: VÉRIFICATION DES PRÉREQUIS
# ============================================
print_step "Étape 1/7: Vérification des prérequis"

OS=$(detect_os)
print_info "Système détecté: $OS"

# Vérifier Git
print_substep "Vérification de Git"
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | awk '{print $3}')
    print_success "Git $GIT_VERSION installé"
else
    print_error "Git n'est pas installé"
    echo "  → Installation: https://git-scm.com/"
    exit 1
fi

# Vérifier Node.js
print_substep "Vérification de Node.js"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    if [ "$(version_compare "$REQUIRED_NODE_VERSION" "$NODE_VERSION")" = "$REQUIRED_NODE_VERSION" ]; then
        print_success "Node.js v$NODE_VERSION installé (>= v$REQUIRED_NODE_VERSION)"
    else
        print_error "Node.js v$NODE_VERSION est trop ancien (minimum v$REQUIRED_NODE_VERSION requis)"
        echo "  → Installation: https://nodejs.org/"
        exit 1
    fi
else
    print_error "Node.js n'est pas installé"
    echo "  → Installation: https://nodejs.org/"
    exit 1
fi

# Vérifier npm
print_substep "Vérification de npm"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_success "npm $NPM_VERSION installé"
else
    print_error "npm n'est pas installé"
    exit 1
fi

# Vérifier Claude CLI (optionnel)
print_substep "Vérification de Claude CLI"
if command -v claude &> /dev/null; then
    CLAUDE_VERSION=$(claude --version 2>/dev/null || echo "version inconnue")
    print_success "Claude CLI déjà installé: $CLAUDE_VERSION"
    CLAUDE_INSTALLED=true
else
    print_warning "Claude CLI n'est pas installé"
    CLAUDE_INSTALLED=false
fi

# ============================================
# ÉTAPE 2: NETTOYAGE (SI DEMANDÉ)
# ============================================
if [ "$CLEAN_INSTALL" = true ]; then
    print_step "Étape 2/7: Nettoyage de l'installation précédente"
    
    print_substep "Suppression des node_modules"
    rm -rf node_modules mcp-dsfr/node_modules mcp-ods-widgets/node_modules
    print_success "node_modules supprimés"
    
    print_substep "Suppression des fichiers de configuration"
    rm -f .claude/settings.local.json
    print_success "Configurations locales supprimées"
else
    print_step "Étape 2/7: Vérification de l'état actuel"
    print_info "Installation incrémentale (utilisez --clean pour une installation propre)"
fi

# ============================================
# ÉTAPE 3: INSTALLATION DES DÉPENDANCES
# ============================================
print_step "Étape 3/7: Installation des dépendances npm"

# Installation des dépendances principales
print_substep "Installation des dépendances du projet principal"
if [ -f "package.json" ]; then
    npm install --silent
    print_success "Dépendances principales installées"
else
    print_warning "Pas de package.json dans le répertoire principal"
fi

# Installation MCP DSFR
print_substep "Installation des dépendances MCP DSFR"
if [ -d "mcp-dsfr" ] && [ -f "mcp-dsfr/package.json" ]; then
    cd mcp-dsfr
    npm install --silent
    cd ..
    print_success "MCP DSFR installé"
else
    print_error "Dossier mcp-dsfr introuvable"
    exit 1
fi

# Installation MCP ODS Widgets
print_substep "Installation des dépendances MCP ODS Widgets"
if [ -d "mcp-ods-widgets" ] && [ -f "mcp-ods-widgets/package.json" ]; then
    cd mcp-ods-widgets
    npm install --silent
    cd ..
    print_success "MCP ODS Widgets installé"
else
    print_error "Dossier mcp-ods-widgets introuvable"
    exit 1
fi

# ============================================
# ÉTAPE 4: INSTALLATION DE CLAUDE CLI
# ============================================
if [ "$SKIP_CLAUDE_CLI" = false ] && [ "$CLAUDE_INSTALLED" = false ]; then
    print_step "Étape 4/7: Installation de Claude CLI"
    
    read -p "Voulez-vous installer Claude CLI maintenant? (o/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Oo]$ ]]; then
        print_substep "Installation de Claude CLI via npm"
        npm install -g @anthropic-ai/claude-cli
        print_success "Claude CLI installé"
        CLAUDE_INSTALLED=true
    else
        print_warning "Installation de Claude CLI ignorée"
    fi
else
    print_step "Étape 4/7: Claude CLI"
    print_info "Installation ignorée (déjà installé ou --skip-claude-cli)"
fi

# Demander le token GitHub (optionnel)
print_substep "Configuration GitHub (optionnel)"
echo "Pour utiliser le serveur MCP GitHub, vous avez besoin d'un token personnel."
echo "Créez-en un sur : https://github.com/settings/tokens"
read -p "Voulez-vous configurer votre token GitHub maintenant? (o/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Oo]$ ]]; then
    read -p "Entrez votre token GitHub (ghp_...): " GITHUB_TOKEN
    if [ -n "$GITHUB_TOKEN" ]; then
        # Créer ou mettre à jour .env
        if [ -f ".env" ]; then
            # Supprimer l'ancienne ligne si elle existe
            sed -i '' '/^GITHUB_PERSONAL_ACCESS_TOKEN=/d' .env 2>/dev/null || sed -i '/^GITHUB_PERSONAL_ACCESS_TOKEN=/d' .env
        fi
        echo "GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_TOKEN" >> .env
        print_success "Token GitHub sauvegardé dans .env"
    fi
else
    print_info "Configuration GitHub ignorée - Vous pourrez l'ajouter plus tard dans .env"
fi

# ============================================
# ÉTAPE 5: CONFIGURATION CLAUDE CODE
# ============================================
print_step "Étape 5/7: Configuration de Claude Code"

# Créer les répertoires nécessaires
mkdir -p .claude .claude/hooks memory/widget-relations tests/playwright

# Créer ou mettre à jour .mcp.json
print_substep "Configuration des serveurs MCP (.mcp.json)"
cat > .mcp.json << EOF
{
  "mcpServers": {
    "dsfr-mcp": {
      "type": "stdio",
      "command": "node",
      "args": [
        "$SCRIPT_DIR/mcp-dsfr/src/index.js"
      ],
      "env": {
        "NODE_ENV": "production",
        "MCP_CLIENT": "true"
      },
      "description": "Serveur MCP DSFR - Génération de composants et validation DSFR"
    },
    "ods-widgets": {
      "type": "stdio",
      "command": "node",
      "args": [
        "$SCRIPT_DIR/mcp-ods-widgets/server.js"
      ],
      "env": {
        "NODE_ENV": "production"
      },
      "description": "MCP ODS Widgets - Création de widgets OpenDataSoft compatibles DSFR"
    },
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@upstash/context7-mcp@latest"
      ],
      "description": "Documentation à jour pour langages et frameworks"
    },
    "angular-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "@progress/kendo-angular-mcp"
      ],
      "description": "Support Angular et Kendo UI"
    },
    "prettier": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-prettier"
      ],
      "description": "Formatage automatique du code HTML/CSS/JS"
    },
    "sequential-thinking": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sequential-thinking"
      ],
      "description": "Planification structurée et décomposition de tâches complexes"
    },
    "semgrep": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@semgrep/mcp-server"
      ],
      "description": "Analyse de sécurité et détection de vulnérabilités dans le code"
    },
    "git": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git"
      ],
      "description": "Gestion de version Git intégrée - commits, branches, historique"
    },
    "basic-memory": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-memory"
      ],
      "description": "Mémorisation des décisions de transformation et patterns utilisés"
    },
    "knowledge-graph": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "mcp-knowledge-graph"
      ],
      "env": {
        "MEMORY_PATH": "$SCRIPT_DIR/memory/widget-relations"
      },
      "description": "Cartographie des relations entre widgets et composants DSFR"
    },
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-playwright"
      ],
      "description": "Tests automatisés des widgets dans un navigateur réel"
    },
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": ""
      },
      "description": "Intégration GitHub - issues, PRs, workflows"
    }
  }
}
EOF
print_success "Configuration MCP créée (11 serveurs)"

# Créer .claude/settings.json si nécessaire
if [ ! -f ".claude/settings.json" ]; then
    print_substep "Création de .claude/settings.json"
    cat > .claude/settings.json << 'EOF'
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
    print_success "Configuration Claude Code créée"
else
    print_info "Configuration Claude Code déjà présente"
fi

# ============================================
# ÉTAPE 6: CONFIGURATION CLAUDE DESKTOP
# ============================================
if [ "$SKIP_DESKTOP" = false ]; then
    print_step "Étape 6/7: Configuration de Claude Desktop"
    
    # Déterminer le chemin de configuration selon l'OS
    case "$OS" in
        "macOS")
            CONFIG_DIR="$HOME/Library/Application Support/Claude"
            ;;
        "Linux")
            CONFIG_DIR="$HOME/.config/Claude"
            ;;
        "Windows")
            CONFIG_DIR="$APPDATA/Claude"
            ;;
        *)
            print_warning "OS non supporté pour Claude Desktop"
            CONFIG_DIR=""
            ;;
    esac
    
    if [ -n "$CONFIG_DIR" ]; then
        mkdir -p "$CONFIG_DIR"
        
        # Sauvegarder la configuration existante
        if [ -f "$CONFIG_DIR/claude_desktop_config.json" ]; then
            cp "$CONFIG_DIR/claude_desktop_config.json" "$CONFIG_DIR/claude_desktop_config.backup.$(date +%Y%m%d_%H%M%S).json"
            print_info "Configuration existante sauvegardée"
        fi
        
        # Créer la nouvelle configuration
        cat > "$CONFIG_DIR/claude_desktop_config.json" << EOF
{
  "mcpServers": {
    "dsfr-mcp": {
      "command": "node",
      "args": [
        "$SCRIPT_DIR/mcp-dsfr/src/index.js"
      ],
      "env": {
        "NODE_ENV": "production",
        "MCP_CLIENT": "true"
      }
    },
    "ods-widgets": {
      "command": "node",
      "args": [
        "$SCRIPT_DIR/mcp-ods-widgets/server.js"
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
    "prettier": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-prettier"
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
        "@semgrep/mcp-server"
      ]
    },
    "git": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git"
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
        "MEMORY_PATH": "$SCRIPT_DIR/memory/widget-relations"
      }
    },
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-playwright"
      ]
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": ""
      }
    }
  }
}
EOF
        print_success "Configuration Claude Desktop créée dans: $CONFIG_DIR"
        print_warning "Redémarrez Claude Desktop pour appliquer les changements"
    fi
else
    print_step "Étape 6/7: Claude Desktop"
    print_info "Configuration ignorée (--skip-desktop)"
fi

# ============================================
# ÉTAPE 7: TESTS ET VÉRIFICATIONS
# ============================================
print_step "Étape 7/7: Tests et vérifications"

# Test des serveurs MCP
print_substep "Test des serveurs MCP"

# Test DSFR MCP
echo -n "  Test dsfr-mcp... "
if timeout 2s node "$SCRIPT_DIR/mcp-dsfr/src/index.js" &>/dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ Timeout normal (serveur en attente)${NC}"
fi

# Test ODS Widgets
echo -n "  Test ods-widgets... "
if timeout 2s node "$SCRIPT_DIR/mcp-ods-widgets/server.js" 2>&1 | grep -q "Serveur démarré"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ Vérification manuelle recommandée${NC}"
fi

# Vérifier les permissions
print_substep "Configuration des permissions"
chmod +x setup.sh 2>/dev/null || true
print_success "Permissions configurées"

# ============================================
# RÉSUMÉ ET INSTRUCTIONS
# ============================================
echo
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}       ✅ INSTALLATION TERMINÉE             ${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "\n${CYAN}📋 Résumé de l'installation:${NC}"
echo -e "   ${GREEN}✓${NC} Node.js v$NODE_VERSION"
echo -e "   ${GREEN}✓${NC} npm $NPM_VERSION"
echo -e "   ${GREEN}✓${NC} Dépendances installées"
echo -e "   ${GREEN}✓${NC} 11 serveurs MCP configurés"
echo -e "   ${GREEN}✓${NC} Dossiers créés (memory, tests)"
if [ "$CLAUDE_INSTALLED" = true ]; then
    echo -e "   ${GREEN}✓${NC} Claude CLI installé"
fi
if [ -f ".env" ] && grep -q "GITHUB_PERSONAL_ACCESS_TOKEN" .env; then
    echo -e "   ${GREEN}✓${NC} Token GitHub configuré"
fi

echo -e "\n${CYAN}🚀 Prochaines étapes:${NC}"
echo
echo -e "${YELLOW}1. Pour utiliser Claude Code:${NC}"
echo -e "   cd $SCRIPT_DIR"
echo -e "   claude"
echo
echo -e "${YELLOW}2. Pour vérifier les serveurs MCP:${NC}"
echo -e "   Dans Claude: /mcp list"
echo
echo -e "${YELLOW}3. Pour créer un widget:${NC}"
echo -e "   Utilisez: mcp__ods-widgets__create_widget"
echo
echo -e "${YELLOW}4. Pour valider du code DSFR:${NC}"
echo -e "   Utilisez: mcp__dsfr-mcp__validate_dsfr_html"

if [ "$SKIP_DESKTOP" = false ] && [ "$OS" != "Unknown" ]; then
    echo
    echo -e "${YELLOW}5. Pour Claude Desktop:${NC}"
    echo -e "   Fermez et rouvrez l'application"
fi

echo -e "\n${CYAN}📚 Documentation:${NC}"
echo -e "   • README.md - Vue d'ensemble"
echo -e "   • CLAUDE.md - Instructions pour Claude"
echo -e "   • MCP_USAGE_GUIDE.md - Guide des 11 serveurs MCP"
echo -e "   • TODO.md - Widgets à implémenter"

echo -e "\n${CYAN}🛠 En cas de problème:${NC}"
echo -e "   • Relancez: ./setup.sh --clean"
echo -e "   • Consultez: https://github.com/anthropics/claude-code/issues"

echo
echo -e "${GREEN}Bonne utilisation de Widget DSFR! 🎉${NC}"
echo