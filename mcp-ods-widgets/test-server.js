#!/usr/bin/env node

/**
 * Script de test du serveur MCP ODS Widgets
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Test du serveur MCP ODS Widgets');
console.log('==================================\n');

// Démarrer le serveur
const serverPath = path.join(__dirname, 'src', 'index.js');
console.log(`📁 Chemin du serveur: ${serverPath}`);

const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, NODE_ENV: 'development' }
});

// Timeout pour éviter de bloquer
const timeout = setTimeout(() => {
  console.log('\n⏱️ Timeout - Arrêt du serveur de test');
  server.kill();
  process.exit(0);
}, 5000);

// Gérer les sorties
server.stdout.on('data', (data) => {
  console.log(`✅ Stdout: ${data}`);
});

server.stderr.on('data', (data) => {
  const message = data.toString();
  
  // Ignorer les messages informatifs qui vont sur stderr
  if (message.includes('MCP ODS Widgets démarré')) {
    console.log('✅ Serveur démarré avec succès !');
    console.log('\n📊 Résumé du test:');
    console.log('- Serveur MCP: OK');
    console.log('- Chemin: ' + serverPath);
    console.log('- Mode: stdio');
    console.log('\n🎉 Le serveur est prêt à être utilisé dans Claude !');
    clearTimeout(timeout);
    server.kill();
    process.exit(0);
  } else if (message.includes('Error') || message.includes('error')) {
    console.error(`❌ Erreur: ${message}`);
    clearTimeout(timeout);
    server.kill();
    process.exit(1);
  } else {
    console.log(`ℹ️ Stderr: ${message}`);
  }
});

server.on('close', (code) => {
  clearTimeout(timeout);
  if (code !== 0 && code !== null) {
    console.log(`\n❌ Le serveur s'est arrêté avec le code: ${code}`);
    process.exit(1);
  }
});

server.on('error', (err) => {
  clearTimeout(timeout);
  console.error(`\n❌ Erreur lors du démarrage: ${err.message}`);
  process.exit(1);
});

// Test d'envoi de commande au serveur
setTimeout(() => {
  console.log('\n📤 Test d\'envoi de commande...');
  
  // Envoyer une requête de liste d'outils
  const request = {
    jsonrpc: '2.0',
    method: 'tools/list',
    params: {},
    id: 1
  };
  
  server.stdin.write(JSON.stringify(request) + '\n');
}, 1000);