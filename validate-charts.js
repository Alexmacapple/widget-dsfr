#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const chartsDir = path.join(__dirname, 'widgets', 'charts');
const files = fs.readdirSync(chartsDir).filter(f => f.endsWith('.html'));

console.log('=== VALIDATION DES WIDGETS CHARTS ===\n');

let summary = {
  total: files.length,
  apiReelle: 0,
  donneesSimulees: 0,
  dsfrConforme: 0,
  problemes: []
};

files.forEach(file => {
  const filePath = path.join(chartsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
    
  console.log(`📊 ${file}`);
    
  // Check API réelle
  const usesRealAPI = content.includes('data.economie.gouv.fr');
  if (usesRealAPI) {
    console.log('  ✅ API réelle data.economie.gouv.fr');
    summary.apiReelle++;
  } else {
    console.log('  ❌ Données simulées ou fictives');
    summary.donneesSimulees++;
    summary.problemes.push(`${file}: Utilise des données simulées`);
  }
    
  // Check DSFR
  const dsfrChecks = {
    'DSFR CSS': content.includes('@gouvfr/dsfr'),
    'Lang FR': content.includes('lang="fr"'),
    'Theme': content.includes('data-fr-theme'),
    'Classes DSFR': content.includes('fr-') && (content.includes('fr-container') || content.includes('fr-card')),
    'Chart.js': content.includes('chart.js')
  };
    
  let dsfrOk = true;
  Object.entries(dsfrChecks).forEach(([check, result]) => {
    if (!result) {
      console.log(`  ⚠️  ${check} manquant`);
      dsfrOk = false;
    }
  });
    
  if (dsfrOk) {
    console.log('  ✅ Conformité DSFR');
    summary.dsfrConforme++;
  }
    
  // Check emojis
  const hasEmojis = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/u.test(content);
  if (hasEmojis) {
    console.log('  ⚠️  Contient des emojis (à remplacer par icônes DSFR)');
    summary.problemes.push(`${file}: Contient des emojis`);
  }
    
  console.log('');
});

console.log('=== RÉSUMÉ ===');
console.log(`Total widgets: ${summary.total}`);
console.log(`API réelle: ${summary.apiReelle}/${summary.total}`);
console.log(`Données simulées: ${summary.donneesSimulees}/${summary.total}`);
console.log(`DSFR conforme: ${summary.dsfrConforme}/${summary.total}`);

if (summary.problemes.length > 0) {
  console.log('\n⚠️  PROBLÈMES DÉTECTÉS:');
  summary.problemes.forEach(p => console.log(`  - ${p}`));
}

console.log('\n📌 RECOMMANDATION:');
if (summary.donneesSimulees > 0) {
  console.log('  Migrer tous les widgets vers l\'API data.economie.gouv.fr');
}