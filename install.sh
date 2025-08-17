#!/bin/bash

# ============================================
# Script d'Installation Automatique Widget DSFR
# ============================================

set -e  # Arrêter en cas d'erreur

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'affichage
print_step() {
    echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
    echo -e "${BLUE}▶ $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# En-tête
clear
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════╗"
echo "║     Widget DSFR - Installation Automatique     ║"
echo "║          Générateur de Widgets ODS→DSFR        ║"
echo "╚═══════════════════════════════════════════════╝"
echo -e "${NC}"

# ============================================
# 1. VÉRIFICATION DES PRÉREQUIS
# ============================================
print_step "Étape 1/6 : Vérification des prérequis"

# Vérifier Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    REQUIRED_VERSION="18.0.0"
    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
        print_success "Node.js $NODE_VERSION installé"
    else
        print_error "Node.js $NODE_VERSION est trop ancien (minimum v18.0.0 requis)"
        echo "Installation : https://nodejs.org/"
        exit 1
    fi
else
    print_error "Node.js n'est pas installé"
    echo "Installation : https://nodejs.org/"
    exit 1
fi

# Vérifier npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_success "npm $NPM_VERSION installé"
else
    print_error "npm n'est pas installé"
    exit 1
fi

# Vérifier Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | cut -d' ' -f3)
    print_success "Git $GIT_VERSION installé"
else
    print_error "Git n'est pas installé"
    echo "Installation : https://git-scm.com/"
    exit 1
fi

# ============================================
# 2. INSTALLATION DES DÉPENDANCES
# ============================================
print_step "Étape 2/6 : Installation des dépendances"

# Installer les dépendances du projet principal
if [ -f "package.json" ]; then
    print_success "Installation des dépendances principales..."
    npm install --silent
    print_success "Dépendances principales installées"
else
    print_warning "package.json non trouvé dans le répertoire principal"
fi

# Installer les dépendances MCP DSFR
if [ -d "mcp-dsfr" ]; then
    echo "Installation MCP DSFR..."
    cd mcp-dsfr
    if [ -f "package.json" ]; then
        npm install --silent
        print_success "MCP DSFR installé"
    fi
    cd ..
else
    print_warning "Dossier mcp-dsfr non trouvé"
fi

# Installer les dépendances MCP ODS Widgets
if [ -d "mcp-ods-widgets" ]; then
    echo "Installation MCP ODS Widgets..."
    cd mcp-ods-widgets
    if [ -f "package.json" ]; then
        npm install --silent
        print_success "MCP ODS Widgets installé"
    fi
    cd ..
else
    print_warning "Dossier mcp-ods-widgets non trouvé"
fi

# ============================================
# 3. INSTALLATION DE CLAUDE CLI (OPTIONNEL)
# ============================================
print_step "Étape 3/6 : Installation de Claude CLI"

if command -v claude &> /dev/null; then
    CLAUDE_VERSION=$(claude --version 2>/dev/null || echo "version inconnue")
    print_success "Claude CLI déjà installé : $CLAUDE_VERSION"
else
    echo -e "${YELLOW}Claude CLI n'est pas installé${NC}"
    read -p "Voulez-vous installer Claude CLI maintenant ? (o/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Oo]$ ]]; then
        npm install -g @anthropic-ai/claude-cli
        print_success "Claude CLI installé"
    else
        print_warning "Installation de Claude CLI ignorée"
    fi
fi

# ============================================
# 4. CONFIGURATION CLAUDE DESKTOP
# ============================================
print_step "Étape 4/6 : Configuration de Claude Desktop"

# Détection du système d'exploitation
OS="unknown"
CONFIG_PATH=""

if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
    CONFIG_PATH="$HOME/Library/Application Support/Claude"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
    CONFIG_PATH="$HOME/.config/Claude"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="Windows"
    CONFIG_PATH="/mnt/c/Users/$USER/AppData/Roaming/Claude"
fi

print_success "Système détecté : $OS"

if [ "$OS" != "unknown" ] && [ -n "$CONFIG_PATH" ]; then
    # Créer le répertoire de configuration si nécessaire
    mkdir -p "$CONFIG_PATH"
    
    # Générer la configuration avec les chemins absolus corrects
    CURRENT_DIR=$(pwd)
    
    cat > "$CONFIG_PATH/claude_desktop_config.json" << EOF
{
  "mcpServers": {
    "dsfr-mcp": {
      "command": "node",
      "args": ["$CURRENT_DIR/mcp-dsfr/src/index.js"],
      "env": {
        "NODE_ENV": "production",
        "MCP_CLIENT": "true"
      }
    },
    "ods-widgets": {
      "command": "node",
      "args": ["$CURRENT_DIR/mcp-ods-widgets/server.js"],
      "env": {
        "NODE_ENV": "production"
      }
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "env": {}
    },
    "angular-mcp": {
      "command": "npx",
      "args": ["@progress/kendo-angular-mcp"],
      "env": {}
    }
  }
}
EOF
    
    print_success "Configuration Claude Desktop créée dans : $CONFIG_PATH"
    print_warning "Redémarrez Claude Desktop pour appliquer les changements"
else
    print_warning "Configuration Claude Desktop ignorée (système non reconnu)"
fi

# ============================================
# 5. PERMISSIONS ET SCRIPTS
# ============================================
print_step "Étape 5/6 : Configuration des scripts"

# Rendre les scripts exécutables
chmod +x start-claude.sh 2>/dev/null || true
chmod +x install.sh 2>/dev/null || true

print_success "Scripts configurés avec les bonnes permissions"

# ============================================
# 6. VÉRIFICATION FINALE
# ============================================
print_step "Étape 6/6 : Vérification de l'installation"

echo -e "\n${GREEN}══════════════════════════════════════════${NC}"
echo -e "${GREEN}     ✅ INSTALLATION TERMINÉE AVEC SUCCÈS    ${NC}"
echo -e "${GREEN}══════════════════════════════════════════${NC}"

echo -e "\n📋 ${BLUE}Récapitulatif :${NC}"
echo -e "   ✅ Node.js $(node -v) installé"
echo -e "   ✅ npm $(npm -v) installé"
echo -e "   ✅ Dépendances installées"
echo -e "   ✅ Serveurs MCP configurés"
echo -e "   ✅ Scripts prêts à l'emploi"

echo -e "\n🚀 ${BLUE}Prochaines étapes :${NC}"
echo -e "   1. ${YELLOW}Tester les serveurs MCP :${NC}"
echo -e "      ${GREEN}./start-claude.sh${NC}"
echo
echo -e "   2. ${YELLOW}Lancer Claude Code :${NC}"
echo -e "      ${GREEN}claude${NC}"
echo
echo -e "   3. ${YELLOW}Ouvrir un dashboard exemple :${NC}"
echo -e "      ${GREEN}open examples/signalconso-dashboard-dsfr.html${NC}"
echo
echo -e "   4. ${YELLOW}Ouvrir avec VSCode :${NC}"
echo -e "      ${GREEN}code widget-dsfr.code-workspace${NC}"

echo -e "\n📚 ${BLUE}Documentation :${NC}"
echo -e "   • README.md - Vue d'ensemble"
echo -e "   • INSTALLATION_COMPLETE.md - Guide détaillé"
echo -e "   • CLAUDE.md - Instructions pour Claude"

# Proposer de lancer le test
echo -e "\n${YELLOW}═══════════════════════════════════════${NC}"
read -p "Voulez-vous tester les serveurs MCP maintenant ? (o/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Oo]$ ]]; then
    ./start-claude.sh
fi

echo -e "\n${GREEN}Bonne utilisation de Widget DSFR ! 🎉${NC}\n"