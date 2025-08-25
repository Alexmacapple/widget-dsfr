# Instructions Widget: Chart

## Analyse préalable
1. **Identifier le type** de visualisation optimal
2. **Vérifier les dimensions** des données (1D, 2D, temporel)
3. **Calculer les agrégations** nécessaires
4. **Définir les axes** et échelles

## Types de graphiques DSFR

### Bar Chart (Barres)
```javascript
// Pour comparaisons entre catégories
const config = {
  type: 'bar',
  data: {
    labels: [], // Catégories
    datasets: [{
      label: '{{METRIC_NAME}}',
      data: [], // Valeurs
      backgroundColor: '#000091', // Bleu France
      borderColor: '#000091',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '{{CHART_TITLE}}' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  }
};
```

### Line Chart (Lignes)
```javascript
// Pour évolutions temporelles
const config = {
  type: 'line',
  data: {
    labels: [], // Dates
    datasets: [{
      label: '{{METRIC_NAME}}',
      data: [], // Valeurs
      borderColor: '#000091',
      backgroundColor: 'rgba(0, 0, 145, 0.1)',
      tension: 0.1 // Courbe lissée
    }]
  }
};
```

### Pie/Donut Chart
```javascript
// Pour répartitions/proportions
const config = {
  type: 'doughnut', // ou 'pie'
  data: {
    labels: [], // Catégories
    datasets: [{
      data: [], // Valeurs
      backgroundColor: [
        '#000091', // Bleu France
        '#7F7FC8', // Bleu clair
        '#F5F5FE', // Bleu très clair
        '#CE614A', // Rouge Marianne
        '#F95C5E'  // Rouge clair
      ]
    }]
  }
};
```

## Structure HTML conteneur

```html
<div class="fr-card fr-card--no-border">
  <div class="fr-card__body">
    <h3 class="fr-card__title">{{CHART_TITLE}}</h3>
    <div class="fr-card__desc">
      <div class="chart-container" style="position: relative; height:400px;">
        <canvas id="chart-{{DATASET}}-{{TYPE}}" 
                role="img" 
                aria-label="{{CHART_DESCRIPTION}}">
        </canvas>
      </div>
      <!-- Légende alternative pour accessibilité -->
      <details class="fr-mt-2w">
        <summary>Données du graphique (accessibilité)</summary>
        <table class="fr-table fr-table--sm">
          <!-- Données tabulaires équivalentes -->
        </table>
      </details>
    </div>
  </div>
</div>
```

## Palette de couleurs DSFR

### Couleurs principales
```javascript
const DSFR_COLORS = {
  primary: '#000091',    // Bleu France
  secondary: '#CE614A',  // Rouge Marianne  
  success: '#18753C',    // Vert succès
  warning: '#B34000',    // Orange alerte
  error: '#CE0500',      // Rouge erreur
  info: '#0063CB'        // Bleu info
};

// Palette étendue pour multiples séries
const CHART_PALETTE = [
  '#000091', '#7F7FC8', '#F5F5FE', // Bleus
  '#CE614A', '#F95C5E', '#FEE9E5', // Rouges
  '#18753C', '#7FCD8A', '#E6F6E9', // Verts
  '#B34000', '#FFB86C', '#FFF1E5'  // Oranges
];
```

## Agrégations de données

### Temporelle
```javascript
// Grouper par mois
const groupByMonth = (data) => {
  return data.reduce((acc, item) => {
    const month = new Date(item.date).toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'short' 
    });
    acc[month] = (acc[month] || 0) + item.value;
    return acc;
  }, {});
};
```

### Catégorielle
```javascript
// Grouper et compter
const groupByCategory = (data, field) => {
  return data.reduce((acc, item) => {
    acc[item[field]] = (acc[item[field]] || 0) + 1;
    return acc;
  }, {});
};
```

### Top N
```javascript
// Garder top 10 + "Autres"
const getTopN = (data, n = 10) => {
  const sorted = Object.entries(data)
    .sort(([,a], [,b]) => b - a);
  
  const top = sorted.slice(0, n);
  const others = sorted.slice(n).reduce((sum, [,val]) => sum + val, 0);
  
  if (others > 0) {
    top.push(['Autres', others]);
  }
  
  return Object.fromEntries(top);
};
```

## Options de configuration

### Responsive
```javascript
options: {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: window.innerWidth < 768 ? 'bottom' : 'top',
      labels: {
        boxWidth: 12,
        padding: 15,
        font: { size: 14 }
      }
    }
  }
}
```

### Tooltips personnalisés
```javascript
options: {
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.dataset.label || '';
          const value = context.parsed.y;
          
          // Formatage selon type
          if (context.dataset.yAxisID === 'currency') {
            return `${label}: ${new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            }).format(value)}`;
          }
          
          return `${label}: ${value.toLocaleString('fr-FR')}`;
        }
      }
    }
  }
}
```

## Accessibilité

### Alternative textuelle
- Toujours fournir une table de données équivalente
- Utiliser `aria-label` descriptif sur le canvas
- Permettre export CSV des données

### Contraste
- Respecter ratio 3:1 pour éléments graphiques
- Utiliser patterns pour distinguer sans couleur
- Légendes claires et explicites

## Performance

### Limite de points
- Line chart: max 100 points (au-delà, agréger)
- Bar chart: max 30 barres (au-delà, grouper)
- Pie chart: max 8 segments (au-delà, créer "Autres")

### Optimisations
```javascript
// Décimation pour grandes séries
const decimateData = (data, maxPoints = 100) => {
  if (data.length <= maxPoints) return data;
  
  const factor = Math.ceil(data.length / maxPoints);
  return data.filter((_, i) => i % factor === 0);
};

// Lazy loading des graphiques
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      renderChart(entry.target.id);
      observer.unobserve(entry.target);
    }
  });
});
```

## Interactivité

### Zoom/Pan
```javascript
// Pour séries temporelles longues
plugins: {
  zoom: {
    zoom: {
      wheel: { enabled: true },
      pinch: { enabled: true },
      mode: 'x'
    },
    pan: {
      enabled: true,
      mode: 'x'
    }
  }
}
```

### Drill-down
```javascript
// Click pour détails
onClick: (event, elements) => {
  if (elements.length > 0) {
    const index = elements[0].index;
    const label = chart.data.labels[index];
    // Charger données détaillées
    loadDetailedData(label);
  }
}
```