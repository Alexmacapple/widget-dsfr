/**
 * Adaptateur de thème DSFR
 * Applique les styles et classes DSFR aux widgets ODS
 */

export class DSFRThemeAdapter {
  constructor() {
    this.cssVariables = {
      // Couleurs principales
      '--primary': '#0063cb',
      '--secondary': '#e1000f',
      '--success': '#18753c',
      '--warning': '#b34000',
      '--error': '#ce0500',
      '--info': '#0063cb',
      
      // Backgrounds
      '--background-default-grey': '#f6f6f6',
      '--background-alt-grey': '#f0f0f0',
      '--background-elevated-grey': '#ffffff',
      
      // Textes
      '--text-default-grey': '#161616',
      '--text-mention-grey': '#666666',
      '--text-disabled-grey': '#929292',
      
      // Bordures
      '--border-default-grey': '#dddddd',
      '--border-action-high-blue-france': '#0063cb'
    };

    this.widgetStyles = {
      table: this.getTableStyles(),
      chart: this.getChartStyles(),
      map: this.getMapStyles(),
      facets: this.getFacetsStyles(),
      kpi: this.getKpiStyles()
    };
  }

  apply(htmlCode, widgetType) {
    // Ajouter les styles DSFR spécifiques au widget
    const styles = this.widgetStyles[widgetType] || '';
    
    // Injecter les styles dans le HTML
    const styleTag = `
<style>
  /* Styles DSFR pour widget ${widgetType} */
  ${this.getBaseStyles()}
  ${styles}
</style>`;

    // Ajouter les classes DSFR aux éléments ODS
    let modifiedHtml = this.addDSFRClasses(htmlCode, widgetType);
    
    // Injecter les styles avant le contenu
    modifiedHtml = styleTag + modifiedHtml;
    
    return modifiedHtml;
  }

  getBaseStyles() {
    return `
    /* Variables CSS DSFR */
    :root {
      ${Object.entries(this.cssVariables).map(([key, value]) => `${key}: ${value};`).join('\n      ')}
    }
    
    /* Styles de base pour les widgets ODS */
    .ods-widget {
      font-family: Marianne, arial, sans-serif;
      color: var(--text-default-grey);
      line-height: 1.5;
    }
    
    /* Support du mode sombre */
    [data-fr-theme="dark"] {
      --background-default-grey: #1e1e1e;
      --background-alt-grey: #2a2a2a;
      --background-elevated-grey: #3a3a3a;
      --text-default-grey: #cecece;
      --text-mention-grey: #acacac;
      --border-default-grey: #3a3a3a;
    }
    
    /* Animations DSFR */
    .fr-enlarge-link:hover {
      transform: translateY(-2px);
      transition: transform 0.3s ease;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .fr-grid-row--gutters {
        margin: -0.5rem;
      }
      
      .fr-grid-row--gutters > [class^="fr-col"] {
        padding: 0.5rem;
      }
    }`;
  }

  getTableStyles() {
    return `
    /* Styles DSFR pour tables ODS */
    .ods-table {
      width: 100%;
      border-collapse: collapse;
      background: var(--background-elevated-grey);
    }
    
    .ods-table th {
      background: var(--background-alt-grey);
      color: var(--text-default-grey);
      font-weight: 700;
      padding: 0.75rem;
      text-align: left;
      border-bottom: 2px solid var(--border-action-high-blue-france);
    }
    
    .ods-table td {
      padding: 0.75rem;
      border-bottom: 1px solid var(--border-default-grey);
    }
    
    .ods-table tbody tr:hover {
      background: var(--background-default-grey);
    }
    
    .ods-table-container {
      overflow-x: auto;
      border: 1px solid var(--border-default-grey);
      border-radius: 0.25rem;
    }`;
  }

