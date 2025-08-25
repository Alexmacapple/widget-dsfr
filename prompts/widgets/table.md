# Instructions Widget: Table

## Analyse préalable
1. **Examiner la structure** du dataset via {{SCHEMA_DATA}}
2. **Identifier les colonnes** pertinentes pour l'affichage
3. **Évaluer le volume** de données attendu
4. **Déterminer les besoins** de tri/filtrage

## Structure HTML DSFR

### Table simple
```html
<div class="fr-table" id="widget-{{DATASET}}-table">
  <table>
    <caption>{{TABLE_TITLE}}</caption>
    <thead>
      <tr>
        <th scope="col" aria-sort="none">
          <button class="fr-btn--sort" aria-label="Trier par {{COLUMN}}">
            {{COLUMN_NAME}}
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- Lignes générées dynamiquement -->
    </tbody>
  </table>
</div>
```

### Table avec défilement
```html
<div class="fr-table fr-table--no-scroll">
  <div class="fr-table__wrapper">
    <div class="fr-table__container">
      <div class="fr-table__container-inner">
        <table>
          <!-- Contenu table -->
        </table>
      </div>
    </div>
  </div>
</div>
```

## Fonctionnalités à implémenter

### 1. Colonnes (max 5-7 mobile, 8-10 desktop)
- Sélectionner les champs les plus pertinents
- Prioriser: ID, nom/titre, statut, date, montant
- Formater selon le type (date, monétaire, pourcentage)

### 2. Tri
```javascript
// Tri côté client pour <1000 lignes
const sortTable = (column, direction) => {
  data.sort((a, b) => {
    if (direction === 'asc') {
      return a[column] > b[column] ? 1 : -1;
    }
    return a[column] < b[column] ? 1 : -1;
  });
  renderTable(data);
};
```

### 3. Pagination
- Si >20 lignes: pagination obligatoire
- Si >100 lignes: sélecteur lignes/page (10, 25, 50, 100)
- Navigation: Première, Précédente, [Pages], Suivante, Dernière

### 4. Recherche/Filtres
```html
<!-- Si >50 lignes -->
<div class="fr-search-bar">
  <label class="fr-label" for="table-search">Rechercher</label>
  <input class="fr-input" type="search" id="table-search" />
  <button class="fr-btn" title="Rechercher">
    Rechercher
  </button>
</div>
```

### 5. Actions sur lignes
```html
<td>
  <button class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline"
          aria-label="Voir détails ligne {{ID}}">
    Détails
  </button>
</td>
```

## Responsive design

### Mobile (<768px)
- Afficher 3-4 colonnes max
- Masquer colonnes secondaires
- Swipe horizontal si nécessaire

### Tablette (768-1024px)
- 5-6 colonnes
- Réduire padding cellules

### Desktop (>1024px)
- Toutes colonnes pertinentes
- Actions visibles

## Accessibilité RGAA

### Obligatoire
- `<caption>` descriptif pour chaque table
- `scope="col"` sur tous les `<th>`
- `scope="row"` sur identifiants lignes
- `aria-sort` sur colonnes triables
- `aria-label` sur boutons d'action
- Navigation clavier complète

### Recommandé
- `aria-live="polite"` sur zone de résultats
- `aria-describedby` pour instructions complexes
- Annonce vocale des tris/filtres

## Optimisation performances

### <100 lignes
- Rendu direct DOM
- Tri/filtre côté client

### 100-1000 lignes
- Virtual scrolling recommandé
- Pagination côté client
- Index sur colonnes triables

### >1000 lignes
- Pagination côté serveur obligatoire
- Lazy loading des données
- Cache navigateur activé

## Formatage des données

### Dates
```javascript
new Date(value).toLocaleDateString('fr-FR')
```

### Montants
```javascript
new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR'
}).format(value)
```

### Pourcentages
```javascript
`${(value * 100).toFixed(2)} %`
```

## Export des données
```html
<button class="fr-btn fr-btn--secondary">
  <span class="fr-icon-download-line" aria-hidden="true"></span>
  Télécharger CSV
</button>
```