# Widgets OpenDataSoft à Implémenter

## Vue d'ensemble
Ce document liste tous les widgets OpenDataSoft qui n'ont pas encore été implémentés dans le projet de migration DSFR.

---

## 📅 1. Widgets Temporels

### ods-timeline
- **Description** : Affichage chronologique d'événements sur une ligne de temps
- **Cas d'usage** : Historique des contrôles DGCCRF, évolution réglementaire
- **Priorité** : HAUTE
- **Complexité** : Moyenne
- **Exemple ODS** :
```html
<ods-timeline context="ctx" 
              timefield="date_controle"
              title-field="titre"
              description-field="description">
</ods-timeline>
```

### ods-calendar
- **Description** : Vue calendrier mensuelle avec événements
- **Cas d'usage** : Planning des formations, dates de campagnes
- **Priorité** : MOYENNE
- **Complexité** : Élevée
- **Exemple ODS** :
```html
<ods-calendar context="ctx"
              event-field="date_evenement"
              title-field="titre"
              color-field="categorie">
</ods-calendar>
```

### ods-timerange
- **Description** : Sélecteur de plage temporelle avec slider
- **Cas d'usage** : Filtrage par période pour analyses
- **Priorité** : MOYENNE
- **Complexité** : Faible
- **Exemple ODS** :
```html
<ods-timerange context="ctx"
               date-field="date"
               min="2020-01-01"
               max="2024-12-31">
</ods-timerange>
```

---

## 🖼️ 2. Widgets Médias

### ods-media-gallery
- **Description** : Galerie d'images avec lightbox
- **Cas d'usage** : Photos de produits non-conformes, preuves visuelles
- **Priorité** : BASSE
- **Complexité** : Moyenne
- **Exemple ODS** :
```html
<ods-media-gallery context="ctx"
                   media-field="images"
                   thumbnail-size="200">
</ods-media-gallery>
```

### ods-slideshow
- **Description** : Diaporama automatique ou manuel
- **Cas d'usage** : Présentation de résultats, infographies
- **Priorité** : BASSE
- **Complexité** : Moyenne
- **Exemple ODS** :
```html
<ods-slideshow context="ctx"
               images-field="slides"
               autoplay="true"
               interval="5000">
</ods-slideshow>
```

### ods-video-player
- **Description** : Lecteur vidéo intégré
- **Cas d'usage** : Tutoriels, webinaires enregistrés
- **Priorité** : BASSE
- **Complexité** : Faible
- **Exemple ODS** :
```html
<ods-video-player context="ctx"
                  video-field="video_url"
                  poster-field="thumbnail">
</ods-video-player>
```

---

## 🗂️ 3. Widgets de Navigation

### ods-catalog-card
- **Description** : Cartes de présentation pour catalogue de datasets
- **Cas d'usage** : Page d'accueil des données DGCCRF
- **Priorité** : HAUTE
- **Complexité** : Moyenne
- **Exemple ODS** :
```html
<ods-catalog-card catalog-id="dgccrf"
                  show-metrics="true"
                  show-preview="true">
</ods-catalog-card>
```

### ods-dataset-card
- **Description** : Carte détaillée d'un dataset individuel
- **Cas d'usage** : Présentation des métadonnées
- **Priorité** : HAUTE
- **Complexité** : Faible
- **Exemple ODS** :
```html
<ods-dataset-card context="ctx"
                  show-description="true"
                  show-keywords="true"
                  show-license="true">
</ods-dataset-card>
```

### ods-reuses
- **Description** : Liste des réutilisations d'un dataset
- **Cas d'usage** : Valorisation des données ouvertes
- **Priorité** : MOYENNE
- **Complexité** : Faible
- **Exemple ODS** :
```html
<ods-reuses context="ctx"
            dataset-id="signalconso"
            show-thumbnail="true">
</ods-reuses>
```

---

## 📊 4. Widgets Analytiques Avancés

