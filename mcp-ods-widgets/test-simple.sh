#!/bin/bash

echo "🚀 Test Widget Builder Pro - SignalConso"
echo "========================================="
echo ""
echo "📊 Ouverture du dashboard de test..."
echo ""

# Ouvrir directement le fichier HTML
DASHBOARD="/Users/alex/Desktop/widget-dsfr/mcp-ods-widgets/test-signalconso.html"

if [ -f "$DASHBOARD" ]; then
    echo "✅ Ouverture du dashboard SignalConso dans votre navigateur..."
    open "$DASHBOARD"
    echo ""
    echo "========================================="
    echo "📋 WIDGETS TESTÉS (15+) :"
    echo "========================================="
    echo "• Statistiques globales (KPIs)"
    echo "• Recherche et filtres à facettes"
    echo "• Table de données paginée"
    echo "• Graphiques (colonnes, lignes, treemap)"
    echo "• Carte géographique avec clustering"
    echo "• Timeline chronologique"
    echo "• Tableau croisé dynamique"
    echo "• Export CSV/Excel/GeoJSON"
    echo ""
    echo "========================================="
    echo "🎯 Le dashboard utilise :"
    echo "========================================="
    echo "• Dataset : SignalConso (150k signalements)"
    echo "• Source : data.economie.gouv.fr"
    echo "• Thème : DSFR (Design System France)"
    echo "• Widgets : OpenDataSoft v2"
    echo ""
    echo "✨ Dashboard ouvert avec succès !"
else
    echo "❌ Fichier non trouvé : $DASHBOARD"
    exit 1
fi