# Exemples annotés: Widget Chart

## Exemple 1: Bar Chart - Budget Vert

### Input utilisateur
```
"Graphique en barres du budget vert par mission avec les montants favorables à l'environnement"
```

### Output attendu annoté
```html
<!-- DÉBUT ZONE WIDGET budget-vert-chart-001 -->
<div id="widget-budget-vert-chart-001" class="widget-container fr-container">
  <div class="fr-card fr-card--no-border">
    <div class="fr-card__body">
      <h3 class="fr-card__title">Budget Vert 2025 - Répartition par mission</h3>
      <div class="fr-card__desc">
        <!-- Canvas pour Chart.js -->
        <div class="chart-container" style="position: relative; height:400px;">
          <canvas id="budget-chart" 
                  role="img" 
                  aria-label="Graphique en barres montrant la répartition du budget vert 2025 par mission">
          </canvas>
        </div>
        
        <!-- Table alternative pour accessibilité -->
        <details class="fr-mt-2w">
          <summary>Données du graphique (version accessible)</summary>
          <table class="fr-table fr-table--sm">
            <caption>Montants favorables à l'environnement par mission</caption>
            <thead>
              <tr>
                <th scope="col">Mission</th>
                <th scope="col">Montant (M€)</th>
                <th scope="col">Part du total</th>
              </tr>
            </thead>
            <tbody id="chart-data-table">
              <!-- Données tabulaires équivalentes -->
            </tbody>
          </table>
        </details>
      </div>
    </div>
  </div>
</div>

<script>
// Configuration Chart.js avec palette DSFR
const ctx = document.getElementById('budget-chart').getContext('2d');

const chartData = {
  labels: [], // Missions
  datasets: [{
    label: 'Budget favorable (M€)',
    data: [], // Montants
    backgroundColor: [
      '#000091', // Bleu France
      '#7F7FC8', // Bleu clair  
      '#18753C', // Vert succès
      '#CE614A', // Rouge Marianne
      '#B34000', // Orange alerte
      '#0063CB'  // Bleu info
    ],
    borderColor: '#000091',
    borderWidth: 1
  }]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        font: { size: 14, family: 'Marianne, arial, sans-serif' }
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.parsed.y;
          return `${context.dataset.label}: ${new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(value * 1000000)}`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `${value} M€`
      }
    },
    x: {
      ticks: {
        maxRotation: 45,
        minRotation: 45
      }
    }
  }
};

// Chargement des données
async function loadBudgetData() {
  const response = await fetch(
    'https://data.economie.gouv.fr/api/v2/catalog/datasets/plf-budget-vert/records?' +
    'where=classification="Favorable" AND year=2025' +
    '&group_by=mission' +
    '&order_by=sum(amount) DESC' +
    '&limit=10'
  );
  
  const data = await response.json();
  
  // Mise à jour des données du graphique
  chartData.labels = data.records.map(r => truncateLabel(r.fields.mission));
  chartData.datasets[0].data = data.records.map(r => r.fields.sum_amount);
  
  // Création du graphique
  new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: chartOptions
  });
  
  // Remplir la table alternative
  fillAccessibleTable(data.records);
}

// Troncature intelligente des labels
function truncateLabel(label, maxLength = 30) {
  if (label.length <= maxLength) return label;
  return label.substring(0, maxLength - 3) + '...';
}

// Table accessible
function fillAccessibleTable(records) {
  const tbody = document.getElementById('chart-data-table');
  const total = records.reduce((sum, r) => sum + r.fields.sum_amount, 0);
  
  tbody.innerHTML = records.map(r => `
    <tr>
      <td>${escapeHtml(r.fields.mission)}</td>
      <td>${r.fields.sum_amount.toFixed(0)} M€</td>
      <td>${((r.fields.sum_amount / total) * 100).toFixed(1)}%</td>
    </tr>
  `).join('');
}

// Initialisation
document.addEventListener('DOMContentLoaded', loadBudgetData);
</script>
<!-- FIN ZONE WIDGET budget-vert-chart-001 -->
```

### Points clés annotés
✅ **Palette DSFR** - Utilisation des couleurs officielles  
✅ **Alternative accessible** - Table de données équivalente  
✅ **Formatage monétaire** - Intl.NumberFormat avec EUR  
✅ **Labels tronqués** - Pour éviter débordement  
✅ **Responsive** - maintainAspectRatio: false  
✅ **Police Marianne** - Font-family DSFR  
❌ **Pas d'emojis** - Aucun emoji dans les titres  

---

## Exemple 2: Line Chart - Évolution temporelle

### Input utilisateur  
```
"Graphique courbe de l'évolution des signalements par mois"
```

