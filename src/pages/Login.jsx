import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { persistCartAfterLogin } = useCart();
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validações
    if (!email || !password) {
      setError('Email e senha são obrigatórios');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      // Verificar reCAPTCHA
      const token = await executeRecaptcha('login');
      
      if (!token) {
        setError('Falha na verificação do reCAPTCHA. Tente novamente.');
        setLoading(false);
        return;
      }

      // Login
      const result = await login(email, password);
      
      if (result.error) {
        setError(result.error);
      } else {
        // Persistir carrinho após login bem-sucedido
        persistCartAfterLogin();
        setSuccess('Login realizado! Redirecionando para home...');
        setError('');
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 font-manrope">Acesso</h1>
            <p className="text-gray-600 text-sm mt-2">Entre com sua conta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
                placeholder="seu@email.com"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-100 text-gray-900 placeholder-gray-500 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Erros e Sucessos */}
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">{success}</div>}

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-2.5 font-semibold hover:bg-gray-800 transition rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>

            {/* reCAPTCHA Notice */}
            <p className="text-xs text-gray-500 text-center">
              Este site está protegido por reCAPTCHA e a Política de Privacidade e os Termos de Serviço do Google se aplicam.
            </p>

            {/* Links */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Não tem conta?{' '}
                <Link to="/criar-conta" className="font-semibold text-gray-900 hover:text-gray-700">
                  Criar uma
                </Link>
              </p>
              <p className="text-center text-sm text-gray-600">
                Esqueceu a senha?{' '}
                <Link to="/recuperar-conta" className="font-semibold text-gray-900 hover:text-gray-700">
                  Recuperar acesso
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
