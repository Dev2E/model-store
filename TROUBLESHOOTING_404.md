# 🔍 TROUBLESHOOTING - Erro 404

## ✅ Mudanças Implementadas

### 1. **Erro React "Objects are not valid as a React child"** ✅ CORRIGIDO
- **Problema**: Objeto de erro estava sendo renderizado diretamente no JSX
- **Solução**: Extrair apenas a mensagem de erro usando `.message`
- **Arquivo**: `src/components/ModalEditarPerfil.jsx`
```javascript
const errorMessage = typeof updateError === 'string' 
  ? updateError 
  : updateError?.message || 'Erro ao atualizar perfil';
setError(errorMessage);
```

### 2. **Badge reCAPTCHA Flutuante Removido** ✅ CORRIGIDO
- **Problema**: Google ReCAPTCHA v3 mostrava um badge flutuante
- **Solução**: Adicionar CSS para ocultar ``.grecaptcha-badge`
- **Arquivo**: `src/index.css`
```css
/* Remove o badge flutuante do reCAPTCHA v3 */
.grecaptcha-badge {
  visibility: hidden;
}
```

### 3. **SSL Badge Adicionado** ✅ IMPLEMENTADO
- **Implementação**: `src/components/SSLBadge.jsx`
- **Função**: Verifica se está em HTTPS e mostra selo verde de segurança
- **Aparência**: Badge flutuante com ícone de escudo no canto inferior direito
- **Comportamento**: Apenas aparece se SSL/HTTPS está ativo

```javascript
// Verifica se estamos em HTTPS
const isHttps = window.location.protocol === 'https:';

// Faz uma requisição HTTPS para validar
const response = await fetch(window.location.origin, {
  method: 'HEAD',
  mode: 'no-cors'
});
```

---

## 🔎 Investigando Erro 404

### Como Diagnosticar
1. Abra o navegador em http://localhost:5173/
2. Pressione **F12** para abrir DevTools
3. Vá para a aba **Network**
4. Procure por requisições com status **404** ou **❌**
5. Clique na requisição e verifique qual URL está falhando

### Possíveis Causas do 404

#### A. Tabela Supabase Não Existe
```javascript
// Verificar console para erros como:
// "Error executing query: relation "tabela_nome" does not exist"
```

**Solução**: Criar a tabela no Supabase
```sql
CREATE TABLE IF NOT EXISTS products (
  id BIGINT PRIMARY KEY,
  name TEXT,
  price DECIMAL,
  category TEXT,
  active BOOLEAN DEFAULT true,
  stock INTEGER,
  image TEXT,
  description TEXT
);
```

---

#### B. Edge Function Não Deployada
Possíveis funções faltando:
- `/functions/criar-pagamento` - Criar pedido no Mercado Pago
- `/functions/consultar-pagamento` - Verificar status do pagamento
- `/functions/calcular-frete-melhor-envio` - Calcular frete
- `/functions/webhooks-mercadopago` - Webhook de confirmação

**Solução**: Deploy local das funções
```bash
supabase functions deploy
```

---

#### C. Arquivo CSS/JS Não Encontrado
Verificar no **Network > Filter by Status > 404**:
- `react-dom-*.js` 
- `index-*.css`

**Solução**: Limpar cache
```bash
# Deletar pasta dist e rebuildar
rm -r dist
npm run build
```

---

### 🛠️ Debug Mode Ativado

Para ativar logging de todas as requisições:

1. **No Console do Navegador**, copie e execute:
```javascript
// Copiar todo o conteúdo de DEBUG_404.js
// Ir em F12 > Console e colar
```

2. **Ou adicione ao seu HTML temporariamente**:
```html
<script src="/DEBUG_404.js"></script>
```

---

## ✨ Recursos Agora Disponíveis

| Recurso | Status | Arquivo |
|---------|--------|---------|
| **SSL Badge** | ✅ Ativo | `src/components/SSLBadge.jsx` |
| **reCAPTCHA Badge Oculto** | ✅ Oculto | `src/index.css` |
| **Error Handling Modal** | ✅ Corrigido | `src/components/ModalEditarPerfil.jsx` |
| **Debug Script** | ✅ Pronto | `DEBUG_404.js` |

---

## 🚀 Próximos Passos

1. **Verificar Network Tab**: Abra DevTools > Network e procure por 404s
2. **Compartilhar o erro específico**: Diga qual URL está falhando
3. **Se for Supabase**: Verifique se as tabelas existem
4. **Se for Edge Function**: Faça deploy das funções

---

## 📞 PRECISA DE AJUDA?

Se o erro persistir:
1. Execute `npm run build` novamente
2. Limpe o cache do navegador (Ctrl+Shift+Delete)
3. Recarregue a página (Ctrl+F5)
4. Abra a aba **Network** e veja qual recurso exato está falhando

