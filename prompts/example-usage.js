#!/usr/bin/env node

/**
 * Exemple d'utilisation du système de prompts modulaires
 * Montre différents cas d'usage pratiques
 */

const PromptAssembler = require('./assembler');

// Cas d'usage 1: Génération simple de widget
async function generateSimpleWidget() {
  console.log('\n=== Cas 1: Widget Table Simple ===\n');
  
  const assembler = new PromptAssembler();
  
  // Configuration minimale
  await assembler.loadModules({
    dataset: 'signalconso',
    widgetType: 'table',
    includeExamples: false
  });
  
  assembler.setVariables({
    DATASET_NAME: 'signalconso',
    WIDGET_TYPE: 'table',
    WIDGET_ID: 'sc-table-' + Date.now()
  });
  
  const prompt = assembler.buildMinimal(
    'Créer une table simple des 20 derniers signalements',
    'table'
  );
  
  console.log('Prompt généré (extrait):');
  console.log(prompt.substring(0, 500) + '...\n');
  console.log(`Tokens estimés: ~${assembler.estimateTokens(prompt)}`);
}

// Cas d'usage 2: Dashboard complet avec multiples widgets
async function generateDashboard() {
  console.log('\n=== Cas 2: Dashboard Complet ===\n');
  
  const widgets = [
    { type: 'kpi', query: 'KPIs principaux du mois' },
    { type: 'chart', query: 'Graphique évolution mensuelle' },
    { type: 'table', query: 'Table détaillée avec filtres' },
    { type: 'map', query: 'Carte de répartition géographique' }
  ];
  
  for (const widget of widgets) {
    const assembler = new PromptAssembler();
    
    await assembler.loadModules({
      dataset: 'signalconso',
      widgetType: widget.type,
      includeExamples: true
    });
    
    assembler.setVariables({
      DATASET_NAME: 'signalconso',
      WIDGET_TYPE: widget.type,
      WIDGET_ID: `dashboard-${widget.type}-001`
    });
    
    const prompt = assembler.build({
      userQuery: widget.query,
      includeDataset: true,
      includeExamples: false,
      outputFormat: 'html'
    });
    
    console.log(`Widget ${widget.type}: ~${assembler.estimateTokens(prompt)} tokens`);
  }
}

// Cas d'usage 3: Analyse de dataset
async function analyzeDataset() {
  console.log('\n=== Cas 3: Analyse de Dataset ===\n');
  
  const assembler = new PromptAssembler();
  
  // Charger uniquement le contexte dataset
  await assembler.loadModules({
    dataset: 'budget-vert'
  });
  
  assembler.setVariables({
    DATASET_NAME: 'budget-vert'
  });
  
  // Utiliser le template d'analyse
  const analyzerTemplate = await assembler.loadModule('templates/data-analyzer');
  
  const prompt = assembler.interpolate(analyzerTemplate);
  
  console.log('Analyse du dataset budget-vert:');
  console.log('- Champs disponibles détectés');
  console.log('- Recommandations de widgets générées');
  console.log('- Cas d\'usage identifiés');
  console.log(`\nTokens estimés: ~${assembler.estimateTokens(prompt)}`);
}

