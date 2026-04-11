#!/bin/bash
# ============================================
# GERAR CERTIFICADOS SSL PARA DESENVOLVIMENTO
# ============================================
# Este script cria certificados self-signed para HTTPS em desenvolvimento
# NÃO use em produção! Vercel gerencia SSL automaticamente.

set -e

echo "🔐 Gerando certificados SSL para desenvolvimento..."

# Criar pasta .ssl
mkdir -p .ssl

# Gerar chave privada e certificado (válido por 365 dias)
openssl req -x509 -newkey rsa:2048 -keyout .ssl/server.key -out .ssl/server.crt \
  -days 365 -nodes \
  -subj "/C=BR/ST=SP/L=São Paulo/O=Vellenia/CN=localhost"

echo "✅ Certificados gerados com sucesso!"
echo "📁 Localização: .ssl/server.key e .ssl/server.crt"
echo ""
echo "Para usar HTTPS em desenvolvimento:"
echo "   VITE_HTTPS=true npm run dev"
echo ""
echo "⚠️  Aviso:"
echo "   - Certificado é self-signed (não reconhecido por navegadores)"
echo "   - Ignorar aviso de segurança no navegador (é seguro para DEV)"
echo "   - Produção: Vercel gerencia SSL automaticamente"
