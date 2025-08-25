#!/usr/bin/env node

/**
 * Script de test du système de prompts modulaires
 * Teste l'assemblage, l'optimisation et la génération de prompts
 */

const PromptAssembler = require('./assembler');
const fs = require('fs').promises;
const path = require('path');
let chalk;
try {
  chalk = require('chalk').default || require('chalk');
} catch (error) {
  // Fallback si chalk n'est pas disponible
  chalk = {
    blue: { bold: (str) => `[BLUE] ${str}` },
    yellow: (str) => `[YELLOW] ${str}`,
    green: (str) => `[GREEN] ${str}`,
    red: (str) => `[RED] ${str}`,
    gray: (str) => `[GRAY] ${str}`,
  };
}

// Configuration des tests
const TEST_CASES = [
  {
    name: 'Table SignalConso simple',
    config: {
      dataset: 'signalconso',
      widgetType: 'table',
      includeExamples: false
    },
    variables: {
      DATASET_NAME: 'signalconso',
      WIDGET_TYPE: 'table',
      WIDGET_ID: 'sc-table-001',
      API_ENDPOINT: 'https://data.economie.gouv.fr/api/v2',
      DATASET: 'signalconso',
      TABLE_TITLE: 'Signalements consommateurs',
      COLUMN: 'date',
      COLUMN_NAME: 'Date',
      ID: '123',
      SIRET: '12345678900001',
      SCHEMA_DATA: 'fields: {date, company, status}'
    },
    query: 'Créer une table des signalements récents avec tri et pagination',
    expectedTokens: { min: 2000, max: 4000 }
  },
  {
    name: 'Chart Budget Vert avec exemples',
    config: {
      dataset: 'budget-vert',
      widgetType: 'chart',
      includeExamples: true
    },
    variables: {
      DATASET_NAME: 'budget-vert',
      WIDGET_TYPE: 'chart',
      WIDGET_ID: 'bv-chart-001',
      API_ENDPOINT: 'https://data.economie.gouv.fr/api/v2',
      MISSION_NAME: 'Ecologie',
      METRIC_NAME: 'Budget favorable',
      CHART_TITLE: 'Budget Vert 2025',
      DATASET: 'budget-vert',
      TYPE: 'bar',
      CHART_DESCRIPTION: 'Répartition du budget vert par mission'
    },
    query: 'Graphique en barres du budget par mission',
    expectedTokens: { min: 3000, max: 6000 }
  },
  {
    name: 'Map Annuaire DGCCRF minimal',
    config: {
      dataset: 'annuaire-dgccrf',
      widgetType: 'map',
      includeExamples: false
    },
    variables: {
      DATASET_NAME: 'annuaire-dgccrf',
      WIDGET_TYPE: 'map',
      WIDGET_ID: 'dgccrf-map-001',
      API_ENDPOINT: 'https://data.economie.gouv.fr/api/v2',
      MAP_TITLE: 'Services DGCCRF',
      DATASET: 'annuaire-dgccrf',
      MAP_DESCRIPTION: 'Carte des services DGCCRF',
      COUNT: '250'
    },
    query: 'Carte interactive des services DGCCRF',
    expectedTokens: { min: 1500, max: 2500 },
    minimal: true
  },
  {
    name: 'KPI Tarifs Bancaires',
    config: {
      dataset: 'tarifs-bancaires',
      widgetType: 'kpi',
      includeExamples: false
    },
    variables: {
      DATASET_NAME: 'tarifs-bancaires',
      WIDGET_TYPE: 'kpi',
      WIDGET_ID: 'tb-kpi-001',
      API_ENDPOINT: 'https://data.economie.gouv.fr/api/v2',
      BANK_NAME: 'BNP Paribas',
      KPI_LABEL: 'Tarif moyen',
      KPI_VALUE: '45.50',
      KPI_UNIT: '€',
      ICON_NAME: 'money-euro-circle-line',
      KPI_DESCRIPTION: 'Tarif moyen carte bancaire',
      ICON: 'money-euro-circle-line',
      VARIATION: '+5.2'
    },
    query: 'Indicateurs clés des tarifs moyens par catégorie',
    expectedTokens: { min: 2500, max: 4000 }
  },
  {
    name: 'Facets multi-dataset',
    config: {
      dataset: 'signalconso',
      widgetType: 'facets',
      includeExamples: false
    },
    variables: {
      DATASET_NAME: 'signalconso',
      WIDGET_TYPE: 'facets',
      WIDGET_ID: 'sc-facets-001',
      API_ENDPOINT: 'https://data.economie.gouv.fr/api/v2',
      SIRET: '12345678900001',
      FACET_ID: 'category',
      FACET_LABEL: 'Catégorie',
      FACET_COUNT: '25',
      FACET_NAME: 'problem_type',
      VALUE_ID: 'commerce',
      VALUE: 'Commerce',
      VALUE_LABEL: 'Commerce',
      RANGE_ID: 'amount',
      RANGE_LABEL: 'Montant',
      MIN_VALUE: '0',
      MAX_VALUE: '1000',
      STEP: '10',
      CURRENT_VALUE: '500',
      RESULT_COUNT: '150'
    },
    query: 'Système de filtres à facettes pour exploration des données',
    expectedTokens: { min: 2500, max: 4500 }
  }
];

