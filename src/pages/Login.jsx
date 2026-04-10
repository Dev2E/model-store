import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
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
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold font-manrope mb-6 text-center">Fazer Login</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
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

            {/* Senha */}
            <div>
              <label className="block text-sm font-semibold mb-2">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800 disabled:bg-gray-100"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Erros e Sucessos */}
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-3 font-semibold hover:bg-gray-900 transition rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            {/* reCAPTCHA Notice */}
            <p className="text-xs text-gray-500 text-center">
              Este site está protegido por reCAPTCHA e a Política de Privacidade e os Termos de Serviço do Google se aplicam.
            </p>

            {/* Links */}
            <div className="space-y-3">
              <p className="text-center text-sm text-gray-600">
                Não tem conta?{' '}
                <Link to="/criar-conta" className="font-semibold text-gray-800 hover:underline">
                  Criar uma
                </Link>
              </p>
              <p className="text-center text-sm text-gray-600">
                Esqueceu a senha?{' '}
                <Link to="/recuperar-conta" className="font-semibold text-gray-800 hover:underline">
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