### ods-analysis
- **Description** : Analyses statistiques complexes (corrélations, régressions)
- **Cas d'usage** : Études approfondies, rapports détaillés
- **Priorité** : BASSE
- **Complexité** : Très élevée
- **Exemple ODS** :
```html
<ods-analysis context="ctx"
              x-field="prix"
              y-field="qualite"
              analysis-type="correlation">
</ods-analysis>
```

### ods-aggregation
- **Description** : Agrégations multi-niveaux avec drill-down
- **Cas d'usage** : Tableaux de bord hiérarchiques
- **Priorité** : MOYENNE
- **Complexité** : Élevée
- **Exemple ODS** :
```html
<ods-aggregation context="ctx"
                 group-by="region,departement"
                 function="sum"
                 value-field="montant">
</ods-aggregation>
```

### ods-picto
- **Description** : Pictogrammes dynamiques basés sur les données
- **Cas d'usage** : Visualisation rapide d'indicateurs
- **Priorité** : BASSE
- **Complexité** : Moyenne
- **Exemple ODS** :
```html
<ods-picto context="ctx"
           picto-field="categorie"
           size-field="importance"
           color-field="status">
</ods-picto>
```

---

## 🔍 5. Widgets de Recherche et Filtrage

### ods-text-search
- **Description** : Barre de recherche textuelle avancée avec autocomplétion
- **Cas d'usage** : Recherche dans les signalements ConsO
- **Priorité** : HAUTE
- **Complexité** : Moyenne
- **Exemple ODS** :
```html
<ods-text-search context="ctx"
                 placeholder="Rechercher..."
                 fields="titre,description"
                 suggest="true">
</ods-text-search>
```

### ods-filter-summary
- **Description** : Résumé visuel des filtres actifs
- **Cas d'usage** : Affichage des critères de recherche appliqués
- **Priorité** : HAUTE
- **Complexité** : Faible
- **Exemple ODS** :
```html
<ods-filter-summary context="ctx"
                    show-clear="true"
                    compact="false">
</ods-filter-summary>
```

### ods-clear-all-filters
- **Description** : Bouton de réinitialisation de tous les filtres
- **Cas d'usage** : Nouvelle recherche rapide
- **Priorité** : HAUTE
- **Complexité** : Très faible
- **Exemple ODS** :
```html
<ods-clear-all-filters context="ctx"
                       button-label="Réinitialiser"
                       button-class="fr-btn">
</ods-clear-all-filters>
```

---

## 📜 6. Widgets de Contenu

### ods-dataset-schema
- **Description** : Affichage du schéma de données d'un dataset
- **Cas d'usage** : Documentation technique des données
- **Priorité** : MOYENNE
- **Complexité** : Moyenne
- **Exemple ODS** :
```html
<ods-dataset-schema context="ctx"
                    show-type="true"
                    show-description="true"
                    collapsible="true">
</ods-dataset-schema>
```

### ods-highcharts
- **Description** : Intégration de graphiques Highcharts avancés
- **Cas d'usage** : Visualisations complexes non couvertes par Chart.js
- **Priorité** : BASSE
- **Complexité** : Élevée
- **Exemple ODS** :
```html
<ods-highcharts context="ctx"
                chart-config="chartOptions"
                series-field="data">
</ods-highcharts>
```

### ods-infinite-scroll-results
- **Description** : Chargement progressif des résultats par défilement
- **Cas d'usage** : Listes longues sans pagination
- **Priorité** : MOYENNE
- **Complexité** : Moyenne
- **Exemple ODS** :
```html
<ods-infinite-scroll-results context="ctx"
                             per-page="20"
                             template-id="result-template">
</ods-infinite-scroll-results>
```

---

## 🎯 7. Widgets Spécialisés

### ods-geojson
- **Description** : Affichage de données GeoJSON brutes
- **Cas d'usage** : Zones géographiques complexes
- **Priorité** : BASSE
- **Complexité** : Moyenne
- **Exemple ODS** :
```html
<ods-geojson context="ctx"
             geojson-field="geometry"
             properties-field="properties">
</ods-geojson>
```

