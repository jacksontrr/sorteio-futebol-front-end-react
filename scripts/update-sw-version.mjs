#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Gera versão baseada em timestamp
const version = Date.now().toString();

// Caminho do service worker
const swPath = join(__dirname, '../dist/service-worker.js');

try {
  // Lê o arquivo do service worker
  let swContent = readFileSync(swPath, 'utf-8');
  
  // Substitui o placeholder pela versão real
  swContent = swContent.replace('{{BUILD_VERSION}}', version);
  
  // Escreve de volta
  writeFileSync(swPath, swContent, 'utf-8');
  
  console.log(`✅ Service Worker atualizado com versão: ${version}`);
} catch (error) {
  console.error('❌ Erro ao atualizar service worker:', error.message);
  process.exit(1);
}