class PromptTester {
  constructor() {
    this.results = [];
    this.assembler = new PromptAssembler();
  }

  /**
   * Exécute tous les tests
   */
  async runAllTests() {
    console.log(chalk.blue.bold('\n🧪 Démarrage des tests du système de prompts\n'));

    for (const testCase of TEST_CASES) {
      await this.runTest(testCase);
    }

    this.printSummary();
  }

  /**
   * Exécute un test individuel
   */
  async runTest(testCase) {
    console.log(chalk.yellow(`📝 Test: ${testCase.name}`));

    try {
      // Charger les modules
      await this.assembler.loadModules(testCase.config);
      
      // Définir les variables
      this.assembler.setVariables(testCase.variables);

      // Construire le prompt
      const prompt = testCase.minimal
        ? this.assembler.buildMinimal(testCase.query, testCase.config.widgetType)
        : this.assembler.build({
            userQuery: testCase.query,
            includeDataset: true,
            includeExamples: testCase.config.includeExamples,
            outputFormat: 'html'
          });

      // Optimiser
      const optimized = this.assembler.optimize(prompt);

      // Analyser
      const stats = this.analyzePrompt(optimized);

      // Valider
      const validation = this.validatePrompt(optimized, testCase);

      // Sauvegarder si demandé
      if (process.argv.includes('--save')) {
        const filename = `test-${testCase.config.dataset}-${testCase.config.widgetType}.md`;
        await this.savePrompt(optimized, filename);
      }

      // Enregistrer le résultat
      this.results.push({
        name: testCase.name,
        success: validation.success,
        stats,
        issues: validation.issues
      });

      // Afficher le résultat
      if (validation.success) {
        console.log(chalk.green(`✅ Test réussi`));
      } else {
        console.log(chalk.red(`❌ Test échoué`));
        validation.issues.forEach(issue => {
          console.log(chalk.red(`   - ${issue}`));
        });
      }

      console.log(chalk.gray(`   Tokens: ~${stats.estimatedTokens} | Lignes: ${stats.lineCount}\n`));

    } catch (error) {
      console.log(chalk.red(`❌ Erreur: ${error.message}\n`));
      this.results.push({
        name: testCase.name,
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Analyse les statistiques du prompt
   */
  analyzePrompt(prompt) {
    return {
      totalLength: prompt.length,
      estimatedTokens: this.assembler.estimateTokens(prompt),
      lineCount: prompt.split('\n').length,
      sectionCount: (prompt.match(/^#+ /gm) || []).length,
      codeBlockCount: (prompt.match(/```/g) || []).length / 2,
      variableCount: (prompt.match(/\{\{/g) || []).length
    };
  }

  /**
   * Valide le prompt selon les critères
   */
  validatePrompt(prompt, testCase) {
    const issues = [];
    const stats = this.analyzePrompt(prompt);

    // Vérifier la plage de tokens
    if (testCase.expectedTokens) {
      if (stats.estimatedTokens < testCase.expectedTokens.min) {
        issues.push(`Trop peu de tokens: ${stats.estimatedTokens} < ${testCase.expectedTokens.min}`);
      }
      if (stats.estimatedTokens > testCase.expectedTokens.max) {
        issues.push(`Trop de tokens: ${stats.estimatedTokens} > ${testCase.expectedTokens.max}`);
      }
    }

    // Vérifier la présence des sections obligatoires
    const requiredSections = [
      '# Contexte',
      '# User Request',
      '# Expected Output',
      '# Compliance Requirements'
    ];

    requiredSections.forEach(section => {
      if (!prompt.includes(section)) {
        issues.push(`Section manquante: ${section}`);
      }
    });

    // Vérifier l'interpolation des variables
    if (prompt.includes('{{')) {
      const unresolved = prompt.match(/\{\{(\w+)\}\}/g);
      if (unresolved) {
        issues.push(`Variables non résolues: ${unresolved.join(', ')}`);
      }
    }

    // Vérifier l'absence d'emojis dans les titres
    const headings = prompt.match(/^#+.*$/gm) || [];
    headings.forEach(heading => {
      if (/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]/u.test(heading)) {
        issues.push(`Emoji trouvé dans un titre: ${heading.substring(0, 50)}...`);
      }
    });

    return {
      success: issues.length === 0,
      issues
    };
  }

  /**
   * Sauvegarde un prompt pour inspection
   */
  async savePrompt(prompt, filename) {
    const outputDir = path.join(__dirname, 'output');
    await fs.mkdir(outputDir, { recursive: true });
    
    const filepath = path.join(outputDir, filename);
    await fs.writeFile(filepath, prompt, 'utf-8');
    
    console.log(chalk.gray(`   Sauvegardé: ${filepath}`));
  }

  /**
   * Affiche le résumé des tests
   */
  printSummary() {
    console.log(chalk.blue.bold('\n📊 Résumé des tests\n'));

    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const total = this.results.length;

    console.log(`Total: ${total} tests`);
    console.log(chalk.green(`✅ Réussis: ${passed}`));
    console.log(chalk.red(`❌ Échoués: ${failed}`));

    if (failed > 0) {
      console.log(chalk.yellow('\n⚠️  Tests échoués:'));
      this.results.filter(r => !r.success).forEach(r => {
        console.log(`- ${r.name}`);
        if (r.issues) {
          r.issues.forEach(issue => console.log(`  • ${issue}`));
        }
        if (r.error) {
          console.log(`  • Erreur: ${r.error}`);
        }
      });
    }

    // Statistiques moyennes
    const avgTokens = Math.round(
      this.results.reduce((sum, r) => sum + (r.stats?.estimatedTokens || 0), 0) / total
    );

    console.log(chalk.blue(`\n📈 Statistiques moyennes:`));
    console.log(`- Tokens moyens: ~${avgTokens}`);

    // Code de sortie
    process.exit(failed > 0 ? 1 : 0);
  }
}

// Tests unitaires des fonctions
class UnitTests {
  static async runUnitTests() {
    console.log(chalk.blue.bold('\n🔬 Tests unitaires\n'));

    // Test interpolation
    const assembler = new PromptAssembler();
    assembler.setVariables({
      TEST_VAR: 'valeur_test',
      NUMBER: 42
    });

    const text = 'Variable: {{TEST_VAR}}, Nombre: {{NUMBER}}, Inconnu: {{UNKNOWN}}';
    const result = assembler.interpolate(text);
    
    console.assert(
      result === 'Variable: valeur_test, Nombre: 42, Inconnu: {{UNKNOWN}}',
      'Erreur interpolation'
    );
    console.log(chalk.green('✅ Test interpolation'));

    // Test estimation tokens
    const shortText = 'Hello world';
    const tokens = assembler.estimateTokens(shortText);
    console.assert(tokens > 0 && tokens < 10, 'Erreur estimation tokens');
    console.log(chalk.green('✅ Test estimation tokens'));

    // Test compression code
    const longCode = '```\n' + 'ligne\n'.repeat(30) + '```';
    const compressed = assembler.compressCodeExamples(longCode);
    console.assert(compressed.includes('[Code tronqué'), 'Erreur compression code');
    console.log(chalk.green('✅ Test compression code'));

    console.log(chalk.green('\n✨ Tous les tests unitaires sont passés\n'));
  }
}

// Point d'entrée principal
(async () => {
  try {
    // Vérifier la présence du module chalk
    try {
      require('chalk');
    } catch {
      console.log('Installation de chalk...');
      require('child_process').execSync('npm install chalk', { stdio: 'inherit' });
    }

    // Options CLI
    const args = process.argv.slice(2);
    
    if (args.includes('--unit')) {
      await UnitTests.runUnitTests();
    }

    if (args.includes('--help')) {
      console.log(`
Usage: node test-prompts.js [options]

Options:
  --unit     Exécuter les tests unitaires
  --save     Sauvegarder les prompts générés
  --help     Afficher cette aide

Exemples:
  node test-prompts.js          # Exécuter tous les tests
  node test-prompts.js --save   # Exécuter et sauvegarder
  node test-prompts.js --unit   # Tests unitaires seulement
      `);
      process.exit(0);
    }

    // Exécuter les tests d'intégration
    const tester = new PromptTester();
    await tester.runAllTests();

  } catch (error) {
    console.error(chalk.red(`\n❌ Erreur fatale: ${error.message}`));
    console.error(error.stack);
    process.exit(1);
  }
})();