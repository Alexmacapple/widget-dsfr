# CLAUDE.md

Ce fichier fournit des conseils à Claude Code (claude.ai/code) lors du travail avec le code dans ce dépôt.

## Règles de Communication
- Claude répond toujours en français
- Claude répond toujours sans emojis
- **GUIDELINE DSFR IMPORTANT** : Ne jamais utiliser d'émojis ou d'icônes dans les titres HTML (h1, h2, h3, etc.) - Règle stricte du Design System France

## Règles de Travail sur les Fichiers - CRITIQUE
- **TOUJOURS itérer sur le fichier en cours** jusqu'à ce que la tâche soit terminée
- **NE JAMAIS créer de nouveau fichier** sauf demande explicite de l'utilisateur
- **NE PAS repartir sur un nouveau fichier** tant que le travail actuel n'est pas complet
- **Utiliser Edit ou MultiEdit** pour améliorer progressivement le fichier existant
- **Si un fichier existe déjà**, TOUJOURS le modifier plutôt que d'en créer un nouveau

---

## Vue d'ensemble du Projet

### Mission Principal
Porter tous les widgets OpenDataSoft (70+) en composants DSFR, générant des fichiers HTML complets autonomes basés sur le gabarit `/Users/alex/Desktop/widget-dsfr/_old/html/widget.html`, directement intégrables dans Drupal sans développement supplémentaire.

### Architecture
- **Type** : Génération HTML pure (pas de développement Drupal)
- **Gabarit de base** : `/Users/alex/Desktop/widget-dsfr/_old/html/widget.html`
- **Identification widgets** : Format `[DATASET]-[TYPE]-[VERSION]` (ex: SIGNALCONSO-TABLE-001)
- **Connexion données** : Directe à data.economie.gouv.fr (temps réel, sans cache)
- **Sortie** : Fichiers HTML complets avec toutes les dépendances

---

## Serveurs MCP - Configuration CRITIQUE

### 4 Serveurs MCP Configurés

1. **DSFR-MCP** (Local)
   - Chemin : `/Users/alex/Desktop/MCP-DSFR/src/index.js`
   - Rôle : Génération et validation des composants DSFR
   - 208 composants disponibles

2. **ODS-Widgets MCP** (Local)
   - Chemin : `/Users/alex/Desktop/widget-dsfr/mcp-ods-widgets/server.js`
   - Rôle : Génération des 70+ widgets OpenDataSoft

3. **ODS Documentation** (Git Ingest + DeepWiki)
   - Git Ingest : `/Users/alex/Desktop/widget-dsfr/_old/git-ingest/opendatasoft-ods-widgets-8a5edab282632443.txt`
   - GitHub : https://github.com/opendatasoft/ods-widgets
   - DeepWiki : https://deepwiki.com/opendatasoft/ods-widgets

4. **Context7** (NPM)
   - Commande : `npx @upstash/context7-mcp@latest`
   - Rôle : Documentation générale et patterns Angular

### Règles MCP Obligatoires
- **Les 4 serveurs MCP doivent rester actifs pendant toute la session**
- **Ne jamais désactiver les serveurs MCP en cours de session**
- **TOUJOURS consulter le MCP DSFR avant de générer un composant**
- **Validation obligatoire des classes CSS DSFR via MCP**
- Si les serveurs ne sont pas actifs, les relancer via `.mcp.json`

### Gestion des serveurs MCP (CLI)
```bash
# Lister les serveurs configurés
claude mcp list
# Ajouter un nouveau serveur
claude mcp add <nom> <commande> [args...]
# Supprimer un serveur
claude mcp remove <nom>
# Obtenir les détails du serveur
claude mcp get <nom>
```

---

## Documents de Référence du Projet

**IMPORTANT** : Claude doit consulter ces documents quand nécessaire pour le contexte complet.

### Architecture et Configuration
1. **MCP_CONFIGURATION_COMPLETE.md** - Configuration des 4 serveurs MCP
   - Chemins exacts des serveurs
   - Configuration .mcp.json
   - Gateway MCP unifié
   
