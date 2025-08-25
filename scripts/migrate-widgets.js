#!/usr/bin/env node

/**
 * Script de migration automatique des widgets vers fetchCompat
 * Remplace les appels fetch() par fetchCompat() pour activer le cache centralisé
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
    widgetsDir: path.join(__dirname, '..', 'widgets'),
    examplesDir: path.join(__dirname, '..', 'examples'),
    backupDir: path.join(__dirname, '..', 'backups'),
    dryRun: false, // Si true, montre les changements sans les appliquer
    verbose: true,
    patterns: [
        // Pattern pour remplacer fetch direct
        {
            from: /\bfetch\s*\(/g,
            to: 'fetchCompat(',
            description: 'Remplacer fetch() par fetchCompat()'
        },
        // Pattern pour ajouter le script wrapper si pas présent
        {
            checkOnly: true,
            pattern: /<script[^>]*wrapper-api\.js[^>]*>/,
            insert: '    <script src="../js/wrapper-api.js"></script>\n',
            insertBefore: '</head>',
            description: 'Ajouter wrapper-api.js'
        }
    ],
    // Fichiers à migrer
    filePatterns: ['*.html'],
    // Fichiers à exclure
    exclude: ['backup-*.html', 'test-*.html']
};

// Statistiques
const stats = {
    filesProcessed: 0,
    filesModified: 0,
    fetchCallsReplaced: 0,
    wrapperScriptsAdded: 0,
    errors: []
};

/**
 * Crée un backup d'un fichier
 */
function createBackup(filePath) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = path.basename(filePath);
    const backupPath = path.join(config.backupDir, `${timestamp}-${fileName}`);
    
    // Créer le dossier backup s'il n'existe pas
    if (!fs.existsSync(config.backupDir)) {
        fs.mkdirSync(config.backupDir, { recursive: true });
    }
    
    fs.copyFileSync(filePath, backupPath);
    return backupPath;
}

/**
 * Vérifie si un fichier doit être traité
 */
function shouldProcessFile(fileName) {
    // Vérifier les patterns d'inclusion
    const matchesPattern = config.filePatterns.some(pattern => {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return regex.test(fileName);
    });
    
    if (!matchesPattern) return false;
    
    // Vérifier les exclusions
    const isExcluded = config.exclude.some(pattern => {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return regex.test(fileName);
    });
    
    return !isExcluded;
}

/**
 * Migre un fichier HTML
 */
function migrateFile(filePath) {
    const fileName = path.basename(filePath);
    
    if (!shouldProcessFile(fileName)) {
        return false;
    }
    
    stats.filesProcessed++;
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        const changes = [];
        
        // Appliquer les patterns de remplacement
        config.patterns.forEach(pattern => {
            if (pattern.checkOnly) {
                // Vérifier si le pattern existe, sinon insérer
                if (!pattern.pattern.test(content)) {
                    const insertIndex = content.indexOf(pattern.insertBefore);
                    if (insertIndex !== -1) {
                        content = content.slice(0, insertIndex) + 
                                pattern.insert + 
                                content.slice(insertIndex);
                        modified = true;
                        stats.wrapperScriptsAdded++;
                        changes.push(`✓ ${pattern.description}`);
                    }
                }
            } else {
                // Remplacement direct
                const matches = content.match(pattern.from);
                if (matches && matches.length > 0) {
                    content = content.replace(pattern.from, pattern.to);
                    modified = true;
                    stats.fetchCallsReplaced += matches.length;
                    changes.push(`✓ ${pattern.description} (${matches.length} occurrences)`);
                }
            }
        });
        
        // Vérifier si on doit aussi ajouter l'initialisation du wrapper
        if (modified && !content.includes('fetchCompat.configure')) {
            // Ajouter configuration si nécessaire
            const scriptTag = `
    <script>
        // Configuration du wrapper API
        if (window.fetchCompat) {
            fetchCompat.configure({
                enableCache: true,
                enableMonitoring: true,
                debug: window.location.hostname === 'localhost'
            });
        }
    </script>
`;
            const bodyIndex = content.indexOf('</body>');
            if (bodyIndex !== -1) {
                content = content.slice(0, bodyIndex) + scriptTag + content.slice(bodyIndex);
                changes.push('✓ Ajout de la configuration fetchCompat');
            }
        }
        
        if (modified) {
            stats.filesModified++;
            
            if (config.dryRun) {
                console.log(`\n[DRY RUN] ${fileName}:`);
                changes.forEach(change => console.log(`  ${change}`));
            } else {
                // Créer un backup
                const backupPath = createBackup(filePath);
                
                // Écrire le fichier modifié
                fs.writeFileSync(filePath, content, 'utf8');
                
                if (config.verbose) {
                    console.log(`\n✅ ${fileName}:`);
                    changes.forEach(change => console.log(`  ${change}`));
                    console.log(`  📁 Backup: ${path.relative(process.cwd(), backupPath)}`);
                }
            }
        } else if (config.verbose) {
            console.log(`⏭️  ${fileName}: Déjà migré ou pas de changements nécessaires`);
        }
        
        return modified;
        
    } catch (error) {
        stats.errors.push({ file: fileName, error: error.message });
        console.error(`❌ Erreur avec ${fileName}: ${error.message}`);
        return false;
    }
}

