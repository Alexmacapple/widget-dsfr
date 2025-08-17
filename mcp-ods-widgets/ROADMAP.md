# ROADMAP - Widget Builder Pro avec MCP ODS/DSFR

## Vue d'ensemble du projet

**Objectif principal** : Créer un système complet pour générer des widgets OpenDataSoft (70+) avec le thème DSFR, intégrant une architecture MCP modulaire et un builder visuel drag-and-drop.

## État actuel du projet ✅

### Composants développés

#### 1. Serveur MCP ODS Widgets (✅ Complété)
- **Fichier** : `/mcp-ods-widgets/src/index-final.js`
- **Widgets intégrés** : 70+ (52 documentés + 18 undocumented)
- **Capacités** :
  - Génération de tous les widgets ODS
  - Support complet Angular.js
  - Templates personnalisables
  - Export multi-format

#### 2. Gateway MCP Unifié (✅ Complété)
- **Fichier** : `/widget-builder-pro/mcp-gateway/unified-gateway.js`
- **Serveurs connectés** :
  - ODS Widgets (local)
  - DSFR Components (local)
  - ODS Documentation (DeepWiki/GitHub)
- **Fonctionnalités** :
  - Cache intelligent
  - Appels parallèles
  - Gestion d'erreurs robuste

#### 3. Backend API (✅ Complété)
- **Fichier** : `/widget-builder-pro/backend/server.js`
- **Endpoints** :
  - `/api/widgets` - Liste des 70+ widgets
  - `/api/generate/widget` - Génération unitaire
  - `/api/generate/dashboard` - Dashboard complet
  - `/api/analyze/dataset` - Analyse et recommandations
  - `/api/validate/accessibility` - Validation RGAA

#### 4. Interface Frontend (✅ Complété)
- **Fichiers** : 
  - `/widget-builder-pro/frontend/index.html`
  - `/widget-builder-pro/frontend/app.js`
- **Fonctionnalités** :
  - Drag & drop intuitif
  - Palette de 70+ widgets organisés
  - Panneau de propriétés dynamique
  - Prévisualisation temps réel
  - Export HTML/React/Vue

### Configuration MCP (✅ Active)
```json
{
  "mcpServers": {
    "ods-widgets": {
      "command": "node",
      "args": ["/Users/alex/Desktop/widget-dsfr/mcp-ods-widgets/src/index-final.js"]
    },
    "dsfr-mcp": {
      "command": "node",
      "args": ["/Users/alex/Desktop/MCP-DSFR/src/index.js"]
    },
    "context7": {
      "command": "npx",
      "args": ["@upstash/context7-mcp@latest"]
    }
  }
}
```

## Widgets intégrés (70+)

### Widgets documentés (52)
#### Visualisation (15)
- table, advancedTable, chart, chartSerie, map, mapLayer
- gauge, sparkline, timeline, calendar, picto
- resultEnumerator, catalogCard, mediaGallery, slideshow

#### Filtrage & Recherche (10)
- facets, facetResults, facetsV2, refineResults
- searchbox, clearAllFilters, filterSummary
- multiFilter, dateRangeSlider, geoNavigation

#### Contexte & Configuration (5)
- datasetContext, catalogContext, themeBoxes
- subscriptionButton, mostUsedThemes

#### Analyse & Agrégation (10)
- aggregation, analyzer, crossTable, table
- lastDatasetsFeed, lastReusesFeed, mostPopularDatasets
- mostPopularReuses, tagCloud, treemap

#### Temporel (5)
- calendar, dateRange, dateRangeSlider
- timeline, timerange

#### Géographique (7)
- geoSearch, geoNavigation, map, mapLayer
- choroplethMap, choroplethLegend, geoShape

### Widgets non-documentés (18)
- advancedAnalysis, advancedTable, aggregateTable
- autoComplete, chartBuilder, contextMenu
- crossDatasetQuery, dashboardBuilder, dataGrid
- dateRangeSlider, dynamicForm, exportButton
- filterBuilder, kpiBox, mediaGallery
- metadataDisplay, schemaDisplay, slideshow

## Phases de développement enrichies

### Phase 1-2 : Architecture de base (✅ COMPLÉTÉ)
- Configuration des 3 serveurs MCP
- Structure modulaire du projet
- Gateway unifié avec cache

### Phase 3 : Module de transformation de données (🚧 EN COURS)
**Objectif** : Gérer la qualité variable des données réelles

#### Analyseur de qualité
```javascript
class DataQualityAnalyzer {
  analyze(dataset) {
    return {
      completeness: checkCompleteness(),
      consistency: checkConsistency(),
      validity: checkValidity(),
      recommendations: generateRecommendations()
    };
  }
}
```

#### Pipeline de transformation
- Nettoyage automatique (doublons, valeurs manquantes)
- Normalisation des formats (dates, nombres)
- Géocodage intelligent des adresses
- Enrichissement avec colonnes calculées

### Phase 4 : Intégration données renforcée (📋 PLANIFIÉ)
**Connecteurs multiples** :
- OpenDataSoft (principal) ✅
- CSV/Excel (import local)
- API REST (endpoints JSON)
- Bases SQL (PostgreSQL, MySQL)
- APIs publiques (INSEE, IGN)

**Cache intelligent adaptatif** :
- Données de référence : 24h
- Données transactionnelles : 5min
- Données analytiques : 1h

### Phase 5-6 : Fonctionnalités avancées (📋 PLANIFIÉ)

