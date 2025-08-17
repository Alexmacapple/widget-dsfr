# 🚀 Guide de Démarrage - Widget Builder Pro DSFR/ODS

## Vue d'ensemble
Ce guide vous accompagne dans le démarrage rapide de l'implémentation du Widget Builder Pro avec ses 4 serveurs MCP configurés.

---

## 📋 Checklist de Préparation

### Prérequis Techniques
- [ ] Node.js 18+ installé
- [ ] Docker & Docker Compose
- [ ] Git configuré
- [ ] 8GB RAM minimum
- [ ] Accès aux 4 serveurs MCP

### Serveurs MCP Opérationnels
- [ ] **DSFR-MCP** : `/Users/alex/Desktop/MCP-DSFR/src/index.js`
- [ ] **ODS-Widgets** : `/Users/alex/Desktop/widget-dsfr/mcp-ods-widgets/src/index-final.js`
- [ ] **ODS-Docs** : Git Ingest + DeepWiki configurés
- [ ] **Context7** : NPM package accessible

---

## 🏗️ Structure du Projet

```bash
widget/
├── services/
│   ├── core-engine/        # Port 3000 - Moteur principal
│   ├── widget-builder/     # Port 3001 - Interface builder
│   ├── mcp-bridge/         # Port 3002 - Orchestrateur MCP
│   ├── storage-service/    # Port 3003 - Gestion données
│   └── api-gateway/        # Port 3004 - Point d'entrée
├── mcp-servers/
│   └── ods-docs-parser.js  # Parser documentation ODS
├── shared/
│   ├── types/              # Types TypeScript partagés
│   └── utils/              # Utilitaires communs
└── docker-compose.yml
```

---

## 📦 Installation Rapide

### 1. Cloner et Initialiser

```bash
# Depuis le répertoire widget existant
cd /Users/alex/Desktop/widget

# Initialiser les services
npm init -y
npm install -D typescript @types/node ts-node nodemon
npm install express cors dotenv
```

### 2. Configuration TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["services/**/*", "mcp-servers/**/*", "shared/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3. Configuration des Variables d'Environnement

```bash
# .env
NODE_ENV=development

# Services
CORE_ENGINE_PORT=3000
WIDGET_BUILDER_PORT=3001
MCP_BRIDGE_PORT=3002
STORAGE_SERVICE_PORT=3003
API_GATEWAY_PORT=3004

# MCP Paths
DSFR_MCP_PATH=/Users/alex/Desktop/MCP-DSFR/src/index.js
ODS_WIDGETS_MCP_PATH=/Users/alex/Desktop/widget-dsfr/mcp-ods-widgets/src/index-final.js
GIT_INGEST_PATH=/Users/alex/Desktop/widget-dsfr/_old/git-ingest/opendatasoft-ods-widgets-8a5edab282632443.txt

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# MongoDB
MONGODB_URI=mongodb://localhost:27017/widget-builder
```

---

## 🎯 Démarrage Rapide - MVP en 3 Étapes

### Étape 1 : Créer le Parser ODS Documentation

```javascript
// mcp-servers/ods-docs-parser.js
const fs = require('fs').promises;
const path = require('path');

class ODSDocsParser {
  constructor() {
    this.gitIngestPath = process.env.GIT_INGEST_PATH;
    this.widgetsCache = new Map();
    this.initialize();
  }
  
  async initialize() {
    console.log('🔍 Chargement documentation ODS...');
    try {
      const content = await fs.readFile(this.gitIngestPath, 'utf-8');
      this.parseWidgets(content);
      console.log(`✅ ${this.widgetsCache.size} widgets documentés`);
    } catch (error) {
      console.error('❌ Erreur chargement:', error);
    }
  }
  
  parseWidgets(content) {
    // Parser le contenu git-ingest
    const widgetPattern = /ods-widgets\.directive:(\w+)/g;
    let match;
    while ((match = widgetPattern.exec(content)) !== null) {
      this.widgetsCache.set(match[1], {
        name: match[1],
        available: true
      });
    }
  }
  
  getWidget(name) {
    return this.widgetsCache.get(name);
  }
  
  getAllWidgets() {
    return Array.from(this.widgetsCache.keys());
  }
}

// Export pour utilisation MCP
if (require.main === module) {
  const parser = new ODSDocsParser();
  
  // Interface MCP simple
  process.on('message', async (msg) => {
    const { method, params, id } = msg;
    
    let result;
    switch(method) {
      case 'getWidget':
        result = parser.getWidget(params.name);
        break;
      case 'getAllWidgets':
        result = parser.getAllWidgets();
        break;
      default:
        result = { error: 'Method not found' };
    }
    
    process.send({ id, result });
  });
}

module.exports = ODSDocsParser;
```

