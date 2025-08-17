/**
 * Service de validation et d'enrichissement DSFR pour les widgets ODS
 * Intègre les mappings ODS → DSFR et valide la conformité
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DSFRValidator {
  constructor() {
    try {
      // Charger les mappings
      this.mappings = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../../mcp-dsfr/mappings/ods-to-dsfr.json'), 'utf8')
      );
      
      this.components = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../../mcp-dsfr/mappings/dsfr-components.json'), 'utf8')
      );
      
      this.rules = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../../mcp-dsfr/mappings/validation-rules.json'), 'utf8')
      );
      
      console.log('[DSFRValidator] Service initialisé avec succès');
    } catch (error) {
      console.error('[DSFRValidator] Erreur lors du chargement des mappings:', error.message);
      // Fallback vers des mappings basiques
      this.mappings = { widgets: {} };
      this.components = {};
      this.rules = { rules: {} };
    }
  }

  /**
   * Enrichit le HTML ODS avec les classes DSFR appropriées
   */
  enrichWithDSFR(widgetType, html) {
    const mapping = this.mappings.widgets[widgetType];
    if (!mapping) {
      console.warn(`[DSFRValidator] Pas de mapping pour le widget: ${widgetType}`);
      return html;
    }

    let enrichedHTML = html;

    // Ajouter le wrapper DSFR si nécessaire
    if (mapping.wrapper) {
      enrichedHTML = `<div class="${mapping.wrapper}">${enrichedHTML}</div>`;
    }

    // Ajouter le container principal avec les classes
    if (mapping.container) {
      const classes = [mapping.container, ...(mapping.classes || [])].join(' ');
      enrichedHTML = `<div class="${classes}">${enrichedHTML}</div>`;
    }

    // Pour les tables, ajouter la structure responsive
    if (widgetType === 'ods-table' && mapping.responsive) {
      enrichedHTML = `
        <div class="fr-table fr-table--bordered">
          <div class="fr-table__wrapper">
            <div class="fr-table__container">
              ${enrichedHTML}
            </div>
          </div>
        </div>
      `;
    }

    return enrichedHTML;
  }

  /**
   * Génère la structure HTML complète avec DSFR
   */
  generateDSFRStructure(widgetType, options = {}) {
    const mapping = this.mappings.widgets[widgetType];
    if (!mapping) return '';

    const { title, description, content } = options;
    let structure = '';

    switch (widgetType) {
      case 'ods-chart':
      case 'ods-map':
        structure = `
          <div class="fr-card">
            <div class="fr-card__body">
              ${title ? `<h3 class="fr-card__title">${title}</h3>` : ''}
              ${description ? `<p class="fr-card__desc">${description}</p>` : ''}
              <div class="fr-card__content">
                ${content || '<!-- Widget content here -->'}
              </div>
            </div>
          </div>
        `;
        break;

      case 'ods-aggregation':
        structure = `
          <div class="fr-tile fr-tile--vertical">
            <div class="fr-tile__body">
              <h4 class="fr-tile__title">${options.value || '0'}</h4>
              <p class="fr-tile__subtitle">${options.label || 'Indicateur'}</p>
            </div>
          </div>
        `;
        break;

      case 'ods-table':
        structure = `
          <div class="fr-table fr-table--bordered">
            <div class="fr-table__wrapper">
              <div class="fr-table__container">
                ${content || '<!-- Table content here -->'}
              </div>
            </div>
          </div>
        `;
        break;

      default:
        structure = content || '';
    }

    return structure;
  }

  /**
   * Valide la conformité DSFR du HTML
   */
  async validate(html) {
    const errors = [];
    const warnings = [];
    const info = [];

    // Vérifications de base
    if (this.rules.rules.html_structure) {
      const { require_lang_attribute, no_inline_styles } = this.rules.rules.html_structure;
      
      if (require_lang_attribute && !html.includes('lang=')) {
        errors.push('Attribut lang manquant');
      }
    }

    if (this.rules.rules.dsfr_compliance) {
      const { no_inline_styles, require_fr_prefix } = this.rules.rules.dsfr_compliance;
      
      if (no_inline_styles && html.includes('style=')) {
        warnings.push('Styles inline détectés');
      }
      
      if (require_fr_prefix && !html.includes('fr-')) {
        warnings.push('Classes DSFR (fr-*) non utilisées');
      }
    }

    // Calcul du score
    const score = Math.max(0, 100 - (errors.length * 10) - (warnings.length * 3));

    return {
      isValid: errors.length === 0,
      score,
      errors,
      warnings,
      info,
      summary: `Score DSFR: ${score}/100 - ${errors.length} erreurs, ${warnings.length} avertissements`
    };
  }

  /**
   * Applique les corrections automatiques
   */
  autoFix(html) {
    let fixed = html;

    if (this.rules.auto_fix) {
      // Supprimer les styles inline
      if (this.rules.auto_fix.remove_inline_styles) {
        fixed = fixed.replace(/style="[^"]*"/g, '');
      }

      // Ajouter l'attribut lang si manquant
      if (this.rules.auto_fix.add_lang_attribute && !fixed.includes('lang=')) {
        fixed = fixed.replace('<html', '<html lang="fr"');
      }

      // Wrapper dans un container si nécessaire
      if (this.rules.auto_fix.wrap_in_container && !fixed.includes('fr-container')) {
        fixed = `<div class="fr-container">${fixed}</div>`;
      }
    }

    return fixed;
  }

  /**
   * Obtient les classes DSFR recommandées pour un type de widget
   */
  getRecommendedClasses(widgetType) {
    const mapping = this.mappings.widgets[widgetType];
    if (!mapping) return [];

    return {
      container: mapping.container,
      classes: mapping.classes || [],
      utilities: this.mappings.utilities
    };
  }
}

export default DSFRValidator;