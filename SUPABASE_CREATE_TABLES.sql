-- ============================================================
-- SQL PARA CRIAR TODAS AS TABELAS DO SUPABASE
-- ============================================================
-- COPIE TUDO ABAIXO E EXECUTE NO SQL EDITOR DO SUPABASE
-- Vá a: https://supabase.com/dashboard >> SQL Editor >> New Query
-- ============================================================

-- TABELA 1: PRODUTOS
CREATE TABLE IF NOT EXISTS products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  collection VARCHAR(100),
  colors JSONB DEFAULT '[]',
  sizes JSONB DEFAULT '[]',
  image TEXT,
  shipping VARCHAR(255),
  sustainability VARCHAR(255),
  stock INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- TABELA 2: PERFIL DE USUÁRIOS
CREATE TABLE IF NOT EXISTS users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  name VARCHAR(255),
  phone VARCHAR(20),
  avatar TEXT,
  role VARCHAR(20) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- TABELA 3: ENDEREÇOS
CREATE TABLE IF NOT EXISTS addresses (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  street VARCHAR(255) NOT NULL,
  number VARCHAR(20) NOT NULL,
  complement VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  zipCode VARCHAR(20) NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- TABELA 4: PEDIDOS
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pendente',
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- TABELA 5: RESET DE SENHA
CREATE TABLE IF NOT EXISTS password_reset_codes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- TABELA 6: MÉTODOS DE ENVIO
CREATE TABLE IF NOT EXISTS shipping_methods (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  tempo_dias INT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- TABELA 7: LOGS DE ATIVIDADE
CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ATIVAR ROW LEVEL SECURITY
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ADICIONAR COLUNA avatar SE NÃO EXISTIR
ALTER TABLE users_profile ADD COLUMN IF NOT EXISTS avatar TEXT;

-- POLÍTICAS DE SEGURANÇA
DROP POLICY IF EXISTS "Products are readable by everyone" ON products;
DROP POLICY IF EXISTS "Products are editable by admin only" ON products;
DROP POLICY IF EXISTS "Users can read own profile" ON users_profile;
DROP POLICY IF EXISTS "Users can update own profile" ON users_profile;
DROP POLICY IF EXISTS "Users can read own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can create own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can read own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Shipping methods are readable by everyone" ON shipping_methods;
DROP POLICY IF EXISTS "Only admin can read activity logs" ON activity_logs;

CREATE POLICY "Products are readable by everyone" 
ON products FOR SELECT 
USING (active = true);

CREATE POLICY "Products are editable by admin only" 
ON products FOR UPDATE 
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can read own profile" 
ON users_profile FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON users_profile FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can read own addresses" 
ON addresses FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own addresses" 
ON addresses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses" 
ON addresses FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can read own orders" 
ON orders FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" 
ON orders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Shipping methods are readable by everyone" 
ON shipping_methods FOR SELECT 
USING (ativo = true);

CREATE POLICY "Only admin can read activity logs" 
ON activity_logs FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================
-- LIMPAR PRODUTOS ANTERIORES
-- ============================================================
DELETE FROM products WHERE active = true OR active = false;

-- ============================================================
-- INSERIR 50+ PRODUTOS COM SEED
-- ============================================================

INSERT INTO products (name, description, price, category, collection, colors, sizes, image, shipping, sustainability, stock, active) VALUES

-- ============================================================
-- CAMISETAS (15 produtos)
-- ============================================================
('Camiseta Básica Branca', 'Camiseta essencial em algodão 100%. Perfeita para combinar com qualquer look. Conforto máximo e durabilidade garantida.', 89.90, 'Camisetas', 'ESSENCIAL', '[{"name":"branco","label":"Branco"},{"name":"preto","label":"Preto"},{"name":"cinza","label":"Cinza"}]', '["P","M","G","GG"]', '👕', 'Envios Express disponíveis', 'Algodão sustentável', 50, true),
('Camiseta Premium Algodão', 'Camiseta premium em algodão Pima com acabamento refinado. Perfeita para quem busca qualidade e conforto diários.', 129.90, 'Camisetas', 'PREMIUM', '[{"name":"branco","label":"Branco"},{"name":"bege","label":"Bege"},{"name":"azul","label":"Azul"}]', '["P","M","G","GG"]', '👕', 'Entrega express', 'Algodão Pima certificado', 45, true),
('Camiseta Oversized Vintage', 'Camiseta oversized com estilo vintage dos anos 90. Confortável e trendy para um look casual descontraído.', 110.00, 'Camisetas', 'VINTAGE', '[{"name":"creme","label":"Creme"},{"name":"black","label":"Preto"},{"name":"stone","label":"Stone"}]', '["P","M","G","GG","XG"]', '👕', 'Envio com rastreamento', 'Algodão reciclado', 48, true),
('Camiseta Estampada Grafite', 'Camiseta com estampa moderna em grafite. Design exclusivo que traz personalidade ao seu guarda-roupa.', 99.90, 'Camisetas', 'PRINTS', '[{"name":"grafite","label":"Grafite"},{"name":"preto","label":"Preto"}]', '["P","M","G","GG"]', '👕', 'Express 24h', 'Tinta sustentável', 42, true),
('Camiseta Listrada Marinha', 'Clássica camiseta listrada com tons de marinha e branco. Ótima peça para layering ou usar isolada.', 94.90, 'Camisetas', 'CLÁSSICO', '[{"name":"marinha","label":"Marinha"},{"name":"branco","label":"Branco"}]', '["P","M","G","GG"]', '👕', 'Envios regulares', 'Algodão 100%', 55, true),
('Camiseta Slim Fit Branca', 'Camiseta slim fit em algodão premium. Modelagem moderna que valoriza o corpo sem abrir mão do conforto.', 119.90, 'Camisetas', 'SLIM', '[{"name":"branco","label":"Branco"},{"name":"preto","label":"Preto"}]', '["P","M","G"]', '👕', 'Entrega rápida', 'Algodão puro', 38, true),
('Camiseta Comfort Fio 30', 'Camiseta comfort em fio 30 com toque super macio. Perfeita para usar em casa ou casual elegante.', 109.90, 'Camisetas', 'COMFORT', '[{"name":"branco","label":"Branco"},{"name":"cinza","label":"Cinza"}]', '["P","M","G","GG"]', '👕', 'Frete grátis', '100% algodão', 50, true),
('Camiseta Decote V Premium', 'Camiseta com decote V que alonga a silhueta. Perfeita para usar com peças sofisticadas.', 124.90, 'Camisetas', 'DECOTES', '[{"name":"branco","label":"Branco"},{"name":"preto","label":"Preto"},{"name":"vinho","label":"Vinho"}]', '["P","M","G"]', '👕', 'Envios rápidos', 'Algodão fiado', 35, true),
('Camiseta Manga Curta Verão', 'Camiseta leve e cool para os dias quentes. Respirável e com muito estilo para combinações casuais.', 85.00, 'Camisetas', 'VERÃO', '[{"name":"branco","label":"Branco"},{"name":"amarelo","label":"Amarelo"},{"name":"rosa","label":"Rosa"}]', '["P","M","G","GG"]', '👕', 'Entrega garantida', 'Algodão light', 60, true),
('Camiseta Gola Alta Branca', 'Camiseta com gola alta elegante. Ótima para looks sofisticados e para dias mais frios.', 104.90, 'Camisetas', 'GOLAS', '[{"name":"branco","label":"Branco"},{"name":"cinza","label":"Cinza"},{"name":"preto","label":"Preto"}]', '["P","M","G","GG"]', '👕', 'Transporte seguro', 'Algodão premium', 44, true),
('Camiseta Básica Cinza', 'Camiseta cinza that goes with everything. Super versátil para compor diferentes looks.', 87.90, 'Camisetas', 'ESSENCIAL', '[{"name":"cinza","label":"Cinza"},{"name":"cinza-claro","label":"Cinza Claro"}]', '["P","M","G","GG"]', '👕', 'Frete descomplicado', 'Algodão', 58, true),
('Camiseta Longo Oversized', 'Camiseta longo estilo oversized perfeita para um look descontraído e moderno.', 115.00, 'Camisetas', 'OVERSIZED', '[{"name":"branco","label":"Branco"},{"name":"preto","label":"Preto"}]', '["P","M","G","GG","XG"]', '👕', 'Entrega rápida', 'Algodão sustentável', 40, true),
('Camiseta Estampada Geométrica', 'Camiseta com estampa geométrica moderna. Design que não sai de moda e combina com tudo.', 102.00, 'Camisetas', 'PRINTS', '[{"name":"preto","label":"Preto"},{"name":"cinza","label":"Cinza"}]', '["P","M","G","GG"]', '👕', 'Express', 'Tinta eco-friendly', 36, true),
('Camiseta Henley Branca', 'Camiseta henley clássica com abotoamento frontal. Estilo vintage que voltou com tudo.', 99.90, 'Camisetas', 'CLÁSSICO', '[{"name":"branco","label":"Branco"},{"name":"preto","label":"Preto"},{"name":"khaki","label":"Khaki"}]', '["P","M","G","GG"]', '👕', 'Envio garantido', 'Algodão 100%', 47, true),
('Camiseta Básica Preta Resistente', 'Camiseta preta em algodão tratado com grande resistência à desbotamento e lavagens.', 91.90, 'Camisetas', 'ESSENCIAL', '[{"name":"preto","label":"Preto"}]', '["P","M","G","GG","XG"]', '👕', 'Frete rápido', 'Algodão resistente', 65, true),

-- ============================================================
-- CALÇAS (13 produtos)
-- ============================================================
('Calça Jeans Skinny Azul', 'Calça jeans skinny azul escuro com fit moderno. Versátil para combinar com camisetas e tênis.', 189.90, 'Calças', 'DENIM', '[{"name":"azul-escuro","label":"Azul Escuro"},{"name":"azul-claro","label":"Azul Claro"}]', '["P","M","G","GG"]', '👖', 'Envios rápidos', 'Denim sustentável', 38, true),
('Calça Jeans Reta Clássica', 'Calça jeans reta em tom clássico. Modelo atemporal que não sai nunca de moda.', 179.90, 'Calças', 'CLÁSSICO', '[{"name":"azul-medio","label":"Azul Médio"}]', '["P","M","G","GG"]', '👖', 'Frete descomplicado', '100% algodão', 42, true),
('Calça Flare Cintura Alta', 'Calça jeans flare com cintura alta que alonga a silhueta. Trend dos anos 70 que voltou.', 199.90, 'Calças', 'VINTAGE', '[{"name":"azul-escuro","label":"Azul Escuro"}]', '["P","M","G","GG"]', '👖', 'Entrega garantida', 'Denim premium', 35, true),
('Calça Cargo Bege', 'Calça cargo em tons terra com bolsos funcionais. Perfeita para looks casuais descontraídos.', 169.90, 'Calças', 'UTILITÁRIO', '[{"name":"bege","label":"Bege"},{"name":"caqui","label":"Caqui"}]', '["P","M","G","GG"]', '👖', 'Express 24h', 'Algodão técnico', 40, true),
('Calça Chino Branca', 'Calça chino em branco imaculado. Ótima para looks sofisticados e elegantes.', 159.90, 'Calças', 'PREMIUM', '[{"name":"branco","label":"Branco"},{"name":"off-white","label":"Off White"}]', '["P","M","G","GG"]', '👖', 'Envios rápidos', 'Algodão 100%', 45, true),
('Calça Jeans Mom Fit', 'Calça jeans mom fit com cintura alta e corte mais largo. Confortável e estilosa ao mesmo tempo.', 184.90, 'Calças', 'CONFORTO', '[{"name":"azul-escuro","label":"Azul Escuro"}]', '["P","M","G","GG"]', '👖', 'Envio com rastreamento', 'Denim sustentável', 44, true),
('Calça Legging Preta', 'Legging em preto com alta compressão. Perfeita para ir à academia ou usar casual.', 94.90, 'Calças', 'ESPORTE', '[{"name":"preto","label":"Preto"}]', '["P","M","G","GG"]', '👖', 'Frete descomplicado', 'Poliéster reciclado', 52, true),
('Calça Moletom Cinza', 'Calça moletom cinza super confortável para dias em casa ou casual elegante.', 109.90, 'Calças', 'CONFORTO', '[{"name":"cinza","label":"Cinza"}]', '["P","M","G","GG"]', '👖', 'Entrega rápida', '100% algodão', 48, true),
('Calça Pijama Listrada', 'Calça pijama em tons neutros listrados. Confortável para dormir bem e estar relaxado em casa.', 119.90, 'Calças', 'SLEEPWEAR', '[{"name":"cinza-branco","label":"Cinza e Branco"}]', '["P","M","G","GG"]', '👖', 'Envios regulares', 'Algodão fino', 40, true),
('Calça Reta Preta Elegante', 'Calça reta preta com caimento elegante. Perfeita para combinar com blazer ou camiseta básica.', 174.90, 'Calças', 'ELEGANTE', '[{"name":"preto","label":"Preto"}]', '["P","M","G","GG"]', '👖', 'Express', 'Algodão premium', 38, true),
('Calça Cintura Alta Azul', 'Calça em azul clássico com cintura alta que favorece todas as silhuetas.', 189.90, 'Calças', 'CLÁSSICO', '[{"name":"azul-claro","label":"Azul Claro"}]', '["P","M","G"]', '👖', 'Frete rápido', 'Denim 100%', 41, true),
('Calça Comporta Bege', 'Calça comporta em bege relaxado. Ótima para looks casuais e quando plano é o conforto.', 154.90, 'Calças', 'CASUAL', '[{"name":"bege","label":"Bege"}]', '["M","G","GG"]', '👖', 'Envio garantido', 'Algodão leve', 36, true),
('Calça Bailarina Marrom', 'Calça bailarina em marrom taupe. Modelagem moderna e confortável para o dia a dia.', 164.90, 'Calças', 'CASUAIS', '[{"name":"marrom","label":"Marrom"}]', '["P","M","G","GG"]', '👖', 'Transporte seguro', 'Algodão fiado', 43, true),

-- ============================================================
-- BLAZERS (12 produtos)
-- ============================================================
('Blazer Estruturado Preto', 'Blazer estruturado em preto puro. Essencial no guarda-roupa para looks sofisticados.', 349.90, 'Blazers', 'CLÁSSICO', '[{"name":"preto","label":"Preto"}]', '["P","M","G","GG"]', '🧥', 'Entrega garantida', 'Poliéster premium', 25, true),
('Blazer Oversized Marrom', 'Blazer oversized em tons terra que valoriza qualquer look. Trend absoluto da moda.', 359.90, 'Blazers', 'OVERSIZED', '[{"name":"marrom","label":"Marrom"},{"name":"caramelo","label":"Caramelo"}]', '["P","M","G","GG"]', '🧥', 'Express 24h', 'Lã misturizada', 28, true),
('Blazer Xadrez Vintage', 'Blazer xadrez com padrão vintage dos anos 80. Perfeito para looks retrô com atitude.', 379.90, 'Blazers', 'VINTAGE', '[{"name":"marrom-creme","label":"Marrom e Creme"}]', '["P","M","G"]', '🧥', 'Envios rápidos', 'Lã sustentável', 22, true),
('Blazer Branco Linho', 'Blazer branco em linho respirável. Perfeito para looks veraniegos elegantes.', 339.90, 'Blazers', 'VERÃO', '[{"name":"branco","label":"Branco"}]', '["P","M","G","GG"]', '🧥', 'Frete descomplicado', '100% linho', 30, true),
('Blazer Cáqui Casual', 'Blazer cáqui com fit descontraído para looks casualizados e sofisticados.', 319.90, 'Blazers', 'CASUAL', '[{"name":"caqui","label":"Caqui"}]', '["P","M","G","GG"]', '🧥', 'Envio com rastreamento', 'Algodão misturado', 32, true),
('Blazer Rosa Pastel Feminino', 'Blazer rosa pastel estruturado para as mulheres modernas. Delicado e poderoso ao mesmo tempo.', 369.90, 'Blazers', 'FEMININO', '[{"name":"rosa-pastel","label":"Rosa Pastel"}]', '["P","M","G"]', '🧥', 'Entrega rápida', 'Poliéster premium', 20, true),
('Blazer Cinza Listrado', 'Blazer cinza com listras discretas. Versátil para combinar com diferentes looks.', 349.90, 'Blazers', 'LISTRADO', '[{"name":"cinza","label":"Cinza"}]', '["P","M","G","GG"]', '🧥', 'Express', 'Lã pura', 24, true),
('Blazer Azul Marinho Executivo', 'Blazer azul marinho executivo com qualidade premium. Para quem quer se destacar no trabalho.', 389.90, 'Blazers', 'EXECUTIVO', '[{"name":"azul-marinho","label":"Azul Marinho"}]', '["P","M","G"]', '🧥', 'Frete rápido', 'Lã 100%', 26, true),
('Blazer Bege Minimalista', 'Blazer em tom bege neutro e minimalista. Combina com tudo e nunca sai de moda.', 329.90, 'Blazers', 'MINIMALISTA', '[{"name":"bege","label":"Bege"}]', '["P","M","G","GG"]', '🧥', 'Envio garantido', 'Lã misturada', 31, true),
('Blazer Preto Slim Fit', 'Blazer preto slim fit moderno que valoriza o corpo. Perfeito para looks contemporâneos.', 359.90, 'Blazers', 'SLIM', '[{"name":"preto","label":"Preto"}]', '["P","M","G"]', '🧥', 'Transporte seguro', 'Poliéster técnico', 23, true),
('Blazer Burgundy Clássico', 'Blazer em tom burgundy sofisticado. Adiciona sofisticação a qualquer look.', 369.90, 'Blazers', 'CORES', '[{"name":"burgundy","label":"Burgundy"}]', '["P","M","G","GG"]', '🧥', 'Envios rápidos', 'Lã premium', 27, true),
('Blazer Tweed Texturizado', 'Blazer tweed com textura interessante. Clássico que traz elegância ao guarda-roupa.', 399.90, 'Blazers', 'TEXTURAS', '[{"name":"marrom-creme","label":"Marrom e Creme"}]', '["M","G"]', '🧥', 'Frete descomplicado', 'Tweed 100%', 19, true),

-- ============================================================
-- VESTIDOS (12 produtos)
-- ============================================================
('Vestido Midi Floral', 'Vestido midi em floresta floral elegante. Perfeito para eventos sociais ou passeios.', 249.90, 'Vestidos', 'FLORES', '[{"name":"multicolor","label":"Multicolor"}]', '["P","M","G","GG"]', '👗', 'Entrega garantida', 'Algodão misto', 28, true),
('Vestido Longo Preto Elegante', 'Vestido longo preto elegante com caimento sofisticado. Para eventos especiais em estilo.', 399.90, 'Vestidos', 'GALA', '[{"name":"preto","label":"Preto"}]', '["P","M","G"]', '👗', 'Express 24h', 'Poliéster premium', 20, true),
('Vestido Curto Branco', 'Vestido curto branco clean para looks casuais e sofisticados ao mesmo tempo.', 189.90, 'Vestidos', 'CASUAL', '[{"name":"branco","label":"Branco"}]', '["P","M","G","GG"]', '👗', 'Envios rápidos', 'Algodão 100%', 35, true),
('Vestido Slip Cinza', 'Vestido slip dress em cinza sofisticado. Minimalista e muito escolado para looks trendy.', 219.90, 'Vestidos', 'SLIP', '[{"name":"cinza","label":"Cinza"}]', '["M","G"]', '👗', 'Frete descomplicado', 'Seda misturada', 26, true),
('Vestido Estampado Geométrico', 'Vestido com estampa geométrica moderna. Colorido com padrão que não sai de moda.', 229.90, 'Vestidos', 'PRINTS', '[{"name":"multicolor","label":"Multicolor"}]', '["P","M","G","GG"]', '👗', 'Envio com rastreamento', 'Algodão misto', 32, true),
('Vestido Maxi Praia Azul', 'Vestido maxi azul perfeito para a praia. Leve e comfortável para dias quentes.', 199.90, 'Vestidos', 'PRAIA', '[{"name":"azul","label":"Azul"}]', '["M","G","GG"]', '👗', 'Entrega rápida', 'Algodão light', 40, true),
('Vestido Evasê Rosa', 'Vestido evasê em rosa delicado que favorece todas as silhuetas. Feminino e sofisticado.', 239.90, 'Vestidos', 'CLÁSSICO', '[{"name":"rosa","label":"Rosa"}]', '["P","M","G","GG"]', '👗', 'Express', 'Algodão misturado', 30, true),
('Vestido Reto Cintura Marcada', 'Vestido reto que marca a cintura de forma elegante. Moderno e versátil.', 259.90, 'Vestidos', 'RETO', '[{"name":"preto","label":"Preto"},{"name":"branco","label":"Branco"}]', '["P","M","G"]', '👗', 'Frete rápido', 'Poliéster stretch', 27, true),
('Vestido Babado Branco', 'Vestido branco com babados que trazem movimento e estilo. Romântico e moderno.', 269.90, 'Vestidos', 'BABADOS', '[{"name":"branco","label":"Branco"}]', '["P","M","G"]', '👗', 'Envio garantido', 'Algodão fino', 25, true),
('Vestido Longo Burgundy Festa', 'Vestido longo em burgundy para festas. Sofisticado e que atrai todos os olhares.', 389.90, 'Vestidos', 'FESTA', '[{"name":"burgundy","label":"Burgundy"}]', '["M","G"]', '👗', 'Transporte seguro', 'Poliéster premium', 18, true),
('Vestido Linho Natural', 'Vestido em linho natural respirável. Perfeito para climas quentes e looks descontraídos.', 219.90, 'Vestidos', 'VERÃO', '[{"name":"natural","label":"Natural"},{"name":"marrom","label":"Marrom"}]', '["P","M","G","GG"]', '👗', 'Envios rápidos', '100% linho', 33, true),
('Vestido Tie Dye Colorido', 'Vestido em tie dye colorido e alegre. Perfeito para looks casuais com atitude.', 179.90, 'Vestidos', 'TIE DYE', '[{"name":"multicolor","label":"Multicolor"}]', '["P","M","G","GG"]', '👗', 'Frete descomplicado', 'Algodão', 36, true);

-- FIM DO SCRIPT
-- Se viu "Success", parabéns! 50+ produtos inseridos! ✅