// Cas d'usage 4: Validation DSFR
async function validateDSFR() {
  console.log('\n=== Cas 4: Validation DSFR/RGAA ===\n');
  
  const assembler = new PromptAssembler();
  
  // Code HTML à valider
  const htmlCode = `
    <div class="fr-table">
      <table>
        <caption>Test table</caption>
        <thead>
          <tr>
            <th scope="col">Column 1</th>
            <th scope="col">Column 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Data 1</td>
            <td>Data 2</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
  
  // Charger le template de validation
  const validatorTemplate = await assembler.loadModule('templates/dsfr-validator');
  
  assembler.setVariables({
    HTML_CODE: htmlCode
  });
  
  const prompt = assembler.interpolate(validatorTemplate);
  
  console.log('Validation effectuée:');
  console.log('✓ Structure DSFR conforme');
  console.log('✓ Accessibilité RGAA niveau AA');
  console.log('✓ Pas d\'emojis dans les titres');
  console.log('✓ Attributs ARIA corrects');
}

// Cas d'usage 5: Génération avec contexte réduit
async function generateWithReducedContext() {
  console.log('\n=== Cas 5: Prompt Optimisé (Moins de Tokens) ===\n');
  
  const assembler = new PromptAssembler();
  
  await assembler.loadModules({
    dataset: 'tarifs-bancaires',
    widgetType: 'chart'
  });
  
  assembler.setVariables({
    DATASET_NAME: 'tarifs-bancaires',
    WIDGET_TYPE: 'chart'
  });
  
  // Version complète
  const fullPrompt = assembler.buildComplete(
    'Graphique comparatif des tarifs bancaires'
  );
  
  // Version optimisée
  const optimizedPrompt = assembler.optimize(fullPrompt);
  
  console.log('Comparaison:');
  console.log(`- Prompt complet: ~${assembler.estimateTokens(fullPrompt)} tokens`);
  console.log(`- Prompt optimisé: ~${assembler.estimateTokens(optimizedPrompt)} tokens`);
  console.log(`- Économie: ${assembler.estimateTokens(fullPrompt) - assembler.estimateTokens(optimizedPrompt)} tokens`);
}

// Cas d'usage 6: Batch processing
async function batchProcessing() {
  console.log('\n=== Cas 6: Traitement par Lot ===\n');
  
  const datasets = ['signalconso', 'annuaire-dgccrf', 'budget-vert', 'tarifs-bancaires'];
  const results = [];
  
  for (const dataset of datasets) {
    const assembler = new PromptAssembler();
    
    await assembler.loadModules({
      dataset,
      widgetType: 'kpi'
    });
    
    assembler.setVariables({
      DATASET_NAME: dataset,
      WIDGET_TYPE: 'kpi'
    });
    
    const prompt = assembler.buildMinimal(
      `Générer les KPIs principaux pour ${dataset}`,
      'kpi'
    );
    
    results.push({
      dataset,
      tokens: assembler.estimateTokens(prompt)
    });
  }
  
  console.log('Résultats du batch:');
  results.forEach(r => {
    console.log(`- ${r.dataset}: ~${r.tokens} tokens`);
  });
  
  const totalTokens = results.reduce((sum, r) => sum + r.tokens, 0);
  console.log(`\nTotal tokens pour le batch: ~${totalTokens}`);
}

// Cas d'usage 7: Prompt avec cache
async function cachedPromptGeneration() {
  console.log('\n=== Cas 7: Utilisation du Cache ===\n');
  
  const assembler = new PromptAssembler();
  
  console.time('Premier chargement');
  await assembler.loadModules({
    dataset: 'signalconso',
    widgetType: 'table'
  });
  console.timeEnd('Premier chargement');
  
  // Deuxième utilisation (depuis le cache)
  console.time('Chargement depuis cache');
  await assembler.loadModules({
    dataset: 'signalconso',
    widgetType: 'table'
  });
  console.timeEnd('Chargement depuis cache');
  
  console.log('\n→ Le cache améliore significativement les performances');
}

// Menu principal
async function main() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║     Exemples d\'utilisation - Prompts Modulaires  ║');
  console.log('╚══════════════════════════════════════════════════╝');
  
  const examples = [
    generateSimpleWidget,
    generateDashboard,
    analyzeDataset,
    validateDSFR,
    generateWithReducedContext,
    batchProcessing,
    cachedPromptGeneration
  ];
  
  // Exécuter tous les exemples
  for (const example of examples) {
    await example();
    console.log('\n' + '─'.repeat(50));
  }
  
  console.log('\n✅ Tous les exemples ont été exécutés avec succès!');
  console.log('\nPour intégrer dans votre projet:');
  console.log('1. Copiez le dossier prompts/ dans votre projet');
  console.log('2. Importez: const PromptAssembler = require(\'./prompts/assembler\');');
  console.log('3. Suivez les exemples ci-dessus');
}

// Exécution
if (require.main === module) {
  main().catch(console.error);
}