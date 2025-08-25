# Dataset: Annuaire DGCCRF

## Description
Annuaire des services de la Direction Générale de la Concurrence, de la Consommation et de la Répression des Fraudes.

## Endpoint API
```
https://data.economie.gouv.fr/api/v2/catalog/datasets/annuaire-dgccrf
```

## Structure des données

### Champs principaux
| Champ | Type | Description | Exemple |
|-------|------|-------------|---------|
| `service_name` | string | Nom du service | "DDPP Loire-Atlantique" |
| `service_type` | string | Type de service | "DDPP", "DREETS", "DDETSPP" |
| `address` | string | Adresse complète | "10 rue du Commerce" |
| `postal_code` | string | Code postal | "44000" |
| `city` | string | Ville | "Nantes" |
| `department` | string | Département | "44" |
| `region` | string | Région | "Pays de la Loire" |
| `phone` | string | Téléphone | "02 40 12 34 56" |
| `email` | string | Email | "ddpp@loire-atlantique.gouv.fr" |
| `opening_hours` | string | Horaires | "8h30-12h, 13h30-17h" |
| `coordinates` | geopoint | Coordonnées GPS | [47.218371, -1.553621] |

### Facettes disponibles
- `service_type` - Types de services
- `department` - Départements
- `region` - Régions
- `city` - Villes principales

## Cas d'usage typiques

### 1. Carte interactive
- Localisation des services
- Recherche par proximité
- Informations au survol

### 2. Annuaire filtrable
- Recherche par département/région
- Tri alphabétique
- Export PDF/CSV

### 3. Widget contact
- Affichage service local
- Géolocalisation utilisateur
- Itinéraire Google Maps

## Requêtes OQL fréquentes

### Services d'un département
```sql
SELECT * WHERE department = '{{DEPT_CODE}}' 
ORDER BY service_name
```

### Recherche par région
```sql
SELECT * WHERE region = '{{REGION_NAME}}' 
ORDER BY department, service_name
```

### Géolocalisation proche
```sql
SELECT *, distance(coordinates, geopoint({{LAT}}, {{LON}})) as dist 
WHERE distance(coordinates, geopoint({{LAT}}, {{LON}})) < 50000 
ORDER BY dist
```

## Points d'attention
- **Stabilité**: Données très stables (mise à jour annuelle)
- **Complet**: Couverture 100% territoire français
- **Contact**: Vérifier validité emails/téléphones
- **Accessibilité**: Prévoir version texte pour la carte