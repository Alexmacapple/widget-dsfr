#!/usr/bin/env node

/**
 * Script de build pour créer un bundle optimisé de l'API
 * Combine et minifie les fichiers JS sans dépendances externes complexes
 */

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

// Configuration
const config = {
    inputFiles: [
        './js/wrapper-api.js',
        './js/api-client.js', 
        './js/api-monitor.js'
    ],
    outputDir: './dist',
    bundles: {
        'api-bundle.js': ['./js/api-client.js', './js/api-monitor.js'],
        'api-bundle-complete.js': ['./js/wrapper-api.js', './js/api-client.js', './js/api-monitor.js'],
        'api-wrapper.js': ['./js/wrapper-api.js']
    }
};

// Créer le dossier dist s'il n'existe pas
if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
}

// Fonction pour lire et combiner les fichiers
async function buildBundle(outputName, inputFiles) {
    console.log(`\n📦 Building ${outputName}...`);
    
    let combinedCode = `/**
 * Widget DSFR API Bundle
 * Version: 1.0.0
 * Date: ${new Date().toISOString()}
 * Includes: ${inputFiles.map(f => path.basename(f)).join(', ')}
 */

(function(window) {
    'use strict';
    
`;
    
    // Lire et combiner les fichiers
    for (const file of inputFiles) {
        if (!fs.existsSync(file)) {
            console.error(`❌ File not found: ${file}`);
            continue;
        }
        
        console.log(`  📄 Adding ${path.basename(file)}`);
        let content = fs.readFileSync(file, 'utf8');
        
        // Retirer les wrapper IIFE existants pour éviter les doublons
        content = content.replace(/^\(function\(window\)\s*\{[\s\S]*?'use strict';/, '');
        content = content.replace(/\}\)\(window\);?\s*$/, '');
        
        combinedCode += `
    // ============ ${path.basename(file)} ============
    ${content}
    
`;
    }
    
    combinedCode += `
})(window);`;
    
    // Sauvegarder la version non-minifiée
    const outputPath = path.join(config.outputDir, outputName);
    fs.writeFileSync(outputPath, combinedCode);
    console.log(`  ✅ Created ${outputName} (${(combinedCode.length / 1024).toFixed(2)} KB)`);
    
    // Créer la version minifiée
    try {
        const minified = await minify(combinedCode, {
            compress: {
                drop_console: false,
                drop_debugger: true,
                dead_code: true,
                unused: true
            },
            mangle: {
                toplevel: false,
                safari10: true
            },
            format: {
                comments: false,
                preamble: `/* Widget DSFR API Bundle v1.0.0 | ${new Date().toISOString()} */`
            }
        });
        
        if (minified.code) {
            const minPath = outputPath.replace('.js', '.min.js');
            fs.writeFileSync(minPath, minified.code);
            console.log(`  ✅ Created ${path.basename(minPath)} (${(minified.code.length / 1024).toFixed(2)} KB)`);
            
            // Créer la source map si disponible
            if (minified.map) {
                const mapPath = minPath + '.map';
                fs.writeFileSync(mapPath, minified.map);
                console.log(`  ✅ Created source map`);
            }
        }
    } catch (error) {
        console.error(`  ⚠️  Minification failed: ${error.message}`);
    }
}

// Fonction principale
async function build() {
    console.log('🚀 Starting API Bundle Build...\n');
    console.log('═══════════════════════════════════════════');
    
    // Construire chaque bundle
    for (const [outputName, inputFiles] of Object.entries(config.bundles)) {
        await buildBundle(outputName, inputFiles);
    }
    
    // Créer un fichier index HTML pour tester
    const indexHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Test API Bundle</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.min.css">
</head>
<body>
    <div class="fr-container fr-my-4w">
        <h1>Test du Bundle API</h1>
        
        <div class="fr-alert fr-alert--info">
            <p>Ouvrez la console pour voir les tests</p>
        </div>
        
        <div class="fr-btns-group">
            <button class="fr-btn" onclick="testApi()">Test API</button>
            <button class="fr-btn" onclick="showStats()">Voir Stats</button>
        </div>
        
        <pre id="output" style="background: #f6f6f6; padding: 1rem; margin-top: 2rem;"></pre>
    </div>
    
    <!-- Bundle complet minifié -->
    <script src="api-bundle-complete.min.js"></script>
    
    <script>
        console.log('✅ Bundle loaded successfully!');
        console.log('Available:', {
            fetchCompat: typeof fetchCompat !== 'undefined',
            ApiClient: typeof ApiClient !== 'undefined',
            ApiMonitor: typeof ApiMonitor !== 'undefined',
            apiClient: typeof apiClient !== 'undefined'
        });
        
        // Initialiser le monitor
        if (typeof ApiMonitor !== 'undefined') {
            new ApiMonitor({ position: 'bottom-right' });
        }
        
        async function testApi() {
            const output = document.getElementById('output');
            output.textContent = 'Testing API...\\n';
            
            try {
                const response = await fetchCompat(
                    'https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/signalconso/records?limit=5'
                );
                const data = await response.json();
                
                output.textContent += 'Success! ' + data.total_count + ' records found\\n';
                output.textContent += 'Cache: ' + (response.headers.get('X-Cache') === 'HIT' ? 'HIT' : 'MISS');
            } catch (error) {
                output.textContent += 'Error: ' + error.message;
            }
        }
        
        function showStats() {
            const output = document.getElementById('output');
            if (window.fetchCompat && window.fetchCompat.getStats) {
                const stats = window.fetchCompat.getStats();
                output.textContent = JSON.stringify(stats, null, 2);
            } else {
                output.textContent = 'Stats not available';
            }
        }
    </script>
</body>
</html>`;
    
    fs.writeFileSync(path.join(config.outputDir, 'test-bundle.html'), indexHtml);
    console.log(`\n  ✅ Created test-bundle.html`);
    
    // Statistiques finales
    console.log('\n═══════════════════════════════════════════');
    console.log('\n📊 Build Summary:\n');
    
    const files = fs.readdirSync(config.outputDir);
    let totalSize = 0;
    let totalMinSize = 0;
    
    files.forEach(file => {
        const filePath = path.join(config.outputDir, file);
        const stats = fs.statSync(filePath);
        const size = stats.size / 1024;
        
        if (file.endsWith('.min.js')) {
            totalMinSize += size;
            console.log(`  📦 ${file}: ${size.toFixed(2)} KB`);
        } else if (file.endsWith('.js')) {
            totalSize += size;
        }
    });
    
    console.log(`\n  Total minified: ${totalMinSize.toFixed(2)} KB`);
    console.log(`  Compression: ${((1 - totalMinSize / totalSize) * 100).toFixed(1)}%`);
    
    console.log('\n✨ Build completed successfully!');
    console.log('\n🧪 Test the bundle:');
    console.log(`  1. Open: http://localhost:3000/dist/test-bundle.html`);
    console.log(`  2. Or include in your HTML:`);
    console.log(`     <script src="/dist/api-bundle-complete.min.js"></script>`);
}

// Lancer le build
build().catch(console.error);