/**
 * Script de teste para verificar os dados dos produtos no Supabase
 * Execute com: node test-products.js
 */

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Ler .env.local manualmente
const envContent = readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  if (line && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    if (key && value) envVars[key.trim()] = value.trim();
  }
});

const SUPABASE_URL = envVars.VITE_SUPABASE_URL;
const SUPABASE_KEY = envVars.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Erro: Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env.local');
  console.error('SUPABASE_URL:', SUPABASE_URL);
  console.error('SUPABASE_KEY:', SUPABASE_KEY);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testProducts() {
  console.log('🔍 Testando dados de produtos com JOIN...\n');
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id (name)
      `)
      .eq('active', true)
      .limit(5);

    if (error) {
      console.error('❌ Erro ao buscar produtos:', error);
      return;
    }

    console.log(`✅ Encontrados ${data?.length || 0} produtos ativos\n`);

    if (data && data.length > 0) {
      console.log('📦 Exemplo de primeiro produto:');
      console.log(JSON.stringify(data[0], null, 2));

      console.log('\n\n🔍 Análise dos dados:');
      const firstProduct = data[0];
      const categoryName = firstProduct.categories?.name;
      console.log('- Nome:', firstProduct.name);
      console.log('- Categoria (do JOIN):', categoryName);
      console.log('- Sizes:', firstProduct.sizes, '-> Array?', Array.isArray(firstProduct.sizes));
      console.log('- Colors:', firstProduct.colors, '-> Array?', Array.isArray(firstProduct.colors));

      console.log('\n\n📊 Resumo de todos os produtos:');
      data.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name}`);
        console.log('   - Categoria:', p.categories?.name || 'undefined');
        console.log('   - Sizes:', p.sizes && p.sizes.length > 0 ? `✅ ${p.sizes.length} tamanhos` : '❌ vazio');
        console.log('   - Colors:', p.colors && p.colors.length > 0 ? `✅ ${p.colors.length} cores` : '❌ vazio');
      });
    } else {
      console.warn('⚠️  Nenhum produto encontrado.');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testProducts();
