import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function CookieNotice() {
  const [showCookie, setShowCookie] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      const timer = setTimeout(() => {
        setShowCookie(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowCookie(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowCookie(false);
  };

  return (
    <>
      {/* Cookie Notice - Floating Card */}
      {showCookie && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 bg-gray-900 text-white rounded-lg shadow-xl max-w-xs sm:max-w-sm w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="p-4 sm:p-5 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowCookie(false)}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-white transition"
              aria-label="Fechar"
            >
              <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Content */}
            <div className="pr-8">
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                <span>🍪</span> Cookies
              </h3>
              <p className="text-xs text-gray-300 mb-4">
                Usamos cookies para melhorar sua experiência.{' '}
                <button
                  onClick={() => setShowTerms(true)}
                  className="underline hover:text-white transition"
                >
                  Saiba mais
                </button>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleReject}
                className="flex-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded transition text-xs font-semibold"
              >
                Rejeitar
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 px-3 py-1.5 bg-white text-gray-900 hover:bg-gray-100 rounded transition text-xs font-semibold"
              >
                Aceitar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold font-manrope">Política de Cookies</h2>
              <button
                onClick={() => setShowTerms(false)}
                className="text-gray-600 hover:text-gray-800 transition"
                aria-label="Fechar"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-gray-700">
              <section>
                <h3 className="font-bold mb-2">O que são Cookies?</h3>
                <p className="text-sm">
                  Cookies são pequenos arquivos de texto armazenados no seu navegador que nos ajudam a proporcionar uma melhor experiência.
                </p>
              </section>

              <section>
                <h3 className="font-bold mb-2">Tipos de Cookies que Utilizamos</h3>
                <ul className="text-sm space-y-2">
                  <li>• <strong>Essenciais:</strong> Necessários para o funcionamento básico do site</li>
                  <li>• <strong>Desempenho:</strong> Análise de como você usa o site</li>
                  <li>• <strong>Publicidade:</strong> Personalização de conteúdo e anúncios</li>
                  <li>• <strong>Redes Sociais:</strong> Integração com plataformas sociais</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold mb-2">Controle de Cookies</h3>
                <p className="text-sm">
                  Você pode controlar cookies através das configurações do seu navegador. Alguns cookies são essenciais para o funcionamento do site e não podem ser desativados.
                </p>
              </section>

              <section>
                <h3 className="font-bold mb-2">Contato</h3>
                <p className="text-sm">
                  Para mais informações sobre nossa política de privacidade e cookies, entre em contato através de suporte@boutique.com.
                </p>
              </section>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3">
              <button
                onClick={() => {
                  handleReject();
                  setShowTerms(false);
                }}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition font-semibold"
              >
                Rejeitar
              </button>
              <button
                onClick={() => {
                  handleAccept();
                  setShowTerms(false);
                }}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded transition font-semibold"
              >
                Aceitar Tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
