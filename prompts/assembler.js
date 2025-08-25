/**
 * Système d'assemblage modulaire de prompts pour Widget Builder DSFR
 * Permet de composer dynamiquement des prompts à partir de modules indépendants
 */

const fs = require('fs').promises;
const path = require('path');

class PromptAssembler {
  constructor() {
    this.basePath = path.join(__dirname);
    this.modules = {};
    this.variables = {};
    this.cache = new Map();
  }

  /**
   * Charge un module depuis le système de fichiers
   * @param {string} modulePath - Chemin relatif du module
   * @returns {Promise<string>} Contenu du module
   */
  async loadModule(modulePath) {
    // Vérifier le cache
    if (this.cache.has(modulePath)) {
      return this.cache.get(modulePath);
    }

    try {
      const fullPath = path.join(this.basePath, modulePath + '.md');
      const content = await fs.readFile(fullPath, 'utf-8');
      
      // Mettre en cache pour les prochaines utilisations
      this.cache.set(modulePath, content);
      
      return content;
    } catch (error) {
      console.error(`Erreur chargement module ${modulePath}:`, error);
      return '';
    }
  }

  /**
   * Charge tous les modules nécessaires pour un type de prompt
   * @param {Object} config - Configuration du prompt
   */
  async loadModules(config) {
    const { dataset, widgetType, includeExamples = true } = config;

    // Modules core (toujours chargés)
    this.modules.task = await this.loadModule('core/task-description');
    this.modules.tone = await this.loadModule('core/tone-context');
    this.modules.output = await this.loadModule('core/output-format');
    this.modules.safety = await this.loadModule('core/safety-rules');

    // Modules spécifiques
    if (dataset) {
      this.modules.dataset = await this.loadModule(`datasets/${dataset}`);
    }

    if (widgetType) {
      this.modules.widget = await this.loadModule(`widgets/${widgetType}`);
    }

    // Exemples (optionnel)
    if (includeExamples && widgetType) {
      this.modules.examples = await this.loadModule(`examples/${widgetType}-examples`);
    }
  }

  /**
   * Définit les variables à interpoler dans le prompt
   * @param {Object} vars - Variables à remplacer
   */
  setVariables(vars) {
    this.variables = {
      ...this.variables,
      ...vars,
      TIMESTAMP: new Date().toISOString(),
      DSFR_VERSION: vars.DSFR_VERSION || '1.12.1'
    };
  }

