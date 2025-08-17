#!/bin/bash

# Script d'automatisation pour Claude Code avec MCP
# Ce script vérifie et démarre automatiquement les serveurs MCP

echo "🚀 Démarrage automatique des serveurs MCP pour Claude Code"
echo "============================================="

# Couleurs pour l'affichage
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour vérifier si un serveur MCP est actif
check_mcp_server() {
    local server_name=$1
    if claude mcp list 2>/dev/null | grep -q "$server_name.*✔ connected"; then
        echo -e "${GREEN}✅ $server_name est connecté${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  $server_name n'est pas connecté${NC}"
        return 1
    fi
}

# Vérifier que Claude Code est installé
if ! command -v claude &> /dev/null; then
    echo -e "${RED}❌ Claude Code n'est pas installé ou pas dans le PATH${NC}"
    echo "Installation: npm install -g @anthropic-ai/claude-cli"
    exit 1
fi

# Vérifier la présence du fichier .mcp.json
if [ ! -f ".mcp.json" ]; then
    echo -e "${RED}❌ Fichier .mcp.json introuvable dans ce répertoire${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Configuration .mcp.json trouvée${NC}"

# Lister les serveurs MCP configurés
echo ""
echo "📋 Serveurs MCP configurés dans .mcp.json:"
echo "-------------------------------------------"
jq -r '.mcpServers | to_entries[] | "- \(.key): \(.value.description // "Pas de description")"' .mcp.json 2>/dev/null || {
    echo -e "${YELLOW}Note: jq n'est pas installé, impossible d'afficher les descriptions${NC}"
    echo "Installation jq: brew install jq"
}

# Vérifier l'état des serveurs MCP
echo ""
echo "🔍 Vérification de l'état des serveurs MCP..."
echo "-------------------------------------------"

all_connected=true
for server in dsfr-mcp ods-widgets context7 angular-mcp; do
    if ! check_mcp_server "$server"; then
        all_connected=false
    fi
done

if [ "$all_connected" = true ]; then
    echo ""
    echo -e "${GREEN}✅ Tous les serveurs MCP sont connectés et prêts !${NC}"
    echo ""
    echo "🎯 Vous pouvez maintenant utiliser Claude Code avec:"
    echo "   claude"
    echo ""
    echo "📝 Commandes utiles:"
    echo "   claude mcp list    - Lister les serveurs MCP"
    echo "   claude --help      - Aide Claude Code"
    echo "   /mcp list          - Dans Claude, lister les MCP"
else
    echo ""
    echo -e "${YELLOW}⚠️  Certains serveurs MCP ne sont pas connectés${NC}"
    echo ""
    echo "Solutions possibles:"
    echo "1. Redémarrer Claude Code: exit puis claude"
    echo "2. Vérifier les chemins dans .mcp.json"
    echo "3. Vérifier que les serveurs locaux existent:"
    echo "   - /Users/alex/Desktop/widget-dsfr/mcp-dsfr/src/index.js"
    echo "   - /Users/alex/Desktop/widget-dsfr/mcp-ods-widgets/server.js"
fi

# Option pour lancer Claude Code directement
if [ "$1" = "--start" ] || [ "$1" = "-s" ]; then
    echo ""
    echo "🚀 Lancement de Claude Code..."
    exec claude
fi