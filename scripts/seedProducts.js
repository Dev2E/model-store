const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kfqquqappfixjuakgotf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcXF1cWFwcGZpeGp1YWtnb3RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzEwMDk5MDcsImV4cCI6MTk4NjU4OTkwN30.Vn4FP6E6BNeZMgWCJ1DZ-_PYxJJhfGJ8RVpcN6GZLHI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 20 produtos Vellenia Store - Moda Minimalista
const newProducts = [
  {
    name: 'Camiseta Básica Branca',
    description: 'Camiseta essencial em algodão 100%. Perfeita para combinar com qualquer look. Conforto máximo e durabilidade garantida.',
    price: 89.90,
    category: 'Camisetas',
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    active: true,
    stock: 50
  },
  {
    name: 'Camiseta Preta Lisa',
    description: 'Essencial do guarda-roupa minimalista. Camiseta preta clássica em algodão premium para qualquer ocasião.',
    price: 89.90,
    category: 'Camisetas',
    image_url: 'https://images.unsplash.com/photo-1577215645519-245bb4ba61fa?w=400&h=500&fit=crop',
    active: true,
    stock: 50
  },
  {
    name: 'Camiseta Cinza Mescla',
    description: 'Camiseta versátil em cinza mescla. Soft ao toque e resistente à lavagem. A base perfeita para qualquer estilo.',
    price: 89.90,
    category: 'Camisetas',
    image_url: 'https://images.unsplash.com/photo-1517836357463-d25ddfcb85c0?w=400&h=500&fit=crop',
    active: true,
    stock: 45
  },
  {
    name: 'Camiseta Oversized Bege',
    description: 'Camiseta descontraída em corte oversized. Tecido macio e respirável, ideal para um visual confortável e elegante.',
    price: 109.90,
    category: 'Camisetas',
    image_url: 'https://images.unsplash.com/photo-1503708243548-ba820c3262bb?w=400&h=500&fit=crop',
    active: true,
    stock: 40
  },
  {
    name: 'Calça Jeans Slim Azul',
    description: 'Calça jeans clássica em corte slim. Modelagem perfeita que alonga as pernas. Durável e versátil para todo dia.',
    price: 199.90,
    category: 'Calças',
    image_url: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=500&fit=crop',
    active: true,
    stock: 35
  },
  {
    name: 'Calça Jeans Preta Premium',
    description: 'Jeans premium em tom preto profundo. Excelente caimento e qualidade superior que dura anos.',
    price: 219.90,
    category: 'Calças',
    image_url: 'https://images.unsplash.com/photo-1542602927-b8c8f38a47ed?w=400&h=500&fit=crop',
    active: true,
    stock: 30
  },
  {
    name: 'Calça Chino Bege',
    description: 'Calça chino confortável em bege neutro. Perfeita para um visual casual e sofisticado ao mesmo tempo.',
    price: 189.90,
    category: 'Calças',
    image_url: 'https://images.unsplash.com/photo-1473882019230-f9ce9034b96d?w=400&h=500&fit=crop',
    active: true,
    stock: 28
  },
  {
    name: 'Calça Alfaiataria Cinza',
    description: 'Calça alfaiataria em cinza mescla. Elegante e confortável para reuniões e eventos especiais.',
    price: 249.90,
    category: 'Calças',
    image_url: 'https://images.unsplash.com/photo-1554631197-24cf45a63c88?w=400&h=500&fit=crop',
    active: true,
    stock: 25
  },
  {
    name: 'Blazer Oversized Branco',
    description: 'Blazer estruturado em corte oversized. Perfeito para arrasar em qualquer ocasião. Tecido de qualidade impecável.',
    price: 349.90,
    category: 'Blazers',
    image_url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=500&fit=crop',
    active: true,
    stock: 20
  },
  {
    name: 'Blazer Preto Clássico',
    description: 'Blazer preto intemporal. Elevate seu guarda-roupa com essa peça essencial que funciona em qualquer contexto.',
    price: 349.90,
    category: 'Blazers',
    image_url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=500&fit=crop',
    active: true,
    stock: 18
  },
  {
    name: 'Blazer Caramelo',
    description: 'Blazer em tom caramelo quente. Adiciona sofisticação e aconchego ao seu look de forma elegante.',
    price: 349.90,
    category: 'Blazers',
    image_url: 'https://images.unsplash.com/photo-1539533057440-7bf86ad9131c?w=400&h=500&fit=crop',
    active: true,
    stock: 16
  },
  {
    name: 'Vestido Preto Minimalista',
    description: 'Vestido preto simple e elegante. A peça básica que toda mulher minimalista precisa no guarda-roupa.',
    price: 279.90,
    category: 'Vestidos',
    image_url: 'https://images.unsplash.com/photo-1595777707802-221d02d23f7b?w=400&h=500&fit=crop',
    active: true,
    stock: 22
  },
  {
    name: 'Vestido Branco Longo',
    description: 'Vestido longo em branco puro. Elegância atemporal para cerimônias e eventos especiais.',
    price: 329.90,
    category: 'Vestidos',
    image_url: 'https://images.unsplash.com/photo-1564693267537-b5cf2c4f96f2?w=400&h=500&fit=crop',
    active: true,
    stock: 15
  },
  {
    name: 'Vestido Midi Cinza',
    description: 'Vestido midi em tom cinza elegante. Comprimento perfeito para um visual sofisticado e confortável.',
    price: 299.90,
    category: 'Vestidos',
    image_url: 'https://images.unsplash.com/photo-1612336307429-8a88e8d08dbb?w=400&h=500&fit=crop',
    active: true,
    stock: 18
  },
  {
    name: 'Cardigan Creme',
    description: 'Cardigan suave em tom creme. Perfeito para camadas em dias mais frescos com máximo conforto.',
    price: 169.90,
    category: 'Cardigans',
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=500&fit=crop',
    active: true,
    stock: 32
  },
  {
    name: 'Cardigan Preto Elegante',
    description: 'Cardigan preto versátil em lã mistura. Essencial para elevar qualquer outfit casual ou formal.',
    price: 179.90,
    category: 'Cardigans',
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=500&fit=crop',
    active: true,
    stock: 28
  },
  {
    name: 'Cardigan Bege Oversized',
    description: 'Cardigan oversized em bege quente. Conforto máximo com estilo minimalista e casual chique.',
    price: 189.90,
    category: 'Cardigans',
    image_url: 'https://images.unsplash.com/photo-1551251135-cac8118b1ee7?w=400&h=500&fit=crop',
    active: true,
    stock: 24
  },
  {
    name: 'Bolsa Minimalista Preta',
    description: 'Bolsa estruturada em couro sintético preto. Funcionalidade e elegância em uma peça atemporal.',
    price: 159.90,
    category: 'Acessórios',
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop',
    active: true,
    stock: 40
  },
  {
    name: 'Cinto Couro Marrom',
    description: 'Cinto clássico em couro genuíno marrom. Detalhes de qualidade que completam qualquer look.',
    price: 79.90,
    category: 'Acessórios',
    image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop',
    active: true,
    stock: 60
  },
  {
    name: 'Óculos de Sol Vintage',
    description: 'Óculos com armação vintage em metal. Proteção UV com estilo atemporal minimalista.',
    price: 129.90,
    category: 'Acessórios',
    image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=500&fit=crop',
    active: true,
    stock: 35
  }
];

async function seedDatabase() {
  try {
    console.log('🗑️  Limpando produtos existentes...');
    
    // Deletar todos os produtos
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (deleteError) {
      console.error('❌ Erro ao deletar produtos:', deleteError);
      return;
    }
    
    console.log('✅ Produtos deletados com sucesso!');
    
    console.log('\n📦 Criando 20 novos produtos Vellenia Store...');
    
    // Inserir novos produtos
    const { data, error } = await supabase
      .from('products')
      .insert(newProducts)
      .select();
    
    if (error) {
      console.error('❌ Erro ao criar produtos:', error);
      return;
    }
    
    console.log('✅ 20 produtos criados com sucesso!');
    console.log(`\n📋 Resumo:`);
    console.log(`   - Total de produtos: ${newProducts.length}`);
    console.log(`   - Camisetas: 4`);
    console.log(`   - Calças: 4`);
    console.log(`   - Blazers: 3`);
    console.log(`   - Vestidos: 3`);
    console.log(`   - Cardigans: 3`);
    console.log(`   - Acessórios: 3`);
    console.log(`\n🎉 Banco de dados atualizado para Vellenia Store!`);
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

seedDatabase();
