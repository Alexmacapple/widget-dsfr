# 📊 Plan d'implémentation - Widgets Graphiques DSFR

## Objectif
Créer une suite complète de widgets graphiques DSFR-compliant pour visualiser les données de data.economie.gouv.fr

## 📈 Widgets à développer (11 graphiques)

### 1. Graphiques temporels
- **chart-line-001.html** : Évolution temporelle (SignalConso par mois)
- **chart-area-001.html** : Aires empilées (catégories dans le temps)

### 2. Graphiques de comparaison  
- **chart-bar-001.html** : Barres horizontales/verticales (régions)
- **chart-combo-001.html** : Combiné ligne + barres (tendances + volumes)

### 3. Graphiques de répartition
- **chart-pie-001.html** : Camembert classique (statuts)
- **chart-donut-001.html** : Donut avec KPI central (total au centre)
- **chart-treemap-001.html** : Treemap hiérarchique (catégories/sous-cat)

### 4. Graphiques d'analyse
- **chart-scatter-001.html** : Nuage de points (corrélations)
- **chart-heatmap-001.html** : Carte de chaleur (densité par région/mois)
- **chart-radar-001.html** : Radar multicritères (performance indicateurs)

## 🎨 Standards techniques

### Librairie de graphiques
- **Chart.js 4.4** : Léger, accessible, responsive
- Fallback SVG pour accessibilité
- Support mode sombre DSFR

### Structure HTML type
```html
<div class="fr-container">
  <div class="fr-grid-row">
    <div class="fr-col-12">
      <!-- En-tête avec titre et options -->
      <div class="fr-card">
        <div class="fr-card__body">
          <h2 class="fr-h4">Titre du graphique</h2>
          <!-- Graphique -->
          <canvas id="chart" role="img" aria-label="Description"></canvas>
          <!-- Tableau de données alternative (screen readers) -->
          <table class="fr-table sr-only">...</table>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Palette de couleurs DSFR
```javascript
const dsfr_colors = {
  primary: ['#000091', '#313178', '#484D7A'],  // Bleus
  success: ['#18753C', '#27A658', '#2DB783'],  // Verts
  error: ['#CE0500', '#E94539', '#F95C5E'],     // Rouges
  warning: ['#B34000', '#FC5D00', '#FF7638'],   // Oranges
  info: ['#0063CB', '#0088CE', '#00A9CE']       // Bleus clair
};
```

## ♿ Accessibilité RGAA

- Légendes explicites
- Tableau de données alternatif  
- Descriptions ARIA
- Contraste 4.5:1 minimum
- Navigation clavier
- Export CSV des données

## 📱 Responsive

- Adaptation mobile/tablette/desktop
- Rotation automatique des labels
- Zoom tactile sur mobile
- Légendes repliables

## 🔧 Fonctionnalités communes

- Export PNG/SVG
- Plein écran
- Filtres temporels
- Animation au chargement
- Tooltips informatifs
- Mise à jour temps réel

## 📅 Planning prévisionnel

- **Jour 1** : chart-line, chart-bar, chart-pie (3 essentiels)
- **Jour 2** : chart-donut, chart-area, chart-combo
- **Jour 3** : chart-treemap, chart-scatter, chart-heatmap
- **Jour 4** : chart-radar, tests accessibilité, optimisations

## ✅ Critères de validation

- Validation DSFR (mcp__dsfr-mcp__validate_dsfr_html)
- Test RGAA niveau AA
- Performance < 100ms rendu
- Compatible IE11+ avec polyfills
- Données depuis data.economie.gouv.fr

## 📊 Datasets disponibles

### SignalConso (principal)
- Evolution temporelle des signalements
- Répartition par catégories
- Distribution géographique
- Statuts de traitement

### Autres sources possibles
- **budget-vert** : Visualisation budgétaire
- **tarifs-bancaires** : Comparaisons tarifaires
- **taux-de-change** : Évolutions devises

## 🚀 Commandes de développement

```bash
# Créer un nouveau widget chart
npm run create:chart [nom]

# Valider DSFR compliance
npm run validate widgets/charts/[fichier].html

# Tester l'accessibilité
npm run test:a11y widgets/charts/

# Serveur de développement
npm run serve
# Puis ouvrir http://localhost:8000/widgets/charts/
```

## 📝 Notes d'implémentation

1. **Priorité à l'accessibilité** : Chaque graphique doit avoir une alternative textuelle
2. **Performance** : Limiter à 1000 points de données max par graphique
3. **Interactivité** : Zoom, pan, et filtres sans rechargement
4. **Export** : Toujours proposer CSV + image
5. **Mobile first** : Conception d'abord pour mobile

---

*Document créé le 20/08/2025 pour le projet widget-dsfr*