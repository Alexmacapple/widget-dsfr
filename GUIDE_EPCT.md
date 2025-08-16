# Guide EPCT - Méthode de Développement Structurée

## Vue d'ensemble
EPCT est une méthode de développement en 4 phases pour garantir la qualité et l'efficacité du code produit.

---

## Phase 1 : EXPLORER (15-20% du temps)

### Objectifs
- Comprendre le contexte complet du projet
- Identifier les dépendances et contraintes
- Localiser les fichiers pertinents
- Analyser les patterns existants

### Actions
```bash
# Utiliser les agents parallèles pour explorer
/search "pattern à chercher"
/grep "terme spécifique"
```

### Checklist Explorer
- [ ] Lire CLAUDE.md et les documents référencés
- [ ] Identifier les fichiers existants liés à la tâche
- [ ] Vérifier les dépendances (package.json, imports)
- [ ] Analyser les conventions de code utilisées
- [ ] Noter les contraintes techniques (DSFR, RGAA, etc.)

### Output attendu
- Liste des fichiers à modifier
- Compréhension des contraintes
- Identification des patterns à suivre

---

## Phase 2 : PLANIFIER (20-25% du temps)

### Objectifs
- Définir une approche claire et structurée
- Anticiper les problèmes potentiels
- Établir les critères de succès
- Prévoir les tests nécessaires

### Structure du Plan
```markdown
## Plan d'implémentation

### 1. Modifications nécessaires
- Fichier X : [modifications]
- Fichier Y : [modifications]

### 2. Ordre d'exécution
1. Étape 1 : [description]
2. Étape 2 : [description]
3. ...

### 3. Tests à effectuer
- [ ] Test fonctionnel
- [ ] Validation DSFR
- [ ] Accessibilité RGAA

### 4. Risques identifiés
- Risque 1 : [mitigation]
- Risque 2 : [mitigation]
```

### Checklist Planifier
- [ ] Plan écrit et structuré
- [ ] Étapes ordonnées logiquement
- [ ] Tests définis
- [ ] Risques identifiés avec mitigations
- [ ] Validation des standards (DSFR, RGAA)

---

## Phase 3 : CODER (40-50% du temps)

### Règles CRITIQUES
- **TOUJOURS itérer sur le fichier existant**
- **NE JAMAIS créer de nouveau fichier sans demande explicite**
- **Utiliser Edit/MultiEdit pour les modifications**
- **Commiter mentalement après chaque modification réussie**

### Process de Codage
1. **Ouvrir le fichier cible** (Read)
2. **Faire les modifications** (Edit/MultiEdit)
3. **Vérifier la syntaxe**
4. **Itérer jusqu'à satisfaction**
5. **NE PAS passer au fichier suivant** tant que celui-ci n'est pas terminé

### Standards à respecter
```javascript
// DSFR - Toujours utiliser les classes officielles
class="fr-btn fr-btn--primary"

// RGAA - Toujours inclure l'accessibilité
aria-label="Description claire"
role="button"

// Pas d'emojis dans le code HTML
<h1>Titre sans emoji</h1>  // ✅
<h1>🎯 Titre avec emoji</h1>  // ❌
```

### Checklist Coder
- [ ] Fichier existant modifié (pas de nouveau fichier)
- [ ] Code suit les conventions du projet
- [ ] Composants DSFR validés via MCP
- [ ] Accessibilité RGAA intégrée
- [ ] Pas d'emojis dans les titres HTML
- [ ] Code commenté si nécessaire

---

## Phase 4 : TESTER (10-15% du temps)

### Types de Tests

#### 1. Tests Fonctionnels
```bash
# Vérifier que le code fonctionne
node fichier.js
npm test
```

#### 2. Validation DSFR
```javascript
// Vérifier via MCP DSFR
mcp.dsfr.validate(component)
```

#### 3. Tests Accessibilité
- Navigation clavier (Tab, Enter, Escape)
- Lecteur d'écran (NVDA/JAWS)
- Contraste des couleurs (4.5:1 minimum)