### Étape 2 : Gateway MCP Unifié Simplifié

```typescript
// services/mcp-bridge/gateway.ts
import { spawn } from 'child_process';
import * as path from 'path';

export class MCPGateway {
  private servers: Map<string, any> = new Map();
  
  constructor() {
    this.initializeServers();
  }
  
  private initializeServers() {
    // DSFR MCP
    this.servers.set('dsfr', {
      command: 'node',
      args: [process.env.DSFR_MCP_PATH!]
    });
    
    // ODS Widgets MCP
    this.servers.set('ods', {
      command: 'node',
      args: [process.env.ODS_WIDGETS_MCP_PATH!]
    });
    
    // ODS Docs Parser
    this.servers.set('docs', {
      command: 'node',
      args: ['./mcp-servers/ods-docs-parser.js']
    });
    
    console.log('✅ Gateway MCP initialisé');
  }
  
  async callMCP(server: string, method: string, params: any) {
    // Implémentation simplifiée pour MVP
    console.log(`📡 Appel MCP: ${server}.${method}`);
    
    // Simulation pour MVP
    return {
      success: true,
      data: `Réponse de ${server}`,
      method,
      params
    };
  }
  
  async generateWidget(widgetType: string, dataset: any) {
    // Appels parallèles aux MCP
    const [odsWidget, dsfrComponent, documentation] = await Promise.all([
      this.callMCP('ods', 'createWidget', { type: widgetType }),
      this.callMCP('dsfr', 'generateComponent', { type: widgetType }),
      this.callMCP('docs', 'getWidget', { name: widgetType })
    ]);
    
    return {
      widget: odsWidget,
      dsfr: dsfrComponent,
      docs: documentation,
      timestamp: new Date().toISOString()
    };
  }
}
```

### Étape 3 : API Endpoint Minimal

```typescript
// services/api-gateway/index.ts
import express from 'express';
import cors from 'cors';
import { MCPGateway } from '../mcp-bridge/gateway';

const app = express();
const gateway = new MCPGateway();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    services: {
      gateway: 'ready',
      mcp_servers: 4
    }
  });
});

// Liste des widgets disponibles
app.get('/api/widgets', async (req, res) => {
  const widgets = [
    'odsTable', 'odsChart', 'odsMap', 'odsFacets',
    'odsCalendar', 'odsGauge', 'odsTimeline'
  ];
  res.json({ widgets, total: widgets.length });
});

// Générer un widget
app.post('/api/widgets/generate', async (req, res) => {
  const { type, dataset, config } = req.body;
  
  try {
    const result = await gateway.generateWidget(type, dataset);
    res.json({
      success: true,
      widget: result,
      preview_url: `/preview/${type}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.API_GATEWAY_PORT || 3004;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway démarré sur port ${PORT}`);
});
```

---

## 🧪 Test Rapide de l'Installation

### 1. Script de Test MCP

```bash
# test-mcp.sh
#!/bin/bash

echo "🔍 Test des serveurs MCP..."

# Test DSFR-MCP
echo "Testing DSFR-MCP..."
node -e "console.log('DSFR-MCP path exists:', require('fs').existsSync('$DSFR_MCP_PATH'))"

# Test ODS-Widgets
echo "Testing ODS-Widgets MCP..."
node -e "console.log('ODS-MCP path exists:', require('fs').existsSync('$ODS_WIDGETS_MCP_PATH'))"

# Test Git Ingest
echo "Testing Git Ingest file..."
node -e "console.log('Git Ingest exists:', require('fs').existsSync('$GIT_INGEST_PATH'))"

# Test Context7
echo "Testing Context7..."
npx @upstash/context7-mcp@latest --version

echo "✅ Tests terminés"
```

