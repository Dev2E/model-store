# 🛍️ VELLENIA STORE - Loja E-commerce Premium

Uma loja de e-commerce **completa e pronta para produção** desenvolvida em React 18 + Supabase + Mercado Pago, com **localização completa para português brasileiro** (pt-BR).

## ✨ Recursos Principais

### 🛒 Para Clientes
- ✅ Catálogo de produtos dinâmico
- ✅ Carrinho com cálculo de frete automático
- ✅ Autenticação segura (email + senha)
- ✅ Recuperação de senha com código
- ✅ Checkout 2 etapas
- ✅ Pagamento via Mercado Pago
- ✅ Histórico de pedidos com status em tempo real
- ✅ Perfil personalizável
- ✅ Proteção reCAPTCHA

### 👨‍💼 Para Administradores
- ✅ Dashboard com estatísticas em tempo real
- ✅ Gestão de produtos (CRUD)
- ✅ Gestão de pedidos com filtros avançados
- ✅ Busca de pedidos por ID, CPF ou nome do cliente
- ✅ Atualização de status em tempo real
- ✅ Relatórios imprimíveis com gráficos
- ✅ Gestão de envios e rastreamento
- ✅ Análise de receita por produto/período

## 🌍 Localização Brasileira (pt-BR) ✨

Toda a aplicação está localizada para português brasileiro:

| Recurso | Formato |
|---------|---------|
| **Moeda** | R$ 349,90 (vírgula como decimal) |
| **Data** | 10/04/2026 (DD/MM/YYYY) |
| **Hora** | 14:30:45 |
| **Telefone** | (11) 12345-6789 |
| **CPF** | 123.456.789-00 |

**Implementado em:** `src/utils/formatters.js`  
Utilizado em todos os componentes de página e admin.

## 👗 20 Produtos Vellenia Store

Moda minimalista em 6 categorias:

- **Camisetas:** R$ 89,90 - R$ 109,90
- **Calças:** R$ 189,90 - R$ 249,90  
- **Blazers:** R$ 349,90
- **Vestidos:** R$ 279,90 - R$ 329,90
- **Cardigans:** R$ 169,90 - R$ 189,90
- **Acessórios:** R$ 79,90 - R$ 159,90

## 🚀 Quick Start

### 1. Clonar e Instalar
```bash
git clone https://github.com/seu-usuario/loja_react_pronta.git
cd loja_react_pronta
npm install
```

### 2. Configurar Ambiente
```bash
cp .env.example .env.local
# Preencher variáveis com suas credenciais
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
