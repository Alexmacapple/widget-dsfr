#!/usr/bin/env node

/**
 * Serveur MCP ODS Widgets
 * Version fonctionnelle pour Claude
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Configuration du serveur
const serverInfo = {
  name: 'ods-widgets-mcp',
  version: '1.0.0'
};

const serverOptions = {
  capabilities: {
    tools: {}
  }
};

// Créer le serveur
const server = new Server(serverInfo, serverOptions);

// Enregistrer le handler pour lister les outils
server.setRequestHandler(
  { method: 'tools/list' },
  async () => ({
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
            options: {
              type: 'object',
              description: 'Options spécifiques au widget'
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
            dataset: {
              type: 'string',
              description: 'ID du dataset à analyser'
            }
          },
          required: ['dataset']
        }
      },
      {
        name: 'generate_dashboard',
        description: 'Générer un dashboard complet DSFR',
        inputSchema: {
          type: 'object',
          properties: {
            dataset: {
              type: 'string',
              description: 'ID du dataset'
            },
            widgets: {
              type: 'array',
              items: { type: 'string' },
              description: 'Liste des widgets à inclure',
              default: ['kpi', 'chart', 'table']
            }
          },
          required: ['dataset']
        }
      }
    ]
  })
);

// Enregistrer le handler pour les appels d'outils
server.setRequestHandler(
  { method: 'tools/call' },
  async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      switch (name) {
        case 'create_widget':
          return {
            content: [
              {
                type: 'text',
                text: `Widget ${args.type} créé pour le dataset ${args.dataset}`
              },
              {
                type: 'text', 
                text: '```html\n' + generateWidget(args.type, args.dataset, args.options) + '\n```'
              }
            ]
          };
          
        case 'analyze_dataset':
          const analysis = analyzeDataset(args.dataset);
          return {
            content: [
              {
                type: 'text',
                text: `Analyse du dataset ${args.dataset}:`
              },
              {
                type: 'text',
                text: '```json\n' + JSON.stringify(analysis, null, 2) + '\n```'
              }
            ]
          };
          
        case 'generate_dashboard':
          const dashboard = generateDashboard(args.dataset, args.widgets);
          return {
            content: [
              {
                type: 'text',
                text: `Dashboard DSFR généré pour ${args.dataset}`
              },
              {
                type: 'text',
                text: '```html\n' + dashboard + '\n```'
              }
            ]
          };
          
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
  }
);

// Fonctions de génération
function generateWidget(type, dataset, options = {}) {
  const widgets = {
    table: `<div class="fr-table">
  <ods-table context="ctx" 
             ctx-dataset="${dataset}"
             ctx-domain="data.economie.gouv.fr"
             ${options.pageSize ? `ctx-parameters="{'rows': ${options.pageSize}}"` : ''}>
  </ods-table>
</div>`,
    
    chart: `<div class="fr-card">
  <div class="fr-card__body">
    <ods-chart align-month="true">
      <ods-chart-query context="ctx" ctx-dataset="${dataset}">
        <ods-chart-serie 
          chart-type="${options.chartType || 'column'}"
          function-y="${options.function || 'COUNT'}"
          color="#0063cb">
        </ods-chart-serie>
      </ods-chart-query>
    </ods-chart>
  </div>
</div>`,
    
    map: `<div class="fr-responsive-media">
  <ods-map context="ctx" 
           ctx-dataset="${dataset}"
           location="${options.location || '12,46.5,2.5'}"
           basemap="${options.basemap || 'jawg.light'}">
    <ods-map-layer context="ctx" 
                   color="#0063cb"
                   display="${options.clustering !== false ? 'clustered' : 'auto'}">
    </ods-map-layer>
  </ods-map>
</div>`,
    
    facets: `<div class="fr-sidemenu">
  <div class="fr-sidemenu__inner">
    <ods-facets context="ctx" ctx-dataset="${dataset}">
      ${(options.facets || ['categorie', 'region']).map(f => 
        `<ods-facet name="${f}" disjunctive="true"></ods-facet>`
      ).join('\n      ')}
    </ods-facets>
  </div>
</div>`,
    
    kpi: `<div class="fr-tile fr-tile--horizontal">
  <div class="fr-tile__body">
    <ods-aggregation context="ctx" 
                     ctx-dataset="${dataset}"
                     function="${options.function || 'COUNT'}">
      <div class="fr-tile__content">
        <h3 class="fr-tile__title">{{ aggregation | number }}</h3>
        <p class="fr-tile__detail">${options.label || 'Total'}</p>
      </div>
    </ods-aggregation>
  </div>
</div>`
  };
  
  return widgets[type] || widgets.table;
}

function analyzeDataset(dataset) {
  // Base de données des analyses
  const analyses = {
    'signalconso': {
      dataset: 'signalconso',
      title: 'SignalConso - Signalements consommateurs',
      recordsCount: 50000,
      fields: {
        total: 15,
        geo: ['latitude', 'longitude'],
        dates: ['date_creation'],
        categories: ['categorie', 'sous_categorie', 'region', 'dep'],
        text: ['nom_etablissement', 'ville', 'details'],
        numbers: []
      },
      recommendations: [
        { widget: 'table', score: 100, reason: 'Affichage détaillé des signalements' },
        { widget: 'map', score: 95, reason: 'Localisation géographique des signalements' },
        { widget: 'facets', score: 90, reason: 'Filtrage par catégorie et région' },
        { widget: 'chart', score: 85, reason: 'Evolution temporelle des signalements' },
        { widget: 'kpi', score: 80, reason: 'Indicateurs clés de performance' }
      ],
      facets: ['categorie', 'sous_categorie', 'region', 'dep', 'statut_promesse']
    },
    'plf25-budget-vert': {
      dataset: 'plf25-budget-vert',
      title: 'PLF 2025 - Budget Vert',
      recordsCount: 1500,
      fields: {
        total: 8,
        geo: [],
        dates: ['annee'],
        categories: ['mission', 'programme', 'action', 'classification'],
        text: ['libelle'],
        numbers: ['montant_ae', 'montant_cp']
      },
      recommendations: [
        { widget: 'table', score: 100, reason: 'Vue détaillée du budget' },
        { widget: 'chart', score: 95, reason: 'Visualisation des montants par programme' },
        { widget: 'kpi', score: 90, reason: 'Totaux et moyennes budgétaires' },
        { widget: 'facets', score: 85, reason: 'Filtrage par mission et programme' }
      ],
      facets: ['mission', 'programme', 'classification']
    }
  };
  
  return analyses[dataset] || {
    dataset,
    title: dataset,
    recordsCount: 0,
    fields: { total: 0, geo: [], dates: [], categories: [], text: [], numbers: [] },
    recommendations: [
      { widget: 'table', score: 100, reason: 'Widget universel pour données' }
    ],
    facets: []
  };
}

function generateDashboard(dataset, widgets = ['kpi', 'chart', 'table']) {
  const analysis = analyzeDataset(dataset);
  
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${analysis.title} - Dashboard DSFR</title>
  
  <!-- CSS DSFR -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.min.css">
  <!-- CSS ODS Widgets -->
  <link rel="stylesheet" href="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.css">
  
  <style>
    .dashboard-container { background: var(--background-default-grey); min-height: 100vh; }
    .widget-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 2rem 0; }
    .widget-box { background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .ods-map { height: 500px; }
  </style>
</head>
<body>
  <div class="fr-container dashboard-container" ng-app="ods-widgets">
    <!-- Header DSFR -->
    <header class="fr-header">
      <div class="fr-header__body">
        <div class="fr-container">
          <div class="fr-header__body-row">
            <div class="fr-header__brand">
              <p class="fr-logo">Dashboard<br>${dataset}</p>
            </div>
            <div class="fr-header__service">
              <p class="fr-header__service-title">${analysis.title}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Contenu principal -->
    <main class="fr-container fr-py-4w">
      <ods-dataset-context context="ctx" 
                          ctx-domain="data.economie.gouv.fr"
                          ctx-dataset="${dataset}">
        
        <h1>${analysis.title}</h1>
        <p class="fr-text--lg">Dashboard généré automatiquement par le MCP ODS Widgets</p>
        
        <!-- Widgets -->
        <div class="widget-grid">
          ${widgets.map(widget => {
            const options = widget === 'facets' ? { facets: analysis.facets } : {};
            return `
          <div class="widget-box">
            <h2>${getWidgetTitle(widget)}</h2>
            ${generateWidget(widget, dataset, options)}
          </div>`;
          }).join('')}
        </div>
        
        <!-- Actions -->
        <div class="fr-btns-group fr-mt-4w">
          <ods-export-file context="ctx" format="csv">
            <button class="fr-btn fr-btn--secondary">Exporter CSV</button>
          </ods-export-file>
        </div>
      </ods-dataset-context>
    </main>
  </div>
  
  <!-- Scripts -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.2/angular.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-sanitize/1.8.2/angular-sanitize.min.js"></script>
  <script src="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.js"></script>
  <script type="module" src="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.module.min.js"></script>
</body>
</html>`;
}

function getWidgetTitle(widget) {
  const titles = {
    kpi: 'Indicateurs clés',
    chart: 'Graphique',
    table: 'Tableau de données',
    map: 'Carte',
    facets: 'Filtres'
  };
  return titles[widget] || widget;
}

// Démarrer le serveur
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🚀 MCP ODS Widgets démarré avec succès');
  console.error('📊 3 outils disponibles: create_widget, analyze_dataset, generate_dashboard');
}

main().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});