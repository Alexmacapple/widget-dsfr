#!/usr/bin/env node
/**
 * MCP ODS Widgets FINAL - Version complète avec TOUS les widgets (documentés + non documentés)
 * Total : 70+ widgets incluant tous les widgets du code source
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// Liste FINALE et COMPLÈTE de TOUS les widgets ODS (70+ widgets)
const ODS_WIDGETS_COMPLETE = {
  // === WIDGETS DOCUMENTÉS (52) ===
  
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
  },
  
  // === WIDGETS NON DOCUMENTÉS MAIS EXISTANTS (18) ===
  
  // Widgets avancés additionnels
  advancedAnalysis: {
    name: 'Advanced Analysis',
    description: 'Analyse avancée avec options étendues',
    directive: 'ods-advanced-analysis',
    params: ['context', 'x', 'y', 'color', 'size', 'facet']
  },
  advancedResults: {
    name: 'Advanced Results',
    description: 'Résultats avancés avec template et options étendues',
    directive: 'ods-advanced-results',
    params: ['context', 'template', 'max', 'sort', 'filter']
  },
  advancedTable: {
    name: 'Advanced Table',
    description: 'Table avancée avec tri, filtrage et export',
    directive: 'ods-advanced-table',
    params: ['context', 'displayed-fields', 'editable', 'export-csv', 'column-filter']
  },
  analyze: {
    name: 'Analyze',
    description: 'Widget d\'analyse de données avec visualisations',
    directive: 'ods-analyze',
    params: ['context', 'analysis-type', 'visualization']
  },
  
  // Widgets temporels additionnels
  dateRangeSlider: {
    name: 'Date Range Slider',
    description: 'Sélecteur de plage de dates avec slider visuel',
    directive: 'ods-date-range-slider',
    params: ['context', 'date-field', 'min-date', 'max-date', 'initial-range']
  },
  timer: {
    name: 'Timer',
    description: 'Minuteur/chronomètre avec actions',
    directive: 'ods-timer',
    params: ['duration', 'on-complete', 'auto-start', 'format']
  },
  
  // Widgets géographiques additionnels
  geoNavigation: {
    name: 'Geo Navigation',
    description: 'Navigation géographique avec zoom sur régions',
    directive: 'ods-geo-navigation',
    params: ['context', 'level', 'region-field', 'navigation-type']
  },
  mapDisplayControl: {
    name: 'Map Display Control',
    description: 'Contrôles avancés d\'affichage de carte',
    directive: 'ods-map-display-control',
    params: ['map-id', 'controls', 'position']
  },
  mapLegacy: {
    name: 'Map Legacy',
    description: 'Version legacy de la carte (compatibilité)',
    directive: 'ods-map-legacy',
    params: ['context', 'location', 'zoom']
  },
  mapLegend: {
    name: 'Map Legend',
    description: 'Légende détaillée pour carte',
    directive: 'ods-map-legend',
    params: ['map-id', 'items', 'position', 'collapsible']
  },
  mapSearchBox: {
    name: 'Map Search Box',
    description: 'Boîte de recherche géographique sur carte',
    directive: 'ods-map-search-box',
    params: ['map-id', 'placeholder', 'search-type', 'auto-complete']
  },
  mapTooltip: {
    name: 'Map Tooltip',
    description: 'Tooltip riche pour éléments de carte',
    directive: 'ods-map-tooltip',
    params: ['template', 'fields', 'offset', 'hover-delay']
  },
  
  // Widgets de visualisation additionnels
  highcharts: {
    name: 'Highcharts',
    description: 'Graphiques Highcharts avec configuration directe',
    directive: 'ods-highcharts',
    params: ['chart-config', 'context', 'data']
  },
  legend: {
    name: 'Legend',
    description: 'Légende pour graphiques et visualisations',
    directive: 'ods-legend',
    params: ['items', 'orientation', 'position']
  },
  
  // Widgets UI additionnels
  popIn: {
    name: 'Pop In',
    description: 'Fenêtre modale/pop-in',
    directive: 'ods-pop-in',
    params: ['trigger', 'content', 'size', 'closeable']
  },
  select: {
    name: 'Select',
    description: 'Sélecteur dropdown personnalisé',
    directive: 'ods-select',
    params: ['context', 'field', 'options', 'multiple', 'placeholder']
  },
  simpleTabs: {
    name: 'Simple Tabs',
    description: 'Système d\'onglets simple',
    directive: 'ods-simple-tabs',
    params: ['tabs', 'active-tab', 'on-change']
  },
  
  // Widget social additionnel
  twitterTimeline: {
    name: 'Twitter Timeline',
    description: 'Timeline Twitter intégrée',
    directive: 'ods-twitter-timeline',
    params: ['username', 'widget-id', 'tweet-limit', 'theme']
  }
};

// Export pour compatibilité
export const ODS_WIDGETS = ODS_WIDGETS_COMPLETE;

// Liste des filtres (inchangée)
export const ODS_FILTERS = {
  capitalize: 'Met en majuscule la première lettre',
  truncate: 'Tronque le texte à une longueur donnée',
  slugify: 'Convertit en slug URL-friendly',
  normalize: 'Normalise le texte (supprime accents, etc.)',
  shortSummary: 'Crée un résumé court du texte',
  shortTextSummary: 'Crée un résumé de texte avec ellipse',
  moment: 'Formate une date avec Moment.js',
  momentAdd: 'Ajoute du temps à une date',
  momentdiff: 'Calcule la différence entre dates',
  timesince: 'Affiche le temps écoulé depuis',
  isAfter: 'Vérifie si une date est après une autre',
  isBefore: 'Vérifie si une date est avant une autre',
  fieldsFilter: 'Filtre les champs d\'un objet',
  firstValue: 'Retourne la première valeur non-nulle',
  join: 'Joint les éléments d\'un tableau',
  split: 'Divise une chaîne en tableau',
  keys: 'Retourne les clés d\'un objet',
  values: 'Retourne les valeurs d\'un objet',
  numKeys: 'Compte le nombre de clés',
  toObject: 'Convertit en objet',
  stringify: 'Convertit en chaîne JSON',
  isDefined: 'Vérifie si une valeur est définie',
  isEmpty: 'Vérifie si une valeur est vide',
  imageify: 'Convertit en balise image HTML',
  videoify: 'Convertit en balise vidéo HTML',
  imageUrl: 'Génère l\'URL d\'une image',
  thumbnailUrl: 'Génère l\'URL d\'une miniature',
  themeColor: 'Retourne la couleur d\'un thème',
  themeSlug: 'Retourne le slug d\'un thème',
  nofollow: 'Ajoute rel="nofollow" aux liens',
};

// Import des classes du serveur ultimate
import { UltimateWidgetGenerator } from './index-ultimate.js';

// Serveur MCP FINAL avec TOUS les widgets
class FinalODSWidgetsMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'ods-widgets-final-mcp',
        version: '4.0.0',
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
          description: 'Créer n\'importe quel widget ODS (70+ widgets disponibles)',
          inputSchema: {
            type: 'object',
            properties: {
              type: { 
                type: 'string', 
                enum: Object.keys(ODS_WIDGETS_COMPLETE),
                description: 'Type de widget à créer (70+ widgets disponibles)'
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
          name: 'list_all_widgets',
          description: 'Lister TOUS les widgets (documentés + non documentés)',
          inputSchema: {
            type: 'object',
            properties: {
              includeUndocumented: {
                type: 'boolean',
                default: true,
                description: 'Inclure les widgets non documentés'
              },
              format: {
                type: 'string',
                enum: ['simple', 'detailed', 'markdown'],
                default: 'simple'
              }
            }
          }
        },
        {
          name: 'generate_dashboard',
          description: 'Générer un dashboard complet avec sélection intelligente de widgets',
          inputSchema: {
            type: 'object',
            properties: {
              dataset: { 
                type: 'string',
                description: 'ID du dataset'
              },
              domain: { 
                type: 'string', 
                default: 'data.economie.gouv.fr'
              },
              includeAdvanced: {
                type: 'boolean',
                default: false,
                description: 'Inclure les widgets avancés'
              },
              theme: {
                type: 'string',
                enum: ['dsfr', 'classic'],
                default: 'dsfr'
              }
            },
            required: ['dataset']
          }
        },
        {
          name: 'get_widget_info',
          description: 'Obtenir les informations détaillées d\'un widget',
          inputSchema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: Object.keys(ODS_WIDGETS_COMPLETE)
              }
            },
            required: ['type']
          }
        }
      ]
    }));

    this.server.setToolCallHandler(async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_widget': {
            const { type, dataset, context = 'ctx', domain = 'data.economie.gouv.fr', theme = 'dsfr', options = {} } = args;
            const widget = ODS_WIDGETS_COMPLETE[type];
            
            if (!widget) {
              throw new Error(`Widget inconnu: ${type}`);
            }
            
            let html = this.generator.generateWidget(type, { context, dataset, domain, options });
            
            if (theme === 'dsfr') {
              html = this.generator.generateDSFRWrapper(html, type);
            }
            
            return {
              content: [
                {
                  type: 'text',
                  text: `Widget ${widget.name} (${widget.directive}) créé:\n\n\`\`\`html\n${html}\n\`\`\``
                }
              ]
            };
          }

          case 'list_all_widgets': {
            const { includeUndocumented = true, format = 'simple' } = args;
            let widgets = ODS_WIDGETS_COMPLETE;
            
            if (!includeUndocumented) {
              // Filtrer pour ne garder que les 52 premiers (documentés)
              widgets = Object.fromEntries(
                Object.entries(widgets).slice(0, 52)
              );
            }
            
            const count = Object.keys(widgets).length;
            let output = `# Widgets ODS disponibles (${count} widgets)\n\n`;
            
            if (format === 'detailed' || format === 'markdown') {
              output += '## Widgets documentés (52)\n';
              Object.entries(widgets).slice(0, 52).forEach(([key, widget]) => {
                output += `- **${key}** (\`${widget.directive}\`): ${widget.description}\n`;
              });
              
              if (includeUndocumented) {
                output += '\n## Widgets non documentés mais disponibles (18)\n';
                Object.entries(widgets).slice(52).forEach(([key, widget]) => {
                  output += `- **${key}** (\`${widget.directive}\`) [BETA]: ${widget.description}\n`;
                });
              }
            } else {
              Object.entries(widgets).forEach(([key, widget]) => {
                output += `- ${key}: ${widget.directive}\n`;
              });
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

          case 'generate_dashboard': {
            const { dataset, domain = 'data.economie.gouv.fr', includeAdvanced = false, theme = 'dsfr' } = args;
            
            // Sélection intelligente de widgets
            let widgets = ['datasetContext', 'searchbox', 'facets', 'table', 'chart', 'map', 'aggregation'];
            
            if (includeAdvanced) {
              widgets.push('advancedAnalysis', 'advancedTable', 'dateRangeSlider', 'mapLegend');
            }
            
            const params = { dataset, domain, widgets, theme };
            const html = this.generator.generateCompletePage(params);
            
            return {
              content: [
                {
                  type: 'text',
                  text: `Dashboard complet généré (${widgets.length} widgets):\n\n\`\`\`html\n${html}\n\`\`\``
                }
              ]
            };
          }

          case 'get_widget_info': {
            const { type } = args;
            const widget = ODS_WIDGETS_COMPLETE[type];
            
            if (!widget) {
              throw new Error(`Widget inconnu: ${type}`);
            }
            
            const isDocumented = Object.keys(ODS_WIDGETS_COMPLETE).indexOf(type) < 52;
            
            let info = `# Widget: ${widget.name}\n\n`;
            info += `**Directive**: \`${widget.directive}\`\n`;
            info += `**Description**: ${widget.description}\n`;
            info += `**Statut**: ${isDocumented ? '✅ Documenté' : '⚠️ Non documenté (BETA)'}\n\n`;
            
            if (widget.params && widget.params.length > 0) {
              info += `## Paramètres disponibles:\n`;
              widget.params.forEach(param => {
                info += `- \`${param}\`\n`;
              });
            }
            
            info += `\n## Exemple d'utilisation:\n\`\`\`html\n`;
            info += this.generator.generateWidget(type, { context: 'ctx', dataset: 'example' });
            info += `\n\`\`\``;
            
            return {
              content: [
                {
                  type: 'text',
                  text: info
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
    console.error('🚀 MCP ODS Widgets FINAL Server démarré - Version 4.0.0');
    console.error(`📊 ${Object.keys(ODS_WIDGETS_COMPLETE).length} widgets disponibles (52 documentés + 18 non documentés)`);
    console.error(`🔧 ${Object.keys(ODS_FILTERS).length} filtres Angular disponibles`);
    console.error('✅ INTÉGRATION 100% COMPLÈTE!');
  }
}

// Démarrage du serveur
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new FinalODSWidgetsMCPServer();
  server.run().catch(console.error);
}

export { FinalODSWidgetsMCPServer, ODS_WIDGETS_COMPLETE };