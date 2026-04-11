# 🧪 GUIA DE TESTES - QA Testing Checklist

Verifique se tudo está funcionando corretamente antes de vender.

---

## ✅ CATEGORIA 1: RESPONSIVE DESIGN

### Mobile (375px - iPhone SE)
```
npm run dev
# Abrir em viewport 375x667

[ ] Home.jsx: Logo + menu cabem
[ ] Home.jsx: Cards em 1 coluna
[ ] Productos.jsx: Grid produtos em 1 coluna
[ ] Producto.jsx: Imagem acima do título
[ ] Carrinho.jsx: Botões largos
[ ] Checkout.jsx: Inputs ocupam linha inteira
```

### Tablet (768px - iPad)
```
[ ] Home.jsx: Grid 2 colunas
[ ] Productos.jsx: Cards em grid 2x2
[ ] Header: Menu visível ou hamburger?
[ ] Checkout: Layout horizontal confortável
```

### Desktop (1024px+)
```
[ ] Home.jsx: Layout como esperado
[ ] Productos.jsx: Grid 3-4 colunas
[ ] Checkout: Formulário ao lado de resumo
```

---

## 🔐 CATEGORIA 2: MERCADO PAGO

### Test Credentials
```
Card: 4111 1111 1111 1111
CPF: 19119119100 
Data: 12/25
CVV: 123

npm run dev
→ Carrinho
→ Adicionar produto
→ Checkout
→ Informações acima
→ "Pagar com Mercado Pago"

✅ Deve processar pagamento
✅ Status deve virar "Pago"
✅ Sem erro "Uma das partes é de teste"
```

### Production Credentials
```
Quando tiver credenciais prod:
1. Configure em .env
   VITE_MERCADO_PAGO_PUBLIC_KEY=prod_xxx
   VITE_SANDBOX_MODE=false
2. Teste com card real
3. Verifique em Mercado Pago admin
```

---

## 📱 CATEGORIA 3: COOKIE BANNER

### Visual
```
[ ] Localizado em: bottom-right (canto inferior direito)
[ ] FloatING (não ocupa rodapé inteira)
[ ] Card com padding
[ ] Responsive: Mais largo em desktop, menor em mobile
```

### Interação
```
[ ] Botão "Aceitar" - fecha banner
[ ] Botão X - fecha banner
[ ] Aparece apenas 1x por sessão (localStorage)
[ ] Smooth animation ao aparecer
```

---

## 🏪 CATEGORIA 4: MULTI-TENANT (Primeiros Passos)

### Estrutura
```
[ ] Pasta supabase/migrations/ existe
[ ] Arquivo multi_tenant_schema.sql presente
[ ] Pasta src/context/ contém StoreContext.jsx
[ ] Pasta src/services/ contém storeService.js
[ ] Pasta src/hooks/ contém index.js
```

### Hooks
```javascript
// Abrir DevTools → Console
// Em qualquer página dentro de <StoreProvider>

import { useStore } from './context/StoreContext';
const { store, loading, error } = useStore();
console.log({ store, loading, error });
// Deve mostrar dados da loja
```

### Service
```javascript
// Console
import { storeService } from './services/storeService';

const { data: store } = await storeService.getStoreBySlug('seu-slug');
console.log(store);
// Deve retornar dados da loja
```

---

## 📚 CATEGORIA 5: DOCUMENTAÇÃO

### Arquivos Presentes
```
[ ] CONFIG_CLIENTE.md (120+ linhas)
[ ] ARCHITECTURE.md (120+ linhas)
[ ] MULTI_TENANT.md (250+ linhas)
[ ] INTEGRACAO_MULTI_TENANT.md (200+ linhas)
[ ] CHANGELOG.md (lista todas mudanças)
[ ] SESSAO_RESUMO.md (resumo executivo)
[ ] .env.example (com documentação)
[ ] README.md (atualizado 2-min quick start)
```

### Qualidade
```
[ ] Sem typos óbvios
[ ] Exemplos de código funcionam
[ ] Screenshots/imagens úteis (se houver)
[ ] Links internos funcionam
```

---