### ods-social-buttons
- **Description** : Boutons de partage sur réseaux sociaux
- **Cas d'usage** : Partage de visualisations
- **Priorité** : BASSE
- **Complexité** : Faible
- **Exemple ODS** :
```html
<ods-social-buttons context="ctx"
                    networks="twitter,linkedin,facebook"
                    title="Données DGCCRF">
</ods-social-buttons>
```

### ods-dataset-jsonld
- **Description** : Métadonnées structurées JSON-LD pour SEO
- **Cas d'usage** : Référencement des données
- **Priorité** : BASSE
- **Complexité** : Faible
- **Exemple ODS** :
```html
<ods-dataset-jsonld context="ctx"
                    dataset-id="signalconso">
</ods-dataset-jsonld>
```

---

## 📋 Résumé par Priorité

### 🔴 Priorité HAUTE (5 widgets)
1. **ods-timeline** - Widget temporel essentiel
2. **ods-catalog-card** - Navigation catalogue
3. **ods-dataset-card** - Présentation datasets
4. **ods-text-search** - Recherche avancée
5. **ods-filter-summary** - Résumé des filtres
6. **ods-clear-all-filters** - Réinitialisation

### 🟡 Priorité MOYENNE (7 widgets)
1. **ods-calendar** - Vue calendrier
2. **ods-timerange** - Sélecteur temporel
3. **ods-reuses** - Réutilisations
4. **ods-aggregation** - Agrégations avancées
5. **ods-dataset-schema** - Schéma de données
6. **ods-infinite-scroll-results** - Défilement infini

### 🟢 Priorité BASSE (9 widgets)
1. **ods-media-gallery** - Galerie médias
2. **ods-slideshow** - Diaporama
3. **ods-video-player** - Lecteur vidéo
4. **ods-analysis** - Analyses statistiques
5. **ods-picto** - Pictogrammes
6. **ods-highcharts** - Graphiques Highcharts
7. **ods-geojson** - Données GeoJSON
8. **ods-social-buttons** - Partage social
9. **ods-dataset-jsonld** - Métadonnées SEO

---

## 🚀 Plan d'Implémentation Suggéré

### Phase 1 - Widgets Essentiels (Sprint 1-2)
- [ ] ods-text-search
- [ ] ods-filter-summary
- [ ] ods-clear-all-filters
- [ ] ods-timeline
- [ ] ods-catalog-card
- [ ] ods-dataset-card

### Phase 2 - Widgets Temporels (Sprint 3)
- [ ] ods-calendar
- [ ] ods-timerange

### Phase 3 - Widgets Avancés (Sprint 4-5)
- [ ] ods-aggregation
- [ ] ods-dataset-schema
- [ ] ods-infinite-scroll-results
- [ ] ods-reuses

### Phase 4 - Widgets Optionnels (Sprint 6+)
- [ ] Widgets médias
- [ ] Widgets analytiques spécialisés
- [ ] Widgets de partage et SEO

---

## 📝 Notes Techniques

### Dépendances à Prévoir
- **ods-timeline** : Librairie de timeline (vis.js ou timeline.js)
- **ods-calendar** : FullCalendar ou calendrier DSFR custom
- **ods-highcharts** : Licence Highcharts (payante pour usage commercial)
- **ods-infinite-scroll** : Intersection Observer API

### Points d'Attention DSFR
- Tous les widgets doivent respecter les classes CSS DSFR
- Validation RGAA AA obligatoire
- Support clavier complet requis
- Mode responsive par défaut

### Estimation Totale
- **21 widgets** à implémenter
- **Effort estimé** : 3-6 mois avec 1 développeur
- **Complexité moyenne** : Moyenne à élevée

---

*Document généré le 25/08/2025*
*Dernière mise à jour : Version initiale*