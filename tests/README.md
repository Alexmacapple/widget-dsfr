# Tests du projet Widget Builder DSFR/ODS

Ce dossier contient les tests de validation et de conformité pour le projet.

## Tests disponibles

### 1. Tests généraux (`run-tests.js`)
Vérifie l'intégrité globale du projet :
- Présence des fichiers essentiels
- Structure des dossiers
- Classes DSFR dans le HTML
- Absence d'emojis dans les titres
- Attributs d'accessibilité
- CDN correctement référencés
- Configuration MCP
- Présence d'exemples

**Exécution :**
```bash
npm test
# ou
node tests/run-tests.js
```

### 2. Validation DSFR (`validate-dsfr.js`)
Vérifie la conformité aux standards du Design System France :
- Version DSFR utilisée
- Langue du document
- Thème configuré
- Structure DSFR (header, container, footer)
- Utilisation des composants DSFR
- Accessibilité RGAA
- Absence d'emojis dans les titres

**Exécution :**
```bash
npm run validate
# ou
node tests/validate-dsfr.js
```

## Résultats attendus

✅ **Tests réussis** : Le projet est conforme et prêt pour la production
⚠️ **Avertissements** : Des améliorations peuvent être apportées
❌ **Erreurs** : Des corrections sont nécessaires

## Score de conformité

Le validateur DSFR calcule un score sur 100 :
- 100/100 : Parfaitement conforme
- 90-99 : Très bonne conformité
- 80-89 : Bonne conformité avec quelques ajustements
- < 80 : Nécessite des corrections importantes

## Extension des tests

Pour ajouter de nouveaux tests, créez un fichier JavaScript dans ce dossier et suivez le modèle existant.

---

*Tests créés pour le projet Widget Builder DSFR/ODS v2.0*