/**
 * Script para atualizar TODOS os produtos com dados corretos de sizes e colors
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

async function updateAllProducts() {
  console.log('🔄 Atualizando TODOS os produtos com dados de sizes e colors...\n');

  try {
    // Buscar todos os produtos ativos
    const { data: products } = await supabase
      .from('products')
      .select('id, name, category_id')
      .eq('active', true);

    if (!products || products.length === 0) {
      console.error('❌ Nenhum produto encontrado');
      return;
    }

    console.log(`📦 Atualizando ${products.length} produtos:\n`);

    // Mapeamento de dados por categoria
    const sizesByCategory = {
      1: ["P", "M", "G", "GG"],      // Camisetas
      2: ["P", "M", "G", "GG"],      // Calças
      3: ["P", "M", "G"],            // Blazers
      4: ["P", "M", "G", "GG"]       // Vestidos
    };

    const colorsByCategory = {
      1: [                  // Camisetas
        { name: "white", label: "Branco" },
        { name: "black", label: "Preto" },
        { name: "gray", label: "Cinza" },
        { name: "bone", label: "Bege" }
      ],
      2: [                  // Calças
        { name: "black", label: "Preto" },
        { name: "blue", label: "Azul" },
        { name: "bone", label: "Bege" }
      ],
      3: [                  // Blazers
        { name: "black", label: "Preto" },
        { name: "gray", label: "Cinza" }
      ],
      4: [                  // Vestidos
        { name: "black", label: "Preto" },
        { name: "white", label: "Branco" },
        { name: "bone", label: "Bege" }
      ]
    };

    let updated = 0;
    for (const product of products) {
      const sizes = sizesByCategory[product.category_id] || ["P", "M", "G"];
      const colors = colorsByCategory[product.category_id] || [];

      const { error } = await supabase
        .from('products')
        .update({
          sizes,
          colors
        })
        .eq('id', product.id);

      if (!error) {
        updated++;
        console.log(`✅ [${product.category_id}] ${product.name}`);
      } else {
        console.error(`❌ Erro em ${product.name}:`, error.message);
      }
    }

    console.log(`\n✨ ${updated}/${products.length} produtos atualizados com sucesso!`);

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

updateAllProducts();
