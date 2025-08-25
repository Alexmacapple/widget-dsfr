# Template: Analyseur de Dataset

## Mission
Analyser en profondeur le dataset {{DATASET_NAME}} pour recommander les meilleurs widgets DSFR.

## Analyse requise

### 1. Structure des données
- Lister tous les champs disponibles avec leurs types
- Identifier les champs clés (ID, dates, montants, catégories)
- Évaluer la qualité des données (valeurs manquantes, anomalies)
- Estimer le volume total

### 2. Dimensions analytiques
- **Temporelles**: Champs de type date/datetime
- **Géographiques**: Coordonnées, codes postaux, adresses
- **Catégorielles**: Champs pour regroupements
- **Numériques**: Métriques pour calculs/agrégations
- **Textuelles**: Champs pour recherche full-text

### 3. Recommandations de widgets

Pour chaque type de widget, évaluer la pertinence (score /10):

#### Table
- Pertinence: {{SCORE}}/10
- Colonnes suggérées: [liste]
- Filtres recommandés: [liste]
- Justification: ...

#### Chart (graphiques)
- Pertinence: {{SCORE}}/10
- Types suggérés: [bar, line, pie, etc.]
- Axes recommandés: X=[champ], Y=[champ]
- Justification: ...

#### Map (carte)
- Pertinence: {{SCORE}}/10
- Données géo disponibles: [oui/non]
- Type de visualisation: [markers, heatmap, choropleth]
- Justification: ...

#### KPI (indicateurs)
- Pertinence: {{SCORE}}/10
- Métriques suggérées: [total, moyenne, taux, etc.]
- Période de comparaison: [mois, année]
- Justification: ...

#### Facets (filtres)
- Pertinence: {{SCORE}}/10
- Dimensions filtrables: [liste]
- Type de filtres: [checkbox, radio, range]
- Justification: ...

### 4. Cas d'usage identifiés

Lister 3-5 cas d'usage concrets:
1. **[Titre]**: Description du besoin et widget(s) recommandé(s)
2. **[Titre]**: Description du besoin et widget(s) recommandé(s)
3. **[Titre]**: Description du besoin et widget(s) recommandé(s)

### 5. Requêtes OQL suggérées

```sql
-- Top 10 des valeurs
SELECT {{field}}, COUNT(*) as count
GROUP BY {{field}}
ORDER BY count DESC
LIMIT 10
```

```sql
-- Evolution temporelle
SELECT DATE_TRUNC('month', {{date_field}}) as month, COUNT(*) as count
GROUP BY month
ORDER BY month
```

### 6. Points d'attention
- Limitations identifiées
- Données sensibles à masquer
- Performances à optimiser
- Mises à jour de données

## Requête utilisateur
{{USER_QUERY}}

## Output format
Répondre sous forme de rapport structuré en markdown avec:
- Résumé exécutif
- Analyse détaillée
- Recommandations priorisées
- Exemples de code si pertinent