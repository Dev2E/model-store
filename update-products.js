/**
 * Script para atualizar produtos com dados de sizes e colors
 * Execute com: node update-products.js
 */

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Ler .env.local
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
  console.error('❌ Erro: Configure .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Dados de atualização por nome de produto (apenas sizes e colors)
const productsUpdate = {
  "Camiseta Básica Branca": {
    sizes: ["P", "M", "G", "GG"],
    colors: [{ name: "white", label: "Branco" }]
  },
  "Camiseta Preta Lisa": {
    sizes: ["P", "M", "G", "GG"],
    colors: [{ name: "black", label: "Preto" }]
  },
  "Camiseta Cinza Mescla": {
    sizes: ["P", "M", "G", "GG"],
    colors: [{ name: "gray", label: "Cinza" }]
  },
  "Camiseta Oversized Bege": {
    sizes: ["P", "M", "G", "GG"],
    colors: [{ name: "bone", label: "Bege" }]
  },
  "Camiseta Premium Algodão Pima": {
    sizes: ["P", "M", "G", "GG"],
    colors: [{ name: "white", label: "Branco" }, { name: "black", label: "Preto" }]
  }
};

async function updateProducts() {
  console.log('🔄 Atualizando produtos com dados de sizes e colors...\n');

  for (const [productName, updateData] of Object.entries(productsUpdate)) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...updateData
        })
        .eq('name', productName)
        .select();

      if (error) {
        console.error(`❌ Erro ao atualizar "${productName}":`, error.message);
      } else {
        console.log(`✅ "${productName}" atualizado com sucesso`);
      }
    } catch (error) {
      console.error(`❌ Erro aplicando atualização em "${productName}":`, error.message);
    }
  }

  console.log('\n✨ Atualização concluída!');
  
  // Teste: buscar produtos novamente
  console.log('\n🔍 Verificando dados atualizados...');
  const { data, error } = await supabase
    .from('products')
    .select('name, category, sizes, colors')
    .eq('active', true)
    .limit(3);

  if (!error && data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

updateProducts();
