-- ============================================
-- VELLENIA STORE - SCRIPT COMPLETO DO BANCO
-- ============================================
-- Este script cria TODO o banco do zero
-- Tables + Índices + Dados Iniciais

-- DROP TABLES (se existirem)
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS user_addresses CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users_profile CASCADE;

-- ============================================
-- 1. TABLE: CATEGORIES
-- ============================================
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. TABLE: PRODUCTS
-- ============================================
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  quantity INTEGER DEFAULT 0,
  image_url VARCHAR(500),
  sku VARCHAR(100) UNIQUE,
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. TABLE: USERS_PROFILE
-- ============================================
CREATE TABLE users_profile (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  cpf VARCHAR(11),
  avatar_url VARCHAR(500),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. TABLE: USER_ADDRESSES
-- ============================================
CREATE TABLE user_addresses (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users_profile(id) ON DELETE CASCADE,
  street VARCHAR(255) NOT NULL,
  number VARCHAR(10) NOT NULL,
  complement VARCHAR(100),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  zip_code VARCHAR(8) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. TABLE: ORDERS
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users_profile(id) ON DELETE CASCADE,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_id VARCHAR(255),
  shipping_address_id INTEGER REFERENCES user_addresses(id),
  discount DECIMAL(10, 2) DEFAULT 0,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. TABLE: CART_ITEMS
-- ============================================
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users_profile(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  size VARCHAR(50),
  color VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id, size, color)
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

-- ============================================
-- INSERT: CATEGORIES
-- ============================================
INSERT INTO categories (name, slug, description) VALUES
('Acessórios', 'acessorios', 'Acessórios e complementos'),
('Roupas', 'roupas', 'Peças de vestuário'),
('Calçados', 'calcados', 'Sapatos e tênis'),
('Casa', 'casa', 'Itens para casa');

-- ============================================
-- INSERT: PRODUCTS (20 PRODUTOS)
-- ============================================
INSERT INTO products (category_id, name, slug, description, price, quantity, image_url, featured, active) VALUES
(1, 'Anel Minimalista', 'anel-minimalista', 'Anel em aço inoxidável', 49.90, 50, 'https://via.placeholder.com/300?text=Anel', true, true),
(1, 'Colar Delicado', 'colar-delicado', 'Colar com corrente fina', 79.90, 40, 'https://via.placeholder.com/300?text=Colar', true, true),
(1, 'Pulseira de Couro', 'pulseira-couro', 'Pulseira em couro genuíno', 129.90, 30, 'https://via.placeholder.com/300?text=Pulseira', false, true),
(1, 'Brincos de Pérola', 'brincos-perola', 'Par de brincos com pérola', 99.90, 25, 'https://via.placeholder.com/300?text=Brincos', true, true),
(1, 'Relógio Slim', 'relogio-slim', 'Relógio minimalista', 199.90, 20, 'https://via.placeholder.com/300?text=Relogio', false, true),

(2, 'Camiseta Básica Branca', 'camiseta-branca', 'Camiseta 100% algodão', 59.90, 100, 'https://via.placeholder.com/300?text=Camiseta', true, true),
(2, 'Camiseta Básica Preta', 'camiseta-preta', 'Camiseta 100% algodão', 59.90, 100, 'https://via.placeholder.com/300?text=Camiseta', true, true),
(2, 'Blusa de Lã', 'blusa-la', 'Blusa confortável de lã', 149.90, 40, 'https://via.placeholder.com/300?text=Blusa', false, true),
(2, 'Calça Jeans', 'calca-jeans', 'Calça jeans clássica', 179.90, 50, 'https://via.placeholder.com/300?text=Calca', true, true),
(2, 'Jaqueta de Couro', 'jaqueta-couro', 'Jaqueta em couro genuíno', 399.90, 15, 'https://via.placeholder.com/300?text=Jaqueta', false, true),

(3, 'Tênis Branco', 'tenis-branco', 'Tênis de uso diário', 249.90, 45, 'https://via.placeholder.com/300?text=Tenis', true, true),
(3, 'Tênis Preto', 'tenis-preto', 'Tênis de uso diário', 249.90, 45, 'https://via.placeholder.com/300?text=Tenis', true, true),
(3, 'Bota de Couro', 'bota-couro', 'Bota de couro marrom', 399.90, 20, 'https://via.placeholder.com/300?text=Bota', false, true),
(3, 'Mocassim', 'mocassim', 'Mocassim em camurça', 299.90, 30, 'https://via.placeholder.com/300?text=Mocassim', false, true),
(3, 'Sapato Social', 'sapato-social', 'Sapato social preto', 349.90, 25, 'https://via.placeholder.com/300?text=Sapato', true, true),

(4, 'Vaso Cerâmico 01', 'vaso-ceramico-01', 'Vaso decorativo de cerâmica', 85.00, 15, 'https://via.placeholder.com/300?text=Vaso', false, true),
(4, 'Almofada Branca', 'almofada-branca', 'Almofada 50x50cm', 99.90, 35, 'https://via.placeholder.com/300?text=Almofada', true, true),
(4, 'Tapete Cinza', 'tapete-cinza', 'Tapete 2x3m cinza', 299.90, 10, 'https://via.placeholder.com/300?text=Tapete', false, true),
(4, 'Luminária de Piso', 'luminaria-piso', 'Luminária minimalista', 199.90, 22, 'https://via.placeholder.com/300?text=Luminaria', true, true),
(4, 'Espelho Redondo', 'espelho-redondo', 'Espelho decorativo', 149.90, 18, 'https://via.placeholder.com/300?text=Espelho', false, true);

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================
SELECT 
  (SELECT COUNT(*) FROM categories) as total_categories,
  (SELECT COUNT(*) FROM products) as total_products,
  (SELECT COUNT(*) FROM users_profile) as total_users,
  (SELECT COUNT(*) FROM orders) as total_orders;

-- ============================================
-- FIM DO SCRIPT
-- ============================================

