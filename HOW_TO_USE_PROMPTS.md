# 🚀 Comment utiliser le système de prompts modulaires

## 📋 Vue d'ensemble rapide

Le système de prompts peut être utilisé de **4 façons différentes** :

1. **Ligne de commande** (vous directement)
2. **Via Claude Code** (je peux le faire pour vous)
3. **Via le serveur MCP** (nouveau !)
4. **Via les agents** (automatisation)

## 1️⃣ Méthode 1 : Ligne de commande (Simple)

### Générer un prompt vous-même

```bash
# Format de base
node generate-widget-prompt.js [dataset] [widget] "votre requête"

# Exemples concrets
node generate-widget-prompt.js signalconso table "Créer une table avec tri et pagination"
node generate-widget-prompt.js budget-vert chart "Graphique du budget par mission"
node generate-widget-prompt.js tarifs-bancaires kpi "Indicateurs clés des tarifs"

# Options disponibles
--minimal    # Version courte (moins de tokens)
--analyze    # Affiche les statistiques
--save       # Sauvegarde dans un fichier
```

### Workflow complet
1. Générez le prompt dans votre terminal
2. Copiez le résultat
3. Collez dans Claude Code ou Claude.ai
4. Le modèle génère votre widget DSFR

## 2️⃣ Méthode 2 : Via Claude Code (Plus simple)

### Demandez-moi directement !

```
User: "Génère un prompt pour créer une table SignalConso avec filtres"
```

Je vais alors :
1. Lire les modules nécessaires
2. Assembler le prompt
3. Vous le présenter
4. L'utiliser pour générer le widget si vous voulez

### Exemples de commandes

```
# Génération simple
"Crée un prompt minimal pour un graphique budget-vert"

# Avec optimisation
"Génère un prompt optimisé (<2000 tokens) pour KPI tarifs bancaires"

# Génération directe du widget
"Utilise le système de prompts pour créer une table SignalConso, puis génère le widget"
```

## 3️⃣ Méthode 3 : Via MCP Server (Nouveau ! 🆕)

### Le serveur MCP est maintenant configuré !

J'ai maintenant accès à ces fonctions MCP :

```javascript
// Génération de prompt
mcp__mcp-prompts__generate_prompt({
  dataset: "signalconso",
  widget: "table",
  query: "Créer une table avec filtres",
  minimal: true
})

// Lister les modules disponibles
mcp__mcp-prompts__list_modules({
  category: "all"  // ou "core", "datasets", "widgets", etc.
})

// Estimer les tokens
mcp__mcp-prompts__estimate_tokens({
  text: "Votre texte à analyser"
})

// Optimiser un prompt existant
mcp__mcp-prompts__optimize_prompt({
  prompt: "Prompt long à optimiser",
  target_tokens: 2000
})

// Génération batch
mcp__mcp-prompts__batch_generate({
  requests: [
    { dataset: "signalconso", widget: "table", query: "Table simple" },
    { dataset: "budget-vert", widget: "chart", query: "Graphique" }
  ]
})
```

### Workflow avec MCP

```
User: "Crée une table SignalConso"
Claude: [utilise mcp__mcp-prompts__generate_prompt]
Claude: [récupère le prompt optimisé]
Claude: [génère directement le widget HTML/JS]
```

## 4️⃣ Méthode 4 : Via les Agents

### Agent prompt-generator (à créer)

```
Task: prompt-generator "Générer un prompt pour dashboard complet SignalConso"
```

L'agent va :
1. Analyser votre demande
2. Déterminer les widgets nécessaires
3. Générer les prompts optimaux
4. Les assembler pour un dashboard

## 📊 Comparaison des méthodes

| Méthode | Rapidité | Contrôle | Automatisation | Tokens |
|---------|----------|----------|----------------|---------|
| CLI | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ | Variable |
| Claude demande | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | Optimisé |
| MCP Server | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Optimisé |
| Agents | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | Optimisé |

## 🎯 Cas d'usage recommandés

### Pour une table simple
```bash
# CLI rapide
node generate-widget-prompt.js signalconso table "Table basique" --minimal
```

### Pour un dashboard complet
```
# Via Claude Code avec MCP
"Utilise mcp__mcp-prompts__batch_generate pour créer un dashboard SignalConso avec table, chart et KPIs"
```

### Pour de l'exploration
```
# Via Claude Code
"Montre-moi tous les modules disponibles pour budget-vert"
```

### Pour optimiser un prompt existant
```javascript
// Via MCP
mcp__mcp-prompts__optimize_prompt({
  prompt: "Votre long prompt ici",
  target_tokens: 1500
})
```

## 💡 Tips & Tricks

### 1. Mode minimal vs standard
- **Minimal** (~1500 tokens) : Pour requêtes simples
- **Standard** (~2500-3500 tokens) : Pour widgets complexes

### 2. Cache intelligent
Le système cache les modules chargés pour des performances optimales

### 3. Variables personnalisées
Vous pouvez ajouter vos propres variables dans les prompts

### 4. Estimation avant génération
```javascript
// Toujours estimer avant de générer
mcp__mcp-prompts__estimate_tokens({ text: "..." })
```

## 🆘 Troubleshooting

### Le serveur MCP ne répond pas
1. Redémarrez Claude Code
2. Vérifiez que le serveur est dans `.mcp.json`
3. Testez avec `node mcp-prompts/test.js`

### Prompt trop long
1. Utilisez `--minimal`
2. Ou optimisez avec `mcp__mcp-prompts__optimize_prompt`

### Module non trouvé
1. Vérifiez avec `mcp__mcp-prompts__list_modules`
2. Le module doit être dans `prompts/[category]/[name].md`

## 📝 Exemples concrets

### Exemple 1 : Table avec filtres
```bash
# CLI
node generate-widget-prompt.js signalconso table "Table avec recherche et tri" --minimal

# Ou via Claude Code
"Génère-moi un prompt minimal pour une table SignalConso avec recherche"
```

### Exemple 2 : Dashboard complet
```javascript
// Via MCP dans Claude Code
mcp__mcp-prompts__batch_generate({
  requests: [
    { dataset: "signalconso", widget: "kpi", query: "4 KPIs principaux" },
    { dataset: "signalconso", widget: "chart", query: "Évolution mensuelle" },
    { dataset: "signalconso", widget: "table", query: "Détails récents" },
    { dataset: "signalconso", widget: "map", query: "Répartition géographique" }
  ]
})
```

### Exemple 3 : Optimisation
```javascript
// Réduire un prompt à 2000 tokens max
mcp__mcp-prompts__optimize_prompt({
  prompt: promptLong,
  target_tokens: 2000
})
```

## 🎉 Résumé

Vous avez maintenant **4 façons** d'utiliser le système :

1. **CLI** : Contrôle total
2. **Claude demande** : Simple et conversationnel
3. **MCP Server** : Puissant et automatisé
4. **Agents** : Pour workflows complexes

Le plus simple pour vous : **Demandez-moi directement** et je m'occupe de tout avec le serveur MCP ! 🚀