/**
 * Migre tous les fichiers d'un dossier
 */
function migrateDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        console.log(`⚠️  Dossier non trouvé: ${dirPath}`);
        return;
    }
    
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // Récursif pour les sous-dossiers
            migrateDirectory(filePath);
        } else if (stat.isFile()) {
            migrateFile(filePath);
        }
    });
}

/**
 * Fonction principale
 */
function main() {
    console.log('🚀 Migration des widgets vers fetchCompat\n');
    console.log('═══════════════════════════════════════════\n');
    
    // Parser les arguments
    const args = process.argv.slice(2);
    if (args.includes('--dry-run')) {
        config.dryRun = true;
        console.log('🔍 MODE DRY RUN - Aucun fichier ne sera modifié\n');
    }
    if (args.includes('--quiet')) {
        config.verbose = false;
    }
    if (args.includes('--help')) {
        console.log('Usage: node migrate-widgets.js [options]');
        console.log('\nOptions:');
        console.log('  --dry-run    Affiche les changements sans les appliquer');
        console.log('  --quiet      Mode silencieux');
        console.log('  --help       Affiche cette aide');
        process.exit(0);
    }
    
    // Migrer les widgets
    console.log('📂 Migration du dossier widgets/...');
    migrateDirectory(config.widgetsDir);
    
    // Migrer les examples
    console.log('\n📂 Migration du dossier examples/...');
    migrateDirectory(config.examplesDir);
    
    // Afficher les statistiques
    console.log('\n═══════════════════════════════════════════');
    console.log('\n📊 Résumé de la migration:\n');
    console.log(`  📁 Fichiers analysés: ${stats.filesProcessed}`);
    console.log(`  ✅ Fichiers modifiés: ${stats.filesModified}`);
    console.log(`  🔄 Appels fetch remplacés: ${stats.fetchCallsReplaced}`);
    console.log(`  📦 Scripts wrapper ajoutés: ${stats.wrapperScriptsAdded}`);
    
    if (stats.errors.length > 0) {
        console.log(`\n❌ Erreurs rencontrées:`);
        stats.errors.forEach(err => {
            console.log(`  - ${err.file}: ${err.error}`);
        });
    }
    
    if (config.dryRun) {
        console.log('\n💡 Pour appliquer les changements, relancez sans --dry-run');
    } else if (stats.filesModified > 0) {
        console.log('\n✨ Migration terminée avec succès!');
        console.log(`💾 Les backups sont dans: ${path.relative(process.cwd(), config.backupDir)}`);
        console.log('\n💡 Prochaines étapes:');
        console.log('  1. Tester les widgets migrés');
        console.log('  2. Vérifier les stats avec: window.apiStats() dans la console');
        console.log('  3. Ajuster la configuration si nécessaire');
    } else {
        console.log('\n✨ Aucune migration nécessaire - tous les fichiers sont déjà à jour!');
    }
}

// Vérifier si ApiClient existe
function checkApiClient() {
    const apiClientPath = path.join(__dirname, '..', 'js', 'api-client.js');
    if (fs.existsSync(apiClientPath)) {
        console.log('✅ ApiClient détecté - migration vers le système complet\n');
    } else {
        console.log('📦 Utilisation du wrapper de compatibilité fetchCompat\n');
    }
}

// Lancer la migration
checkApiClient();
main();