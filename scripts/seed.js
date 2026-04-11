#!/usr/bin/env node

/**
 * SEED DE DADOS - VELLENIA STORE
 * 
 * Execute com:
 *   npx ts-node scripts/seed.ts
 * 
 * Ou:
 *   node scripts/seed.js
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Erro: Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY em .env.local');
  process.exit(1);
}

const productsData = [
  // CAMISETAS
  {
    name: "Camiseta Minimalista Branca",
    price: 89.90,
    category: "Camisetas",
    collection: "Essenciais",
    description: "Camiseta 100% algodão puro, conforto máximo",
    sizes: ["P", "M", "G", "GG"],
    colors: [{ name: "white", label: "Branco" }],
    image: "👕",
    active: true
  },
  {
    name: "Camiseta Minimalista Preta",
    price: 89.90,
    category: "Camisetas",
    collection: "Essenciais",
    description: "Camiseta premium em preto absoluto",
    sizes: ["P", "M", "G", "GG"],
    colors: [{ name: "black", label: "Preto" }],
    image: "👕",
    active: true
  },
  {
    name: "Camiseta Oversize Bege",
    price: 99.90,
    category: "Camisetas",
    collection: "Premium",
    description: "Camiseta oversized em tom bege quente",
    sizes: ["P", "M", "G", "GG"],
    colors: [{ name: "bone", label: "Bege" }],
    image: "👕",
    active: true
  },

  // CALÇAS
  {
    name: "Calça Jeans Slim Preta",
    price: 189.90,
    category: "Calças",
    collection: "Essenciais",
    description: "Jeans premium, corte slim moderno",
    sizes: ["P", "M", "G", "GG"],
    colors: [{ name: "black", label: "Preto" }],
    image: "👖",
    active: true
  },
  {
    name: "Calça Linho Natural",
    price: 199.90,
    category: "Calças",
    collection: "Verão",
    description: "100% linho, ideal para clima quente",
    sizes: ["P", "M", "G", "GG"],
    colors: [{ name: "bone", label: "Bege" }],
    image: "👖",
    active: true
  },
  {
    name: "Calça Cargo Premium",
    price: 249.90,
    category: "Calças",
    collection: "Premium",
    description: "Calça cargo sofisticada com detalhes únicos",
    sizes: ["M", "G", "GG"],
    colors: [{ name: "black", label: "Preto" }, { name: "gray", label: "Cinza" }],
    image: "👖",
    active: true
  },

  // BLAZERS
  {
    name: "Blazer Estruturado Preto",
    price: 349.90,
    category: "Blazers",
    collection: "Premium",
    description: "Blazer de corte impeccável, perfeito para eventos",
    sizes: ["P", "M", "G"],
    colors: [{ name: "black", label: "Preto" }],
    image: "🧥",
    active: true
  },
  {
    name: "Blazer Linho Claro",
    price: 329.90,
    category: "Blazers",
    collection: "Verão",
    description: "Blazer em linho natural, leveza e sofisticação",
    sizes: ["M", "G"],
    colors: [{ name: "bone", label: "Bege" }],
    image: "🧥",
    active: true
  },

  // VESTIDOS
  {
    name: "Vestido Midi Noite",
    price: 329.90,
    category: "Vestidos",
    collection: "Premium",
    description: "Vestido elegante para ocasiões especiais",
    sizes: ["P", "M", "G"],
    colors: [{ name: "black", label: "Preto" }],
    image: "👗",
    active: true
  },
  {
    name: "Vestido Social Cinza",
    price: 299.90,
    category: "Vestidos",
    collection: "Essenciais",
    description: "Vestido versátil para uso diário e trabalho",
    sizes: ["P", "M", "G", "GG"],
    colors: [{ name: "gray", label: "Cinza" }],
    image: "👗",
    active: true
  },
  {
    name: "Vestido Longo Praia",
    price: 279.90,
    category: "Vestidos",
    collection: "Verão",
    description: "Vestido fluido perfeito para fim de dia",
    sizes: ["P", "M", "G"],
    colors: [{ name: "white", label: "Branco" }, { name: "bone", label: "Bege" }],
    image: "👗",
    active: true
  }
];

async function seed() {
  try {
    console.log('🌱 Iniciando seed de dados...\n');
    
    // Aqui você pode adicionar lógica para inserir no Supabase
    // Por enquanto, apenas mostra os dados que seriam inseridos
    
    console.log(`✅ ${productsData.length} produtos prontos para inserir`);
    console.log('\n📋 Exemplo de produto:');
    console.log(JSON.stringify(productsData[0], null, 2));
    
    console.log('\n⚠️  Para inserir os dados, configure as credenciais Supabase e execute via CLI:');
    console.log('   npx supabase db push\n');
    
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
    process.exit(1);
  }
}

seed();
