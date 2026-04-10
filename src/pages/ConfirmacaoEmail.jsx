import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ConfirmacaoEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, success, error, expired
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const type = searchParams.get('type'); // email_change, recovery

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token de confirmação não encontrado.');
        return;
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: type || 'email_change',
        });

        if (error) {
          if (error.message.includes('expired')) {
            setStatus('expired');
            setMessage('Seu link de confirmação expirou. Solicite um novo.');
          } else {
            setStatus('error');
            setMessage('Erro ao confirmar email. ' + (error.message || 'Tente novamente.'));
          }
        } else {
          setStatus('success');
          setMessage('Email confirmado com sucesso!');
          // Redireciona para home após 3 segundos
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (err) {
        setStatus('error');
        setMessage('Erro ao processar confirmação. Tente novamente.');
        console.error('Email confirmation error:', err);
      }
    };

    confirmEmail();
  }, [token, type, navigate]);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-6"></div>
              <h1 className="text-2xl font-bold font-manrope mb-4">Confirmando email...</h1>
              <p className="text-gray-600">Aguarde um momento enquanto verificamos seu email.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-5xl mb-4">✅</div>
              <h1 className="text-2xl font-bold font-manrope mb-4 text-green-600">Email Confirmado!</h1>
              <p className="text-gray-600 mb-6">
                Sua conta foi verificada com sucesso. Você será redirecionado para a home em alguns segundos...
              </p>
              <Link to="/" className="inline-block bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-900 transition">
                Ir para Home
              </Link>
            </>
          )}

          {status === 'expired' && (
            <>
              <div className="text-5xl mb-4">⏰</div>
              <h1 className="text-2xl font-bold font-manrope mb-4 text-orange-600">Link Expirado</h1>
              <p className="text-gray-600 mb-6">
                O link de confirmação expirou. Solicite um novo email de confirmação.
              </p>
              <div className="space-y-3">
                <Link to="/recuperar-conta" className="inline-block bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-900 transition w-full">
                  Solicitar Novo Link
                </Link>
                <Link to="/" className="inline-block text-gray-800 px-6 py-3 rounded border border-gray-300 hover:bg-gray-50 transition w-full">
                  Voltar para Home
                </Link>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-5xl mb-4">❌</div>
              <h1 className="text-2xl font-bold font-manrope mb-4 text-red-600">Erro na Confirmação</h1>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Link to="/login" className="inline-block bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-900 transition w-full">
                  Fazer Login
                </Link>
                <Link to="/" className="inline-block text-gray-800 px-6 py-3 rounded border border-gray-300 hover:bg-gray-50 transition w-full">
                  Voltar para Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
