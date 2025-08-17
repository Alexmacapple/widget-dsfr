# Plan d'Implémentation - Widget Builder Pro avec MCP

## État Actuel vs Architecture Cible

### Ce qui existe déjà ✅
1. **MCP ODS Widgets** : 70+ widgets fonctionnels
2. **Gateway MCP Unifié** : Orchestration des serveurs
3. **Backend API** : Endpoints de génération
4. **Frontend Builder** : Interface drag & drop
5. **Serveurs MCP** : DSFR + Context7 configurés

### Ce qu'il faut construire 🚧

## Phase 1 : Restructuration et TypeScript (Semaine 1)

### 1.1 Migration TypeScript du Core
```typescript
// services/core-service/src/engine/widget-engine.ts
export class WidgetEngine {
  private readonly dsfr: DSFRAdapter;
  private readonly ods: ODSParser;
  
  async transform(widget: ODSWidget): Promise<DSFRComponent> {
    // Logique de transformation avec MCP
    const validated = await this.dsfr.validate(widget);
    return this.dsfr.convert(validated);
  }
}
```

### 1.2 Types et Interfaces
```typescript
// packages/types/src/widget.types.ts
export interface IWidget {
  id: string;
  type: WidgetType;
  version: string;
  config: IWidgetConfig;
  dataset: IDatasetConfig;
  
  // Méthodes du cycle de vie
  render(): HTMLElement;
  onInit?(): void;
  onDestroy?(): void;
}

export enum WidgetType {
  // Visualisation (15)
  TABLE = 'table',
  ADVANCED_TABLE = 'advancedTable',
  CHART = 'chart',
  MAP = 'map',
  GAUGE = 'gauge',
  TIMELINE = 'timeline',
  // ... 65 autres widgets
}
```

### 1.3 Structure Micro-Services
```bash
# Créer la structure
mkdir -p services/{core,builder,mcp-bridge,storage,gateway}
mkdir -p packages/{types,utils,widgets,dsfr-adapter}
mkdir -p drupal-module/{templates,js,css}
```

## Phase 2 : Module de Transformation de Données (Semaine 1-2)

### 2.1 Analyseur de Qualité
```typescript
// services/core-service/src/analyzers/data-quality.analyzer.ts
export class DataQualityAnalyzer {
  analyze(dataset: Dataset): QualityReport {
    return {
      completeness: this.checkCompleteness(dataset),
      consistency: this.checkConsistency(dataset),
      validity: this.checkValidity(dataset),
      recommendations: this.generateRecommendations(dataset)
    };
  }
  
  private checkCompleteness(dataset: Dataset): number {
    // Calcul du taux de données manquantes
    const totalCells = dataset.rows * dataset.fields.length;
    const emptyCells = this.countEmptyCells(dataset);
    return ((totalCells - emptyCells) / totalCells) * 100;
  }
}
```

### 2.2 Pipeline de Transformation
```typescript
// services/core-service/src/transformers/data-pipeline.ts
export class DataPipeline {
  private readonly steps: TransformStep[] = [
    new DeduplicationStep(),
    new NormalizationStep(),
    new GeocodingStep(),
    new EnrichmentStep()
  ];
  
  async process(data: RawData): Promise<CleanData> {
    let result = data;
    for (const step of this.steps) {
      result = await step.execute(result);
    }
    return result as CleanData;
  }
}
```

## Phase 3 : Intégration MCP Renforcée (Semaine 2)

### 3.1 Bridge MCP TypeScript
```typescript
// services/mcp-bridge/src/orchestrator.ts
export class MCPOrchestrator {
  private readonly servers = {
    dsfr: new DSFRMCPConnector(),
    ods: new ODSMCPConnector(),
    context7: new Context7Connector()
  };
  
  async generateWidget(params: WidgetParams): Promise<WidgetResult> {
    // Appel parallèle aux MCP
    const [dsfrComponent, odsWidget] = await Promise.all([
      this.servers.dsfr.generateComponent(params),
      this.servers.ods.createWidget(params)
    ]);
    
    // Fusion et validation
    return this.mergeAndValidate(dsfrComponent, odsWidget);
  }
}
```

