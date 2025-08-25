# Exemples annotés: Widget Table

## Exemple 1: Table SignalConso simple

### Input utilisateur
```
"Créer une table des derniers signalements consommateurs avec tri et pagination"
```

### Prompt assemblé
```markdown
{{TASK_DESCRIPTION}}
{{TONE_CONTEXT}}
{{DATASET: signalconso}}
{{WIDGET_INSTRUCTIONS: table}}

User Query: Créer une table des derniers signalements consommateurs avec tri et pagination

{{OUTPUT_FORMAT: html}}
{{SAFETY_RULES}}
```

### Output attendu
```html
<!-- DÉBUT ZONE WIDGET signalconso-table-001 -->
<div id="widget-signalconso-table-001" class="widget-container fr-container">
  
  <!-- En-tête avec compteur -->
  <div class="fr-grid-row fr-grid-row--gutters fr-mb-3w">
    <div class="fr-col-12 fr-col-md-8">
      <h2>Signalements consommateurs récents</h2>
      <p class="fr-badge fr-badge--info">
        <span id="result-count">250</span> résultats
      </p>
    </div>
    <div class="fr-col-12 fr-col-md-4">
      <button class="fr-btn fr-btn--secondary fr-btn--icon-left">
        <span class="fr-icon-download-line" aria-hidden="true"></span>
        Exporter CSV
      </button>
    </div>
  </div>

  <!-- Table DSFR -->
  <div class="fr-table fr-table--bordered">
    <table id="signalconso-data-table">
      <caption>Liste des signalements consommateurs avec détails <!-- RGAA: caption obligatoire --></caption>
      <thead>
        <tr>
          <th scope="col" aria-sort="descending">
            <button class="fr-btn--sort" data-column="creation_date">
              Date
            </button>
          </th>
          <th scope="col" aria-sort="none">
            <button class="fr-btn--sort" data-column="company_name">
              Entreprise
            </button>
          </th>
          <th scope="col">Type de problème</th>
          <th scope="col">Statut</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Lignes générées dynamiquement via JavaScript -->
      </tbody>
    </table>
  </div>

  <!-- Pagination DSFR -->
  <nav class="fr-pagination" aria-label="Pagination">
    <ul class="fr-pagination__list">
      <li>
        <a class="fr-pagination__link fr-pagination__link--first" href="#" aria-label="Première page">
          Première page
        </a>
      </li>
      <li>
        <a class="fr-pagination__link fr-pagination__link--prev" href="#" aria-label="Page précédente">
          Page précédente
        </a>
      </li>
      <li>
        <a class="fr-pagination__link" aria-current="page" title="Page 1">1</a>
      </li>
      <li>
        <a class="fr-pagination__link" href="#" title="Page 2">2</a>
      </li>
      <li>
        <a class="fr-pagination__link" href="#" title="Page 3">3</a>
      </li>
      <li>
        <a class="fr-pagination__link fr-pagination__link--next" href="#" aria-label="Page suivante">
          Page suivante
        </a>
      </li>
      <li>
        <a class="fr-pagination__link fr-pagination__link--last" href="#" aria-label="Dernière page">
          Dernière page
        </a>
      </li>
    </ul>
  </nav>
</div>

<script>
// Configuration et initialisation
const tableConfig = {
  dataset: 'signalconso',
  endpoint: 'https://data.economie.gouv.fr/api/v2/catalog/datasets/signalconso/records',
  itemsPerPage: 20,
  currentPage: 1,
  sortColumn: 'creation_date',
  sortDirection: 'desc'
};

// Chargement et rendu des données
async function loadTableData() {
  const params = new URLSearchParams({
    limit: tableConfig.itemsPerPage,
    offset: (tableConfig.currentPage - 1) * tableConfig.itemsPerPage,
    order_by: `${tableConfig.sortColumn} ${tableConfig.sortDirection}`
  });

  try {
    const response = await fetch(`${tableConfig.endpoint}?${params}`);
    const data = await response.json();
    renderTableRows(data.records);
    updateResultCount(data.total_count);
  } catch (error) {
    console.error('Erreur chargement données:', error);
  }
}

// Rendu des lignes
function renderTableRows(records) {
  const tbody = document.querySelector('#signalconso-data-table tbody');
  tbody.innerHTML = records.map(record => `
    <tr>
      <td>${formatDate(record.fields.creation_date)}</td>
      <td>${escapeHtml(record.fields.company_name)}</td>
      <td>${escapeHtml(record.fields.problem_type)}</td>
      <td>
        <span class="fr-badge fr-badge--${getStatusClass(record.fields.status)}">
          ${record.fields.status}
        </span>
      </td>
      <td>
        <button class="fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left fr-btn--sm"
                onclick="viewDetails('${record.recordid}')">
          <span class="fr-icon-eye-line" aria-hidden="true"></span>
          Détails
        </button>
      </td>
    </tr>
  `).join('');
}

// Initialisation
document.addEventListener('DOMContentLoaded', loadTableData);
</script>
<!-- FIN ZONE WIDGET signalconso-table-001 -->
```

