#!/usr/bin/env node

/**
 * SCRIPT DE CORREÇÃO - Cria categoria Sapatos e atualiza produtos
 */

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
  } catch (e) {
    // Ignore
  }
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY em .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixShoeCategory() {
  try {
    console.log('🔧 Corrigindo categoria Sapatos...\n');

    // Buscar todas as categorias
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name');

    if (catError) {
      console.error('❌ Erro ao buscar categorias:', catError.message);
      process.exit(1);
    }

    console.log('📋 Categorias disponíveis:');
    categories.forEach(cat => {
      console.log(`  - ${cat.name} (ID: ${cat.id})`);
    });

    let shoesId = categories.find(c => c.name === 'Sapatos')?.id;

    if (!shoesId) {
      console.log('\n⚠️  Categoria Sapatos não encontrada. Usando Acessórios como fallback.');
      shoesId = categories.find(c => c.name === 'Acessórios')?.id;
    } else {
      console.log('\n✅ Categoria Sapatos encontrada');
    }

    if (!shoesId) {
      console.error('❌ Nenhuma categoria disponível para atualizar sapatos');
      process.exit(1);
    }

    console.log(`📌 Usando categoria com ID: ${shoesId}\n`);

    // Atualizar produtos de sapatos
    const shoePatterns = ['Tênis', 'Bota', 'Mocassim', 'Sandália', 'Sapato'];
    
    let updated = 0;
    for (const pattern of shoePatterns) {
      const { data: products, error: searchError } = await supabase
        .from('products')
        .select('id, name')
        .ilike('name', `%${pattern}%`);

      if (searchError) {
        console.error(`❌ Erro ao buscar ${pattern}:`, searchError.message);
        continue;
      }

      for (const product of products || []) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ category_id: shoesId })
          .eq('id', product.id);

        if (updateError) {
          console.log(`❌ Erro ao atualizar ${product.name}: ${updateError.message}`);
        } else {
          console.log(`✅ Atualizado: ${product.name}`);
          updated++;
        }
      }
    }

    console.log(`\n✨ ${updated} produtos atualizados!`);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

fixShoeCategory();
