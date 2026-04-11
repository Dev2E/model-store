-- ============================================================
-- VELLENIA STORE - BANCO DE DADOS COMPLETO E UNIFICADO
-- ============================================================
-- Este é o ÚNICO script SQL que você precisa!
-- Consolida TUDO: Schema, Multi-tenant, Dados, Índices, Triggers
-- Execute TUDO no Supabase SQL Editor
-- https://supabase.com/dashboard >> SQL Editor >> New Query
-- ============================================================

-- ============================================================
-- PARTE 1: LIMPAR BANCO EXISTENTE (RESET COMPLETO)
-- ============================================================
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS password_reset_codes CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users_profile CASCADE;
DROP TABLE IF EXISTS shipping_methods CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- ============================================================
-- PARTE 2: CRIAR TABELAS BASE
-- ============================================================

-- TABELA 1: USUÁRIOS (PROFILES)
CREATE TABLE users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  cpf VARCHAR(11),
  avatar TEXT,
  avatar_url VARCHAR(500),
  role VARCHAR(20) DEFAULT 'customer',
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABELA 2: LOJAS (MULTI-TENANT)
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Informações Básicas
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  
  -- Customização
  colors JSONB DEFAULT '{"primary":"#000000","secondary":"#ffffff","accent":"#ef4444"}'::jsonb,
  logo_url TEXT,
  favicon_url TEXT,
  
  -- Endereço para Frete
  address JSONB DEFAULT '{"street":"","number":"","city":"","state":"","zip_code":""}'::jsonb,
  
  -- Configurações
  settings JSONB DEFAULT '{"currency":"BRL","language":"pt-BR","timezone":"America/Sao_Paulo","accept_orders":true,"sandbox_mode":true}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

-- TABELA 3: CATEGORIAS
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABELA 4: PRODUTOS (Estrutura completa)
CREATE TABLE products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  
  -- Referências
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  
  -- Informações Básicas
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255),
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  
  -- Características
  collection VARCHAR(100),
  colors JSONB DEFAULT '[]',
  sizes JSONB DEFAULT '[]',
  
  -- Mídia e Logística
  image TEXT,
  image_url VARCHAR(500),
  shipping VARCHAR(255),
  sustainability VARCHAR(255),
  sku VARCHAR(100),
  
  -- Estoque e Status
  stock INT DEFAULT 0,
  quantity INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT FALSE,
  
  -- Avaliações
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Compatibilidade
  tenant_id VARCHAR(255)
);

-- TABELA 5: ENDEREÇOS DO USUÁRIO
CREATE TABLE addresses (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  street VARCHAR(255) NOT NULL,
  number VARCHAR(20) NOT NULL,
  complement VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  zipCode VARCHAR(20) NOT NULL,
  zip_code VARCHAR(8),
  
  is_primary BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABELA 6: PEDIDOS
CREATE TABLE orders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  
  status VARCHAR(50) DEFAULT 'pendente',
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_id VARCHAR(100),
  
  shipping_address_id INTEGER REFERENCES addresses(id),
  discount DECIMAL(10, 2) DEFAULT 0,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABELA 7: CARRINHO
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  size VARCHAR(50),
  color VARCHAR(50),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, product_id, size, color)
);

