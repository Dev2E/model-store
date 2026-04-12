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

async function updateShoesToCalçados() {
  try {
    console.log('🔧 Atualizando Sapatos para categoria Calçados...\n');

    // ID correto para Calçados é 7
    const calçadosId = 7;

    // Atualizar produtos de sapatos
    const shoePatterns = ['Tênis', 'Bota', 'Mocassim', 'Sandália', 'Sapato'];
    
    let updated = 0;
    for (const pattern of shoePatterns) {
      const { data: products } = await supabase
        .from('products')
        .select('id, name')
        .ilike('name', `%${pattern}%`);

      for (const product of products || []) {
        const { error } = await supabase
          .from('products')
          .update({ category_id: calçadosId })
          .eq('id', product.id);

        if (!error) {
          console.log(`✅ ${product.name} -> Calçados`);
          updated++;
        }
      }
    }

    console.log(`\n✨ ${updated} produtos corrigidos!`);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

updateShoesToCalçados();
