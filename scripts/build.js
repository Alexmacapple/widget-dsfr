#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔨 Build process starting...');

// Créer le dossier dist s'il n'existe pas
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copier les fichiers principaux
const filesToCopy = [
  'examples/signalconso-dashboard-dsfr.html',
  'examples/signalconso-simple-dsfr.html',
  'package.json',
  'README.md',
];

// Copier les dossiers widgets
const dirsToCopy = ['widgets'];

// Fonction pour copier récursivement
function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursive(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copier les fichiers
filesToCopy.forEach((file) => {
  const src = path.join(__dirname, '..', file);
  const dest = path.join(distDir, path.basename(file));
  
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✅ Copied: ${file}`);
  } else {
    console.log(`⚠️  Skipped (not found): ${file}`);
  }
});

// Copier les dossiers
dirsToCopy.forEach((dir) => {
  const src = path.join(__dirname, '..', dir);
  const dest = path.join(distDir, dir);
  
  if (fs.existsSync(src)) {
    copyRecursive(src, dest);
    console.log(`✅ Copied directory: ${dir}`);
  } else {
    console.log(`⚠️  Skipped directory (not found): ${dir}`);
  }
});

// Créer un fichier de version
const versionInfo = {
  version: require('../package.json').version,
  buildDate: new Date().toISOString(),
  node: process.version,
};

fs.writeFileSync(
  path.join(distDir, 'build-info.json'),
  JSON.stringify(versionInfo, null, 2)
);

console.log('✅ Build info created');
console.log('🎉 Build complete! Output in dist/ directory');
console.log(`📦 Version: ${versionInfo.version}`);
console.log(`📅 Build date: ${versionInfo.buildDate}`);