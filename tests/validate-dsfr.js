#!/usr/bin/env node

/**
 * Validation de la conformité DSFR
 * Vérifie que les fichiers HTML respectent les standards du Design System France
 */

const fs = require('fs');
const path = require('path');

class DSFRValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  validateFile(filePath) {
    console.log(`\n📋 Validation DSFR de: ${path.basename(filePath)}`);
        
    if (!fs.existsSync(filePath)) {
      this.errors.push(`Fichier non trouvé: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
        
    // Vérifications principales
    this.checkDSFRVersion(content);
    this.checkLanguage(content);
    this.checkTheme(content);
    this.checkStructure(content);
    this.checkComponents(content);
    this.checkAccessibility(content);
    this.checkEmojis(content);
  }

  checkDSFRVersion(content) {
    if (!content.includes('@gouvfr/dsfr@1.14.0')) {
      this.warnings.push('Version DSFR non spécifiée ou ancienne (recommandé: 1.14.0)');
    }
  }

  checkLanguage(content) {
    if (!content.includes('lang="fr"')) {
      this.errors.push('Attribut lang="fr" manquant sur la balise html');
    }
  }

  checkTheme(content) {
    if (!content.includes('data-fr-theme')) {
      this.warnings.push('Attribut data-fr-theme non défini (light/dark/system)');
    }
  }

  checkStructure(content) {
    // Vérifier les éléments structurels DSFR
    const requiredElements = [
      { tag: 'fr-header', name: 'Header DSFR' },
      { tag: 'fr-container', name: 'Container DSFR' },
      { tag: 'fr-footer', name: 'Footer DSFR' }
    ];

    requiredElements.forEach(element => {
      if (!content.includes(element.tag)) {
        this.warnings.push(`${element.name} manquant (classe ${element.tag})`);
      }
    });
  }

  checkComponents(content) {
    // Vérifier l'utilisation correcte des composants
    const dsfrComponents = [
      'fr-btn',
      'fr-card',
      'fr-tile',
      'fr-grid-row',
      'fr-col'
    ];

    let componentsFound = 0;
    dsfrComponents.forEach(component => {
      if (content.includes(component)) {
        componentsFound++;
      }
    });

    if (componentsFound < 3) {
      this.warnings.push('Peu de composants DSFR utilisés (moins de 3)');
    }
  }

  checkAccessibility(content) {
    // Vérifications RGAA de base
    const checks = [
      {
        test: () => content.includes('<main'),
        error: 'Balise <main> manquante pour le contenu principal'
      },
      {
        test: () => content.includes('role='),
        error: 'Aucun attribut role ARIA trouvé'
      },
      {
        test: () => content.includes('aria-label') || content.includes('aria-labelledby'),
        error: 'Manque d\'attributs aria-label pour l\'accessibilité'
      },
      {
        test: () => !content.includes('onclick='),
        error: 'Utilisation de onclick détectée (préférer les event listeners)'
      }
    ];

    checks.forEach(check => {
      if (!check.test()) {
        this.warnings.push(check.error);
      }
    });
  }

  checkEmojis(content) {
    // Vérifier l'absence d'emojis dans les titres
    const titleRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi;
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]/gu;
        
    const titles = [...content.matchAll(titleRegex)];
    titles.forEach(match => {
      if (emojiRegex.test(match[1])) {
        this.errors.push(`Emoji détecté dans un titre: "${match[1].substring(0, 50)}..."`);
      }
    });
  }

  printReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RAPPORT DE VALIDATION DSFR');
    console.log('='.repeat(60));

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ Parfait! Aucun problème détecté.');
      return true;
    }

    if (this.errors.length > 0) {
      console.log(`\n❌ ERREURS (${this.errors.length}):`);
      this.errors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log(`\n⚠️  AVERTISSEMENTS (${this.warnings.length}):`);
      this.warnings.forEach((warning, i) => {
        console.log(`  ${i + 1}. ${warning}`);
      });
    }

    console.log('\n' + '='.repeat(60));
        
    const score = Math.max(0, 100 - (this.errors.length * 10) - (this.warnings.length * 3));
    console.log(`📈 Score de conformité DSFR: ${score}/100`);
        
    return this.errors.length === 0;
  }
}

// Exécution
const validator = new DSFRValidator();

// Vérifier si un fichier spécifique est passé en argument
if (process.argv[2]) {
  const filePath = path.resolve(process.argv[2]);
  validator.validateFile(filePath);
} else {
  // Valider le dashboard principal s'il existe
  const dashboardPath = path.join(__dirname, '..', 'signalconso-dashboard-dsfr.html');
  if (fs.existsSync(dashboardPath)) {
    validator.validateFile(dashboardPath);
  }
    
  // Valider les exemples s'ils existent
  const examplesDir = path.join(__dirname, '..', 'examples');
  if (fs.existsSync(examplesDir)) {
    const htmlFiles = fs.readdirSync(examplesDir)
      .filter(f => f.endsWith('.html'))
      .slice(0, 3); // Limiter à 3 fichiers pour la démo
        
    htmlFiles.forEach(file => {
      validator.validateFile(path.join(examplesDir, file));
    });
  }
}

// Afficher le rapport
const success = validator.printReport();
process.exit(success ? 0 : 1);