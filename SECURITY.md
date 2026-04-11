# 🔐 SEGURANÇA & SSL - VELLENIA STORE

## 📋 Índice

1. [HTTPS/SSL em Produção](#https-ssl-produção)
2. [HTTPS/SSL em Desenvolvimento](#https-ssl-desenvolvimento)
3. [Proteção de Chaves Secretas](#proteção-chaves)
4. [Configuração Vercel](#configuração-vercel)
5. [Headers de Segurança](#headers-segurança)
6. [Verificação de Segurança](#verificação-segurança)
7. [Boas Práticas](#boas-práticas)

---

## HTTPS/SSL em Produção
<a id="https-ssl-produção"></a>

### Vercel Gerencia Automaticamente ✅

Quando você faz deploy no Vercel:

✅ **Certificado SSL automático** (Let's Encrypt)  
✅ **Renovação automática**  
✅ **HTTPS forçado** (redireciona HTTP → HTTPS)  
✅ **HTTP/2 & Brotli compression**  
✅ **CDN global** (Vercel Edge Network)

### Passo 1: Conectar ao Vercel

```bash
# Login no Vercel
npm i -g vercel
vercel login

# Deploy automático
vercel
```

### Passo 2: Configurar Domínio Customizado

1. Vercel Dashboard → Project Settings → Domains
2. Adicionar seu domínio (ex: loja.com)
3. Apontar DNS do registrador para Vercel
4. SSL é automático após DNS propagar (24-48h)

### Passo 3: Verificar SSL

```bash
# Testar certificado
curl -I https://seu-dominio.com

# Deve retornar 200 com HTTPS
```

---

## HTTPS/SSL em Desenvolvimento
<a id="https-ssl-desenvolvimento"></a>

### Gerar Certificados Self-Signed (Opcional)

Para testar HTTPS localmente com certificado self-signed:

```bash
# Gerar certificados (válidos por 365 dias)
npm run generate-ssl

# Resultado:
# .ssl/server.key  (chave privada)
# .ssl/server.crt  (certificado)
```

### Rodar em HTTPS Dev

```bash
# Windows (PowerShell)
$env:VITE_HTTPS="true"; npm run dev

# macOS/Linux
VITE_HTTPS=true npm run dev
```

### ⚠️ Aviso do Navegador

Ao acessar `https://localhost:5173`:

1. Navegador mostra aviso: **"Conexão não é privada"**
2. Clicar **"Avançado"** → **"Acessar localhost (não seguro)"**
3. É **seguro para DEV** (certificado é self-signed)

**Nunca** use certificados self-signed em produção!

---

## Proteção de Chaves Secretas
<a id="proteção-chaves"></a>

### ✅ O QUE JÁ ESTÁ PROTEGIDO

## 1. `.gitignore` Protege Arquivos de Ambiente

```
.env
.env.local
.env.*.local
.env.development.local
.env.test.local
.env.production.local
```

**Nunca commitam** arquivos `.env` com chaves reais.

### 2. Variáveis Seguras em Supabase

Chaves que vão em `.env.local`:

```env
# ✅ SEGURAS - Chaves de cliente (pública)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...  # Anon key (pública)
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR_...  # Pública

# ✅ SEGURAS - Chaves privadas em Supabase Secrets
# (NÃO em .env)
SUPABASE_SERVICE_KEY=...  # Rpc secret (servidor Supabase)
MERCADOPAGO_ACCESS_TOKEN=...  # (servidor Supabase)
```

### 3. Verificação Automática de Segurança

Antes de cada build, script verifica se há chaves expostas:

```bash
npm run build
# Executa: npm run security-check
# Se encontrar chave exposta → Build falha ❌
```

### 📂 Arquivos que NÃO devem ser commitados

```
.env
.env.local           ← Seu arquivo com chaves reais
.env.production      ← Produção
.env.development     ← Dev
.ssl/server.key      ← Chave SSL privada
.ssl/server.crt      ← Certificado SSL
secrets/             ← Pasta com dados sensíveis
.keys/               ← Pasta com chaves
```

**Todos já estão em `.gitignore`** ✅

---

## Configuração Vercel
<a id="configuração-vercel"></a>

### `vercel.json` - Headers de Segurança

O arquivo `vercel.json` já está configurado com:

#### 1. **HSTS** (Força HTTPS)
```json
"Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload"
```

- Força HTTPS por 1 ano
- Inclui subdomínios
- Pré-carregado no navegador

#### 2. **Prevenção de Ataques**

```json
"X-Content-Type-Options": "nosniff"           // Evita MIME detection
"X-Frame-Options": "SAMEORIGIN"              // Evita clickjacking
"X-XSS-Protection": "1; mode=block"          // Bloqueia XSS
"Referrer-Policy": "strict-origin-when-cross-origin"  // Controla referrer
"Permissions-Policy": "camera=(), microphone=(), geolocation=()"  // Nega APIs perigosas
```

#### 3. **Cache Inteligente**

```json
// Assets versionados: cache 1 ano (imutável)
"/assets/(.*)": "public, max-age=31536000, immutable"

// API: sem cache (sempre fresco)
"/api/(.*)": "no-cache, no-store, must-revalidate"
```

### Variáveis de Ambiente no Vercel

1. **Vercel Dashboard** → Project Settings → Environment Variables
2. Adicionar cada variável:

```
VITE_SUPABASE_URL = https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGc...
VITE_MERCADOPAGO_PUBLIC_KEY = APP_USR_...
VITE_SANDBOX_MODE = false (produção) ou true (testes)
```

3. Clicar "Add Environment Variable"
4. Deploy automático recarrega variáveis

---

## Headers de Segurança
<a id="headers-segurança"></a>

### O que cada header faz

| Header | Função | Valor |
|--------|--------|-------|
| **HSTS** | Força HTTPS | 1 ano |
| **X-Content-Type-Options** | Bloqueia MIME detection | `nosniff` |
| **X-Frame-Options** | Previne clickjacking | `SAMEORIGIN` |
| **X-XSS-Protection** | Bloqueia XSS | `1; mode=block` |
| **Referrer-Policy** | Controla info de origem | `strict-origin-when-cross-origin` |
| **Permissions-Policy** | Nega APIs perigosas | `camera=(), microphone=(), geolocation=()` |

### Testar Headers

```bash
# Ver headers de resposta
curl -I https://seu-dominio.com

# Exemplo de saída:
# Strict-Transport-Security: max-age=31536000...
# X-Content-Type-Options: nosniff
# X-Frame-Options: SAMEORIGIN
# ...
```

---

## Verificação de Segurança
<a id="verificação-segurança"></a>

### Script Automático Detecta Chaves Expostas

```bash
npm run security-check
```

**O que verifica:**

❌ Supabase keys  
❌ Mercado Pago keys  
❌ reCAPTCHA keys  
❌ Stripe keys  
❌ Passwords em código  
❌ API keys expostas  
❌ Secrets em comentários  

**Resultado:**

✅ Se seguro: **"Seguro para commitar/fazer push"**  
❌ Se inseguro: **Build falha** (impedindo commit)

### Executado Automaticamente

```bash
npm run build
# Primeiro roda: npm run security-check
# Se OK: npm run vite build
# Se FALHA: para o build
```

---

## Boas Práticas
<a id="boas-práticas"></a>

### ✅ FAZER

```javascript
// ✅ Usar variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ Validar entrada de usuário
const email = sanitizeEmail(userInput);

// ✅ Usar HTTPS sempre
if (window.location.protocol !== 'https:') {
  window.location.protocol = 'https:';
}

// ✅ Remover console.logs em produção
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
}
```

### ❌ NÃO FAZER

```javascript
// ❌ NUNCA hardcodear chaves
const API_KEY = "eyJhbGc...xyz123";

// ❌ NUNCA commitar .env com chaves reais
// VITE_SUPABASE_ANON_KEY=eyJhbGc...xyz123

// ❌ NUNCA expor dados sensíveis em comentários
// admin_password = "senha123"

// ❌ NUNCA confiar apenas em validação frontend
if (email.includes('@')) { // ❌ Insuficiente

// ❌ NUNCA manter console.logs em produção
console.log(userData);  // Log no console público
```

### 🔑 Manejo de Chaves

1. **Criar `.env.local`**
   ```bash
   cp .env.example .env.local
   ```

2. **Preencher com credenciais reais**
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR_...
   ```

3. **NUNCA commitar `.env.local`**
   ```bash
   git status
   # .env.local NÃO deve aparecer (protegido por .gitignore)
   ```

4. **Usar em Vercel? Adicionar via Dashboard**
   - Project Settings → Environment Variables
   - NÃO commitar `.env` com chaves reais

---

## Checklist de Deploy Seguro

Antes de fazer push:

- [ ] `npm run security-check` passou
- [ ] `.env.local` NÃO foi commitado
- [ ] `.gitignore` protege arquivos sensíveis
- [ ] Vercel vaiáveis de ambiente configuradas
- [ ] Certificado SSL será automático no Vercel
- [ ] Headers de segurança em `vercel.json`
- [ ] `npm run build` passou sem erros
- [ ] Testar em produção: https://seu-dominio.com

---

## 📞 Troubleshooting

### "Certificado SSL não reconhecido" em DEV

✅ **Normal** para certificados self-signed  
✅ Ignorar aviso (é seguro para desenvolvimento)  
✅ Produção: Vercel emite Let's Encrypt (reconhecido)

### "Variáveis não aparecem em Vercel"

1. Vercel Dashboard → Project Settings → Environment Variables
2. Procure antes de adicionar (pode já existir)
3. Redeploy after adding
4. Verificar com: `console.log(import.meta.env.VITE_...)`

### "Build falha com security-check"

Executar localmente:
```bash
npm run security-check
# Mostra exatamente o que encontrou
# Remover chaves expostas
```

### "HTTPS não funciona em DEV"

```bash
# Gerar certificados
npm run generate-ssl

# Rodar com HTTPS
VITE_HTTPS=true npm run dev
# Ou no PowerShell:
$env:VITE_HTTPS="true"; npm run dev
```

---

## 📚 Recursos

- [OWASP Security Checklist](https://owasp.org/www-project-web-security-testing-guide/)
- [Vercel Security](https://vercel.com/docs/security)
- [Let's Encrypt (SSL Gratuito)](https://letsencrypt.org/)
- [HTTP Security Headers](https://securityheaders.com/)

---

**Status**: ✅ Aplicação segura e pronta para produção

Última atualização: Abril 2026