### Points clés annotés
✅ **Structure sémantique HTML5** - `<table>`, `<thead>`, `<tbody>`, `<caption>`  
✅ **Classes DSFR appliquées** - `fr-table`, `fr-table--bordered`, `fr-pagination`  
✅ **Attributs ARIA** - `scope`, `aria-sort`, `aria-label`, `aria-current`  
✅ **Pagination intégrée** - Navigation complète avec première/dernière page  
✅ **Tri des colonnes** - Boutons de tri sur Date et Entreprise  
✅ **Actions sur lignes** - Bouton "Détails" avec icône  
✅ **Export CSV** - Bouton d'export en en-tête  
❌ **Pas d'emojis** - Aucun emoji dans les titres h1-h6  
✅ **Sécurité** - Échappement HTML des données utilisateur  

---

## Exemple 2: Table avec filtres et recherche

### Input utilisateur
```
"Table des tarifs bancaires avec recherche et filtres par banque"
```

### Output annoté
```html
<!-- Section recherche et filtres -->
<div class="fr-search-bar" role="search">
  <label class="fr-label" for="table-search">
    Rechercher dans les tarifs
  </label>
  <input class="fr-input" type="search" id="table-search" 
         placeholder="Ex: carte visa, virement...">
  <button class="fr-btn" title="Rechercher">
    Rechercher
  </button>
</div>

<!-- Filtres rapides -->
<div class="fr-btns-group fr-btns-group--inline fr-mt-2w">
  <button class="fr-btn fr-btn--secondary" data-filter="all">
    Toutes les banques
  </button>
  <button class="fr-btn fr-btn--tertiary" data-filter="nationales">
    Banques nationales
  </button>
  <button class="fr-btn fr-btn--tertiary" data-filter="regionales">
    Banques régionales
  </button>
</div>
```

**Annotations:**
- 🔍 **Recherche intégrée** avec label explicite pour accessibilité
- 🏷️ **Filtres rapides** sous forme de boutons groupés DSFR
- ♿ **Role ARIA** "search" pour la zone de recherche

---

## Exemple 3: Table responsive mobile

### Configuration responsive
```javascript
// Détection mobile et adaptation
const isMobile = window.innerWidth < 768;

const mobileConfig = {
  // Colonnes prioritaires sur mobile
  visibleColumns: ['date', 'company_name', 'status'],
  
  // Swipe horizontal activé
  enableSwipe: true,
  
  // Pagination réduite
  itemsPerPage: 10,
  
  // Actions en menu déroulant
  actionsDisplay: 'dropdown'
};

// Template mobile
function renderMobileRow(record) {
  return `
    <tr>
      <td data-label="Date">${formatDate(record.date)}</td>
      <td data-label="Entreprise">
        <div class="fr-text--bold">${record.company_name}</div>
        <div class="fr-text--sm fr-text--mention-grey">
          ${record.problem_type}
        </div>
      </td>
      <td data-label="Statut">
        <span class="fr-badge fr-badge--sm fr-badge--${getStatusClass(record.status)}">
          ${record.status}
        </span>
      </td>
    </tr>
  `;
}
```

**Points d'attention mobile:**
- 📱 **3-4 colonnes max** pour lisibilité
- 👆 **Swipe horizontal** si plus de colonnes nécessaires
- 📊 **Données condensées** avec infos secondaires en sous-texte
- 📄 **10 lignes/page** pour réduire le scroll

---

## Erreurs courantes à éviter

### ❌ Mauvais exemple
```html
<!-- NE PAS FAIRE -->
<table>
  <tr>
    <td>Date</td> <!-- Pas de <thead> -->
    <td>Entreprise</td>
  </tr>
  <tr>
    <td>15/01/2024 😊</td> <!-- Emoji interdit -->
    <td style="color: red;">ACME Corp</td> <!-- Style inline -->
  </tr>
</table>
```

### ✅ Bon exemple
```html
<!-- FAIRE -->
<table class="fr-table">
  <caption>Liste des entreprises</caption>
  <thead>
    <tr>
      <th scope="col">Date</th>
      <th scope="col">Entreprise</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>15/01/2024</td>
      <td>ACME Corp</td>
    </tr>
  </tbody>
</table>
```