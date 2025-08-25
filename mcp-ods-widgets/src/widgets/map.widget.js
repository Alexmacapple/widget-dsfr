/**
 * Widget Map - Carte géographique ODS avec style DSFR
 */

export class MapWidget {
  constructor() {
    this.name = 'map';
    this.odsComponent = 'ods-map';
    this.dsfrMapColors = {
      primary: '#0063cb',
      secondary: '#e1000f',
      success: '#18753c',
      warning: '#b34000',
      info: '#0063cb',
      grey: '#666666'
    };
  }

  async generate(params) {
    const { dataset, domain, options = {} } = params;
    
    const config = {
      height: options.height || 500,
      location: options.location || '12,46.5,2.5', // Zoom France par défaut
      basemap: options.basemap || 'jawg.light',
      color: options.color || this.dsfrMapColors.primary,
      clustering: options.clustering !== false,
      showLegend: options.showLegend !== false,
      showControls: options.showControls !== false,
      geoField: options.geoField || '',
      popupFields: options.popupFields || []
    };

    return `
<!-- Carte DSFR avec données ODS -->
<div class="fr-container--fluid">
  <div class="fr-card">
    <div class="fr-card__body">
      <div class="fr-card__content">
        <h3 class="fr-card__title">
          <span class="fr-icon-map-pin-2-line" aria-hidden="true"></span>
          ${params.title || 'Carte géographique'}
        </h3>
        ${config.showLegend ? this.generateLegend(config) : ''}
      </div>
      <div class="fr-card__desc" style="padding: 0;">
        <div style="height: ${config.height}px; position: relative;">
          <ods-map context="ctx" 
                   location="${config.location}" 
                   basemap="${config.basemap}"
                   toolbar-geolocation="true"
                   toolbar-fullscreen="true"
                   ${config.showControls ? 'search-box="true" toolbar-drawing="true"' : ''}>
            
            ${this.generateMapLayers(config)}
            
            ${config.showControls ? this.generateMapControls() : ''}
          </ods-map>
        </div>
      </div>
      <div class="fr-card__footer">
        <p class="fr-text--xs fr-text-mention--grey">
          Données : ${dataset} | 
          <button class="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-btn--icon-left fr-icon-refresh-line"
                  ng-click="ctx.parameters['refine'] = {}">
            Réinitialiser la vue
          </button>
        </p>
      </div>
    </div>
  </div>
</div>`;
  }

  generateMapLayers(config) {
    const layers = [];
    
    // Couche principale des points
    layers.push(`
      <ods-map-layer context="ctx"
                     color="${config.color}"
                     picto="ods-circle"
                     show-marker="true"
                     display="${config.clustering ? 'clustered' : 'auto'}"
                     ${config.geoField ? `location="${config.geoField}"` : ''}
                     function="COUNT"
                     shape-opacity="0.7"
                     point-opacity="0.8"
                     border-color="#ffffff"
                     border-opacity="1"
                     border-size="2"
                     caption="true"
                     caption-picto-color="${config.color}">
        ${this.generatePopupTemplate(config)}
      </ods-map-layer>`);

    // Couche de chaleur optionnelle
    if (config.heatmap) {
      layers.push(`
        <ods-map-layer-heatmap context="ctx"
                               radius="20"
                               intensity="0.8">
        </ods-map-layer-heatmap>`);
    }

    return layers.join('\n');
  }

  generatePopupTemplate(config) {
    if (!config.popupFields || config.popupFields.length === 0) {
      return '';
    }

    return `
        <div class="ods-map-popup">
          <h4>{{ record.fields.nom_etablissement || record.fields.name || 'Information' }}</h4>
          ${config.popupFields.map(field => `
          <p><strong>${this.getFieldLabel(field)}:</strong> {{ record.fields.${field} }}</p>`).join('')}
          <a href="#detail-{{ record.recordid }}" class="fr-btn fr-btn--sm">
            Voir le détail
          </a>
        </div>`;
  }

  generateMapControls() {
    return `
      <!-- Contrôles de carte personnalisés -->
      <div class="map-controls" style="position: absolute; top: 10px; right: 10px; z-index: 1000;">
        <div class="fr-btns-group fr-btns-group--sm">
          <button class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-add-line"
                  ng-click="zoomIn()">
            Zoom +
          </button>
          <button class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-subtract-line"
                  ng-click="zoomOut()">
            Zoom -
          </button>
        </div>
      </div>`;
  }

  generateLegend(config) {
    return `
      <div class="fr-accordions-group fr-mb-2w">
        <section class="fr-accordion">
          <h3 class="fr-accordion__title">
            <button class="fr-accordion__btn" aria-expanded="false" aria-controls="legend-content">
              Légende
            </button>
          </h3>
          <div class="fr-collapse" id="legend-content">
            <ul class="fr-tags-group">
              <li>
                <span class="fr-tag fr-tag--sm" style="background-color: ${config.color}; color: white;">
                  Points de données
                </span>
              </li>
              ${config.clustering ? `
              <li>
                <span class="fr-tag fr-tag--sm">
                  <span class="fr-icon-group-line fr-icon--sm"></span>
                  Regroupement automatique
                </span>
              </li>` : ''}
            </ul>
          </div>
        </section>
      </div>`;
  }

  getFieldLabel(field) {
    const labels = {
      'adresse': 'Adresse',
      'ville': 'Ville',
      'code_postal': 'Code postal',
      'categorie': 'Catégorie',
      'telephone': 'Téléphone',
      'email': 'Email',
      'site_web': 'Site web'
    };
    
    return labels[field] || field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}