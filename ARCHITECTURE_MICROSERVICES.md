# Architecture Micro-Services - Widget Builder DSFR-ODS

## Vue d'Ensemble

Architecture **micro-services** avec **qualité de code** et **facilité d'utilisation** comme priorités.

```
┌──────────────────────────────────────────────────────────────┐
│                        DRUPAL CMS                             │
│  (Embarque déjà Angular 1.8, DSFR CSS, ODS Widgets)          │
└────────────────────────┬─────────────────────────────────────┘
                         │ Embed
┌────────────────────────▼─────────────────────────────────────┐
│                    WIDGET RENDERER                            │
│              (Rendu final des widgets)                        │
└────────────────────────┬─────────────────────────────────────┘
                         │ Utilise
┌────────────────────────▼─────────────────────────────────────┐
│                     API GATEWAY                               │
│                 (Point d'entrée unique)                       │
└──────┬───────────┬────────────┬────────────┬─────────────────┘
       │           │            │            │
┌──────▼────┐ ┌───▼────┐ ┌────▼────┐ ┌─────▼──────┐
│   CORE    │ │BUILDER │ │   MCP   │ │  STORAGE   │
│  SERVICE  │ │SERVICE │ │ BRIDGE  │ │  SERVICE   │
└───────────┘ └────────┘ └─────────┘ └────────────┘
```

## Services Détaillés

### 1. CORE SERVICE (Port 3001)
**Responsabilité** : Transformation ODS → DSFR et logique métier

```typescript
// Structure du service
core-service/
├── src/
│   ├── engine/
│   │   ├── widget-factory.ts      // Fabrique de widgets
│   │   ├── ods-parser.ts          // Parseur ODS
│   │   └── dsfr-converter.ts      // Convertisseur DSFR
│   ├── analyzers/
│   │   ├── dataset-analyzer.ts    // Analyse des datasets
│   │   ├── field-detector.ts      // Détection types de champs
│   │   └── recommendation.ts      // Moteur de recommandations
│   ├── widgets/
│   │   ├── registry.ts            // Registre des widgets
│   │   └── [widget-types]/        // Implémentations
│   └── api/
│       └── core.controller.ts     // API REST
```

**API Endpoints** :
- `POST /analyze` : Analyse un dataset
- `POST /transform` : Transforme ODS → DSFR
- `GET /widgets` : Liste des widgets disponibles
- `POST /recommend` : Recommande des widgets

### 2. BUILDER SERVICE (Port 3002)
**Responsabilité** : Interface utilisateur avec double mode

```typescript
// Structure du service
builder-service/
├── src/
│   ├── modes/
│   │   ├── developer/             // Mode développeur
│   │   │   ├── code-editor.ts
│   │   │   ├── live-preview.ts
│   │   │   └── debug-panel.ts
│   │   └── manager/               // Mode chef de projet
│   │       ├── visual-builder.ts
│   │       ├── wizard.ts
│   │       └── templates.ts
│   ├── shared/
│   │   ├── preview-engine.ts      // Moteur de preview
│   │   ├── code-generator.ts      // Générateur de code
│   │   └── export-manager.ts      // Export multi-format
│   └── api/
│       └── builder.controller.ts
```

**Interfaces** :
1. **Mode Développeur** : Code editor + preview + debug
2. **Mode Chef de Projet** : Wizard visuel + templates + drag&drop limité

### 3. MCP BRIDGE SERVICE (Port 3003)
**Responsabilité** : Interface avec les serveurs MCP

```typescript
// Structure du service
mcp-bridge/
├── src/
│   ├── connectors/
│   │   ├── dsfr-mcp.connector.ts
│   │   ├── ods-mcp.connector.ts
│   │   └── context7.connector.ts
│   ├── orchestrator/
│   │   ├── mcp-orchestrator.ts    // Orchestration des MCP
│   │   └── cache-manager.ts       // Cache des réponses
│   └── api/
│       └── mcp.controller.ts
```

**Stratégie MCP** :
- **Niveau 1** : Suggestions automatiques (pas de MCP)
- **Niveau 2** : Validation DSFR via MCP
- **Niveau 3** : Génération complète via MCP

### 4. STORAGE SERVICE (Port 3004)
**Responsabilité** : Persistance et gestion des configurations

```typescript
// Structure du service
storage-service/
├── src/
│   ├── repositories/
│   │   ├── widget.repository.ts
│   │   ├── config.repository.ts
│   │   └── template.repository.ts
│   ├── cache/
│   │   └── redis-cache.ts
│   └── api/
│       └── storage.controller.ts
```

### 5. API GATEWAY (Port 3000)
**Responsabilité** : Routage et orchestration

```typescript
// Configuration
{
  routes: {
    '/api/core/*': 'http://localhost:3001',
    '/api/builder/*': 'http://localhost:3002',
    '/api/mcp/*': 'http://localhost:3003',
    '/api/storage/*': 'http://localhost:3004'
  }
}
```

## Structure du Projet Global

```
widget-builder-dsfr/
│
├── 📁 services/                    # Micro-services
│   ├── 📁 core-service/
│   ├── 📁 builder-service/
│   ├── 📁 mcp-bridge/
│   ├── 📁 storage-service/
│   └── 📁 api-gateway/
│
├── 📁 packages/                    # Packages partagés
│   ├── 📁 @wbdsfr/types/          # Types TypeScript
│   ├── 📁 @wbdsfr/utils/          # Utilitaires
│   ├── 📁 @wbdsfr/widgets/        # Widgets compilés
│   └── 📁 @wbdsfr/dsfr-adapter/   # Adaptateur DSFR
│
├── 📁 drupal-module/               # Module Drupal
│   ├── widget_builder_dsfr.info.yml
│   ├── widget_builder_dsfr.module
│   └── templates/
│
├── 📁 docker/                      # Conteneurisation
│   ├── docker-compose.yml
│   └── [dockerfiles]/
│
├── 📁 docs/
├── 📁 tests/
└── 📄 package.json (workspace)
```

