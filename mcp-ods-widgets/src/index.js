#!/usr/bin/env node
/**
 * MCP ODS Widgets - Serveur principal
 * Intégration des widgets OpenDataSoft avec le Design System France
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// Import des modules
import { TableWidget } from './widgets/table.widget.js';
import { ChartWidget } from './widgets/chart.widget.js';
import { MapWidget } from './widgets/map.widget.js';
import { FacetsWidget } from './widgets/facets.widget.js';
import { KpiWidget } from './widgets/kpi.widget.js';
import { DSFRThemeAdapter } from './adapters/dsfr-theme.adapter.js';
import { AngularWrapper } from './adapters/angular-wrapper.js';
import { DatasetAnalyzer } from './utils/dataset-analyzer.js';
import { WidgetRecommender } from './utils/widget-recommender.js';

// Schémas de validation
const CreateWidgetSchema = z.object({
  type: z.enum(['table', 'chart', 'map', 'facets', 'kpi', 'timeline', 'calendar']),
  dataset: z.string(),
  domain: z.string().default('data.economie.gouv.fr'),
  theme: z.enum(['dsfr', 'classic']).default('dsfr'),
  options: z.object({
    pagination: z.boolean().optional(),
    search: z.boolean().optional(),
    export: z.boolean().optional(),
    filters: z.array(z.string()).optional(),
    responsive: z.boolean().default(true)
  }).optional()
});

const AnalyzeDatasetSchema = z.object({
  dataset: z.string(),
  domain: z.string().default('data.economie.gouv.fr')
});

const GenerateTemplateSchema = z.object({
  templateName: z.enum(['dashboard', 'search', 'detail', 'comparison']),
  dataset: z.string(),
  widgets: z.array(z.string()).optional()
});

// Gestionnaire de widgets
class WidgetManager {
  constructor() {
    this.widgets = {
      table: new TableWidget(),
      chart: new ChartWidget(),
      map: new MapWidget(),
      facets: new FacetsWidget(),
      kpi: new KpiWidget()
    };
    this.themeAdapter = new DSFRThemeAdapter();
    this.angularWrapper = new AngularWrapper();
    this.analyzer = new DatasetAnalyzer();
    this.recommender = new WidgetRecommender();
  }

  async createWidget(params) {
    const widget = this.widgets[params.type];
    if (!widget) {
      throw new Error(`Type de widget non supporté: ${params.type}`);
    }

    // Génération du code du widget
    let code = await widget.generate(params);

    // Application du thème DSFR si demandé
    if (params.theme === 'dsfr') {
      code = this.themeAdapter.apply(code, params.type);
    }

    // Encapsulation Angular
    code = this.angularWrapper.wrap(code, params);

    return {
      html: code,
      type: params.type,
      dataset: params.dataset,
      theme: params.theme
    };
  }

  async analyzeDataset(params) {
    const analysis = await this.analyzer.analyze(params.dataset, params.domain);
    const recommendations = this.recommender.recommend(analysis);
    
    return {
      analysis,
      recommendations,
      dataset: params.dataset
    };
  }

  async generateTemplate(params) {
    const templates = {
      dashboard: this.generateDashboardTemplate,
      search: this.generateSearchTemplate,
      detail: this.generateDetailTemplate,
      comparison: this.generateComparisonTemplate
    };

    const generator = templates[params.templateName];
    if (!generator) {
      throw new Error(`Template non supporté: ${params.templateName}`);
    }

    return generator.call(this, params);
  }

  generateDashboardTemplate(params) {
    const widgets = params.widgets || ['kpi', 'chart', 'table', 'map'];
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
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }
        
        .widget-container {
            background: var(--background-default-grey);
            border-radius: 0.5rem;
            padding: 1.5rem;
        }
    </style>
</head>
<body>
    <div class="fr-container" ng-app="ods-widgets">
        <header class="fr-header">
            <div class="fr-header__body">
                <div class="fr-container">
                    <div class="fr-header__body-row">
                        <div class="fr-header__brand">
                            <p class="fr-logo">Dashboard<br>${params.dataset}</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        
        <main class="fr-container fr-py-4w">
            <ods-dataset-context context="ctx" 
                                ctx-domain="${params.domain || 'data.economie.gouv.fr'}"
                                ctx-dataset="${params.dataset}">
                
                <h1>Tableau de bord ${params.dataset}</h1>
                
                <div class="dashboard-grid">
                    ${widgets.map(w => this.generateWidgetSection(w, params)).join('\\n')}
                </div>
            </ods-dataset-context>
        </main>
    </div>
    
    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.2/angular.min.js"></script>
    <script src="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.module.min.js"></script>
</body>
</html>`;
  }

  generateWidgetSection(widgetType, params) {
    const sections = {
      kpi: `<div class="widget-container">
                <h2>Indicateurs clés</h2>
                <ods-aggregation context="ctx" function="COUNT">
                    <div class="fr-callout">
                        <p class="fr-callout__title">{{ aggregation }}</p>
                        <p class="fr-callout__text">Enregistrements totaux</p>
                    </div>
                </ods-aggregation>
            </div>`,
      chart: `<div class="widget-container">
                <h2>Graphique</h2>
                <ods-chart align-month="true">
                    <ods-chart-query context="ctx" maxpoints="20">
                        <ods-chart-serie chart-type="column" function-y="COUNT" color="#0063cb">
                        </ods-chart-serie>
                    </ods-chart-query>
                </ods-chart>
            </div>`,
      table: `<div class="widget-container">
                <h2>Données</h2>
                <ods-table context="ctx"></ods-table>
            </div>`,
      map: `<div class="widget-container">
                <h2>Carte</h2>
                <ods-map context="ctx" location="12,46.5,2.5" basemap="jawg.light">
                    <ods-map-layer context="ctx" color="#0063cb"></ods-map-layer>
                </ods-map>
            </div>`
    };
    
    return sections[widgetType] || '';
  }

  generateSearchTemplate(params) {
    return '<!-- Template de recherche à implémenter -->';
  }

  generateDetailTemplate(params) {
    return '<!-- Template de détail à implémenter -->';
  }

  generateComparisonTemplate(params) {
    return '<!-- Template de comparaison à implémenter -->';
  }
}

// Serveur MCP
class ODSWidgetsMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'ods-widgets-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.widgetManager = new WidgetManager();
    this.setupHandlers();
  }

  setupHandlers() {
    // Outil : Créer un widget
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
                enum: ['table', 'chart', 'map', 'facets', 'kpi'],
                description: 'Type de widget à créer'
              },
              dataset: { 
                type: 'string',
                description: 'ID du dataset OpenDataSoft'
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
                properties: {
                  pagination: { type: 'boolean' },
                  search: { type: 'boolean' },
                  export: { type: 'boolean' },
                  filters: { type: 'array', items: { type: 'string' } }
                }
              }
            },
            required: ['type', 'dataset']
          }
        },
        {
          name: 'analyze_dataset',
          description: 'Analyser un dataset et recommander des widgets',
          inputSchema: {
            type: 'object',
            properties: {
              dataset: { type: 'string' },
              domain: { type: 'string', default: 'data.economie.gouv.fr' }
            },
            required: ['dataset']
          }
        },
        {
          name: 'generate_template',
          description: 'Générer un template complet DSFR avec widgets ODS',
          inputSchema: {
            type: 'object',
            properties: {
              templateName: {
                type: 'string',
                enum: ['dashboard', 'search', 'detail', 'comparison']
              },
              dataset: { type: 'string' },
              widgets: { type: 'array', items: { type: 'string' } }
            },
            required: ['templateName', 'dataset']
          }
        }
      ]
    }));

    // Gestionnaire d'appels d'outils
    this.server.setToolCallHandler(async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
        case 'create_widget': {
          const params = CreateWidgetSchema.parse(args);
          const result = await this.widgetManager.createWidget(params);
          return {
            content: [
              {
                type: 'text',
                text: `Widget ${params.type} créé avec succès pour le dataset ${params.dataset}`
              },
              {
                type: 'text',
                text: `\`\`\`html\n${result.html}\n\`\`\``
              }
            ]
          };
        }

        case 'analyze_dataset': {
          const params = AnalyzeDatasetSchema.parse(args);
          const result = await this.widgetManager.analyzeDataset(params);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }

        case 'generate_template': {
          const params = GenerateTemplateSchema.parse(args);
          const result = await this.widgetManager.generateTemplate(params);
          return {
            content: [
              {
                type: 'text',
                text: `Template ${params.templateName} généré pour ${params.dataset}`
              },
              {
                type: 'text',
                text: `\`\`\`html\n${result}\n\`\`\``
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
    console.error('MCP ODS Widgets démarré');
  }
}

// Démarrage du serveur
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new ODSWidgetsMCPServer();
  server.run().catch(console.error);
}

export { ODSWidgetsMCPServer, WidgetManager };