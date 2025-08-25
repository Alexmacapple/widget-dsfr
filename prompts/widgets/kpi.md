# Instructions Widget: KPI (Key Performance Indicators)

## Analyse préalable
1. **Identifier les métriques** clés à mettre en avant
2. **Calculer les valeurs** agrégées (somme, moyenne, count)
3. **Déterminer les variations** temporelles si disponibles
4. **Prioriser** 3-6 KPIs maximum par dashboard

## Structure HTML DSFR

### KPI Card simple
```html
<div class="fr-col-12 fr-col-md-6 fr-col-lg-3">
  <div class="fr-card fr-card--no-arrow">
    <div class="fr-card__body">
      <div class="fr-card__content">
        <h3 class="fr-card__title">{{KPI_LABEL}}</h3>
        <p class="fr-card__desc">
          <span class="kpi-value" aria-live="polite">
            {{KPI_VALUE}}
          </span>
          <span class="kpi-unit">{{KPI_UNIT}}</span>
        </p>
        <div class="kpi-trend">
          <span class="fr-icon-arrow-up-line" aria-hidden="true"></span>
          <span class="kpi-variation">+{{VARIATION}}%</span>
          <span class="fr-text--sm">vs période précédente</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

### KPI avec icône
```html
<div class="fr-callout">
  <div class="fr-callout__icon">
    <span class="fr-icon-{{ICON_NAME}}" aria-hidden="true"></span>
  </div>
  <div class="fr-callout__content">
    <h3 class="fr-callout__title">{{KPI_LABEL}}</h3>
    <p class="kpi-value">{{KPI_VALUE}}</p>
  </div>
</div>
```

### KPI Tile (tuile)
```html
<div class="fr-tile fr-tile--horizontal">
  <div class="fr-tile__body">
    <h3 class="fr-tile__title">
      <span class="kpi-value">{{KPI_VALUE}}</span>
      <span class="kpi-label">{{KPI_LABEL}}</span>
    </h3>
    <p class="fr-tile__desc">{{KPI_DESCRIPTION}}</p>
  </div>
  <div class="fr-tile__img">
    <span class="fr-icon-3x fr-icon-{{ICON}}" aria-hidden="true"></span>
  </div>
</div>
```

## Types de KPIs

### 1. Valeur simple
```javascript
const calculateSimpleKPI = (data, field) => {
  return {
    value: data.length,
    label: 'Total',
    unit: 'éléments',
    icon: 'database-line'
  };
};
```

### 2. Somme
```javascript
const calculateSumKPI = (data, field) => {
  const sum = data.reduce((acc, item) => acc + (item[field] || 0), 0);
  return {
    value: new Intl.NumberFormat('fr-FR').format(sum),
    label: 'Montant total',
    unit: '€',
    icon: 'money-euro-circle-line'
  };
};
```

### 3. Moyenne
```javascript
const calculateAvgKPI = (data, field) => {
  const sum = data.reduce((acc, item) => acc + (item[field] || 0), 0);
  const avg = sum / data.length;
  return {
    value: avg.toFixed(2),
    label: 'Moyenne',
    unit: '',
    icon: 'bar-chart-line'
  };
};
```

### 4. Taux/Pourcentage
```javascript
const calculateRateKPI = (data, condition) => {
  const matched = data.filter(condition).length;
  const rate = (matched / data.length) * 100;
  return {
    value: rate.toFixed(1),
    label: 'Taux de réussite',
    unit: '%',
    icon: 'checkbox-circle-line'
  };
};
```

### 5. Évolution
```javascript
const calculateTrendKPI = (currentData, previousData) => {
  const current = currentData.length;
  const previous = previousData.length;
  const variation = ((current - previous) / previous) * 100;
  
  return {
    value: current,
    label: 'Cette période',
    variation: variation.toFixed(1),
    trend: variation > 0 ? 'up' : variation < 0 ? 'down' : 'stable',
    icon: variation > 0 ? 'arrow-up-line' : 'arrow-down-line'
  };
};
```

## Styles CSS personnalisés

```css
/* Valeurs KPI */
.kpi-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-title-blue-france);
  line-height: 1.2;
}

.kpi-unit {
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--text-default-grey);
  margin-left: 0.25rem;
}

/* Tendances */
.kpi-trend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.kpi-trend.positive {
  color: var(--text-default-success);
}

