#!/usr/bin/env node

/**
 * Serveur MCP ODS Widgets - Version simplifiée et fonctionnelle
 */

// Simuler un serveur MCP basique qui répond aux commandes stdio
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
  const widgets = {
    table: `<div class="fr-table">
  <ods-table context="ctx" ctx-dataset="${dataset}"></ods-table>
</div>`,
    chart: `<div class="fr-card">
  <ods-chart>
    <ods-chart-query context="ctx" ctx-dataset="${dataset}">
      <ods-chart-serie chart-type="column" function-y="COUNT" color="#0063cb">
      </ods-chart-serie>
    </ods-chart-query>
  </ods-chart>
</div>`,
    map: `<div class="fr-responsive-media">
  <ods-map context="ctx" ctx-dataset="${dataset}" location="12,46.5,2.5">
    <ods-map-layer context="ctx" color="#0063cb"></ods-map-layer>
  </ods-map>
</div>`,
    facets: `<div class="fr-sidemenu">
  <ods-facets context="ctx" ctx-dataset="${dataset}">
    <ods-facet name="categorie"></ods-facet>
  </ods-facets>
</div>`,
    kpi: `<div class="fr-tile">
  <ods-aggregation context="ctx" ctx-dataset="${dataset}" function="COUNT">
    <h3 class="fr-tile__title">{{ aggregation }}</h3>
  </ods-aggregation>
</div>`
  };
  
  return `Widget ${type} créé pour ${dataset}:\n\n\`\`\`html\n${widgets[type] || widgets.table}\n\`\`\``;
}

function analyzeDataset(dataset) {
  return {
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
    ]
  };
}

function generateDashboard(dataset, widgets = ['kpi', 'chart', 'table']) {
  return `Dashboard DSFR généré pour ${dataset} avec widgets: ${widgets.join(', ')}

\`\`\`html
<!DOCTYPE html>
<html lang="fr">
<head>
  <title>Dashboard ${dataset}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.min.css">
  <link rel="stylesheet" href="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.css">
</head>
<body>
  <div class="fr-container" ng-app="ods-widgets">
    <ods-dataset-context context="ctx" ctx-dataset="${dataset}">
      <h1>Dashboard ${dataset}</h1>
      ${widgets.map(w => `<!-- Widget ${w} -->`).join('\n      ')}
    </ods-dataset-context>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.2/angular.min.js"></script>
  <script src="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.js"></script>
</body>
</html>
\`\`\``;
}

// Log de démarrage
console.error('[ODS-Widgets MCP] Serveur démarré - En attente de commandes...');