#### Génération intelligente avec IA
- Détection sémantique des types de colonnes
- Recommandations de visualisations optimales
- Templates intelligents par type de données :
  - Géospatial → map + facets + table
  - Temporel → timeline + calendar + chart
  - Statistique → chart + gauge + aggregation

### Phase 7 : Phase pilote étendue (📋 PLANIFIÉ)
**5 Datasets de test** :

1. **SignalConso** (150k enregistrements)
   - Type : Transactionnel géolocalisé
   - Widgets : Table, Map, Facets, Timeline

2. **Budget vert PLF** (5k enregistrements)
   - Type : Analytique/Financier
   - Widgets : Chart, CrossTable, Aggregation

3. **Annuaire DGCCRF** (500 enregistrements)
   - Type : Référentiel géographique
   - Widgets : Map, Searchbox, Cards

4. **Tarifs bancaires** (10k enregistrements)
   - Type : Comparatif
   - Widgets : Table, Filters, Comparison

5. **Dataset utilisateur** (CSV/Excel)
   - Test de robustesse
   - Validation transformation

#### Protocole de test par dataset
- [ ] Import et analyse (30 min)
- [ ] Transformation si nécessaire (45 min)
- [ ] Génération de widgets (1h)
- [ ] Export et intégration (30 min)
- [ ] Validation accessibilité RGAA (30 min)

### Phase 8-10 : Tests, Documentation, Déploiement (📋 PLANIFIÉ)

#### Tests automatisés
```javascript
describe('Widget Builder Pro', () => {
  test('should handle 70+ widgets', () => {});
  test('should transform imperfect data', () => {});
  test('should pass RGAA AA criteria', () => {});
  test('should handle 1M records', () => {});
});
```

#### Documentation
- Guide d'architecture complète
- API Reference (70+ widgets)
- Tutoriels vidéo
- FAQ enrichie

#### Déploiement progressif
1. Beta privée (10 utilisateurs)
2. Beta publique (100 utilisateurs)
3. Production

## Métriques de succès

### Techniques ✅
- ✅ 70+ widgets fonctionnels
- 🚧 Transformation de données robuste
- 📋 Performance < 3s pour 100k enregistrements
- 📋 Taux de succès transformation > 95%

### Qualité
- ✅ Thème DSFR natif
- 📋 RGAA niveau AA sur tous les widgets
- 📋 Tests sur 5+ datasets réels
- 📋 Couverture tests > 80%

### Utilisateur
- ✅ Interface drag & drop intuitive
- ✅ Prévisualisation temps réel
- 📋 Satisfaction > 4/5
- 📋 Temps de prise en main < 30 min

## Planning récapitulatif

| Phase | Statut | Durée | Priorité |
|-------|--------|-------|----------|
| 1-2. Architecture & Configuration | ✅ COMPLÉTÉ | 3-4j | ⭐⭐⭐ |
| 3. Module transformation données | 🚧 EN COURS | 3-4j | ⭐⭐⭐ |
| 4. Intégration données renforcée | 📋 PLANIFIÉ | 2-3j | ⭐⭐⭐ |
| 5-6. Fonctionnalités avancées | 📋 PLANIFIÉ | 6-8j | ⭐⭐ |
| 7. Phase pilote 5 datasets | 📋 PLANIFIÉ | 5-7j | ⭐⭐⭐ |
| 8. Tests & validation | 📋 PLANIFIÉ | 3-4j | ⭐⭐⭐ |
| 9. Documentation | 📋 PLANIFIÉ | 2-3j | ⭐⭐ |
| 10. Déploiement | 📋 PLANIFIÉ | 2j | ⭐⭐ |

**Durée totale estimée** : 25-35 jours

## ROI attendu

- **Réduction temps de développement** : -70% pour créer des dashboards
- **Standardisation** : DSFR automatique sur tous les widgets
- **Accessibilité** : RGAA AA garanti par défaut
- **Réutilisabilité** : Templates pour tous les ministères

## Prochaines étapes immédiates

1. **Finaliser le module de transformation de données**
   - Implémenter DataQualityAnalyzer
   - Créer le pipeline de transformation
   - Interface de mapping visuel

2. **Lancer la phase pilote sur SignalConso**
   - Import du dataset
   - Test des 70+ widgets
   - Validation performance

3. **Étendre aux 4 autres datasets pilotes**
   - Budget vert, Annuaire DGCCRF
   - Tarifs bancaires
   - Dataset utilisateur CSV

## Risques et mitigation

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Qualité données variables | Élevé | Élevée | Module transformation robuste |
| Performance grands datasets | Moyen | Moyenne | Cache intelligent + pagination |
| Compatibilité Angular/DSFR | Moyen | Faible | Tests continus |
| Adoption utilisateurs | Moyen | Moyenne | Formation + documentation |

## Évolutions futures (V2+)

### V2.1 (3 mois)
- Intégration IA générative pour suggestions
- Marketplace de templates communautaires
- API GraphQL

### V2.2 (6 mois)
- Version SaaS multi-tenant
- Collaboration temps réel
- Versionning des dashboards

### V3.0 (12 mois)
- No-code complet
- BI intégré
- Export applications mobiles

## Ressources et contacts

- **Documentation ODS** : https://help.opendatasoft.com/widgets/
- **DSFR** : https://www.systeme-de-design.gouv.fr/
- **Datasets** : https://data.economie.gouv.fr/
- **RGAA** : https://accessibilite.numerique.gouv.fr/

---

*ROADMAP Widget Builder Pro v2.0*
*Dernière mise à jour : Décembre 2024*
*70+ widgets ODS intégrés • Thème DSFR natif • Export multi-format*