  getChartStyles() {
    return `
    /* Styles DSFR pour graphiques ODS */
    .ods-chart {
      background: var(--background-elevated-grey);
      border-radius: 0.25rem;
      padding: 1rem;
    }
    
    .ods-chart-container {
      position: relative;
      width: 100%;
      height: 100%;
    }
    
    /* Personnalisation des couleurs du graphique */
    .ods-chart .highcharts-series-0 .highcharts-point {
      fill: var(--primary);
    }
    
    .ods-chart .highcharts-series-1 .highcharts-point {
      fill: var(--secondary);
    }
    
    .ods-chart .highcharts-axis-labels text {
      fill: var(--text-mention-grey);
    }
    
    .ods-chart .highcharts-title {
      fill: var(--text-default-grey);
      font-weight: 700;
    }`;
  }

  getMapStyles() {
    return `
    /* Styles DSFR pour cartes ODS */
    .ods-map {
      border: 1px solid var(--border-default-grey);
      border-radius: 0.25rem;
      overflow: hidden;
    }
    
    .ods-map-popup {
      background: var(--background-elevated-grey);
      border: 1px solid var(--border-default-grey);
      border-radius: 0.25rem;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .ods-map-popup h4 {
      color: var(--text-default-grey);
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      font-weight: 700;
    }
    
    .ods-map-popup p {
      margin: 0.25rem 0;
      color: var(--text-mention-grey);
      font-size: 0.875rem;
    }
    
    /* Contrôles de carte */
    .ods-map-controls {
      background: var(--background-elevated-grey);
      border: 1px solid var(--border-default-grey);
      border-radius: 0.25rem;
      padding: 0.5rem;
    }`;
  }

  getFacetsStyles() {
    return `
    /* Styles DSFR pour facettes ODS */
    .ods-facets {
      background: var(--background-elevated-grey);
      border: 1px solid var(--border-default-grey);
      border-radius: 0.25rem;
      padding: 1rem;
    }
    
    .ods-facet-category {
      margin-bottom: 1.5rem;
    }
    
    .ods-facet-title {
      color: var(--text-default-grey);
      font-weight: 700;
      margin-bottom: 0.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border-default-grey);
    }
    
    .ods-facet-item {
      padding: 0.25rem 0;
      transition: background 0.2s ease;
    }
    
    .ods-facet-item:hover {
      background: var(--background-default-grey);
      padding-left: 0.5rem;
    }
    
    .ods-facet-checkbox {
      margin-right: 0.5rem;
    }
    
    .ods-facet-count {
      color: var(--text-mention-grey);
      font-size: 0.875rem;
      margin-left: 0.5rem;
    }`;
  }

  getKpiStyles() {
    return `
    /* Styles DSFR pour KPIs ODS */
    .ods-kpi {
      background: linear-gradient(135deg, var(--background-alt-grey), var(--background-elevated-grey));
      border: 1px solid var(--border-default-grey);
      border-radius: 0.5rem;
      padding: 1.5rem;
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .ods-kpi:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .ods-kpi-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--primary);
      line-height: 1;
      margin-bottom: 0.5rem;
    }
    
    .ods-kpi-label {
      color: var(--text-mention-grey);
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .ods-kpi-trend {
      margin-top: 0.5rem;
      font-size: 0.875rem;
    }
    
    .ods-kpi-trend.positive {
      color: var(--success);
    }
    
    .ods-kpi-trend.negative {
      color: var(--error);
    }`;
  }

  addDSFRClasses(html, widgetType) {
    // Mapper les éléments ODS vers les classes DSFR
    const classMapping = {
      'ods-table': 'fr-table',
      'ods-facets': 'fr-sidemenu',
      'ods-map': 'fr-responsive-media',
      'ods-chart': 'fr-chart',
      'ods-aggregation': 'fr-tile'
    };

    let modifiedHtml = html;
    
    // Ajouter les classes DSFR aux éléments correspondants
    Object.entries(classMapping).forEach(([odsClass, dsfrClass]) => {
      const regex = new RegExp(`class="${odsClass}"`, 'g');
      modifiedHtml = modifiedHtml.replace(regex, `class="${odsClass} ${dsfrClass}"`);
      
      // Ajouter aussi pour les éléments sans classe
      const tagRegex = new RegExp(`<${odsClass}(?![^>]*class)`, 'g');
      modifiedHtml = modifiedHtml.replace(tagRegex, `<${odsClass} class="${dsfrClass}"`);
    });

    return modifiedHtml;
  }
}