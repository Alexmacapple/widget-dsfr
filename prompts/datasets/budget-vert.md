# Dataset: Budget Vert PLF

## Description
Analyse environnementale du projet de loi de finances (PLF) classant les dépenses selon leur impact sur l'environnement.

## Endpoint API
```
https://data.economie.gouv.fr/api/v2/catalog/datasets/plf-budget-vert
```

## Structure des données

### Champs principaux
| Champ | Type | Description | Exemple |
|-------|------|-------------|---------|
| `year` | integer | Année PLF | 2025 |
| `mission` | string | Mission budgétaire | "Écologie, développement et mobilité durables" |
| `program` | string | Programme | "203 - Infrastructures et services de transports" |
| `action` | string | Action budgétaire | "Transports terrestres et maritimes" |
| `amount` | number | Montant en M€ | 1234.56 |
| `classification` | string | Classification environnementale | "Favorable", "Neutre", "Défavorable", "Mixte" |
| `category` | string | Catégorie d'impact | "Climat", "Biodiversité", "Pollution", "Ressources" |
| `description` | text | Description de l'action | "..." |
| `indicators` | array | Indicateurs de performance | ["CO2 évité", "Surface protégée"] |

### Facettes disponibles
- `classification` - Impact environnemental
- `category` - Catégorie d'impact
- `mission` - Missions budgétaires
- `year` - Années disponibles

## Cas d'usage typiques

### 1. Dashboard budgétaire
- Répartition par classification (donut chart)
- Evolution temporelle (line chart)
- Top missions vertes (bar chart)
- Montant total par catégorie (KPI cards)

### 2. Tableau détaillé
- Arborescence mission/programme/action
- Filtres par impact
- Calculs de sous-totaux
- Export pour analyse

### 3. Visualisation Sankey
- Flux budgétaires verts
- Du ministère vers les actions
- Pondération par montant

## Requêtes OQL fréquentes

### Budget favorable environnement
```sql
SELECT mission, SUM(amount) as total 
WHERE classification = 'Favorable' AND year = 2025
GROUP BY mission 
ORDER BY total DESC
```

### Evolution temporelle
```sql
SELECT year, classification, SUM(amount) as total 
GROUP BY year, classification 
ORDER BY year, classification
```

### Détail par programme
```sql
SELECT * WHERE mission = '{{MISSION_NAME}}' AND year = 2025 
ORDER BY program, action
```

## Points d'attention
- **Complexité**: Données hiérarchiques (mission>programme>action)
- **Volume**: ~2000 lignes par année
- **Mise à jour**: Annuelle (octobre pour N+1)
- **Précision**: Montants en millions d'euros
- **Visualisation**: Préférer les charts pour les agrégats