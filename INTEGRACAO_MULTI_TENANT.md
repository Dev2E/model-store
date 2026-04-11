# 🔗 GUIA DE INTEGRAÇÃO - Multi-tenant

Instruções passo-a-passo para integrar `StoreContext` e `storeService` nas páginas existentes.

---

## ✅ CHECKLIST DE INTEGRAÇÃO

### Fase 1: Configuração (2h)
- [ ] Executar migration no Supabase
- [ ] Testar RLS policies
- [ ] Verificar .env variables

### Fase 2: Wrapper (30min)
- [ ] Envolver `App.jsx` ou rotas com `StoreProvider`
- [ ] Testar `useStore()` hook em componente

### Fase 3: Home.jsx (1h)
- [ ] Usar `store` para branding (cores, logo)
- [ ] Carregar featured products da loja
- [ ] Remover queries hardcoded

### Fase 4: Productos.jsx (1h)
- [ ] Usar `storeService.getStoreProducts()`
- [ ] Manter filtros e busca
- [ ] Testar paginação

### Fase 5: Produtos.jsx (1h)
- [ ] Mesmo que Productos.jsx
- [ ] Validar se é arquivo diferente ou duplicado

### Fase 6: Producto.jsx (30min)
- [ ] Adicionar `store_id` ao carrinho
- [ ] Persistir store context no cart

### Fase 7: Carrinho.jsx (1h)
- [ ] Filtrar itens por `store_id`
- [ ] Calcular "você está na loja X"

### Fase 8: Checkout.jsx (1h)
- [ ] Adicionar `store_id` ao pedido
- [ ] Verificar se webhook salva store_id

**Total Estimado**: 8h de trabalho

---

## 🔧 FASE 1: EXECUTAR MIGRATION

### 1.1 Supabase CLI
```bash
# Se não tiver, instale
npm install -g supabase

# Login
supabase login

# Ir para pasta do projeto
cd c:\Users\eliel\Downloads\loja_react_pronta

# Listar migrações
supabase migration list

# Executar migration
supabase db push
```

### 1.2 Validar Resultado

No Supabase Dashboard:
1. SQL Editor → `SELECT count(*) FROM stores;` → Deve retornar 0 (ainda vazia)
2. Tables → Verificar que existe `stores` table
3. Auth → RLS → Verificar que tem policies

**Ou pelo terminal:**
```bash
supabase db remote commit
# Vai fazer backup antes
```

### 1.3 Testar RLS

```javascript
// No console do app:
const { data, error } = await supabase
  .from('stores')
  .select('*');
  
console.log({ data, error });
// Deve retornar vazio (logado ou não)
// Ou error se não tiver permissão
```

---

## 🎨 FASE 2: ENVOLVER APP COM STOREPROVIDER

### 2.1 Atualizar App.jsx

**ANTES:**
```javascript
import Home from './pages/Home';
import Checkout from './pages/Checkout';

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
      </AuthProvider>
    </CartProvider>
  );
}
```

**DEPOIS:**
```javascript
import { useParams } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Home from './pages/Home';
import Checkout from './pages/Checkout';

// Wrapper component para rotas de loja
function StorePageWrapper({ children }) {
  const { slug } = useParams(); // /loja/:slug
  
  return (
    <StoreProvider storeSlug={slug}>
      {children}
    </StoreProvider>
  );
}

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <div className="app">
          <Routes>
            {/* Rota pública: /loja/:slug */}
            <Route 
              path="/loja/:slug/*" 
              element={<StorePageWrapper><Home /></StorePageWrapper>} 
            />
            
            {/* Rotas admin de loja */}
            <Route 
              path="/admin/loja/:slug/*" 
              element={<StorePageWrapper><AdminPanel /></StorePageWrapper>} 
            />
            
            {/* Fallback - rota padrão com sua loja */}
            <Route 
              path="/" 
              element={
                <StoreProvider storeSlug="sua-loja">
                  <Home />
                </StoreProvider>
              } 
            />
          </Routes>
        </div>
      </AuthProvider>
    </CartProvider>
  );
}
```

