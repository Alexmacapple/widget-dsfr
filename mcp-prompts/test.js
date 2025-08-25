#!/usr/bin/env node

/**
 * Test du serveur MCP Prompts
 */

const PromptMCPServer = require('./server');

async function testServer() {
  console.log('🧪 Test du serveur MCP Prompts\n');
  
  const server = new PromptMCPServer();
  
  // Test 1: List tools
  console.log('1️⃣ Test: Liste des outils');
  const tools = await server.handleRequest({ method: 'tools/list' });
  console.log(`✅ ${tools.tools.length} outils disponibles\n`);
  
  // Test 2: Generate prompt
  console.log('2️⃣ Test: Génération de prompt');
  const promptResult = await server.handleRequest({
    method: 'tools/call',
    params: {
      name: 'generate_prompt',
      arguments: {
        dataset: 'signalconso',
        widget: 'table',
        query: 'Créer une table avec filtres',
        minimal: true
      }
    }
  });
  console.log(`✅ Prompt généré: ~${promptResult.metadata.tokens} tokens\n`);
  
  // Test 3: List modules
  console.log('3️⃣ Test: Liste des modules');
  const modules = await server.handleRequest({
    method: 'tools/call',
    params: {
      name: 'list_modules',
      arguments: { category: 'all' }
    }
  });
  console.log(`✅ ${modules.total} modules disponibles`);
  console.log('   - core:', modules.modules.core.length);
  console.log('   - datasets:', modules.modules.datasets.length);
  console.log('   - widgets:', modules.modules.widgets.length, '\n');
  
  // Test 4: Estimate tokens
  console.log('4️⃣ Test: Estimation de tokens');
  const tokenResult = await server.handleRequest({
    method: 'tools/call',
    params: {
      name: 'estimate_tokens',
      arguments: {
        text: 'Ceci est un test pour estimer le nombre de tokens dans un texte.'
      }
    }
  });
  console.log(`✅ Estimation: ${tokenResult.tokens} tokens\n`);
  
  // Test 5: Optimize prompt
  console.log('5️⃣ Test: Optimisation de prompt');
  const longText = 'Lorem ipsum dolor sit amet. '.repeat(100);
  const optimizeResult = await server.handleRequest({
    method: 'tools/call',
    params: {
      name: 'optimize_prompt',
      arguments: {
        prompt: longText,
        target_tokens: 50
      }
    }
  });
  console.log(`✅ Optimisation: ${optimizeResult.savings.percentage}% de réduction\n`);
  
  // Test 6: Batch generate
  console.log('6️⃣ Test: Génération batch');
  const batchResult = await server.handleRequest({
    method: 'tools/call',
    params: {
      name: 'batch_generate',
      arguments: {
        requests: [
          { dataset: 'signalconso', widget: 'table', query: 'Table simple' },
          { dataset: 'budget-vert', widget: 'chart', query: 'Graphique' },
          { dataset: 'tarifs-bancaires', widget: 'kpi', query: 'Indicateurs' }
        ]
      }
    }
  });
  console.log(`✅ ${batchResult.summary.total} prompts générés`);
  console.log(`   Total: ${batchResult.summary.totalTokens} tokens`);
  console.log(`   Moyenne: ${batchResult.summary.averageTokens} tokens/prompt\n`);
  
  console.log('✨ Tous les tests sont passés avec succès!');
}

// Exécution
testServer().catch(console.error);