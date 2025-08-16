#!/usr/bin/env node

/**
 * Script de vérification : compare les widgets documentés avec ceux intégrés dans le MCP
 */

// Widgets trouvés dans la documentation (docs/partials/api)
const DOCUMENTED_DIRECTIVES = [
  'odsAggregation',
  'odsAnalysis', 
  'odsAutoResize',
  'odsCalendar',
  'odsCatalogContext',
  'odsChart',
  'odsChartQuery',
  'odsChartSerie',
  'odsClearAllFilters',
  'odsCrossTable',
  'odsDatasetContext',
  'odsDatasetSchema',
  'odsDatetime',
  'odsDisqus',
  'odsDomainStatistics',
  'odsFacetResults',
  'odsFacets',
  'odsFilterSummary',
  'odsGauge',
  'odsGeotooltip',
  'odsGist',
  'odsHubspotForm',
  'odsInfiniteScrollResults',
  'odsLastDatasetsFeed',
  'odsLastReusesFeed',
  'odsMap',
  'odsMediaGallery',
  'odsMostPopularDatasets',
  'odsMostUsedThemes',
  'odsPageRefresh',
  'odsPaginationBlock',
  'odsPicto',
  'odsRecordImage',
  'odsResultEnumerator',
  'odsResults',
  'odsReuses',
  'odsSearchbox',
  'odsSlideshow',
  'odsSocialButtons',
  'odsSpinner',
  'odsSubaggregation',
  'odsTable',
  'odsTagCloud',
  'odsTextSearch',
  'odsThemeBoxes',
  'odsThemePicto',
  'odsTimerange',
  'odsTimescale',
  'odsToggleModel',
  'odsTopPublishers',
  'odsWidgetTooltip',
  'refineOnClick'
];

// Widgets trouvés dans src/directives
const SOURCE_DIRECTIVES = [
  'advanced-analysis',
  'advanced-results',
  'advanced-table',
  'aggregation',
  'analysis',
  'analyze',
  'auto-resize',
  'calendar',
  'catalog-context',
  'clear-all-filters',
  'cross-table',
  'dataset-context',
  'dataset-schema',
  'date-range-slider',
  'datetime',
  'disqus',
  'domain-statistics',
  'facet-results',
  'facets',
  'filter-summary',
  'gauge',
  'geo-navigation',
  'geotooltip',
  'getwidthheight',
  'gist',
  'highcharts',
  'hubspot-form',
  'infinite-scroll-results',
  'last-datasets-feed',
  'last-reuses-feed',
  'legend',
  'map-display-control',
  'map-legacy',
  'map-legend',
  'map-search-box',
  'map-tooltip',
  'map',
  'media-gallery',
  'most-popular-datasets',
  'most-used-themes',
  'page-refresh',
  'pagination-block',
  'picto',
  'pop-in',
  'record-image',
  'refine-on-click',
  'result-enumerator',
  'results',
  'reuses',
  'searchbox',
  'select',
  'simple-tabs',
  'slideshow',
  'social-buttons',
  'spinner',
  'table',
  'tag-cloud',
  'text-search',
  'theme-boxes',
  'timer',
  'timerange',
  'timescale',
  'toggle-model',
  'top-publishers',
  'twitter-timeline',
  'utils',
  'widget-tooltip'
];

// Import de notre serveur MCP
import { ODS_WIDGETS } from './src/index-ultimate.js';

console.log('=== VÉRIFICATION DE L\'INTÉGRATION DES WIDGETS ODS ===\n');

// 1. Vérifier les widgets documentés
console.log('📚 Widgets documentés dans docs/partials/api:');
console.log(`Total: ${DOCUMENTED_DIRECTIVES.length} widgets\n`);

// 2. Vérifier les widgets source
console.log('📁 Widgets dans src/directives:');
console.log(`Total: ${SOURCE_DIRECTIVES.length} fichiers\n`);

// 3. Vérifier les widgets intégrés dans le MCP
const integratedWidgets = Object.keys(ODS_WIDGETS);
console.log('✅ Widgets intégrés dans le MCP:');
console.log(`Total: ${integratedWidgets.length} widgets\n`);

// 4. Trouver les widgets manquants
console.log('🔍 ANALYSE DES WIDGETS MANQUANTS:\n');

// Widgets documentés mais non intégrés
const missingFromMCP = [];
DOCUMENTED_DIRECTIVES.forEach(widget => {
  const normalizedName = widget.replace('ods', '').replace(/^./, c => c.toLowerCase());
  const found = integratedWidgets.some(key => {
    const directive = ODS_WIDGETS[key].directive;
    return directive === `ods-${widget.replace(/([A-Z])/g, '-$1').toLowerCase().replace('ods-', '')}` ||
           directive === widget.replace(/([A-Z])/g, '-$1').toLowerCase();
  });
  if (!found) {
    missingFromMCP.push(widget);
  }
});

if (missingFromMCP.length > 0) {
  console.log('❌ Widgets documentés mais NON intégrés dans le MCP:');
  missingFromMCP.forEach(widget => console.log(`   - ${widget}`));
} else {
  console.log('✅ Tous les widgets documentés sont intégrés!');
}

