# 🚀 DEPLOY SEGURO NO VERCEL

## Passo a Passo - Deploy em 10 Minutos

### Pré-requisitos

- ✅ Código pronto para produção (`npm run build` passa)
- ✅ Repositório no GitHub/GitLab/Bitbucket configurado
- ✅ Credenciais Supabase obtidas
- ✅ Credenciais Mercado Pago obtidas
- ✅ Chave reCAPTCHA (opcional)

---

## Etapa 1: Preparar Repositório

### 1.1 Verificar `.gitignore` (Segurança)

```bash
# Verificar se .env.local não está commitado
git status
# Não deve aparecer: .env.local

# Se acidentalmente foi commitado:
git rm --cached .env.local
git commit -m "Remove .env.local (segurança)"
```

### 1.2 Verificar Segurança Antes de Push

```bash
# Teste de segurança
npm run security-check

# Resultado esperado:
# ✅ Verificação de segurança passou!
# ✅ Seguro para commitar/fazer push
```

### 1.3 Fazer Push para GitHub

```bash
git add .
git commit -m "Deploy Vercel: add security headers and SSL"
git push
```

---

## Etapa 2: Conectar Vercel

### 2.1 Criar Conta Vercel

1. Acessar https://vercel.com
2. Clicar "Sign Up"
3. Escolher: "Continue with GitHub" (recomendado)
4. Autorizar Vercel no seu GitHub

### 2.2 Importar Projeto

1. Vercel Dashboard → **"Add New Project"**
2. Escolher repositório do GitHub
3. Clicar **"Import"**

---

## Etapa 3: Configurar Variáveis de Ambiente (CRÍTICO!)

### 3.1 Acessar Configuração

1. Project Settings → **"Environment Variables"**
2. Você deve estar em abas diferentes para cada variável:
   - **Production**
   - **Preview**
   - **Development**

### 3.2 Adicionar Variáveis de Ambiente

Adicione **exatamente estas variáveis**:

| Variável | Valor | Deploy |
|----------|-------|--------|
| `VITE_SUPABASE_URL` | `https://seu-projeto.supabase.co` | Production, Preview |
| `VITE_SUPABASE_ANON_KEY` | Cole aqui sua chave anão | Production, Preview |
| `VITE_MERCADOPAGO_PUBLIC_KEY` | `APP_USR_xxx...` | Production, Preview |
| `VITE_SANDBOX_MODE` | `false` (produção) ou `true` (teste) | Production, Preview |
| `VITE_RECAPTCHA_KEY` | Sua site key (opcional) | Production, Preview |
| `VITE_FRONTEND_URL` | `https://seu-dominio.com` | Production |
| `NODE_ENV` | `production` | Production |

### 3.3 Passo a Passo para Cada Variável

1. Clicar **"Add Environment Variable"**
2. Preencher:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://seu-projeto.supabase.co`
3. Selecionar ambientes: ☑️ Production ☑️ Preview
4. Clicar **"Save"**
5. Repetir para cada variável

### ⚠️ Onde Obter Cada Valor

**Supabase URL e ANON KEY:**
1. https://supabase.com → Project → Settings → API
2. Copiar URL e "anon" key

**Mercado Pago PUBLIC KEY:**
1. https://mercadopago.com → Your Business → Settings
2. Escolher ambiente (SANDBOX para testes, LIVE para produção)
3. Copiar "Client ID" ou "Public Key"

**reCAPTCHA Key (opcional):**
1. https://www.google.com/recaptcha/admin
2. Copiar "Site Key" (v3)

---

## Etapa 4: Deploy!

### 4.1 Iniciar Deploy Automático

Após salvar variáveis:

1. Volte ao início do dashboard
2. Você verá seu projeto
3. Clicar **"Deploy Now"** ou aguardar deploy automático

### 4.2 Acompanhar Build

1. Vercel iniciará build automático
2. Você verá progresso em tempo real:
   - ⏳ Cloning repository
   - ⏳ Installing dependencies
   - ⏳ Running build script
   - ✅ Build completed

### 4.3 Se Build Falhar

Clicar em **"View Logs"** para ver erro:

```
Error: VITE_SUPABASE_URL not defined
→ Significa que a variável não foi adicionada
→ Insira em Environment Variables novamente
→ Faça novo deploy
```

---

## Etapa 5: Configurar Domínio Customizado

### 5.1 Se Usando Domínio Default (Vercel)

Seu app estará em:
```
https://seu-projeto.vercel.app
```

✅ SSL automático
✅ HTTPS ativado
✅ Pronto para usar

### 5.2 Se Usando Domínio Próprio

1. Project Settings → **"Domains"**
2. Clicar **"Add Domain"**
3. Digitar seu domínio: `seu-dominio.com`
4. Seguir instruções para apontar DNS

**Exemplo com GoDaddy/NameCheap:**
1. Ir para DNS settings
2. Adicionar record tipo CNAME:
   - Host: `seu-dominio.com`
   - Points to: `cname.vercel-dns.com`
