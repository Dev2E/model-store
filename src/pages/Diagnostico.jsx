import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Diagnostico() {
  const [diagnostics, setDiagnostics] = useState({
    url: '',
    key: '',
    connectionStatus: 'Testando...',
    productsTest: 'Aguardando...',
    authTest: 'Aguardando...',
    errors: [],
  });

  useEffect(() => {
    const runDiagnostics = async () => {
      const errors = [];
      const updates = {
        url: import.meta.env.VITE_SUPABASE_URL,
        key: import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 30) + '...',
      };

      // Teste 1: Verificar conexão básica
      try {
        const { data, error } = await supabase.from('products').select('COUNT(*)');
        if (error) {
          updates.connectionStatus = `❌ ERRO: ${error.message}`;
          errors.push(`Erro de conexão: ${error.message}`);
        } else {
          updates.connectionStatus = '✅ Conectado ao Supabase';
        }
      } catch (err) {
        updates.connectionStatus = `❌ Exceção: ${err.message}`;
        errors.push(`Exceção de conexão: ${err.message}`);
      }

      // Teste 2: Buscar produtos
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('active', true)
          .limit(1);

        if (error) {
          updates.productsTest = `❌ Erro ao buscar produtos: ${error.message} (Status: ${error.status})`;
          errors.push(`Erro ao buscar produtos: ${error.message}`);
        } else if (data && data.length > 0) {
          updates.productsTest = `✅ Produtos encontrados: ${data.length}`;
        } else {
          updates.productsTest = '⚠️ Nenhum produto ativo encontrado (mas sem erros)';
        }
      } catch (err) {
        updates.productsTest = `❌ Exceção ao buscar produtos: ${err.message}`;
        errors.push(`Exceção ao buscar produtos: ${err.message}`);
      }

      // Teste 3: Testar autenticação
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          updates.authTest = `⚠️ Nenhum usuário autenticado (esperado): ${error.message}`;
        } else if (data?.user) {
          updates.authTest = `✅ Usuário autenticado: ${data.user.email}`;
        } else {
          updates.authTest = '⚠️ Nenhum usuário autenticado';
        }
      } catch (err) {
        updates.authTest = `❌ Erro ao testar autenticação: ${err.message}`;
        errors.push(`Erro de autenticação: ${err.message}`);
      }

      updates.errors = errors;
      setDiagnostics((prev) => ({ ...prev, ...updates }));
    };

    runDiagnostics();
  }, []);

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔧 Diagnóstico Supabase</h1>

        <div className="space-y-4">
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h2 className="font-bold text-gray-700">URL do Supabase</h2>
            <p className="font-mono text-sm text-gray-600">{diagnostics.url}</p>
          </div>

          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h2 className="font-bold text-gray-700">Chave Pública (primeiros 30 caracteres)</h2>
            <p className="font-mono text-sm text-gray-600">{diagnostics.key}</p>
          </div>

          <div className="border border-2 border-blue-400 rounded-lg p-4 bg-blue-50">
            <h2 className="font-bold text-blue-900">Status de Conexão</h2>
            <p className="text-blue-800">{diagnostics.connectionStatus}</p>
          </div>

          <div className="border border-2 border-green-400 rounded-lg p-4 bg-green-50">
            <h2 className="font-bold text-green-900">Teste de Produtos</h2>
            <p className="text-green-800">{diagnostics.productsTest}</p>
          </div>

          <div className="border border-2 border-purple-400 rounded-lg p-4 bg-purple-50">
            <h2 className="font-bold text-purple-900">Teste de Autenticação</h2>
            <p className="text-purple-800">{diagnostics.authTest}</p>
          </div>

          {diagnostics.errors.length > 0 && (
            <div className="border border-2 border-red-400 rounded-lg p-4 bg-red-50">
              <h2 className="font-bold text-red-900 mb-2">❌ Erros Encontrados</h2>
              <ul className="list-disc list-inside space-y-1">
                {diagnostics.errors.map((err, idx) => (
                  <li key={idx} className="text-red-800 text-sm">
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h2 className="font-bold text-gray-700 mb-2">📋 Soluções Recomendadas</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
              <li>Se vê erro 401: Verifique se a chave pública está correta no <code className="bg-white px-1">.env.local</code></li>
              <li>Se vê erro 401: Verifique se a URL do Supabase está correta</li>
              <li>Verifique em Supabase Dashboard → Authentication → Policies se as políticas RLS permitem leitura pública</li>
              <li>Na tabela <code className="bg-white px-1">products</code>, deve ter uma política <code className="bg-white px-1">USING (active = true)</code></li>
              <li>Certifique-se de que o banco de dados foi resetado com <code className="bg-white px-1">DATABASE_COMPLETO.sql</code></li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
