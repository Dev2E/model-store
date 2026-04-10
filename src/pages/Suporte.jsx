export default function Suporte() {
  return (
    <main className="min-h-screen bg-white">
      <section className="px-6 py-12 max-w-4xl mx-auto border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-500 mb-2">CONTA</p>
        <h1 className="text-5xl font-bold font-manrope">Suporte</h1>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-4xl mb-4">📧</p>
            <h3 className="font-bold text-lg mb-2">Email</h3>
            <p className="text-sm text-gray-600 mb-4">Resposta em até 24 horas</p>
            <a href="mailto:suporte@boutique.com">
              <button className="w-full bg-gray-800 text-white py-2 rounded font-semibold hover:bg-gray-900 transition">
                Enviar Email
              </button>
            </a>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-4xl mb-4">📱</p>
            <h3 className="font-bold text-lg mb-2">Telefone</h3>
            <p className="text-sm text-gray-600 mb-4">Seg-Sex: 9h às 18h</p>
            <a href="tel:+5511999999999">
              <button className="w-full bg-gray-800 text-white py-2 rounded font-semibold hover:bg-gray-900 transition">
                Ligar
              </button>
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold font-manrope mb-6">Perguntas Frequentes</h2>
          
          <div className="space-y-4">
            {[
              {
                q: 'Como faço para devolver um produto?',
                a: 'Você tem 30 dias para devolver qualquer produto. Acesse "Meus Pedidos", selecione o item e clique em "Solicitar Devolução".'
              },
              {
                q: 'Qual é o tempo de entrega?',
                a: 'Entregas padrão levam 5-7 dias úteis. Express está disponível por R$ 45,00 com entrega em 2-3 dias.'
              },
              {
                q: 'Posso cancelar meu pedido?',
                a: 'Sim, você pode cancelar em até 24 horas após a compra. Acesse "Meus Pedidos" para mais informações.'
              },
              {
                q: 'Vocês entregam internacionalmente?',
                a: 'Sim! Entregamos para mais de 80 países. As taxas e prazos variam por localização.'
              },
              {
                q: 'Como rastrear meu pedido?',
                a: 'Após o envio, você receberá um email com um código de rastreamento. Use-o no site da transportadora.'
              },
              {
                q: 'Qual é a política de privacidade?',
                a: 'Seus dados são protegidos conforme a LGPD. Consulte nossa Política de Privacidade para detalhes completos.'
              },
            ].map((faq, i) => (
              <details key={i} className="border border-gray-200 rounded-lg p-4 group cursor-pointer">
                <summary className="flex justify-between items-center font-semibold">
                  {faq.q}
                  <span className="material-symbols-outlined group-open:rotate-180 transition">expand_more</span>
                </summary>
                <p className="text-gray-600 mt-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Report Issue */}
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold font-manrope mb-6">Relatar um Problema</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Tipo de Problema</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800">
                <option>Selecione uma opção</option>
                <option>Produto com defeito</option>
                <option>Pedido não chegou</option>
                <option>Cobrança indevida</option>
                <option>Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Descrição</label>
              <textarea
                rows="6"
                placeholder="Descreva o problema..."
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800 resize-none"
              ></textarea>
            </div>

            <button className="w-full bg-gray-800 text-white py-3 font-semibold hover:bg-gray-900 transition rounded-lg">
              Enviar Relatório
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
