# Patterns et Bonnes Pratiques

## Patterns de Développement

### 1. Pattern Widget DSFR

#### Structure HTML Standard

```html
<!-- DÉBUT ZONE WIDGET [DATASET]-[TYPE]-[ID] -->
<div id="widget-[dataset]-[type]-[id]" class="widget-container fr-container fr-my-4w">
    <div class="fr-grid-row">
        <div class="fr-col-12">
            <!-- Contenu du widget -->
        </div>
    </div>
</div>
<!-- FIN ZONE WIDGET [DATASET]-[TYPE]-[ID] -->
```

#### JavaScript Pattern

```javascript
class DSFRWidget {
    constructor(config) {
        this.id = config.id;
        this.dataset = config.dataset;
        this.type = config.type;
        this.container = document.getElementById(this.id);
        this.init();
    }
    
    async init() {
        try {
            this.showLoader();
            const data = await this.fetchData();
            this.render(data);
            this.attachEventListeners();
        } catch (error) {
            this.handleError(error);
        } finally {
            this.hideLoader();
        }
    }
    
    attachEventListeners() {
        // Utiliser addEventListener, jamais onclick
        this.container.querySelectorAll('.fr-btn').forEach(btn => {
            btn.addEventListener('click', this.handleClick.bind(this));
        });
    }
}
```

### 2. Pattern Fetch API

#### Fetch avec Retry et Cache

```javascript
const fetchWithRetry = async (url, options = {}, retries = 3) => {
    const cacheKey = `cache_${url}`;
    
    // Vérifier le cache
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 5 * 60 * 1000) { // 5 minutes
            return data;
        }
    }
    
    // Fetch avec retry
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                ...options,
                signal: AbortSignal.timeout(10000) // 10s timeout
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            // Mettre en cache
            sessionStorage.setItem(cacheKey, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
            
            return data;
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        }
    }
};
```

### 3. Pattern Tableau DSFR

#### Tableau Responsive avec Tri

```javascript
class DSFRTable {
    constructor(container, data) {
        this.container = container;
        this.data = data;
        this.sortColumn = null;
        this.sortDirection = 'asc';
    }
    
    render() {
        const html = `
            <div class="fr-table fr-table--no-scroll">
                <table>
                    <thead>
                        <tr>
                            ${this.renderHeaders()}
                        </tr>
                    </thead>
                    <tbody>
                        ${this.renderRows()}
                    </tbody>
                </table>
            </div>
        `;
        this.container.innerHTML = html;
        this.attachSortListeners();
    }
    
    renderHeaders() {
        return Object.keys(this.data[0]).map(key => `
            <th scope="col" class="sortable" data-column="${key}">
                ${key}
                <span class="fr-icon-arrow-down-s-line" aria-hidden="true"></span>
            </th>
        `).join('');
    }
    
    attachSortListeners() {
        this.container.querySelectorAll('.sortable').forEach(th => {
            th.addEventListener('click', (e) => {
                this.sort(e.target.dataset.column);
            });
        });
    }
}
```

### 4. Pattern Graphique Chart.js

#### Graphique Responsive DSFR

```javascript
class DSFRChart {
    constructor(canvas, type, data) {
        this.canvas = canvas;
        this.type = type;
        this.data = data;
        this.chart = null;
        this.init();
    }
    
    init() {
        // Couleurs DSFR
        const dsfrColors = [
            '#000091', // Bleu France
            '#E1000F', // Rouge Marianne
            '#161616', // Noir
            '#666666', // Gris
            '#CECECE', // Gris clair
            '#F5F5FE', // Bleu clair
        ];
        
        this.chart = new Chart(this.canvas, {
            type: this.type,
            data: {
                ...this.data,
                datasets: this.data.datasets.map((dataset, i) => ({
                    ...dataset,
                    backgroundColor: dsfrColors[i % dsfrColors.length],
                    borderColor: dsfrColors[i % dsfrColors.length],
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                family: 'Marianne, system-ui'
                            }
                        }
                    }
                }
            }
        });
    }
    
    destroy() {
        if (this.chart) {
            this.chart.destroy();
        }
    }
}
```

### 5. Pattern Formulaire DSFR

#### Formulaire avec Validation

```javascript
class DSFRForm {
    constructor(form) {
        this.form = form;
        this.errors = {};
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const name = field.name;
        
        // Validation requise
        if (field.required && !value) {
            this.setError(field, 'Ce champ est obligatoire');
            return false;
        }
        
        // Validation email
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.setError(field, 'Email invalide');
                return false;
            }
        }
        
        this.clearError(field);
        return true;
    }
    
    setError(field, message) {
        const group = field.closest('.fr-input-group');
        group.classList.add('fr-input-group--error');
        
        let errorEl = group.querySelector('.fr-error-text');
        if (!errorEl) {
            errorEl = document.createElement('p');
            errorEl.className = 'fr-error-text';
            group.appendChild(errorEl);
        }
        errorEl.textContent = message;
        
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', errorEl.id);
    }
    
    clearError(field) {
        const group = field.closest('.fr-input-group');
        group.classList.remove('fr-input-group--error');
        
        const errorEl = group.querySelector('.fr-error-text');
        if (errorEl) {
            errorEl.remove();
        }
        
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
    }
}
```

### 6. Pattern Accessibilité

#### Navigation au Clavier

