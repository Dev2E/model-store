#!/usr/bin/env node

/**
 * 🔐 VERIFICADOR DE SEGURANÇA
 * 
 * Script para verificar se não há chaves expostas ou dados sensíveis
 * no repositório antes de commitar/fazer push.
 * 
 * Uso: npm run security-check
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Arquivos/pastas para não escanear
const EXCLUDED = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'vercel.json',
  '.gitignore',
  'package-lock.json',
  'yarn.lock',
];

// Padrões de segurança que NÃO devem estar no código
const SECURITY_PATTERNS = [
  { pattern: /VITE_SUPABASE_ANON_KEY\s*=\s*[a-zA-Z0-9]{40,}/i, name: 'Supabase Key' },
  { pattern: /VITE_MERCADOPAGO_PUBLIC_KEY\s*=\s*APP_USR_[a-zA-Z0-9]{20,}/i, name: 'Mercado Pago Key' },
  { pattern: /VITE_RECAPTCHA_KEY\s*=\s*[0-9a-zA-Z_-]{40,}/i, name: 'reCAPTCHA Key' },
  { pattern: /sk_test_[a-zA-Z0-9]{20,}/i, name: 'Stripe Secret Key' },
  { pattern: /pk_test_[a-zA-Z0-9]{20,}/i, name: 'Stripe Public Key' },
  { pattern: /password\s*[:"'=\s]+[a-zA-Z0-9!@#$%^&*]{8,}/i, name: 'Password in code' },
  { pattern: /api[_-]?key\s*[:"'=\s]+[a-zA-Z0-9]{20,}/i, name: 'API Key in code' },
  { pattern: /secret\s*[:"'=\s]+[a-zA-Z0-9]{20,}/i, name: 'Secret in code' },
  { pattern: /token\s*[:"'=\s]+[a-zA-Z0-9.]{20,}/i, name: 'Token in code' },
];

// Arquivos suspeitos
const DANGEROUS_FILES = ['.env', '.env.production', '.env.development', '.env.local', '.keys', 'secrets'];

let errors = [];
let warnings = [];

// Função recursiva para verificar diretório
function scanDir(dir, relativePath = '') {
  try {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const relativeFilePath = path.join(relativePath, file);

      // Skip excluded files/dirs
      if (EXCLUDED.includes(file)) continue;
      if (file.startsWith('.') && file !== '.env.example') continue;

      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        scanDir(filePath, relativeFilePath);
      } else if (stat.isFile()) {
        // Check for dangerous files
        if (DANGEROUS_FILES.some(dangerous => file === dangerous)) {
          errors.push(`❌ Arquivo sensível encontrado: ${relativeFilePath}`);
          errors.push(`   Este arquivo contém chaves! NÃO commitar!`);
          continue;
        }

        // Only check text files
        if (!['.js', '.jsx', '.ts', '.tsx', '.json', '.env.example', '.md'].some(ext => file.endsWith(ext))) {
          continue;
        }

        try {
          const content = fs.readFileSync(filePath, 'utf8');

          // Check for security patterns
          for (const { pattern, name } of SECURITY_PATTERNS) {
            if (pattern.test(content)) {
              // Allow in .env.example com placeholders
              if (file === '.env.example' && content.includes('xxxxx') || content.includes('...')) {
                continue;
              }

              errors.push(`❌ RISCO: ${name} encontrada em ${relativeFilePath}`);
              errors.push(`   Remover antes de commitar/fazer push!`);
            }
          }

          // Aviso: comentários com dados sensíveis
          if (/\/\/.*password|\/\/.*key|\/\/.*secret|\/\/.*token/i.test(content)) {
            warnings.push(`⚠️  Possível dado sensível em comentário: ${relativeFilePath}`);
          }
        } catch (err) {
          // Skip binary files
        }
      }
    }
  } catch (err) {
    console.error(`Erro ao scanear ${dir}:`, err.message);
  }
}

// Executar verificação
console.log('🔐 Iniciando verificação de segurança...\n');

scanDir(process.cwd());

// Resultados
let hasErrors = false;

if (errors.length > 0) {
  console.log('\n' + '='.repeat(60));
  console.log('ERROS CRÍTICOS:');
  console.log('='.repeat(60));
  errors.forEach(error => console.log(error));
  hasErrors = true;
}

if (warnings.length > 0) {
  console.log('\n' + '='.repeat(60));
  console.log('AVISOS:');
  console.log('='.repeat(60));
  warnings.forEach(warning => console.log(warning));
}

console.log('\n' + '='.repeat(60));

if (hasErrors) {
  console.log('❌ Falha na verificação de segurança!');
  console.log('\nAçãos necessárias:');
  console.log('1. Remova chaves expostas do código');
  console.log('2. Use variáveis de ambiente (.env.local)');
  console.log('3. Adicione chaves ao .env.example com placeholders');
  console.log('4. Verifique .gitignore está protegendo .env*');
  process.exit(1);
} else {
  console.log('✅ Verificação de segurança passou!');
  console.log('🚀 Seguro para commitar/fazer push');
  process.exit(0);
}
