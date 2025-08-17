#!/bin/bash

echo "Test des chemins après renommage widget → widget-dsfr"
echo "=================================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Fonction de test
test_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1"
        return 1
    fi
}

test_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1"
        return 1
    fi
}

echo "1. Vérification des répertoires principaux :"
echo "---------------------------------------------"
test_dir "/Users/alex/Desktop/widget-dsfr"
test_dir "/Users/alex/Desktop/widget-dsfr/mcp-dsfr"
test_dir "/Users/alex/Desktop/widget-dsfr/mcp-ods-widgets"
test_dir "/Users/alex/Desktop/widget-dsfr/_old"

echo ""
echo "2. Vérification des fichiers de configuration :"
echo "------------------------------------------------"
test_file "/Users/alex/Desktop/widget-dsfr/.mcp.json"
test_file "/Users/alex/Desktop/widget-dsfr/package.json"
test_file "/Users/alex/Desktop/widget-dsfr/CLAUDE.md"

echo ""
echo "3. Vérification des serveurs MCP :"
echo "-----------------------------------"
test_file "/Users/alex/Desktop/widget-dsfr/mcp-dsfr/src/index.js"
test_file "/Users/alex/Desktop/widget-dsfr/mcp-ods-widgets/server.js"

echo ""
echo "4. Vérification des mappings DSFR :"
echo "------------------------------------"
test_file "/Users/alex/Desktop/widget-dsfr/mcp-dsfr/mappings/ods-to-dsfr.json"
test_file "/Users/alex/Desktop/widget-dsfr/mcp-dsfr/mappings/dsfr-components.json"
test_file "/Users/alex/Desktop/widget-dsfr/mcp-dsfr/mappings/validation-rules.json"

echo ""
echo "5. Vérification des templates :"
echo "--------------------------------"
test_file "/Users/alex/Desktop/widget-dsfr/mcp-ods-widgets/templates/table-dsfr.html"
test_file "/Users/alex/Desktop/widget-dsfr/mcp-ods-widgets/templates/chart-dsfr.html"
test_file "/Users/alex/Desktop/widget-dsfr/mcp-ods-widgets/templates/map-dsfr.html"
test_file "/Users/alex/Desktop/widget-dsfr/mcp-ods-widgets/templates/kpi-dsfr.html"

echo ""
echo "6. Recherche des références à l'ancien path :"
echo "----------------------------------------------"
COUNT=$(grep -r "/Users/alex/Desktop/widget/" . 2>/dev/null | grep -v "widget-dsfr" | wc -l | tr -d ' ')
if [ "$COUNT" -eq "0" ]; then
    echo -e "${GREEN}✓${NC} Aucune référence à l'ancien path /widget/"
else
    echo -e "${RED}✗${NC} $COUNT références trouvées à l'ancien path /widget/"
    echo "Fichiers concernés :"
    grep -r "/Users/alex/Desktop/widget/" . 2>/dev/null | grep -v "widget-dsfr" | cut -d: -f1 | sort -u
fi

echo ""
echo "=================================================="
echo "Test terminé !"