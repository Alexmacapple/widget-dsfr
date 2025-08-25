#!/usr/bin/env node
/**
 * MCP ODS Widgets - Serveur simplifié
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Serveur MCP simplifié
async function main() {
  // Créer le serveur
  const server = new Server(
    {
      name: 'ods-widgets-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  // Définir les outils disponibles
  server.setRequestHandler('tools/list', async () => ({
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
              description: 'Type de widget'
            },
            dataset: {
              type: 'string',
              description: 'ID du dataset'
            }
          },
          required: ['type', 'dataset']
        }
      },
      {
        name: 'analyze_dataset',
        description: 'Analyser un dataset OpenDataSoft',
        inputSchema: {
          type: 'object',
          properties: {
            dataset: {
              type: 'string',
              description: 'ID du dataset'
            }
          },
          required: ['dataset']
        }
      },
      {
        name: 'generate_dashboard',
        description: 'Générer un dashboard DSFR complet',
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
              description: 'Widgets à inclure'
            }
          },
          required: ['dataset']
        }
      }
    ]
  }));

  // Gestionnaire pour les appels d'outils
  server.setRequestHandler('tools/call', async (request) => {
    const { name, arguments: args } = request.params;
    
    switch (name) {
    case 'create_widget':
      return {
        content: [
          {
            type: 'text',
            text: `Widget ${args.type} créé pour ${args.dataset}\n\n` +
                    '```html\n' +
                    generateWidget(args.type, args.dataset) +
                    '\n```'
          }
        ]
      };
        
    case 'analyze_dataset':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(analyzeDataset(args.dataset), null, 2)
          }
        ]
      };
        
    case 'generate_dashboard':
      return {
        content: [
          {
            type: 'text',
            text: `Dashboard généré pour ${args.dataset}\n\n` +
                    '```html\n' +
                    generateDashboard(args.dataset, args.widgets) +
                    '\n```'
          }
        ]
      };
        
    default:
      throw new Error(`Outil non reconnu: ${name}`);
    }
  });

  // Fonctions de génération simples
  function generateWidget(type, dataset) {
    const widgets = {
      table: `<div class="fr-table">
  <ods-table context="ctx" 
             ctx-dataset="${dataset}"
             ctx-domain="data.economie.gouv.fr">
  </ods-table>
</div>`,
      chart: `<div class="fr-card">
  <ods-chart align-month="true">
    <ods-chart-query context="ctx" ctx-dataset="${dataset}">
      <ods-chart-serie chart-type="column" function-y="COUNT" color="#0063cb">
      </ods-chart-serie>
    </ods-chart-query>
  </ods-chart>
</div>`,
      map: `<div class="fr-responsive-media">
  <ods-map context="ctx" ctx-dataset="${dataset}" location="12,46.5,2.5">
    <ods-map-layer context="ctx" color="#0063cb" display="clustered">
    </ods-map-layer>
  </ods-map>
</div>`,
      facets: `<div class="fr-sidemenu">
  <ods-facets context="ctx" ctx-dataset="${dataset}">
    <ods-facet name="categorie" disjunctive="true"></ods-facet>
  </ods-facets>
</div>`,
      kpi: `<div class="fr-tile">
  <ods-aggregation context="ctx" ctx-dataset="${dataset}" function="COUNT">
    <div class="fr-tile__body">
      <h3 class="fr-tile__title">{{ aggregation | number }}</h3>
      <p class="fr-tile__detail">Total</p>
    </div>
  </ods-aggregation>
</div>`
    };
    
    return widgets[type] || widgets.table;
  }

  function analyzeDataset(dataset) {
    // Analyse simulée pour les datasets connus
    const analyses = {
      'signalconso': {
        dataset: 'signalconso',
        title: 'SignalConso',
        fields: {
          total: 15,
          geo: 2,
          dates: 1,
          categories: 4
        },
        recommendations: [
          { widget: 'table', score: 100 },
          { widget: 'map', score: 95 },
          { widget: 'facets', score: 90 },
          { widget: 'chart', score: 85 },
          { widget: 'kpi', score: 80 }
        ]
      }
    };
    
    return analyses[dataset] || {
      dataset,
      title: dataset,
      fields: { total: 0 },
      recommendations: [{ widget: 'table', score: 100 }]
    };
  }

  function generateDashboard(dataset, widgets = ['kpi', 'chart', 'table']) {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Dashboard ${dataset} - DSFR</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.min.css">
  <link rel="stylesheet" href="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.css">
</head>
<body>
  <div class="fr-container" ng-app="ods-widgets">
    <ods-dataset-context context="ctx" 
                        ctx-domain="data.economie.gouv.fr"
                        ctx-dataset="${dataset}">
      <h1>Dashboard ${dataset}</h1>
      
      ${widgets.map(w => generateWidget(w, dataset)).join('\n      ')}
      
    </ods-dataset-context>
  </div>
  
  <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.2/angular.min.js"></script>
  <script src="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.js"></script>
  <script type="module" src="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.module.min.js"></script>
</body>
</html>`;
  }

  // Démarrer le serveur
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('MCP ODS Widgets démarré (version simplifiée)');
}

// Lancer le serveur
main().catch((error) => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});