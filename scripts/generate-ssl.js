#!/usr/bin/env node

/**
 * Gera certificados SSL self-signed para HTTPS em desenvolvimento
 * Funciona em Windows, macOS e Linux
 * NÃO use em produção (Vercel gerencia SSL automaticamente)
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sslDir = path.join(__dirname, '..', '.ssl');

// Criar pasta .ssl se não existir
if (!fs.existsSync(sslDir)) {
  fs.mkdirSync(sslDir, { recursive: true });
}

const keyPath = path.join(sslDir, 'server.key');
const certPath = path.join(sslDir, 'server.crt');

console.log('🔐 Gerando certificados SSL para desenvolvimento...\n');

// Verificar se OpenSSL está instalado
try {
  execSync('openssl version', { stdio: 'ignore' });
} catch (err) {
  console.error('❌ OpenSSL não encontrado!');
  console.error('\nInstalação:');
  console.error('  Windows: https://slproweb.com/products/Win32OpenSSL.html');
  console.error('  macOS:   brew install openssl');
  console.error('  Linux:   sudo apt-get install openssl');
  process.exit(1);
}

// Gerar certificado
try {
  execSync(`openssl req -x509 -newkey rsa:2048 -keyout "${keyPath}" -out "${certPath}" -days 365 -nodes -subj "/C=BR/ST=SP/L=São Paulo/O=Vellenia/CN=localhost"`, {
    stdio: 'inherit',
  });

  console.log('\n✅ Certificados gerados com sucesso!');
  console.log(`📁 Chave privada:  ${keyPath}`);
  console.log(`📁 Certificado:    ${certPath}`);
  console.log('\n💡 Para usar HTTPS em desenvolvimento:');
  console.log('   $env:VITE_HTTPS="true"; npm run dev   (PowerShell)');
  console.log('   VITE_HTTPS=true npm run dev           (Bash/macOS)');
  console.log('\n⚠️  Aviso:');
  console.log('   - Certificado é self-signed');
  console.log('   - Navegadores mostrarão aviso (é seguro para DEV)');
  console.log('   - Produção: Vercel gerencia SSL automaticamente');
  process.exit(0);
} catch (err) {
  console.error('❌ Erro ao gerar certificados:', err.message);
  process.exit(1);
}
