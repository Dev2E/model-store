# 📋 Configuração do Sistema para Novo Cliente

## ✅ Dados Necessários do Cliente

Peça esses dados EXATAMENTE ao cliente antes de iniciar:

### 1. **Informações Básicas da Loja**
```
Nome da Loja:
Email de Contato:
Telefone:
CNPJ/CPF:
Endereço Completo:
```

### 2. **Mercado Pago - IMPORTANTE**

#### Opção A: TESTE (Recomendado para começar)
- [ ] Conta Mercado Pago criada em: https://www.mercadopago.com.br
- [ ] Ir em: Configurações → Credenciais
- Copiar credenciais de **TESTE**:
  ```
  Access Token (Teste): ______________________________
  Public Key (Teste):    ______________________________
  ```
- Colocar em `.env.local`:
  ```
  VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR_xxxxx (TESTE)
  MERCADOPAGO_ACCESS_TOKEN=xxxxx (TESTE)
  VITE_SANDBOX_MODE=true
  ```

#### Opção B: PRODUÇÃO (Após testes)
- [ ] Ativar modo produção no Mercado Pago
- Copiar credenciais de **PRODUÇÃO**:
  ```
  Access Token (Prod): ______________________________
  Public Key (Prod):    ______________________________
  ```
- Colocar em `.env.local`:
  ```
  VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR_xxxxx (PRODUÇÃO)
  MERCADOPAGO_ACCESS_TOKEN=xxxxx (PRODUÇÃO)
  VITE_SANDBOX_MODE=false
  ```

### 3. **Supabase**
- [ ] Projeto Supabase criado: https://supabase.com
- [ ] Ir em: Project Settings → API
- Copiar:
  ```
  Project URL:   ______________________________
  Anon Key:      ______________________________
  Service Role:  ______________________________
  ```

### 4. **Personalização da Loja**

**Cores:**
- Cor Primária (cinza escuro?):  #______
- Cor Secundária (branco?):       #______
- Cor Destaque (vermelho?):       #______

**Textos:**
- Nome da Loja:           _______________________
- Lema/Tagline:           _______________________
- Email para Contato:     _______________________
- WhatsApp (opcional):    _______________________

**Endereço para Frete:**
- Rua:                   _______________________
- Número:                _______________________
- Bairro:                _______________________
- Cidade:                _______________________
- Estado:                _______________________
- CEP:                   _______________________

**Políticas:**
- Prazo de entrega padrão (dias): ___
- Valor frete base (opcional):   R$ ___
- Aceita devolução (dias):       ___

### 5. **Produtos Iniciais** 
Enviar em CSV ou planilha com colunas:
```
Nome | Preço | Categoria | Descrição | Tamanhos | Cores
Camiseta Mentalista | 89.90 | Camisetas | Descrição... | P,M,G,GG | Preto,Branco
```

---

## 🚀 CHECKLIST PARA DEPLOY

- [ ] Configurar credenciais de teste no Mercado Pago
- [ ] Testar compra com cartão de teste (4111111111111111)
- [ ] Confirmar que produtos aparecem na home
- [ ] Testar frete calculando CEP
- [ ] Testar checkout completo
- [ ] Confirmar emails sendo enviados
- [ ] Trocar para credenciais de produção
- [ ] Configurar domínio próprio
- [ ] Ativar HTTPS
- [ ] Remover localhost do CORS

---

## 📞 SUPORTE

Se o cliente tiver dúvidas:
- Erro "Uma das partes é de teste": Credenciais mismatch (arrumar sandbox_mode ou tokens)
- Frete não calcula: CEP inválido ou serviço down
- Mercado Pago redireciona errado: Colocar domínio correto em back_urls

