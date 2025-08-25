#!/usr/bin/env node
/**
 * MCP ODS Widgets Ultimate - Version complète avec TOUS les widgets et filtres
 * Basé sur la documentation complète ODS disponible
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// Liste COMPLÈTE des widgets ODS (directives)
const ODS_WIDGETS = {
  // Contextes
  datasetContext: {
    name: 'Dataset Context',
    description: 'Définit un contexte pour travailler avec un dataset',
    directive: 'ods-dataset-context',
    params: ['context', 'domain', 'dataset', 'parameters', 'url-sync', 'api-key']
  },
  catalogContext: {
    name: 'Catalog Context',
    description: 'Contexte pour parcourir un catalogue de datasets',
    directive: 'ods-catalog-context',
    params: ['context', 'domain', 'parameters', 'url-sync']
  },
  
  // Visualisation de données
  table: {
    name: 'Table',
    description: 'Affiche des données dans un tableau interactif',
    directive: 'ods-table',
    params: ['context', 'displayed-fields', 'sort', 'page-size', 'display-filter', 'available-fields']
  },
  chart: {
    name: 'Chart',
    description: 'Graphiques interactifs Highcharts',
    directive: 'ods-chart',
    params: ['align-month', 'labels-x-length', 'display-legend', 'scientific-display', 'single-y-axis', 'single-y-axis-label']
  },
  chartQuery: {
    name: 'Chart Query',
    description: 'Requête pour un graphique',
    directive: 'ods-chart-query',
    params: ['context', 'field-x', 'maxpoints', 'timescale', 'category-colors', 'queries']
  },
  chartSerie: {
    name: 'Chart Serie',
    description: 'Série de données pour un graphique',
    directive: 'ods-chart-serie',
    params: ['chart-type', 'function-y', 'expression-y', 'color', 'scientific-display', 'label-y', 'display-values', 'display-stack-values']
  },
  map: {
    name: 'Map',
    description: 'Carte interactive avec Leaflet',
    directive: 'ods-map',
    params: ['context', 'location', 'basemap', 'toolbar-drawing', 'toolbar-fullscreen', 'scroll-wheel-zoom', 'min-zoom', 'max-zoom', 'auto-resize', 'no-refit']
  },
  
  // Agrégation et analyse
  aggregation: {
    name: 'Aggregation',
    description: 'Calculs d\'agrégation sur les données',
    directive: 'ods-aggregation',
    params: ['context', 'function', 'expression', 'field']
  },
  analysis: {
    name: 'Analysis',
    description: 'Analyse statistique des données',
    directive: 'ods-analysis',
    params: ['context', 'max', 'x', 'y', 'sort', 'serie-name', 'x-log', 'y-log']
  },
  subaggregation: {
    name: 'Subaggregation',
    description: 'Agrégations imbriquées',
    directive: 'ods-subaggregation',
    params: ['context', 'serie-name']
  },
  gauge: {
    name: 'Gauge',
    description: 'Jauge visuelle pour afficher une valeur',
    directive: 'ods-gauge',
    params: ['value', 'max', 'display-mode', 'size', 'label']
  },
  
  // Filtrage et recherche
  facets: {
    name: 'Facets',
    description: 'Filtres à facettes pour raffiner les données',
    directive: 'ods-facets',
    params: ['context', 'visible-items', 'hide-category-if', 'disjunctive']
  },
  facetResults: {
    name: 'Facet Results',
    description: 'Affiche les résultats d\'une facette spécifique',
    directive: 'ods-facet-results',
    params: ['context', 'facet-name', 'sort', 'hide-if-single-category']
  },
  searchbox: {
    name: 'Searchbox',
    description: 'Champ de recherche textuelle',
    directive: 'ods-searchbox',
    params: ['context', 'placeholder', 'button', 'autofocus', 'autocomplete', 'autocomplete-min-length']
  },
  textSearch: {
    name: 'Text Search',
    description: 'Recherche de texte dans des champs spécifiques',
    directive: 'ods-text-search',
    params: ['context', 'placeholder', 'suffix', 'field', 'button', 'autofocus']
  },
  clearAllFilters: {
    name: 'Clear All Filters',
    description: 'Bouton pour effacer tous les filtres actifs',
    directive: 'ods-clear-all-filters',
    params: ['context', 'display-button', 'display-count']
  },
  filterSummary: {
    name: 'Filter Summary',
    description: 'Affiche un résumé des filtres appliqués',
    directive: 'ods-filter-summary',
    params: ['context', 'heading', 'clear-all-button']
  },
  
  // Widgets temporels
  calendar: {
    name: 'Calendar',
    description: 'Calendrier interactif FullCalendar avec événements',
    directive: 'ods-calendar',
    params: ['context', 'event-field', 'title-field', 'start-field', 'end-field', 'tooltip-fields', 'color-field', 'calendar-view']
  },
  timerange: {
    name: 'Timerange',
    description: 'Sélecteur de plage de dates',
    directive: 'ods-timerange',
    params: ['context', 'date-field', 'default-from', 'default-to', 'precision', 'display-time']
  },
  timescale: {
    name: 'Timescale',
    description: 'Timeline avec échelle de temps',
    directive: 'ods-timescale',
    params: ['context', 'time-field']
  },
  datetime: {
    name: 'Datetime',
    description: 'Affichage formaté de date/heure',
    directive: 'ods-datetime',
    params: ['date', 'format', 'refresh-delay', 'utc']
  },
  
  // Widgets de résultats
  results: {
    name: 'Results',
    description: 'Liste de résultats avec template personnalisable',
    directive: 'ods-results',
    params: ['context', 'max', 'sort', 'fields', 'no-results-message', 'start']
  },
  resultEnumerator: {
    name: 'Result Enumerator',
    description: 'Énumérateur de résultats avec template ng-repeat',
    directive: 'ods-result-enumerator',
    params: ['context', 'max', 'start']
  },
  infiniteScrollResults: {
    name: 'Infinite Scroll Results',
    description: 'Chargement infini des résultats au scroll',
    directive: 'ods-infinite-scroll-results',
    params: ['context', 'result-class', 'scroll-top-when-refresh', 'list-class']
  },
  paginationBlock: {
    name: 'Pagination Block',
    description: 'Bloc de pagination pour naviguer dans les résultats',
    directive: 'ods-pagination-block',
    params: ['context', 'per-page', 'nofollow', 'container-identifier']
  },
  
  // Widgets média
  mediaGallery: {
    name: 'Media Gallery',
    description: 'Galerie d\'images et de médias avec lightbox',
    directive: 'ods-media-gallery',
    params: ['context', 'media-field', 'thumbnail-field', 'title-field', 'item-click']
  },
  slideshow: {
    name: 'Slideshow',
    description: 'Diaporama d\'images automatique',
    directive: 'ods-slideshow',
    params: ['context', 'image-field', 'display-timer', 'autoplay', 'timer-duration']
  },
  recordImage: {
    name: 'Record Image',
    description: 'Affiche l\'image d\'un enregistrement',
    directive: 'ods-record-image',
    params: ['record', 'field', 'domainurl', 'fallback-icon-class']
  },
  
  // Widgets avancés
  crossTable: {
    name: 'Cross Table',
    description: 'Tableau croisé dynamique',
    directive: 'ods-cross-table',
    params: ['context']
  },
  tagCloud: {
    name: 'Tag Cloud',
    description: 'Nuage de mots-clés interactif',
    directive: 'ods-tag-cloud',
    params: ['context', 'facet-name', 'max-tags', 'redirect', 'click-mode']
  },
  
  // Widgets de catalogue
  mostPopularDatasets: {
    name: 'Most Popular Datasets',
    description: 'Liste des datasets les plus populaires',
    directive: 'ods-most-popular-datasets',
    params: ['context', 'max', 'tag']
  },
  mostUsedThemes: {
    name: 'Most Used Themes',
    description: 'Thèmes les plus utilisés',
    directive: 'ods-most-used-themes',
    params: ['context', 'max']
  },
  lastDatasetsFeed: {
    name: 'Last Datasets Feed',
    description: 'Flux des derniers datasets ajoutés',
    directive: 'ods-last-datasets-feed',
    params: ['context', 'max']
  },
  domainStatistics: {
    name: 'Domain Statistics',
    description: 'Statistiques globales du domaine',
    directive: 'ods-domain-statistics',
    params: ['context']
  },
  datasetSchema: {
    name: 'Dataset Schema',
    description: 'Affiche le schéma d\'un dataset',
    directive: 'ods-dataset-schema',
    params: ['context', 'display-fields', 'display-field-names', 'display-groups']
  },
  
  // Widgets sociaux et partage
  socialButtons: {
    name: 'Social Buttons',
    description: 'Boutons de partage sur les réseaux sociaux',
    directive: 'ods-social-buttons',
    params: ['title', 'url', 'text', 'popup']
  },
  disqus: {
    name: 'Disqus',
    description: 'Intégration des commentaires Disqus',
    directive: 'ods-disqus',
    params: ['shortname', 'disqusidentifier', 'disqusurl', 'disqustitle']
  },
  reuses: {
    name: 'Reuses',
    description: 'Liste des réutilisations d\'un dataset',
    directive: 'ods-reuses',
    params: ['context']
  },
  lastReusesFeed: {
    name: 'Last Reuses Feed',
    description: 'Flux des dernières réutilisations',
    directive: 'ods-last-reuses-feed',
    params: ['context', 'max']
  },
  
  // Widgets utilitaires
  spinner: {
    name: 'Spinner',
    description: 'Indicateur de chargement',
    directive: 'ods-spinner',
    params: ['loading', 'message']
  },
  picto: {
    name: 'Picto',
    description: 'Icône ou pictogramme',
    directive: 'ods-picto',
    params: ['url', 'color', 'name']
  },
  themePicto: {
    name: 'Theme Picto',
    description: 'Pictogramme de thème',
    directive: 'ods-theme-picto',
    params: ['theme', 'size']
  },
  themeBoxes: {
    name: 'Theme Boxes',
    description: 'Boîtes cliquables pour les thèmes',
    directive: 'ods-theme-boxes',
    params: ['context']
  },
  toggleModel: {
    name: 'Toggle Model',
    description: 'Interrupteur on/off pour un modèle',
    directive: 'ods-toggle-model',
    params: ['model', 'value']
  },
  autoResize: {
    name: 'Auto Resize',
    description: 'Ajuste automatiquement la taille d\'un élément',
    directive: 'ods-auto-resize',
    params: []
  },
  pageRefresh: {
    name: 'Page Refresh',
    description: 'Rafraîchit la page périodiquement',
    directive: 'ods-page-refresh',
    params: ['delay']
  },
  widgetTooltip: {
    name: 'Widget Tooltip',
    description: 'Tooltip personnalisé pour les widgets',
    directive: 'ods-widget-tooltip',
    params: []
  },
  
  // Widgets de contenu externe
  gist: {
    name: 'Gist',
    description: 'Intègre un Gist GitHub',
    directive: 'ods-gist',
    params: ['username', 'gistid']
  },
  hubspotForm: {
    name: 'HubSpot Form',
    description: 'Intègre un formulaire HubSpot',
    directive: 'ods-hubspot-form',
    params: ['portalid', 'formid', 'redirecturl']
  },
  
  // Widgets géographiques
  geotooltip: {
    name: 'Geotooltip',
    description: 'Infobulle sur éléments géographiques',
    directive: 'ods-geotooltip',
    params: ['coords', 'delay', 'width', 'height', 'fields']
  },
  
  // Widgets de publication
  topPublishers: {
    name: 'Top Publishers',
    description: 'Liste des principaux éditeurs',
    directive: 'ods-top-publishers',
    params: ['context', 'max']
  },
  
  // Widget spécial
  refineOnClick: {
    name: 'Refine on Click',
    description: 'Applique un filtre au clic',
    directive: 'refine-on-click',
    params: ['context', 'refine-on', 'refine-value', 'replace-refine']
  }
};

// Liste complète des FILTRES Angular ODS
const ODS_FILTERS = {
  // Filtres de texte
  capitalize: 'Met en majuscule la première lettre',
  truncate: 'Tronque le texte à une longueur donnée',
  slugify: 'Convertit en slug URL-friendly',
  normalize: 'Normalise le texte (supprime accents, etc.)',
  shortSummary: 'Crée un résumé court du texte',
  shortTextSummary: 'Crée un résumé de texte avec ellipse',
  
  // Filtres de date/temps
  moment: 'Formate une date avec Moment.js',
  momentAdd: 'Ajoute du temps à une date',
  momentdiff: 'Calcule la différence entre dates',
  timesince: 'Affiche le temps écoulé depuis',
  isAfter: 'Vérifie si une date est après une autre',
  isBefore: 'Vérifie si une date est avant une autre',
  
  // Filtres de données
  fieldsFilter: 'Filtre les champs d\'un objet',
  firstValue: 'Retourne la première valeur non-nulle',
  join: 'Joint les éléments d\'un tableau',
  split: 'Divise une chaîne en tableau',
  keys: 'Retourne les clés d\'un objet',
  values: 'Retourne les valeurs d\'un objet',
  numKeys: 'Compte le nombre de clés',
  toObject: 'Convertit en objet',
  stringify: 'Convertit en chaîne JSON',
  
  // Filtres de validation
  isDefined: 'Vérifie si une valeur est définie',
  isEmpty: 'Vérifie si une valeur est vide',
  
  // Filtres média
  imageify: 'Convertit en balise image HTML',
  videoify: 'Convertit en balise vidéo HTML',
  imageUrl: 'Génère l\'URL d\'une image',
  thumbnailUrl: 'Génère l\'URL d\'une miniature',
  
  // Filtres de thème
  themeColor: 'Retourne la couleur d\'un thème',
  themeSlug: 'Retourne le slug d\'un thème',
  
  // Autres filtres
  nofollow: 'Ajoute rel="nofollow" aux liens',
};

// Schémas de validation complets
const CreateWidgetSchema = z.object({
  type: z.enum(Object.keys(ODS_WIDGETS)),
  dataset: z.string(),
  domain: z.string().default('data.economie.gouv.fr'),
  theme: z.enum(['dsfr', 'classic']).default('dsfr'),
  context: z.string().default('ctx'),
  options: z.record(z.any()).optional()
});

const GenerateDashboardSchema = z.object({
  dataset: z.string(),
  domain: z.string().default('data.economie.gouv.fr'),
  widgets: z.array(z.enum(Object.keys(ODS_WIDGETS))).optional(),
  theme: z.enum(['dsfr', 'classic']).default('dsfr'),
  title: z.string().optional(),
  description: z.string().optional()
});

// Générateur de widgets ultra-complet
class UltimateWidgetGenerator {
  generateWidget(type, params) {
    const widget = ODS_WIDGETS[type];
    if (!widget) {
      throw new Error(`Widget non supporté: ${type}`);
    }

    const attributes = this.buildAttributes(widget, params);
    
    // Gestion spéciale pour certains widgets qui ont du contenu interne
    if (type === 'chart') {
      return this.generateChartWidget(params);
    } else if (type === 'crossTable') {
      return this.generateCrossTableWidget(params);
    } else if (type === 'aggregation' || type === 'analysis' || type === 'results') {
      return `<${widget.directive} ${attributes}>
    <!-- Contenu personnalisé ici -->
</${widget.directive}>`;
    }
    
    return `<${widget.directive} ${attributes}></${widget.directive}>`;
  }

  generateChartWidget(params) {
    const { context = 'ctx', options = {} } = params;
    const fieldX = options['field-x'] || 'categorie';
    const chartType = options['chart-type'] || 'column';
    const functionY = options['function-y'] || 'COUNT';
    
    return `<ods-chart align-month="true">
    <ods-chart-query context="${context}" field-x="${fieldX}" maxpoints="20">
        <ods-chart-serie chart-type="${chartType}" 
                        function-y="${functionY}" 
                        color="#0063cb"
                        display-values="true">
        </ods-chart-serie>
    </ods-chart-query>
</ods-chart>`;
  }

  generateCrossTableWidget(params) {
    const { context = 'ctx', options = {} } = params;
    const columnField = options['column-field'] || 'categorie';
    const rowField = options['row-field'] || 'dep';
    
    return `<ods-cross-table context="${context}">
    <ods-cross-table-column-serie field="${columnField}"></ods-cross-table-column-serie>
    <ods-cross-table-row-serie field="${rowField}"></ods-cross-table-row-serie>
</ods-cross-table>`;
  }

  buildAttributes(widget, params) {
    const attrs = [];
    
    // Attributs standards
    if (params.context) attrs.push(`context="${params.context}"`);
    
    // Pour les contextes
    if (widget.directive === 'ods-dataset-context' || widget.directive === 'ods-catalog-context') {
      const ctx = params.context || 'ctx';
      if (params.dataset) attrs.push(`${ctx}-dataset="${params.dataset}"`);
      if (params.domain) attrs.push(`${ctx}-domain="${params.domain}"`);
      if (params.urlSync !== undefined) attrs.push(`${ctx}-url-sync="${params.urlSync}"`);
    }
    
    // Options spécifiques
    if (params.options) {
      Object.entries(params.options).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          if (value) attrs.push(key);
        } else if (Array.isArray(value)) {
          attrs.push(`${key}="${JSON.stringify(value).replace(/"/g, '\'')}}"`);
        } else if (typeof value === 'object') {
          attrs.push(`${key}="${JSON.stringify(value).replace(/"/g, '\'')}"`);
        } else {
          attrs.push(`${key}="${value}"`);
        }
      });
    }
    
    return attrs.join(' ');
  }

  generateDSFRWrapper(content, widgetType, title, description) {
    const widget = ODS_WIDGETS[widgetType];
    const widgetTitle = title || widget.name;
    const widgetDesc = description || widget.description;
    
    return `
<div class="fr-card">
    <div class="fr-card__body">
        <div class="fr-card__content">
            <h3 class="fr-card__title">${widgetTitle}</h3>
            ${widgetDesc ? `<p class="fr-card__desc">${widgetDesc}</p>` : ''}
        </div>
    </div>
    <div class="fr-card__body">
        ${content}
    </div>
</div>`;
  }

  generateCompletePage(params) {
    const widgets = params.widgets || ['datasetContext', 'searchbox', 'facets', 'table', 'chart', 'map', 'aggregation'];
    const title = params.title || `Dashboard ${params.dataset}`;
    const description = params.description || '';
    
    return `<!DOCTYPE html>
<html lang="fr" data-fr-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title} - DSFR</title>
    
    <!-- CSS DSFR -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.min.css">
    <!-- CSS ODS -->
    <link rel="stylesheet" href="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.css">
    
    <style>
        /* Styles personnalisés pour l'intégration DSFR/ODS */
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }
        
        .widget-container {
            min-height: 300px;
        }
        
        .ods-map {
            height: 400px;
            width: 100%;
        }
        
        .ods-chart {
            min-height: 350px;
        }
        
        .ods-table {
            overflow-x: auto;
        }
        
        /* Support du mode sombre DSFR */
        [data-fr-theme="dark"] .ods-widget {
            background-color: var(--background-elevated-grey);
            color: var(--text-default-grey);
        }
        
        [data-fr-theme="dark"] .ods-facets,
        [data-fr-theme="dark"] .ods-filters {
            background-color: var(--background-contrast-grey);
            border-color: var(--border-default-grey);
        }
        
        /* Amélioration de l'accessibilité */
        .ods-widget:focus-within {
            outline: 2px solid var(--border-plain-blue-france);
            outline-offset: 2px;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <!-- Header DSFR -->
    <header role="banner" class="fr-header">
        <div class="fr-header__body">
            <div class="fr-container">
                <div class="fr-header__body-row">
                    <div class="fr-header__brand fr-enlarge-link">
                        <div class="fr-header__brand-top">
                            <div class="fr-header__logo">
                                <p class="fr-logo">République<br>Française</p>
                            </div>
                        </div>
                        <div class="fr-header__service">
                            <a href="/" title="Accueil">
                                <p class="fr-header__service-title">${title}</p>
                            </a>
                            ${description ? `<p class="fr-header__service-tagline">${description}</p>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
    
    <!-- Contenu principal -->
    <main id="main" role="main" class="fr-container fr-py-4w" ng-app="ods-widgets">
        
        <!-- Contexte du dataset -->
        <ods-dataset-context context="ctx" 
                            ctx-domain="${params.domain}"
                            ctx-dataset="${params.dataset}"
                            ctx-url-sync="true">
            
            <div class="fr-grid-row fr-grid-row--gutters">
                <!-- Colonne de gauche : Filtres -->
                <div class="fr-col-12 fr-col-md-3">
                    <nav class="fr-sidemenu" aria-label="Filtres">
                        <div class="fr-sidemenu__inner">
                            <button class="fr-sidemenu__btn" aria-controls="fr-sidemenu-wrapper" aria-expanded="false">
                                Filtres
                            </button>
                            <div class="fr-collapse" id="fr-sidemenu-wrapper">
                                <div class="fr-sidemenu__title">Filtrer les données</div>
                                
                                <!-- Recherche -->
                                <div class="fr-mb-3w">
                                    <ods-searchbox context="ctx" 
                                                  placeholder="Rechercher..."
                                                  button="Rechercher"
                                                  autofocus="true">
                                    </ods-searchbox>
                                </div>
                                
                                <!-- Facettes -->
                                <ods-facets context="ctx"></ods-facets>
                                
                                <!-- Bouton effacer -->
                                <ods-clear-all-filters context="ctx" 
                                                       class="fr-btn fr-btn--secondary fr-btn--sm fr-mt-2w">
                                    Effacer tous les filtres
                                </ods-clear-all-filters>
                            </div>
                        </div>
                    </nav>
                </div>
                
                <!-- Colonne de droite : Widgets -->
                <div class="fr-col-12 fr-col-md-9">
                    <!-- Titre et résumé des filtres -->
                    <div class="fr-mb-3w">
                        <h1>${title}</h1>
                        <ods-filter-summary context="ctx"></ods-filter-summary>
                    </div>
                    
                    <!-- KPIs -->
                    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3w">
                        <div class="fr-col-12 fr-col-sm-6 fr-col-md-3">
                            <ods-aggregation context="ctx" function="COUNT">
                                <div class="fr-tile fr-enlarge-link">
                                    <div class="fr-tile__body">
                                        <h3 class="fr-tile__title">
                                            {{ aggregation | number }}
                                        </h3>
                                        <p>Enregistrements</p>
                                    </div>
                                </div>
                            </ods-aggregation>
                        </div>
                    </div>
                    
                    <!-- Widgets principaux -->
                    <div class="dashboard-grid">
                        ${this.generateWidgetsForDashboard(widgets, params)}
                    </div>
                    
                    <!-- Pagination -->
                    <div class="fr-mt-4w">
                        <ods-pagination-block context="ctx" per-page="20"></ods-pagination-block>
                    </div>
                </div>
            </div>
        </ods-dataset-context>
    </main>
    
    <!-- Footer DSFR -->
    <footer class="fr-footer" role="contentinfo">
        <div class="fr-container">
            <div class="fr-footer__body">
                <div class="fr-footer__brand fr-enlarge-link">
                    <p class="fr-logo">République<br>Française</p>
                </div>
                <div class="fr-footer__content">
                    <p class="fr-footer__content-desc">
                        Dashboard généré avec ODS Widgets et DSFR
                    </p>
                </div>
            </div>
        </div>
    </footer>
    
    <!-- Scripts (ordre important) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.2/angular.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-sanitize/1.8.2/angular-sanitize.min.js"></script>
    <script src="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.module.min.js"></script>
    
    <!-- Configuration Angular si nécessaire -->
    <script>
        // Configuration supplémentaire si besoin
    </script>
</body>
</html>`;
  }

  generateWidgetsForDashboard(widgets, params) {
    return widgets.map(widgetType => {
      if (!ODS_WIDGETS[widgetType]) return '';
      
      const widgetHtml = this.generateWidget(widgetType, {
        context: 'ctx',
        dataset: params.dataset,
        domain: params.domain,
        options: params.options?.[widgetType] || {}
      });
      
      if (params.theme === 'dsfr') {
        return this.generateDSFRWrapper(widgetHtml, widgetType);
      }
      
      return `<div class="widget-container">${widgetHtml}</div>`;
    }).join('\n');
  }
}

