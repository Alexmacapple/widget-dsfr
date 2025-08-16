# Widget Builder DSFR/ODS

## Description
Système de génération automatique de widgets OpenDataSoft (70+) avec intégration native du Design System France (DSFR).

## Objectif
Porter tous les widgets OpenDataSoft en composants DSFR, générant des fichiers HTML autonomes directement intégrables dans Drupal, avec connexion temps réel à data.economie.gouv.fr.

## Architecture

### Structure du projet
```
widget/
├── agents/                 # Agents spécialisés pour automatisation
│   ├── widget-explorer.md
│   ├── widget-generator.md
│   ├── dsfr-validator.md
│   └── migration-assistant.md
├── examples/              # Exemples de widgets générés
├── mcp-ods-widgets/       # Serveur MCP pour widgets ODS
└── _old/                  # Archives (ignoré par git)
```

### Documentation principale
- **CLAUDE.md** - Instructions pour Claude Code
- **GUIDE_EPCT.md** - Méthode de développement EPCT
- **AGENTS_ORCHESTRATION.md** - Orchestration des agents
- **SPECIFICATIONS_FONCTIONNELLES.md** - Spécifications détaillées (70+ widgets)

## Technologies

### Stack technique
- **Angular.js 1.8.2** - Compatibilité ODS
- **DSFR 1.14.0** - Design System France
- **ODS Widgets latest-v2** - Widgets OpenDataSoft
- **MCP** - Model Context Protocol pour automatisation

### Serveurs MCP configurés
1. **DSFR-MCP** - Génération composants DSFR (208 composants)
2. **ODS-Widgets** - Génération widgets ODS (70+ widgets)
3. **Context7** - Documentation générale
4. **Angular-MCP** - Support Angular/Kendo UI

## Fonctionnalités

### Widgets supportés (70+)
- **Visualisation** : table, chart, map, gauge, timeline, calendar
- **Filtrage** : facets, searchbox, dateRange, multiFilter
- **Analyse** : aggregation, crossTable, analyzer, tagCloud
- **Temporel** : calendar, timeline, timerange
- **Géographique** : map, geoSearch, choropleth

### Capacités
- Génération HTML autonome
- Thème DSFR natif
- Accessibilité RGAA niveau AA
- Connexion temps réel data.economie.gouv.fr
- Identification unique par widget
- Export multi-format

## Installation

```bash
# Cloner le repository
git clone [url-du-repo]

# Installer les dépendances MCP
cd mcp-ods-widgets
npm install

# Configurer les serveurs MCP
claude mcp list
```

## Utilisation

### Générer un widget simple
```bash
# Via Claude Code avec agent
Task: widget-generator "Créer table DSFR pour signalconso"
```

### Migration batch (70+ widgets)
```bash
# Orchestration complète
Task: migration-assistant "Migration batch tous widgets"
```

## Méthode EPCT

Le projet suit la méthode EPCT :
1. **Explorer** - Analyser le contexte
2. **Planifier** - Définir l'approche
3. **Coder** - Implémenter (itération sur fichiers existants)
4. **Tester** - Valider DSFR/RGAA

## Datasets disponibles

Source : data.economie.gouv.fr
- SignalConso - Signalements consommateurs
- Annuaire DGCCRF - Services déconcentrés
- Budget Vert - PLF25 budget vert
- Tarifs Bancaires - Comparatif CCSF
- Démarches Simplifiées - Etikraine
- Taux de Change - DGFIP

## Standards

### DSFR
- Classes CSS officielles obligatoires
- Pas d'emojis dans les titres HTML
- Support mode sombre
- Composants validés via MCP

### Accessibilité RGAA
- Niveau AA minimum
- Navigation clavier complète
- Aria-labels et roles
- Contrastes 4.5:1 minimum

## Contribution

Voir CLAUDE.md pour les règles de développement :
- Toujours itérer sur fichiers existants
- Ne pas créer de nouveaux fichiers sans demande explicite
- Valider via MCP avant génération
- Tester accessibilité systématiquement

## Licence

Ministère de l'Économie

## Contact

Pour questions et support, consulter la documentation complète dans les fichiers MD du projet.