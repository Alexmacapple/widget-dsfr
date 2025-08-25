#!/usr/bin/env node

/**
 * Script CLI pour générer rapidement des prompts de widgets DSFR
 * Usage: node generate-widget-prompt.js [dataset] [widget-type] "query"
 */

const PromptAssembler = require('./prompts/assembler');
const fs = require('fs').promises;
const path = require('path');

// Parse arguments
const args = process.argv.slice(2);

if (args.length < 3 || args.includes('--help')) {
  console.log(`
Usage: node generate-widget-prompt.js [dataset] [widget-type] "query" [options]

Arguments:
  dataset      Dataset name (signalconso, budget-vert, etc.)
  widget-type  Widget type (table, chart, map, kpi, facets)
  query        User query in quotes

Options:
  --minimal    Generate minimal prompt (less tokens)
  --save       Save to file
  --analyze    Show token analysis

Examples:
  node generate-widget-prompt.js signalconso table "Créer une table des signalements"
  node generate-widget-prompt.js budget-vert chart "Graphique du budget" --minimal
  node generate-widget-prompt.js tarifs-bancaires kpi "KPIs principaux" --save
  `);
  process.exit(0);
}

const [dataset, widgetType, query, ...options] = args;

async function generatePrompt() {
  try {
    console.log('\n🚀 Génération du prompt...\n');
    
    const assembler = new PromptAssembler();
    
    // Charger les modules
    await assembler.loadModules({
      dataset,
      widgetType,
      includeExamples: !options.includes('--minimal')
    });
    
    // Définir les variables
    assembler.setVariables({
      DATASET_NAME: dataset,
      WIDGET_TYPE: widgetType,
      WIDGET_ID: `${dataset}-${widgetType}-${Date.now()}`,
      USER_QUERY: query
    });
    
    // Construire le prompt
    let prompt;
    if (options.includes('--minimal')) {
      prompt = assembler.buildMinimal(query, widgetType);
      console.log('📦 Mode: Minimal\n');
    } else {
      prompt = assembler.build({
        userQuery: query,
        includeDataset: true,
        includeExamples: false,
        outputFormat: 'html'
      });
      console.log('📦 Mode: Standard\n');
    }
    
    // Optimiser
    prompt = assembler.optimize(prompt);
    
    // Analyser si demandé
    if (options.includes('--analyze')) {
      const stats = assembler.analyzePrompt(prompt);
      console.log('📊 Analyse du prompt:');
      console.log(`- Tokens estimés: ~${stats.estimatedTokens}`);
      console.log(`- Lignes: ${stats.lineCount}`);
      console.log(`- Sections: ${stats.sectionCount}`);
      console.log(`- Variables: ${stats.variableCount}\n`);
    }
    
    // Sauvegarder si demandé
    if (options.includes('--save')) {
      const filename = `prompt-${dataset}-${widgetType}-${Date.now()}.md`;
      const outputPath = path.join(__dirname, 'prompts', 'output', filename);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, prompt, 'utf-8');
      console.log(`💾 Sauvegardé: ${outputPath}\n`);
    }
    
    // Afficher le prompt (ou un extrait)
    console.log('📝 Prompt généré:\n');
    console.log('─'.repeat(60));
    
    if (prompt.length > 2000 && !options.includes('--full')) {
      console.log(prompt.substring(0, 1500));
      console.log('\n... [Tronqué - utilisez --full pour voir tout] ...\n');
    } else {
      console.log(prompt);
    }
    
    console.log('─'.repeat(60));
    console.log('\n✅ Prompt prêt à être utilisé!');
    console.log(`📏 Taille estimée: ~${assembler.estimateTokens(prompt)} tokens\n`);
    
    // Instructions d'utilisation
    console.log('💡 Pour utiliser ce prompt:');
    console.log('1. Copiez le contenu ci-dessus');
    console.log('2. Collez dans votre LLM (Claude, GPT, etc.)');
    console.log('3. Le modèle générera le widget DSFR demandé\n');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('\nVérifiez que:');
    console.error('- Le dataset existe dans prompts/datasets/');
    console.error('- Le type de widget existe dans prompts/widgets/');
    console.error('- La syntaxe est correcte');
    process.exit(1);
  }
}

// Exécution
generatePrompt();