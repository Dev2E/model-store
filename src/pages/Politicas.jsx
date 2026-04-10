export default function Politicas() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="px-6 py-12 max-w-4xl mx-auto border-b border-gray-200">
        <h1 className="text-5xl font-bold font-manrope mb-4">Políticas e Termos</h1>
        <p className="text-gray-600">Última atualização: Abril de 2026</p>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Privacy */}
        <section>
          <h2 className="text-2xl font-bold font-manrope mb-4">Privacidade</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Sua privacidade é importante para nós. Coletamos informações apenas quando necessário para 
              processar pedidos, melhorar sua experiência e enviar comunicações relevantes.
            </p>
            <h3 className="font-semibold text-gray-800 mt-4">Informações que Coletamos:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Nome, email e dados de contato</li>
              <li>Endereço de entrega e cobrança</li>
              <li>Histórico de compras e preferências</li>
              <li>Dados de navegação do website</li>
              <li>Informações de pagamento (processadas com segurança)</li>
            </ul>
            <h3 className="font-semibold text-gray-800 mt-4">Como Usamos:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Processar suas compras e envios</li>
              <li>Personalizar sua experiência</li>
              <li>Enviar atualizações sobre pedidos</li>
              <li>Marketing (com sua autorização)</li>
              <li>Melhorar nossos serviços</li>
            </ul>
            <p className="mt-4 text-sm">
              Nunca vendemos suas informações para terceiros. Para mais detalhes, confira nossa Política Completa de Privacidade.
            </p>
          </div>
        </section>

        {/* Terms of Service */}
        <section className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold font-manrope mb-4">Termos de Serviço</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Ao acessar e usar este website, você concorda em cumprir com estes termos. Se não concordar, 
              por favor, não use o site.
            </p>
            <h3 className="font-semibold text-gray-800 mt-4">Condições de Compra:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Você deve ter pelo menos 18 anos</li>
              <li>As informações fornecidas devem ser precisas e completas</li>
              <li>Você aceita a responsabilidade por todas as atividades</li>
              <li>Os preços estão sujeitos a mudanças sem aviso prévio</li>
            </ul>
            <h3 className="font-semibold text-gray-800 mt-4">Propriedade Intelectual:</h3>
            <p>
              Todo conteúdo neste website (imagens, textos, designs) é propriedade da Boutique e protegido 
              por leis de direitos autorais internacionais.
            </p>
            <h3 className="font-semibold text-gray-800 mt-4">Limitação de Responsabilidade:</h3>
            <p>
              A Boutique não é responsável por danos indiretos, incidentais ou consequentes resultantes do 
              uso de nossos serviços.
            </p>
          </div>
        </section>

        {/* Shipping & Returns */}
        <section className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold font-manrope mb-4">Envios e Devoluções</h2>
          <div className="space-y-4 text-gray-600">
            <h3 className="font-semibold text-gray-800">Envios:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Padrão:</strong> 5-7 dias úteis (Grátis acima de R$ 500)</li>
              <li><strong>Express:</strong> 2-3 dias úteis (R$ 45,00)</li>
              <li><strong>Agendado:</strong> Escolha sua data de entrega</li>
              <li>Monitoramento em tempo real disponível</li>
            </ul>
            <h3 className="font-semibold text-gray-800 mt-4">Política de Devolução:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>30 dias para devolução sem questionamentos</li>
              <li>Produto deve estar em condições originais</li>
              <li>Reembolso processado em 5-7 dias úteis</li>
              <li>Frete de devolução é grátis para defeitos</li>
            </ul>
            <h3 className="font-semibold text-gray-800 mt-4">Exceções:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Itens personalizados não podem ser devolvidos</li>
              <li>Produtos marcados como final sale</li>
              <li>Itens danificados por uso impróprio</li>
            </ul>
          </div>
        </section>

        {/* Sustainability */}
        <section className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold font-manrope mb-4">Compromisso com Sustentabilidade</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              A Boutique está comprometida em reduzir seu impacto ambiental e promover práticas éticas 
              em toda a cadeia de suprimentos.
            </p>
            <h3 className="font-semibold text-gray-800 mt-4">Nossas Iniciativas:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Embalagens 100% recicláveis e biodegradáveis</li>
              <li>Parceria com fornecedores certificados Fair Trade</li>
              <li>Redução de 40% de emissões de carbono desde 2020</li>
              <li>Programa de reciclagem de produtos usados</li>
              <li>1% das vendas para projetos ambientais</li>
            </ul>
            <h3 className="font-semibold text-gray-800 mt-4">Certificações:</h3>
            <p>
              Nossas parcerias incluem fornecedores certificados por B-Corp, FSC, GOTS e outros padrões internacionais.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="border-t border-gray-200 pt-12 pb-12">
          <h2 className="text-2xl font-bold font-manrope mb-4">Dúvidas?</h2>
          <p className="text-gray-600">
            Para mais informações sobre nossas políticas ou para reportar preocupações, entre em contato conosco em{' '}
            <a href="mailto:legal@boutique.com" className="text-gray-800 font-semibold hover:underline">
              legal@boutique.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
