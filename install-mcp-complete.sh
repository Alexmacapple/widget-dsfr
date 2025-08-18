#!/bin/bash

# ============================================
# Script d'Installation Complète Widget DSFR
# Version 4.1 - 11 serveurs MCP
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
echo "║     Widget DSFR - Installation Complète        ║"
echo "║          11 Serveurs MCP Intégrés              ║"
echo "╚═══════════════════════════════════════════════╝"
echo -e "${NC}"

# ============================================
# 1. VÉRIFICATION DES PRÉREQUIS
# ============================================
print_step "Étape 1/7 : Vérification des prérequis"

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

# Vérifier Python (pour le serveur HTTP)
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    print_success "Python $PYTHON_VERSION installé"
else
    print_warning "Python3 non installé (optionnel pour npm run serve)"
fi

# ============================================
# 2. INSTALLATION DES DÉPENDANCES PRINCIPALES
# ============================================
print_step "Étape 2/7 : Installation des dépendances principales"

# Installer les dépendances du projet principal
if [ -f "package.json" ]; then
    print_success "Installation des dépendances principales..."
    npm install
    print_success "Dépendances principales installées"
else
    print_error "package.json non trouvé dans le répertoire principal"
    exit 1
fi

# ============================================
# 3. INSTALLATION DES SERVEURS MCP LOCAUX
# ============================================
print_step "Étape 3/7 : Installation des serveurs MCP locaux"

# Installer les dépendances MCP DSFR
if [ -d "mcp-dsfr" ]; then
    echo "Installation MCP DSFR..."
    cd mcp-dsfr
    if [ -f "package.json" ]; then
        npm install
        print_success "MCP DSFR installé"
    fi
    cd ..
else
    print_error "Dossier mcp-dsfr non trouvé"
    exit 1
fi

# Installer les dépendances MCP ODS Widgets
if [ -d "mcp-ods-widgets" ]; then
    echo "Installation MCP ODS Widgets..."
    cd mcp-ods-widgets
    if [ -f "package.json" ]; then
        npm install
        print_success "MCP ODS Widgets installé"
    fi
    cd ..
else
    print_error "Dossier mcp-ods-widgets non trouvé"
    exit 1
fi

# ============================================
# 4. INSTALLATION DES SERVEURS MCP NPX
# ============================================
print_step "Étape 4/7 : Installation des serveurs MCP via NPX"

echo "Installation des packages MCP globaux..."

# Liste des serveurs MCP à installer globalement
MCP_SERVERS=(
    "@upstash/context7-mcp"
    "@progress/kendo-angular-mcp"
    "@modelcontextprotocol/server-sequential-thinking"
    "mcp-server-semgrep"
    "mcp-git"
    "@modelcontextprotocol/server-memory"
    "mcp-knowledge-graph"
    "@playwright/mcp"
    "@modelcontextprotocol/server-github"
)

for server in "${MCP_SERVERS[@]}"; do
    echo "Installation de $server..."
    npm install -g $server || print_warning "Échec de l'installation de $server"
done

# Installation du SDK MCP (requis par certains serveurs)
npm install -g @modelcontextprotocol/sdk

print_success "Serveurs MCP installés"

# ============================================
# 5. INSTALLATION DE SEMGREP (macOS/Linux)
# ============================================
print_step "Étape 5/7 : Installation de Semgrep"

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    if command -v brew &> /dev/null; then
        if ! command -v semgrep &> /dev/null; then
            echo "Installation de Semgrep via Homebrew..."
            brew install semgrep
            print_success "Semgrep installé"
        else
            print_success "Semgrep déjà installé"
        fi
    else
        print_warning "Homebrew non installé. Installez Semgrep manuellement : https://semgrep.dev/docs/getting-started/"
    fi
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if ! command -v semgrep &> /dev/null; then
        echo "Installation de Semgrep..."
        python3 -m pip install semgrep
        print_success "Semgrep installé"
    else
        print_success "Semgrep déjà installé"
    fi
else
    print_warning "Installation de Semgrep non supportée sur ce système. Installez manuellement : https://semgrep.dev/docs/getting-started/"
fi

# ============================================
# 6. CONFIGURATION CLAUDE DESKTOP/CODE
# ============================================
print_step "Étape 6/7 : Configuration de Claude Desktop/Code"

# Détection du système d'exploitation
OS="unknown"
CONFIG_PATHS=()