### 3.2 Connecteur DSFR MCP
```typescript
// services/mcp-bridge/src/connectors/dsfr-mcp.connector.ts
export class DSFRMCPConnector {
  private readonly serverPath = '/Users/alex/Desktop/MCP-DSFR/src/index.js';
  
  async generateComponent(widget: Widget): Promise<DSFRComponent> {
    const response = await this.callMCP('generate_dsfr_component', {
      component_type: widget.type,
      framework: 'vanilla',
      options: widget.config
    });
    
    return this.parseResponse(response);
  }
  
  async validateAccessibility(html: string): Promise<ValidationResult> {
    return this.callMCP('check_accessibility', {
      html_code: html,
      rgaa_level: 'AA'
    });
  }
}
```

## Phase 4 : Builder Service Amélioré (Semaine 2-3)

### 4.1 Mode Développeur
```typescript
// services/builder-service/src/modes/developer/code-editor.ts
export class CodeEditor {
  private monaco: Monaco.Editor;
  private preview: PreviewEngine;
  
  constructor() {
    this.setupMonaco();
    this.setupLiveReload();
  }
  
  private setupMonaco(): void {
    this.monaco = monaco.editor.create(container, {
      language: 'html',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: true },
      suggestions: this.getDSFRSuggestions()
    });
  }
  
  private getDSFRSuggestions(): CompletionItem[] {
    // Suggestions intelligentes basées sur DSFR MCP
    return this.dsfr.getComponentSuggestions();
  }
}
```

### 4.2 Mode Chef de Projet
```typescript
// services/builder-service/src/modes/manager/visual-builder.ts
export class VisualBuilder {
  private readonly wizard: ConfigWizard;
  private readonly templates: TemplateLibrary;
  
  startWizard(dataset: Dataset): void {
    // Guide pas à pas
    this.wizard.steps = [
      new DatasetAnalysisStep(),
      new WidgetSelectionStep(),
      new ConfigurationStep(),
      new PreviewStep(),
      new ExportStep()
    ];
    
    this.wizard.start();
  }
}
```

## Phase 5 : Tests sur 5 Datasets Pilotes (Semaine 3)

### 5.1 Configuration des Tests
```typescript
// tests/integration/datasets.test.ts
describe('Dataset Integration Tests', () => {
  const datasets = [
    { name: 'SignalConso', records: 150000, type: 'transactional' },
    { name: 'Budget Vert', records: 5000, type: 'analytical' },
    { name: 'Annuaire DGCCRF', records: 500, type: 'reference' },
    { name: 'Tarifs Bancaires', records: 10000, type: 'comparative' },
    { name: 'CSV Custom', records: 'variable', type: 'user' }
  ];
  
  datasets.forEach(dataset => {
    test(`should handle ${dataset.name} dataset`, async () => {
      const result = await builder.import(dataset);
      expect(result.success).toBe(true);
      expect(result.widgets.length).toBeGreaterThan(0);
      expect(result.performance).toBeLessThan(3000); // < 3s
    });
  });
});
```

### 5.2 Validation RGAA
```typescript
// tests/accessibility/rgaa.test.ts
describe('RGAA Compliance', () => {
  test('should pass AA level for all widgets', async () => {
    for (const widget of ALL_WIDGETS) {
      const html = await builder.generate(widget);
      const validation = await dsfr.checkAccessibility(html, 'AA');
      
      expect(validation.score).toBeGreaterThan(90);
      expect(validation.criticalErrors).toHaveLength(0);
    }
  });
});
```

## Phase 6 : Module Drupal (Semaine 3-4)

