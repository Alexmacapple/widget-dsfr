#!/usr/bin/env node
/**
 * MCP ODS Widgets - Serveur complet avec tous les widgets
 * Intégration complète des widgets OpenDataSoft avec le Design System France
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// Liste complète des widgets ODS disponibles
const ODS_WIDGETS = {
  // Widgets de visualisation de données
  table: {
    name: 'Table',
    description: 'Affiche des données dans un tableau',
    directive: 'ods-table',
    params: ['context', 'displayed-fields', 'sort', 'page-size']
  },
  chart: {
    name: 'Graphique',
    description: 'Graphiques interactifs (colonnes, lignes, aires, etc.)',
    directive: 'ods-chart',
    params: ['align-month', 'labels-x-length', 'display-legend', 'scientific-display']
  },
  map: {
    name: 'Carte',
    description: 'Carte interactive avec marqueurs et couches',
    directive: 'ods-map',
    params: ['context', 'location', 'basemap', 'toolbar-drawing', 'scroll-wheel-zoom']
  },
  
  // Widgets d'agrégation et analyse
  aggregation: {
    name: 'Agrégation',
    description: 'Calculs d\'agrégation sur les données',
    directive: 'ods-aggregation',
    params: ['context', 'function', 'expression', 'field']
  },
  analysis: {
    name: 'Analyse',
    description: 'Analyse statistique des données',
    directive: 'ods-analysis',
    params: ['context', 'max', 'sort', 'serie-name']
  },
  gauge: {
    name: 'Jauge',
    description: 'Jauge visuelle pour afficher une valeur',
    directive: 'ods-gauge',
    params: ['value', 'max', 'display-mode', 'size']
  },
  
  // Widgets de filtrage et recherche
  facets: {
    name: 'Facettes',
    description: 'Filtres à facettes pour raffiner les données',
    directive: 'ods-facets',
    params: ['context', 'visible-items', 'hide-category-if']
  },
  facetResults: {
    name: 'Résultats de facettes',
    description: 'Affiche les résultats d\'une facette',
    directive: 'ods-facet-results',
    params: ['context', 'facet-name', 'sort']
  },
  searchbox: {
    name: 'Boîte de recherche',
    description: 'Champ de recherche textuelle',
    directive: 'ods-searchbox',
    params: ['context', 'placeholder', 'button', 'autofocus']
  },
  textSearch: {
    name: 'Recherche textuelle',
    description: 'Recherche de texte dans les données',
    directive: 'ods-text-search',
    params: ['context', 'placeholder', 'suffix', 'field']
  },
  clearAllFilters: {
    name: 'Effacer les filtres',
    description: 'Bouton pour effacer tous les filtres actifs',
    directive: 'ods-clear-all-filters',
    params: ['context', 'display-button']
  },
  filterSummary: {
    name: 'Résumé des filtres',
    description: 'Affiche un résumé des filtres appliqués',
    directive: 'ods-filter-summary',
    params: ['context', 'heading']
  },
  
  // Widgets temporels
  calendar: {
    name: 'Calendrier',
    description: 'Calendrier interactif avec événements',
    directive: 'ods-calendar',
    params: ['context', 'event-field', 'title-field', 'tooltip-fields']
  },
  timerange: {
    name: 'Plage temporelle',
    description: 'Sélecteur de plage de dates',
    directive: 'ods-timerange',
    params: ['context', 'date-field', 'default-from', 'default-to']
  },
  timescale: {
    name: 'Échelle temporelle',
    description: 'Timeline avec échelle de temps',
    directive: 'ods-timescale',
    params: ['context', 'time-field']
  },
  datetime: {
    name: 'Date et heure',
    description: 'Affichage formaté de date/heure',
    directive: 'ods-datetime',
    params: ['date', 'format', 'refresh-delay']
  },
  
  // Widgets de résultats
  results: {
    name: 'Résultats',
    description: 'Liste de résultats paginée',
    directive: 'ods-results',
    params: ['context', 'items-per-page', 'sort', 'fields']
  },
  resultEnumerator: {
    name: 'Énumérateur de résultats',
    description: 'Parcourt et affiche les résultats',
    directive: 'ods-result-enumerator',
    params: ['context', 'max']
  },
  infiniteScrollResults: {
    name: 'Défilement infini',
    description: 'Chargement infini des résultats',
    directive: 'ods-infinite-scroll-results',
    params: ['context', 'result-class', 'scroll-top-when-refresh']
  },
  paginationBlock: {
    name: 'Pagination',
    description: 'Bloc de pagination pour naviguer dans les résultats',
    directive: 'ods-pagination-block',
    params: ['context', 'per-page', 'nofollow']
  },
  
  // Widgets média
  mediaGallery: {
    name: 'Galerie média',
    description: 'Galerie d\'images et de médias',
    directive: 'ods-media-gallery',
    params: ['context', 'media-field', 'thumbnail-field']
  },
  slideshow: {
    name: 'Diaporama',
    description: 'Diaporama d\'images',
    directive: 'ods-slideshow',
    params: ['context', 'image-field', 'display-timer', 'autoplay']
  },
  recordImage: {
    name: 'Image d\'enregistrement',
    description: 'Affiche l\'image d\'un enregistrement',
    directive: 'ods-record-image',
    params: ['record', 'field', 'domainurl']
  },
  
  // Widgets avancés
  crossTable: {
    name: 'Tableau croisé',
    description: 'Tableau croisé dynamique',
    directive: 'ods-cross-table',
    params: ['context', 'column-serie', 'row-serie']
  },
  tagCloud: {
    name: 'Nuage de tags',
    description: 'Nuage de mots-clés',
    directive: 'ods-tag-cloud',
    params: ['context', 'facet-name', 'max-tags', 'redirect']
  },
  subaggregation: {
    name: 'Sous-agrégation',
    description: 'Agrégations imbriquées',
    directive: 'ods-subaggregation',
    params: ['context', 'serie']
  },
  
  // Widgets de catalog
  catalogContext: {
    name: 'Contexte de catalogue',
    description: 'Contexte pour parcourir un catalogue de datasets',
    directive: 'ods-catalog-context',
    params: ['context', 'domain', 'parameters']
  },
  mostPopularDatasets: {
    name: 'Datasets populaires',
    description: 'Liste des datasets les plus populaires',
    directive: 'ods-most-popular-datasets',
    params: ['context', 'max']
  },
  mostUsedThemes: {
    name: 'Thèmes populaires',
    description: 'Thèmes les plus utilisés',
    directive: 'ods-most-used-themes',
    params: ['context', 'max']
  },
  lastDatasetsFeed: {
    name: 'Derniers datasets',
    description: 'Flux des derniers datasets ajoutés',
    directive: 'ods-last-datasets-feed',
    params: ['context', 'max']
  },
  domainStatistics: {
    name: 'Statistiques du domaine',
    description: 'Statistiques globales du domaine',
    directive: 'ods-domain-statistics',
    params: ['context']
  },
  
  // Widgets sociaux et partage
  socialButtons: {
    name: 'Boutons sociaux',
    description: 'Boutons de partage sur les réseaux sociaux',
    directive: 'ods-social-buttons',
    params: ['title', 'url', 'text']
  },
  disqus: {
    name: 'Commentaires Disqus',
    description: 'Intégration des commentaires Disqus',
    directive: 'ods-disqus',
    params: ['shortname', 'disqusidentifier', 'disqusurl']
  },
  
  // Widgets utilitaires
  spinner: {
    name: 'Indicateur de chargement',
    description: 'Spinner de chargement',
    directive: 'ods-spinner',
    params: ['loading']
  },
  picto: {
    name: 'Pictogramme',
    description: 'Icône ou pictogramme',
    directive: 'ods-picto',
    params: ['url', 'color']
  },
  toggleModel: {
    name: 'Bascule',
    description: 'Interrupteur on/off',
    directive: 'ods-toggle-model',
    params: ['model', 'value']
  },
  autoResize: {
    name: 'Redimensionnement auto',
    description: 'Ajuste automatiquement la taille',
    directive: 'ods-auto-resize',
    params: []
  },
  pageRefresh: {
    name: 'Rafraîchissement page',
    description: 'Rafraîchit la page périodiquement',
    directive: 'ods-page-refresh',
    params: ['delay']
  },
  
  // Widgets de contenu externe
  gist: {
    name: 'Gist GitHub',
    description: 'Intègre un Gist GitHub',
    directive: 'ods-gist',
    params: ['username', 'gistid']
  },
  hubspotForm: {
    name: 'Formulaire HubSpot',
    description: 'Intègre un formulaire HubSpot',
    directive: 'ods-hubspot-form',
    params: ['portalid', 'formid']
  },
  
  // Widgets géographiques
  geotooltip: {
    name: 'Infobulle géographique',
    description: 'Tooltip sur éléments géographiques',
    directive: 'ods-geotooltip',
    params: ['coords', 'delay', 'width', 'height']
  },
  
  // Widgets de schéma
  datasetSchema: {
    name: 'Schéma du dataset',
    description: 'Affiche le schéma d\'un dataset',
    directive: 'ods-dataset-schema',
    params: ['context', 'display-fields', 'display-field-names']
  },
  
  // Widgets de réutilisation
  reuses: {
    name: 'Réutilisations',
    description: 'Liste des réutilisations d\'un dataset',
    directive: 'ods-reuses',
    params: ['context']
  },
  lastReusesFeed: {
    name: 'Dernières réutilisations',
    description: 'Flux des dernières réutilisations',
    directive: 'ods-last-reuses-feed',
    params: ['context', 'max']
  },
  
  // Widgets de thèmes
  themeBoxes: {
    name: 'Boîtes de thèmes',
    description: 'Boîtes cliquables pour les thèmes',
    directive: 'ods-theme-boxes',
    params: ['context']
  },
  themePicto: {
    name: 'Pictogramme de thème',
    description: 'Icône représentant un thème',
    directive: 'ods-theme-picto',
    params: ['theme', 'size']
  },
  
  // Widgets de publication
  topPublishers: {
    name: 'Top éditeurs',
    description: 'Liste des principaux éditeurs',
    directive: 'ods-top-publishers',
    params: ['context', 'max']
  },
  
  // Widget de contexte principal
  datasetContext: {
    name: 'Contexte de dataset',
    description: 'Définit un contexte pour travailler avec un dataset',
    directive: 'ods-dataset-context',
    params: ['context', 'domain', 'dataset', 'parameters']
  }
};

// Schémas de validation étendus
const CreateWidgetSchema = z.object({
  type: z.enum(Object.keys(ODS_WIDGETS)),
  dataset: z.string(),
  domain: z.string().default('data.economie.gouv.fr'),
  theme: z.enum(['dsfr', 'classic']).default('dsfr'),
  options: z.record(z.any()).optional()
});

const GenerateDashboardSchema = z.object({
  dataset: z.string(),
  domain: z.string().default('data.economie.gouv.fr'),
  widgets: z.array(z.enum(Object.keys(ODS_WIDGETS))).optional(),
  theme: z.enum(['dsfr', 'classic']).default('dsfr')
});

// Générateur de widgets étendu
class WidgetGenerator {
  generateWidget(type, params) {
    const widget = ODS_WIDGETS[type];
    if (!widget) {
      throw new Error(`Widget non supporté: ${type}`);
    }

    const attributes = this.buildAttributes(widget, params);
    return `<${widget.directive} ${attributes}></${widget.directive}>`;
  }

  buildAttributes(widget, params) {
    const attrs = [];
    
    // Ajouter les paramètres standards
    if (params.context) attrs.push(`context="${params.context}"`);
    if (params.dataset) attrs.push(`${params.context}-dataset="${params.dataset}"`);
    if (params.domain) attrs.push(`${params.context}-domain="${params.domain}"`);
    
    // Ajouter les options spécifiques
    if (params.options) {
      Object.entries(params.options).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          if (value) attrs.push(key);
        } else if (Array.isArray(value)) {
          attrs.push(`${key}="${JSON.stringify(value)}"`);
        } else {
          attrs.push(`${key}="${value}"`);
        }
      });
    }
    
    return attrs.join(' ');
  }

  generateDSFRWrapper(content, widgetType, title) {
    return `
<div class="fr-card">
    <div class="fr-card__body">
        <div class="fr-card__content">
            <h3 class="fr-card__title">${title || ODS_WIDGETS[widgetType].name}</h3>
            <div class="fr-card__desc">
                ${content}
            </div>
        </div>
    </div>
</div>`;
  }

  generateCompletePage(params) {
    const widgets = params.widgets || ['table', 'chart', 'map', 'facets'];
    
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Dashboard ${params.dataset} - DSFR</title>
    
    <!-- CSS DSFR -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.min.css">
    <!-- CSS ODS -->
    <link rel="stylesheet" href="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.css">
    
    <style>
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
        }
        
        [data-fr-theme="dark"] .ods-widget {
            background-color: var(--background-elevated-grey);
            color: var(--text-default-grey);
        }
    </style>
</head>
<body>
    <div class="fr-header">
        <div class="fr-header__body">
            <div class="fr-container">
                <div class="fr-header__body-row">
                    <div class="fr-header__brand">
                        <p class="fr-logo">République<br>Française</p>
                    </div>
                    <div class="fr-header__service">
                        <p class="fr-header__service-title">Dashboard ${params.dataset}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <main class="fr-container fr-py-4w" ng-app="ods-widgets">
        <ods-dataset-context context="ctx" 
                            ctx-domain="${params.domain}"
                            ctx-dataset="${params.dataset}">
            
            <h1>Tableau de bord - ${params.dataset}</h1>
            
            <!-- Barre de recherche -->
            <div class="fr-search-bar fr-mb-4w">
                <ods-searchbox context="ctx" 
                               placeholder="Rechercher dans les données..."
                               button="Rechercher">
                </ods-searchbox>
            </div>
            
            <!-- Filtres -->
            <div class="fr-grid-row fr-grid-row--gutters">
                <div class="fr-col-12 fr-col-md-3">
                    <div class="fr-sidemenu">
                        <div class="fr-sidemenu__inner">
                            <h2 class="fr-h6">Filtres</h2>
                            <ods-facets context="ctx"></ods-facets>
                            <ods-clear-all-filters context="ctx" 
                                                   class="fr-btn fr-btn--secondary fr-btn--sm fr-mt-2w">
                            </ods-clear-all-filters>
                        </div>
                    </div>
                </div>
                
                <div class="fr-col-12 fr-col-md-9">
                    <!-- Résumé des filtres -->
                    <ods-filter-summary context="ctx"></ods-filter-summary>
                    
                    <!-- Widgets principaux -->
                    <div class="dashboard-grid">
                        ${widgets.map(w => this.generateWidgetSection(w, params)).join('\n')}
                    </div>
                </div>
            </div>
        </ods-dataset-context>
    </main>
    
    <footer class="fr-footer" role="contentinfo">
        <div class="fr-container">
            <div class="fr-footer__body">
                <div class="fr-footer__brand">
                    <p class="fr-logo">République<br>Française</p>
                </div>
            </div>
        </div>
    </footer>
    
    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.2/angular.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-sanitize/1.8.2/angular-sanitize.min.js"></script>
    <script src="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.module.min.js"></script>
</body>
</html>`;
  }

  generateWidgetSection(widgetType, params) {
    const widget = ODS_WIDGETS[widgetType];
    if (!widget) return '';

    const widgetHtml = this.generateWidget(widgetType, {
      context: 'ctx',
      options: params.options?.[widgetType] || {}
    });

    if (params.theme === 'dsfr') {
      return this.generateDSFRWrapper(widgetHtml, widgetType);
    }
    
    return `<div class="widget-container">${widgetHtml}</div>`;
  }
}

// Serveur MCP complet
class CompleteODSWidgetsMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'ods-widgets-complete-mcp',
        version: '2.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.generator = new WidgetGenerator();
    this.setupHandlers();
  }

  setupHandlers() {
    this.server.setToolListHandler(async () => ({
      tools: [
        {
          name: 'create_widget',
          description: 'Créer un widget ODS avec thème DSFR',
          inputSchema: {
            type: 'object',
            properties: {
              type: { 
                type: 'string', 
                enum: Object.keys(ODS_WIDGETS),
                description: 'Type de widget à créer'
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
          description: 'Lister tous les widgets ODS disponibles',
          inputSchema: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                enum: ['visualization', 'filtering', 'temporal', 'results', 'media', 'advanced', 'catalog', 'social', 'utility', 'external', 'geographic'],
                description: 'Catégorie de widgets à lister'
              }
            }
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
                description: 'Widgets à inclure dans le dashboard'
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
          name: 'get_widget_code',
          description: 'Obtenir le code HTML d\'un widget spécifique',
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
            const params = CreateWidgetSchema.parse(args);
            let html = this.generator.generateWidget(params.type, params);
            
            if (params.theme === 'dsfr') {
              html = this.generator.generateDSFRWrapper(html, params.type);
            }
            
            return {
              content: [
                {
                  type: 'text',
                  text: `Widget ${params.type} créé avec succès:\n\n\`\`\`html\n${html}\n\`\`\``
                }
              ]
            };
          }

          case 'list_widgets': {
            const widgetsList = Object.entries(ODS_WIDGETS).map(([key, widget]) => 
              `- **${key}** (${widget.directive}): ${widget.description}`
            ).join('\n');
            
            return {
              content: [
                {
                  type: 'text',
                  text: `Widgets ODS disponibles:\n\n${widgetsList}`
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
                  text: `Dashboard généré pour ${params.dataset}:\n\n\`\`\`html\n${html}\n\`\`\``
                }
              ]
            };
          }

          case 'get_widget_code': {
            const { type, context = 'ctx', options = {}, wrapped = true } = args;
            let html = this.generator.generateWidget(type, { context, options });
            
            if (wrapped) {
              html = this.generator.generateDSFRWrapper(html, type);
            }
            
            return {
              content: [
                {
                  type: 'text',
                  text: `Code du widget ${type}:\n\n\`\`\`html\n${html}\n\`\`\``
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
    console.error('MCP ODS Widgets Complete Server démarré - Version 2.0.0');
  }
}

// Démarrage du serveur
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new CompleteODSWidgetsMCPServer();
  server.run().catch(console.error);
}

export { CompleteODSWidgetsMCPServer, WidgetGenerator, ODS_WIDGETS };