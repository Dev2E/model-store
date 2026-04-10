import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/supabaseService';

export default function RecuperarConta() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Por favor, insira seu email');
      return;
    }

    setLoading(true);
    try {
      const { error: sendError } = await authService.sendPasswordResetCode(email);
      if (sendError) {
        setError(sendError);
      } else {
        setSuccess('Código de recuperação enviado para seu email! (Válido por 15 minutos)');
        setStep(2);
      }
    } catch (err) {
      setError('Erro ao enviar código. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    setError('');

    if (!code) {
      setError('Por favor, insira o código');
      return;
    }
    if (code.length !== 6) {
      setError('Código deve ter 6 dígitos');
      return;
    }

    setSuccess('Código verificado com sucesso!');
    setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPassword || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    if (newPassword.length < 8) {
      setError('Senha deve ter pelo menos 8 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Senhas não conferem');
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await authService.resetPasswordWithCode(
        email,
        code,
        newPassword
      );
      if (resetError) {
        setError(resetError);
      } else {
        setSuccess('Senha redefinida com sucesso! Redirecionando para login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError('Erro ao redefinir senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="px-6 py-12 max-w-2xl mx-auto border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-500 mb-2">CONTA</p>
        <h1 className="text-5xl font-bold font-manrope">Recuperar Senha</h1>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Steps Indicator */}
        <div className="flex justify-between mb-12">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className={`flex items-center gap-3 ${step >= 1 ? 'text-gray-800' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="font-semibold">Email</span>
            </div>
          </div>

          <div className={`flex flex-1 items-center mx-4 ${step >= 2 ? 'border-t-2 border-gray-800' : 'border-t-2 border-gray-200'}`}></div>

          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className={`flex items-center gap-3 ${step >= 2 ? 'text-gray-800' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="font-semibold">Código</span>
            </div>
          </div>

          <div className={`flex flex-1 items-center mx-4 ${step >= 3 ? 'border-t-2 border-gray-800' : 'border-t-2 border-gray-200'}`}></div>

          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className={`flex items-center gap-3 ${step >= 3 ? 'text-gray-800' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="font-semibold">Senha</span>
            </div>
          </div>
        </div>

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="max-w-md mx-auto space-y-6">
            <div>
              <p className="text-gray-600 mb-4">Insira o email associado à sua conta e lhe enviaremos um código para redefinir sua senha.</p>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800 disabled:bg-gray-100"
                placeholder="seu@email.com"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-3 font-semibold hover:bg-gray-900 transition rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar Código'}
            </button>

            <p className="text-center text-sm text-gray-600">
              Lembrou a senha?{' '}
              <Link to="/login" className="font-semibold text-gray-800 hover:underline">
                Fazer login
              </Link>
            </p>
          </form>
        )}

        {/* Step 2: Code */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="max-w-md mx-auto space-y-6">
            <div>
              <p className="text-gray-600 mb-4">Você receberá um código de 6 dígitos no seu email. Insira-o abaixo.</p>
              <label className="block text-sm font-semibold mb-2">Código de Recuperação</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={6}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800 text-center text-2xl tracking-widest disabled:bg-gray-100"
                placeholder="000000"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-3 font-semibold hover:bg-gray-900 transition rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Verificando...' : 'Verificar Código'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setError('');
                setSuccess('');
              }}
              disabled={loading}
              className="w-full bg-gray-100 text-gray-800 py-3 font-semibold hover:bg-gray-200 transition rounded-lg disabled:bg-gray-100 disabled:text-gray-400"
            >
              Alterar Email
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="max-w-md mx-auto space-y-6">
            <div>
              <p className="text-gray-600 mb-4">Defina uma nova senha para sua conta.</p>
              
              <label className="block text-sm font-semibold mb-2">Nova Senha</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800 mb-4 disabled:bg-gray-100"
                placeholder="••••••••"
              />

              <label className="block text-sm font-semibold mb-2">Confirmar Senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800 disabled:bg-gray-100"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-3 font-semibold hover:bg-gray-900 transition rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
