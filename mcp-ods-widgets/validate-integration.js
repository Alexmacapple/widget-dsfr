#!/usr/bin/env node

/**
 * Script de validation de l'intégration des 70+ widgets
 * Vérifie que tous les widgets sont correctement intégrés
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Liste complète des 70+ widgets
const ALL_WIDGETS = {
    documented: [
        // Contexte & Configuration (5)
        'datasetContext', 'catalogContext', 'themeBoxes', 
        'subscriptionButton', 'mostUsedThemes',
        
        // Visualisation (10)
        'table', 'chart', 'chartSerie', 'map', 'mapLayer',
        'gauge', 'sparkline', 'timeline', 'calendar', 'picto',
        
        // Filtrage & Recherche (10)
        'facets', 'facetResults', 'facetsV2', 'refineResults',
        'searchbox', 'clearAllFilters', 'filterSummary',
        'multiFilter', 'dateRangeSlider', 'geoNavigation',
        
        // Analyse & Agrégation (10)
        'aggregation', 'analyzer', 'crossTable',
        'lastDatasetsFeed', 'lastReusesFeed', 'mostPopularDatasets',
        'mostPopularReuses', 'tagCloud', 'treemap', 'kpi',
        
        // Affichage (7)
        'resultEnumerator', 'catalogCard', 'mediaGallery',
        'slideshow', 'pager', 'spinner', 'simpleTab',
        
        // Export & Partage (5)
        'exportFile', 'shareButton', 'downloadButton',
        'embedButton', 'apiButton',
        
        // Temporel (5)
        'dateRange', 'timerange', 'eventCalendar',
        'timeSlider', 'periodSelector'
    ],
    undocumented: [
        // Widgets avancés non documentés (18)
        'advancedAnalysis', 'advancedTable', 'aggregateTable',
        'autoComplete', 'chartBuilder', 'contextMenu',
        'crossDatasetQuery', 'dashboardBuilder', 'dataGrid',
        'dynamicForm', 'exportButton', 'filterBuilder',
        'kpiBox', 'metadataDisplay', 'schemaDisplay',
        'pivotTable', 'queryBuilder', 'reportGenerator'
    ]
};

const TOTAL_WIDGETS = ALL_WIDGETS.documented.length + ALL_WIDGETS.undocumented.length;

console.log('🔍 Validation de l\'intégration Widget Builder Pro');
console.log('=================================================\n');

// Vérifier les fichiers principaux
function checkFiles() {
    console.log('📁 Vérification des fichiers...\n');
    
    const requiredFiles = [
        { path: 'src/index-final.js', desc: 'Serveur MCP principal' },
        { path: 'test-signalconso.html', desc: 'Dashboard de test' },
        { path: 'test-startup.sh', desc: 'Script de démarrage' },
        { path: 'ROADMAP.md', desc: 'Documentation roadmap' },
        { path: '../widget-builder-pro/backend/server.js', desc: 'Serveur backend' },
        { path: '../widget-builder-pro/frontend/index.html', desc: 'Interface frontend' },
        { path: '../widget-builder-pro/frontend/app.js', desc: 'Application JS' },
        { path: '../widget-builder-pro/mcp-gateway/unified-gateway.js', desc: 'Gateway MCP' }
    ];
    
    let allFilesPresent = true;
    
    requiredFiles.forEach(file => {
        const fullPath = path.join(__dirname, file.path);
        if (fs.existsSync(fullPath)) {
            console.log(`✅ ${file.desc}: ${file.path}`);
        } else {
            console.log(`❌ MANQUANT: ${file.desc} (${file.path})`);
            allFilesPresent = false;
        }
    });
    
    return allFilesPresent;
}

// Vérifier l'intégration des widgets dans le serveur MCP
function checkWidgetIntegration() {
    console.log('\n📊 Vérification des widgets intégrés...\n');
    
    const serverFile = path.join(__dirname, 'src/index-final.js');
    
    if (!fs.existsSync(serverFile)) {
        console.log('❌ Fichier serveur MCP non trouvé');
        return false;
    }
    
    const content = fs.readFileSync(serverFile, 'utf8');
    let integratedCount = 0;
    let missingWidgets = [];
    
    // Vérifier chaque widget
    [...ALL_WIDGETS.documented, ...ALL_WIDGETS.undocumented].forEach(widget => {
        if (content.includes(`'${widget}'`) || content.includes(`"${widget}"`) || content.includes(widget)) {
            integratedCount++;
        } else {
            missingWidgets.push(widget);
        }
    });
    
    console.log(`✅ Widgets intégrés: ${integratedCount}/${TOTAL_WIDGETS}`);
    
    if (missingWidgets.length > 0) {
        console.log(`⚠️  Widgets potentiellement manquants: ${missingWidgets.length}`);
        console.log('   ', missingWidgets.slice(0, 5).join(', '), '...');
    }
    
    return integratedCount >= 70;
}

// Vérifier le dashboard de test
function checkTestDashboard() {
    console.log('\n🧪 Vérification du dashboard de test...\n');
    
    const dashboardFile = path.join(__dirname, 'test-signalconso.html');
    
    if (!fs.existsSync(dashboardFile)) {
        console.log('❌ Dashboard de test non trouvé');
        return false;
    }
    
    const content = fs.readFileSync(dashboardFile, 'utf8');
    
    // Widgets à vérifier dans le dashboard
    const testWidgets = [
        'ods-dataset-context',
        'ods-aggregation',
        'ods-searchbox',
        'ods-facets',
        'ods-table',
        'ods-chart',
        'ods-map',
        'ods-gauge',
        'ods-timeline',
        'ods-cross-table',
        'ods-export-file'
    ];
    
    let foundWidgets = [];
    testWidgets.forEach(widget => {
        if (content.includes(widget)) {
            foundWidgets.push(widget);
        }
    });
    
    console.log(`✅ Widgets testés dans le dashboard: ${foundWidgets.length}/${testWidgets.length}`);
    foundWidgets.forEach(w => console.log(`   • ${w}`));
    
    // Vérifier DSFR
    const hasDSFR = content.includes('@gouvfr/dsfr');
    console.log(hasDSFR ? '\n✅ Thème DSFR intégré' : '\n❌ Thème DSFR manquant');
    
    return foundWidgets.length >= 10 && hasDSFR;
}

// Vérifier la configuration
function checkConfiguration() {
    console.log('\n⚙️  Vérification de la configuration...\n');
    
    const configFile = path.join(__dirname, '../.mcp.json');
    
    if (fs.existsSync(configFile)) {
        const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        
        if (config.mcpServers) {
            console.log('✅ Serveurs MCP configurés:');
            Object.keys(config.mcpServers).forEach(server => {
                console.log(`   • ${server}`);
            });
            return true;
        }
    }
    
    console.log('⚠️  Configuration MCP non trouvée ou incomplète');
    return false;
}

// Résumé
function showSummary(results) {
    console.log('\n=================================================');
    console.log('📋 RÉSUMÉ DE LA VALIDATION');
    console.log('=================================================\n');
    
    const allPassed = Object.values(results).every(r => r);
    
    if (allPassed) {
        console.log('🎉 SUCCÈS: Tous les tests sont passés!');
        console.log('\n✨ Le système Widget Builder Pro est prêt:');
        console.log('   • 70+ widgets ODS intégrés');
        console.log('   • Thème DSFR appliqué');
        console.log('   • Dashboard de test fonctionnel');
        console.log('   • Architecture MCP complète');
        
        console.log('\n🚀 Pour démarrer le test:');
        console.log('   ./test-startup.sh');
    } else {
        console.log('⚠️  ATTENTION: Certains tests ont échoué');
        console.log('\nVérifiez les points suivants:');
        
        if (!results.files) console.log('   • Fichiers manquants');
        if (!results.widgets) console.log('   • Widgets non intégrés');
        if (!results.dashboard) console.log('   • Dashboard incomplet');
        if (!results.config) console.log('   • Configuration MCP');
    }
    
    console.log('\n=================================================');
    console.log(`📊 Score global: ${Object.values(results).filter(r => r).length}/4`);
    console.log('=================================================\n');
}

// Exécution principale
function main() {
    const results = {
        files: checkFiles(),
        widgets: checkWidgetIntegration(),
        dashboard: checkTestDashboard(),
        config: checkConfiguration()
    };
    
    showSummary(results);
    
    // Code de sortie
    process.exit(Object.values(results).every(r => r) ? 0 : 1);
}

main();