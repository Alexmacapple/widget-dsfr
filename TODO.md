# TODO - Widgets DSFR

## Widgets à corriger

### Facets
- [ ] **facets-refinement-001.html** - http://localhost:8000/widgets/facets/facets-refinement-001.html
  - À vérifier : affichage des données, compatibilité des champs avec l'API SignalConso

### Maps  
- [ ] **map-basic-001.html** - http://localhost:8000/widgets/maps/map-basic-001.html
  - À vérifier : affichage des points sur la carte, statistiques
  
- [ ] **map-heatmap-001.html** - http://localhost:8000/widgets/maps/map-heatmap-001.html
  - À vérifier : affichage de la heatmap, densité des données

## Widgets complétés ✅

### Charts
- [x] **chart-bar-001.html** - Fonctionnel
- [x] **chart-pie-001.html** - Reconstruit et fonctionnel

### Facets
- [x] **facets-basic-001.html** - Tableau agrandi et fonctionnel

## Notes techniques

### Problèmes récurrents résolus
1. **Champs API incorrects** : Remplacer les anciens noms de champs par ceux de l'API actuelle
   - `categorie` → `category`
   - `date_creation` → `creationdate`
   - `statut_promesse` → `status`
   - `nom_etablissement` → `establishmentname`
   - `region` → `reg_name`
   - `departement` → `dep_name`

2. **ods-aggregation** : Remplacer par des accès directs (`signalconso.nhits`)

3. **Angular non initialisé** : S'assurer que jQuery est chargé avant ODS Widgets

4. **Tables vides** : Utiliser `ods-table` simple sans paramètres complexes

---
*Dernière mise à jour : Session actuelle*

--
La prochaine grande étape après les corrections sera donc les widgets KPI/Métriques de la
Phase 2.