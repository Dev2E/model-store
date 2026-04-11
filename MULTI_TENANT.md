# 🏪 MULTI-TENANT - Guia de Implementação

## O que é Multi-tenant?

Um **único sistema** que suporta **múltiplas lojas** de clientes diferentes, cada uma com:
- ✅ Dados isolados (produtos, pedidos)
- ✅ Customização própria (cores, logo, nome)
- ✅ Administração independente
- ✅ URL única (`/loja/seu-slug`)

**Exemplo:**
```
https://seu-dominio.com/loja/loja-1  → Cliente 1
https://seu-dominio.com/loja/loja-2  → Cliente 2
https://seu-dominio.com/loja/loja-3  → Cliente 3
```

---

## Arquitetura Implementada

### 1️⃣ **BANCO DE DADOS**

#### Nova Tabela: `stores`
```sql
id         UUID (PK)
owner_id   UUID (FK users)
name       VARCHAR (nome da loja)
slug       VARCHAR (URL único: "minha-loja")
colors     JSONB {primary, secondary, accent}
settings   JSONB {currency, language, sandbox_mode}
created_at TIMESTAMP
```

#### Modificações Existentes
- `products`: + `store_id` (qual loja o produto pertence)
- `orders`: + `store_id` (qual loja o pedido foi feito)

#### RLS (Row Level Security) Automático
```sql
-- Admin vê apenas produtos de sua loja
WHERE store_id = auth.user.store_id

-- Clientes veem apenas produtos ativos
WHERE active = true
```

---

### 2️⃣ **FRONTEND**

#### Novo Context: `StoreContext`
```javascript
import { useStore } from './context/StoreContext';

function MyComponent() {
  const { store, loading } = useStore();
  
  return (
    <div style={{ color: store.colors.primary }}>
      {store.name}
    </div>
  );
}
```

#### Novo Service: `storeService`
```javascript
import { storeService } from './services/storeService';

// Buscar loja por slug
const { data: store } = await storeService.getStoreBySlug('minha-loja');

// Produtos da loja
const { data: products } = await storeService.getStoreProducts(storeId);

// Pedidos da loja
const { data: orders } = await storeService.getStoreOrders(storeId);

// Estatísticas
const { data: stats } = await storeService.getStoreStats(storeId, '30d');
```

---

## Fluxo Prático

### Para Vendedor (Criar Loja)

```
Usuário se cadastra → Cria loja
                   → Customiza cores, logo, nome
                   → Adiciona produtos
                   → Recebe URL: /loja/seu-slug
```

**Implementação:**
```javascript
// 1. Admin page: criar nova loja
await storeService.createStore({
  name: 'Loja do João',
  slug: 'loja-joao',
  colors: {
    primary: '#000',
    secondary: '#fff',
    accent: '#f00'
  }
});

// 2. Adicionar produtos à loja
await storeService.addProductToStore(storeId, {
  name: 'Camiseta',
  price: 89.90,
  // ... dados do produto
});

// 3. Cliente acessa: /loja/loja-joao
// Sistema carrega contexto de store
// Todos os componentes usam colors/styles da loja
```

### Para Cliente (Comprar)

```
Cliente acessa /loja/slug
         → Vê produtos da loja
         → Adiciona carrinho
         → Checkout com Mercado Pago
         → Pedido armazenado com store_id
```

**Fluxo não muda** do código atual!
```javascript
// Em Home.jsx, Produtos.jsx, etc:
const { data: products } = await storeService.getStoreProducts(storeId);
// Automaticamente filtra apenas produtos da loja
```

---

## Implementação Passo a Passo

### PASSO 1: Executar Migration
```bash
# Supabase CLI
supabase migration new multi_tenant

# Copiar conteúdo de: supabase/migrations/multi_tenant_schema.sql
# Executar
supabase up
```

### PASSO 2: Atualizar .env
```bash
# Adicionar se houver
VITE_DEFAULT_STORE_ID=sua-loja-uuid
```

