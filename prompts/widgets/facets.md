# Instructions Widget: Facets (Filtres à facettes)

## Analyse préalable
1. **Identifier les dimensions** filtrables dans le dataset
2. **Compter les valeurs** uniques par dimension
3. **Définir la hiérarchie** des filtres si applicable
4. **Déterminer les types** de filtres (checkbox, radio, range)

## Structure HTML DSFR

### Sidebar de filtres
```html
<div class="fr-sidemenu" role="navigation" aria-label="Filtres">
  <div class="fr-sidemenu__inner">
    <button class="fr-sidemenu__btn" 
            aria-controls="fr-sidemenu-wrapper" 
            aria-expanded="false">
      Filtres
    </button>
    <div class="fr-collapse" id="fr-sidemenu-wrapper">
      <div class="fr-sidemenu__title">Filtrer les résultats</div>
      
      <!-- Nombre de résultats -->
      <div class="fr-mb-2w">
        <span class="fr-badge fr-badge--info">
          <span aria-live="polite">{{RESULT_COUNT}} résultats</span>
        </span>
      </div>
      
      <!-- Filtres actifs -->
      <div class="active-filters fr-mb-2w" aria-live="polite">
        <!-- Tags des filtres actifs -->
      </div>
      
      <!-- Sections de filtres -->
      <div class="fr-accordions-group">
        <!-- Accordéons pour chaque facette -->
      </div>
      
      <!-- Actions -->
      <div class="fr-btns-group fr-btns-group--inline">
        <button class="fr-btn" id="apply-filters">
          Appliquer les filtres
        </button>
        <button class="fr-btn fr-btn--tertiary" id="reset-filters">
          Réinitialiser
        </button>
      </div>
    </div>
  </div>
</div>
```

### Facette Checkbox (multi-sélection)
```html
<section class="fr-accordion">
  <h3 class="fr-accordion__title">
    <button class="fr-accordion__btn" 
            aria-expanded="true" 
            aria-controls="facet-{{FACET_ID}}">
      {{FACET_LABEL}} ({{FACET_COUNT}})
    </button>
  </h3>
  <div class="fr-collapse" id="facet-{{FACET_ID}}">
    <fieldset class="fr-fieldset">
      <legend class="fr-fieldset__legend fr-sr-only">
        {{FACET_LABEL}}
      </legend>
      <div class="fr-fieldset__content">
        <!-- Pour chaque valeur -->
        <div class="fr-checkbox-group">
          <input type="checkbox" 
                 id="{{FACET_ID}}-{{VALUE_ID}}" 
                 name="{{FACET_NAME}}[]"
                 value="{{VALUE}}">
          <label class="fr-label" for="{{FACET_ID}}-{{VALUE_ID}}">
            {{VALUE_LABEL}}
            <span class="fr-badge fr-badge--sm fr-ml-1w">{{COUNT}}</span>
          </label>
        </div>
      </div>
    </fieldset>
  </div>
</section>
```

### Facette Radio (mono-sélection)
```html
<section class="fr-accordion">
  <h3 class="fr-accordion__title">
    <button class="fr-accordion__btn" 
            aria-expanded="false" 
            aria-controls="facet-{{FACET_ID}}">
      {{FACET_LABEL}}
    </button>
  </h3>
  <div class="fr-collapse" id="facet-{{FACET_ID}}">
    <fieldset class="fr-fieldset">
      <legend class="fr-fieldset__legend fr-sr-only">
        {{FACET_LABEL}}
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-radio-group">
          <input type="radio" 
                 id="{{FACET_ID}}-all" 
                 name="{{FACET_NAME}}"
                 value="" 
                 checked>
          <label class="fr-label" for="{{FACET_ID}}-all">
            Tous
          </label>
        </div>
        <!-- Valeurs -->
      </div>
    </fieldset>
  </div>
</section>
```