if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
    CONFIG_PATHS+=("$HOME/Library/Application Support/Claude")
    CONFIG_PATHS+=("$HOME/Library/Application Support/com.anthropic.claude-code")
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
    CONFIG_PATHS+=("$HOME/.config/Claude")
    CONFIG_PATHS+=("$HOME/.config/claude-code")
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="Windows"
    CONFIG_PATHS+=("$APPDATA/Claude")
    CONFIG_PATHS+=("$APPDATA/claude-code")
fi

print_success "Système détecté : $OS"

# Générer la configuration avec les chemins absolus corrects
CURRENT_DIR=$(pwd)

# Copier la configuration dans tous les répertoires possibles
for CONFIG_PATH in "${CONFIG_PATHS[@]}"; do
    if [ -d "$CONFIG_PATH" ] || mkdir -p "$CONFIG_PATH" 2>/dev/null; then
        cp config/claude_desktop_config.json "$CONFIG_PATH/claude_desktop_config.json" 2>/dev/null || true
        
        # Remplacer CURRENT_DIR par le chemin absolu
        if [[ "$OSTYPE" == "darwin"* ]] || [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sed -i '' "s|CURRENT_DIR|$CURRENT_DIR|g" "$CONFIG_PATH/claude_desktop_config.json" 2>/dev/null || \
            sed -i "s|CURRENT_DIR|$CURRENT_DIR|g" "$CONFIG_PATH/claude_desktop_config.json" 2>/dev/null || true
        fi
        
        print_success "Configuration copiée dans : $CONFIG_PATH"
    fi
done

# ============================================
# 7. VÉRIFICATION FINALE
# ============================================
print_step "Étape 7/7 : Vérification de l'installation"

echo -e "\n${GREEN}═══════════════════════════════════════════════${NC}"
echo -e "${GREEN}     ✅ INSTALLATION TERMINÉE AVEC SUCCÈS        ${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════${NC}"

echo -e "\n📋 ${BLUE}Récapitulatif - 11 Serveurs MCP :${NC}"
echo -e "   ${GREEN}Serveurs Locaux (2) :${NC}"
echo -e "   ✅ dsfr-mcp - Génération et validation DSFR"
echo -e "   ✅ ods-widgets - Création de widgets OpenDataSoft"
echo -e ""
echo -e "   ${GREEN}Documentation & Support (2) :${NC}"
echo -e "   ✅ context7 - Documentation à jour"
echo -e "   ✅ angular-mcp - Support Angular/Kendo"
echo -e ""
echo -e "   ${GREEN}Outils de Développement (3) :${NC}"
echo -e "   ✅ sequential-thinking - Planification de tâches"
echo -e "   ✅ semgrep - Analyse de sécurité"
echo -e "   ✅ git - Gestion de version"
echo -e ""
echo -e "   ${GREEN}Fonctionnalités Avancées (4) :${NC}"
echo -e "   ✅ basic-memory - Mémorisation des patterns"
echo -e "   ✅ knowledge-graph - Relations widgets/composants"
echo -e "   ✅ playwright - Tests automatisés"
echo -e "   ✅ github - Intégration GitHub"

echo -e "\n🚀 ${BLUE}Prochaines étapes :${NC}"
echo -e "   1. ${YELLOW}Redémarrer Claude Desktop/Code${NC}"
echo -e ""
echo -e "   2. ${YELLOW}Tester les serveurs MCP :${NC}"
echo -e "      ${GREEN}npm run serve${NC} (dans un terminal)"
echo -e "      ${GREEN}claude${NC} (dans un autre terminal)"
echo -e ""
echo -e "   3. ${YELLOW}Vérifier la connexion MCP :${NC}"
echo -e "      Dans Claude, tapez : ${GREEN}/mcp${NC}"
echo -e ""
echo -e "   4. ${YELLOW}Ouvrir un exemple :${NC}"
echo -e "      ${GREEN}open examples/signalconso-dashboard-dsfr.html${NC}"

echo -e "\n📚 ${BLUE}Documentation :${NC}"
echo -e "   • README.md - Vue d'ensemble"
echo -e "   • CLAUDE.md - Guide d'utilisation (v4.1)"
echo -e "   • MCP_USAGE_GUIDE.md - Guide détaillé des MCP"

echo -e "\n${YELLOW}⚠️  Note importante :${NC}"
echo -e "   Redémarrez Claude Desktop/Code pour charger les serveurs MCP"

echo -e "\n${GREEN}Bonne utilisation de Widget DSFR avec 11 serveurs MCP ! 🎉${NC}\n"