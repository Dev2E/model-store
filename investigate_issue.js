#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

let supabaseUrl = process.env.VITE_SUPABASE_URL;
let supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  try {
    const envContent = readFileSync(join(process.cwd(), '.env.local'), 'utf8');
    const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
    const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);
    
    supabaseUrl = urlMatch ? urlMatch[1].trim() : supabaseUrl;
    supabaseKey = keyMatch ? keyMatch[1].trim() : supabaseKey;
  } catch (e) {}
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Configure variáveis no .env.local');
  process.exit(1);
}

// Tentar com múltiplas chaves
const keys = [
  supabaseKey, // Chave anon
  // Se a chave anon não funcionar, temos um problema
];

async function testWithKey(key, keyName) {
  console.log(`\n🧪 Testando com ${keyName}...\n`);
  
  const client = createClient(supabaseUrl, key);

  try {
    // 1. Buscar um produto
    const { data: product, error: searchError } = await client
      .from('products')
      .select('*')
      .eq('id', 1)
      .single();

    if (searchError) {
      console.log(`❌ Erro ao buscar: ${searchError.message}`);
      return;
    }

    console.log(`✅ Produto encontrado: ${product.name}`);
    console.log(`   Sizes atual: ${JSON.stringify(product.sizes)}`);
    console.log(`   Colors atual: ${JSON.stringify(product.colors)}`);

    // 2. Tentar atualizar
    const testData = {
      sizes: ["P", "M", "G"],
      colors: [{ name: "test", label: "Teste" }]
    };

    const { data: updated, error: updateError } = await client
      .from('products')
      .update(testData)
      .eq('id', 1)
      .select('*');

    if (updateError) {
      console.log(`❌ Erro ao atualizar: ${updateError.message}`);
      return;
    }

    console.log(`✅ Update executado`);
    console.log(`   Resposta: ${JSON.stringify(updated)}`);

    // 3. Verificar novamente
    const { data: verified } = await client
      .from('products')
      .select('id, sizes, colors')
      .eq('id', 1)
      .single();

    console.log(`✅ Verificação:`);
    console.log(`   Sizes: ${JSON.stringify(verified.sizes)}`);
    console.log(`   Colors: ${JSON.stringify(verified.colors)}`);

  } catch (error) {
    console.error(`❌ Erro: ${error.message}`);
  }
}

await testWithKey(supabaseKey, 'ANON KEY');

console.log('\n🔍 Se os dados não estão sendo salvos:');
console.log('   1. Verifique as RLS policies da tabela products');
console.log('   2. Verifique se há triggers atualizando/limpando os dados');
console.log('   3. Tente usar a chave SERVICE ROLE (não a anon)');