3. Aguardar propagação (24-48h)
4. Vercel ativa SSL automaticamente

---

## Etapa 6: Verificar Deploy

### 6.1 Testar URL

```bash
# Abrir site (deve redirecionar HTTP → HTTPS)
https://seu-projeto.vercel.app
# ou
https://seu-dominio.com
```

### 6.2 Verificar Headers de Segurança

```bash
# Testar se headers estão sendo enviados
curl -I https://seu-projeto.vercel.app

# Deve aparecer:
# Strict-Transport-Security: max-age=31536000...
# X-Content-Type-Options: nosniff
# X-Frame-Options: SAMEORIGIN
# X-XSS-Protection: 1; mode=block
# ...
```

### 6.3 Testar Funcionalidades

- [ ] Homepage carrega
- [ ] Produtos carregam
- [ ] Login funciona
- [ ] Carrinho funciona
- [ ] Checkout com Mercado Pago
- [ ] Admin dashboard acessa dados

---

## Etapa 7: Setup Contínuo (CI/CD)

### Automático no Vercel ✅

Cada vez que você faz `git push`, Vercel:

1. ✅ Clona o repositório
2. ✅ Instala dependências
3. ✅ Roda verificação de segurança
4. ✅ Compila código
5. ✅ Deploy automático
6. ✅ Cria Preview URL para PRs

### Desabilitar Preview por PR

Project Settings → **"Git"** → Desabilitar se desejar

---

## Troubleshooting Deploy

### "Build failed: Cannot find module X"

```
Solução:
1. npm install (local)
2. npm run build (verifica build local)
3. git push (redeploy)
```

### "Environment variable not defined"

```
Solução:
1. Project Settings → Environment Variables
2. Verificar nome exato (case-sensitive)
3. Verificar selecionou "Production"
4. Redeploy projeto
```

### "SSL certificate not found"

```
✅ Normal no primeiro deploy
⏳ Vercel processa em < 5 minutos
🔄 Recarregar página
✅ Deve aparecer cadeado 🔒
```

### "Supabase connection refused"

```
Solução:
1. Verificar VITE_SUPABASE_URL está correto
2. Verificar VITE_SUPABASE_ANON_KEY não expirou
3. Testar localmente: npm run dev
4. Se funcionar local, problema é variável
```

### "Mercado Pago payment fails"

```
Solução:
1. Verificar VITE_MERCADOPAGO_PUBLIC_KEY
2. Verificar VITE_SANDBOX_MODE corresponde
3. Se teste: use cartão 4111111111111111
4. Se produção: use credenciais LIVE
```

---

## Monitoramento Pós-Deploy

### Analytics Vercel

Project Dashboard → **"Analytics"**

- Requisições por dia
- Tempo de resposta
- Erros 4xx/5xx
- Tráfego por página

### Logs em Tempo Real

Project Dashboard → **"Logs"** → **"Runtime logs"**

Ver erros e logs do aplicativo em produção.

### Alertas Automáticos

Settings → **"Web Analytics"** → Ativar alertas para:
- Aumentos de erro
- Lentidão
- Falta de espaço

---

## Updates e Manutenção

### Fazer Update de Código

```bash
# Desenvolvimento local
git checkout -b feature/nova-feature
# ... fazer mudanças ...
npm run build  # Testar build
npm run security-check  # Verificar segurança
git commit -m "Add feature"
git push

# Vercel faz deploy automaticamente
```

### Fazer Update de Variáveis

Project Settings → **"Environment Variables"**
- Editar valor existente
- Clicar "Save"
- Vercel redeploy automaticamente

### Rollback (reverter deploy)

Project → **"Deployments"**
1. Encontrar deployment anterior
2. Clicar **"..."** → **"Promote to Production"**
3. Done! Voltou para versão anterior

---

## Backup & Segurança

### Backup de Dados (Supabase)

Dados já estão no Supabase, que faz backup automático:
- Daily backups
- Point-in-time recovery
- Disaster recovery

### Segurança Vercel

✅ SSL/TLS automático  
✅ DDoS protection  
✅ Rate limiting  
✅ Web firewall  
✅ Scans de vulnerabilidade  

---

## Checklist Final

Antes de considerar "pronto para produção":

- [ ] `npm run security-check` passou ✅
- [ ] `npm run build` passou ✅
- [ ] Deploy no Vercel com sucesso ✅
- [ ] Variáveis de ambiente configuradas ✅
- [ ] HTTPS ativado (cadeado 🔒) ✅
- [ ] Domínio customizado apontando (se houver) ✅
- [ ] Testou login → pagamento → pedido ✅
- [ ] Testou admin dashboard ✅
- [ ] Headers de segurança aparecem (curl -I) ✅
- [ ] Analytics/Logs monitorados ✅

---

## 📞 Suporte

**Problemas?**

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Mercado Pago Docs: https://developer.mercadopago.com
- Este projeto: Veja README.md

**Status**: ✅ App pronto para produção no Vercel

Última atualização: Abril 2026
