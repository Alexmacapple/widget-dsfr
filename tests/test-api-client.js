#!/usr/bin/env node

/**
 * Tests simples pour ApiClient sans dépendances externes
 */

const fs = require('fs');
const path = require('path');

// Charger ApiClient
const apiClientPath = path.join(__dirname, '..', 'src', 'api', 'api-client.js');
const apiClientCode = fs.readFileSync(apiClientPath, 'utf8');

// Créer un contexte global pour exécuter le code
const context = {
  window: {},
  fetch: async (url, options) => {
    // Mock fetch pour les tests
    console.log(`  Mock fetch: ${url}`);
    return {
      ok: true,
      status: 200,
      headers: new Map([['content-length', '1024']]),
      json: async () => ({
        nhits: 100,
        records: [
          { recordid: '1', fields: { name: 'Test 1' } },
          { recordid: '2', fields: { name: 'Test 2' } }
        ],
        facet_groups: [
          {
            name: 'region',
            facets: [
              { name: 'Île-de-France', count: 50 },
              { name: 'Occitanie', count: 30 }
            ]
          }
        ]
      })
    };
  },
  URL: class URL {
    constructor(url) {
      this.href = url;
      this.searchParams = {
        params: {},
        append: function(key, value) {
          this.params[key] = value;
        }
      };
    }
    toString() {
      const params = Object.entries(this.searchParams.params)
        .map(([k, v]) => `${k}=${v}`)
        .join('&');
      return `${this.href}?${params}`;
    }
  },
  performance: {
    now: () => Date.now()
  },
  AbortController: class {
    constructor() {
      this.signal = {};
    }
    abort() {}
  },
  AbortSignal: {
    timeout: () => ({})
  },
  setTimeout: global.setTimeout,
  clearTimeout: global.clearTimeout,
  Date: global.Date,
  console: global.console,
  Map: global.Map
};

// Fonction pour évaluer le code dans le contexte
function loadApiClient() {
  const moduleCode = apiClientCode
    .replace('window.ApiClient = ApiClient', 'return ApiClient')
    .replace('module.exports = ApiClient', 'return ApiClient');
  
  const func = new Function('window', 'fetch', 'URL', 'performance', 'AbortController', 'AbortSignal', 'setTimeout', 'clearTimeout', 'Date', 'console', 'Map', moduleCode);
  
  return func(
    context.window,
    context.fetch,
    context.URL,
    context.performance,
    context.AbortController,
    context.AbortSignal,
    context.setTimeout,
    context.clearTimeout,
    context.Date,
    context.console,
    context.Map
  );
}

const ApiClient = loadApiClient();

// Tests
async function runTests() {
  console.log('🧪 Tests ApiClient\n');
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: Création d'instance
  console.log('Test 1: Création d\'instance');
  try {
    const client = new ApiClient({
      cacheTimeout: 1000,
      retryAttempts: 2
    });
    console.log('  ✅ Instance créée avec succès');
    passed++;
    
    // Test 2: Construction d'URL
    console.log('\nTest 2: Construction d\'URL');
    const url = client.buildUrl('search', {
      dataset: 'signalconso',
      rows: 10
    });
    
    if (url.includes('dataset=signalconso') && url.includes('rows=10')) {
      console.log('  ✅ URL construite correctement:', url);
      passed++;
    } else {
      console.log('  ❌ URL incorrecte:', url);
      failed++;
    }
    
    // Test 3: Recherche avec mock
    console.log('\nTest 3: Recherche avec mock fetch');
    const data = await client.search('signalconso', { rows: 10 });
    
    if (data.nhits === 100 && data.records.length === 2) {
      console.log('  ✅ Données récupérées:', data.nhits, 'résultats');
      passed++;
    } else {
      console.log('  ❌ Données incorrectes');
      failed++;
    }
    
    // Test 4: Cache
    console.log('\nTest 4: Test du cache');
    const stats1 = client.getStats();
    const data2 = await client.search('signalconso', { rows: 10 });
    const stats2 = client.getStats();
    
    if (stats2.cacheHits > stats1.cacheHits) {
      console.log('  ✅ Cache fonctionne:', stats2.cacheHits, 'hits');
      passed++;
    } else {
      console.log('  ❌ Cache ne fonctionne pas');
      failed++;
    }
    
    // Test 5: Facettes
    console.log('\nTest 5: Récupération des facettes');
    const facets = await client.getFacets('signalconso', ['region']);
    
    if (facets.region && facets.region.length > 0) {
      console.log('  ✅ Facettes récupérées:', facets.region.length, 'régions');
      passed++;
    } else {
      console.log('  ❌ Facettes non récupérées');
      failed++;
    }
    
    // Test 6: Statistiques
    console.log('\nTest 6: Statistiques');
    const stats = client.getStats();
    
    if (stats.requests > 0 && stats.cacheHits >= 0) {
      console.log('  ✅ Statistiques disponibles:');
      console.log('    - Requêtes:', stats.requests);
      console.log('    - Cache hits:', stats.cacheHits);
      console.log('    - Taux de cache:', stats.cacheHitRate.toFixed(1) + '%');
      passed++;
    } else {
      console.log('  ❌ Statistiques incorrectes');
      failed++;
    }
    
    // Test 7: Clear cache
    console.log('\nTest 7: Nettoyage du cache');
    client.clearCache();
    const cacheSize = client.cache.size;
    
    if (cacheSize === 0) {
      console.log('  ✅ Cache vidé avec succès');
      passed++;
    } else {
      console.log('  ❌ Cache non vidé:', cacheSize);
      failed++;
    }
    
    // Nettoyage
    client.destroy();
    
  } catch (error) {
    console.error('  ❌ Erreur:', error.message);
    failed++;
  }
  
  // Résumé
  console.log('\n' + '='.repeat(50));
  console.log('📊 Résultats des tests:');
  console.log(`✅ Réussis: ${passed}`);
  console.log(`❌ Échoués: ${failed}`);
  console.log(`📈 Taux de réussite: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  // Test avec l'API réelle (optionnel)
  if (process.argv.includes('--real-api')) {
    console.log('\n' + '='.repeat(50));
    console.log('🌐 Test avec l\'API réelle...\n');
    
    try {
      // Utiliser le vrai fetch pour ce test
      context.fetch = require('node-fetch');
      
      const realClient = new ApiClient();
      const realData = await realClient.search('signalconso', {
        rows: 5
      });
      
      if (realData.nhits > 0) {
        console.log('  ✅ Connexion API réussie');
        console.log('    - Total signalements:', realData.nhits);
        console.log('    - Récupérés:', realData.records.length);
        
        if (realData.records[0]) {
          const first = realData.records[0].fields;
          console.log('    - Premier enregistrement:');
          console.log('      • Date:', first.creationdate);
          console.log('      • Entreprise:', first.companyname || 'N/A');
          console.log('      • Statut:', first.status || 'N/A');
        }
      }
      
      realClient.destroy();
    } catch (error) {
      console.log('  ⚠️  API non accessible:', error.message);
      console.log('      (C\'est normal si vous êtes hors ligne)');
    }
  }
  
  process.exit(failed > 0 ? 1 : 0);
}

// Lancer les tests
runTests().catch(error => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});