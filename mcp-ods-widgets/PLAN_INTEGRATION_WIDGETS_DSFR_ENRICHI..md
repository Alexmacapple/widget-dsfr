# ⎿ Plan d'intégration complète - Builder de widgets ODS/DSFR

## 🎯 Objectif  
Créer un système complet et modulaire pour générer des widgets **OpenDataSoft** avec le thème **DSFR**, en exploitant toutes les ressources disponibles.

---

## 📋 Plan d'intégration  

### Phase 1 : Configuration des serveurs MCP (1 jour)  
1. Configurer les 3 serveurs MCP  
   - MCP ODS Widgets (local) – 70+ widgets  
   - MCP DSFR (local) – composants DSFR  
   - MCP DeepWiki/GitMCP – documentation ODS  
2. Créer un fichier de configuration unifié :  
```json
{
  "mcpServers": {
    "ods-widgets": { ... },
    "dsfr": { ... },
    "ods-docs": { ... }
  }
}
```

---

### Phase 2 : Architecture du Builder (2-3 jours)  
1. Créer une interface web unifiée  
   - Page principale avec sélection de widgets  
   - Panneau de configuration par widget  
   - Prévisualisation en temps réel  
   - Export de code  
2. Système de templates modulaires  
   - Templates de base DSFR  
   - Templates par type de widget  
   - Templates de dashboards complets  
3. API de génération  
   - Endpoint pour chaque type de widget  
   - Endpoint pour dashboards complets  
   - Validation des paramètres  

---

### Phase 3 : Intégration et transformation des données (3 jours)  
1. Connecteur OpenDataSoft  
   - Exploration des datasets disponibles  
   - Analyse automatique des champs  
   - Recommandation de widgets  
2. Module de transformation légère  
   - Mappage de colonnes (renommer, réorganiser)  
   - Filtrage et nettoyage basique (valeurs manquantes, formats)  
   - Préparation automatique des données pour les widgets  
3. Cache et optimisation  
   - Cache des métadonnées de datasets  
   - Préchargement des données fréquentes  

---

### Phase 4 : Interface utilisateur avancée (3-4 jours)  
1. Builder visuel drag-and-drop  
   - Palette de widgets (70+ disponibles)  
   - Canvas de construction  
   - Configuration par widget  
2. Système de thèmes  
   - Thème DSFR par défaut  
   - Support du mode sombre  
   - Personnalisation des couleurs  
3. Gestion des layouts  
   - Grilles responsives DSFR  
   - Templates prédéfinis  
   - Layouts personnalisables  

---

### Phase 5 : Fonctionnalités avancées (2-3 jours)  
1. Génération intelligente  
   - Analyse du dataset → recommandation de widgets  
   - Templates automatiques selon le type de données  
   - Optimisation des performances  
2. Export et intégration  
   - Export HTML standalone  
   - Export composant Angular/React/Vue  
   - Export pour CMS (Drupal, WordPress)  
   - Génération d’iframes  
3. Documentation automatique  
   - Documentation du code généré  
   - Guide d’intégration personnalisé  
   - Exemples d’utilisation  

---

### Phase 6 : Tests, validation et pilotes (3 jours)  
1. Tests de compatibilité  
   - Tous les widgets (70+)  
   - Tous les navigateurs  
   - Mode responsive  
2. Validation RGAA  
   - Accessibilité niveau AA  
   - Navigation clavier  
   - Lecteurs d’écran  
3. Phase pilote utilisateur  
   - Test avec **SignalConso** comme dataset pilote  
   - Validation avec au moins 2 autres datasets publics différents  
   - Collecte et intégration des retours utilisateurs  

---

### Phase 7 : Déploiement (1 jour)  
1. Packaging  
   - Docker container  
   - Package npm  
   - Documentation complète  
2. CI/CD  
   - Tests automatisés  
   - Déploiement continu  

---

## 🔧 Architecture technique proposée  

```
widget-builder-pro/
├── frontend/              # Interface React/Vue
│   ├── builder/           # Builder visuel
│   ├── preview/           # Prévisualisation
│   └── export/            # Export de code
├── backend/               # API Node.js
│   ├── mcp-gateway/       # Gateway vers les 3 MCP
│   ├── generator/         # Générateur de code
│   └── templates/         # Templates DSFR
├── mcp-servers/           # Serveurs MCP
│   ├── ods-widgets/       # 70+ widgets
│   ├── dsfr/              # Composants DSFR
│   └── docs/              # Documentation
└── examples/              # Exemples générés
```

---

## 🚀 Prochaines étapes immédiates  
1. Valider l’architecture avec l’équipe  
2. Configurer les 3 serveurs MCP ensemble  
3. Créer le prototype du builder visuel  
4. Tester avec **SignalConso** comme dataset pilote  
5. Lancer un pilote avec d’autres datasets publics  
6. Itérer selon les retours utilisateurs  

---

## 📊 Résultat attendu  
Un builder complet permettant de :  
- Sélectionner parmi 70+ widgets ODS  
- Appliquer automatiquement le thème DSFR  
- Générer du code propre et accessible  
- Exporter vers différentes plateformes  
- Documentation et exemples inclus  
- Nettoyer et transformer les données pour maximiser la compatibilité  

**Durée totale estimée : 13-16 jours**  

---

## 📌 Vue Kanban (pour Obsidian Tasks/Projects)

```kanban
## A faire
- [ ] Configurer les 3 serveurs MCP  
- [ ] Créer un fichier de configuration unifié  
- [ ] Créer l’interface web unifiée  
- [ ] Connecteur OpenDataSoft  
- [ ] Module de transformation légère des données  
- [ ] Builder visuel drag-and-drop  
- [ ] Génération intelligente (analyse dataset)  
- [ ] Tests compatibilité (70+ widgets)  
- [ ] Packaging Docker & npm  

## En cours
- [ ] Prototype du builder visuel  
- [ ] Validation RGAA accessibilité  
- [ ] Phase pilote avec SignalConso  

## Terminé
- [ ] Validation architecture avec l’équipe  
```
