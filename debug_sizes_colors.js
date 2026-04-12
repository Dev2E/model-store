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

async function populateProductData() {
  try {
    console.log('🔄 Populando dados de tamanho e cor...\n');

    // Buscar um produto de camiseta
    const { data: products, error: searchError } = await supabase
      .from('products')
      .select('*')
      .ilike('name', '%Camiseta%')
      .limit(1);

    if (searchError) {
      console.error('❌ Erro ao buscar:', searchError.message);
      process.exit(1);
    }

    if (!products || products.length === 0) {
      console.error('❌ Nenhum produto encontrado');
      process.exit(1);
    }

    const product = products[0];
    console.log(`📦 Testando com: ${product.name}`);
    console.log(`   ID: ${product.id}`);
    console.log(`   Sizes antes: ${JSON.stringify(product.sizes)}`);
    console.log(`   Colors antes: ${JSON.stringify(product.colors)}\n`);

    // Tentar atualizar com dados
    const newSizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const newColors = [
      { name: "white", label: "Branco" },
      { name: "black", label: "Preto" },
      { name: "gray", label: "Cinza" }
    ];

    console.log(`🔄 Tentando atualizar...`);
    const { data: updated, error: updateError } = await supabase
      .from('products')
      .update({
        sizes: newSizes,
        colors: newColors
      })
      .eq('id', product.id)
      .select();

    if (updateError) {
      console.error('❌ Erro ao atualizar:', updateError.message);
      process.exit(1);
    }

    console.log(`✅ Atualizado com sucesso!`);
    console.log(`   Sizes depois: ${JSON.stringify(updated[0]?.sizes)}`);
    console.log(`   Colors depois: ${JSON.stringify(updated[0]?.colors)}`);

    // Verificar de novo
    const { data: verified } = await supabase
      .from('products')
      .select('sizes, colors')
      .eq('id', product.id)
      .single();

    console.log(`\n🔍 Verificação:`)
    console.log(`   Sizes verificado: ${JSON.stringify(verified.sizes)}`);
    console.log(`   Colors verificado: ${JSON.stringify(verified.colors)}`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

populateProductData();
