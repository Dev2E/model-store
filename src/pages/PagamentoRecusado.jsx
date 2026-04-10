import { Link } from 'react-router-dom';

export default function PagamentoRecusado() {
  return (
    <main className="min-h-screen bg-white">
      <section className="px-6 py-12 max-w-4xl mx-auto border-b border-gray-200">
        <h1 className="text-5xl font-bold font-manrope">❌ Pagamento Recusado</h1>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Alerta */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-red-800 mb-2">Seu pagamento foi recusado 😞</h2>
            <p className="text-red-700">
              Não conseguimos processar seu pagamento. Isso pode ocorrer por vários motivos:
            </p>
          </div>

          {/* Motivos */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Possíveis Motivos:</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span>💳</span>
                <span>Dados do cartão incorretos ou expirados</span>
              </li>
              <li className="flex gap-3">
                <span>🔒</span>
                <span>Saldo insuficiente</span>
              </li>
              <li className="flex gap-3">
                <span>⚠️</span>
                <span>Seu banco bloqueou a transação</span>
              </li>
              <li className="flex gap-3">
                <span>🚫</span>
                <span>Cartão não autorizado para compras online</span>
              </li>
            </ul>
          </div>

          {/* Dicas */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-yellow-900 mb-3">💡 O Que Fazer?</h3>
            <ol className="space-y-2 text-yellow-800">
              <li className="flex gap-3">
                <span>1.</span>
                <span>Verifique os dados do seu cartão</span>
              </li>
              <li className="flex gap-3">
                <span>2.</span>
                <span>Confirme que o cartão não está expirado</span>
              </li>
              <li className="flex gap-3">
                <span>3.</span>
                <span>Tente novamente ou use outro cartão</span>
              </li>
              <li className="flex gap-3">
                <span>4.</span>
                <span>Contate seu banco se o problema persistir</span>
              </li>
            </ol>
          </div>

          {/* Ações */}
          <div className="flex gap-4">
            <Link
              to="/carrinho"
              className="flex-1 bg-gray-800 text-white py-3 rounded font-semibold hover:bg-gray-900 transition text-center"
            >
              Voltar ao Carrinho
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
