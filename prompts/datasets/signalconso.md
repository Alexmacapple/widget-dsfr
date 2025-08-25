# Dataset: SignalConso

## Description
Plateforme de signalement des anomalies de consommation permettant aux consommateurs de signaler des problèmes rencontrés avec des entreprises.

## Endpoint API
```
https://data.economie.gouv.fr/api/v2/catalog/datasets/signalconso
```

## Structure des données

### Champs principaux
| Champ | Type | Description | Exemple |
|-------|------|-------------|---------|
| `id` | string | Identifiant unique | "2024-001234" |
| `creation_date` | datetime | Date de création | "2024-01-15T10:30:00" |
| `problem_type` | string | Type de problème | "Pratique commerciale trompeuse" |
| `problem_category` | string | Catégorie | "Commerce" |
| `company_name` | string | Nom entreprise | "Société XYZ" |
| `company_siret` | string | SIRET | "12345678900001" |
| `company_address` | object | Adresse | {street, postalCode, city} |
| `status` | string | Statut traitement | "En cours", "Clôturé" |
| `consumer_postal_code` | string | CP consommateur | "75001" |
| `description` | text | Description détaillée | "..." |

### Facettes disponibles
- `problem_type` - Types de problèmes
- `problem_category` - Catégories
- `status` - Statuts de traitement
- `creation_date` - Périodes temporelles
- `department` - Départements (extrait du code postal)

## Cas d'usage typiques

### 1. Dashboard statistiques
- KPI: Nombre total de signalements
- Répartition par type de problème (chart)
- Evolution temporelle (line chart)
- Top 10 des entreprises signalées (table)

### 2. Carte géographique
- Densité par département
- Clustering par zone
- Popup avec détails au clic

### 3. Table de recherche
- Filtres multicritères
- Export CSV des résultats
- Détail au clic sur ligne

## Requêtes OQL fréquentes

### Signalements récents
```sql
SELECT * WHERE creation_date > date'2024-01-01' 
ORDER BY creation_date DESC 
LIMIT 100
```

### Par entreprise
```sql
SELECT * WHERE company_siret = '{{SIRET}}' 
ORDER BY creation_date DESC
```

### Statistiques par type
```sql
SELECT problem_type, COUNT(*) as count 
GROUP BY problem_type 
ORDER BY count DESC
```

## Points d'attention
- **Volume**: ~50k signalements/an
- **Mise à jour**: Quotidienne
- **RGPD**: Données anonymisées côté consommateur
- **Géolocalisation**: Utiliser code postal pour département uniquement