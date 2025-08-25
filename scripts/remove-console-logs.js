#!/usr/bin/env node

/**
 * Script pour supprimer les console.log en production
 * Parcourt tous les fichiers JS/HTML et supprime ou commente les console.log
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const config = {
  // Patterns de fichiers à traiter
  patterns: [
    'src/**/*.js',
    'js/**/*.js',
    'widgets/**/*.html',
    'examples/**/*.html',
    'examples/**/*.js',
    'mcp-dsfr/**/*.js',
    'mcp-ods-widgets/**/*.js'
  ],
  
  // Fichiers/dossiers à exclure
  exclude: [
    'node_modules/**',
    'backups/**',
    'tests/**',
    'scripts/**',
    '*.test.js',
    '*.spec.js'
  ],
  
  // Mode: 'remove' ou 'comment'
  mode: process.argv[2] || 'comment',
  
  // Dry run (affiche sans modifier)
  dryRun: process.argv.includes('--dry-run')
};

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let newContent = content;
  
  // Patterns pour détecter console.log
  const patterns = [
    // Simple console.log
    /console\.(log|debug|info|warn|error)\([^)]*\);?/g,
    // Console.log multi-lignes
    /console\.(log|debug|info|warn|error)\([^)]*\n[^)]*\);?/gm,
    // Console.log avec template literals
    /console\.(log|debug|info|warn|error)\(`[^`]*`\);?/g
  ];
  
  patterns.forEach(pattern => {
    if (config.mode === 'remove') {
      // Suppression complète
      newContent = newContent.replace(pattern, '');
    } else {
      // Commentaire
      newContent = newContent.replace(pattern, (match) => {
        // Pour HTML, utiliser des commentaires HTML
        if (filePath.endsWith('.html')) {
          return `<!-- ${match} -->`;
        }
        // Pour JS, utiliser des commentaires JS
        return `// ${match}`;
      });
    }
  });
  
  modified = newContent !== content;
  
  if (modified) {
    if (config.dryRun) {
      console.log(`[DRY RUN] Would modify: ${filePath}`);
    } else {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✓ Modified: ${filePath}`);
    }
    return 1;
  }
  
  return 0;
}

function removeConsoleLogs() {
  console.log('🔍 Recherche des console.log en production...\n');
  
  let totalFiles = 0;
  let modifiedFiles = 0;
  
  config.patterns.forEach(pattern => {
    const files = glob.sync(pattern, {
      ignore: config.exclude
    });
    
    files.forEach(file => {
      totalFiles++;
      modifiedFiles += processFile(file);
    });
  });
  
  console.log('\n📊 Résumé:');
  console.log(`  - Fichiers analysés: ${totalFiles}`);
  console.log(`  - Fichiers modifiés: ${modifiedFiles}`);
  console.log(`  - Mode: ${config.mode}`);
  
  if (config.dryRun) {
    console.log('\n⚠️  Mode DRY RUN - Aucun fichier modifié');
    console.log('Relancez sans --dry-run pour appliquer les modifications');
  }
}

// Exécution
removeConsoleLogs();