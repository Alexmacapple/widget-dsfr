# 📂 Exemples de Widgets DSFR/ODS

Ce dossier contient des exemples de widgets et dashboards conformes au Design System France (DSFR) utilisant OpenDataSoft.

## 🌟 Exemple de Référence

### `dashboard-dgccrf-reference.html` ⭐ RECOMMANDÉ
**Dashboard complet DGCCRF** - Notre meilleure implémentation
- 1187 lignes de code professionnel
- 15 widgets ODS intégrés (charts, tables, aggregations)
- 42+ composants DSFR utilisés
- Accessibilité RGAA avec alternatives textuelles
- Graphiques multiples avec légendes détaillées
- KPIs temps réel avec tendances
- Navigation par onglets
- Responsive design complet

**Widgets inclus :**
- 📊 5 graphiques (barres, camemberts, évolution)
- 📈 4 KPIs avec tendances
- 📋 2 tableaux de données
- 🔍 Système de filtres avancés
- ♿ Accordéons d'accessibilité pour chaque graphique

## 📁 Autres Exemples

### `signalconso-dashboard-dsfr.html` ⭐ NOUVEAU
**Dashboard SignalConso complet** - Version production
- Dashboard interactif avec données temps réel
- 15+ widgets (KPIs, graphiques, carte, table)
- Connexion directe à data.economie.gouv.fr
- Filtres dynamiques et recherche
- Accordéons d'accessibilité RGAA

### `signalconso-simple-dsfr.html`
**Version simplifiée du dashboard**
- Widgets essentiels uniquement
- Idéal pour intégration rapide
- Structure épurée

### `signalconso-table-001.html`
Widget de table simple avec pagination
- Tableau des signalements
- Pagination intégrée
- Recherche basique
- 260 lignes de code

### Hiérarchie de qualité
1. **dashboard-dgccrf-reference.html** - Production-ready, exemple complet
2. **signalconso-dashboard-dsfr.html** - Dashboard SignalConso complet
3. signalconso-simple-dsfr.html - Version simplifiée
4. signalconso-table-001.html - Widget simple, bon pour débuter

## 🚀 Utilisation

### Pour démarrer avec l'exemple de référence :
```html
<!-- Ouvrir directement dans le navigateur -->
open examples/dashboard-dgccrf-reference.html

<!-- Ou servir localement -->
python3 -m http.server 8000
# Puis naviguer vers http://localhost:8000/examples/dashboard-dgccrf-reference.html
```

### Structure minimale requise :
```html
<!-- 1. Charger les CSS (ordre important) -->
<link rel="stylesheet" href="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.min.css">

<!-- 2. Charger les JS -->
<script src="angular.js"></script>
<script src="angular-sanitize.js"></script>
<script src="ods-widgets.js"></script>
<script src="dsfr.module.js"></script>

<!-- 3. Contexte ODS -->
<div ng-app="ods-widgets">
    <ods-dataset-context context="ctx" ctx-dataset="signalconso">
        <!-- Vos widgets ici -->
    </ods-dataset-context>
</div>
```

## 📊 Comparaison des exemples

| Fichier | Lignes | Widgets ODS | Composants DSFR | Accessibilité | Complexité |
|---------|--------|-------------|-----------------|---------------|------------|
| dashboard-dgccrf-reference.html | 1187 | 15 | 42+ | ⭐⭐⭐⭐⭐ | Avancée |
| signalconso-table-001.html | 260 | 2 | 10 | ⭐⭐⭐ | Simple |

## 🎯 Recommandations

- **Pour un nouveau projet** : Partir de `dashboard-dgccrf-reference.html`
- **Pour apprendre** : Commencer par `signalconso-table-001.html`
- **Pour la production** : Utiliser `dashboard-dgccrf-reference.html` comme modèle

## 📝 Notes

- Tous les exemples sont testés avec DSFR v1.14.0
- Compatible avec les dernières versions d'ODS Widgets
- Validation RGAA niveau AA
- Sans onclick, utilisant addEventListener moderne

---

*Dernière mise à jour : v1.0.0*