## 🧹 CATEGORIA 6: CÓDIGO LIMPO

### Console.log
```bash
grep -r "console.log" src/  
# Deve retornar POUCOS (apenas debug necessário)

# Verificado em:
[ ] src/pages/Checkout.jsx (removido 3)
[ ] src/pages/Home.jsx
[ ] src/components/
```

### Variáveis de Ambiente
```bash
# Verificar no .env
[ ] Nenhuma credencial Mercado Pago visível
[ ] VITE_SANDBOX_MODE está como variável
[ ] .env.local contém valores reais
[ ] .env.example contém placeholders
```

### Organização da Pasta
```
src/
├── components/      [ ] contém componentes reutilizáveis
├── context/         [ ] contém AuthContext, CartContext, StoreContext
├── hooks/           [ ] contém custom hooks
├── pages/           [ ] contém páginas/rotas
├── services/        [ ] contém chamadas API
├── utils/           [ ] contém helpers
└── lib/             [ ] contém instâncias singleton
```

---

## 🔒 CATEGORIA 7: SEGURANÇA

### Credenciais
```
[ ] Nenhuma senha em .env.example
[ ] .env.local está em .gitignore
[ ] Tokens privados NÃO em localStorage público
[ ] API keys públicas claramente marcadas como VITE_
```

### RLS Policies
```
Supabase Dashboard → Authentication → Policies

[ ] Policies existem para: products, orders, stores
[ ] Cada policy tem store_id filtering
[ ] User não consegue ver dados de outra loja
```

### Sandbox Mode
```
supabase/functions/criar-pagamento/index.ts

[ ] sandbox_mode vem de Deno.env.get("VITE_SANDBOX_MODE")
[ ] Não é hardcoded como true/false
[ ] Edge Function não loga passwords
```

---

## 🏃 CATEGORIA 8: PERFORMANCE

### Build
```bash
npm run build
# Deve completar sem erros

[ ] Build tamanho < 200KB (gzipped)
[ ] Sem warnings de unused imports
[ ] Sem unused variables
```

### Dev Mode
```bash
npm run dev
# Deve iniciar em < 2 segundos

[ ] Hot reload funciona (editar arquivo → atualiza automaticamente)
[ ] Network: < 100ms para requisições Supabase
[ ] Sem memory leaks (DevTools → Performance)
```

---

## 🧩 CATEGORIA 9: FLUXOS CRÍTICOS

### Fluxo 1: Usuário Novo
```
1. npm run dev
2. Acessar localhost:5173/
3. Navegar HOME → PRODUTOS → CARRINHO
4. Adicionar produto ao carrinho
5. Ir para CHECKOUT

[ ] Carrinho mostra produto adicionado
[ ] Preço total correto
[ ] Informações de envio carregam
[ ] Mercado Pago integrado
```

### Fluxo 2: Pagamento
```
1. Em Checkout
2. Preencher dados (test credentials acima)
3. Clicar "Pagar com Mercado Pago"
4. Completar pagamento

[ ] Sem erro "Uma das partes é de teste"
[ ] Pedido criado em Supabase
[ ] E-mail confirmação enviado (se configurado)
[ ] Redirecionado para sucesso
```

### Fluxo 3: Loja Múltipla (após integração)
```
1. Criar 2 lojas em Supabase
2. Acessar /loja/loja-1
3. Ver produtos de loja-1
4. Acessar /loja/loja-2
5. Ver produtos diferentes (loja-2)

[ ] Loja-1 não vê produtos de loja-2
[ ] Pedidos isolados por loja
[ ] Cores customizadas diferentes
```

---

## 📊 CATEGORIA 10: DADOS

### Seed Data
```bash
node scripts/seed.js  
# (Se implementado)

[ ] Cria 10 produtos automaticamente
[ ] Cada um com nome, preço, categoria
[ ] Imagens carregam
[ ] Produtos aparecem em Productos.jsx
```

### Database
```
Supabase Dashboard → SQL Editor

[ ] SELECT count(*) FROM products; → > 0
[ ] SELECT count(*) FROM stores; → ? (depende)
[ ] SELECT count(*) FROM orders; → 0+ (depois de vender)
```

