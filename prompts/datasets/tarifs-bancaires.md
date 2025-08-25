# Dataset: Tarifs Bancaires CCSF

## Description
Observatoire des tarifs bancaires du Comité Consultatif du Secteur Financier comparant les frais des principales banques françaises.

## Endpoint API
```
https://data.economie.gouv.fr/api/v2/catalog/datasets/tarifs-bancaires-ccsf
```

## Structure des données

### Champs principaux
| Champ | Type | Description | Exemple |
|-------|------|-------------|---------|
| `bank_name` | string | Nom établissement | "BNP Paribas" |
| `bank_type` | string | Type établissement | "Banque nationale", "Banque régionale" |
| `service` | string | Service bancaire | "Carte Visa Classic" |
| `service_category` | string | Catégorie | "Moyens de paiement", "Incidents" |
| `price` | number | Tarif en euros | 45.00 |
| `price_type` | string | Type tarification | "Annuel", "Par opération", "Mensuel" |
| `date` | date | Date relevé | "2024-01-01" |
| `customer_type` | string | Type client | "Particulier", "Professionnel" |
| `special_conditions` | string | Conditions particulières | "Gratuit -25 ans" |

### Facettes disponibles
- `bank_name` - Établissements bancaires
- `service_category` - Catégories de services
- `customer_type` - Types de clientèle
- `price_type` - Modes de tarification

## Cas d'usage typiques

### 1. Comparateur de tarifs
- Table comparative multi-banques
- Filtres par service
- Mise en évidence min/max
- Calcul économies potentielles

### 2. Dashboard analytique
- Prix moyen par catégorie (bar chart)
- Evolution tarifaire (line chart)
- Répartition par banque (pie chart)
- Top services les plus chers (table)

### 3. Simulateur de frais
- Sélection profil utilisateur
- Calcul frais annuels
- Recommandations personnalisées

## Requêtes OQL fréquentes

### Comparaison carte bancaire
```sql
SELECT bank_name, price 
WHERE service = 'Carte Visa Classic' AND customer_type = 'Particulier'
ORDER BY price ASC
```

### Moyenne par catégorie
```sql
SELECT service_category, AVG(price) as avg_price, MIN(price) as min_price, MAX(price) as max_price
GROUP BY service_category
ORDER BY avg_price DESC
```

### Evolution temporelle banque
```sql
SELECT date, service, price 
WHERE bank_name = '{{BANK_NAME}}' 
ORDER BY date, service
```

## Points d'attention
- **Comparabilité**: Normaliser les services similaires
- **Périodicité**: Conversion annuelle pour comparaison
- **Exhaustivité**: Toutes banques pas toujours présentes
- **Conditions**: Afficher les conditions spéciales
- **Actualisation**: Données mises à jour trimestriellement