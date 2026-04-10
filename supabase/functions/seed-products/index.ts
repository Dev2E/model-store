import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  );

  const newProducts = [
    {
      name: 'Camiseta Básica Branca',
      description: 'Camiseta essencial em algodão 100%. Perfeita para combinar com qualquer look. Conforto máximo e durabilidade garantida.',
      price: 89.90,
      category: 'Camisetas',
      image: '👕',
      active: true,
      stock: 50
    },
    {
      name: 'Camiseta Preta Lisa',
      description: 'Essencial do guarda-roupa minimalista. Camiseta preta clássica em algodão premium para qualquer ocasião.',
      price: 89.90,
      category: 'Camisetas',
      image: '👕',
      active: true,
      stock: 50
    },
    {
      name: 'Camiseta Cinza Mescla',
      description: 'Camiseta versátil em cinza mescla. Soft ao toque e resistente à lavagem. A base perfeita para qualquer estilo.',
      price: 89.90,
      category: 'Camisetas',
      image: '👕',
      active: true,
      stock: 45
    },
    {
      name: 'Camiseta Oversized Bege',
      description: 'Camiseta descontraída em corte oversized. Tecido macio e respirável, ideal para um visual confortável e elegante.',
      price: 109.90,
      category: 'Camisetas',
      image: '👕',
      active: true,
      stock: 40
    },
    {
      name: 'Calça Jeans Slim Azul',
      description: 'Calça jeans clássica em corte slim. Modelagem perfeita que alonga as pernas. Durável e versátil para todo dia.',
      price: 199.90,
      category: 'Calças',
      image: '👖',
      active: true,
      stock: 35
    },
    {
      name: 'Calça Jeans Preta Premium',
      description: 'Jeans premium em tom preto profundo. Excelente caimento e qualidade superior que dura anos.',
      price: 219.90,
      category: 'Calças',
      image: '👖',
      active: true,
      stock: 30
    },
    {
      name: 'Calça Chino Bege',
      description: 'Calça chino confortável em bege neutro. Perfeita para um visual casual e sofisticado ao mesmo tempo.',
      price: 189.90,
      category: 'Calças',
      image: '👖',
      active: true,
      stock: 28
    },
    {
      name: 'Calça Alfaiataria Cinza',
      description: 'Calça alfaiataria em cinza mescla. Elegante e confortável para reuniões e eventos especiais.',
      price: 249.90,
      category: 'Calças',
      image: '👖',
      active: true,
      stock: 25
    },
    {
      name: 'Blazer Oversized Branco',
      description: 'Blazer estruturado em corte oversized. Perfeito para arrasar em qualquer ocasião. Tecido de qualidade impecável.',
      price: 349.90,
      category: 'Blazers',
      image: '🧥',
      active: true,
      stock: 20
    },
    {
      name: 'Blazer Preto Clássico',
      description: 'Blazer preto intemporal. Elevate seu guarda-roupa com essa peça essencial que funciona em qualquer contexto.',
      price: 349.90,
      category: 'Blazers',
      image: '🧥',
      active: true,
      stock: 18
    },
    {
      name: 'Blazer Caramelo',
      description: 'Blazer em tom caramelo quente. Adiciona sofisticação e aconchego ao seu look de forma elegante.',
      price: 349.90,
      category: 'Blazers',
      image: '🧥',
      active: true,
      stock: 16
    },
    {
      name: 'Vestido Preto Minimalista',
      description: 'Vestido preto simples e elegante. A peça básica que toda mulher minimalista precisa no guarda-roupa.',
      price: 279.90,
      category: 'Vestidos',
      image: '👗',
      active: true,
      stock: 22
    },
    {
      name: 'Vestido Branco Longo',
      description: 'Vestido longo em branco puro. Elegância atemporal para cerimônias e eventos especiais.',
      price: 329.90,
      category: 'Vestidos',
      image: '👗',
      active: true,
      stock: 15
    },
    {
      name: 'Vestido Midi Cinza',
      description: 'Vestido midi em tom cinza elegante. Comprimento perfeito para um visual sofisticado e confortável.',
      price: 299.90,
      category: 'Vestidos',
      image: '👗',
      active: true,
      stock: 18
    },
    {
      name: 'Cardigan Creme',
      description: 'Cardigan suave em tom creme. Perfeito para camadas em dias mais frescos com máximo conforto.',
      price: 169.90,
      category: 'Cardigans',
      image: '🧶',
      active: true,
      stock: 32
    },
    {
      name: 'Cardigan Preto Elegante',
      description: 'Cardigan preto versátil em lã mistura. Essencial para elevar qualquer outfit casual ou formal.',
      price: 179.90,
      category: 'Cardigans',
      image: '🧶',
      active: true,
      stock: 28
    },
    {
      name: 'Cardigan Bege Oversized',
      description: 'Cardigan oversized em bege quente. Conforto máximo com estilo minimalista e casual chique.',
      price: 189.90,
      category: 'Cardigans',
      image: '🧶',
      active: true,
      stock: 24
    },
    {
      name: 'Bolsa Minimalista Preta',
      description: 'Bolsa estruturada em couro sintético preto. Funcionalidade e elegância em uma peça atemporal.',
      price: 159.90,
      category: 'Acessórios',
      image: '👜',
      active: true,
      stock: 40
    },
    {
      name: 'Cinto Couro Marrom',
      description: 'Cinto clássico em couro genuíno marrom. Detalhes de qualidade que completam qualquer look.',
      price: 79.90,
      category: 'Acessórios',
      image: '⌚',
      active: true,
      stock: 60
    },
    {
      name: 'Óculos de Sol Vintage',
      description: 'Óculos com armação vintage em metal. Proteção UV com estilo atemporal minimalista.',
      price: 129.90,
      category: 'Acessórios',
      image: '😎',
      active: true,
      stock: 35
    }
  ];

  try {
    // Desativar produtos antigos
    console.log('Desativando produtos antigos...');
    await supabaseClient
      .from('products')
      .update({ active: false })
      .neq('id', -1);

    // Inserir novos produtos
    console.log('Inserindo novos produtos...');
    const { data, error } = await supabaseClient
      .from('products')
      .insert(newProducts)
      .select();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Banco de dados atualizado com sucesso!',
        products_created: data?.length || 0,
      }),
      { headers: corsHeaders }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