2. **ARCHITECTURE_HTML_SIMPLE.md** - Architecture de génération HTML pure
   - Structure des widgets HTML
   - Identification unique DATASET-TYPE-VERSION
   - Process de génération
   
3. **ARCHITECTURE_MICROSERVICES.md** - Architecture micro-services détaillée (5 services)
   - Services : Core, Builder, MCP-Bridge, Storage, Gateway
   - TypeScript partout
   - Ports 3000-3004

4. **IMPLEMENTATION_PLAN.md** - Plan d'implémentation sur 4 semaines
   - Sprint planning détaillé
   - Technologies et outils

### Guides et Documentation
5. **GUIDE_GENERATION_WIDGETS_HTML.md** - Guide complet de génération des widgets
   - Process obligatoire avec MCP
   - Templates HTML complets
   - Configuration par dataset
   
6. **GUIDE_DEMARRAGE_IMPLEMENTATION.md** - Guide de démarrage rapide
   - Installation et configuration
   - Test des MCP
   - Premier widget MVP

7. **GUIDE_MCP_ODS.md** - Documentation des serveurs MCP ODS
   - Configuration spécifique ODS
   - Intégration avec DSFR

8. **GUIDE_EPCT.md** - Méthode de développement structurée
   - Explorer, Planifier, Coder, Tester
   - Règles d'itération sur fichiers
   - Anti-patterns à éviter

### Spécifications et Évaluation
9. **SPECIFICATIONS_FONCTIONNELLES.md** - Spécifications détaillées (70+ widgets)
   - Liste complète des widgets
   - Personas et cas d'usage
   - Pipeline de transformation
   
10. **EVALUATION_PROJET.md** - Évaluation du projet (Score: 92/100)
    - Analyse SWOT
    - ROI estimé
    - Recommandations prioritaires
   
11. **COMPARAISON_MCP.md** - Analyse comparative des serveurs MCP
    - Couverture MCP (85% → 100%)
    - Solutions documentation ODS

### Exemples
12. **examples/signalconso-table-001.html** - Exemple de widget HTML complet
    - HTML autonome avec gabarit
    - Zone widget identifiée
    - Connexion data.economie.gouv.fr

