# Setup Supabase - Guia de Configuração

## 1. Criar Tabelas (SQL Editor do Supabase)

```sql
-- Tabela de Produtos
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

-- Tabela de Usuários com Role
CREATE TABLE IF NOT EXISTS users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  name VARCHAR(255),
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'customer', -- 'customer', 'admin'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Endereços
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

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pendente', -- pendente, em_transito, entregue, cancelado
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Recuperação de Senha
CREATE TABLE IF NOT EXISTS password_reset_codes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Products (público read)
CREATE POLICY "Products are readable by everyone" 
ON products FOR SELECT 
USING (active = true);

CREATE POLICY "Products are editable by admin only" 
ON products FOR UPDATE 
USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies - Users Profile
CREATE POLICY "Users can read own profile" 
ON users_profile FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON users_profile FOR UPDATE 
USING (auth.uid() = id);

-- RLS Policies - Addresses
CREATE POLICY "Users can read own addresses" 
ON addresses FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own addresses" 
ON addresses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies - Orders
CREATE POLICY "Users can read own orders" 
ON orders FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" 
ON orders FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

## 2. Inserir Produtos Reais

```sql
INSERT INTO products (name, description, price, category, collection, colors, sizes, image, shipping, sustainability, stock, active) VALUES
('Vaso Cerâmico 01', 'Vaso cerâmico minimalista perfeito para flores secas ou decoração. Feito à mão com cerâmica de alta qualidade.', 85, 'Acessórios', 'COLEÇÃO ESSENCIAL', '[{"name":"white","label":"Branco"},{"name":"black","label":"Preto"},{"name":"gray","label":"Cinza"}]', '["P","M","G"]', '⚪', 'Envios Express disponíveis', 'Peça única, produção sustentável', 50, true),
('Luminária de Piso Orbital', 'Luminária design moderno com estrutura em metal e lâmpada LED integrada. Cria ambiance perfeita para qualquer ambiente.', 320, 'Iluminação', 'COLEÇÃO LUZ', '[{"name":"black","label":"Preto"},{"name":"white","label":"Branco"}]', '["Único"]', '💡', 'Envios Express', 'Metal reciclado', 30, true),
('Banco de Madeira Maciça', 'Banco feito em madeira maciça sustentável. Perfeito como assento ou mesa lateral. Design escandinavo.', 450, 'Móveis', 'COLEÇÃO ESSENCIAL', '[{"name":"natural","label":"Natural"},{"name":"walnut","label":"Nogueira"}]', '["Único"]', '🪑', 'Entrega em 7 dias', 'Madeira certificada', 20, true),
('Camiseta de Linho Premium', 'Camiseta confortável 100% linho. Respirável e perfeita para clima quente. Manutenção delicada.', 120, 'Roupas', 'COLEÇÃO VERÃO', '[{"name":"white","label":"Branco"},{"name":"beige","label":"Bege"},{"name":"navy","label":"Azul"}]', '["XS","S","M","L","XL","XXL"]', '👕', 'Envios rápidos', 'Linho natural', 100, true),
('Jogo de Copos de Vidro', '6 copos com design geométrico em vidro temperado. Ideal para bebidas quentes ou frias.', 95, 'Cozinha', 'COLEÇÃO ESSENCIAL', '[{"name":"clear","label":"Transparente"}]', '["Único"]', '🥤', 'Embalagem segura', 'Vidro reciclado', 80, true),
('Estante Minimalista', 'Estante em MDF com estrutura em aço. 5 prateleiras ajustáveis. Design moderno e funcional.', 680, 'Móveis', 'COLEÇÃO MODERNA', '[{"name":"white","label":"Branco"},{"name":"black","label":"Preto"}]', '["Única"]', '📚', 'Entrega em 10 dias', 'Material reciclado', 15, true),
('Difusor Aromático Ultrassônico', 'Difusor com três modos de nebulização. LED colorido. Capacidade 300ml. Tecnologia silenciosa.', 180, 'Decoração', 'COLEÇÃO RELAXAMENTO', '[{"name":"white","label":"Branco"},{"name":"gray","label":"Cinza"}]', '["Único"]', '💨', 'Envios rápidos', 'Plástico biodegradável', 40, true),
('Almofada de Linho Naturalista', 'Almofada em linho 100% natural. Enchimento de fibra. 45x45cm. Removível e lavável.', 165, 'Têxteis', 'COLEÇÃO ACONCHEGO', '[{"name":"natural","label":"Natural"},{"name":"khaki","label":"Cáqui"}]', '["Única"]', '🛋️', 'Envios rápidos', 'Linho natural', 60, true),
('Luminária Pendente Geométrica', 'Luminária com estrutura geométrica em metal. Cabo têxtil e lâmpada LED inclusos. 30cm altura.', 240, 'Iluminação', 'COLEÇÃO LUZ', '[{"name":"gold","label":"Dourado"},{"name":"copper","label":"Cobre"},{"name":"black","label":"Preto"}]', '["Única"]', '✨', 'Envios Express', 'Metal sustentável', 25, true),
('Mesa Lateral Minimalista', 'Mesa com tampo redondo 60cm em madeira maciça e pés em metal. Funcional e com design clean.', 520, 'Móveis', 'COLEÇÃO MODERNA', '[{"name":"natural","label":"Natural"},{"name":"preto","label":"Preto"}]', '["Única"]', '⭕', 'Entrega em 7 dias', 'Madeira certificada', 18, true),
('Tapete de Lã Artesanal', 'Tapete 200x150cm em lã natural. Tingido manualmente com corantes vegetais. Textura macia e durável.', 890, 'Decoração', 'COLEÇÃO ARTESANAL', '[{"name":"gray","label":"Cinza"},{"name":"beige","label":"Bege"}]', '["Única"]', '🏮', 'Entrega em 5 dias', 'Lã natural sustentável', 12, true),
('Vela Aromática Soja', 'Vela feita 100% em cera de soja. Aroma duradouro por 60 horas. Vidro reciclado.', 75, 'Aromáticos', 'COLEÇÃO RELAXAMENTO', '[{"name":"cream","label":"Creme"}]', '["Única"]', '🕯️', 'Envios rápidos', 'Cera de soja natural', 150, true);
```

## 3. Configurar Usuários

### Usuário de Cliente Teste
- Email: `teste@boutique.com`
- Senha: `Teste@123456`
- Role: `customer`

### Usuário Admin
- Email: `admin@boutique.com`
- Senha: `Admin@123456`
- Role: `admin`

Execute em: Auth > Users > Add User (criar ambos)

Depois, insira manualmente na tabela users_profile ou use o gerenciador abaixo.

## 4. Depois de Criar os Usuários

Insira os usuários na tabela users_profile:

```sql
-- Nota: Use os IDs reais dos usuários criados no Auth
INSERT INTO users_profile (id, email, name, phone, role) VALUES
('user-id-teste-aqui', 'teste@boutique.com', 'Cliente Teste', '(11) 98888-8888', 'customer'),
('admin-id-aqui', 'admin@boutique.com', 'Admin do Site', '(11) 99999-9999', 'admin');
```