### PASSO 3: Implementar Rotas

#### Rota Pública `/loja/:slug`
```javascript
// src/App.jsx ou router
import { useParams } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Home from './pages/Home';

function StorePage() {
  const { slug } = useParams();
  
  return (
    <StoreProvider storeSlug={slug}>
      <Home />
    </StoreProvider>
  );
}
```

#### Dashboard Admin `/admin/sua-loja`
```javascript
// Admin pode gerenciar sua loja
import { useStore } from './context/StoreContext';

function AdminDashboard() {
  const { store } = useStore();
  
  return (
    <div>
      <h1>Gerenciar: {store.name}</h1>
      <ProductManager storeId={store.id} />
      <OrdersManager storeId={store.id} />
    </div>
  );
}
```

### PASSO 4: Atualizar Componentes

**Antes (single-tenant):**
```javascript
const products = await productsService.getAllProducts();
```

**Depois (multi-tenant):**
```javascript
const { store } = useStore();
const { data: products } = await storeService.getStoreProducts(store.id);
```

### PASSO 5: Testar

```bash
# 1. Criar loja 1
POST /api/stores
{
  "name": "Loja A",
  "slug": "loja-a"
}

# 2. Criar loja 2
POST /api/stores
{
  "name": "Loja B",
  "slug": "loja-b"
}

# 3. Acessar URLs
https://localhost:5173/loja/loja-a  → Produtos loja A
https://localhost:5173/loja/loja-b  → Produtos loja B
```

---

## Isolamento de Dados (Segurança)

### RLS Garante Isolamento

❌ **Sem RLS (inseguro):**
```sql
SELECT all products WHERE store_id != user_store_id -- Vê produtos de outras lojas!
```

✅ **Com RLS (seguro):**
```sql
CREATE POLICY "Users see only own store products"
  ON products FOR SELECT
  USING (store_id = auth.user_metadata.store_id);
  
SELECT * FROM products
-- Automaticamente filtra: WHERE store_id = auth.user_metadata.store_id
```

### Fluxo Seguro
```
Cliente A                Client B
    ↓                      ↓
storeService.getStoreProducts('store-id-a')
    ↓                      ↓
Supabase RLS
    ↓                      ↓
WHERE store_id = 'store-id-a' (automático!)
    ↓                      ↓
Retorna apenas dados de A  ← Nenhum acesso aos dados de B!
```

---

## Monetização (Por que é valioso)

### Modelo 1: SaaS Multi-tenant
```
Cliente paga R$ 99/mês → 1 loja completa
```
Benefício: Escalável, customer acquisition rápida

### Modelo 2: Planos por Features
```
Plano Básico: R$ 49/mês
  - até 100 produtos
  - sem relatórios

Plano Pro: R$ 99/mês
  - produtos ilimitados
  - relatórios
  - API access
  
Plano Enterprise: Customizado
  - tudo
  - suporte prioritário
```

### Exemplo: 50 clientes × R$ 99 = R$ 4.950/mês

---

## Segurança: Checklist

- ✅ RLS policies implementadas
- ✅ store_id em todos os queries
- ✅ Admin pode editar apenas sua loja
- ✅ Clientes veem apenas produtos ativos
- ✅ Pedidos isolados por loja
- ✅ CORS configurado
- ✅ Environment variables protegidas

---

## Próximos Passos

1. **Implementar Admin Dashboard** (criar/editar lojas)
2. **Customização por loja** (CSS dinâmico por cores)
3. **Webhooks por loja** (notificações isoladas)
4. **Multi-currency** (cada loja com moeda própria)
5. **Integração de pagamento por loja** (cada um com suas credenciais)

---

## Dúvidas?

Consulte:
- [ARCHITECTURE.md](ARCHITECTURE.md) - Estrutura de pastas
- [CONFIG_CLIENTE.md](CONFIG_CLIENTE.md) - Configuração
- [storeService.js](src/services/storeService.js) - API de métodos