### Configuration spécifique
```javascript
// Configuration pour graphique temporel
const timeChartConfig = {
  type: 'line',
  data: {
    labels: [], // Mois
    datasets: [{
      label: 'Nombre de signalements',
      data: [],
      borderColor: '#000091',
      backgroundColor: 'rgba(0, 0, 145, 0.1)',
      tension: 0.1, // Courbe lissée
      fill: true
    }]
  },
  options: {
    responsive: true,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
          displayFormats: {
            month: 'MMM yyyy'
          }
        },
        title: {
          display: true,
          text: 'Période'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombre de signalements'
        }
      }
    },
    plugins: {
      // Zoom temporel
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
  }
};

// Agrégation par mois
function aggregateByMonth(data) {
  const monthlyData = {};
  
  data.forEach(item => {
    const month = new Date(item.creation_date).toISOString().substring(0, 7);
    monthlyData[month] = (monthlyData[month] || 0) + 1;
  });
  
  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({
      x: month + '-01',
      y: count
    }));
}
```

**Annotations spécifiques:**
- 📅 **Axe temporel** avec format de date français
- 🔍 **Zoom/Pan** pour explorer les périodes
- 📊 **Agrégation mensuelle** des données
- 🎨 **Zone colorée** sous la courbe (fill: true)

---

## Exemple 3: Donut Chart - Répartition

### Input utilisateur
```
"Camembert des tarifs bancaires par catégorie de service"
```

### Configuration Donut DSFR
```javascript
const donutConfig = {
  type: 'doughnut',
  data: {
    labels: [
      'Moyens de paiement',
      'Incidents',
      'Crédits',
      'Épargne',
      'Services numériques',
      'Autres'
    ],
    datasets: [{
      data: [], // Valeurs calculées
      backgroundColor: [
        '#000091', // Bleu France
        '#CE614A', // Rouge Marianne
        '#18753C', // Vert succès
        '#B34000', // Orange alerte
        '#0063CB', // Bleu info
        '#7F7FC8'  // Bleu clair
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%', // Taille du trou central
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          usePointStyle: true,
          font: { size: 12 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${percentage}%`;
          }
        }
      },
      // Valeur centrale
      datalabels: {
        display: false
      }
    }
  }
};

// Limitation à 6 segments max
function limitSegments(data, maxSegments = 6) {
  const sorted = Object.entries(data)
    .sort(([,a], [,b]) => b - a);
  
  if (sorted.length <= maxSegments) {
    return Object.fromEntries(sorted);
  }
  
  const top = sorted.slice(0, maxSegments - 1);
  const others = sorted.slice(maxSegments - 1)
    .reduce((sum, [,val]) => sum + val, 0);
  
  return Object.fromEntries([...top, ['Autres', others]]);
}
```

**Points d'optimisation:**
- 🍩 **Donut** préféré au pie (plus moderne)
- 🎯 **6 segments max** pour lisibilité
- 📊 **Pourcentages** dans les tooltips
- 🏷️ **Légende en bas** sur mobile

---

## Exemple 4: Mixed Chart - Comparaison

### Configuration multi-axes
```javascript
// Graphique mixte barres + ligne
const mixedConfig = {
  type: 'bar',
  data: {
    labels: [], // Mois
    datasets: [{
      type: 'bar',
      label: 'Montant (€)',
      data: [],
      backgroundColor: '#000091',
      yAxisID: 'y-amount'
    }, {
      type: 'line',
      label: 'Nombre',
      data: [],
      borderColor: '#CE614A',
      backgroundColor: 'transparent',
      yAxisID: 'y-count'
    }]
  },
  options: {
    scales: {
      'y-amount': {
        type: 'linear',
        position: 'left',
        title: { text: 'Montant (€)' }
      },
      'y-count': {
        type: 'linear',
        position: 'right',
        title: { text: 'Nombre' },
        grid: { drawOnChartArea: false }
      }
    }
  }
};
```

---

## Patterns d'erreur à éviter

### ❌ Mauvaises pratiques
```javascript
// NE PAS FAIRE
chart.data.labels = ['Janvier 😊', 'Février 😎']; // Emojis interdits
chart.options.plugins.title.text = '📊 Stats'; // Emoji dans titre
backgroundColor: ['red', 'blue', 'green']; // Couleurs non DSFR
// Pas d'alternative accessible
```

### ✅ Bonnes pratiques
```javascript
// FAIRE
chart.data.labels = ['Janvier', 'Février'];
chart.options.plugins.title.text = 'Statistiques mensuelles';
backgroundColor: ['#000091', '#7F7FC8', '#18753C']; // Palette DSFR
// Toujours fournir une table alternative
```