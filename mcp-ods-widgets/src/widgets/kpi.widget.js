/**
 * Widget KPI - Indicateurs clés avec style DSFR
 */

export class KpiWidget {
  constructor() {
    this.name = 'kpi';
    this.odsComponent = 'ods-aggregation';
  }

  async generate(params) {
    const { dataset, domain, options = {} } = params;
    
    const config = {
      kpis: options.kpis || this.getDefaultKpis(),
      layout: options.layout || 'grid',
      showTrend: options.showTrend !== false,
      showIcon: options.showIcon !== false
    };

    return `
<!-- KPIs DSFR avec données ODS -->
<div class="fr-container--fluid">
  <div class="fr-grid-row fr-grid-row--gutters">
    ${config.kpis.map(kpi => this.generateKpiCard(kpi, config)).join('\n')}
  </div>
</div>`;
  }

  generateKpiCard(kpi, config) {
    return `
    <div class="fr-col-12 fr-col-md-6 fr-col-lg-3">
      <div class="fr-tile fr-tile--horizontal fr-enlarge-link">
        <div class="fr-tile__body">
          ${config.showIcon ? `
          <div class="fr-tile__img">
            <span class="${kpi.icon || 'fr-icon-bar-chart-box-line'} fr-icon--lg" aria-hidden="true"></span>
          </div>` : ''}
          <div class="fr-tile__content">
            <h3 class="fr-tile__title">
              <ods-aggregation context="ctx" 
                               ${kpi.field ? `expression="${kpi.field}"` : ''}
                               function="${kpi.function || 'COUNT'}">
                <a href="#${kpi.id || kpi.field}">
                  {{ aggregation | number }}
                </a>
              </ods-aggregation>
            </h3>
            <p class="fr-tile__detail">${kpi.label}</p>
            ${config.showTrend && kpi.trend ? `
            <p class="fr-tile__desc">
              <span class="fr-badge fr-badge--${kpi.trend > 0 ? 'success' : 'error'} fr-badge--sm">
                ${kpi.trend > 0 ? '↑' : '↓'} ${Math.abs(kpi.trend)}%
              </span>
              ${kpi.trendLabel || 'vs période précédente'}
            </p>` : ''}
          </div>
        </div>
      </div>
    </div>`;
  }

  getDefaultKpis() {
    return [
      {
        field: '',
        function: 'COUNT',
        label: 'Total enregistrements',
        icon: 'fr-icon-database-2-line'
      },
      {
        field: 'date_creation',
        function: 'COUNT',
        label: 'Nouveaux cette année',
        icon: 'fr-icon-calendar-line'
      },
      {
        field: 'categorie',
        function: 'COUNT',
        label: 'Catégories',
        icon: 'fr-icon-folder-2-line'
      },
      {
        field: 'region',
        function: 'COUNT',
        label: 'Régions',
        icon: 'fr-icon-map-pin-2-line'
      }
    ];
  }
}