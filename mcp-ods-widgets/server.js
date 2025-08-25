#!/usr/bin/env node

/**
 * Serveur MCP ODS Widgets - Version intégrée avec validation DSFR
 */

import DSFRValidator from './services/dsfr-validator.js';
const dsfrValidator = new DSFRValidator();

// Serveur MCP qui répond aux commandes stdio
process.stdin.on('data', (data) => {
  const input = data.toString().trim();
  
  // Log pour debug
  console.error(`[ODS-Widgets MCP] Reçu: ${input.substring(0, 50)}...`);
  
  try {
    const request = JSON.parse(input);
    
    // Répondre selon la méthode
    if (request.method === 'initialize') {
      const response = {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: 'ods-widgets-mcp',
            version: '1.0.0'
          }
        }
      };
      console.log(JSON.stringify(response));
      
    } else if (request.method === 'initialized') {
      // Pas de réponse nécessaire
      console.error('[ODS-Widgets MCP] Initialized');
      
    } else if (request.method === 'tools/list') {
      const response = {
        jsonrpc: '2.0',
        id: request.id,
        result: {
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
        }
      };
      console.log(JSON.stringify(response));
      
    } else if (request.method === 'tools/call') {
      const { name, arguments: args } = request.params;
      let content = '';
      
      switch (name) {
      case 'create_widget':
        content = generateWidget(args.type, args.dataset);
        break;
      case 'analyze_dataset':
        content = JSON.stringify(analyzeDataset(args.dataset), null, 2);
        break;
      case 'generate_dashboard':
        content = generateDashboard(args.dataset, args.widgets);
        break;
      default:
        content = `Outil non reconnu: ${name}`;
      }
      
      const response = {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          content: [
            {
              type: 'text',
              text: content
            }
          ]
        }
      };
      console.log(JSON.stringify(response));
    }
    
  } catch (error) {
    console.error(`[ODS-Widgets MCP] Erreur: ${error.message}`);
  }
});

// Fonctions de génération
function generateWidget(type, dataset) {
  // Utiliser le DSFRValidator pour enrichir le widget avec les classes DSFR
  const widgets = {
    table: dsfrValidator.generateDSFRStructure('ods-table', {
      content: `<ods-table context="ctx" ctx-dataset="${dataset}"></ods-table>`
    }),
    chart: dsfrValidator.generateDSFRStructure('ods-chart', {
      title: `Graphique ${dataset}`,
      description: 'Visualisation des données',
      content: `<ods-chart>
    <ods-chart-query context="ctx" ctx-dataset="${dataset}">
      <ods-chart-serie chart-type="column" function-y="COUNT" color="#0063cb">
      </ods-chart-serie>
    </ods-chart-query>
  </ods-chart>`
    }),
    map: dsfrValidator.generateDSFRStructure('ods-map', {
      title: `Carte ${dataset}`,
      content: `<ods-map context="ctx" ctx-dataset="${dataset}" location="12,46.5,2.5">
    <ods-map-layer context="ctx" color="#0063cb"></ods-map-layer>
  </ods-map>`
    }),
    facets: `<div class="fr-sidemenu">
  <ods-facets context="ctx" ctx-dataset="${dataset}">
    <ods-facet name="categorie"></ods-facet>
  </ods-facets>
</div>`,
    kpi: dsfrValidator.generateDSFRStructure('ods-aggregation', {
      value: '{{ aggregation }}',
      label: 'Total',
      content: `<ods-aggregation context="ctx" ctx-dataset="${dataset}" function="COUNT"></ods-aggregation>`
    })
  };
  
  const widgetHTML = widgets[type] || widgets.table;
  
  // Valider le widget généré
  const validation = dsfrValidator.validate(widgetHTML);
  
  return `Widget ${type} créé pour ${dataset}:\n\n\`\`\`html\n${widgetHTML}\n\`\`\`\n\nValidation DSFR: ${validation.summary}`;
}

function analyzeDataset(dataset) {
  // Analyser le dataset et recommander les widgets appropriés
  const analysis = {
    dataset: dataset,
    title: dataset,
    fields: {
      total: 10,
      geo: 2,
      dates: 1,
      categories: 3
    },
    recommendations: [
      { widget: 'table', score: 100 },
      { widget: 'chart', score: 85 },
      { widget: 'facets', score: 80 }
    ],
    dsfrMappings: {}
  };
  
  // Ajouter les mappings DSFR recommandés pour chaque widget
  analysis.recommendations.forEach(rec => {
    const widgetType = `ods-${rec.widget}`;
    analysis.dsfrMappings[rec.widget] = dsfrValidator.getRecommendedClasses(widgetType);
  });
  
  return analysis;
}

function generateDashboard(dataset, widgets = ['kpi', 'chart', 'table']) {
  // Générer les widgets avec DSFR
  const widgetComponents = widgets.map(type => {
    const widgetHTML = generateWidget(type, dataset).split('```html')[1].split('```')[0];
    return `      <!-- Widget ${type.toUpperCase()} -->
      <div class="fr-col-12 ${type === 'kpi' ? 'fr-col-md-3' : 'fr-col-md-6'} fr-mb-3w">
        ${widgetHTML.trim()}
      </div>`;
  }).join('\n');
  
  const dashboardHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>Dashboard ${dataset} - DSFR</title>
  
  <!-- DSFR -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.min.css">
  
  <!-- ODS Widgets après DSFR pour priorité -->
  <link rel="stylesheet" href="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.css">
</head>
<body>
  <div class="fr-container fr-mt-4w" ng-app="ods-widgets">
    <ods-dataset-context context="ctx" 
                         ctx-dataset="${dataset}"
                         ctx-domain="data.economie.gouv.fr">
      
      <h1 class="fr-h2">Dashboard ${dataset}</h1>
      
      <div class="fr-grid-row fr-grid-row--gutters">
${widgetComponents}
      </div>
    </ods-dataset-context>
  </div>
  
  <!-- Angular et ODS Widgets -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.2/angular.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-sanitize/1.8.2/angular-sanitize.min.js"></script>
  <script src="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.js"></script>
  
  <!-- DSFR JS -->
  <script src="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.module.min.js"></script>
</body>
</html>`;
  
  // Valider le dashboard complet
  const validation = dsfrValidator.validate(dashboardHTML);
  
  return `Dashboard DSFR généré pour ${dataset} avec widgets: ${widgets.join(', ')}\n\nValidation: ${validation.summary}\n\n\`\`\`html\n${dashboardHTML}\n\`\`\``;
}

// Log de démarrage
console.error('[ODS-Widgets MCP] Serveur démarré - En attente de commandes...');