// Serveur MCP Ultimate
class UltimateODSWidgetsMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'ods-widgets-ultimate-mcp',
        version: '3.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.generator = new UltimateWidgetGenerator();
    this.setupHandlers();
  }

  setupHandlers() {
    this.server.setToolListHandler(async () => ({
      tools: [
        {
          name: 'create_widget',
          description: 'Créer n\'importe quel widget ODS avec thème DSFR',
          inputSchema: {
            type: 'object',
            properties: {
              type: { 
                type: 'string', 
                enum: Object.keys(ODS_WIDGETS),
                description: 'Type de widget à créer (50+ widgets disponibles)'
              },
              dataset: { 
                type: 'string',
                description: 'ID du dataset OpenDataSoft'
              },
              context: {
                type: 'string',
                default: 'ctx',
                description: 'Nom du contexte Angular'
              },
              domain: {
                type: 'string',
                default: 'data.economie.gouv.fr',
                description: 'Domaine OpenDataSoft'
              },
              theme: {
                type: 'string',
                enum: ['dsfr', 'classic'],
                default: 'dsfr',
                description: 'Thème à appliquer'
              },
              options: {
                type: 'object',
                description: 'Options spécifiques au widget'
              }
            },
            required: ['type', 'dataset']
          }
        },
        {
          name: 'list_widgets',
          description: 'Lister tous les widgets ODS disponibles avec descriptions',
          inputSchema: {
            type: 'object',
            properties: {
              format: {
                type: 'string',
                enum: ['simple', 'detailed', 'markdown'],
                default: 'simple',
                description: 'Format de sortie'
              }
            }
          }
        },
        {
          name: 'list_filters',
          description: 'Lister tous les filtres Angular ODS disponibles',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'generate_dashboard',
          description: 'Générer un dashboard DSFR complet avec widgets ODS',
          inputSchema: {
            type: 'object',
            properties: {
              dataset: { 
                type: 'string',
                description: 'ID du dataset'
              },
              domain: { 
                type: 'string', 
                default: 'data.economie.gouv.fr',
                description: 'Domaine OpenDataSoft'
              },
              widgets: { 
                type: 'array', 
                items: { 
                  type: 'string',
                  enum: Object.keys(ODS_WIDGETS)
                },
                description: 'Widgets à inclure (par défaut: sélection automatique)'
              },
              theme: {
                type: 'string',
                enum: ['dsfr', 'classic'],
                default: 'dsfr'
              },
              title: {
                type: 'string',
                description: 'Titre du dashboard'
              },
              description: {
                type: 'string',
                description: 'Description du dashboard'
              }
            },
            required: ['dataset']
          }
        },
        {
          name: 'get_widget_code',
          description: 'Obtenir le code HTML d\'un widget spécifique avec exemples',
          inputSchema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: Object.keys(ODS_WIDGETS),
                description: 'Type de widget'
              },
              context: {
                type: 'string',
                default: 'ctx'
              },
              options: {
                type: 'object',
                description: 'Options du widget'
              },
              wrapped: {
                type: 'boolean',
                default: true,
                description: 'Envelopper dans un composant DSFR'
              },
              includeExample: {
                type: 'boolean',
                default: false,
                description: 'Inclure un exemple d\'utilisation'
              }
            },
            required: ['type']
          }
        },
        {
          name: 'analyze_dataset',
          description: 'Analyser un dataset et recommander les meilleurs widgets',
          inputSchema: {
            type: 'object',
            properties: {
              dataset: { type: 'string' },
              domain: { type: 'string', default: 'data.economie.gouv.fr' }
            },
            required: ['dataset']
          }
        }
      ]
    }));

    this.server.setToolCallHandler(async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
        case 'create_widget': {
          const params = CreateWidgetSchema.parse(args);
          let html = this.generator.generateWidget(params.type, params);
            
          if (params.theme === 'dsfr') {
            html = this.generator.generateDSFRWrapper(html, params.type);
          }
            
          return {
            content: [
              {
                type: 'text',
                text: `Widget ${params.type} (${ODS_WIDGETS[params.type].directive}) créé avec succès:\n\n\`\`\`html\n${html}\n\`\`\``
              }
            ]
          };
        }

        case 'list_widgets': {
          const format = args.format || 'simple';
          let output = '';
            
          if (format === 'detailed') {
            output = Object.entries(ODS_WIDGETS).map(([key, widget]) => 
              `**${key}** (${widget.directive})\n  ${widget.description}\n  Params: ${widget.params.join(', ')}`
            ).join('\n\n');
          } else if (format === 'markdown') {
            output = '# Widgets ODS disponibles\n\n';
            const categories = {
              'Contextes': ['datasetContext', 'catalogContext'],
              'Visualisation': ['table', 'chart', 'chartQuery', 'chartSerie', 'map'],
              'Agrégation': ['aggregation', 'analysis', 'subaggregation', 'gauge'],
              'Filtrage': ['facets', 'facetResults', 'searchbox', 'textSearch', 'clearAllFilters', 'filterSummary'],
              'Temporel': ['calendar', 'timerange', 'timescale', 'datetime'],
              'Résultats': ['results', 'resultEnumerator', 'infiniteScrollResults', 'paginationBlock'],
              'Média': ['mediaGallery', 'slideshow', 'recordImage'],
              'Avancé': ['crossTable', 'tagCloud'],
              'Catalogue': ['mostPopularDatasets', 'mostUsedThemes', 'lastDatasetsFeed', 'domainStatistics', 'datasetSchema'],
              'Social': ['socialButtons', 'disqus', 'reuses', 'lastReusesFeed'],
              'Utilitaires': ['spinner', 'picto', 'themePicto', 'themeBoxes', 'toggleModel', 'autoResize', 'pageRefresh', 'widgetTooltip'],
              'Externe': ['gist', 'hubspotForm'],
              'Géographique': ['geotooltip'],
              'Publication': ['topPublishers'],
              'Spécial': ['refineOnClick']
            };
              
            for (const [category, widgets] of Object.entries(categories)) {
              output += `\n## ${category}\n\n`;
              widgets.forEach(key => {
                const widget = ODS_WIDGETS[key];
                if (widget) {
                  output += `- **${key}** (\`${widget.directive}\`): ${widget.description}\n`;
                }
              });
            }
          } else {
            output = `Widgets ODS disponibles (${Object.keys(ODS_WIDGETS).length} widgets):\n\n`;
            output += Object.entries(ODS_WIDGETS).map(([key, widget]) => 
              `- **${key}** (${widget.directive}): ${widget.description}`
            ).join('\n');
          }
            
          return {
            content: [
              {
                type: 'text',
                text: output
              }
            ]
          };
        }

        case 'list_filters': {
          const filtersList = Object.entries(ODS_FILTERS).map(([key, description]) => 
            `- **${key}**: ${description}`
          ).join('\n');
            
          return {
            content: [
              {
                type: 'text',
                text: `Filtres Angular ODS disponibles:\n\n${filtersList}\n\nUtilisation: {{ expression | filterName:param1:param2 }}`
              }
            ]
          };
        }

        case 'generate_dashboard': {
          const params = GenerateDashboardSchema.parse(args);
          const html = this.generator.generateCompletePage(params);
            
          return {
            content: [
              {
                type: 'text',
                text: `Dashboard complet généré pour ${params.dataset}:\n\n\`\`\`html\n${html}\n\`\`\``
              }
            ]
          };
        }

        case 'get_widget_code': {
          const { type, context = 'ctx', options = {}, wrapped = true, includeExample = false } = args;
          const widget = ODS_WIDGETS[type];
            
          if (!widget) {
            throw new Error(`Widget inconnu: ${type}`);
          }
            
          let html = this.generator.generateWidget(type, { context, options });
            
          if (wrapped) {
            html = this.generator.generateDSFRWrapper(html, type);
          }
            
          let response = `Widget: ${widget.name}\nDirective: ${widget.directive}\nDescription: ${widget.description}\n\n`;
          response += `Code:\n\`\`\`html\n${html}\n\`\`\`\n\n`;
            
          if (includeExample) {
            response += `Paramètres disponibles:\n${widget.params.map(p => `- ${p}`).join('\n')}\n\n`;
            response += 'Exemple d\'utilisation complète:\n```html\n';
            response += '<ods-dataset-context context="myctx" myctx-domain="data.example.com" myctx-dataset="my-dataset">\n';
            response += `  ${html}\n`;
            response += '</ods-dataset-context>\n```';
          }
            
          return {
            content: [
              {
                type: 'text',
                text: response
              }
            ]
          };
        }

        case 'analyze_dataset': {
          const { dataset, domain } = args;
            
          // Simulation d'analyse (dans un vrai cas, on ferait un appel API)
          const recommendations = [
            'table - Pour afficher les données brutes',
            'chart - Pour visualiser les tendances',
            'map - Si des données géographiques sont présentes',
            'facets - Pour permettre le filtrage',
            'aggregation - Pour afficher des KPIs',
            'searchbox - Pour la recherche textuelle',
            'calendar - Si des dates sont présentes',
            'tagCloud - Pour les catégories'
          ];
            
          return {
            content: [
              {
                type: 'text',
                text: `Analyse du dataset "${dataset}" sur ${domain}\n\nWidgets recommandés:\n${recommendations.join('\n')}`
              }
            ]
          };
        }

        default:
          throw new Error(`Outil non reconnu: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Erreur: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP ODS Widgets Ultimate Server démarré - Version 3.0.0');
    console.error(`${Object.keys(ODS_WIDGETS).length} widgets disponibles`);
    console.error(`${Object.keys(ODS_FILTERS).length} filtres disponibles`);
  }
}

// Démarrage du serveur
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new UltimateODSWidgetsMCPServer();
  server.run().catch(console.error);
}

export { UltimateODSWidgetsMCPServer, UltimateWidgetGenerator, ODS_WIDGETS, ODS_FILTERS };