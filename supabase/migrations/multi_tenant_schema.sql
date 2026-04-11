-- ==========================================
-- MULTI-TENANT: Estrutura de Lojas/Tenants
-- ==========================================

-- 1. TABELA DE LOJAS (TENANTS)
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Informações Básicas
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL, -- URL amigável: /loja/seu-slug
  description TEXT,
  
  -- Customização
  colors JSONB DEFAULT '{
    "primary": "#000000",
    "secondary": "#ffffff",
    "accent": "#ef4444"
  }'::jsonb,
  logo_url TEXT,
  favicon_url TEXT,
  
  -- Endereço para Frete
  address JSONB DEFAULT '{
    "street": "",
    "number": "",
    "city": "",
    "state": "",
    "zip_code": ""
  }'::jsonb,
  
  -- Configurações
  settings JSONB DEFAULT '{
    "currency": "BRL",
    "language": "pt-BR",
    "timezone": "America/Sao_Paulo",
    "accept_orders": true,
    "sandbox_mode": true
  }'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

-- 2. ADICIONAR store_id AOS PRODUTOS
ALTER TABLE products ADD COLUMN store_id UUID REFERENCES stores(id) ON DELETE CASCADE;
ALTER TABLE products ADD COLUMN tenant_id VARCHAR(255); -- Compatibilidade

-- 3. ADICIONAR store_id AOS PEDIDOS
ALTER TABLE orders ADD COLUMN store_id UUID REFERENCES stores(id) ON DELETE CASCADE;

-- 4. ÍNDICES PARA PERFORMANCE
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_orders_store_id ON orders(store_id);
CREATE INDEX idx_stores_owner_id ON stores(owner_id);
CREATE INDEX idx_stores_slug ON stores(slug);

-- 5. ROW LEVEL SECURITY (RLS)

-- Políticas para STORES
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Donos podem ver/editar suas lojas
CREATE POLICY "Owners can view own stores"
  ON stores FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can update own stores"
  ON stores FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert stores"
  ON stores FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Público consegue ver lojas ativas (sem dados sensíveis)
CREATE POLICY "Public can view active stores"
  ON stores FOR SELECT
  USING (true); -- Adicionar WHERE active = true no futuro

-- Políticas para PRODUCTS (multi-tenant)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Admins podem ver/editar produtos de sua loja
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

-- Clientes veem apenas produtos ativos
CREATE POLICY "Customers view active products"
  ON products FOR SELECT
  USING (active = true);

-- Políticas para ORDERS (multi-tenant)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Clientes veem pedidos deles
CREATE POLICY "Customers view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Donos de loja veem pedidos de sua loja
CREATE POLICY "Store owners view own store orders"
  ON orders FOR SELECT
  USING (
    store_id IN (
      SELECT id FROM stores WHERE owner_id = auth.uid()
    )
  );

-- 6. FUNÇÃO PARA ATUALIZAR updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. COMENTÁRIOS PARA DOCUMENTAÇÃO
COMMENT ON TABLE stores IS 'Tenants (lojas) no sistema multi-tenant';
COMMENT ON COLUMN stores.slug IS 'URL amigável única para cada loja';
COMMENT ON COLUMN stores.colors IS 'Customização de cores {primary, secondary, accent}';
COMMENT ON COLUMN stores.settings IS 'Configurações por loja (moeda, idioma, sandbox)';
