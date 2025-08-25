# Guide de Contribution

Merci de votre intérêt pour contribuer au projet Widget DSFR ! Ce document fournit les directives pour contribuer au projet.

## Table des matières

1. [Code de conduite](#code-de-conduite)
2. [Comment contribuer](#comment-contribuer)
3. [Processus de développement](#processus-de-développement)
4. [Standards de code](#standards-de-code)
5. [Tests](#tests)
6. [Documentation](#documentation)

## Code de conduite

Ce projet adhère au [Code de Conduite Contributor Covenant](https://www.contributor-covenant.org/). En participant, vous vous engagez à respecter ce code.

## Comment contribuer

### Signaler un bug

1. Vérifiez que le bug n'a pas déjà été signalé dans les [issues](https://github.com/votre-org/widget-dsfr/issues)
2. Créez une nouvelle issue en utilisant le template de bug
3. Incluez autant de détails que possible :
   - Version du projet
   - Étapes pour reproduire
   - Comportement attendu vs observé
   - Captures d'écran si applicable

### Proposer une fonctionnalité

1. Ouvrez une issue pour discuter de votre proposition
2. Attendez l'approbation avant de commencer le développement
3. Suivez le processus de développement ci-dessous

## Processus de développement

### 1. Fork et clone

```bash
# Fork le projet sur GitHub
# Clone votre fork
git clone https://github.com/votre-username/widget-dsfr.git
cd widget-dsfr

# Ajoutez le repo original comme remote
git remote add upstream https://github.com/votre-org/widget-dsfr.git
```

### 2. Créer une branche

```bash
# Créez une branche depuis main
git checkout -b feature/ma-fonctionnalite

# Pour un fix
git checkout -b fix/mon-fix
```

### 3. Développer

```bash
# Installez les dépendances
npm install

# Lancez le serveur de développement
npm run dev

# Lancez les tests en continu
npm test -- --watch
```

### 4. Commit

Utilisez des messages de commit conventionnels :

```bash
# Format
<type>(<scope>): <subject>

# Exemples
feat(widgets): ajout du widget timeline
fix(table): correction du tri des colonnes
docs(readme): mise à jour des instructions d'installation
style(code): formatage avec Prettier
refactor(api): simplification de la logique de fetch
test(e2e): ajout de tests pour le dashboard
chore(deps): mise à jour des dépendances
```

Types de commits :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage (sans changement de logique)
- `refactor`: Refactoring
- `test`: Ajout/modification de tests
- `chore`: Maintenance

### 5. Tests et validation

```bash
# Lancez tous les tests
npm test

# Validez la conformité DSFR
npm run validate

# Vérifiez le linting
npm run lint

# Formatez le code
npm run format

# Lancez les tests E2E
npx playwright test
```

### 6. Pull Request

1. Poussez votre branche
2. Créez une Pull Request vers `main`
3. Remplissez le template de PR
4. Attendez la review

## Standards de code

### JavaScript

- ES6+ moderne
- Pas de `var`, utilisez `const` ou `let`
- Fonctions fléchées pour les callbacks
- Async/await plutôt que les callbacks
- Commentaires JSDoc pour les fonctions publiques

```javascript
/**
 * Génère un widget DSFR
 * @param {string} type - Type de widget
 * @param {Object} options - Options de configuration
 * @returns {string} HTML du widget
 */
const generateWidget = async (type, options) => {
  // Code ici
};
```

### HTML

- HTML5 sémantique
- Classes DSFR obligatoires
- Attributs ARIA pour l'accessibilité
- Pas d'attributs `onclick` inline

```html
<!-- Bon -->
<button class="fr-btn" aria-label="Télécharger">
  Télécharger
</button>

<!-- Mauvais -->
<button onclick="download()">Télécharger</button>
```

### CSS

- Utiliser les classes DSFR
- Éviter le CSS custom sauf nécessaire
- Variables CSS pour les couleurs

```css
/* Bon */
.custom-widget {
  background-color: var(--background-default-grey);
}

/* Mauvais */
.custom-widget {
  background-color: #f5f5f5;
}
```

## Tests

### Tests unitaires

```javascript
// tests/unit/widget.test.js
describe('Widget Generator', () => {
  test('should generate valid DSFR HTML', () => {
    const html = generateWidget('table', options);
    expect(html).toContain('fr-table');
  });
});
```

### Tests E2E

```javascript
// tests/e2e/dashboard.spec.js
test('should display dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.locator('.fr-container')).toBeVisible();
});
```

### Validation DSFR

```bash
# Valider un fichier spécifique
node tests/validate-dsfr.js widgets/mon-widget.html

# Valider tous les widgets
npm run validate
```

## Documentation

### Code

- Commentez les parties complexes
- JSDoc pour les fonctions publiques
- README dans chaque dossier important

### Widgets

Chaque nouveau widget doit inclure :

1. Fichier HTML dans `widgets/`
2. Documentation dans le README du dossier
3. Exemple d'utilisation
4. Tests associés

### API

Documentez toute nouvelle API dans `docs/API.md`

## Structure des fichiers

```
widget-dsfr/
├── widgets/           # Widgets HTML
│   ├── tables/
│   ├── charts/
│   └── maps/
├── tests/            # Tests
│   ├── unit/
│   └── e2e/
├── docs/             # Documentation
└── examples/         # Exemples complets
```

## Ressources

- [Documentation DSFR](https://www.systeme-de-design.gouv.fr/)
- [API data.economie.gouv.fr](https://data.economie.gouv.fr/)
- [Guide RGAA](https://www.numerique.gouv.fr/publications/rgaa-accessibilite/)

## Questions ?

- Ouvrez une [discussion](https://github.com/votre-org/widget-dsfr/discussions)
- Contactez les mainteneurs

Merci pour vos contributions ! 🎉