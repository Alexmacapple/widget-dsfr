# Instructions Widget: Map

## Analyse préalable
1. **Vérifier la présence** de données géographiques (lat/lon, adresse, code postal)
2. **Déterminer le niveau** de zoom optimal
3. **Identifier les métriques** à visualiser
4. **Évaluer la densité** des points

## Structure HTML DSFR

```html
<div class="fr-card">
  <div class="fr-card__body">
    <h3 class="fr-card__title">{{MAP_TITLE}}</h3>
    <div class="fr-card__desc">
      <!-- Contrôles de la carte -->
      <div class="fr-grid-row fr-grid-row--gutters fr-mb-2w">
        <div class="fr-col-12 fr-col-md-6">
          <label class="fr-label" for="map-filter">
            Filtrer par département
          </label>
          <select class="fr-select" id="map-filter">
            <option value="">Tous les départements</option>
            <!-- Options dynamiques -->
          </select>
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <button class="fr-btn fr-btn--secondary" id="map-reset">
            <span class="fr-icon-refresh-line" aria-hidden="true"></span>
            Réinitialiser la vue
          </button>
        </div>
      </div>
      
      <!-- Conteneur carte -->
      <div id="map-{{DATASET}}" 
           class="map-container" 
           style="height: 500px; position: relative;"
           role="application"
           aria-label="{{MAP_DESCRIPTION}}">
      </div>
      
      <!-- Légende -->
      <div class="fr-mt-2w">
        <h4>Légende</h4>
        <ul class="fr-badge-group">
          <!-- Légende dynamique -->
        </ul>
      </div>
    </div>
  </div>
</div>
```

## Configuration Leaflet DSFR

```javascript
// Initialisation avec tuiles IGN
const map = L.map('map-{{DATASET}}', {
  center: [46.603354, 1.888334], // Centre France
  zoom: 6,
  zoomControl: true,
  scrollWheelZoom: false // Accessibilité
});

// Tuiles IGN (service public)
L.tileLayer('https://wxs.ign.fr/{ignApiKey}/geoportail/wmts?' +
  'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&' +
  'LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&' +
  'TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&' +
  'FORMAT=image/jpeg', {
  attribution: '© IGN-F/Geoportail',
  maxZoom: 18
}).addTo(map);
```

## Types de visualisation

### 1. Marqueurs individuels
```javascript
// Pour <100 points
const createMarker = (item) => {
  const marker = L.marker([item.lat, item.lon], {
    icon: L.divIcon({
      className: 'fr-marker',
      html: `<span class="fr-icon-map-pin-2-line" 
                   style="color: #000091; font-size: 24px;"></span>`,
      iconSize: [24, 24],
      iconAnchor: [12, 24]
    })
  });
  
  // Popup DSFR
  marker.bindPopup(`
    <div class="fr-card fr-card--sm">
      <div class="fr-card__body">
        <h4 class="fr-card__title">${item.name}</h4>
        <p class="fr-card__desc">${item.description}</p>
        <button class="fr-btn fr-btn--sm">Voir détails</button>
      </div>
    </div>
  `);
  
  return marker;
};
```

### 2. Clusters
```javascript
// Pour >100 points
const markers = L.markerClusterGroup({
  maxClusterRadius: 50,
  iconCreateFunction: (cluster) => {
    const count = cluster.getChildCount();
    let size = 'small';
    let color = '#7F7FC8';
    
    if (count > 50) {
      size = 'large';
      color = '#000091';
    } else if (count > 10) {
      size = 'medium';
      color = '#3A3A80';
    }
    
    return L.divIcon({
      html: `<div class="cluster-icon ${size}" 
                  style="background-color: ${color}">
               ${count}
             </div>`,
      className: 'fr-cluster',
      iconSize: L.point(40, 40)
    });
  }
});
```

### 3. Heatmap
```javascript
// Pour densité
const heatmapData = data.map(item => [
  item.lat,
  item.lon,
  item.intensity || 1
]);

const heat = L.heatLayer(heatmapData, {
  radius: 25,
  blur: 15,
  maxZoom: 17,
  gradient: {
    0.0: '#F5F5FE',
    0.2: '#7F7FC8',
    0.4: '#3A3A80',
    0.6: '#000091',
    0.8: '#CE614A',
    1.0: '#CE0500'
  }
}).addTo(map);
```

