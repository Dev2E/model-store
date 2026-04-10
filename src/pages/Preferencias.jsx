import { useState } from 'react';

export default function Preferencias() {
  const [preferences, setPreferences] = useState({
    emailNewsleteer: true,
    emailPromotions: false,
    emailNewProducts: true,
    smsPushNotifications: true,
    orderUpdates: true,
    productRecommendations: false,
    theme: 'light',
    language: 'pt-BR',
  });

  const handleToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    alert('Preferências atualizadas com sucesso!');
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="px-6 py-12 max-w-4xl mx-auto border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-500 mb-2">CONTA</p>
        <h1 className="text-5xl font-bold font-manrope">Preferências</h1>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Notifications */}
        <div className="bg-gray-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold font-manrope mb-6">Notificações</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-semibold">Newsletter</p>
                <p className="text-sm text-gray-600">Receba conteúdo exclusivo e ofertas especiais</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emailNewsleteer}
                  onChange={() => handleToggle('emailNewsleteer')}
                  className="w-6 h-6"
                />
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-semibold">Promoções</p>
                <p className="text-sm text-gray-600">Notificado sobre descontos e vendas</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emailPromotions}
                  onChange={() => handleToggle('emailPromotions')}
                  className="w-6 h-6"
                />
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-semibold">Novos Produtos</p>
                <p className="text-sm text-gray-600">Fique por dentro de lançamentos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emailNewProducts}
                  onChange={() => handleToggle('emailNewProducts')}
                  className="w-6 h-6"
                />
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-semibold">Atualizações de Pedidos</p>
                <p className="text-sm text-gray-600">Rastreamento e status de entrega</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.orderUpdates}
                  onChange={() => handleToggle('orderUpdates')}
                  className="w-6 h-6"
                />
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-semibold">Recomendações de Produtos</p>
                <p className="text-sm text-gray-600">Sugestões personalizadas baseadas no seu histórico</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.productRecommendations}
                  onChange={() => handleToggle('productRecommendations')}
                  className="w-6 h-6"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-gray-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold font-manrope mb-6">Configurações de Exibição</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Tema</label>
              <select
                value={preferences.theme}
                onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
                <option value="system">Sistema</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Idioma</label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">Inglês</option>
                <option value="es-ES">Espanhol</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-gray-800 text-white py-3 font-semibold hover:bg-gray-900 transition rounded-lg"
        >
          Salvar Preferências
        </button>
      </div>
    </main>
  );
}
