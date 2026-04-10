import { Link } from 'react-router-dom';

export default function PagamentoPendente() {
  return (
    <main className="min-h-screen bg-white">
      <section className="px-6 py-12 max-w-4xl mx-auto border-b border-gray-200">
        <h1 className="text-5xl font-bold font-manrope">⏳ Pagamento Pendente</h1>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Alerta */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">Seu pagamento está em análise</h2>
            <p className="text-yellow-700">
              O processamento do seu pagamento está pendente. Isso geralmente leva de algumas horas a 2 dias úteis.
            </p>
          </div>

          {/* Informações */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">📌 Informações Importantes</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span>✓</span>
                <span>Você receberá uma confirmação por email quando o pagamento for aprovado</span>
              </li>
              <li className="flex gap-3">
                <span>✓</span>
                <span>Seu pedido foi criado e aguarda confirmação do pagamento</span>
              </li>
              <li className="flex gap-3">
                <span>✓</span>
                <span>Não será cobrado nada até a aprovação final</span>
              </li>
            </ul>
          </div>

          {/* Dicas */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-3">💡 Recomendações</h3>
            <ol className="space-y-2 text-blue-800">
              <li className="flex gap-3">
                <span>1.</span>
                <span>Verifique seu email (incluindo spam) para atualizações</span>
              </li>
              <li className="flex gap-3">
                <span>2.</span>
                <span>Você pode acompanhar seu pedido em "Meus Pedidos"</span>
              </li>
              <li className="flex gap-3">
                <span>3.</span>
                <span>Se não receber confirmação em 48 horas, entre em contato</span>
              </li>
            </ol>
          </div>

          {/* Ações */}
          <div className="flex gap-4">
            <Link
              to="/meus-pedidos"
              className="flex-1 bg-gray-800 text-white py-3 rounded font-semibold hover:bg-gray-900 transition text-center"
            >
              Ver Meus Pedidos
            </Link>
            <Link
              to="/contato"
              className="flex-1 bg-gray-100 text-gray-800 py-3 rounded font-semibold hover:bg-gray-200 transition text-center"
            >
              Fale Conosco
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
