export default function ProgramaFidelidade() {
  return (
    <main className="min-h-screen bg-white">
      <section className="px-6 py-12 max-w-4xl mx-auto border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-500 mb-2">CONTA</p>
        <h1 className="text-5xl font-bold font-manrope">Programa Fidelidade</h1>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Member Status */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg p-12 mb-12">
          <p className="text-sm font-semibold mb-2 opacity-90">Seu Status</p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-5xl font-bold font-manrope">Membro Gold</p>
              <p className="text-gray-300 mt-2">Desbloqueie benefícios exclusivos</p>
            </div>
            <span className="text-7xl">⭐</span>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold font-manrope mb-6">Benefícios do Programa</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-4xl mb-4">🎁</p>
              <h3 className="font-bold text-lg mb-2">Descontos Exclusivos</h3>
              <p className="text-sm text-gray-600">Até 20% de desconto em compras selecionadas</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-4xl mb-4">🚚</p>
              <h3 className="font-bold text-lg mb-2">Frete Grátis</h3>
              <p className="text-sm text-gray-600">Em todas as compras acima de R$ 200</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-4xl mb-4">⏰</p>
              <h3 className="font-bold text-lg mb-2">Acesso Antecipado</h3>
              <p className="text-sm text-gray-600">Veja novos produtos antes de todo mundo</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-4xl mb-4">🎉</p>
              <h3 className="font-bold text-lg mb-2">Ofertas Sazonais</h3>
              <p className="text-sm text-gray-600">Descontos especiais em ocasiões especiais</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-4xl mb-4">📞</p>
              <h3 className="font-bold text-lg mb-2">Suporte VIP</h3>
              <p className="text-sm text-gray-600">Atendimento prioritário ao cliente</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-4xl mb-4">💝</p>
              <h3 className="font-bold text-lg mb-2">Brinde de Aniversário</h3>
              <p className="text-sm text-gray-600">Presente especial no seu aniversário</p>
            </div>
          </div>
        </div>

        {/* Tiers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold font-manrope mb-6">Níveis de Gastos</h2>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">Silver</p>
                  <p className="text-sm text-gray-600">Primeiros R$ 1.000 em compras</p>
                </div>
                <p className="text-gray-500">5% de desconto</p>
              </div>
            </div>

            <div className="border-2 border-gray-800 rounded-lg p-6 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">Gold (Seu nível)</p>
                  <p className="text-sm text-gray-600">De R$ 1.001 a R$ 5.000 em compras</p>
                </div>
                <p className="font-bold text-gray-800">10% de desconto</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">Platinum</p>
                  <p className="text-sm text-gray-600">Acima de R$ 5.000 em compras</p>
                </div>
                <p className="text-gray-500">15% de desconto + todas Gold</p>
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        <div>
          <h2 className="text-2xl font-bold font-manrope mb-6">Histórico de Atividades</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <p className="text-sm">Compra finalizada - Pedido #ORD-9023</p>
              <p className="font-semibold">+200</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <p className="text-sm">Avaliou um produto</p>
              <p className="font-semibold">+50</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <p className="text-sm">Indicou um amigo</p>
              <p className="font-semibold">+100</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <p className="text-sm">Compartilhou na rede social</p>
              <p className="font-semibold">+25</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
