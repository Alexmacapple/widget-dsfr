/**
 * Widget Table - Transformation ODS Table vers DSFR Table
 */

export class TableWidget {
  constructor() {
    this.name = 'table';
    this.odsComponent = 'ods-table';
    this.dsfrClass = 'fr-table';
  }

  async generate(params) {
    const { dataset, domain, options = {} } = params;
    
    // Configuration par défaut
    const config = {
      pagination: options.pagination !== false,
      search: options.search !== false,
      export: options.export !== false,
      pageSize: options.pageSize || 20,
      displayedFields: options.fields || [],
      sort: options.sort || ''
    };

    return `
<!-- Tableau DSFR avec données ODS -->
<div class="fr-container--fluid">
  ${config.search ? this.generateSearch() : ''}
  
  <div class="fr-table" id="table-${dataset}">
    <div class="fr-table__wrapper">
      <div class="fr-table__container">
        <div class="fr-table__content">
          <table>
            <caption>${params.title || `Données ${dataset}`}</caption>
            <thead>
              <tr>
                ${this.generateHeaders(config.displayedFields)}
              </tr>
            </thead>
            <tbody>
              <ods-table context="ctx"
                         ${config.displayedFields.length ? `displayed-fields="${config.displayedFields.join(',')}"` : ''}
                         ${config.sort ? `sort="${config.sort}"` : ''}>
                <tr ng-repeat="record in records">
                  ${this.generateCells(config.displayedFields)}
                </tr>
              </ods-table>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  
  ${config.pagination ? this.generatePagination(config.pageSize) : ''}
  ${config.export ? this.generateExportButtons(dataset) : ''}
</div>`;
  }

  generateSearch() {
    return `
<div class="fr-search-bar fr-mb-3w" role="search">
  <label class="fr-label" for="table-search">
    Rechercher dans le tableau
  </label>
  <input class="fr-input" 
         type="search" 
         id="table-search"
         ng-model="ctx.parameters['q']"
         placeholder="Rechercher...">
  <button class="fr-btn" title="Rechercher">
    Rechercher
  </button>
</div>`;
  }

  generateHeaders(fields) {
    if (fields.length === 0) {
      return '<th ng-repeat="field in fields">{{ field.label || field.name }}</th>';
    }
    
    return fields.map(field => {
      const label = this.getFieldLabel(field);
      return `<th scope="col">${label}</th>`;
    }).join('\n');
  }

  generateCells(fields) {
    if (fields.length === 0) {
      return '<td ng-repeat="field in fields">{{ record.fields[field.name] }}</td>';
    }
    
    return fields.map(field => {
      return `<td>{{ record.fields['${field}'] }}</td>`;
    }).join('\n');
  }

  generatePagination(pageSize) {
    return `
<nav role="navigation" class="fr-pagination fr-mt-3w" aria-label="Pagination">
  <ods-pager context="ctx" page-size="${pageSize}">
    <ul class="fr-pagination__list">
      <li>
        <button class="fr-pagination__link fr-pagination__link--first"
                ng-click="ctx.parameters['start'] = 0"
                ng-disabled="!ctx.parameters['start'] || ctx.parameters['start'] == 0">
          Première page
        </button>
      </li>
      <li>
        <button class="fr-pagination__link fr-pagination__link--prev"
                ng-click="ctx.parameters['start'] = ctx.parameters['start'] - ${pageSize}"
                ng-disabled="!ctx.parameters['start'] || ctx.parameters['start'] == 0">
          Page précédente
        </button>
      </li>
      <li ng-repeat="page in pages">
        <button class="fr-pagination__link"
                ng-class="{'fr-pagination__link--current': page.current}"
                ng-click="ctx.parameters['start'] = page.start">
          {{ page.number }}
        </button>
      </li>
      <li>
        <button class="fr-pagination__link fr-pagination__link--next"
                ng-click="ctx.parameters['start'] = ctx.parameters['start'] + ${pageSize}">
          Page suivante
        </button>
      </li>
      <li>
        <button class="fr-pagination__link fr-pagination__link--last"
                ng-click="ctx.parameters['start'] = lastPageStart">
          Dernière page
        </button>
      </li>
    </ul>
  </ods-pager>
</nav>`;
  }

  generateExportButtons(dataset) {
    return `
<div class="fr-btns-group fr-mt-3w">
  <ods-export-file context="ctx" format="csv">
    <button class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-download-line">
      Exporter en CSV
    </button>
  </ods-export-file>
  <ods-export-file context="ctx" format="xlsx">
    <button class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-download-line">
      Exporter en Excel
    </button>
  </ods-export-file>
  <ods-export-file context="ctx" format="json">
    <button class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-download-line">
      Exporter en JSON
    </button>
  </ods-export-file>
</div>`;
  }

  getFieldLabel(field) {
    const labels = {
      'nom_etablissement': 'Établissement',
      'categorie': 'Catégorie',
      'sous_categorie': 'Sous-catégorie',
      'date_creation': 'Date',
      'ville': 'Ville',
      'dep': 'Département',
      'region': 'Région',
      'statut': 'Statut'
    };
    
    return labels[field] || field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}