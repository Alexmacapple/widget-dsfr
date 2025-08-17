# MCP DSFR pour Widget Builder

Version minimale et optimisée du serveur MCP DSFR pour le projet Widget Builder.

## Structure

```
mcp-dsfr/
├── src/
│   └── index.js          # Serveur MCP principal (16 outils)
├── data/                 # Index et métadonnées DSFR
├── fiches-markdown-v2/   # Documentation DSFR (213 fichiers)
├── scripts/
│   └── test-mcp.js      # Test basique
└── package.json         # Dépendances minimales
```

## Utilisation

```bash
# Test du serveur
npm test

# Démarrage direct
npm start
```

## Outils disponibles

- search_dsfr_components
- get_component_details
- generate_dsfr_component
- validate_dsfr_html
- check_accessibility
- Et 11 autres...

## Intégration

Configuré dans `.mcp.json` du projet parent pour utilisation avec Claude.