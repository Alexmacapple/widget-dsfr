# Dépendances des 11 Serveurs MCP - Widget DSFR v4.1

## 📦 Vue d'ensemble

Ce document détaille toutes les dépendances nécessaires pour faire fonctionner les 11 serveurs MCP du projet Widget DSFR.

## 🔧 Dépendances par Serveur MCP

### 1. **dsfr-mcp** (Local)
- **Type**: Serveur Node.js local
- **Fichier**: `mcp-dsfr/src/index.js`
- **Dépendances**:
  - `@modelcontextprotocol/sdk` (SDK MCP)
  - Dépendances internes dans `mcp-dsfr/package.json`
- **Installation**: `cd mcp-dsfr && npm install`

### 2. **ods-widgets** (Local)
- **Type**: Serveur Node.js local
- **Fichier**: `mcp-ods-widgets/server.js`
- **Dépendances**:
  - `@modelcontextprotocol/sdk` (SDK MCP)
  - `express`, `cors`, `axios`
  - Dépendances internes dans `mcp-ods-widgets/package.json`
- **Installation**: `cd mcp-ods-widgets && npm install`

### 3. **context7** (NPX)
- **Package**: `@upstash/context7-mcp`
- **Installation**: Automatique via npx
- **Dépendances**: Gérées automatiquement

### 4. **angular-mcp** (NPX)
- **Package**: `@progress/kendo-angular-mcp`
- **Installation**: Automatique via npx
- **Dépendances**: Gérées automatiquement

### 5. **sequential-thinking** (NPX)
- **Package**: `@modelcontextprotocol/server-sequential-thinking`
- **Installation**: `npm install -g @modelcontextprotocol/server-sequential-thinking`
- **Dépendances**: `@modelcontextprotocol/sdk`

### 6. **semgrep** (NPX + Binaire)
- **Package**: `mcp-server-semgrep`
- **Installation**: 
  - `npm install -g mcp-server-semgrep`
  - `brew install semgrep` (macOS) ou `pip install semgrep` (Linux)
- **Dépendances**:
  - `@modelcontextprotocol/sdk`
  - Binaire Semgrep installé sur le système

### 7. **git** (NPX)
- **Package**: `mcp-git`
- **Installation**: `npm install -g mcp-git`
- **Dépendances**: Git installé sur le système

### 8. **basic-memory** (NPX)
- **Package**: `@modelcontextprotocol/server-memory`
- **Installation**: `npm install -g @modelcontextprotocol/server-memory`
- **Dépendances**: `@modelcontextprotocol/sdk`

### 9. **knowledge-graph** (NPX)
- **Package**: `mcp-knowledge-graph`
- **Installation**: `npm install -g mcp-knowledge-graph`
- **Dépendances**: `@modelcontextprotocol/sdk`

### 10. **playwright** (NPX)
- **Package**: `@playwright/mcp`
- **Installation**: `npm install -g @playwright/mcp`
- **Dépendances**: Navigateurs Playwright (installés automatiquement)

### 11. **github** (NPX)
- **Package**: `@modelcontextprotocol/server-github`
- **Installation**: `npm install -g @modelcontextprotocol/server-github`
- **Dépendances**: 
  - `@modelcontextprotocol/sdk`
  - Token GitHub (optionnel, via GITHUB_PERSONAL_ACCESS_TOKEN)

## 🛠️ Installation Complète

### Script d'installation automatique
```bash
./install-mcp-complete.sh
```

### Installation manuelle des dépendances globales
```bash
# SDK MCP (requis par plusieurs serveurs)
npm install -g @modelcontextprotocol/sdk

# Tous les serveurs MCP
npm install -g \
  @upstash/context7-mcp \
  @progress/kendo-angular-mcp \
  @modelcontextprotocol/server-sequential-thinking \
  mcp-server-semgrep \
  mcp-git \
  @modelcontextprotocol/server-memory \
  mcp-knowledge-graph \
  @playwright/mcp \
  @modelcontextprotocol/server-github

# Semgrep (macOS)
brew install semgrep

# Semgrep (Linux)
pip install semgrep
```

## 📋 Vérification de l'installation

### Vérifier les packages npm globaux
```bash
npm list -g --depth=0 | grep -E "(mcp|modelcontextprotocol|playwright|upstash|progress)"
```

### Vérifier Semgrep
```bash
semgrep --version
```

### Tester la connexion MCP dans Claude
```bash
# Dans Claude Desktop/Code, tapez:
/mcp
```

## 🔍 Résolution des problèmes

### Erreur "Cannot find package '@modelcontextprotocol/sdk'"
```bash
npm install -g @modelcontextprotocol/sdk
```

### Erreur Semgrep "externally-managed-environment"
Sur macOS, utilisez Homebrew au lieu de pip:
```bash
brew install semgrep
```

### Serveur MCP ne se connecte pas
1. Vérifier que le package est installé globalement
2. Redémarrer Claude Desktop/Code
3. Vérifier les chemins dans `.mcp.json`

## 📊 Tableau récapitulatif

| Serveur | Type | Package NPM | Dépendances Système |
|---------|------|-------------|---------------------|
| dsfr-mcp | Local | - | Node.js 18+ |
| ods-widgets | Local | - | Node.js 18+ |
| context7 | NPX | @upstash/context7-mcp | - |
| angular-mcp | NPX | @progress/kendo-angular-mcp | - |
| sequential-thinking | NPX | @modelcontextprotocol/server-sequential-thinking | - |
| semgrep | NPX | mcp-server-semgrep | Semgrep binaire |
| git | NPX | mcp-git | Git |
| basic-memory | NPX | @modelcontextprotocol/server-memory | - |
| knowledge-graph | NPX | mcp-knowledge-graph | - |
| playwright | NPX | @playwright/mcp | - |
| github | NPX | @modelcontextprotocol/server-github | - |

## 🚀 Utilisation

Une fois toutes les dépendances installées :

1. Redémarrer Claude Desktop/Code
2. Vérifier la connexion avec `/mcp`
3. Les 11 serveurs MCP sont maintenant disponibles

---
*Dernière mise à jour : Version 4.1 - 11 serveurs MCP*