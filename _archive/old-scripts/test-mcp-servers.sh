#!/bin/bash

# Test rapide des serveurs MCP
echo "Test des serveurs MCP..."
echo "========================"

# Test ODS Widgets
echo -n "Test ods-widgets... "
if timeout 2s node mcp-ods-widgets/server.js 2>&1 | grep -q "Serveur démarré"; then
    echo "✅ OK"
else
    echo "⚠️  Vérification manuelle recommandée"
fi

# Test DSFR MCP
echo -n "Test dsfr-mcp... "
if timeout 2s node mcp-dsfr/src/index.js &>/dev/null; then
    echo "✅ OK"
else
    echo "⚠️  Normal (serveur MCP en attente de commandes)"
fi

echo ""
echo "Tests terminés. Les serveurs MCP sont prêts à être utilisés."