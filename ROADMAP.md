# 🚀 Roadmap d'Amélioration - Widget Builder DSFR/ODS

## 📊 Objectif : Passer de 85/100 à 100/100

### 🎯 Vue d'ensemble
```
85/100 ──┬── Phase 1 (+3) ──> 88/100  [15 min]
         ├── Phase 2 (+2) ──> 90/100  [20 min]
         ├── Phase 3 (+5) ──> 95/100  [30 min]
         ├── Phase 4 (+3) ──> 98/100  [45 min]
         └── Phase 5 (+2) ──> 100/100 [20 min]
                    
         Total estimé : 2h30
```

---

## 📅 Phases de Développement

### 🔴 Phase 1 : Corrections Critiques (15 min) → +3 points
**Priorité : CRITIQUE**
**Score après : 88/100**

#### Tâches :
- [ ] Remplacer tous les `onclick` par `addEventListener`
  - `signalconso-dashboard-dsfr.html`
  - `signalconso-simple-dsfr.html`
- [ ] Valider avec les tests

#### Impact :
- Conformité aux bonnes pratiques modernes
- Meilleure séparation HTML/JS
- Score DSFR : 97 → 100

---

### 🟠 Phase 2 : Scripts NPM Essentiels (20 min) → +2 points
**Priorité : HAUTE**
**Score après : 90/100**

#### Tâches :
- [ ] Ajouter script `dev` (serveur local avec auto-reload)
- [ ] Ajouter script `build` (minification/optimisation)
- [ ] Ajouter script `lint` (ESLint + Prettier)
- [ ] Créer `.eslintrc.json` et `.prettierrc`
- [ ] Installer les dépendances dev nécessaires

#### Scripts à ajouter :
```json
{
  "scripts": {
    "dev": "live-server --port=8080 --watch=*.html,*.js",
    "build": "node scripts/build.js",
    "lint": "eslint . --ext .js,.html --fix",
    "format": "prettier --write \"**/*.{js,html,json,md}\"",
    "pre-commit": "npm run lint && npm run test"
  }
}
```

---

### 🟡 Phase 3 : CI/CD avec GitHub Actions (30 min) → +5 points
**Priorité : HAUTE**
**Score après : 95/100**

#### Tâches :
- [ ] Créer `.github/workflows/ci.yml`
- [ ] Pipeline de tests automatiques
- [ ] Validation DSFR automatique
- [ ] Build et vérification
- [ ] Badge de statut dans README

#### Workflow CI :
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run validate
      - run: npm run build
```

---

### 🟢 Phase 4 : Tests E2E avec Playwright (45 min) → +3 points
**Priorité : MOYENNE**
**Score après : 98/100**

#### Tâches :
- [ ] Installer Playwright
- [ ] Créer `tests/e2e/dashboard.spec.js`
- [ ] Tests du dashboard principal
- [ ] Tests des filtres et interactions
- [ ] Tests responsive
- [ ] Intégrer dans CI/CD

#### Tests à implémenter :
1. Chargement du dashboard
2. Fonctionnement des filtres
3. Affichage des graphiques
4. Accordéons d'accessibilité
5. Export des données

---

### 🔵 Phase 5 : Documentation Finale (20 min) → +2 points
**Priorité : BASSE**
**Score après : 100/100**

#### Tâches :
- [ ] Créer `CHANGELOG.md`
- [ ] Créer `CONTRIBUTING.md`
- [ ] Ajouter diagramme d'architecture
- [ ] Documenter les patterns utilisés
- [ ] Ajouter badges dans README

#### Documents à créer :
```
CHANGELOG.md      - Historique des versions
CONTRIBUTING.md   - Guide de contribution
docs/
  ├── architecture.md
  ├── patterns.md
  └── deployment.md
```

---

## 🏁 Quick Wins (à faire immédiatement)

### Phase 1 uniquement (15 min) :
```bash
# On commence par les corrections critiques
1. Corriger les onclick
2. Tester
3. Commit
```

### Commandes pour démarrer :
```bash
# Phase 1
grep -n "onclick" signalconso-dashboard-dsfr.html
# Puis corriger manuellement ou avec un script

# Phase 2 
npm install --save-dev eslint prettier live-server
npm run lint

# Phase 3
mkdir -p .github/workflows
# Créer ci.yml

# Phase 4
npm install --save-dev @playwright/test
npm init playwright@latest

# Phase 5
touch CHANGELOG.md CONTRIBUTING.md
```

---

## 📈 Métriques de Succès

| Phase | Temps | Points | Score Total | ROI |
|-------|-------|--------|------------|-----|
| 1 | 15 min | +3 | 88/100 | ⭐⭐⭐⭐⭐ |
| 2 | 20 min | +2 | 90/100 | ⭐⭐⭐⭐ |
| 3 | 30 min | +5 | 95/100 | ⭐⭐⭐⭐ |
| 4 | 45 min | +3 | 98/100 | ⭐⭐⭐ |
| 5 | 20 min | +2 | 100/100 | ⭐⭐ |

**Recommandation : Faire les phases 1-3 aujourd'hui (65 min) pour atteindre 95/100**

---

## 🎯 Résultat Final Attendu

Après toutes les phases :
- **Score : 100/100**
- **Tests : 100% passing**
- **CI/CD : Fully automated**
- **Documentation : Complète**
- **Code : Production-ready**

---

*Roadmap créée le 17/08/2025*
*Objectif : Excellence technique et maintenabilité*