### 2.2 Testar StoreProvider

```bash
npm run dev
# Acesse http://localhost:5173/loja/sua-loja
```

No console browser:
```javascript
// Em qualquer página dentro de <StoreProvider>
import { useStore } from './context/StoreContext';

function DebugComponent() {
  const { store, loading, error } = useStore();
  
  return (
    <div>
      <p>Loja: {store?.name}</p>
      <p>Slug: {store?.slug}</p>
      <p>Loading: {loading}</p>
      <p>Error: {error}</p>
    </div>
  );
}
```

---

## 🏠 FASE 3: INTEGRAR HOME.jsx

### 3.1 Adicionar useStore hook

```javascript
import { useStore } from '../context/StoreContext';

export default function Home() {
  const { store, loading } = useStore();
  
  if (loading) {
    return <div>Carregando loja...</div>;
  }
  
  if (!store) {
    return <div>Loja não encontrada</div>;
  }
  
  return (
    <div style={{
      '--primary': store.colors?.primary || '#000',
      '--secondary': store.colors?.secondary || '#fff'
    } as React.CSSProperties}>
      {/* resto do código */}
    </div>
  );
}
```

### 3.2 Carregar Featured Products da Loja

**ANTES:**
```javascript
useEffect(() => {
  const products = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .limit(6);
}, []);
```

**DEPOIS:**
```javascript
import { storeService } from '../services/storeService';

useEffect(() => {
  if (!store?.id) return;
  
  const loadProducts = async () => {
    const { data, error } = await storeService.getStoreProducts(store.id, {
      limit: 6,
      filters: { featured: true }
    });
    
    if (error) {
      console.error('Erro carregando produtos:', error);
      return;
    }
    
    setFeatured(data);
  };
  
  loadProducts();
}, [store?.id]);
```

### 3.3 Usar Cores da Loja em CSS

```javascript
<section 
  className="py-20"
  style={{
    backgroundColor: store.colors?.accent,
    color: store.colors?.primary
  }}
>
  <h2>{store.name}</h2>
  <p>Bem-vindo à {store.name}!</p>
</section>
```

---

## 🛍️ FASE 4: INTEGRAR PRODUCTOS.jsx

### 4.1 Substituir Query de Produtos

**ANTES:**
```javascript
useEffect(() => {
  const getProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*');
    setProducts(data);
  };
  getProducts();
}, []);
```

**DEPOIS:**
```javascript
import { storeService } from '../services/storeService';

useEffect(() => {
  const getProducts = async () => {
    const { data, error } = await storeService.getStoreProducts(store.id, {
      limit: 50,
      offset: (page - 1) * 50
    });
    
    if (error) {
      console.error('Erro:', error);
      return;
    }
    
    setProducts(data);
  };
  
  getProducts();
}, [store?.id, page]);
```

### 4.2 Manter Filtros e Busca

```javascript
// Busca por categoria (ainda funciona!)
const filtered = products.filter(p => 
  p.category === selectedCategory &&
  p.name.toLowerCase().includes(searchTerm)
);
```

---

## 📦 FASE 5: PRODUCTO.jsx (Detalhe)

### 5.1 Adicionar store_id ao Carrinho

**ANTES:**
```javascript
function addToCart() {
  cart.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1
  });
}
```

**DEPOIS:**
```javascript
function addToCart() {
  const { store } = useStore();
  
  cart.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
    store_id: store.id,  // ← NOVO!
    store_name: store.name // ← Para referência
  });
}
```

---

## 🛒 FASE 6: CARRINHO.jsx

### 6.1 Validar Store do Carrinho