### 6.1 Module PHP
```php
// drupal-module/widget_builder_dsfr.module
<?php

/**
 * Implements hook_preprocess_page().
 */
function widget_builder_dsfr_preprocess_page(&$variables) {
  // Angular et DSFR déjà chargés par Drupal
  
  // Ajouter uniquement le renderer optimisé
  $variables['#attached']['library'][] = 'widget_builder_dsfr/renderer';
  
  // Configuration des widgets
  $variables['#attached']['drupalSettings']['widgetBuilder'] = [
    'apiEndpoint' => 'http://localhost:3000/api',
    'datasets' => widget_builder_dsfr_get_datasets(),
    'widgets' => widget_builder_dsfr_get_widgets()
  ];
}

/**
 * Render un widget dans un template
 */
function widget_builder_dsfr_render($type, $dataset, $config = []) {
  return [
    '#type' => 'widget_builder',
    '#widget_type' => $type,
    '#dataset' => $dataset,
    '#config' => $config,
    '#theme' => 'widget_builder_widget'
  ];
}
```

### 6.2 Template Twig
```twig
{# templates/widget-builder-widget.html.twig #}
<div class="widget-builder-container"
     data-widget="{{ widget_type }}"
     data-dataset="{{ dataset }}"
     data-config='{{ config|json_encode }}'>
  
  {# Le widget sera rendu ici par Angular #}
  <ods-dataset-context 
    context="ctx" 
    ctx-domain="{{ dataset.domain }}"
    ctx-dataset="{{ dataset.id }}">
    
    {# Injection dynamique du widget #}
    <{{ widget_type }} context="ctx" {{ config|raw }}></{{ widget_type }}>
    
  </ods-dataset-context>
</div>
```

## Phase 7 : Documentation et Déploiement (Semaine 4)

### 7.1 Documentation API
```typescript
// docs/api/README.md
/**
 * # Widget Builder Pro API
 * 
 * ## Endpoints
 * 
 * ### POST /api/generate/widget
 * Génère un widget unique
 * 
 * Body:
 * ```json
 * {
 *   "type": "table",
 *   "dataset": "signalconso",
 *   "config": {
 *     "limit": 20,
 *     "sort": "-date_creation"
 *   }
 * }
 * ```
 * 
 * Response:
 * ```json
 * {
 *   "html": "<div class='fr-table'>...</div>",
 *   "css": "...",
 *   "js": "...",
 *   "accessibility": { "score": 95, "level": "AA" }
 * }
 * ```
 */
```

### 7.2 Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  gateway:
    build: ./services/gateway
    ports:
      - "3000:3000"
    depends_on:
      - core
      - builder
      - mcp-bridge
      - storage
  
  core:
    build: ./services/core-service
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
  
  builder:
    build: ./services/builder-service
    ports:
      - "3002:3002"
  
  mcp-bridge:
    build: ./services/mcp-bridge
    ports:
      - "3003:3003"
    volumes:
      - /Users/alex/Desktop/MCP-DSFR:/mcp/dsfr
      - /Users/alex/Desktop/widget-dsfr/mcp-ods-widgets:/mcp/ods
  
  storage:
    build: ./services/storage-service
    ports:
      - "3004:3004"
    depends_on:
      - redis
  
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
```

## Commandes de Développement

```bash
# Installation globale
npm install -g lerna typescript @angular/cli

# Setup du workspace
npm init -w
lerna init

# Installation des dépendances
lerna bootstrap

# Build de tous les services
lerna run build

# Lancement en développement
docker-compose up -d
lerna run dev --parallel

# Tests
lerna run test
npm run test:e2e

# Build production
lerna run build:prod
docker build -t widget-builder-pro .

# Déploiement
docker push widget-builder-pro
kubectl apply -f k8s/
```

## Métriques de Succès

### Performance
- ✅ Génération < 100ms par widget
- ✅ Support 100k+ enregistrements
- ✅ Preview temps réel < 50ms

### Qualité
- ✅ TypeScript strict mode
- ✅ Coverage > 80%
- ✅ RGAA AA sur tous les widgets

### Adoption
- ✅ 70+ widgets disponibles
- ✅ 5 datasets testés
- ✅ Documentation complète

## Prochaines Actions Immédiates

1. **Aujourd'hui** : Setup TypeScript et structure micro-services
2. **Demain** : Migration du core en TypeScript
3. **J+2** : Intégration MCP renforcée
4. **J+3** : Tests sur SignalConso
5. **J+4** : Extension aux 4 autres datasets

---

*Plan d'implémentation Widget Builder Pro*
*Architecture micro-services • TypeScript • 70+ widgets • MCP natif*