import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircleIcon, EnvelopeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';

export default function ConfirmarEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('waiting'); // waiting, success, error
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    // Tenta confirmar o email se houver token na URL
    const handleEmailConfirmation = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (token && type === 'signup') {
        try {
          setStatus('waiting');
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup',
          });

          if (!error) {
            setStatus('success');
            // Redireciona para o perfil em 3 segundos
            setTimeout(() => navigate('/meu-perfil'), 3000);
          } else {
            setStatus('error');
            console.error('Erro ao confirmar:', error);
          }
        } catch (err) {
          setStatus('error');
          console.error('Erro:', err);
        }
      }
    };

    handleEmailConfirmation();

    // Tenta obter o email do usuário atual
    const getEmail = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        setEmail(data.user.email);
      }
    };
    getEmail();
  }, [searchParams, navigate]);

  const handleResendEmail = async () => {
    if (!email) {
      alert('Email não encontrado');
      return;
    }

    setResendLoading(true);
    try {
      const { error } = await supabase.auth.resendEnrollmentEmail({
        email,
        token: window.location.hash.split('token=')[1]?.split('&')[0] || '',
      });

      if (!error) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      } else {
        alert('Erro ao reenviar email: ' + error.message);
      }
    } catch (err) {
      alert('Erro ao reenviar: ' + err.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Sucesso */}
        {status === 'success' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircleIcon className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold font-manrope text-gray-900 mb-3">
              Email Confirmado!
            </h1>
            <p className="text-gray-600 mb-6">
              Sua conta foi ativada com sucesso. Bem-vindo à Vellenia Store!
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Redirecionando para seu perfil em 3 segundos...
            </p>
            <Link
              to="/meu-perfil"
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded font-semibold hover:bg-gray-800 transition"
            >
              Ir para Perfil
            </Link>
          </div>
        )}

        {/* Aguardando */}
        {status === 'waiting' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16">
                <EnvelopeIcon className="w-16 h-16 text-blue-500" />
                <div className="absolute inset-0 animate-pulse">
                  <EnvelopeIcon className="w-16 h-16 text-blue-400 opacity-50" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold font-manrope text-gray-900 mb-3 text-center">
              Confirme seu Email
            </h1>
            <p className="text-gray-600 text-center mb-6">
              Enviamos um link de confirmação para:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded p-4 text-center mb-6">
              <p className="text-gray-800 font-semibold">{email || 'seu-email@exemplo.com'}</p>
            </div>
            <div className="space-y-4 mb-6">
              <p className="text-sm text-gray-600">
                📧 <strong>Verifique sua caixa de entrada</strong> (ou pasta de spam)
              </p>
              <p className="text-sm text-gray-600">
                🔗 <strong>Clique no link</strong> para ativar sua conta
              </p>
              <p className="text-sm text-gray-600">
                ⏱️ <strong>O link expira em 24 horas</strong>
              </p>
            </div>

            {/* Reenviar Email */}
            {resendSuccess && (
              <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
                <p className="text-green-700 text-sm font-semibold">
                  ✓ Email reenviado com sucesso!
                </p>
              </div>
            )}

            <button
              onClick={handleResendEmail}
              disabled={resendLoading}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-3 rounded font-semibold transition disabled:opacity-50"
            >
              <ArrowPathIcon className={`w-4 h-4 ${resendLoading ? 'animate-spin' : ''}`} />
              {resendLoading ? 'Enviando...' : 'Reenviar Email'}
            </button>
          </div>
        )}

        {/* Erro */}
        {status === 'error' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">❌</div>
            <h1 className="text-3xl font-bold font-manrope text-gray-900 mb-3">
              Erro na Confirmação
            </h1>
            <p className="text-gray-600 mb-6">
              Não conseguimos confirmar seu email. O link pode ter expirado.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleResendEmail}
                disabled={resendLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold transition disabled:opacity-50"
              >
                {resendLoading ? 'Enviando...' : 'Reenviar Email de Confirmação'}
              </button>
              <Link
                to="/login"
                className="block bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded font-semibold transition"
              >
                Voltar ao Login
              </Link>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-8">
          Não recebeu o email?{' '}
          <button
            onClick={handleResendEmail}
            className="text-blue-600 hover:underline font-semibold"
          >
            Clique aqui
          </button>
        </p>
      </div>
    </main>
  );
}
