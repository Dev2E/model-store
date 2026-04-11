import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function Contato() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'contato',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você conectaria com um serviço de email
    alert('Obrigado pelo contato! Em breve retornaremos.');
    setFormData({ name: '', email: '', phone: '', subject: 'contato', message: '' });
  };

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
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">Nome Completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu.email@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold mb-2">Telefone (Opcional)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold mb-2">Assunto</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
              >
                <option value="contato">Questão Geral</option>
                <option value="pedido">Sobre um Pedido</option>
                <option value="produto">Pergunta sobre Produto</option>
                <option value="devolucao">Devolução/Troca</option>
                <option value="parceria">Parceria</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold mb-2">Mensagem</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Conte-nos mais sobre sua consulta..."
                required
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800 resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-3 font-semibold hover:bg-gray-900 transition"
            >
              Enviar Mensagem
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-8 rounded-lg sticky top-24">
            <h3 className="text-2xl font-bold font-manrope mb-6">Informações</h3>

            <div className="space-y-8">
              {/* Email */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">EMAIL</p>
                <p className="text-lg">
                  <a href="mailto:contato@boutique.com" className="text-gray-800 hover:text-gray-600">
                    contato@boutique.com
                  </a>
                </p>
              </div>

              {/* Phone */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">TELEFONE</p>
                <p className="text-lg">
                  <a href="tel:+5511999999999" className="text-gray-800 hover:text-gray-600">
                    +55 (11) 99999-9999
                  </a>
                </p>
              </div>

              {/* Hours */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">HORÁRIO DE ATENDIMENTO</p>
                <p className="text-sm text-gray-600">
                  Segunda - Sexta: 9:00 - 18:00<br />
                  Sábado: 10:00 - 16:00<br />
                  Domingo: Fechado
                </p>
              </div>

              {/* Address */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">ENDEREÇO</p>
                <p className="text-sm text-gray-600">
                  Rua da Curadoria, 123<br />
                  São Paulo, SP 01234-567<br />
                  Brasil
                </p>
              </div>

              {/* Social */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-3">SIGA-NOS</p>
                <div className="flex gap-4">
                  <a href="#" className="text-gray-600 hover:text-gray-800 text-2xl">📘</a>
                  <a href="#" className="text-gray-600 hover:text-gray-800 text-2xl">📷</a>
                  <a href="#" className="text-gray-600 hover:text-gray-800 text-2xl">𝕏</a>
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
