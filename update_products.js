#!/usr/bin/env node

/**
 * SCRIPT DE ATUALIZAÇÃO - Adiciona tamanhos, cores e categorias aos produtos
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Ler variáveis do .env.local
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

// Mapeamento de categorias
const categoryPatterns = {
  "Camisetas": "Camiseta",
  "Calças": "Calça",
  "Blazers": "Blazer",
  "Vestidos": "Vestido",
  "Cardigans": "Cardigan",
  "Sapatos": ["Tênis", "Bota", "Mocassim", "Sandália", "Sapato"],
  "Acessórios": ["Bolsa", "Cinto", "Óculos", "Colar", "Anel", "Pulseira", "Brincos"]
};

async function updateProducts() {
  try {
    console.log('🔄 Iniciando atualização de produtos...\n');

    // Primeiro, buscar todas as categorias
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name');

    if (catError) {
      console.error('❌ Erro ao buscar categorias:', catError.message);
      process.exit(1);
    }

    console.log(`Found ${categories.length} categories\n`);

    // Criar mapa de categoria nome -> ID
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    // Buscar todos os produtos
    const { data: allProducts, error: fetchError } = await supabase
      .from('products')
      .select('id, name, sizes, colors')
      .eq('active', true);

    if (fetchError) {
      console.error('❌ Erro ao buscar produtos:', fetchError.message);
      process.exit(1);
    }

    console.log(`Found ${allProducts.length} products\n`);

    for (const product of allProducts) {
      let categoryId = null;
      let hasDataUpdate = false;
      const updates = {};

      // Encontrar categoria baseado no nome
      for (const [categoryName, patterns] of Object.entries(categoryPatterns)) {
        const patternList = Array.isArray(patterns) ? patterns : [patterns];
        if (patternList.some(p => product.name.includes(p))) {
          categoryId = categoryMap[categoryName];
          if (categoryId) {
            updates.category_id = categoryId;
            hasDataUpdate = true;
          }
          break;
        }
      }

      // Adicionar dados de tamanho e color se vazios
      if (!product.sizes || product.sizes.length === 0) {
        updates.sizes = ["XS", "S", "M", "L", "XL", "XXL"];
        hasDataUpdate = true;
      }

      if (!product.colors || product.colors.length === 0) {
        updates.colors = [
          { name: "black", label: "Preto" },
          { name: "white", label: "Branco" }
        ];
        hasDataUpdate = true;
      }

      if (!hasDataUpdate && !categoryId) {
        console.log(`⚠️  ${product.name}: Sem categoria mapeada e dados completos`);
        continue;
      }

      // Atualizar o produto
      const { error: updateError } = await supabase
        .from('products')
        .update(updates)
        .eq('id', product.id);

      if (updateError) {
        console.log(`❌ ${product.name}: ${updateError.message}`);
      } else {
        const catName = categoryId ? Object.entries(categoryMap).find(([name, id]) => id === categoryId)?.[0] : 'sem categoria';
        console.log(`✅ ${product.name}: Atualizado (categoria: ${catName})`);
      }
    }

    console.log('\n✨ Atualização concluída!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

updateProducts();
