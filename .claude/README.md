# Configuration Claude Code pour Widget DSFR

Ce répertoire contient la configuration automatique pour Claude Code.

## Fonctionnalités automatiques

### 🚀 Démarrage automatique du serveur web

Le serveur web démarre automatiquement à l'ouverture du projet dans Claude Code :
- Port par défaut : 8080
- Port de secours : 8081
- Recherche automatique d'un port libre si nécessaire

### 🛑 Arrêt automatique

Le serveur s'arrête automatiquement à la fermeture du projet.

## Structure

```
.claude/
├── hooks/
│   ├── on-project-open     # Script exécuté à l'ouverture
│   └── on-project-close    # Script exécuté à la fermeture
├── settings.json           # Configuration du projet
└── README.md              # Cette documentation
```

## Hooks disponibles

### on-project-open
- Démarre automatiquement le serveur web Python
- Vérifie la disponibilité des ports
- Affiche les URLs d'accès principales
- Sauvegarde le PID pour un arrêt propre

### on-project-close
- Arrête le serveur web démarré automatiquement
- Nettoie les fichiers temporaires

## Configuration (settings.json)

- **project** : Métadonnées du projet
- **hooks** : Activation et chemins des hooks
- **server** : Configuration du serveur web
- **urls** : URLs principales du projet
- **mcp** : Configuration des serveurs MCP

## Gestion manuelle

Si besoin, vous pouvez gérer manuellement le serveur :

```bash
# Démarrer manuellement
./start-web-server.sh

# Arrêter manuellement
./stop-web-server.sh
```

## Logs

Les logs du serveur sont sauvegardés dans `/tmp/widget-server.log`

## Dépannage

Si le serveur ne démarre pas automatiquement :
1. Vérifiez que Python 3 est installé
2. Vérifiez les permissions des scripts dans `.claude/hooks/`
3. Consultez les logs dans `/tmp/widget-server.log`