// Widgets source non documentés mais potentiellement utiles
console.log('\n📋 Widgets additionnels dans le code source (non documentés):');
const additionalWidgets = SOURCE_DIRECTIVES.filter(widget => {
  const camelCase = widget.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  const odsName = 'ods' + camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  return !DOCUMENTED_DIRECTIVES.includes(odsName) && 
         !['utils', 'getwidthheight', 'analyze'].includes(widget);
});

if (additionalWidgets.length > 0) {
  console.log('Ces widgets pourraient être ajoutés:');
  additionalWidgets.forEach(widget => {
    console.log(`   - ${widget}`);
  });
}

// 5. Résumé final
console.log('\n=== RÉSUMÉ ===');
console.log(`✅ Widgets documentés intégrés: ${DOCUMENTED_DIRECTIVES.length - missingFromMCP.length}/${DOCUMENTED_DIRECTIVES.length}`);
console.log(`📊 Widgets additionnels disponibles: ${additionalWidgets.length}`);
console.log(`🎯 Total widgets dans le MCP: ${integratedWidgets.length}`);

// 6. Widgets à ajouter
if (missingFromMCP.length > 0 || additionalWidgets.length > 0) {
  console.log('\n⚠️  WIDGETS À AJOUTER AU MCP:');
  
  if (missingFromMCP.length > 0) {
    console.log('\nDepuis la documentation:');
    missingFromMCP.forEach(widget => {
      const kebabCase = widget.replace(/([A-Z])/g, '-$1').toLowerCase().replace('ods-', '');
      console.log(`  ${widget}: {
    name: '${widget.replace('ods', '')}',
    description: 'À documenter',
    directive: 'ods-${kebabCase}',
    params: []
  },`);
    });
  }
  
  if (additionalWidgets.length > 0) {
    console.log('\nDepuis le code source:');
    additionalWidgets.forEach(widget => {
      const camelCase = widget.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      const name = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
      console.log(`  ${camelCase}: {
    name: '${name.replace(/([A-Z])/g, ' $1').trim()}',
    description: 'À documenter',
    directive: 'ods-${widget}',
    params: []
  },`);
    });
  }
} else {
  console.log('\n🎉 INTÉGRATION COMPLÈTE! Tous les widgets sont présents dans le MCP.');
}

// Liste des widgets manquants identifiés
const WIDGETS_TO_ADD = {
  // Widgets avancés non intégrés
  advancedAnalysis: {
    name: 'Advanced Analysis',
    description: 'Analyse avancée des données',
    directive: 'ods-advanced-analysis'
  },
  advancedResults: {
    name: 'Advanced Results',
    description: 'Résultats avancés avec options étendues',
    directive: 'ods-advanced-results'
  },
  advancedTable: {
    name: 'Advanced Table',
    description: 'Table avancée avec fonctionnalités étendues',
    directive: 'ods-advanced-table'
  },
  analyze: {
    name: 'Analyze',
    description: 'Widget d\'analyse de données',
    directive: 'ods-analyze'
  },
  dateRangeSlider: {
    name: 'Date Range Slider',
    description: 'Sélecteur de plage de dates avec slider',
    directive: 'ods-date-range-slider'
  },
  geoNavigation: {
    name: 'Geo Navigation',
    description: 'Navigation géographique',
    directive: 'ods-geo-navigation'
  },
  highcharts: {
    name: 'Highcharts',
    description: 'Graphiques Highcharts directs',
    directive: 'ods-highcharts'
  },
  legend: {
    name: 'Legend',
    description: 'Légende pour cartes et graphiques',
    directive: 'ods-legend'
  },
  mapDisplayControl: {
    name: 'Map Display Control',
    description: 'Contrôles d\'affichage de carte',
    directive: 'ods-map-display-control'
  },
  mapLegacy: {
    name: 'Map Legacy',
    description: 'Version legacy de la carte',
    directive: 'ods-map-legacy'
  },
  mapLegend: {
    name: 'Map Legend',
    description: 'Légende de carte',
    directive: 'ods-map-legend'
  },
  mapSearchBox: {
    name: 'Map Search Box',
    description: 'Boîte de recherche sur carte',
    directive: 'ods-map-search-box'
  },
  mapTooltip: {
    name: 'Map Tooltip',
    description: 'Tooltip pour carte',
    directive: 'ods-map-tooltip'
  },
  popIn: {
    name: 'Pop In',
    description: 'Fenêtre pop-in',
    directive: 'ods-pop-in'
  },
  select: {
    name: 'Select',
    description: 'Sélecteur de valeurs',
    directive: 'ods-select'
  },
  simpleTabs: {
    name: 'Simple Tabs',
    description: 'Onglets simples',
    directive: 'ods-simple-tabs'
  },
  timer: {
    name: 'Timer',
    description: 'Minuteur/chronomètre',
    directive: 'ods-timer'
  },
  twitterTimeline: {
    name: 'Twitter Timeline',
    description: 'Timeline Twitter intégrée',
    directive: 'ods-twitter-timeline'
  }
};

console.log('\n📝 Widgets additionnels identifiés:', Object.keys(WIDGETS_TO_ADD).length);