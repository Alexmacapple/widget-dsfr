# 📊 Structure du Dataset SignalConso

## 📁 Source
- **URL API** : `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/signalconso`
- **Format** : CSV, JSON, XLS
- **Nombre total d'enregistrements** : 1,316,723+ (décembre 2024)

## 🔍 Structure des Champs

### 1. **Identifiant**
- **`id`** : Identifiant unique du signalement
  - Type : String (UUID)
  - Exemple : `b10baf9a-f505-4256-bf46-427dcba7b45d`

### 2. **Catégorisation**
- **`category`** : Catégorie principale du signalement
  - Type : Array[String]
  - Valeurs possibles :
    - `BanqueAssuranceMutuelle`
    - `CafeRestaurant`
    - `ServicesAuxParticuliers`
    - `AchatMagasin`
    - `AchatInternet`
    - `EauGazElectricite`
    - `TelephonieFaiMedias`
    - `VoyageLoisirs`
    - `Immobilier`
    - `TravauxRenovation`
    - `VoitureVehicule`
    - `AnimauxDomestiques`
    - `Sante`
    - `Retrait-Rappel`
    - Etc.

- **`subcategories`** : Sous-catégories détaillées
  - Type : Array[String]
  - Exemples : `["Une_banque", "Publicite", "Autre"]`

### 3. **Temporalité**
- **`creationdate`** : Date de création du signalement
  - Type : Date (YYYY-MM-DD)
  - Exemple : `2024-12-12`

### 4. **Statut et Traitement**
- **`status`** : Statut du signalement
  - Type : String
  - Valeurs possibles :
    - `Transmis` : Transmis à l'entreprise
    - `PromesseAction` : Promesse d'action de l'entreprise
    - `Infonde` : Signalement infondé
    - `NonTransmis` : Non transmis
    - `NA` : Non applicable

- **`contactagreement`** : Accord de contact
  - Type : String ("0" ou "1")
  - "1" = Accord donné

- **`forwardtoreponseconso`** : Transfert vers RéponseConso
  - Type : String ("0" ou "1")

### 5. **Indicateurs de Suivi**
- **`signalement_transmis`** : Signalement transmis
  - Type : Integer (0 ou 1)

- **`signalement_lu`** : Signalement lu par l'entreprise
  - Type : Integer (0 ou 1)

- **`signalement_reponse`** : Réponse de l'entreprise
  - Type : Integer (0 ou 1)

### 6. **Localisation Géographique**
- **`dep_name`** : Nom du département
  - Type : String
  - Exemple : `Hauts-de-Seine`

- **`dep_code`** : Code département
  - Type : String
  - Exemple : `92`

- **`reg_code`** : Code région
  - Type : String
  - Exemple : `11`

- **`reg_name`** : Nom de la région
  - Type : String
  - Exemple : `Île-de-France`

### 7. **Métadonnées**
- **`tags`** : Tags associés au signalement
  - Type : Array[String]
  - Exemples : `["Internet", "Litige contractuel"]`

## 📈 Statistiques Clés

### Distribution par catégorie (principales)
```
1. AchatInternet         : ~250,000 signalements
2. TelephonieFaiMedias   : ~200,000 signalements
3. BanqueAssuranceMutuelle : ~180,000 signalements
4. ServicesAuxParticuliers : ~150,000 signalements
5. VoyageLoisirs         : ~120,000 signalements
```

### Distribution géographique
```
- 96 départements couverts
- 13 régions métropolitaines
- 5 DOM-TOM
```

### Distribution temporelle
```
- Données depuis : 2020
- Mise à jour : Quotidienne
- Pic d'activité : 2023-2024
```

## 🔄 Exemple de Requête API

### Récupérer les 10 derniers signalements
```bash
curl "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/signalconso/records?limit=10&order_by=creationdate%20desc"
```

### Filtrer par région (Île-de-France)
```bash
curl "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/signalconso/records?where=reg_name%3D%22%C3%8Ele-de-France%22&limit=10"
```

### Filtrer par catégorie (Banque)
```bash
curl "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/signalconso/records?where=category%3D%22BanqueAssuranceMutuelle%22&limit=10"
```

## 📝 Format CSV

### En-têtes du CSV
```csv
id,category,subcategories,creationdate,contactagreement,status,forwardtoreponseconso,tags,signalement_transmis,signalement_lu,signalement_reponse,dep_name,dep_code,reg_code,reg_name
```

### Exemple de ligne CSV
```csv
"b10baf9a-f505-4256-bf46-427dcba7b45d","BanqueAssuranceMutuelle","Une_banque;Publicite;Autre","2024-12-12","1","Infonde","0","Internet;Litige contractuel",1,1,1,"Hauts-de-Seine","92","11","Île-de-France"
```

## 🛠️ Utilisation avec ODS Widgets

### Configuration du contexte
```html
<ods-dataset-context 
    context="signalconso" 
    signalconso-domain="data.economie.gouv.fr" 
    signalconso-dataset="signalconso"
    signalconso-parameters="{
        'disjunctive.category': true,
        'disjunctive.reg_name': true,
        'disjunctive.status': true,
        'disjunctive.creationdate': true
    }">
```

### Facettes recommandées
1. **category** : Filtrage par catégorie principale
2. **reg_name** : Filtrage par région
3. **dep_name** : Filtrage par département
4. **status** : Filtrage par statut
5. **creationdate** : Filtrage temporel (année/mois)

### Champs pour visualisation
- **Graphiques** : category, reg_name, creationdate
- **Cartes** : reg_code, dep_code (avec géolocalisation)
- **KPIs** : COUNT(*), status, signalement_transmis
- **Tables** : Tous les champs

## 📊 Widgets Recommandés

1. **Table** : Vue détaillée des signalements
2. **Map** : Répartition géographique
3. **Chart** : Évolution temporelle et distribution par catégorie
4. **Facets** : Filtres multi-critères
5. **KPI** : Indicateurs de performance (taux de réponse, etc.)
6. **Timeline** : Chronologie des signalements

---

*Document généré le : 17/08/2025*
*Source : API OpenDataSoft - data.economie.gouv.fr*