### 2. Lancement des Services

```json
// package.json scripts
{
  "scripts": {
    "dev": "npm run dev:gateway",
    "dev:gateway": "nodemon services/api-gateway/index.ts",
    "dev:mcp": "node mcp-servers/ods-docs-parser.js",
    "test:mcp": "bash test-mcp.sh",
    "build": "tsc",
    "start": "node dist/services/api-gateway/index.js"
  }
}
```

### 3. Premier Test API

```bash
# Démarrer le gateway
npm run dev

# Dans un autre terminal, tester l'API
curl http://localhost:3004/health

# Lister les widgets
curl http://localhost:3004/api/widgets

# Générer un widget
curl -X POST http://localhost:3004/api/widgets/generate \
  -H "Content-Type: application/json" \
  -d '{"type":"odsTable","dataset":"signalconso"}'
```

---

## 📊 Interface de Test HTML

```html
<!-- test-widget-builder.html -->
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Widget Builder Pro - Test</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.min.css">
</head>
<body>
    <div class="fr-container">
        <h1>🚀 Widget Builder Pro - Interface de Test</h1>
        
        <div class="fr-grid-row fr-grid-row--gutters">
            <div class="fr-col-4">
                <h2>Widgets Disponibles</h2>
                <div id="widget-list"></div>
            </div>
            
            <div class="fr-col-8">
                <h2>Prévisualisation</h2>
                <div id="preview" class="fr-callout">
                    <p>Sélectionnez un widget</p>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // Charger la liste des widgets
        fetch('http://localhost:3004/api/widgets')
            .then(r => r.json())
            .then(data => {
                const list = document.getElementById('widget-list');
                data.widgets.forEach(w => {
                    const btn = document.createElement('button');
                    btn.className = 'fr-btn fr-btn--secondary fr-mb-1w';
                    btn.textContent = w;
                    btn.onclick = () => generateWidget(w);
                    list.appendChild(btn);
                });
            });
        
        function generateWidget(type) {
            fetch('http://localhost:3004/api/widgets/generate', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({type, dataset: 'test'})
            })
            .then(r => r.json())
            .then(data => {
                document.getElementById('preview').innerHTML = 
                    `<pre>${JSON.stringify(data, null, 2)}</pre>`;
            });
        }
    </script>
</body>
</html>
```

---

## 🎯 Prochaines Étapes Immédiates

### Jour 1-2 : Configuration de Base
- [ ] Installer les dépendances NPM
- [ ] Configurer TypeScript
- [ ] Créer la structure de dossiers
- [ ] Tester les 4 serveurs MCP

### Jour 3-4 : MVP Gateway
- [ ] Implémenter le parser ODS docs
- [ ] Créer le gateway MCP unifié
- [ ] Tester l'API de base
- [ ] Valider la communication MCP

### Jour 5 : Premier Widget
- [ ] Choisir odsTable comme widget pilote
- [ ] Générer avec DSFR-MCP
- [ ] Tester avec SignalConso
- [ ] Créer la preview HTML

---

## ⚡ Commandes Utiles

```bash
# Installation complète
npm install

# Tests MCP
npm run test:mcp

# Développement
npm run dev

# Build production
npm run build

# Docker
docker-compose up -d

# Logs
docker-compose logs -f api-gateway
```

---

## 📞 Support & Ressources

- **Documentation ODS** : https://help.opendatasoft.com/widgets/
- **DSFR** : https://www.systeme-de-design.gouv.fr/
- **MCP Servers** : Voir MCP_CONFIGURATION_COMPLETE.md
- **Architecture** : Voir ARCHITECTURE_MICROSERVICES.md

---

## ✅ Validation du Démarrage

Votre installation est réussie si :
1. ✅ L'API répond sur http://localhost:3004/health
2. ✅ Les 4 serveurs MCP sont accessibles
3. ✅ La génération de widget retourne un JSON
4. ✅ L'interface de test affiche les widgets

Bon développement ! 🚀