# Guide d'Intégration : Système de Prompts + Claude Code

## 🎯 Vue d'ensemble

Le système de prompts modulaires peut être utilisé de **4 façons différentes** selon qui l'utilise et comment.

## 1️⃣ Utilisation par VOUS (l'utilisateur)

### Option A : Génération directe en CLI
```bash
# Vous tapez dans votre terminal
node generate-widget-prompt.js signalconso table "Créer une table avec filtres"

# Le prompt est généré, vous le copiez
# Vous le collez dans Claude Code ou Claude.ai
```

### Option B : Demander à Claude Code
```
# Dans Claude Code, vous demandez simplement :
"Génère-moi un prompt pour créer un widget table SignalConso"

# Claude Code utilise les outils Bash/Read pour :
1. Lire les modules dans prompts/
2. Assembler le prompt
3. Vous le présenter
```

## 2️⃣ Utilisation par CLAUDE CODE (moi)

### Actuellement, je peux :

```javascript
// 1. Lire les modules
const taskModule = await Read('prompts/core/task-description.md')
const datasetModule = await Read('prompts/datasets/signalconso.md')
const widgetModule = await Read('prompts/widgets/table.md')

// 2. Assembler manuellement
const prompt = taskModule + datasetModule + widgetModule

// 3. Ou utiliser l'assembleur via Bash
await Bash('node prompts/assembler.js ...')
```

### Ce qui serait mieux : Un serveur MCP dédié

```javascript
// Idéalement, on aurait :
mcp__prompts__generate_prompt({
  dataset: "signalconso",
  widget: "table",
  query: "Créer une table",
  minimal: true
})

// Qui retournerait directement le prompt optimisé
```

## 3️⃣ Utilisation par les AGENTS

### Agent actuel (widget-generator)
```javascript
// L'agent peut utiliser le système via Task
Task: {
  subagent_type: "widget-generator",
  prompt: "Utilise prompts/assembler.js pour générer un prompt table SignalConso"
}
```

### Avec un MCP Server (meilleure solution)
```javascript
// L'agent appellerait directement
mcp__prompts__generate_prompt(...)
```

## 4️⃣ Architecture idéale avec MCP

### Créons un serveur MCP pour les prompts :

```
mcp-prompts/
├── server.js          # Serveur MCP
├── index.js           # Point d'entrée
└── package.json       # Config npm

Fonctions exposées :
- generate_prompt(dataset, widget, query, options)
- list_available_modules()
- get_module_content(module_path)
- estimate_tokens(prompt)
- optimize_prompt(prompt)
```

## 🔄 Workflows possibles

### Workflow 1 : Manuel
```
User → Terminal → node generate-widget-prompt.js → Copier/Coller → Claude
```

### Workflow 2 : Semi-automatique
```
User → Claude Code → "Génère un prompt pour X" → Claude lit/assemble → Prompt
```

### Workflow 3 : Automatique (avec MCP)
```
User → Claude Code → mcp__prompts__generate → Widget directement
```

### Workflow 4 : Agent orchestré
```
User → Claude Code → Agent → Système prompts → Génération widget
```

## 🚀 Implémentation rapide

### Option 1 : Commande Slash (immédiat)
Je peux créer une commande pour Claude Code :
```
/prompt table signalconso "Ma requête"
```

### Option 2 : Agent spécialisé
```javascript
// agents/prompt-generator.md
Rôle : Générer des prompts optimisés
Outils : Read, Bash, assembler.js
```

### Option 3 : Serveur MCP (optimal)
```javascript
// mcp-prompts/server.js
// Expose toutes les fonctions du système
```

## 📝 Exemples concrets

### Vous voulez un widget table :

#### Méthode actuelle (manuelle)
```bash
# Terminal
node generate-widget-prompt.js signalconso table "Table avec filtres"
# Copier le résultat
# Coller dans Claude Code
```

#### Avec intégration Claude Code
```
# Dans Claude Code
User: "Génère un prompt pour table SignalConso avec filtres"
Claude: [lit les modules, assemble, présente le prompt]
User: "Maintenant utilise ce prompt pour créer le widget"
Claude: [génère le widget HTML/JS]
```

#### Avec MCP (futur)
```
# Dans Claude Code
User: "Crée une table SignalConso avec filtres"
Claude: [appelle mcp__prompts__generate]
Claude: [utilise le prompt pour générer directement]
```

## ❓ Questions clés

1. **Préférez-vous** :
   - A) Garder le contrôle manuel (CLI) ?
   - B) Tout automatiser via Claude Code ?
   - C) Un mix des deux ?

2. **Pour les agents** :
   - Voulez-vous qu'ils génèrent leurs propres prompts ?
   - Ou utiliser des prompts pré-définis ?

3. **Priorité** :
   - Rapidité d'exécution ?
   - Contrôle sur le processus ?
   - Optimisation des tokens ?

## 🎯 Recommandation

Je recommande de créer un **serveur MCP dédié** pour les prompts :

1. **Plus simple** : `mcp__prompts__generate(...)` 
2. **Plus rapide** : Pas de lecture fichier par fichier
3. **Plus puissant** : Cache, optimisation, versions
4. **Intégré** : Fonctionne avec tous les agents

Voulez-vous que je crée ce serveur MCP maintenant ?