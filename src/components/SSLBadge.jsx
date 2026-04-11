import { useState, useEffect } from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

export default function SSLBadge() {
  const [isSSL, setIsSSL] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSSL = async () => {
      try {
        setIsChecking(true);
        
        // Verificar se estamos em HTTPS
        const isHttps = window.location.protocol === 'https:';
        
        if (isHttps) {
          // Tentar fazer uma requisição HTTPS para verificar certificado válido
          const response = await fetch(window.location.origin, {
            method: 'HEAD',
            mode: 'no-cors'
          });
          setIsSSL(true);
        } else {
          // Se for HTTP, certificado SSL não está ativo
          setIsSSL(false);
        }
      } catch (error) {
        console.warn('Erro ao verificar SSL:', error);
        setIsSSL(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkSSL();
  }, []);

  if (isChecking || !isSSL) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 z-40 bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg animate-slideInRight hover:bg-green-700 transition cursor-help"
      title="Conexão segura com SSL/TLS ativado"
    >
      <ShieldCheckIcon className="w-5 h-5" />
      <span className="text-sm font-semibold">SSL Seguro</span>
    </div>
  );
}
