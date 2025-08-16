/**
 * Widget Facets - Filtres à facettes ODS avec style DSFR
 */

export class FacetsWidget {
  constructor() {
    this.name = 'facets';
    this.odsComponent = 'ods-facets';
  }

  async generate(params) {
    const { dataset, domain, options = {} } = params;
    
    const config = {
      facets: options.facets || this.getDefaultFacets(dataset),
      layout: options.layout || 'sidemenu', // sidemenu ou inline
      showCount: options.showCount !== false,
      collapsible: options.collapsible !== false,
      searchable: options.searchable !== false,
      maxItems: options.maxItems || 10
    };

    if (config.layout === 'sidemenu') {
      return this.generateSidemenuFacets(config);
    } else {
      return this.generateInlineFacets(config);
    }
  }

  generateSidemenuFacets(config) {
    return `
<!-- Filtres à facettes DSFR (menu latéral) -->
<div class="fr-sidemenu fr-sidemenu--sticky-full-height">
  <div class="fr-sidemenu__inner">
    <button class="fr-sidemenu__btn" aria-controls="facets-menu" aria-expanded="true">
      Filtres
      <span class="fr-badge fr-badge--sm fr-ml-1w" ng-if="activeFilters > 0">
        {{ activeFilters }}
      </span>
    </button>
    <div class="fr-collapse" id="facets-menu">
      <div class="fr-sidemenu__title">Affiner la recherche</div>
      
      <ods-facets context="ctx">
        ${config.facets.map(facet => this.generateFacetSection(facet, config)).join('\n')}
      </ods-facets>
      
      <div class="fr-btns-group fr-btns-group--sm fr-mt-3w">
        <button class="fr-btn fr-btn--secondary fr-btn--sm"
                ng-click="ctx.parameters['refine'] = {}">
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  </div>
</div>`;
  }

  generateInlineFacets(config) {
    return `
<!-- Filtres à facettes DSFR (inline) -->
<div class="fr-container--fluid">
  <div class="fr-grid-row fr-grid-row--gutters">
    <ods-facets context="ctx">
      ${config.facets.map(facet => `
      <div class="fr-col-12 fr-col-md-6 fr-col-lg-3">
        ${this.generateInlineFacet(facet, config)}
      </div>`).join('\n')}
    </ods-facets>
  </div>
  
  <div class="fr-mt-2w">
    <button class="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-btn--icon-left fr-icon-close-line"
            ng-click="ctx.parameters['refine'] = {}"
            ng-if="hasActiveFilters()">
      Effacer tous les filtres
    </button>
  </div>
</div>`;
  }

  generateFacetSection(facet, config) {
    const facetId = facet.field.replace(/[^a-z0-9]/gi, '-');
    
    return `
        <div class="fr-sidemenu__item">
          <button class="fr-sidemenu__btn" 
                  aria-expanded="${facet.expanded !== false}" 
                  aria-controls="facet-${facetId}">
            ${facet.label || this.getFieldLabel(facet.field)}
            ${config.showCount ? `
            <span class="fr-badge fr-badge--sm fr-badge--grey fr-ml-1w">
              {{ facet_counts['${facet.field}'] }}
            </span>` : ''}
          </button>
          <div class="fr-collapse" id="facet-${facetId}">
            ${config.searchable && facet.searchable !== false ? `
            <div class="fr-search-bar fr-search-bar--sm fr-mb-2w">
              <input class="fr-input" 
                     type="search" 
                     placeholder="Filtrer..."
                     ng-model="facetSearch['${facet.field}']">
            </div>` : ''}
            
            <ods-facet name="${facet.field}" 
                       disjunctive="${facet.disjunctive !== false}"
                       ${facet.sort ? `sort="${facet.sort}"` : ''}>
              <div class="fr-fieldset__content">
                <div ng-repeat="item in items | filter:facetSearch['${facet.field}'] | limitTo:${config.maxItems}">
                  <div class="fr-checkbox-group fr-checkbox-group--sm">
                    <input type="checkbox" 
                           id="facet-${facetId}-{{$index}}"
                           ng-model="item.selected"
                           ng-change="toggle(item)">
                    <label class="fr-label" for="facet-${facetId}-{{$index}}">
                      {{ item.name }}
                      ${config.showCount ? `
                      <span class="fr-text--xs fr-text-mention--grey">
                        ({{ item.count }})
                      </span>` : ''}
                    </label>
                  </div>
                </div>
                
                <button class="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-mt-1w"
                        ng-if="items.length > ${config.maxItems}"
                        ng-click="showMore['${facet.field}'] = !showMore['${facet.field}']">
                  {{ showMore['${facet.field}'] ? 'Voir moins' : 'Voir plus' }}
                </button>
              </div>
            </ods-facet>
          </div>
        </div>`;
  }

  generateInlineFacet(facet, config) {
    return `
      <div class="fr-select-group">
        <label class="fr-label" for="facet-select-${facet.field}">
          ${facet.label || this.getFieldLabel(facet.field)}
        </label>
        <ods-facet name="${facet.field}" disjunctive="true">
          <select class="fr-select" 
                  id="facet-select-${facet.field}"
                  ng-model="selectedFacet['${facet.field}']"
                  ng-change="applyFacet('${facet.field}', selectedFacet['${facet.field}'])">
            <option value="">Tous</option>
            <option ng-repeat="item in items" value="{{item.name}}">
              {{ item.name }}${config.showCount ? ' (' + item.count + ')' : ''}
            </option>
          </select>
        </ods-facet>
      </div>`;
  }

  getDefaultFacets(dataset) {
    // Facettes par défaut selon le type de dataset
    const defaultFacets = {
      'signalconso': [
        { field: 'categorie', label: 'Catégorie' },
        { field: 'sous_categorie', label: 'Sous-catégorie' },
        { field: 'dep', label: 'Département' },
        { field: 'region', label: 'Région' },
        { field: 'statut_promesse', label: 'Statut' }
      ],
      'default': [
        { field: 'categorie', label: 'Catégorie' },
        { field: 'annee', label: 'Année' },
        { field: 'region', label: 'Région' },
        { field: 'type', label: 'Type' }
      ]
    };
    
    return defaultFacets[dataset] || defaultFacets['default'];
  }

  getFieldLabel(field) {
    const labels = {
      'categorie': 'Catégorie',
      'sous_categorie': 'Sous-catégorie',
      'dep': 'Département',
      'region': 'Région',
      'statut_promesse': 'Statut',
      'annee': 'Année',
      'type': 'Type',
      'ville': 'Ville',
      'date': 'Date'
    };
    
    return labels[field] || field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}