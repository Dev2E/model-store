# 📁 ESTRUTURA DO PROJETO

## Arquitetura Limpa e Escalável

```
src/
├── components/        📦 Componentes Reutilizáveis
│   ├── Header.jsx    (Navegação)
│   ├── Footer.jsx    (Rodapé)
│   ├── CookieNotice.jsx
│   └── Toast.jsx     (Notificações)
│
├── context/          🎭 Estado Global (React Context)
│   ├── AuthContext.jsx     (Autenticação)
│   ├── CartContext.jsx     (Carrinho)
│   └── StoreContext.jsx    (Multi-tenant - NOVO)
│
├── hooks/            🪝 Custom Hooks (Lógica Reutilizável)
│   └── index.js
│
├── pages/            📄 Páginas/Rotas
│   ├── Home.jsx
│   ├── Produto.jsx
│   ├── Produtos.jsx
│   ├── Carrinho.jsx
│   ├── Checkout.jsx
│   ├── Admin*/        (Admin pages)
│   └── Auth*/         (Login, Signup, etc)
│
├── services/         🔌 Integração com APIs/Supabase
│   ├── supabaseService.js    (CRUD products, orders, users)
│   ├── shippingService.js    (Cálculo de frete)
│   └── storeService.js       (Multi-tenant - NOVO)
│
├── utils/            🛠️ Funções Auxiliares
│   ├── formatters.js         (Formatação pt-BR)
│   └── validators.js         (Validações)
│
├── lib/              📚 Bibliotecas Inicializadas
│   └── supabase.js          (Cliente Supabase singleton)
│
├── data/             📊 Dados Estáticos (REMOVER)
│
├── context/          (Já listado acima)
│
├── App.jsx           🎯 Componente Root
├── main.jsx          ⚙️ Entrada da Aplicação
└── index.css         🎨 Estilos Globais
```

## Convenções

| Pasta | Responsabilidade | Exemplo |
|-------|------------------|---------|
| **components/** | UI reutilizáveis, sem lógica complexa | Header, Button, Modal |
| **context/** | Estado global (Auth, Cart, Store) | useCart, useAuth |
| **hooks/** | Lógica reutilizável em forma de hook | useFetch, useLocalStorage |
| **pages/** | Componentes de página/rota | Home, Checkout, AdminDashboard |
| **services/** | Chamadas API, lógica de negócio | supabaseService, shippingService |
| **utils/** | Funções puras de utilidade | formatCurrency, validateEmail |
| **lib/** | Bibliotecas inicializadas | Supabase client |

## Fluxo de Dados

```
pages/Home.jsx
    ↓
useCart() [context/CartContext]
    ↓
services/supabaseService.getProducts()
    ↓
lib/supabase (cliente singleton)
    ↓
Supabase Backend
```

## Adições para Multi-tenant

**Novo Context:**
```javascript
// context/StoreContext.jsx
export const useStore = () => {
  return {
    storeId,      // ID da loja (tenant)
    storeName,
    colors,
    logo
  }
}
```

**Novo Service:**
```javascript
// services/storeService.js
- getStoreById(slug)
- updateStore(id, data)
- getStoreProducts(storeId)
```

**RLS Policies:**
```sql
-- Todos veem apenas produtos de sua loja
SELECT * FROM products WHERE store_id = auth.user_metadata.store_id
```
