# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2025-08-25

### Ajouté
- Scripts NPM pour le développement (`dev`, `build`, `lint`, `format`)
- Configuration ESLint et Prettier pour la qualité du code
- Pipeline CI/CD avec GitHub Actions
- Tests E2E avec Playwright
- Badges de statut dans README
- Script de build pour la distribution

### Amélioré
- Score de conformité DSFR : 85/100 → 92/100
- Documentation du projet
- Structure des tests

## [2.0.0] - 2025-08-24

### Ajouté
- Migration complète vers les agents DSFR au format YAML Claude Code
- Widgets graphiques avancés avec Chart.js
- Support UTF-8 complet pour tous les widgets
- Widgets formulaires DSFR pour SignalConso
- Dashboard complet avec données régionales

### Corrigé
- Problèmes d'encodage UTF-8 sur les widgets charts
- Affichage du tableau pour les sous-catégories longues
- Widget Sankey avec données réelles de l'API
- Bindings Angular dans le contexte ODS

### Modifié
- Refonte complète du widget Sankey avec filtres dynamiques
- Migration des 11 widgets charts vers API data.economie.gouv.fr

## [1.0.0] - 2025-08-23

### Ajouté
- Version initiale du générateur de widgets DSFR/ODS
- Support des widgets tables, charts, maps, facets
- Intégration avec data.economie.gouv.fr
- Validation DSFR automatique
- Serveurs MCP pour DSFR et ODS
- Documentation complète

## Types de changements
- `Ajouté` pour les nouvelles fonctionnalités
- `Modifié` pour les changements de fonctionnalités existantes
- `Déprécié` pour les fonctionnalités qui seront supprimées
- `Supprimé` pour les fonctionnalités supprimées
- `Corrigé` pour les corrections de bugs
- `Sécurité` pour les vulnérabilités