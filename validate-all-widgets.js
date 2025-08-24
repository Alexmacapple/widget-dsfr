#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('=== VALIDATION COMPLÈTE DES WIDGETS DSFR ===\n');

const widgetDirs = ['tables', 'charts', 'facets', 'maps'];
let globalSummary = {
    total: 0,
    apiReelle: 0,
    dsfrConforme: 0,
    problemes: []
};

widgetDirs.forEach(dir => {
    const dirPath = path.join(__dirname, 'widgets', dir);
    
    if (!fs.existsSync(dirPath)) {
        console.log(`⚠️  Dossier ${dir} non trouvé\n`);
        return;
    }
    
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));
    
    console.log(`\n📁 ${dir.toUpperCase()} (${files.length} widgets)\n`);
    console.log('─'.repeat(50));
    
    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        globalSummary.total++;
        
        // Check API réelle
        const usesRealAPI = content.includes('data.economie.gouv.fr');
        
        // Check DSFR
        const dsfrChecks = {
            'CSS': content.includes('@gouvfr/dsfr'),
            'Lang': content.includes('lang="fr"'),
            'Theme': content.includes('data-fr-theme')
        };
        
        const dsfrOk = Object.values(dsfrChecks).every(v => v);
        
        // Check emojis
        const hasEmojis = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/u.test(content);
        
        // Affichage du statut
        let status = '';
        if (usesRealAPI) {
            status += '✅ API ';
            globalSummary.apiReelle++;
        } else {
            status += '❌ API ';
            globalSummary.problemes.push(`${dir}/${file}: Données simulées`);
        }
        
        if (dsfrOk) {
            status += '✅ DSFR ';
            globalSummary.dsfrConforme++;
        } else {
            status += '⚠️  DSFR ';
        }
        
        if (hasEmojis) {
            status += '⚠️  Emojis';
            globalSummary.problemes.push(`${dir}/${file}: Contient des emojis`);
        }
        
        console.log(`  ${file.padEnd(35)} ${status}`);
    });
});

// Résumé global
console.log('\n' + '='.repeat(60));
console.log('📊 RÉSUMÉ GLOBAL');
console.log('='.repeat(60));

const apiPct = Math.round((globalSummary.apiReelle / globalSummary.total) * 100);
const dsfrPct = Math.round((globalSummary.dsfrConforme / globalSummary.total) * 100);

console.log(`\nTotal widgets : ${globalSummary.total}`);
console.log(`API réelle    : ${globalSummary.apiReelle}/${globalSummary.total} (${apiPct}%)`);
console.log(`DSFR conforme : ${globalSummary.dsfrConforme}/${globalSummary.total} (${dsfrPct}%)`);

// Graphique ASCII de progression
console.log('\n📈 Progression API réelle:');
const barLength = 40;
const apiBar = Math.round((apiPct / 100) * barLength);
console.log(`[${'\u2588'.repeat(apiBar)}${'-'.repeat(barLength - apiBar)}] ${apiPct}%`);

console.log('\n📈 Conformité DSFR:');
const dsfrBar = Math.round((dsfrPct / 100) * barLength);
console.log(`[${'\u2588'.repeat(dsfrBar)}${'-'.repeat(barLength - dsfrBar)}] ${dsfrPct}%`);

if (globalSummary.problemes.length > 0) {
    console.log('\n⚠️  PROBLÈMES À CORRIGER:');
    // Limiter l'affichage aux 10 premiers problèmes
    globalSummary.problemes.slice(0, 10).forEach(p => {
        console.log(`  - ${p}`);
    });
    if (globalSummary.problemes.length > 10) {
        console.log(`  ... et ${globalSummary.problemes.length - 10} autres`);
    }
}

// Recommandations
console.log('\n💡 RECOMMANDATIONS:');
if (apiPct < 100) {
    console.log('  1. Migrer tous les widgets vers l\'API data.economie.gouv.fr');
}
if (dsfrPct < 100) {
    console.log('  2. Vérifier la conformité DSFR de tous les widgets');
}
if (globalSummary.problemes.some(p => p.includes('emojis'))) {
    console.log('  3. Remplacer les emojis par des icônes DSFR');
}

console.log('\n✅ Validation terminée\n');