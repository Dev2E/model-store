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

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProductsData() {
  try {
    console.log('🧪 Testando dados dos produtos...\n');

    // Buscar alguns produtos
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        category_id,
        category:category_id (name),
        sizes,
        colors,
        active
      `)
      .eq('active', true)
      .limit(5);

    if (error) {
      console.error('❌ Erro:', error.message);
      process.exit(1);
    }

    console.log('✅ Produtos encontrados: ' + products.length + '\n');
    
    products.forEach((p, i) => {
      console.log(`${i+1}. ${p.name}`);
      console.log(`   Categoria: ${p.category?.name || '(sem categoria)'}`);
      console.log(`   Tamanhos: ${p.sizes ? p.sizes.join(', ') : '(sem tamanhos)'}`);
      console.log(`   Cores: ${p.colors ? p.colors.map(c => c.label).join(', ') : '(sem cores)'}`);
      console.log('');
    });

    // Estatísticas
    const { data: allProducts } = await supabase
      .from('products')
      .select('id, category_id, sizes, colors')
      .eq('active', true);

    const withCategory = allProducts.filter(p => p.category_id).length;
    const withSizes = allProducts.filter(p => p.sizes && p.sizes.length > 0).length;
    const withColors = allProducts.filter(p => p.colors && p.colors.length > 0).length;

    console.log('📊 Estatísticas:');
    console.log(`✅ Com categoria: ${withCategory}/${allProducts.length}`);
    console.log(`✅ Com tamanhos: ${withSizes}/${allProducts.length}`);
    console.log(`✅ Com cores: ${withColors}/${allProducts.length}`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

testProductsData();
