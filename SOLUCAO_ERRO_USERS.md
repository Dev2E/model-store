# 🚀 Solução: Erro "Could not find the table 'public.users'"

## ⚠️ O Problema
Sua aplicação está conectada ao Supabase, mas as **tabelas não foram criadas** no banco de dados.

---

## ✅ Solução em 5 Passos

### **PASSO 1: Acessar Supabase Dashboard**
1. Abra https://supabase.com/dashboard
2. Faça login com sua conta
3. Selecione seu projeto (loja_react_pronta)

---

### **PASSO 2: Abrir SQL Editor**
1. No menu à esquerda, procure por **"SQL Editor"**
2. Clique em **"SQL Editor"**
3. Clique no botão **"New Query"** (ou canto superior direito)

---

### **PASSO 3: Copiar e Executar o SQL**

Copie TODO o código abaixo e **cole no SQL Editor do Supabase**:

```sql
-- ============================================================
-- TABELA 1: PRODUTOS
-- ============================================================
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

-- ============================================================
-- TABELA 2: PERFIL DE USUÁRIOS
-- ============================================================
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

-- ============================================================
-- TABELA 3: ENDEREÇOS
-- ============================================================
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

-- ============================================================
-- TABELA 4: PEDIDOS
-- ============================================================
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

-- ============================================================
-- TABELA 5: RESET DE SENHA
-- ============================================================
CREATE TABLE IF NOT EXISTS password_reset_codes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABELA 6: MÉTODOS DE ENVIO
-- ============================================================
CREATE TABLE IF NOT EXISTS shipping_methods (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  tempo_dias INT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABELA 7: LOGS DE ATIVIDADE
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- ATIVAR ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLÍTICAS DE SEGURANÇA (RLS POLICIES)
-- ============================================================

-- Produtos: Todo mundo pode LER produtos ativos
CREATE POLICY "Products are readable by everyone" 
ON products FOR SELECT 
USING (active = true);

-- Produtos: Apenas admin pode EDITAR
CREATE POLICY "Products are editable by admin only" 
ON products FOR UPDATE 
USING (auth.jwt() ->> 'role' = 'admin');

-- Perfil: Usuário pode ler próprio perfil
CREATE POLICY "Users can read own profile" 
ON users_profile FOR SELECT 
USING (auth.uid() = id);

-- Perfil: Usuário pode atualizar próprio perfil
CREATE POLICY "Users can update own profile" 
ON users_profile FOR UPDATE 
USING (auth.uid() = id);

-- Endereços: Usuário pode ler próprios endereços
CREATE POLICY "Users can read own addresses" 
ON addresses FOR SELECT 
USING (auth.uid() = user_id);

-- Endereços: Usuário pode criar endereços
CREATE POLICY "Users can create own addresses" 
ON addresses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Endereços: Usuário pode atualizar próprios endereços
CREATE POLICY "Users can update own addresses" 
ON addresses FOR UPDATE 
USING (auth.uid() = user_id);

-- Pedidos: Usuário pode ler próprios pedidos
CREATE POLICY "Users can read own orders" 
ON orders FOR SELECT 
USING (auth.uid() = user_id);

-- Pedidos: Usuário pode criar pedidos
CREATE POLICY "Users can create orders" 
ON orders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Métodos de Envio: Todo mundo pode LER
CREATE POLICY "Shipping methods are readable by everyone" 
ON shipping_methods FOR SELECT 
USING (ativo = true);

-- Logs: Apenas admin pode LER (segurança)
CREATE POLICY "Only admin can read activity logs" 
ON activity_logs FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');
```

---

### **PASSO 4: Executar o SQL**
1. **Cole o SQL acima no SQL Editor**
2. Clique no botão **"Run"** (ou pressione Ctrl+Enter)
3. Aguarde até ver a mensagem **"Success"** 
4. Se aparecer um erro, revise se o SQL está correto

---

### **PASSO 5: Voltar à Aplicação**

Após criar as tabelas:

1. **Volte ao VS Code**
2. **Recarregue o navegador** (F5 ou Ctrl+R)
3. **Limpe o cache** (Ctrl+Shift+Delete, depois F5)
4. **Agora a app deve funcionar!** ✅

---

## 🧪 Como Testar Se Funcionou

### **Teste 1: Criar uma Conta**
```
1. Abra http://localhost:5173/
2. Clique em "Criar Conta"
3. Preencha: email, senha, nome
4. Clique em "Registrar"
5. Se criar com sucesso = FUNCIONA! ✅
```

### **Teste 2: Login**
```
1. Clique em "Login"
2. Digite email e senha
3. Se logar com sucesso = FUNCIONA! ✅
```

### **Teste 3: Editar Perfil**
```
1. Faça login
2. Vá para "Meu Perfil"
3. Clique em "Editar Perfil"
4. Mude o nome ou emoji
5. Clique "Salvar"
6. Se salvar sem erros = FUNCIONA! ✅
```

---

## 🔍 Se Ainda Não Funcionar

Se após executar o SQL ainda aparecer erro:

### **Opção 1: Verificar no Supabase Dashboard**
1. Vá a **Database** (menu esquerdo)
2. Procure a aba **Tables**
3. Todas as 7 tabelas devem estar listadas:
   - ✅ products
   - ✅ users_profile
   - ✅ addresses
   - ✅ orders
   - ✅ password_reset_codes
   - ✅ shipping_methods
   - ✅ activity_logs

### **Opção 2: Limpar Console de Erros**
1. Abra F12 (DevTools)
2. Aba "Console"
3. Procure por erros tipo "relation does not exist"
4. Se encontrar, a tabela não foi criada ainda

### **Opção 3: Contato**
Se não conseguir, envie:
- Print das tabelas criadas (no Supabase Dashboard)
- O erro exato que aparece no console
- Se conseguiu executar o SQL sem erros

---

## ✨ Resumo do QUE VOCÊ FARÁ

| Ação | Resultado |
|------|-----------|
| **Copiar SQL** | Código para criar tabelas |
| **Executar no Supabase** | Tabelas criadas no banco ✅ |
| **Recarregar app** | App funciona normalmente ✅ |
| **Testar create/login** | Dados salvos no banco ✅ |

---

**⏱️ Tempo total: ~5 minutos**

Comece agora! 🚀
