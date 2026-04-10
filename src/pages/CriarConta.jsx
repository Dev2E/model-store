import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function CriarConta() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { signup, isAuthenticated } = useAuth();
  const { showNotification } = useCart();
  const navigate = useNavigate();

  // Redireciona se já está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/meu-perfil');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Remove erro quando o campo é alterado
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Nome é obrigatório';
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido';
    
    if (!formData.password) newErrors.password = 'Senha é obrigatória';
    else if (formData.password.length < 8) newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Senhas não conferem';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Você deve aceitar os termos';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { success, error } = await signup(formData.email, formData.password, formData.name);
      
      if (success) {
        showNotification('Conta criada com sucesso! Bem-vindo à Boutique!', 'success');
        // Limpa o formulário
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          acceptTerms: false,
        });
        // Redireciona para o perfil
        navigate('/meu-perfil');
      } else {
        if (error?.includes('already registered')) {
          showNotification('Este email já está cadastrado', 'error');
          setErrors({ form: 'Este email já está cadastrado' });
        } else if (error?.includes('weak password')) {
          showNotification('Senha fraca. Use uma combinação de maiúsculas, minúsculas e números', 'error');
          setErrors({ form: 'Senha fraca' });
        } else {
          showNotification(error || 'Erro ao criar conta', 'error');
          setErrors({ form: error || 'Erro ao criar conta' });
        }
      }
    } catch (err) {
      console.error('Signup error:', err);
      showNotification('Erro ao conectar ao servidor', 'error');
      setErrors({ form: 'Erro ao conectar ao servidor' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="px-6 py-12 max-w-2xl mx-auto border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-500 mb-2">CONTA</p>
        <h1 className="text-5xl font-bold font-manrope">Criar Conta</h1>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.form && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.form}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Nome Completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded focus:outline-none focus:border-gray-800 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Seu nome"
                disabled={loading}
              />
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Telefone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
                placeholder="(11) 99999-9999"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded focus:outline-none focus:border-gray-800 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="seu@email.com"
              disabled={loading}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Senha</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded focus:outline-none focus:border-gray-800 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                disabled={loading}
              />
              {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Confirmar Senha</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded focus:outline-none focus:border-gray-800 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                disabled={loading}
              />
              {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mt-1"
                disabled={loading}
              />
              <span className="text-sm text-gray-600">
                Concordo com os{' '}
                <Link to="/politicas" className="font-semibold text-gray-800 hover:underline">
                  Termos e Condições
                </Link>
                {' '}e a{' '}
                <Link to="/politicas" className="font-semibold text-gray-800 hover:underline">
                  Política de Privacidade
                </Link>
              </span>
            </label>
            {errors.acceptTerms && <p className="text-red-600 text-xs mt-2">{errors.acceptTerms}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-3 font-semibold hover:bg-gray-900 transition rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Criando Conta...' : 'Criar Minha Conta'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Já tem conta?{' '}
            <Link to="/login" className="font-semibold text-gray-800 hover:underline">
              Fazer login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