.kpi-trend.negative {
  color: var(--text-default-error);
}

/* Animation mise à jour */
@keyframes kpi-update {
  0% { opacity: 0.5; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
}

.kpi-value.updating {
  animation: kpi-update 0.5s ease;
}
```

## Grid Layout DSFR

```html
<!-- 4 KPIs sur desktop, 2 sur tablette, 1 sur mobile -->
<div class="fr-grid-row fr-grid-row--gutters">
  <div class="fr-col-12 fr-col-sm-6 fr-col-lg-3">
    <!-- KPI 1 -->
  </div>
  <div class="fr-col-12 fr-col-sm-6 fr-col-lg-3">
    <!-- KPI 2 -->
  </div>
  <div class="fr-col-12 fr-col-sm-6 fr-col-lg-3">
    <!-- KPI 3 -->
  </div>
  <div class="fr-col-12 fr-col-sm-6 fr-col-lg-3">
    <!-- KPI 4 -->
  </div>
</div>
```

## Icônes DSFR recommandées

```javascript
const KPI_ICONS = {
  // Métriques générales
  total: 'database-line',
  count: 'number-1',
  average: 'bar-chart-line',
  
  // Finance
  revenue: 'money-euro-circle-line',
  cost: 'money-euro-box-line',
  savings: 'piggy-bank-line',
  
  // Performance
  success: 'checkbox-circle-line',
  error: 'error-warning-line',
  pending: 'time-line',
  
  // Utilisateurs
  users: 'user-line',
  sessions: 'computer-line',
  conversion: 'shopping-cart-line',
  
  // Tendances
  increase: 'arrow-up-line',
  decrease: 'arrow-down-line',
  stable: 'arrow-right-line'
};
```

## Interactivité

### Drill-down au clic
```javascript
document.querySelectorAll('.fr-card').forEach(card => {
  card.addEventListener('click', (e) => {
    const kpiType = card.dataset.kpiType;
    // Ouvrir modal ou naviguer vers détails
    showKPIDetails(kpiType);
  });
  
  // Accessibilité clavier
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      card.click();
    }
  });
});
```

### Rafraîchissement automatique
```javascript
// Mise à jour périodique
const refreshKPIs = async () => {
  const data = await fetchLatestData();
  
  document.querySelectorAll('.kpi-value').forEach(element => {
    const kpiId = element.dataset.kpiId;
    const newValue = calculateKPI(data, kpiId);
    
    // Animation de transition
    element.classList.add('updating');
    element.textContent = newValue;
    
    setTimeout(() => {
      element.classList.remove('updating');
    }, 500);
  });
};

// Rafraîchir toutes les 30 secondes
setInterval(refreshKPIs, 30000);
```

## Sparklines (mini-graphiques)

```javascript
// Mini graphique de tendance dans KPI
const createSparkline = (data, elementId) => {
  const canvas = document.getElementById(elementId);
  const ctx = canvas.getContext('2d');
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((_, i) => i),
      datasets: [{
        data: data,
        borderColor: '#000091',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });
};
```

## Accessibilité

### Annonces vocales
```javascript
// Annoncer les changements de valeur
const announceKPIChange = (label, oldValue, newValue) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.classList.add('sr-only');
  
  const change = newValue > oldValue ? 'augmenté' : 'diminué';
  announcement.textContent = 
    `${label} a ${change} de ${oldValue} à ${newValue}`;
  
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
};
```

### Descriptions alternatives
```html
<div class="kpi-card" 
     role="article"
     aria-labelledby="kpi-title-1"
     aria-describedby="kpi-desc-1">
  <h3 id="kpi-title-1">Taux de satisfaction</h3>
  <div class="kpi-value">92%</div>
  <p id="kpi-desc-1" class="sr-only">
    Le taux de satisfaction est de 92%, 
    en hausse de 5 points par rapport au mois dernier
  </p>
</div>
```

## Formats d'affichage

```javascript
// Formatage intelligent des nombres
const formatKPIValue = (value, type) => {
  if (type === 'currency') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
  
  if (type === 'percentage') {
    return `${value.toFixed(1)}%`;
  }
  
  if (type === 'compact' && value > 1000) {
    return new Intl.NumberFormat('fr-FR', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  }
  
  return value.toLocaleString('fr-FR');
};
```