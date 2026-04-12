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

async function updateAllProducts() {
  try {
    console.log('🔄 Atualizando TODOS os produtos com sizes e colors...\n');

    // Dados padrão por categoria
    const defaultSizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const defaultColors = [
      { name: "black", label: "Preto" },
      { name: "white", label: "Branco" }
    ];

    // Buscar todos os produtos
    const { data: products, error: searchError } = await supabase
      .from('products')
      .select('id, name')
      .eq('active', true);

    if (searchError) {
      console.error('❌ Erro ao buscar:', searchError.message);
      process.exit(1);
    }

    console.log(`📦 Encontrados ${products.length} produtos\n`);

    let updated = 0;
    let errors = 0;

    for (const product of products) {
      const { error } = await supabase
        .from('products')
        .update({
          sizes: defaultSizes,
          colors: defaultColors
        })
        .eq('id', product.id);

      if (error) {
        console.log(`❌ ${product.name}: ${error.message}`);
        errors++;
      } else {
        console.log(`✅ ${product.name}`);
        updated++;
      }
    }

    console.log(`\n📊 Resultado: ${updated} atualizados, ${errors} erros`);

    // Verificar resultado
    const { data: verify } = await supabase
      .from('products')
      .select('id, sizes, colors')
      .eq('active', true)
      .limit(3);

    console.log('\n🔍 Verificação de exemplo:');
    verify.forEach(p => {
      console.log(`   Sizes: ${JSON.stringify(p.sizes)}`);
      console.log(`   Colors: ${JSON.stringify(p.colors)}`);
    });

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

updateAllProducts();
