import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function Contato() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="px-6 py-12 max-w-7xl mx-auto border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-500 mb-2">FALE CONOSCO</p>
        <h1 className="text-5xl font-bold font-manrope mb-4">Entre em Contato</h1>
        <p className="text-gray-600 max-w-2xl">Tem dúvidas ou sugestões? Nossa equipe está aqui para ajudar.</p>
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 px-6 py-16 max-w-7xl mx-auto">
        {/* Contact Info - Centralizado */}
        <div className="lg:col-span-3">
          <div className="bg-gray-50 p-12 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold font-manrope mb-8 text-center">Informações de Contato</h3>

            <div className="space-y-8">
              {/* Email */}
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-500 mb-2">EMAIL</p>
                <p className="text-lg">
                  <a href="mailto:contato@boutique.com" className="text-gray-800 hover:text-gray-600 font-semibold">
                    contato@boutique.com
                  </a>
                </p>
              </div>

              {/* Phone */}
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-500 mb-2">TELEFONE</p>
                <p className="text-lg">
                  <a href="tel:+5511999999999" className="text-gray-800 hover:text-gray-600 font-semibold">
                    +55 (11) 99999-9999
                  </a>
                </p>
              </div>

              {/* Hours */}
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-500 mb-2">HORÁRIO DE ATENDIMENTO</p>
                <p className="text-sm text-gray-600">
                  Segunda - Sexta: 9:00 - 18:00<br />
                  Sábado: 10:00 - 16:00<br />
                  Domingo: Fechado
                </p>
              </div>

              {/* Address */}
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-500 mb-2">ENDEREÇO</p>
                <p className="text-sm text-gray-600">
                  Rua da Curadoria, 123<br />
                  São Paulo, SP 01234-567<br />
                  Brasil
                </p>
              </div>

              {/* Social */}
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-500 mb-3">SIGA-NOS</p>
                <div className="flex gap-4 justify-center">
                  <a href="#" className="text-gray-600 hover:text-gray-800 text-3xl">📘</a>
                  <a href="#" className="text-gray-600 hover:text-gray-800 text-3xl">📷</a>
                  <a href="#" className="text-gray-600 hover:text-gray-800 text-3xl">𝕏</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto border-t border-gray-200">
        <h2 className="text-3xl font-bold font-manrope mb-8 text-center">Perguntas Frequentes</h2>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            { q: 'Qual é o prazo de entrega?', a: 'Entregas padrão levam 5-7 dias úteis. Express está disponível.' },
            { q: 'Como faço uma devolução?', a: 'Aceitamos devoluções em até 30 dias. Confira nossa política completa.' },
            { q: 'Vocês enviam internacionalmente?', a: 'Sim! Enviamos para +80 países. Consulte taxas locais.' },
            { q: 'Os produtos têm garantia?', a: 'Todos os itens têm garantia de 1 ano contra defeitos de fabricação.' },
          ].map((faq, i) => (
            <details key={i} className="border border-gray-200 rounded-lg p-4 group cursor-pointer">
              <summary className="flex justify-between items-center font-semibold list-none">
                {faq.q}
                <ChevronDownIcon className="w-5 h-5 group-open:rotate-180 transition text-gray-600" />
              </summary>
              <p className="text-gray-600 mt-4">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
