/**
 * Script para atualizar campo categoria com base em category_id
 */

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

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
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Mapeamento de category_id para nome
const categoryMap = {
  1: "Camisetas",
  2: "Calças",
  3: "Blazers",
  4: "Vestidos"
};

async function updateCategories() {
  console.log('🔄 Atualizando campo category nos produtos...\n');

  try {
    // Buscar todos os produtos
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, category_id')
      .eq('active', true);

    if (fetchError) {
      console.error('❌ Erro ao buscar produtos:', fetchError);
      return;
    }

    console.log(`📦 Encontrados ${products.length} produtos\n`);

    // Atualizar cada produto
    for (const product of products) {
      const categoryName = categoryMap[product.category_id] || 'Outros';
      
      const { error } = await supabase
        .from('products')
        .update({ category: categoryName })
        .eq('id', product.id);

      if (error) {
        console.error(`❌ Erro ao atualizar produto ${product.id}:`, error.message);
      } else {
        console.log(`✅ Produto ${product.id} -> "${categoryName}"`);
      }
    }

    console.log('\n✨ Atualização concluída!');

    // Teste
    const { data: test } = await supabase
      .from('products')
      .select('name, category_id, category')
      .eq('active', true)
      .limit(3);
    
    console.log('\n🔍 Verificação:');
    console.log(JSON.stringify(test, null, 2));

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

updateCategories();