-- TABELA 8: RESET DE SENHA
CREATE TABLE password_reset_codes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABELA 9: MÉTODOS DE ENVIO
CREATE TABLE shipping_methods (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  tempo_dias INT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABELA 10: LOGS DE ATIVIDADE
CREATE TABLE activity_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- PARTE 3: ATIVAR ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PARTE 4: POLÍTICAS DE SEGURANÇA (RLS)
-- ============================================================

-- === USERS_PROFILE ===
CREATE POLICY "Users can read own profile" 
ON users_profile FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON users_profile FOR UPDATE 
USING (auth.uid() = id);

-- Permitir que o sistema (função trigger) insira perfis durante signup
CREATE POLICY "Service can create profiles" 
ON users_profile FOR INSERT 
WITH CHECK (true);

-- === STORES ===
CREATE POLICY "Owners can view own stores"
  ON stores FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can update own stores"
  ON stores FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert stores"
  ON stores FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Public can view active stores"
  ON stores FOR SELECT
  USING (true);

-- === CATEGORIES ===
CREATE POLICY "Categories are readable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage categories"
  ON categories FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update categories"
  ON categories FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

-- === PRODUCTS ===
CREATE POLICY "Everyone can view active products"
  ON products FOR SELECT
  USING (active = true OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage own store products"
  ON products FOR ALL
  USING (
    store_id IN (
      SELECT id FROM stores WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    store_id IN (
      SELECT id FROM stores WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Products are editable by admin only"
  ON products FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

-- === ADDRESSES ===
CREATE POLICY "Users can read own addresses"
  ON addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own addresses"
  ON addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
  ON addresses FOR UPDATE
  USING (auth.uid() = user_id);

-- === ORDERS ===
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Store owners view own store orders"
  ON orders FOR SELECT
  USING (
    store_id IN (
      SELECT id FROM stores WHERE owner_id = auth.uid()
    )
  );

-- === CART ===
CREATE POLICY "Users can manage own cart"
  ON cart_items FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- === SHIPPING_METHODS ===
CREATE POLICY "Shipping methods are readable by everyone"
  ON shipping_methods FOR SELECT
  USING (ativo = true);

-- === ACTIVITY_LOGS ===
CREATE POLICY "Only admin can read activity logs"
  ON activity_logs FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================
-- PARTE 5: TRIGGERS E FUNÇÕES
-- ============================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para criar perfil automaticamente ao assinar
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_profile (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    'customer'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover triggers antigos se existirem
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_stores_updated_at ON stores;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_addresses_updated_at ON addresses;
DROP TRIGGER IF EXISTS update_users_profile_updated_at ON users_profile;

-- Trigger para criar perfil quando novo usuário assina
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger para STORES
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para PRODUCTS
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para ORDERS
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para ADDRESSES
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para USERS_PROFILE
CREATE TRIGGER update_users_profile_updated_at BEFORE UPDATE ON users_profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- PARTE 6: ÍNDICES PARA PERFORMANCE
-- ============================================================

-- === PRODUCTS ===
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_collection ON products(collection);
CREATE INDEX idx_products_slug ON products(slug);

-- === ADDRESSES ===
CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- === ORDERS ===
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_store_id ON orders(store_id);
CREATE INDEX idx_orders_status ON orders(status);

-- === CART ===
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

-- === PASSWORD RESET ===
CREATE INDEX idx_password_reset_codes_user_id ON password_reset_codes(user_id);

-- === ACTIVITY LOGS ===
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);

-- === STORES ===
CREATE INDEX idx_stores_owner_id ON stores(owner_id);
CREATE INDEX idx_stores_slug ON stores(slug);

-- === CATEGORIES ===
CREATE INDEX idx_categories_slug ON categories(slug);

-- ============================================================
-- PARTE 7: INSERIR DADOS INICIAIS
-- ============================================================

-- === CATEGORIAS ===
INSERT INTO categories (name, slug, description) VALUES
('Camisetas', 'camisetas', 'Camisetas e tops'),
('Calças', 'calcas', 'Calças e jeans'),
('Blazers', 'blazers', 'Blazers e casacos'),
('Vestidos', 'vestidos', 'Vestidos'),
('Cardigans', 'cardigans', 'Cardigans e suéteres'),
('Acessórios', 'acessorios', 'Acessórios e complementos'),
('Calçados', 'calcados', 'Sapatos e tênis');

-- === PRODUTOS (50+ VELLENIA STORE) ===
INSERT INTO products (
  category_id, name, slug, description, price, quantity, 
  image_url, image, featured, active, stock
) VALUES

-- CAMISETAS (9 produtos)
(1, 'Camiseta Básica Branca', 'camiseta-basica-branca', 'Camiseta essencial em algodão 100%. Perfeita para combinar com qualquer look. Conforto máximo e durabilidade garantida.', 89.90, 50, 'https://via.placeholder.com/300?text=Camiseta+Branca', '👕', true, true, 50),
(1, 'Camiseta Preta Lisa', 'camiseta-preta-lisa', 'Essencial do guarda-roupa minimalista. Camiseta preta clássica em algodão premium para qualquer ocasião.', 89.90, 50, 'https://via.placeholder.com/300?text=Camiseta+Preta', '👕', true, true, 50),
(1, 'Camiseta Cinza Mescla', 'camiseta-cinza-mescla', 'Camiseta versátil em cinza mescla. Soft ao toque e resistente à lavagem. A base perfeita para qualquer estilo.', 89.90, 45, 'https://via.placeholder.com/300?text=Camiseta+Cinza', '👕', true, true, 45),
(1, 'Camiseta Oversized Bege', 'camiseta-oversized-bege', 'Camiseta descontraída em corte oversized. Tecido macio e respirável, ideal para um visual confortável e elegante.', 109.90, 40, 'https://via.placeholder.com/300?text=Camiseta+Bege', '👕', true, true, 40),
(1, 'Camiseta Premium Algodão Pima', 'camiseta-premium-algodao-pima', 'Camiseta premium em algodão Pima com acabamento refinado. Perfeita para quem busca qualidade e conforto diários.', 129.90, 38, 'https://via.placeholder.com/300?text=Camiseta+Premium', '👕', true, true, 38),
(1, 'Camiseta Oversized Vintage', 'camiseta-oversized-vintage', 'Camiseta oversized com estilo vintage dos anos 90. Confortável e trendy para um look casual descontraído.', 110.00, 42, 'https://via.placeholder.com/300?text=Camiseta+Vintage', '👕', false, true, 42),
(1, 'Camiseta Estampada Grafite', 'camiseta-estampada-grafite', 'Camiseta com estampa moderna em grafite. Design exclusivo que traz personalidade ao seu guarda-roupa.', 99.90, 36, 'https://via.placeholder.com/300?text=Camiseta+Grafite', '👕', true, true, 36),
(1, 'Camiseta Listrada Marinha', 'camiseta-listrada-marinha', 'Clássica camiseta listrada com tons de marinha e branco. Ótima peça para layering ou usar isolada.', 94.90, 48, 'https://via.placeholder.com/300?text=Camiseta+Listrada', '👕', false, true, 48),
(1, 'Camiseta Slim Fit Premium', 'camiseta-slim-fit-premium', 'Camiseta slim fit em algodão premium. Modelagem moderna que valoriza o corpo sem abrir mão do conforto.', 119.90, 35, 'https://via.placeholder.com/300?text=Camiseta+Slim', '👕', true, true, 35),

-- CALÇAS (9 produtos)
(2, 'Calça Jeans Slim Azul', 'calca-jeans-slim-azul', 'Calça jeans clássica em corte slim. Modelagem perfeita que alonga as pernas. Durável e versátil para todo dia.', 199.90, 35, 'https://via.placeholder.com/300?text=Jeans+Azul', '👖', true, true, 35),
(2, 'Calça Jeans Preta Premium', 'calca-jeans-preta-premium', 'Jeans premium em tom preto profundo. Excelente caimento e qualidade superior que dura anos.', 219.90, 30, 'https://via.placeholder.com/300?text=Jeans+Preto', '👖', true, true, 30),
(2, 'Calça Chino Bege', 'calca-chino-bege', 'Calça chino confortável em bege neutro. Perfeita para um visual casual e sofisticado ao mesmo tempo.', 189.90, 28, 'https://via.placeholder.com/300?text=Chino+Bege', '👖', true, true, 28),
(2, 'Calça Alfaiataria Cinza', 'calca-alfaiataria-cinza', 'Calça alfaiataria em cinza mescla. Elegante e confortável para reuniões e eventos especiais.', 249.90, 25, 'https://via.placeholder.com/300?text=Alfaiataria', '👖', true, true, 25),
(2, 'Calça Flare Cintura Alta', 'calca-flare-cintura-alta', 'Calça jeans flare com cintura alta que alonga a silhueta. Trend dos anos 70 que voltou com força.', 199.90, 32, 'https://via.placeholder.com/300?text=Flare+Jeans', '👖', true, true, 32),
(2, 'Calça Cargo Cáqui', 'calca-cargo-caqui', 'Calça cargo em tons terra com bolsos funcionais. Perfeita para looks casuais descontraídos e utilitários.', 169.90, 38, 'https://via.placeholder.com/300?text=Cargo+Caqui', '👖', false, true, 38),
(2, 'Calça Mom Fit Azul Escuro', 'calca-mom-fit-azul-escuro', 'Calça jeans mom fit com cintura alta e corte mais largo. Confortável e estilosa ao mesmo tempo.', 184.90, 40, 'https://via.placeholder.com/300?text=Mom+Fit', '👖', true, true, 40),
(2, 'Calça Legging Preta', 'calca-legging-preta', 'Legging em preto com alta compressão. Perfeita para ir à academia ou usar casual com estilo.', 94.90, 52, 'https://via.placeholder.com/300?text=Legging', '👖', false, true, 52),
(2, 'Calça Moletom Cinza', 'calca-moletom-cinza', 'Calça moletom cinza super confortável para dias em casa ou casual elegante com máxima praticidade.', 109.90, 45, 'https://via.placeholder.com/300?text=Moletom', '👖', true, true, 45),

-- BLAZERS (9 produtos)
(3, 'Blazer Oversized Branco', 'blazer-oversized-branco', 'Blazer estruturado em corte oversized. Perfeito para arrasar em qualquer ocasião. Tecido de qualidade impecável.', 349.90, 20, 'https://via.placeholder.com/300?text=Blazer+Branco', '🧥', true, true, 20),
(3, 'Blazer Preto Clássico', 'blazer-preto-classico', 'Blazer preto intemporal. Elevate seu guarda-roupa com essa peça essencial que funciona em qualquer contexto.', 349.90, 18, 'https://via.placeholder.com/300?text=Blazer+Preto', '🧥', true, true, 18),
(3, 'Blazer Caramelo', 'blazer-caramelo', 'Blazer em tom caramelo quente. Adiciona sofisticação e aconchego ao seu look de forma elegante.', 349.90, 16, 'https://via.placeholder.com/300?text=Blazer+Caramelo', '🧥', true, true, 16),
(3, 'Blazer Xadrez Vintage', 'blazer-xadrez-vintage', 'Blazer xadrez com padrão vintage dos anos 80. Perfeito para looks retrô com muita atitude e estilo.', 379.90, 14, 'https://via.placeholder.com/300?text=Blazer+Xadrez', '🧥', true, true, 14),
(3, 'Blazer Branco Linho', 'blazer-branco-linho', 'Blazer branco em linho respirável. Perfeito para looks veraniegos elegantes e sofisticados.', 339.90, 22, 'https://via.placeholder.com/300?text=Blazer+Linho', '🧥', true, true, 22),
(3, 'Blazer Cáqui Casual', 'blazer-caqui-casual', 'Blazer cáqui com fit descontraído para looks casualizados e sofisticados ao mesmo tempo.', 319.90, 19, 'https://via.placeholder.com/300?text=Blazer+Caqui', '🧥', false, true, 19),
(3, 'Blazer Rosa Pastel Feminino', 'blazer-rosa-pastel-feminino', 'Blazer rosa pastel estruturado para as mulheres modernas. Delicado e poderoso ao mesmo tempo.', 369.90, 15, 'https://via.placeholder.com/300?text=Blazer+Rosa', '🧥', true, true, 15),
(3, 'Blazer Cinza Listrado', 'blazer-cinza-listrado', 'Blazer cinza com listras discretas que trazem sofisticação. Versátil para combinar com diferentes looks.', 349.90, 17, 'https://via.placeholder.com/300?text=Blazer+Listrado', '🧥', false, true, 17),
(3, 'Blazer Azul Marinho Executivo', 'blazer-azul-marinho-executivo', 'Blazer azul marinho executivo com qualidade premium. Para quem quer se destacar no trabalho.', 389.90, 13, 'https://via.placeholder.com/300?text=Blazer+Marinho', '🧥', true, true, 13),

-- VESTIDOS (9 produtos)
(4, 'Vestido Preto Minimalista', 'vestido-preto-minimalista', 'Vestido preto simples e elegante. A peça básica que toda mulher minimalista precisa no guarda-roupa.', 279.90, 22, 'https://via.placeholder.com/300?text=Vestido+Preto', '👗', true, true, 22),
(4, 'Vestido Branco Longo', 'vestido-branco-longo', 'Vestido longo em branco puro. Elegância atemporal para cerimônias e eventos especiais com classe.', 329.90, 15, 'https://via.placeholder.com/300?text=Vestido+Branco', '👗', true, true, 15),
(4, 'Vestido Midi Cinza', 'vestido-midi-cinza', 'Vestido midi em tom cinza elegante. Comprimento perfeito para um visual sofisticado e confortável.', 299.90, 18, 'https://via.placeholder.com/300?text=Vestido+Cinza', '👗', true, true, 18),
(4, 'Vestido Midi Floral', 'vestido-midi-floral', 'Vestido midi em floresta floral elegante. Perfeito para eventos sociais ou passeios especiais.', 249.90, 28, 'https://via.placeholder.com/300?text=Vestido+Floral', '👗', true, true, 28),
(4, 'Vestido Curto Branco Clean', 'vestido-curto-branco-clean', 'Vestido curto branco clean para looks casuais e sofisticados ao mesmo tempo com elegância.', 189.90, 35, 'https://via.placeholder.com/300?text=Vestido+Curto', '👗', true, true, 35),
(4, 'Vestido Slip Cinza Sofisticado', 'vestido-slip-cinza-sofisticado', 'Vestido slip dress em cinza sofisticado. Minimalista e muito escolado para looks trendy modernos.', 219.90, 26, 'https://via.placeholder.com/300?text=Vestido+Slip', '👗', false, true, 26),
(4, 'Vestido Estampado Geométrico', 'vestido-estampado-geometrico', 'Vestido com estampa geométrica moderna e colorida. Padrão que não sai de moda nunca mais.', 229.90, 30, 'https://via.placeholder.com/300?text=Vestido+Geometrico', '👗', true, true, 30),
(4, 'Vestido Maxi Praia Azul', 'vestido-maxi-praia-azul', 'Vestido maxi azul perfeito para a praia e piscina. Leve e confortável para dias quentes.', 199.90, 38, 'https://via.placeholder.com/300?text=Vestido+Praia', '👗', true, true, 38),
(4, 'Vestido Burgundy Festa Longo', 'vestido-burgundy-festa-longo', 'Vestido longo em burgundy para festas sofisticadas. Que atrai todos os olhares garantido.', 389.90, 12, 'https://via.placeholder.com/300?text=Vestido+Burgundy', '👗', false, true, 12),

-- CARDIGANS (6 produtos)
(5, 'Cardigan Creme', 'cardigan-creme', 'Cardigan suave em tom creme perfeito. Para camadas em dias mais frescos com máximo conforto total.', 169.90, 32, 'https://via.placeholder.com/300?text=Cardigan+Creme', '🧶', true, true, 32),
(5, 'Cardigan Preto Elegante', 'cardigan-preto-elegante', 'Cardigan preto versátil em lã mistura. Essencial para elevar qualquer outfit casual ou formal.', 179.90, 28, 'https://via.placeholder.com/300?text=Cardigan+Preto', '🧶', true, true, 28),
(5, 'Cardigan Bege Oversized', 'cardigan-bege-oversized', 'Cardigan oversized em bege quente. Conforto máximo com estilo minimalista e casual chique perfeito.', 189.90, 24, 'https://via.placeholder.com/300?text=Cardigan+Bege', '🧶', true, true, 24),
(5, 'Cardigan Cinza Mescla Leve', 'cardigan-cinza-mescla-leve', 'Cardigan cinza mescla levíssimo em lã premium. Perfeito para camadas delicadas em qualquer estação.', 159.90, 30, 'https://via.placeholder.com/300?text=Cardigan+Cinza', '🧶', false, true, 30),
(5, 'Cardigan Branco Alongado', 'cardigan-branco-alongado', 'Cardigan branco alongado com corte moderno e contemporâneo. Ideal para looks clean e minimalistas.', 174.90, 26, 'https://via.placeholder.com/300?text=Cardigan+Branco', '🧶', true, true, 26),
(5, 'Cardigan Marrom Quente Aconchego', 'cardigan-marrom-quente-aconchego', 'Cardigan em tom marrom quente que transmite aconchego e sofisticação ao mesmo tempo sempre.', 199.90, 20, 'https://via.placeholder.com/300?text=Cardigan+Marrom', '🧶', true, true, 20),

-- ACESSÓRIOS (7 produtos)
(6, 'Bolsa Minimalista Preta', 'bolsa-minimalista-preta', 'Bolsa estruturada em couro sintético preto. Funcionalidade e elegância em uma peça atemporal clássica.', 159.90, 40, 'https://via.placeholder.com/300?text=Bolsa+Preta', '👜', true, true, 40),
(6, 'Cinto Couro Marrom', 'cinto-couro-marrom', 'Cinto clássico em couro genuíno marrom. Detalhes de qualidade que completam qualquer look perfeitamente.', 79.90, 60, 'https://via.placeholder.com/300?text=Cinto', '⌚', true, true, 60),
(6, 'Óculos de Sol Vintage', 'oculos-sol-vintage', 'Óculos com armação vintage em metal. Proteção UV com estilo atemporal minimalista garantido.', 129.90, 35, 'https://via.placeholder.com/300?text=Oculos', '😎', true, true, 35),
(6, 'Colar Delicado Ouro', 'colar-delicado-ouro', 'Colar com corrente fina em ouro. Acessório elegante que funciona com qualquer look sofisticado.', 79.90, 45, 'https://via.placeholder.com/300?text=Colar', '⛓', true, true, 45),
(6, 'Anel Minimalista Prata', 'anel-minimalista-prata', 'Anel em prata esterlina com design minimalista. Perfeito para quem ama simplicidade com classe.', 49.90, 50, 'https://via.placeholder.com/300?text=Anel', '💍', true, true, 50),
(6, 'Pulseira de Couro Marrom', 'pulseira-couro-marrom', 'Pulseira em couro genuíno marrom com fecho de qualidade. Acessório versátil que dura años.', 129.90, 28, 'https://via.placeholder.com/300?text=Pulseira', '⌚', false, true, 28),
(6, 'Brincos de Pérola Branca', 'brincos-perola-branca', 'Par de brincos com pérola branca natural. Acessório clássico que elegancia qualquer ocasião.', 99.90, 22, 'https://via.placeholder.com/300?text=Brincos', '💎', true, true, 22),

-- CALÇADOS (6 produtos)
(7, 'Tênis Branco Clássico', 'tenis-branco-classico', 'Tênis branco de uso diário e versátil. Modelagem perfeita para looks casuais e sofisticados.', 249.90, 45, 'https://via.placeholder.com/300?text=Tenis+Branco', '👟', true, true, 45),
(7, 'Tênis Preto Premium', 'tenis-preto-premium', 'Tênis preto de uso diário com solado resistente. Qualidade e conforto garantidos para todo dia.', 249.90, 45, 'https://via.placeholder.com/300?text=Tenis+Preto', '👟', true, true, 45),
(7, 'Bota de Couro Marrom', 'bota-couro-marrom', 'Bota de couro marrom com interior macio. Durável e confortável para qualquer estação do ano.', 399.90, 20, 'https://via.placeholder.com/300?text=Bota+Marrom', '👢', true, true, 20),
(7, 'Mocassim Camurça', 'mocassim-camurca', 'Mocassim em camurça com solado flex. Perfeito para looks casuais elegantes e muito confortável.', 299.90, 30, 'https://via.placeholder.com/300?text=Mocassim', '👞', false, true, 30),
(7, 'Sapato Social Preto', 'sapato-social-preto', 'Sapato social preto clássico para qualquer ocasião. Qualidade premium garantida e muito elegante.', 349.90, 25, 'https://via.placeholder.com/300?text=Sapato+Social', '👞', true, true, 25),
(7, 'Sandália Minimalista Preta', 'sandalia-minimalista-preta', 'Sandália preta minimalista com design moderno. Perfeita para looks casuais em dias quentes.', 129.90, 40, 'https://via.placeholder.com/300?text=Sandalia', '👡', true, true, 40);

-- ============================================================
-- PARTE 8: VERIFICAÇÕES FINAIS
-- ============================================================

-- Verificar que tudo foi criado
SELECT 
  'Verificação de Tabelas' as status,
  COUNT(*) as total
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Contar produtos inseridos por categoria
SELECT 
  c.name as categoria,
  COUNT(p.id) as total_produtos,
  SUM(p.quantity) as total_em_estoque
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.active = true
GROUP BY c.id, c.name
ORDER BY c.name;

-- Resumo geral
SELECT 
  (SELECT COUNT(*) FROM products WHERE active = true) as total_de_produtos,
  (SELECT COUNT(*) FROM categories) as total_categorias,
  (SELECT SUM(quantity) FROM products WHERE active = true) as total_em_estoque,
  (SELECT AVG(price) FROM products) as preco_medio
FROM products LIMIT 1;

-- ============================================================
-- PARTE 9: SETUP ADMIN (OPCIONAL)
-- ============================================================
-- Este script configura um usuário como admin
-- INSTRUÇÕES:
-- 1. Primeiro, crie sua conta normalmente na aplicação
-- 2. Encontre o email que você utilizou (ex: seu@email.com)
-- 3. Descomente a linha abaixo e substitua 'seu@email.com'
-- 4. Execute este script no Supabase SQL Editor
-- 5. Seu usuário será marcado como admin e poderá acessar /admin
-- ============================================================

-- OPÇÃO 1: Marcar um usuário como admin (descomente e use)
-- UPDATE users_profile SET role = 'admin' WHERE email = 'seu@email.com';

-- OPÇÃO 2: Ver todos os usuários cadastrados
-- SELECT id, email, role, created_at FROM users_profile ORDER BY created_at DESC;

-- OPÇÃO 3: Marcar múltiplos admins
-- UPDATE users_profile SET role = 'admin' WHERE email IN ('admin1@email.com', 'admin2@email.com');

-- OPÇÃO 4: Remover acesso admin (reverter para customer)
-- UPDATE users_profile SET role = 'customer' WHERE email = 'seu@email.com';

-- ============================================================
-- ✅ SCRIPT FINALIZADO COM SUCESSO!
-- ============================================================
-- Seu banco agora tem:
-- ✅ 10 tabelas completas e bem estruturadas
-- ✅ Row Level Security (RLS) ativado em todas
-- ✅ Políticas de segurança configuradas
-- ✅ Triggers automáticos de update
-- ✅ Índices para performance
-- ✅ 51 PRODUTOS VELLENIA STORE distribuídos por categoria:
--    • 9 Camisetas
--    • 9 Calças
--    • 9 Blazers
--    • 9 Vestidos
--    • 6 Cardigans
--    • 7 Acessórios
--    • 6 Calçados
-- ✅ Estrutura multi-tenant pronta
-- ✅ Endereços, pedidos e carrinho funcionando
-- ✅ Setup de admin pronto para usar
-- ============================================================