## Widgets Prioritaires

Basé sur l'analyse des datasets gouvernementaux, voici l'ordre de priorité :

### Phase 1 : Widgets Essentiels
1. **Table DSFR** (`ods-table`) - Le plus utilisé
2. **Graphiques** (`ods-chart`) - Visualisations
3. **Carte** (`ods-map`) - Données géographiques
4. **Facettes** (`ods-facets`) - Filtrage

### Phase 2 : Widgets Avancés
5. **KPI/Métriques** (`ods-aggregation`)
6. **Timeline** (`ods-timeline`)
7. **Calendrier** (`ods-calendar`)
8. **Export** (CSV/Excel/JSON)

### Phase 3 : Widgets Spécialisés
9. **Tag Cloud** (`ods-tag-cloud`)
10. **Gauge** (`ods-gauge`)
11. **Media Gallery** (`ods-media-gallery`)
12. **Dashboard composé**

## Intégration Drupal

### Stratégie
Drupal embarque déjà :
- ✅ Angular 1.8.2
- ✅ DSFR CSS
- ✅ ODS Widgets JS

### Module Drupal
```php
// widget_builder_dsfr.module
function widget_builder_dsfr_preprocess_page(&$variables) {
  // Injecter uniquement le widget renderer
  $variables['#attached']['library'][] = 'widget_builder_dsfr/renderer';
}
```

### Utilisation dans Drupal
```twig
{# node--article.html.twig #}
<div class="widget-container"
     data-widget-type="table"
     data-dataset="signalconso"
     data-config='{"limit": 20, "sort": "-date_creation"}'>
</div>
```

## Interfaces TypeScript

### Widget Interface
```typescript
interface IWidget {
  id: string;
  type: WidgetType;
  version: string;
  
  // Configuration
  config: IWidgetConfig;
  
  // Dataset
  dataset: IDatasetConfig;
  
  // Rendu
  render(): HTMLElement;
  
  // Lifecycle
  onInit?(): void;
  onDestroy?(): void;
  onUpdate?(data: any): void;
}

interface IWidgetConfig {
  // Commun à tous les widgets
  title?: string;
  description?: string;
  height?: string;
  width?: string;
  
  // DSFR
  dsfrTheme?: 'light' | 'dark' | 'system';
  dsfrVariant?: string;
  
  // ODS
  odsContext?: IODSContext;
  
  // Spécifique au type
  [key: string]: any;
}
```

### Dataset Interface
```typescript
interface IDatasetConfig {
  domain: string;
  id: string;
  fields?: IField[];
  filters?: IFilter[];
  sort?: string;
  limit?: number;
}

interface IField {
  name: string;
  type: 'text' | 'int' | 'double' | 'date' | 'geo_point' | 'geo_shape';
  label?: string;
  facetable?: boolean;
  sortable?: boolean;
  analyzable?: boolean;
}
```

## Stack Technique Finale

### Backend (Services)
- **Runtime** : Node.js 18+ avec TypeScript 5+
- **Framework** : Express.js (léger) ou Fastify (performance)
- **Validation** : Zod ou Joi
- **API Doc** : OpenAPI 3.0

### Frontend (Builder)
- **Framework** : Angular 1.8.2 (compatibilité ODS)
- **Bundler** : Webpack 5 avec Module Federation
- **CSS** : DSFR + PostCSS
- **Preview** : iframe sandboxé

### Infrastructure
- **Conteneurs** : Docker + Docker Compose
- **Reverse Proxy** : Nginx
- **Cache** : Redis
- **Monitoring** : Prometheus + Grafana

### Qualité Code
- **Linting** : ESLint + Prettier
- **Tests** : Jest (unit) + Playwright (E2E)
- **CI/CD** : GitHub Actions
- **Documentation** : TypeDoc + Storybook

## Métriques de Qualité

### Code
- Coverage > 80%
- Complexité cyclomatique < 10
- Pas de duplication
- TypeScript strict mode

### Performance
- Génération widget < 100ms
- Preview update < 50ms
- Bundle size < 200KB par widget

### Accessibilité
- RGAA niveau AA
- Navigation clavier
- Screen readers support

## Roadmap de Développement

### Sprint 1 (2 semaines)
- [x] Architecture et setup
- [ ] Core Service base
- [ ] Widget Table DSFR
- [ ] API Gateway

### Sprint 2 (2 semaines)
- [ ] Builder Service (mode dev)
- [ ] Widget Chart
- [ ] Tests unitaires

### Sprint 3 (2 semaines)
- [ ] MCP Bridge
- [ ] Builder (mode manager)
- [ ] Widget Map

### Sprint 4 (2 semaines)
- [ ] Module Drupal
- [ ] Documentation
- [ ] Déploiement Docker

## Questions Techniques Restantes

1. **Base de données** : Besoin d'une BDD (PostgreSQL) ou filesystem/Redis suffisant ?
2. **Authentification** : Gestion des utilisateurs nécessaire ?
3. **Versioning** : Versionner les configurations de widgets ?
4. **Multi-tenancy** : Support multi-organisations ?
5. **Offline** : Les widgets doivent-ils fonctionner hors-ligne ?

---

Cette architecture micro-services offre :
- ✅ **Qualité de code** : TypeScript strict, tests, clean architecture
- ✅ **Facilité d'utilisation** : Double interface, preview temps réel
- ✅ **Évolutivité** : Services indépendants, scalables
- ✅ **Maintenabilité** : Code modulaire, bien documenté