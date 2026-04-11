# 🛍️ VELLENIA STORE - E-commerce Premium Para Venda

Uma plataforma de e-commerce **completa, pronta para produção e escalável** desenvolvida com **React 18 + Supabase + Mercado Pago**, totalmente localizada para português brasileiro.

---

## 📑 ÍNDICE COMPLETO

1. [⚡ Quick Start (2 minutos)](#quick-start)
2. [🚀 Setup Completo](#setup-completo)
3. [📁 Estrutura de Pastas](#estrutura-de-pastas)
4. [🏗️ Arquitetura della Aplicação](#arquitetura)
5. [🔧 Como Dar Manutenção](#manutenção)
6. [🚫 O QUE NÃO MEXER](#o-que-nao-mexer)
7. [📱 Componentes Principais](#componentes-principais)
8. [🌍 Localização pt-BR](#localização)
9. [📦 Scripts Disponíveis](#scripts)
10. [🔐 Variáveis de Ambiente](#variáveis-ambiente)
11. [🐛 Troubleshooting](#troubleshooting)
12. [📚 Recursos Adicionais](#recursos)

---

## ⚡ QUICK START
<a id="quick-start"></a>

### 1️⃣ Instalar Dependências (30 segundos)
```bash
cd loja_react_pronta
npm install
```

### 2️⃣ Configurar Credenciais (60 segundos)
```bash
cp .env.example .env.local
# Editar .env.local com suas credenciais:
# VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_MERCADOPAGO_PUBLIC_KEY
```

### 3️⃣ Rodar em Desenvolvimento (30 segundos)
```bash
npm run dev
# Acesso: http://localhost:5173
```

✅ Pronto! O site está rodando localmente.

---

## 🚀 SETUP COMPLETO
<a id="setup-completo"></a>

### Pré-requisitos
- Node.js 18+ ou 20 LTS
- NPM 8+
- Conta no Supabase (grátis em https://supabase.com)
- Conta no Mercado Pago (sandbox ou produção)

### Passo 1: Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/loja_react_pronta.git
cd loja_react_pronta
```

### Passo 2: Instalar Dependências
```bash
npm install
```

### Passo 3: Configurar Supabase
1. Criar projeto em https://supabase.com
2. Copiar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
3. Executar SQL no painel Supabase (em `supabase/migrations/`)

### Passo 4: Configurar Mercado Pago
1. Criar conta em https://mercadopago.com
2. Acessar Settings → API Keys
3. Copiar chave pública (VITE_MERCADOPAGO_PUBLIC_KEY)
4. Em desenvolvimiento usar modo **sandbox**

### Passo 5: Criar .env.local
```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Mercado Pago
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR_xxxxx

# reCAPTCHA (opcional)
VITE_RECAPTCHA_KEY=seu_site_key

# Modo Sandbox
VITE_MERCADOPAGO_SANDBOX_MODE=true
```

### Passo 6: Rodar Localmente
```bash
npm run dev
# Abrir http://localhost:5173
```

### Passo 7: Para Produção
```bash
npm run build
npm run preview  # Testar build localmente
```

---

## 📁 ESTRUTURA DE PASTAS
<a id="estrutura-de-pastas"></a>

```
loja_react_pronta/
├── src/
│   ├── components/              📦 Componentes Reutilizáveis
│   │   ├── Header.jsx          (Navegação + Menu Mobile)
│   │   ├── Footer.jsx          (Rodapé)
│   │   ├── CookieNotice.jsx    (Banner de Cookies)
│   │   └── Toast.jsx           (Sistema de Notificações)
│   │
│   ├── context/                🎭 Estado Global (React Context)
│   │   ├── AuthContext.jsx     (Autenticação + Usuário)
│   │   ├── CartContext.jsx     (Carrinho de Compras)
│   │   └── StoreContext.jsx    (Configurações da Loja)
│   │
│   ├── pages/                  📄 Páginas/Rotas
│   │   ├── Home.jsx            (Homepage)
│   │   ├── Produto.jsx         (Detalhe Produto)
│   │   ├── Produtos.jsx        (Listagem + Filtros)
│   │   ├── Carrinho.jsx        (Carrinho de Compras)
│   │   ├── Checkout.jsx        (2 etapas: dados + pagamento)
│   │   ├── Login.jsx           (Entrar)
│   │   ├── CriarConta.jsx      (Cadastro)
│   │   ├── MeuPerfil.jsx       (Dados do Usuário)
│   │   ├── MeusPedidos.jsx     (Histórico)
│   │   ├── AdminDashboard.jsx  (Painel Admin)
│   │   ├── AdminProdutos.jsx   (Gestão Produtos)
│   │   ├── AdminPedidos.jsx    (Gestão Pedidos)
│   │   └── ...Outras páginas
│   │
│   ├── services/               🔌 Integração com APIs
│   │   ├── supabaseService.js  (CRUD + Queries)
│   │   ├── shippingService.js  (Cálculo Frete)
│   │   └── storageService.js   (LocalStorage)
│   │
│   ├── utils/                  🛠️ Funções Auxiliares
│   │   ├── formatters.js       (Formatos pt-BR)
│   │   ├── validators.js       (Validações)
│   │   └── constants.js        (Constantes)
│   │
│   ├── hooks/                  🪝 Custom Hooks
│   │   └── useMediaQuery.js    (Responsividade)
│   │
│   ├── lib/                    📚 Bibliotecas
│   │   └── supabase.js         (Cliente Supabase)
│   │
│   ├── App.jsx                 🎯 Componente Root
│   ├── main.jsx                ⚙️ Entrada App
│   └── index.css               🎨 Estilos Globais
│
├── supabase/
│   ├── migrations/             💾 SQL para Banco
│   └── functions/              ⚡ Edge Functions
│
├── public/                     📄 Arquivos Estáticos
│
├── vite.config.js              ⚙️ Configuração Build
├── tailwind.config.js          🎨 Tailwind CSS
├── package.json                📦 Dependências
├── .env.example                🔐 Template Variáveis
└── .env.local                  🔐 Variáveis Reais (NÃO COMMITAR)

```

---

## 🏗️ ARQUITETURA
<a id="arquitetura"></a>

### Fluxo de Dados

```
┌─────────────────────────────────────────────────┐
│         CLIENTE (Frontend React)                │
│  ┌──────────────────────────────────────────┐  │
│  │ Pages (Home, Produto, Carrinho, etc)    │  │
│  │  └── Components (Header, Footer, etc)   │  │
│  │      └── Hooks & Context (Estado)       │  │
│  └──────────────────────────────────────────┘  │
└────────────┬─────────────────────────────────┬─┘
             │ API REST / RealTime             │
    ┌────────▼────────┐         ┌──────────────▼───┐
    │    SUPABASE     │         │   MERCADO PAGO   │
    │  (PostgreSQL)   │         │  (Pagamentos)    │
    │                 │         │                  │
    │ - Usuários      │         │ - Processamento  │
    │ - Produtos      │         │ - Webhooks       │
    │ - Pedidos       │         │                  │
    │ - Carrinho      │         │                  │
    └─────────────────┘         └──────────────────┘
```

### Stack Tecnológico

| Camada | Tecnologia | Propósito |
|--------|-----------|----------|
| **Frontend** | React 18 + Vite | UI Interativa |
| **Estilo** | Tailwind CSS | Design Responsivo |
| **Ícones** | Heroicons | Ícones SVG |
| **Backend** | Supabase (PostgreSQL) | Banco de Dados |
| **Autenticação** | Supabase Auth | Login/Signup |
| **Pagamento** | Mercado Pago | Processamento |
| **Validação** | Recaptcha v3 | Anti-Bot |
| **Hospedagem** | Vercel / Netlify | Deploy automático |

---

## 🔧 COMO DAR MANUTENÇÃO
<a id="manutenção"></a>

### Tarefas Rotineiras

#### 1. Adicionar Novo Produto
1. Login como Admin
2. Ir para `/admin/produtos`
3. Clique "Novo Produto"
4. Preencher nome, descrição, preço, estoque
5. Upload de imagem
6. Salvar

#### 2. Atualizar Status de Pedido
1. Login como Admin
2. Ir para `/admin/pedidos`
3. Buscar pedido por ID, CPF ou nome
4. Mudar status: Pendente → Processando → Enviado → Entregue
5. Sistema envia email automático ao cliente

#### 3. Gerir Métodos de Envio
1. Admin → Envios
2. Adicionar/Editar transportadora
3. Configurar custos por faixa de CEP
4. Sistema calcula frete automaticamente no checkout

#### 4. Consultar Relatórios
1. Admin → Relatórios
2. Filtrar por período/categoria
3. Exportar dados em gráficos

### Atualizações de Código

#### Adicionar Nova Página
```bash
# 1. Criar arquivo em src/pages/NovaPagina.jsx
# 2. Adicionar rota em src/App.jsx:
<Route path="/nova-pagina" element={<NovaPagina />} />
# 3. Adicionar link no menu (Header.jsx ou Sidebar)
```

#### Adicionar Novo Componente
```bash
# 1. Criar em src/components/MeuComponente.jsx
# 2. Exportar como: export default function MeuComponente() { ... }
# 3. Importar e usar em páginas
```

#### Modificar Estilo Global
- Editar `src/index.css`
- Usar classes Tailwind quando possível
- Reload automático com `npm run dev`

---

## 🚫 O QUE NÃO MEXER
<a id="o-que-nao-mexer"></a>

### ⚠️ CRÍTICO - Não Alterar

| Item | Por Quê | Risco |
|------|---------|-------|
| **supabase/migrations/** | Controlam estrutura do BD | Dados corrompidos |
| **Context (Auth, Cart)** | Estado global central | App quebra |
| **supabaseService.js queries** | Integração com BD | Perda de dados |
| **.env.local** | Credenciais secretas | Vazamento de dados |
| **vite.config.js** | Configuração Build | Não compila |
| **tailwind.config.js** | Cores/Temas globais | Design quebra |
| **package.json (versões)** | Dependências | Conflitos |

### ✅ SEGURO - Pode Modificar

| Item | Limitações |
|------|-----------|
| **Páginas em src/pages/** | Qualquer alteração |
| **Componentes em src/components/** | Adicionar/remover sem quebrar outros |
| **src/index.css** | Novos estilos globais |
| **Conteúdo estático** | Textos, descrições |
| **Tailwind classes** | Usar classes existentes |
| **Variáveis de ambiente** | Em .env.local (nunca versionado) |

---

## 📱 COMPONENTES PRINCIPAIS
<a id="componentes-principais"></a>

### Header.jsx
- Navegação principal
- Carrinho (badge com quantidade)
- Login/Perfil do usuário
- Menu mobile responsivo
- Usa Heroicons para ícones

### Footer.jsx
- Links úteis
- Newsletter signup
- Informações de contato
- Links legais

### Toast.jsx
- Sistema de notificações
- Tipos: sucesso, erro, info, aviso
- Auto-dismiss após 5s
- Stacked multiplos toasts

### Login.jsx
- Email + Senha
- Recuperação de conta
- Integração com Supabase Auth
- reCAPTCHA v3
- Design moderno com gradiente

### Checkout.jsx (2 Etapas)

**Etapa 1 - Dados Pessoais:**
- Nome, Email, Telefone
- CPF (máscara)
- Endereço (busca por CEP automatizada)
- Resumo do carrinho

**Etapa 2 - Pagamento:**
- Método: Mercado Pago ou PIX
- Integração com iframe Mercado Pago
- Validação de cartão
- Confirmação do pedido

### AdminDashboard.jsx
- Gráficos em tempo real
- Cards de estatísticas
- Ações rápidas
- Atalhos para todas as seções

---

## 🌍 LOCALIZAÇÃO pt-BR
<a id="localização"></a>

Toda a aplicação com pt-BR completo:

### Moeda
```javascript
formatCurrency(349.90)  // R$ 349,90
```

### Datas
```javascript
formatDate(new Date())  // 10/04/2026
```

### Telefone
```javascript
formatPhone('11987654321')  // (11) 98765-4321
```

### CPF
```javascript
formatCPF('12345678900')  // 123.456.789-00
```

Implementado em: `src/utils/formatters.js`

---

## 📦 SCRIPTS DISPONÍVEIS
<a id="scripts"></a>

```bash
# Desenvolvimento
npm run dev              # Inicia servidor local (5173)
npm run build           # Build para produção
npm run preview         # Testa build localmente

# Linting (opcional)
npm run lint            # Verifica código

# Testes (quando implementados)
npm test                # Executa testes
```

---

## 🔐 VARIÁVEIS DE AMBIENTE
<a id="variáveis-ambiente"></a>

### Arquivo .env.example
```env
# SUPABASE
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5...

# MERCADO PAGO
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR_xxxxxxxxxxxx
VITE_MERCADOPAGO_SANDBOX_MODE=true

# RECAPTCHA (opcional)
VITE_RECAPTCHA_KEY=seu_site_key_v3

# MODO DESENVOLVIMIENTO
VITE_DEBUG=false
```

### Como Obter Credenciais

**Supabase:**
1. Criar projeto em https://supabase.com
2. Settings → API
3. Copiar URL e "anon" key

**Mercado Pago:**
1. Account Settings → API Keys
2. Copiar "Public Key"
3. Usar Sandbox Key para testes

**reCAPTCHA:**
1. Google Admin Console → reCAPTCHA v3
2. Copiar site key

---

## 🐛 TROUBLESHOOTING
<a id="troubleshooting"></a>

### "Port 5173 is already in use"
```bash
# Opção 1: Liberar porta
Get-Process node | Stop-Process -Force

# Opção 2: Usar outra porta
npm run dev -- --port 3000
```

### "Cannot connect to Supabase"
```
✓ Verificar VITE_SUPABASE_URL em .env.local
✓ Verificar VITE_SUPABASE_ANON_KEY
✓ Conexão com internet
✓ Verificar se projeto no Supabase está ativo
```

### "Mercado Pago payment failed"
```
✓ Verificar VITE_MERCADOPAGO_PUBLIC_KEY
✓ Verificar VITE_MERCADOPAGO_SANDBOX_MODE=true (para testes)
✓ Usar cartão de teste: 4111111111111111
✓ Qualquer data/CVV futura (01/2025)
```

### "Build fails: Cannot find module X"
```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### "Componentes não atualizam em dev"
```bash
# Limpar cache Vite
rm -rf node_modules/.vite
npm run dev
```

### "CSS não está sendo aplicado"
```
✓ Verificar se classe Tailwind existe
✓ Verificar se arquivo está em src/
✓ Reload página (Ctrl+Shift+R)
✓ Limpar cache navegador
```

---

## 📚 RECURSOS ADICIONAIS
<a id="recursos"></a>

### Documentação Oficial

- [React 18 Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase Docs](https://supabase.com/docs)
- [Vite Docs](https://vitejs.dev)
- [Mercado Pago Docs](https://www.mercadopago.com.br/developers/pt/docs)
- [Heroicons](https://heroicons.com)

### Arquivos de Configuração

- `vite.config.js` - Build & Dev server
- `tailwind.config.js` - Tema CSS
- `package.json` - Dependências
- `.env.example` - Variáveis template

### Ferramentas Recomendadas

- **VS Code** - Editor (com Prettier + ESLint)
- **Supabase Studio** - Gerenciar BD
- **Insomnia/Postman** - Testar APIs
- **DevTools Chrome** - Debug

---

## 🎨 CUSTOMIZAÇÃO

### Alterar Cores Principais
1. Editar `tailwind.config.js`
2. Encontrar seção `colors`
3. Alterar hex codes
4. Reload automático

### Alterar Fontes
1. Editar `src/index.css`
2. Importar nova fonte do Google Fonts
3. Atualizar font-family em body/h1-h6

### Alterar Logo
1. Substituir imagem em `public/logo.png`
2. Atualizar referência em Header.jsx

---

## 🚀 DEPLOYMENT

### Vercel (Recomendado)
```bash
npm i -g vercel
vercel                  # Login e deploy automáticos
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy          # Build automático
```

### Manual (Seu Servidor)
```bash
npm run build           # Gera pasta dist/
# Fazer upload de dist/ para seu servidor
```

---

## 📞 SUPORTE

Problemas? Verifique:
1. ✓ Variáveis de ambiente em .env.local
2. ✓ Credenciais Supabase/Mercado Pago
3. ✓ Node.js versão 18+
4. ✓ npm install completado
5. ✓ Porta 5173 disponível

---

## 📄 LICENÇA

MIT License - Livre para usar, modificar e distribuir.

---

**Desenvolvido com ❤️ para e-commerce no Brasil**

Versão: 2.0  
Data: Abril 2026  
Status: ✅ Pronto para Produção
```

### 3. Setup do Banco de Dados
- Copiar SQL de `SUPABASE_SETUP.md`
- Executar em Supabase Dashboard > SQL Editor

### 4. Iniciar Dev
```bash
npm run dev
# Acessa em http://localhost:5173
```

## 🛠️ Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Supabase + Edge Functions (Deno) |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth (JWT) |
| Pagamentos | Mercado Pago API v2 |
| Hosting | Vercel (frontend) + Supabase (backend) |

## 📚 Documentação

- **[MANUAL.txt](./MANUAL.txt)** - Guia completo de uso e features
- **[INSTRUCOES.txt](./INSTRUCOES.txt)** - Avisos críticos para desenvolvedores
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Schema SQL do banco
- **[SECURITY_AUDIT.md](./SECURITY_AUDIT.md)** - Análise de segurança

## 🔒 Segurança

- Credenciais protegidas em Supabase Secrets
- CORS configurado com restrições
- Row Level Security (RLS) ativado
- reCAPTCHA contra bots
- .env.local ignorado no git

## 📦 Deploy

### Frontend (Vercel)
```bash
npm run build
# Ou fazer push para GitHub (auto-deploy)
```

### Backend (Supabase)
```bash
npx supabase functions deploy
npx supabase secrets set MERCADOPAGO_ACCESS_TOKEN="seu-token"
```

## 📋 Variáveis de Ambiente

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
VITE_MERCADO_PAGO_PUBLIC_KEY=APP_USR-xxxxx
VITE_RECAPTCHA_PUBLIC_KEY=sua-chave-recaptcha
```

## 🤝 Contribuindo

Este é um projeto modelo para clientes. Sinta-se à vontade para:
- ✅ Modificar e customizar
- ✅ Comercializar
- ✅ Usar como template

Veja [LICENSE](./LICENSE) para detalhes.

## 📄 Licença

MIT © 2026 Eliel

Para mais informações, veja [LICENSE](./LICENSE)

## 💬 Suporte

Para dúvidas, consulte:
- MANUAL.txt (como usar)
- INSTRUCOES.txt (guia dev)
- Documentação Supabase: https://supabase.com/docs
- Documentação React: https://react.dev

---

**Pronto para começar? Clone agora e customize com suas cores e produtos!** 🚀
