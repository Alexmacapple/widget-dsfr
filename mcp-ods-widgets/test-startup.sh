#!/bin/bash

echo "🚀 Démarrage du test Widget Builder Pro avec SignalConso"
echo "================================================="

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier Node.js
echo "1. Vérification des prérequis..."
if command -v node &> /dev/null; then
    log_info "Node.js installé : $(node -v)"
else
    log_error "Node.js n'est pas installé"
    exit 1
fi

# Démarrer le serveur backend
echo ""
echo "2. Démarrage du serveur backend..."
cd /Users/alex/Desktop/widget-dsfr/widget-builder-pro

# Vérifier si le serveur est déjà en cours d'exécution
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    log_warning "Un serveur écoute déjà sur le port 3000"
    echo "Arrêter le serveur existant ? (y/n)"
    read -r response
    if [[ "$response" == "y" ]]; then
        kill $(lsof -Pi :3000 -sTCP:LISTEN -t)
        sleep 2
    fi
fi

# Démarrer le serveur en arrière-plan
echo "Démarrage du serveur backend sur http://localhost:3000..."
node backend/server.js &
SERVER_PID=$!
sleep 3

# Vérifier que le serveur est bien démarré
if curl -s http://localhost:3000/api/health > /dev/null; then
    log_info "Serveur backend démarré (PID: $SERVER_PID)"
else
    log_error "Impossible de démarrer le serveur backend"
    exit 1
fi

# Ouvrir le fichier de test dans le navigateur
echo ""
echo "3. Ouverture du dashboard de test..."
DASHBOARD_FILE="/Users/alex/Desktop/widget-dsfr/mcp-ods-widgets/test-signalconso.html"

if [ -f "$DASHBOARD_FILE" ]; then
    log_info "Ouverture du dashboard SignalConso..."
    open "$DASHBOARD_FILE"
else
    log_error "Fichier de test non trouvé : $DASHBOARD_FILE"
fi

# Afficher les URLs
echo ""
echo "================================================="
echo "📊 URLS DISPONIBLES :"
echo "================================================="
echo "• Dashboard SignalConso : file://$DASHBOARD_FILE"
echo "• API Backend : http://localhost:3000/api/health"
echo "• Widget Builder : http://localhost:3000"
echo ""
echo "================================================="
echo "📝 WIDGETS TESTÉS (15+) :"
echo "================================================="
echo "✓ ods-dataset-context    - Contexte de données"
echo "✓ ods-aggregation        - KPIs et statistiques"
echo "✓ ods-searchbox          - Recherche textuelle"
echo "✓ ods-facets             - Filtres à facettes"
echo "✓ ods-table              - Table de données"
echo "✓ ods-chart              - Graphiques (colonnes, lignes)"
echo "✓ ods-gauge              - Jauge visuelle"
echo "✓ ods-treemap            - Carte proportionnelle"
echo "✓ ods-map                - Carte géographique"
echo "✓ ods-map-layer          - Couche de carte"
echo "✓ ods-timeline           - Ligne de temps"
echo "✓ ods-cross-table        - Tableau croisé"
echo "✓ ods-export-file        - Export CSV/Excel/GeoJSON"
echo "✓ ods-clear-all-filters  - Effacer les filtres"
echo "✓ ods-filter-summary     - Résumé des filtres"
echo ""
echo "================================================="
echo "🎯 TESTS À EFFECTUER :"
echo "================================================="
echo "1. Vérifier le chargement des données SignalConso"
echo "2. Tester la recherche et les filtres"
echo "3. Vérifier les visualisations (graphiques, carte)"
echo "4. Tester l'export des données"
echo "5. Valider le thème DSFR"
echo "6. Vérifier l'accessibilité clavier"
echo ""
echo "================================================="
echo "⌨️  COMMANDES UTILES :"
echo "================================================="
echo "• Arrêter le serveur : kill $SERVER_PID"
echo "• Voir les logs : tail -f /tmp/widget-builder.log"
echo "• Relancer : ./test-startup.sh"
echo ""
log_info "Test prêt ! Le dashboard devrait s'ouvrir dans votre navigateur."
echo ""

# Attendre que l'utilisateur arrête le script
echo "Appuyez sur Ctrl+C pour arrêter le serveur..."
wait $SERVER_PID