### Facette Range (plage de valeurs)
```html
<section class="fr-accordion">
  <h3 class="fr-accordion__title">
    <button class="fr-accordion__btn">
      {{RANGE_LABEL}}
    </button>
  </h3>
  <div class="fr-collapse">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-6">
        <label class="fr-label" for="{{RANGE_ID}}-min">
          Min
        </label>
        <input class="fr-input" 
               type="number" 
               id="{{RANGE_ID}}-min"
               min="{{MIN_VALUE}}" 
               max="{{MAX_VALUE}}">
      </div>
      <div class="fr-col-6">
        <label class="fr-label" for="{{RANGE_ID}}-max">
          Max
        </label>
        <input class="fr-input" 
               type="number" 
               id="{{RANGE_ID}}-max"
               min="{{MIN_VALUE}}" 
               max="{{MAX_VALUE}}">
      </div>
    </div>
    <!-- Ou slider -->
    <div class="fr-range fr-mt-2w">
      <label class="fr-label" for="{{RANGE_ID}}-slider">
        {{RANGE_LABEL}}
      </label>
      <input type="range" 
             class="fr-range__input" 
             id="{{RANGE_ID}}-slider"
             min="{{MIN_VALUE}}" 
             max="{{MAX_VALUE}}"
             step="{{STEP}}">
      <span class="fr-range__output">{{CURRENT_VALUE}}</span>
    </div>
  </div>
</section>
```

## Logique de filtrage JavaScript

### Gestionnaire de facettes
```javascript
class FacetManager {
  constructor(data) {
    this.originalData = data;
    this.filteredData = [...data];
    this.activeFilters = {};
    this.facets = this.extractFacets();
  }
  
  // Extraction des facettes
  extractFacets() {
    const facets = {};
    
    // Pour chaque dimension
    ['category', 'status', 'type'].forEach(dimension => {
      facets[dimension] = {};
      
      this.originalData.forEach(item => {
        const value = item[dimension];
        if (value) {
          facets[dimension][value] = (facets[dimension][value] || 0) + 1;
        }
      });
    });
    
    return facets;
  }
  
  // Application des filtres
  applyFilters(filters) {
    this.activeFilters = filters;
    
    this.filteredData = this.originalData.filter(item => {
      return Object.entries(this.activeFilters).every(([key, values]) => {
        if (!values || values.length === 0) return true;
        
        // Range filter
        if (values.min !== undefined || values.max !== undefined) {
          const itemValue = item[key];
          return (!values.min || itemValue >= values.min) &&
                 (!values.max || itemValue <= values.max);
        }
        
        // Multi-value filter
        return values.includes(item[key]);
      });
    });
    
    this.updateFacetCounts();
    this.renderResults();
  }
  
  // Mise à jour des compteurs
  updateFacetCounts() {
    Object.keys(this.facets).forEach(dimension => {
      const counts = {};
      
      this.filteredData.forEach(item => {
        const value = item[dimension];
        if (value) {
          counts[value] = (counts[value] || 0) + 1;
        }
      });
      
      // Mettre à jour l'affichage
      Object.entries(counts).forEach(([value, count]) => {
        const badge = document.querySelector(
          `[data-facet="${dimension}"][data-value="${value}"] .fr-badge`
        );
        if (badge) {
          badge.textContent = count;
          badge.classList.toggle('fr-badge--no-icon', count === 0);
        }
      });
    });
  }
}
```

### Gestion des événements
```javascript
// Initialisation
const facetManager = new FacetManager(data);

// Checkboxes
document.querySelectorAll('.fr-checkbox-group input').forEach(checkbox => {
  checkbox.addEventListener('change', (e) => {
    const facet = e.target.name.replace('[]', '');
    const value = e.target.value;
    
    if (!facetManager.activeFilters[facet]) {
      facetManager.activeFilters[facet] = [];
    }
    
    if (e.target.checked) {
      facetManager.activeFilters[facet].push(value);
    } else {
      const index = facetManager.activeFilters[facet].indexOf(value);
      if (index > -1) {
        facetManager.activeFilters[facet].splice(index, 1);
      }
    }
    
    facetManager.applyFilters(facetManager.activeFilters);
  });
});

// Range inputs
document.querySelectorAll('input[type="number"], input[type="range"]').forEach(input => {
  input.addEventListener('input', debounce((e) => {
    const facet = e.target.dataset.facet;
    const type = e.target.dataset.type; // 'min' ou 'max'
    
    if (!facetManager.activeFilters[facet]) {
      facetManager.activeFilters[facet] = {};
    }
    
    facetManager.activeFilters[facet][type] = parseFloat(e.target.value);
    facetManager.applyFilters(facetManager.activeFilters);
  }, 300));
});
```