### Documentation MCP ODS-Widgets
13. **mcp-ods-widgets/** - Documentation complète du serveur MCP
    - **ROADMAP.md** - État et roadmap du serveur MCP (70+ widgets)
    - **README-COMPLETE.md** - Liste exhaustive des widgets disponibles
    - **PLAN_INTEGRATION_WIDGETS_DSFR*.md** - Plans d'intégration DSFR
    - **server.js** - Point d'entrée du serveur MCP
    - **src/** - Code source des widgets et adaptateurs

### Documents à consulter selon le contexte
- Pour générer un widget : Lire **GUIDE_GENERATION_WIDGETS_HTML.md**
- Pour architecture globale : Lire **ARCHITECTURE_HTML_SIMPLE.md**
- Pour configuration MCP : Lire **MCP_CONFIGURATION_COMPLETE.md**
- Pour spécifications widgets : Lire **SPECIFICATIONS_FONCTIONNELLES.md**
- Pour méthode de travail : Lire **GUIDE_EPCT.md**
- Pour liste des widgets ODS : Lire **mcp-ods-widgets/README-COMPLETE.md**

---

## Datasets Disponibles (data.economie.gouv.fr)

1. **SignalConso** - Signalements consommateurs
2. **Annuaire DGCCRF** - Services déconcentrés
3. **Budget Vert** - PLF25 budget vert
4. **Tarifs Bancaires** - Comparatif CCSF
5. **Démarches Simplifiées** - Etikraine
6. **Taux de Change** - DGFIP

---

## Processus de Génération de Widget

### Étapes Obligatoires
1. **Vérification MCP DSFR** - Consulter les composants disponibles
2. **Validation des classes CSS** - Via MCP DSFR
3. **Configuration dataset** - data.economie.gouv.fr uniquement
4. **Génération HTML** - Basé sur widget.html
5. **Identification unique** - Zone widget avec ID
6. **Tests accessibilité** - RGAA AA obligatoire

### Structure d'identification
```html
<!-- DÉBUT ZONE WIDGET SIGNALCONSO-TABLE-001 -->
<div id="widget-signalconso-table-001" class="widget-container">
    <!-- Contenu du widget -->
</div>
<!-- FIN ZONE WIDGET SIGNALCONSO-TABLE-001 -->
```

---

## Stack Technique

### Frontend
- **Angular.js 1.8.2** - Pour compatibilité ODS
- **DSFR 1.14.0** - Design System France
- **ODS Widgets latest-v2** - Widgets OpenDataSoft

### Ordre de chargement CSS (CRITIQUE)
```html
1. ODS Widgets CSS
2. DSFR CSS
3. Styles personnalisés
```

### Ordre de chargement JS
```html
1. Angular.js + Angular Sanitize
2. ODS Widgets JS
3. DSFR JS (module)
```

---

## Composants DSFR Principaux

### Tables
- `fr-table` - Structure de base
- `fr-table--bordered` - Avec bordures
- `fr-table--no-scroll` - Sans scroll

### Cards
- `fr-card` - Container
- `fr-card__body` - Corps
- `fr-card__title` - Titre
- `fr-card__desc` - Description

### Forms
- `fr-search-bar` - Barre de recherche
- `fr-input` - Champ de saisie
- `fr-select` - Liste déroulante
- `fr-btn` - Boutons

### Layout
- `fr-container` - Conteneur principal
- `fr-grid-row` - Ligne de grille
- `fr-col-*` - Colonnes responsives

---

## Règles d'Accessibilité RGAA

### Obligatoire
- Labels et descriptions pour tous les éléments interactifs
- Navigation clavier complète (Tab, Enter, Espace)
- Contrastes minimum AA (4.5:1)
- Structure HTML5 sémantique
- Attributs ARIA corrects
- Focus visible

### Tests requis
- NVDA / JAWS (lecteurs d'écran)
- Navigation clavier uniquement
- Validation contraste des couleurs

---

## Workflow de Développement : EPCT (Explorer, Planifier, Coder, Tester)

Pour les tâches complexes, utilise le flux de travail structuré EPCT :

### Utilisation rapide
```bash
# Dans Claude, utilise la commande slash :
/epct [ta tâche ici]
```

### Les 4 étapes du workflow : cf GUIDE_EPCT.md
1. **Explorer** : Analyser la base de code avec des agents parallèles pour comprendre le contexte
2. **Planifier** : Créer un plan d'implémentation détaillé incluant tests et documentation
3. **Coder** : Implémenter en suivant les conventions du projet (ITÉRATION sur fichier existant)
4. **Tester** : Valider avec les tests et vérifier l'UX si nécessaire. Si tes tests révèlent des problèmes, retourne à l'étape de planification

### Points clés EPCT
- **Toujours Explorer avant de Coder** pour comprendre le contexte complet
- **Le Plan est obligatoire** pour les tâches > 50 lignes de code
- **Itérer sur le même fichier** pendant toute la phase de Codage
- **Tester = Valider** que le code fonctionne ET respecte les standards DSFR/RGAA

## Agents Spécialisés (Utilisation avec Task)

### Vue d'ensemble
4 agents spécialisés orchestrés pour automatiser la transformation de 70+ widgets ODS vers DSFR. Chaque agent correspond à une phase EPCT et peut être utilisé indépendamment ou en orchestration.

### Documentation des agents
- **Définitions détaillées** : `/agents/[nom-agent].md`
- **Orchestration complète** : `/AGENTS_ORCHESTRATION.md`

### Les 4 Agents disponibles

1. **widget-explorer** (Phase EXPLORER)
   - Mission : Explorer et analyser les widgets ODS existants
   - Capacités : Inventaire, mapping DSFR, analyse compatibilité
   - Fichier : `/agents/widget-explorer.md`
   - Usage : `Task: widget-explorer "Analyser widgets dans /mcp-ods-widgets"`

2. **widget-generator** (Phase CODER)
   - Mission : Générer widgets avec thème DSFR natif
   - Capacités : 70+ types, identification unique, connexion directe
   - Fichier : `/agents/widget-generator.md`
   - Usage : `Task: widget-generator "Créer table DSFR pour signalconso"`

3. **dsfr-validator** (Phase TESTER)
   - Mission : Valider conformité DSFR et accessibilité RGAA
   - Capacités : Validation, corrections auto, rapport détaillé
   - Fichier : `/agents/dsfr-validator.md`
   - Usage : `Task: dsfr-validator "Valider signalconso-table-001.html"`

4. **migration-assistant** (Phase PLANIFIER + Orchestration)
   - Mission : Orchestrer migration complète 70+ widgets
   - Capacités : Batch processing, tracking, templates
   - Fichier : `/agents/migration-assistant.md`
   - Usage : `Task: migration-assistant "Migrer tous widgets ODS vers DSFR"`

### Workflows d'utilisation

#### Migration unitaire
```bash
# 1. Explorer le widget
Task: widget-explorer "Analyser widget table"

# 2. Générer version DSFR
Task: widget-generator "Créer table pour signalconso"

# 3. Valider résultat
Task: dsfr-validator "Valider signalconso-table-001.html"
```

#### Migration batch (70+ widgets)
```bash
# Lance l'orchestration complète
Task: migration-assistant "Migration batch tous widgets avec parallélisation"

# Ce qui déclenche automatiquement:
# - Explorer pour inventaire
# - Generator en parallèle (3 instances)
# - Validator en continu
# - Rapport final consolidé
```

### Métriques agents
- **Explorer** : 50 widgets/heure analysés
- **Generator** : 30 widgets/heure générés
- **Validator** : 40 widgets/heure validés
- **Assistant** : Coordination de 3-4 agents parallèles

### Pertinence d'utilisation
Les agents sont **TRÈS pertinents** pour ce projet car :
- 70+ widgets à traiter = tâches répétitives idéales pour automatisation
- Validation DSFR/RGAA = critères objectifs automatisables
- Migration batch = parallélisation nécessaire
- Templates réutilisables = patterns à extraire automatiquement

---

## Ressources Externes

### Documentation Officielle
- **Widgets ODS** : https://help.opendatasoft.com/widgets/#/api/ods-widgets.directive:odsChartSerie
- **DSFR** : https://www.systeme-de-design.gouv.fr/
- **RGAA** : https://accessibilite.numerique.gouv.fr/
- **Data Source** : https://data.economie.gouv.fr

---

## Notes Importantes

- **Pas d'emojis** dans le code ou les titres HTML
- **Configuration fixe** des widgets (pas de personnalisation utilisateur)
- **Respect absolu** des composants DSFR validés MCP
- **HTML autonome** - Chaque widget est un fichier complet
- **Connexion directe** - Pas de cache, temps réel avec data.economie.gouv.fr
- **ITÉRATION OBLIGATOIRE** - Toujours améliorer le fichier existant, jamais créer de nouveaux fichiers sauf demande explicite
- **Un fichier = Une tâche complète** - Finir le travail sur un fichier avant de passer à autre chose

---

## Checklist Avant Génération

- [ ] MCP DSFR consulté et composants validés
- [ ] Classes CSS DSFR vérifiées
- [ ] Dataset configuré sur data.economie.gouv.fr
- [ ] Gabarit widget.html utilisé
- [ ] Zone widget avec ID unique
- [ ] Accessibilité RGAA validée
- [ ] Tests cross-browser effectués

---

*Ce document est la référence principale pour Claude Code sur ce projet.*
*Dernière mise à jour : Session actuelle*
*Version : 2.0*