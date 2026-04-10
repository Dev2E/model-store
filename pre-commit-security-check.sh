#!/bin/bash
# 🔒 PRÉ-COMMIT SECURITY CHECK
# Execute antes de fazer git push
# chmod +x pre-commit-security-check.sh

echo "🔒 VERIFICANDO SEGURANÇA PRÉ-GITHUB..."
echo ""

FAILED=0

echo "1️⃣ Verificando credenciais expostas..."
if git diff --cached | grep -iE "(password|token|secret|key|APP_USR|sbp_)" >/dev/null 2>&1; then
    echo "❌ ENCONTRADAS credenciais no commit!"
    git diff --cached | grep -iE "(password|token|secret|key|APP_USR|sbp_)"
    FAILED=1
else
    echo "✅ Nenhuma credencial encontrada"
fi

echo ""
echo "2️⃣ Verificando .env.local tracked..."
if git diff --cached --name-only | grep -E "\.env\.local$" >/dev/null 2>&1; then
    echo "❌ .env.local será commitado!"
    git diff --cached --name-only | grep ".env.local"
    FAILED=1
else
    echo "✅ .env.local não está tracked"
fi

echo ""
echo "3️⃣ Verificando variáveis sensíveis em código..."
if grep -r "MERCADO_PAGO_ACCESS_TOKEN" src/ supabase/functions/ --exclude-dir=node_modules >/dev/null 2>&1; then
    echo "❌ MERCADO_PAGO_ACCESS_TOKEN encontrado em código!"
    grep -r "MERCADO_PAGO_ACCESS_TOKEN" src/ supabase/functions/ --exclude-dir=node_modules
    FAILED=1
else
    echo "✅ Nenhuma credencial privada em código"
fi

echo ""
echo "4️⃣ Verificando Access-Control-Allow-Origin inseguro..."
if grep -r '"Access-Control-Allow-Origin": "\*"' supabase/functions/criar-pagamento supabase/functions/consultar-pagamento >/dev/null 2>&1; then
    echo "❌ CORS permissivo encontrado em criar-pagamento ou consultar-pagamento!"
    FAILED=1
else
    echo "✅ CORS configurado com restrições"
fi

echo ""
echo "5️⃣ Verificando console.log sensiveis..."
if grep -r "console.log.*token\|console.log.*password\|console.log.*secret" src/pages/Checkout.jsx src/services/ >/dev/null 2>&1; then
    echo "⚠️ ATENÇÃO: Possível console.log de dados sensíveis (revisar manualmente)"
else
    echo "✅ Nenhum console.log sensível óbvio"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAILED -eq 0 ]; then
    echo "✅ TUDO OK! Seguro para fazer git push"
    exit 0
else
    echo "❌ PROBLEMAS ENCONTRADOS! Corrija antes de fazer git push"
    exit 1
fi
