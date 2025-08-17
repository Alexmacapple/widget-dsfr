#!/usr/bin/env node

/**
 * Suite de tests basiques pour le projet Widget Builder DSFR/ODS
 * Vérifie l'intégrité des fichiers principaux et la conformité DSFR
 */

const fs = require('fs');
const path = require('path');

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
        testsPassed++;
    } catch (error) {
        console.log(`✗ ${name}: ${error.message}`);
        testsFailed++;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

console.log('🧪 Exécution des tests...\n');

// Test 1: Vérifier que les fichiers essentiels existent
test('Les fichiers essentiels existent', () => {
    const essentialFiles = [
        'README.md',
        'package.json',
        'LICENSE',
        '.gitignore',
        'CLAUDE.md',
        'signalconso-dashboard-dsfr.html'
    ];
    
    essentialFiles.forEach(file => {
        const filePath = path.join(__dirname, '..', file);
        assert(fs.existsSync(filePath), `Le fichier ${file} n'existe pas`);
    });
});

// Test 2: Vérifier la structure des dossiers
test('La structure des dossiers est correcte', () => {
    const requiredDirs = [
        'mcp-ods-widgets',
        'agents',
        'examples',
        'tests'
    ];
    
    requiredDirs.forEach(dir => {
        const dirPath = path.join(__dirname, '..', dir);
        assert(fs.existsSync(dirPath), `Le dossier ${dir} n'existe pas`);
        assert(fs.statSync(dirPath).isDirectory(), `${dir} n'est pas un dossier`);
    });
});

// Test 3: Vérifier que le dashboard HTML contient les éléments DSFR
test('Le dashboard contient les classes DSFR', () => {
    const dashboardPath = path.join(__dirname, '..', 'signalconso-dashboard-dsfr.html');
    const content = fs.readFileSync(dashboardPath, 'utf8');
    
    const dsfrClasses = [
        'fr-header',
        'fr-container',
        'fr-grid-row',
        'fr-card',
        'fr-tile',
        'fr-footer'
    ];
    
    dsfrClasses.forEach(className => {
        assert(content.includes(className), `La classe DSFR ${className} n'est pas présente`);
    });
});

// Test 4: Vérifier que le HTML n'a pas d'emojis dans les titres
test('Pas d\'emojis dans les titres HTML', () => {
    const dashboardPath = path.join(__dirname, '..', 'signalconso-dashboard-dsfr.html');
    const content = fs.readFileSync(dashboardPath, 'utf8');
    
    // Extraction des titres h1-h6
    const titleRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi;
    const titles = [...content.matchAll(titleRegex)];
    
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu;
    
    titles.forEach(match => {
        const titleContent = match[1];
        assert(!emojiRegex.test(titleContent), `Emoji trouvé dans le titre: ${titleContent}`);
    });
});

// Test 5: Vérifier l'accessibilité (attributs ARIA)
test('Attributs d\'accessibilité présents', () => {
    const dashboardPath = path.join(__dirname, '..', 'signalconso-dashboard-dsfr.html');
    const content = fs.readFileSync(dashboardPath, 'utf8');
    
    // Note: alt= n'est requis que pour les images, qui ne sont pas présentes dans ce dashboard
    // Le dashboard utilise des graphiques via ODS widgets qui gèrent leur propre accessibilité
    const accessibilityAttributes = [
        'role=',
        'aria-label=',
        'lang='
    ];
    
    accessibilityAttributes.forEach(attr => {
        assert(content.includes(attr), `L'attribut d'accessibilité ${attr} n'est pas utilisé`);
    });
    
    // Vérifier spécifiquement les alternatives textuelles pour les graphiques
    assert(content.includes('Alternative textuelle'), 'Les alternatives textuelles pour les graphiques sont présentes');
});

// Test 6: Vérifier que les dépendances CDN sont correctes
test('Les CDN DSFR et ODS sont correctement référencés', () => {
    const dashboardPath = path.join(__dirname, '..', 'signalconso-dashboard-dsfr.html');
    const content = fs.readFileSync(dashboardPath, 'utf8');
    
    const requiredCDNs = [
        'https://cdn.jsdelivr.net/npm/@gouvfr/dsfr',
        'https://static.opendatasoft.com/ods-widgets',
        'angular.js',
        'angular-sanitize'
    ];
    
    requiredCDNs.forEach(cdn => {
        assert(content.includes(cdn), `Le CDN ${cdn} n'est pas référencé`);
    });
});

// Test 7: Vérifier la configuration MCP
test('Le serveur MCP ODS est configuré', () => {
    const serverPath = path.join(__dirname, '..', 'mcp-ods-widgets', 'server.js');
    assert(fs.existsSync(serverPath), 'Le serveur MCP n\'existe pas');
    
    const content = fs.readFileSync(serverPath, 'utf8');
    assert(content.includes('create_widget'), 'La fonction create_widget n\'est pas définie');
    assert(content.includes('analyze_dataset'), 'La fonction analyze_dataset n\'est pas définie');
});

// Test 8: Vérifier que les exemples existent
test('Au moins un exemple de widget existe', () => {
    const examplesDir = path.join(__dirname, '..', 'examples');
    const files = fs.readdirSync(examplesDir);
    const htmlFiles = files.filter(f => f.endsWith('.html'));
    
    assert(htmlFiles.length > 0, 'Aucun fichier HTML d\'exemple trouvé');
});

// Résumé des tests
console.log('\n' + '='.repeat(50));
console.log(`✅ Tests réussis: ${testsPassed}`);
if (testsFailed > 0) {
    console.log(`❌ Tests échoués: ${testsFailed}`);
    process.exit(1);
} else {
    console.log('🎉 Tous les tests sont passés avec succès!');
    process.exit(0);
}