```javascript
class KeyboardNavigation {
    constructor(container) {
        this.container = container;
        this.focusableElements = null;
        this.init();
    }
    
    init() {
        this.updateFocusableElements();
        
        this.container.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Tab':
                    this.handleTab(e);
                    break;
                case 'Escape':
                    this.handleEscape(e);
                    break;
                case 'Enter':
                case ' ':
                    this.handleActivation(e);
                    break;
            }
        });
    }
    
    updateFocusableElements() {
        const selector = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
        this.focusableElements = Array.from(
            this.container.querySelectorAll(selector)
        ).filter(el => !el.disabled && el.offsetParent !== null);
    }
    
    handleTab(e) {
        if (!this.focusableElements.length) return;
        
        const currentIndex = this.focusableElements.indexOf(document.activeElement);
        let nextIndex;
        
        if (e.shiftKey) {
            nextIndex = currentIndex - 1;
            if (nextIndex < 0) nextIndex = this.focusableElements.length - 1;
        } else {
            nextIndex = currentIndex + 1;
            if (nextIndex >= this.focusableElements.length) nextIndex = 0;
        }
        
        this.focusableElements[nextIndex].focus();
        e.preventDefault();
    }
}
```

### 7. Pattern Loading State

#### Indicateur de Chargement

```javascript
class LoadingIndicator {
    static show(container, message = 'Chargement...') {
        const loader = document.createElement('div');
        loader.className = 'loader-container';
        loader.innerHTML = `
            <div class="fr-container">
                <div class="fr-grid-row fr-grid-row--center">
                    <div class="fr-col-12 fr-col-md-6 text-center">
                        <div class="spinner" role="status" aria-live="polite">
                            <span class="sr-only">${message}</span>
                        </div>
                        <p class="fr-mt-2w">${message}</p>
                    </div>
                </div>
            </div>
        `;
        
        container.style.position = 'relative';
        container.appendChild(loader);
        
        return loader;
    }
    
    static hide(loader) {
        if (loader && loader.parentElement) {
            loader.parentElement.removeChild(loader);
        }
    }
}
```

### 8. Pattern Error Handling

#### Gestion des Erreurs

```javascript
class ErrorHandler {
    static handle(error, container, options = {}) {
        console.error('Widget Error:', error);
        
        const errorMessage = options.userMessage || 
            'Une erreur est survenue lors du chargement des données.';
        
        const errorHTML = `
            <div class="fr-alert fr-alert--error" role="alert">
                <h3 class="fr-alert__title">Erreur</h3>
                <p>${errorMessage}</p>
                ${options.showRetry ? `
                    <button class="fr-btn fr-btn--secondary fr-mt-2w" 
                            onclick="location.reload()">
                        Réessayer
                    </button>
                ` : ''}
            </div>
        `;
        
        if (container) {
            container.innerHTML = errorHTML;
        }
        
        // Logger pour monitoring
        if (typeof window.logError === 'function') {
            window.logError(error);
        }
    }
}
```

### 9. Pattern Export Data

#### Export CSV/JSON

```javascript
class DataExporter {
    static toCSV(data, filename = 'export.csv') {
        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => 
                    JSON.stringify(row[header] || '')
                ).join(',')
            )
        ].join('\n');
        
        this.download(csv, filename, 'text/csv');
    }
    
    static toJSON(data, filename = 'export.json') {
        const json = JSON.stringify(data, null, 2);
        this.download(json, filename, 'application/json');
    }
    
    static download(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }
}
```

### 10. Pattern Responsive Design

#### Breakpoints DSFR

```javascript
class ResponsiveWidget {
    constructor() {
        this.breakpoints = {
            xs: 0,
            sm: 576,
            md: 768,
            lg: 992,
            xl: 1248
        };
        
        this.currentBreakpoint = this.getBreakpoint();
        this.init();
    }
    
    init() {
        window.addEventListener('resize', 
            this.debounce(this.handleResize.bind(this), 250)
        );
    }
    
    getBreakpoint() {
        const width = window.innerWidth;
        
        if (width >= this.breakpoints.xl) return 'xl';
        if (width >= this.breakpoints.lg) return 'lg';
        if (width >= this.breakpoints.md) return 'md';
        if (width >= this.breakpoints.sm) return 'sm';
        return 'xs';
    }
    
    handleResize() {
        const newBreakpoint = this.getBreakpoint();
        
        if (newBreakpoint !== this.currentBreakpoint) {
            this.currentBreakpoint = newBreakpoint;
            this.onBreakpointChange(newBreakpoint);
        }
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}
```

## Anti-Patterns à Éviter

### ❌ Ne PAS faire

```javascript
// Mauvais : onclick inline
<button onclick="doSomething()">Cliquer</button>

// Mauvais : manipulation DOM directe
document.getElementById('widget').innerHTML = data;

// Mauvais : styles inline
<div style="color: blue;">Texte</div>

// Mauvais : var au lieu de const/let
var data = fetchData();

// Mauvais : callbacks imbriqués
getData(function(data) {
    processData(data, function(result) {
        displayData(result, function() {
            // Callback hell
        });
    });
});
```

### ✅ Faire à la place

```javascript
// Bon : addEventListener
button.addEventListener('click', doSomething);

// Bon : création d'éléments
const div = document.createElement('div');
div.textContent = data;

// Bon : classes CSS
<div class="fr-text--blue">Texte</div>

// Bon : const/let
const data = await fetchData();

// Bon : async/await
try {
    const data = await getData();
    const result = await processData(data);
    await displayData(result);
} catch (error) {
    handleError(error);
}
```