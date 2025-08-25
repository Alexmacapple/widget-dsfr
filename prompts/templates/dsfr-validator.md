# Template: Validateur DSFR et Accessibilité

## Mission
Analyser et valider la conformité DSFR et RGAA du code HTML fourni.

## Code à analyser
```html
{{HTML_CODE}}
```

## Checklist de validation

### 1. Conformité DSFR ✓/✗

#### Structure
- [ ] Utilisation des classes DSFR officielles (fr-*)
- [ ] Structure de grille DSFR (fr-container, fr-grid-row, fr-col)
- [ ] Composants DSFR correctement implémentés
- [ ] Pas d'override des styles DSFR de base
- [ ] Thème Marianne appliqué

#### Composants
- [ ] Boutons: fr-btn avec variantes appropriées
- [ ] Tables: fr-table avec caption
- [ ] Formulaires: fr-input, fr-label, fr-fieldset
- [ ] Cards: fr-card avec structure correcte
- [ ] Navigation: fr-nav, fr-sidemenu, fr-pagination

#### Interdictions
- [ ] Aucun emoji dans les balises h1-h6
- [ ] Pas de styles inline (sauf nécessité absolue)
- [ ] Pas de classes non-DSFR pour les composants principaux

### 2. Accessibilité RGAA niveau AA ✓/✗

#### Structure sémantique
- [ ] Hiérarchie des titres respectée (h1>h2>h3...)
- [ ] Utilisation appropriée des balises HTML5
- [ ] Landmarks ARIA si nécessaire
- [ ] Skip links présents

#### Navigation
- [ ] Navigation clavier complète
- [ ] Focus visible sur tous les éléments interactifs
- [ ] Ordre de tabulation logique
- [ ] Pièges au clavier évités

#### Images et médias
- [ ] Alt text sur toutes les images
- [ ] Images décoratives avec alt=""
- [ ] Transcriptions pour audio/vidéo

#### Formulaires
- [ ] Labels associés à tous les champs
- [ ] Messages d'erreur explicites
- [ ] Champs obligatoires identifiés
- [ ] Groupements logiques avec fieldset/legend

#### Tableaux
- [ ] Caption descriptif présent
- [ ] En-têtes avec scope approprié
- [ ] Structure th/td correcte
- [ ] Summary si tableau complexe

#### Contraste et lisibilité
- [ ] Ratio 4.5:1 pour texte normal
- [ ] Ratio 3:1 pour texte large
- [ ] Texte redimensionnable à 200%
- [ ] Pas de texte en image

#### ARIA
- [ ] Rôles ARIA appropriés
- [ ] aria-label/aria-labelledby présents
- [ ] aria-live pour contenu dynamique
- [ ] États aria-expanded, aria-selected corrects

### 3. Performance et optimisation ✓/✗

- [ ] Pas de ressources bloquantes
- [ ] Images optimisées/lazy loading
- [ ] Minification CSS/JS en production
- [ ] Cache headers appropriés

### 4. Sécurité ✓/✗

- [ ] Données sanitisées (XSS prevention)
- [ ] HTTPS pour toutes les ressources
- [ ] CSP headers compatibles
- [ ] Pas de données sensibles exposées

## Rapport de validation

### Conformité globale
- **DSFR**: {{SCORE}}/100
- **RGAA**: {{SCORE}}/100
- **Performance**: {{SCORE}}/100
- **Sécurité**: {{SCORE}}/100

### Problèmes critiques
1. {{ISSUE}}: {{DESCRIPTION}}
   - Impact: {{IMPACT}}
   - Solution: {{SOLUTION}}
   - Code corrigé:
   ```html
   {{CORRECTED_CODE}}
   ```

### Problèmes majeurs
[Liste des problèmes avec solutions]

### Problèmes mineurs
[Liste des problèmes avec recommandations]

### Améliorations suggérées
[Optimisations optionnelles]

## Code corrigé complet

```html
{{VALIDATED_HTML}}
```

## Commandes de validation

Pour valider automatiquement:
```bash
# Validation DSFR
mcp__dsfr-mcp__validate_dsfr_html html_code:"[code]"

# Validation accessibilité
mcp__dsfr-mcp__check_accessibility html_code:"[code]"

# Test local
node tests/validate-dsfr.js [fichier]
```

## Ressources
- [Documentation DSFR](https://www.systeme-de-design.gouv.fr/)
- [Référentiel RGAA](https://www.numerique.gouv.fr/publications/rgaa-accessibilite/)
- [Outils de test](https://www.systeme-de-design.gouv.fr/outils/)