```javascript
import { useStore } from '../context/StoreContext';

export default function Carrinho() {
  const { store } = useStore();
  const { cart } = useCart();
  
  // Validar que items pertencem à loja correta
  const validItems = cart.items.filter(item => 
    item.store_id === store.id
  );
  
  if (validItems.length === 0) {
    return (
      <div>
        Carrinho vazio ou você mudou de loja!
        <a href={`/loja/${store.slug}`}>Voltar</a>
      </div>
    );
  }
  
  return (
    <div>
      <h1>Carrinho de {store.name}</h1>
      {validItems.map(item => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
}
```

---

## 💳 FASE 7: CHECKOUT.jsx

### 7.1 Adicionar store_id ao Pedido

**ANTES:**
```javascript
const order = {
  customer_name: name,
  customer_email: email,
  items: cart.items,
  total: totalPrice
};

const { data } = await supabase
  .from('orders')
  .insert([order]);
```

**DEPOIS:**
```javascript
import { useStore } from '../context/StoreContext';

const { store } = useStore();

const order = {
  store_id: store.id,  // ← NOVO!
  customer_name: name,
  customer_email: email,
  items: cart.items,
  total: totalPrice
};

const { data } = await supabase
  .from('orders')
  .insert([order]);
```

### 7.2 Webhook Salva Corretamente

Verificar em `supabase/functions/criar-pagamento/index.ts`:

```typescript
// Ao receber webhook do Mercado Pago:
const order = {
  id: paymentId,
  store_id: originalOrder.store_id, // ← ✅ Passar
  status: 'completed',
  paid_at: new Date(),
  // ...
};
```

---

## 🧪 TESTE FINAL

### Teste 1: Múltiplas Lojas
```bash
# Terminal 1
http://localhost:5173/loja/loja-1

# Terminal 2  
http://localhost:5173/loja/loja-2

# Verificar que cada uma mostra dados diferentes
```

### Teste 2: RLS Isolamento
```javascript
// Console em loja-1:
const { data: orders } = await supabase
  .from('orders')
  .select('*');
  
// Deve mostrar APENAS pedidos de loja-1
```

### Teste 3: Mercado Pago
```javascript
// Com store_id no order:
const response = await fetch('/api/create-payment', {
  body: JSON.stringify({
    store_id: 'uuid-da-loja',
    // ...
  })
});

// Deve criar pagamento corretamente
```

---

## 📡 ARQUIVOS A MODIFICAR

| Arquivo | Ação | Tempo |
|---------|------|-------|
| `src/App.jsx` | Adicionar StoreProvider wrapper | 15min |
| `src/pages/Home.jsx` | useStore() + storeService | 20min |
| `src/pages/Productos.jsx` | storeService.getStoreProducts() | 15min |
| `src/pages/Producto.jsx` | Adicionar store_id ao carrinho | 10min |
| `src/pages/Carrinho.jsx` | Filtrar por store_id | 15min |
| `src/pages/Checkout.jsx` | Adicionar store_id ao order | 15min |
| `src/hooks/index.js` | Exportar useStore | 5min |

**Total: ~1h 30min prático**

---

## 🐛 DEBUGGING

Se algo não funcionar:

```javascript
// 1. Verificar se StoreProvider está ativo
import { useStore } from './context/StoreContext';

function Debug() {
  const { store, loading, error } = useStore();
  console.log({ store, loading, error });
}

// 2. Verificar RLS
// Supabase Dashboard → SQL → SELECT * FROM orders WHERE store_id = 'seu-uuid';

// 3. Verificar ambiente
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log('Loja atual:', store?.slug);

// 4. Verificar migration
// Supabase Dashboard → Migrations → multi_tenant_schema.sql (deve estar ✅)
```

---

## 🚀 PRÓXIMO: LANDING PAGE

Depois de integrar tudo:
1. Criar `/landing.jsx` para home pública
2. Mostrar catálogo de lojas
3. Links para: /loja/loja-1, /loja/loja-2, etc

---

**Status**: 🔧 Pronto para integração
**Tempo estimado**: 8 horas
**Complexidade**: Média (repetitivo, mas seguro)