## Tags de filtres actifs

```javascript
// Affichage des filtres actifs
const renderActiveTags = (filters) => {
  const container = document.querySelector('.active-filters');
  container.innerHTML = '';
  
  Object.entries(filters).forEach(([facet, values]) => {
    if (Array.isArray(values)) {
      values.forEach(value => {
        const tag = createFilterTag(facet, value);
        container.appendChild(tag);
      });
    } else if (values.min || values.max) {
      const label = `${facet}: ${values.min || '*'} - ${values.max || '*'}`;
      const tag = createFilterTag(facet, label, 'range');
      container.appendChild(tag);
    }
  });
};

// Création d'un tag
const createFilterTag = (facet, value, type = 'value') => {
  const tag = document.createElement('button');
  tag.className = 'fr-tag fr-tag--dismiss';
  tag.setAttribute('aria-label', `Retirer le filtre ${value}`);
  tag.innerHTML = `
    ${value}
    <span class="fr-icon-close-line" aria-hidden="true"></span>
  `;
  
  tag.addEventListener('click', () => {
    removeFilter(facet, value, type);
  });
  
  return tag;
};
```

## Recherche dans les facettes

```html
<!-- Pour les facettes avec beaucoup de valeurs -->
<div class="fr-search-bar fr-search-bar--sm">
  <input class="fr-input" 
         type="search" 
         placeholder="Rechercher..."
         data-facet="{{FACET_NAME}}">
</div>
```

```javascript
// Filtrage des options de facettes
document.querySelectorAll('.fr-search-bar input').forEach(searchInput => {
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const facetId = e.target.dataset.facet;
    const options = document.querySelectorAll(`#facet-${facetId} .fr-checkbox-group`);
    
    options.forEach(option => {
      const label = option.querySelector('label').textContent.toLowerCase();
      option.style.display = label.includes(searchTerm) ? 'block' : 'none';
    });
  });
});
```

## Optimisations

### Lazy loading des facettes
```javascript
// Charger les valeurs à la demande
document.querySelectorAll('.fr-accordion__btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const facetId = e.target.getAttribute('aria-controls');
    const facetContent = document.getElementById(facetId);
    
    if (!facetContent.dataset.loaded) {
      const values = await loadFacetValues(facetId);
      renderFacetOptions(facetContent, values);
      facetContent.dataset.loaded = 'true';
    }
  });
});
```

### Debounce pour performance
```javascript
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
```

## Accessibilité

### Annonces des changements
```javascript
// Annoncer le nombre de résultats
const announceResults = (count) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = `${count} résultats après filtrage`;
  
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
};
```

### Navigation clavier
```javascript
// Support des raccourcis clavier
document.addEventListener('keydown', (e) => {
  // Alt + F : Focus sur les filtres
  if (e.altKey && e.key === 'f') {
    document.querySelector('.fr-sidemenu__btn').focus();
  }
  
  // Alt + R : Réinitialiser les filtres
  if (e.altKey && e.key === 'r') {
    document.getElementById('reset-filters').click();
  }
});
```

## Responsive

### Mobile
```css
@media (max-width: 767px) {
  .fr-sidemenu {
    position: fixed;
    top: 0;
    left: -100%;
    width: 80%;
    height: 100vh;
    z-index: 1000;
    transition: left 0.3s;
  }
  
  .fr-sidemenu.active {
    left: 0;
  }
  
  /* Overlay */
  .facets-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
  
  .facets-overlay.active {
    display: block;
  }
}
```

## Persistance des filtres

```javascript
// Sauvegarder dans l'URL
const saveFiltersToURL = (filters) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, values]) => {
    if (Array.isArray(values)) {
      values.forEach(v => params.append(key, v));
    } else {
      params.set(key, JSON.stringify(values));
    }
  });
  
  history.replaceState(null, '', `?${params.toString()}`);
};

// Restaurer depuis l'URL
const loadFiltersFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  const filters = {};
  
  for (const [key, value] of params) {
    if (!filters[key]) filters[key] = [];
    
    try {
      filters[key] = JSON.parse(value);
    } catch {
      filters[key].push(value);
    }
  }
  
  return filters;
};
```