### 4. Choroplèthe (départements/régions)
```javascript
// Coloration par zone
const style = (feature) => {
  const value = getValueForDepartment(feature.properties.code);
  return {
    fillColor: getColor(value),
    weight: 2,
    opacity: 1,
    color: '#000091',
    dashArray: '3',
    fillOpacity: 0.7
  };
};

// Échelle de couleurs DSFR
const getColor = (value) => {
  return value > 1000 ? '#CE0500' :
         value > 500  ? '#CE614A' :
         value > 200  ? '#000091' :
         value > 100  ? '#3A3A80' :
         value > 50   ? '#7F7FC8' :
                        '#F5F5FE';
};
```

## Géocodage des adresses

```javascript
// Conversion adresse -> coordonnées
const geocodeAddress = async (address) => {
  const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.features && data.features.length > 0) {
    const [lon, lat] = data.features[0].geometry.coordinates;
    return { lat, lon };
  }
  return null;
};

// Traitement en lot
const geocodeBatch = async (addresses) => {
  const promises = addresses.map(addr => geocodeAddress(addr));
  return Promise.all(promises);
};
```

## Contrôles et interactions

### Recherche géographique
```javascript
// Barre de recherche d'adresse
const searchControl = L.Control.extend({
  onAdd: function() {
    const div = L.DomUtil.create('div', 'fr-search-bar');
    div.innerHTML = `
      <input class="fr-input" type="search" 
             placeholder="Rechercher une adresse..." />
      <button class="fr-btn">Rechercher</button>
    `;
    
    L.DomEvent.disableClickPropagation(div);
    return div;
  }
});
```

### Géolocalisation utilisateur
```javascript
// Bouton "Ma position"
const locateControl = L.control.locate({
  position: 'topright',
  strings: {
    title: "Me localiser"
  },
  locateOptions: {
    maxZoom: 14
  }
}).addTo(map);
```

### Export de la vue
```javascript
// Capture carte en image
const exportMap = () => {
  leafletImage(map, (err, canvas) => {
    if (!err) {
      const link = document.createElement('a');
      link.download = 'carte-{{DATASET}}.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  });
};
```

## Accessibilité

### Navigation clavier
```javascript
// Activation navigation clavier
map.keyboard.enable();

// Raccourcis personnalisés
L.DomEvent.on(window, 'keydown', (e) => {
  switch(e.key) {
    case '+': map.zoomIn(); break;
    case '-': map.zoomOut(); break;
    case 'Home': map.setView([46.603354, 1.888334], 6); break;
  }
});
```

### Alternative textuelle
```html
<!-- Liste accessible des points -->
<details class="fr-mt-3w">
  <summary>Liste textuelle des {{COUNT}} points</summary>
  <table class="fr-table fr-table--sm">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Adresse</th>
        <th>Valeur</th>
      </tr>
    </thead>
    <tbody>
      <!-- Données tabulaires -->
    </tbody>
  </table>
</details>
```

## Performance

### Limites recommandées
- Marqueurs simples: max 100
- Clusters: 100-10000 points
- Heatmap: 1000-50000 points
- Choroplèthe: illimité (zones fixes)

### Optimisations
```javascript
// Viewport culling
const bounds = map.getBounds();
const visibleMarkers = allMarkers.filter(marker => {
  const latlng = marker.getLatLng();
  return bounds.contains(latlng);
});

// Lazy loading par zone
map.on('moveend', () => {
  const bounds = map.getBounds();
  loadMarkersInBounds(bounds);
});

// Simplification des polygones
const simplified = turf.simplify(geojson, {
  tolerance: 0.01,
  highQuality: false
});
```

## Responsive

```javascript
// Adaptation mobile
if (window.innerWidth < 768) {
  map.setZoom(5); // Zoom plus large
  map.scrollWheelZoom.disable(); // Désactiver zoom scroll
  
  // Popups en modal
  map.on('popupopen', (e) => {
    // Convertir popup en modal DSFR
  });
}

// Recalcul à la rotation
window.addEventListener('orientationchange', () => {
  map.invalidateSize();
});
```