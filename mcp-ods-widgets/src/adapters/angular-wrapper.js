/**
 * Wrapper Angular pour l'encapsulation des widgets ODS
 */

export class AngularWrapper {
  constructor() {
    this.appName = 'odsWidgetApp';
    this.dependencies = ['ods-widgets'];
  }

  wrap(widgetHtml, params) {
    const { dataset, domain = 'data.economie.gouv.fr', options = {} } = params;
    
    // Créer le contexte Angular et le wrapper
    const wrappedHtml = `
<div ng-app="${this.appName}" ng-controller="WidgetController as ctrl">
  <ods-dataset-context 
    context="ctx" 
    ctx-domain="${domain}"
    ctx-dataset="${dataset}"
    ctx-apikey="{{ ctrl.apiKey }}"
    ctx-parameters="ctrl.parameters">
    
    ${widgetHtml}
    
  </ods-dataset-context>
</div>

<script>
  (function() {
    'use strict';
    
    // Créer l'application Angular si elle n'existe pas
    if (!window.angular) {
      console.error('Angular.js n\\'est pas chargé. Veuillez inclure Angular avant ce widget.');
      return;
    }
    
    // Définir ou récupérer l'application
    var app;
    try {
      app = angular.module('${this.appName}');
    } catch(e) {
      app = angular.module('${this.appName}', ${JSON.stringify(this.dependencies)});
    }
    
    // Contrôleur du widget
    app.controller('WidgetController', ['$scope', '$timeout', '$location', function($scope, $timeout, $location) {
      var ctrl = this;
      
      // Configuration initiale
      ctrl.apiKey = '${options.apiKey || ''}';
      ctrl.parameters = ${JSON.stringify(this.getInitialParameters(options))};
      
      // Fonctions utilitaires
      ctrl.updateParameter = function(key, value) {
        ctrl.parameters[key] = value;
        $scope.$apply();
      };
      
      ctrl.resetFilters = function() {
        ctrl.parameters = ${JSON.stringify(this.getInitialParameters(options))};
      };
      
      ctrl.exportData = function(format) {
        var exportUrl = 'https://${domain}/api/records/1.0/download/';
        exportUrl += '?dataset=${dataset}';
        exportUrl += '&format=' + format;
        
        // Ajouter les paramètres actuels
        Object.keys(ctrl.parameters).forEach(function(key) {
          if (ctrl.parameters[key]) {
            exportUrl += '&' + key + '=' + encodeURIComponent(ctrl.parameters[key]);
          }
        });
        
        window.open(exportUrl, '_blank');
      };
      
      // Gestion de la pagination
      ctrl.currentPage = 1;
      ctrl.pageSize = ${options.pageSize || 20};
      
      ctrl.goToPage = function(page) {
        ctrl.currentPage = page;
        ctrl.parameters['start'] = (page - 1) * ctrl.pageSize;
      };
      
      ctrl.nextPage = function() {
        ctrl.goToPage(ctrl.currentPage + 1);
      };
      
      ctrl.previousPage = function() {
        if (ctrl.currentPage > 1) {
          ctrl.goToPage(ctrl.currentPage - 1);
        }
      };
      
      // Gestion des facettes
      ctrl.toggleFacet = function(facetName, value) {
        if (!ctrl.parameters['refine.' + facetName]) {
          ctrl.parameters['refine.' + facetName] = [];
        }
        
        var index = ctrl.parameters['refine.' + facetName].indexOf(value);
        if (index > -1) {
          ctrl.parameters['refine.' + facetName].splice(index, 1);
        } else {
          ctrl.parameters['refine.' + facetName].push(value);
        }
      };
      
      // Gestion de la recherche
      ctrl.search = function(query) {
        ctrl.parameters['q'] = query;
        ctrl.currentPage = 1;
        ctrl.parameters['start'] = 0;
      };
      
      // Initialisation
      $timeout(function() {
        // Synchroniser avec l'URL si nécessaire
        ${options.syncWithUrl ? this.generateUrlSync() : ''}
        
        // Déclencher les événements DSFR
        if (window.dsfr) {
          window.dsfr.start();
        }
      }, 100);
      
      // Watch pour les changements de contexte
      $scope.$watch('ctx.parameters', function(newVal, oldVal) {
        if (newVal !== oldVal) {
          ctrl.parameters = angular.copy(newVal);
        }
      }, true);
    }]);
    
    // Bootstrap manuel si nécessaire
    if (!angular.element(document).injector()) {
      angular.element(document).ready(function() {
        angular.bootstrap(document.querySelector('[ng-app="${this.appName}"]'), ['${this.appName}']);
      });
    }
  })();
</script>`;

    return wrappedHtml;
  }

  getInitialParameters(options) {
    const params = {
      rows: options.pageSize || 20,
      start: 0,
      sort: options.defaultSort || ''
    };

    // Ajouter les filtres par défaut
    if (options.defaultFilters) {
      Object.entries(options.defaultFilters).forEach(([key, value]) => {
        params[`refine.${key}`] = value;
      });
    }

    // Ajouter la requête par défaut
    if (options.defaultQuery) {
      params.q = options.defaultQuery;
    }

    return params;
  }

  generateUrlSync() {
    return `
        // Synchroniser avec les paramètres URL
        var urlParams = $location.search();
        Object.keys(urlParams).forEach(function(key) {
          if (urlParams[key]) {
            ctrl.parameters[key] = urlParams[key];
          }
        });
        
        // Mettre à jour l'URL lors des changements
        $scope.$watch('ctrl.parameters', function(newVal) {
          $location.search(newVal);
        }, true);`;
  }

  generateModuleInitialization() {
    return `
    // Initialisation du module Angular
    (function() {
      // Vérifier si Angular est chargé
      if (typeof angular === 'undefined') {
        // Charger Angular dynamiquement
        var script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.2/angular.min.js';
        script.onload = function() {
          initializeWidget();
        };
        document.head.appendChild(script);
      } else {
        initializeWidget();
      }
      
      function initializeWidget() {
        // Vérifier si ods-widgets est chargé
        if (!angular.module('ods-widgets')) {
          var odsScript = document.createElement('script');
          odsScript.src = 'https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.js';
          odsScript.onload = function() {
            createAngularApp();
          };
          document.head.appendChild(odsScript);
        } else {
          createAngularApp();
        }
      }
      
      function createAngularApp() {
        // Créer l'application Angular
        angular.module('${this.appName}', ['ods-widgets']);
      }
    })();`;
  }
}