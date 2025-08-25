#!/usr/bin/env node

/**
 * Script de build pour la production
 * - Minification des assets JS/CSS
 * - Suppression des console.log
 * - Optimisation du bundle
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const terser = require('terser');
const CleanCSS = require('clean-css');
const glob = require('glob');

const config = {
  // Dossier de sortie
  outputDir: 'dist',
  
  // Fichiers source
  jsFiles: [
    'js/api-client.js',
    'js/api-monitor.js',
    'js/wrapper-api.js',
    'src/api/*.js',
    'examples/*.js'
  ],
  
  cssFiles: [
    'css/*.css',
    'widgets/**/*.css'
  ],
  
  htmlFiles: [
    'widgets/**/*.html',
    'examples/*.html'
  ],
  
  // Options de minification
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true,
      pure_funcs: ['console.log', 'console.debug', 'console.info'],
      passes: 2
    },
    mangle: {
      toplevel: true
    },
    format: {
      comments: false
    }
  },
  
  cleanCSSOptions: {
    level: 2,
    compatibility: 'ie11'
  }
};

async function minifyJS(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const result = await terser.minify(code, config.terserOptions);
  
  if (result.error) {
    console.error(`❌ Erreur minification JS: ${filePath}`, result.error);
    return null;
  }
  
  return result.code;
}

function minifyCSS(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const result = new CleanCSS(config.cleanCSSOptions).minify(code);
  
  if (result.errors.length > 0) {
    console.error(`❌ Erreur minification CSS: ${filePath}`, result.errors);
    return null;
  }
  
  return result.styles;
}

function processHTML(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Supprimer les console.log dans les scripts inline
  content = content.replace(
    /<script[^>]*>([\s\S]*?)<\/script>/gi,
    (match, scriptContent) => {
      const cleanedScript = scriptContent
        .replace(/console\.(log|debug|info|warn|error)\([^)]*\);?/g, '')
        .replace(/\/\/[^\n]*console\.[^\n]*\n/g, '\n');
      return match.replace(scriptContent, cleanedScript);
    }
  );
  
  // Minifier les styles inline
  content = content.replace(
    /<style[^>]*>([\s\S]*?)<\/style>/gi,
    (match, styleContent) => {
      const minified = new CleanCSS(config.cleanCSSOptions).minify(styleContent);
      return match.replace(styleContent, minified.styles);
    }
  );
  
  // Supprimer les commentaires HTML (sauf IE conditionals)
  content = content.replace(/<!--(?!\[if).*?-->/gs, '');
  
  // Réduire les espaces multiples
  content = content.replace(/\s+/g, ' ');
  
  return content;
}

async function createBundle() {
  // Créer un bundle principal avec tous les JS essentiels
  const bundleFiles = [
    'js/api-client.js',
    'js/api-monitor.js',
    'js/wrapper-api.js'
  ];
  
  let bundleContent = '';
  
  for (const file of bundleFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      bundleContent += `\n// === ${path.basename(file)} ===\n`;
      bundleContent += content;
    }
  }
  
  // Minifier le bundle
  const minified = await terser.minify(bundleContent, {
    ...config.terserOptions,
    module: true,
    toplevel: true
  });
  
  if (minified.code) {
    const bundlePath = path.join(config.outputDir, 'js', 'bundle.min.js');
    fs.mkdirSync(path.dirname(bundlePath), { recursive: true });
    fs.writeFileSync(bundlePath, minified.code);
    console.log(`✓ Bundle créé: ${bundlePath}`);
    
    // Calculer la taille
    const originalSize = Buffer.byteLength(bundleContent);
    const minifiedSize = Buffer.byteLength(minified.code);
    const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);
    console.log(`  Réduction: ${reduction}% (${originalSize} → ${minifiedSize} bytes)`);
  }
}

async function build() {
  console.log('🏗️  Build de production...\n');
  
  // Créer le dossier de sortie
  if (fs.existsSync(config.outputDir)) {
    execSync(`rm -rf ${config.outputDir}`);
  }
  fs.mkdirSync(config.outputDir, { recursive: true });
  
  // Stats
  let stats = {
    js: { original: 0, minified: 0, files: 0 },
    css: { original: 0, minified: 0, files: 0 },
    html: { original: 0, minified: 0, files: 0 }
  };
  
  // Traiter les fichiers JS
  console.log('📦 Minification JS...');
  for (const pattern of config.jsFiles) {
    const files = glob.sync(pattern);
    for (const file of files) {
      const minified = await minifyJS(file);
      if (minified) {
        const outputPath = path.join(config.outputDir, file);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, minified);
        
        stats.js.original += fs.statSync(file).size;
        stats.js.minified += Buffer.byteLength(minified);
        stats.js.files++;
      }
    }
  }
  
  // Traiter les fichiers CSS
  console.log('🎨 Minification CSS...');
  for (const pattern of config.cssFiles) {
    const files = glob.sync(pattern);
    for (const file of files) {
      const minified = minifyCSS(file);
      if (minified) {
        const outputPath = path.join(config.outputDir, file);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, minified);
        
        stats.css.original += fs.statSync(file).size;
        stats.css.minified += Buffer.byteLength(minified);
        stats.css.files++;
      }
    }
  }
  
  // Traiter les fichiers HTML
  console.log('📄 Optimisation HTML...');
  for (const pattern of config.htmlFiles) {
    const files = glob.sync(pattern);
    for (const file of files) {
      const processed = processHTML(file);
      const outputPath = path.join(config.outputDir, file);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, processed);
      
      stats.html.original += fs.statSync(file).size;
      stats.html.minified += Buffer.byteLength(processed);
      stats.html.files++;
    }
  }
  
  // Créer le bundle
  console.log('\n🔗 Création du bundle...');
  await createBundle();
  
  // Afficher les statistiques
  console.log('\n📊 Statistiques de build:\n');
  
  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };
  
  const calculateReduction = (original, minified) => {
    return ((original - minified) / original * 100).toFixed(2);
  };
  
  console.log(`JavaScript (${stats.js.files} fichiers):`);
  console.log(`  Original:  ${formatSize(stats.js.original)}`);
  console.log(`  Minifié:   ${formatSize(stats.js.minified)}`);
  console.log(`  Réduction: ${calculateReduction(stats.js.original, stats.js.minified)}%`);
  
  console.log(`\nCSS (${stats.css.files} fichiers):`);
  console.log(`  Original:  ${formatSize(stats.css.original)}`);
  console.log(`  Minifié:   ${formatSize(stats.css.minified)}`);
  console.log(`  Réduction: ${calculateReduction(stats.css.original, stats.css.minified)}%`);
  
  console.log(`\nHTML (${stats.html.files} fichiers):`);
  console.log(`  Original:  ${formatSize(stats.html.original)}`);
  console.log(`  Optimisé:  ${formatSize(stats.html.minified)}`);
  console.log(`  Réduction: ${calculateReduction(stats.html.original, stats.html.minified)}%`);
  
  const totalOriginal = stats.js.original + stats.css.original + stats.html.original;
  const totalMinified = stats.js.minified + stats.css.minified + stats.html.minified;
  
  console.log('\n🎯 Total:');
  console.log(`  Original:  ${formatSize(totalOriginal)}`);
  console.log(`  Optimisé:  ${formatSize(totalMinified)}`);
  console.log(`  Réduction: ${calculateReduction(totalOriginal, totalMinified)}%`);
  
  console.log(`\n✅ Build terminé dans: ${config.outputDir}/`);
}

// Exécution
build().catch(console.error);