---

## 🚀 CATEGORIA 11: DEPLOY READINESS

### Environment
```
[ ] .env.local contém todas as variáveis necessárias
[ ] VITE_SUPABASE_URL está correto
[ ] VITE_SUPABASE_ANON_KEY está correto
[ ] VITE_MERCADO_PAGO_PUBLIC_KEY está correto
[ ] VITE_SANDBOX_MODE está correto (true para test)
```

### Git
```
[ ] .gitignore inclui .env.local
[ ] .gitignore inclui node_modules/
[ ] Nenhum arquivo sensível em git
[ ] Commits com mensagens claras
```

### Build Checklist
```bash
npm install  # < 2min
npm run dev  # < 2sec para iniciar
npm run build  # Sem erros
npm run preview  # Se houver
```

---

## 🐛 CATEGORIA 12: DEBUGGING

Se algo não funciona:

### Mercado Pago Erro
```
Erro: "Uma das partes com as quais você está tentando..."

[ ] Verifique VITE_SANDBOX_MODE no .env
[ ] Verifique tipo de credencial (test ou prod)
[ ] Devem corresponder!
[ ] Restart dev server após .env change
```

### Responsive Não Funciona
```
Layout ruim em mobile?

[ ] DevTools → Toggle Device Toolbar
[ ] Verificar viewport atual (Mobile SE, iPad, etc)
[ ] Checar se Tailwind breakpoints estão no HTML
[ ] Rebuild: npm run dev
```

### Supabase Desconectado
```
[ ] Verificar .env VITE_SUPABASE_URL
[ ] Verificar .env VITE_SUPABASE_ANON_KEY
[ ] Supabase Dashboard está online?
[ ] Network tab mostra erro 404/401?
```

---

## 📝 TESTE CHECKLIST (Copie e Cole)

```markdown
### TESTING SESSION - [DATA]

**Responsável**: ________________
**Browser**: Chrome / Safari / Firefox
**Device**: Desktop / Mobile / Tablet

#### Responsive Design
- [ ] Mobile 375px
- [ ] Tablet 768px
- [ ] Desktop 1024px+

#### Mercado Pago
- [ ] Test card aceita 4111...
- [ ] Sem erro "Uma das partes..."
- [ ] Pedido criado com sucesso

#### Cookie Banner
- [ ] Aparece apenas 1x
- [ ] Botão X funciona
- [ ] Smooth animation

#### Multi-tenant (se integrado)
- [ ] 2 lojas acessam URLs diferentes
- [ ] Dados isolados por loja
- [ ] Nenhum vazamento de dados

#### Code Quality
- [ ] Nenhum console.error sem tratamento
- [ ] Nenhuma credencial visível
- [ ] Build rápido (< 5sec)

#### Documentação
- [ ] 5+ arquivos .md presentes
- [ ] Links começam
- [ ] Exemplos funcionam

**Resultado**: ✅ APROVADO / ❌ FALHOU
**Notas**:
```

---

## 🎬 TESTE COMPLETO (Tempo: 30min)

```bash
# 1. Setup (5min)
npm install
npm run dev

# 2. Mobile (5min)
DevTools → Viewport 375×667
Navegar: Home → Produtos → Carrinho → Checkout

# 3. Mercado Pago (10min)
Checkout → Teste credenciais acima → Pagar

# 4. Verificações (5min)
Abrir console → Sem console.error
Abrir Network → Requisições rápidas
Abrir Performance → Nenhuma queda em FPS

# 5. Documentação (5min)
Verificar arquivos .md criados
Verificar .env.example
```

---

## ✨ TESTES AVANÇADOS (Opcional)

### Load Testing
```
Adicionar 1000 produtos e testar performance
Usuários simultâneos = 10
Verificar se server aguenta
```

### Security Testing
```
Tentar SQL injection em busca
Tentar acessar dados de outra loja
Verificar CORS headers
```

### Cross-browser
```
Chrome ✅
Safari ✅
Firefox ✅
Edge ✅
```

---

**Status**: Usar este documento como checklist antes de vender 🎯