#### 4. Tests Cross-browser
- Chrome/Edge
- Firefox
- Safari

### Checklist Tester
- [ ] Code s'exécute sans erreur
- [ ] Fonctionnalité testée manuellement
- [ ] Validation DSFR passée
- [ ] Accessibilité RGAA vérifiée
- [ ] Tests dans au moins 2 navigateurs

### Si les tests échouent
➜ **Retour à la phase PLANIFIER** pour ajuster l'approche

---

## Exemples d'Application EPCT

### Exemple 1 : Créer un widget Table DSFR

#### EXPLORER (5 min)
- Lire `GUIDE_GENERATION_WIDGETS_HTML.md`
- Vérifier `examples/signalconso-table-001.html`
- Identifier le gabarit `widget.html`

#### PLANIFIER (10 min)
```
1. Modifier examples/signalconso-table-001.html
2. Ajouter composants DSFR via MCP
3. Configurer connexion data.economie.gouv.fr
4. Tests : RGAA, responsive, données temps réel
```

#### CODER (20 min)
- Edit sur `signalconso-table-001.html`
- Itérations multiples sur le même fichier
- Validation MCP à chaque composant DSFR

#### TESTER (5 min)
- Ouvrir dans navigateur
- Vérifier données temps réel
- Test navigation clavier
- Validation contraste

### Exemple 2 : Ajouter filtres à un widget

#### EXPLORER (3 min)
- Analyser widget existant
- Chercher exemples de filtres DSFR
- Vérifier API ODS pour facettes

#### PLANIFIER (5 min)
```
1. Ajouter fr-sidemenu pour filtres
2. Implémenter ods-facets
3. Lier filtres et résultats
4. Tests : filtrage effectif, responsive
```

#### CODER (15 min)
- MultiEdit sur le fichier HTML
- Ajout progressif : structure → style → logique
- Pas de nouveau fichier

#### TESTER (3 min)
- Test chaque filtre
- Vérifier cumul de filtres
- Test mobile

---

## Commandes Utiles EPCT

### Phase Explorer
```bash
grep -r "pattern" .
find . -name "*.html"
ls -la dossier/
```

### Phase Planifier
```bash
# Créer un plan dans le chat
# Utiliser TodoWrite pour tracker
```

### Phase Coder
```bash
# Toujours Edit/MultiEdit
# Jamais Write sauf demande explicite
```

### Phase Tester
```bash
npm test
open fichier.html
# Validation manuelle
```

---

## Anti-patterns à éviter

### ❌ NE PAS FAIRE
1. **Créer un nouveau fichier** quand un fichier existe déjà
2. **Coder sans explorer** le contexte
3. **Skipper la phase de plan** pour les tâches complexes
4. **Passer au fichier suivant** avant de finir le premier
5. **Ignorer les tests** d'accessibilité

### ✅ TOUJOURS FAIRE
1. **Itérer sur le fichier existant**
2. **Explorer avant de coder**
3. **Planifier les tâches > 50 lignes**
4. **Finir un fichier complètement**
5. **Valider DSFR et RGAA**

---

## Métriques de Succès EPCT

### Indicateurs de qualité
- **0 nouveaux fichiers non demandés**
- **100% des modifications sur fichiers existants**
- **100% validation DSFR via MCP**
- **100% tests accessibilité passés**
- **0 emojis dans les titres HTML**

### Temps recommandés par phase
- Explorer : 15-20%
- Planifier : 20-25%
- Coder : 40-50%
- Tester : 10-15%

---

## Résumé

EPCT garantit :
1. **Compréhension** complète avant action
2. **Plan** structuré avant implémentation
3. **Code** itératif sur fichiers existants
4. **Tests** systématiques avant validation

**Règle d'or** : Un fichier commencé = Un fichier terminé

---

*Ce guide est la référence pour appliquer la méthode EPCT dans le projet Widget Builder DSFR/ODS.*