#!/usr/bin/env node

/**
 * Test d'intégration MCP DSFR + ODS Widgets
 * Vérifie que l'intégration fonctionne correctement
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

console.log(`${YELLOW}=== Test d'intégration MCP DSFR + ODS Widgets ===${RESET}\n`);

// Test 1: Vérifier les fichiers de mapping
async function testMappings() {
  console.log('Test 1: Vérification des mappings...');
  try {
    const mappingFiles = [
      'mcp-dsfr/mappings/ods-to-dsfr.json',
      'mcp-dsfr/mappings/dsfr-components.json',
      'mcp-dsfr/mappings/validation-rules.json'
    ];
        
    for (const file of mappingFiles) {
      const content = await fs.readFile(file, 'utf8');
      JSON.parse(content); // Vérifier que c'est du JSON valide
      console.log(`  ✓ ${file} valide`);
    }
    console.log(`${GREEN}✓ Test 1 réussi${RESET}\n`);
    return true;
  } catch (error) {
    console.log(`${RED}✗ Test 1 échoué: ${error.message}${RESET}\n`);
    return false;
  }
}

// Test 2: Vérifier le DSFRValidator
async function testValidator() {
  console.log('Test 2: Test du DSFRValidator...');
  try {
    const { default: DSFRValidator } = await import('./mcp-ods-widgets/services/dsfr-validator.js');
    const validator = new DSFRValidator();
        
    // Test de génération de structure
    const tableHTML = validator.generateDSFRStructure('ods-table', {
      content: '<ods-table></ods-table>'
    });
        
    if (!tableHTML.includes('fr-table')) {
      throw new Error('Structure DSFR non générée');
    }
        
    // Test de validation
    const validation = await validator.validate(tableHTML);
    console.log(`  Score de validation: ${validation.score}/100`);
        
    if (validation.score < 70) {
      throw new Error(`Score trop bas: ${validation.score}/100`);
    }
        
    console.log(`${GREEN}✓ Test 2 réussi${RESET}\n`);
    return true;
  } catch (error) {
    console.log(`${RED}✗ Test 2 échoué: ${error.message}${RESET}\n`);
    return false;
  }
}

// Test 3: Vérifier les templates
async function testTemplates() {
  console.log('Test 3: Vérification des templates...');
  try {
    const templates = [
      'mcp-ods-widgets/templates/table-dsfr.html',
      'mcp-ods-widgets/templates/chart-dsfr.html',
      'mcp-ods-widgets/templates/map-dsfr.html',
      'mcp-ods-widgets/templates/kpi-dsfr.html'
    ];
        
    for (const template of templates) {
      const content = await fs.readFile(template, 'utf8');
            
      // Vérifier les éléments essentiels
      if (!content.includes('fr-container')) {
        throw new Error(`${template}: Manque fr-container`);
      }
      if (!content.includes('ods-dataset-context')) {
        throw new Error(`${template}: Manque ods-dataset-context`);
      }
      if (!content.includes('{{WIDGET_ID}}')) {
        throw new Error(`${template}: Manque placeholder WIDGET_ID`);
      }
            
      console.log(`  ✓ ${path.basename(template)} valide`);
    }
    console.log(`${GREEN}✓ Test 3 réussi${RESET}\n`);
    return true;
  } catch (error) {
    console.log(`${RED}✗ Test 3 échoué: ${error.message}${RESET}\n`);
    return false;
  }
}

// Test 4: Test du serveur MCP
function testMCPServer() {
  return new Promise((resolve) => {
    console.log('Test 4: Test du serveur MCP ODS Widgets...');
        
    const server = spawn('node', ['mcp-ods-widgets/server.js']);
    let output = '';
    let errorOutput = '';
        
    server.stdout.on('data', (data) => {
      output += data.toString();
    });
        
    server.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
        
    // Envoyer une commande d'initialisation
    const initCommand = JSON.stringify({
      method: 'initialize',
      id: 1,
      params: {}
    });
        
    server.stdin.write(initCommand + '\n');
        
    setTimeout(() => {
      server.kill();
            
      if (output.includes('"protocolVersion"') && output.includes('"ods-widgets-mcp"')) {
        console.log('  ✓ Serveur MCP répond correctement');
        console.log(`${GREEN}✓ Test 4 réussi${RESET}\n`);
        resolve(true);
      } else {
        console.log(`${RED}✗ Test 4 échoué: Réponse invalide${RESET}\n`);
        resolve(false);
      }
    }, 1000);
  });
}

// Test 5: Génération d'un widget exemple
async function testWidgetGeneration() {
  console.log('Test 5: Test de génération de widget...');
  try {
    const { default: DSFRValidator } = await import('./mcp-ods-widgets/services/dsfr-validator.js');
    const validator = new DSFRValidator();
        
    // Générer un dashboard exemple
    const widgets = ['table', 'chart', 'kpi'];
    const htmlParts = [];
        
    for (const type of widgets) {
      const widgetHTML = validator.generateDSFRStructure(`ods-${type}`, {
        title: `Widget ${type}`,
        content: `<ods-${type}><ods-${type}>`
      });
      htmlParts.push(widgetHTML);
    }
        
    const dashboard = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <title>Test Dashboard DSFR</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.min.css">
</head>
<body>
    <div class="fr-container">
        <h1>Dashboard de test</h1>
        <div class="fr-grid-row fr-grid-row--gutters">
            ${htmlParts.map(h => `<div class="fr-col-12 fr-col-md-4">${h}</div>`).join('\n')}
        </div>
    </div>
</body>
</html>`;
        
    // Sauvegarder le dashboard de test
    await fs.writeFile('test-dashboard-generated.html', dashboard);
    console.log('  ✓ Dashboard généré: test-dashboard-generated.html');
        
    // Valider le dashboard
    const validation = await validator.validate(dashboard);
    console.log(`  Score final: ${validation.score}/100`);
        
    if (validation.score >= 70) {
      console.log(`${GREEN}✓ Test 5 réussi${RESET}\n`);
      return true;
    } else {
      throw new Error(`Score insuffisant: ${validation.score}/100`);
    }
  } catch (error) {
    console.log(`${RED}✗ Test 5 échoué: ${error.message}${RESET}\n`);
    return false;
  }
}

// Exécuter tous les tests
async function runAllTests() {
  const results = [];
    
  results.push(await testMappings());
  results.push(await testValidator());
  results.push(await testTemplates());
  results.push(await testMCPServer());
  results.push(await testWidgetGeneration());
    
  const passed = results.filter(r => r).length;
  const total = results.length;
    
  console.log(`${YELLOW}=== Résultats ===${RESET}`);
  console.log(`Tests réussis: ${passed}/${total}`);
    
  if (passed === total) {
    console.log(`${GREEN}✓ TOUS LES TESTS RÉUSSIS !${RESET}`);
    console.log('\nL\'intégration MCP DSFR + ODS Widgets est opérationnelle.');
  } else {
    console.log(`${RED}✗ ${total - passed} test(s) échoué(s)${RESET}`);
    console.log('\nVérifiez les erreurs ci-dessus pour corriger l\'intégration.');
  }
    
  process.exit(passed === total ? 0 : 1);
}

// Lancer les tests
runAllTests().catch(console.error);