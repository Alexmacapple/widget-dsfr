# Widget Builder DSFR - Générateur de Widgets OpenDataSoft

## 🎯 Mission
Porter les 70+ widgets OpenDataSoft en composants conformes au Design System France (DSFR), avec génération de fichiers HTML autonomes directement intégrables dans Drupal.

## ✅ État actuel du projet

### Réalisations
- ✅ **Intégration MCP DSFR** locale (migration Docker → Local réussie)
- ✅ **Service DSFRValidator** opérationnel avec mappings ODS→DSFR
- ✅ **4 templates DSFR** créés (table, chart, map, kpi)
- ✅ **Dashboard SignalConso** fonctionnel avec 15+ widgets
- ✅ **Tests d'intégration** 5/5 réussis (score DSFR : 90-100/100)

### Architecture simplifiée
```
widget-dsfr/
├── mcp-dsfr/              # MCP DSFR local (25MB, 213 docs)
├── mcp-ods-widgets/       # MCP ODS Widgets avec DSFRValidator
├── examples/              # Dashboards et widgets fonctionnels
├── agents/                # Agents d'automatisation
└── templates/             # Templates HTML DSFR
```

## 🚀 Utilisation rapide

### Ouvrir un dashboard
```bash
open examples/signalconso-dashboard-dsfr.html
```

### Générer un widget (via Claude Code)
```bash
# Utiliser l'agent générateur
Task: widget-generator "Créer table DSFR pour signalconso"
```

## 📦 Serveurs MCP configurés

| Serveur | Status | Rôle |
|---------|--------|------|
| **dsfr-mcp** | ✅ Local | 208 composants DSFR, validation RGAA |
| **ods-widgets** | ✅ Local | 70+ widgets ODS, intégration DSFR |
| **context7** | ✅ NPM | Documentation et patterns |
| **angular-mcp** | ✅ NPM | Support Angular/Kendo UI |

## 📊 Widgets supportés (70+)

### Catégories principales
- **Visualisation** : table, chart, map, gauge, timeline
- **Filtrage** : facets, searchbox, dateRange
- **Analyse** : aggregation, crossTable, kpi
- **Export** : CSV, Excel, GeoJSON

## 🏗️ Technologies

- **Frontend** : Angular.js 1.8.2, DSFR 1.14.0, ODS Widgets v2
- **Backend** : Node.js avec Model Context Protocol (MCP)
- **Validation** : RGAA niveau AA, score DSFR 90-100/100

## 📚 Documentation essentielle

- **[CLAUDE.md](CLAUDE.md)** - Instructions pour Claude Code
- **[ARCHITECTURE_HTML_SIMPLE.md](ARCHITECTURE_HTML_SIMPLE.md)** - Architecture actuelle
- **[INTEGRATION_MCP_DSFR.md](INTEGRATION_MCP_DSFR.md)** - Guide d'intégration
- **[GUIDE_EPCT.md](GUIDE_EPCT.md)** - Méthode de développement

## 🎯 Prochaines étapes

1. Migration des 70+ widgets restants
2. Création d'une interface de génération
3. Tests d'intégration Drupal
4. Documentation utilisateur finale

## 📈 Métriques

- **Widgets portés** : 15/70+ (21%)
- **Score DSFR moyen** : 95/100
- **Performance** : Migration Docker→Local = 10x plus rapide
- **Taille optimisée** : 25MB (vs 178MB initial)

## 🔧 Configuration

Voir `.mcp.json` pour la configuration complète des serveurs MCP.

## 📝 Licence

Ministère de l'Économie, des Finances et de la Souveraineté industrielle et numérique

---

*Version 2.0 - Projet en production active*