  /**
   * Interpole les variables dans le texte
   * @param {string} text - Texte avec placeholders {{VAR}}
   * @returns {string} Texte avec variables remplacées
   */
  interpolate(text) {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return this.variables[key] || match;
    });
  }

  /**
   * Assemble le prompt final selon la configuration
   * @param {Object} options - Options d'assemblage
   * @returns {string} Prompt assemblé
   */
  build(options = {}) {
    const {
      userQuery,
      includeDataset = true,
      includeExamples = false,
      minimal = false,
      outputFormat = 'html'
    } = options;

    const sections = [];

    // Assemblage conditionnel des sections
    sections.push('# Contexte\n');
    sections.push(this.modules.task);
    
    if (!minimal) {
      sections.push(this.modules.tone);
    }

    if (includeDataset && this.modules.dataset) {
      sections.push('\n# Dataset Information\n');
      sections.push(this.modules.dataset);
    }

    if (this.modules.widget) {
      sections.push('\n# Widget Instructions\n');
      sections.push(this.modules.widget);
    }

    if (includeExamples && this.modules.examples && !minimal) {
      sections.push('\n# Examples\n');
      sections.push(this.modules.examples);
    }

    // Requête utilisateur
    sections.push('\n# User Request\n');
    sections.push(`**Query**: ${userQuery}`);

    // Format de sortie
    sections.push('\n# Expected Output\n');
    sections.push(this.getOutputSection(outputFormat));

    // Règles de sécurité (toujours à la fin)
    sections.push('\n# Compliance Requirements\n');
    sections.push(this.modules.safety);

    // Interpoler les variables et retourner
    return this.interpolate(sections.join('\n'));
  }

  /**
   * Récupère la section de format de sortie appropriée
   * @param {string} format - Format souhaité (html, json, markdown)
   */
  getOutputSection(format) {
    const outputContent = this.modules.output || '';
    
    // Extraire uniquement la section pertinente
    const formatMarkers = {
      html: '### Pour génération HTML',
      json: '### Pour réponse JSON',
      markdown: '### Pour documentation'
    };

    const marker = formatMarkers[format];
    if (marker && outputContent.includes(marker)) {
      const startIndex = outputContent.indexOf(marker);
      const nextMarkerIndex = outputContent.indexOf('###', startIndex + 1);
      
      if (nextMarkerIndex !== -1) {
        return outputContent.substring(startIndex, nextMarkerIndex);
      }
      return outputContent.substring(startIndex);
    }

    return outputContent;
  }

  /**
   * Optimise le prompt en réduisant les tokens
   * @param {string} prompt - Prompt à optimiser
   * @returns {string} Prompt optimisé
   */
  optimize(prompt) {
    // Supprimer les lignes vides multiples
    prompt = prompt.replace(/\n{3,}/g, '\n\n');
    
    // Supprimer les espaces en fin de ligne
    prompt = prompt.replace(/ +$/gm, '');
    
    // Compresser les exemples de code si trop longs
    prompt = this.compressCodeExamples(prompt);
    
    return prompt;
  }

  /**
   * Compresse les exemples de code longs
   * @param {string} text - Texte contenant du code
   */
  compressCodeExamples(text) {
    // Regex pour trouver les blocs de code
    const codeBlockRegex = /```[\s\S]*?```/g;
    
    return text.replace(codeBlockRegex, (match) => {
      const lines = match.split('\n');
      
      // Si le bloc fait plus de 20 lignes, le tronquer
      if (lines.length > 20) {
        const truncated = [
          ...lines.slice(0, 10),
          '  // ... [Code tronqué pour économiser des tokens] ...',
          ...lines.slice(-5)
        ];
        return truncated.join('\n');
      }
      
      return match;
    });
  }

  /**
   * Crée un prompt minimal pour les requêtes simples
   * @param {string} userQuery - Requête utilisateur
   * @param {string} widgetType - Type de widget
   */
  buildMinimal(userQuery, widgetType) {
    return this.build({
      userQuery,
      includeDataset: false,
      includeExamples: false,
      minimal: true,
      outputFormat: 'html'
    });
  }

  /**
   * Crée un prompt complet pour les requêtes complexes
   * @param {string} userQuery - Requête utilisateur
   */
  buildComplete(userQuery) {
    return this.build({
      userQuery,
      includeDataset: true,
      includeExamples: true,
      minimal: false,
      outputFormat: 'html'
    });
  }

  /**
   * Sauvegarde un prompt assemblé
   * @param {string} prompt - Prompt à sauvegarder
   * @param {string} filename - Nom du fichier
   */
  async save(prompt, filename) {
    const outputPath = path.join(this.basePath, 'output', filename);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, prompt, 'utf-8');
    console.log(`Prompt sauvegardé: ${outputPath}`);
  }

  /**
   * Estime le nombre de tokens (approximatif)
   * @param {string} text - Texte à analyser
   * @returns {number} Estimation du nombre de tokens
   */
  estimateTokens(text) {
    // Estimation approximative: ~1 token pour 4 caractères
    const charCount = text.length;
    const wordCount = text.split(/\s+/).length;
    
    // Moyenne entre caractères/4 et mots*1.3
    return Math.round((charCount / 4 + wordCount * 1.3) / 2);
  }

  /**
   * Analyse et affiche les statistiques du prompt
   * @param {string} prompt - Prompt à analyser
   */
  analyzePrompt(prompt) {
    const stats = {
      totalLength: prompt.length,
      estimatedTokens: this.estimateTokens(prompt),
      lineCount: prompt.split('\n').length,
      sectionCount: (prompt.match(/^#+ /gm) || []).length,
      codeBlockCount: (prompt.match(/```/g) || []).length / 2,
      variableCount: (prompt.match(/\{\{/g) || []).length
    };

    console.log('\n📊 Statistiques du prompt:');
    console.log(`- Longueur: ${stats.totalLength} caractères`);
    console.log(`- Tokens estimés: ~${stats.estimatedTokens}`);
    console.log(`- Lignes: ${stats.lineCount}`);
    console.log(`- Sections: ${stats.sectionCount}`);
    console.log(`- Blocs de code: ${stats.codeBlockCount}`);
    console.log(`- Variables: ${stats.variableCount}`);

    // Avertissement si trop de tokens
    if (stats.estimatedTokens > 4000) {
      console.warn('⚠️  Attention: Le prompt pourrait être trop long. Considérez l\'option minimal.');
    }

    return stats;
  }
}

// Export pour utilisation
module.exports = PromptAssembler;

// CLI si exécuté directement
if (require.main === module) {
  (async () => {
    const assembler = new PromptAssembler();
    
    // Exemple d'utilisation
    await assembler.loadModules({
      dataset: 'signalconso',
      widgetType: 'table',
      includeExamples: true
    });

    assembler.setVariables({
      DATASET_NAME: 'signalconso',
      WIDGET_TYPE: 'table',
      WIDGET_ID: 'sc-table-001'
    });

    const prompt = assembler.build({
      userQuery: 'Créer une table des signalements récents avec tri et pagination',
      includeDataset: true,
      includeExamples: false,
      outputFormat: 'html'
    });

    const optimized = assembler.optimize(prompt);
    
    // Sauvegarder et analyser
    await assembler.save(optimized, 'example-prompt.md');
    assembler.analyzePrompt(optimized);
  })();
}