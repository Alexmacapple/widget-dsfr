# Configuration MCP - Corrections appliquées

## Résumé des problèmes corrigés

### 1. Claude Code - `.claude/settings.json`

**Problème:**
- Champs non reconnus: `project`, `server`, `urls`, `mcp`
- Format incorrect des hooks (boolean au lieu d'array)

**Solution:**
- Suppression de tous les champs non valides
- Correction du format des hooks selon la documentation officielle
- Ne conserve que les champs autorisés: `hooks`, `env`

### 2. Claude Desktop - `claude_desktop_config.json`

**Problème:**
- Chemin incorrect pour ods-widgets (`index-final.js` au lieu de `server.js`)
- Serveur `ccusage` non installé

**Solution:**
- Correction du chemin vers `server.js`
- Suppression du serveur `ccusage`
- Conservation des 4 serveurs MCP fonctionnels

### 3. Cohérence entre plateformes

Les deux plateformes utilisent maintenant:
- **dsfr-mcp**: `/mcp-dsfr/src/index.js`
- **ods-widgets**: `/mcp-ods-widgets/server.js`
- **context7**: NPX package
- **angular-mcp**: NPX package

## Fichiers modifiés

1. **`.claude/settings.json`** - Configuration Claude Code simplifiée
2. **`~/Library/Application Support/Claude/claude_desktop_config.json`** - Configuration Desktop corrigée
3. **`setup-mcp.sh`** - Script d'installation automatique créé

## Instructions d'utilisation

### Installation automatique

```bash
# Depuis le répertoire du projet
./setup-mcp.sh
```

### Vérification manuelle

#### Claude Code
```bash
# Lancer depuis le répertoire du projet
cd /Users/alex/Desktop/widget-dsfr
claude

# Vérifier les serveurs MCP
/mcp list
```

#### Claude Desktop
1. Fermer complètement Claude Desktop (Cmd+Q)
2. Rouvrir Claude Desktop
3. Vérifier l'icône MCP en bas à droite

## Structure des serveurs MCP

| Serveur | Type | Commande | Description |
|---------|------|----------|-------------|
| dsfr-mcp | Local | `node mcp-dsfr/src/index.js` | Validation et génération DSFR |
| ods-widgets | Local | `node mcp-ods-widgets/server.js` | Widgets OpenDataSoft |
| context7 | NPX | `npx @upstash/context7-mcp` | Documentation |
| angular-mcp | NPX | `npx @progress/kendo-angular-mcp` | Support Angular/Kendo |

## En cas de problème

1. **Logs Claude Code**: `~/Library/Caches/claude-cli-nodejs/`
2. **Relancer l'installation**: `./setup-mcp.sh`
3. **Vérifier Node.js**: `node --version` (doit être installé)
4. **Tester manuellement**: 
   ```bash
   node mcp-dsfr/src/index.js
   node mcp-ods-widgets/server.js
   ```

## Résultat attendu

Après ces corrections:
- ✅ Plus d'erreurs de configuration dans Claude Code
- ✅ Tous les serveurs MCP connectés dans Claude Desktop
- ✅ Configuration cohérente entre les deux plateformes
- ✅ Installation simplifiée avec un seul script