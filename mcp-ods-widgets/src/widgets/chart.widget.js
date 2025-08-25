/**
 * Widget Chart - Graphiques ODS avec style DSFR
 */

export class ChartWidget {
  constructor() {
    this.name = 'chart';
    this.odsComponent = 'ods-chart';
    this.dsfrColors = [
      '#0063cb', // Bleu France
      '#e1000f', // Rouge Marianne
      '#161616', // Noir
      '#666666', // Gris moyen
      '#3a3a3a', // Gris foncé
      '#f5f5fe', // Bleu clair
      '#ffe9e6', // Rouge clair
      '#d4f4dd'  // Vert clair
    ];
  }

  async generate(params) {
    const { dataset, domain, options = {} } = params;
    
    const config = {
      type: options.chartType || 'column',
      xAxis: options.xAxis || '',
      yAxis: options.yAxis || '',
      function: options.function || 'COUNT',
      maxPoints: options.maxPoints || 20,
      title: options.title || `Graphique ${dataset}`,
      height: options.height || 400,
      colors: options.colors || this.dsfrColors
    };

    return `
<!-- Graphique DSFR avec données ODS -->
<div class="fr-container--fluid">
  <div class="fr-card">
    <div class="fr-card__body">
      <div class="fr-card__content">
        <h3 class="fr-card__title">${config.title}</h3>
        <div class="fr-card__desc">
          <div style="height: ${config.height}px;">
            <ods-chart align-month="true" single-y-axis="true" single-y-axis-label="${config.yAxis}">
              <ods-chart-query context="ctx" 
                               field-x="${config.xAxis}"
                               maxpoints="${config.maxPoints}"
                               sort="x">
                ${this.generateChartSeries(config)}
              </ods-chart-query>
            </ods-chart>
          </div>
        </div>
      </div>
      <div class="fr-card__footer">
        <ul class="fr-btns-group fr-btns-group--inline-sm">
          <li>
            <button class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-fullscreen-fill"
                    onclick="this.closest('.fr-card').requestFullscreen()">
              Plein écran
            </button>
          </li>
          <li>
            <button class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-download-line"
                    ng-click="exportChart('${dataset}')">
              Exporter
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>`;
  }

  generateChartSeries(config) {
    const series = [];
    
    if (config.series && Array.isArray(config.series)) {
      config.series.forEach((serie, index) => {
        series.push(`
          <ods-chart-serie 
            expression-y="${serie.field}"
            chart-type="${serie.type || config.type}"
            function-y="${serie.function || config.function}"
            label-y="${serie.label || serie.field}"
            color="${config.colors[index % config.colors.length]}"
            scientific-display="false">
          </ods-chart-serie>`);
      });
    } else {
      // Série unique par défaut
      series.push(`
        <ods-chart-serie 
          ${config.yAxis ? `expression-y="${config.yAxis}"` : ''}
          chart-type="${config.type}"
          function-y="${config.function}"
          label-y="${config.yAxis || 'Valeur'}"
          color="${config.colors[0]}"
          scientific-display="false">
        </ods-chart-serie>`);
    }
    
    return series.join('\n');
  }

  getChartTypeIcon(type) {
    const icons = {
      'column': 'fr-icon-bar-chart-box-line',
      'line': 'fr-icon-line-chart-line',
      'pie': 'fr-icon-pie-chart-2-line',
      'spline': 'fr-icon-pulse-line',
      'area': 'fr-icon-bar-chart-2-line'
    };
    
    return icons[type] || 'fr-icon-bar-chart-box-line';
  }
}