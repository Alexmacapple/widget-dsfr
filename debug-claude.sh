#!/bin/bash

# Script de débogage pour Claude Code et MCP
echo "🔍 Débogage Claude Code - $(date)"
echo "================================"

# 1. Processus actifs
echo -e "\n📊 Processus MCP actifs:"
ps aux | grep -E "(mcp|claude)" | grep -v grep | wc -l
echo "processus trouvés"

# 2. Ports utilisés
echo -e "\n🌐 Ports utilisés par les serveurs:"
netstat -an | grep LISTEN | grep -E "3000|8000|8080" || echo "Aucun serveur actif sur les ports standards"

# 3. Dernières erreurs npm
echo -e "\n❌ Dernières erreurs npm:"
ls -t ~/.npm/_logs/*.log 2>/dev/null | head -1 | xargs tail -20 2>/dev/null || echo "Pas d'erreurs npm récentes"

# 4. État des serveurs MCP
echo -e "\n🔧 État des serveurs MCP du projet:"
for server in mcp-dsfr mcp-ods-widgets; do
  if pgrep -f "$server" > /dev/null; then
    echo "✅ $server: ACTIF (PID: $(pgrep -f "$server"))"
  else
    echo "❌ $server: INACTIF"
  fi
done

# 5. Utilisation mémoire
echo -e "\n💾 Utilisation mémoire Claude:"
ps aux | grep -E "claude" | grep -v grep | awk '{sum+=$6} END {print "Total: " sum/1024 " MB"}'

# 6. Fichiers récemment modifiés
echo -e "\n📝 Derniers fichiers modifiés (30 min):"
find . -type f -mmin -30 -not -path "./node_modules/*" -not -path "./.git/*" 2>/dev/null | head -10

echo -e "\n✨ Débogage terminé"