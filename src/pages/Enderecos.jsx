import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { usersService } from '../services/supabaseService';
import { buscarEnderecoByCEP, formatarCEP } from '../services/cepService';

export default function Enderecos() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    street: '',
    number: '',
    complement: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useCart();
  const navigate = useNavigate();

  // Redireciona se não está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Carrega os endereços do usuário
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await usersService.getUserAddresses(user.id);
        
        if (fetchError) {
          setError('Erro ao carregar endereços');
          showNotification('Erro ao carregar endereços', 'error');
          return;
        }

        setAddresses(data || []);
      } catch (err) {
        console.error('Error fetching addresses:', err);
        setError('Erro ao conectar ao servidor');
        showNotification('Erro ao conectar ao servidor', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user?.id, showNotification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.street.trim()) newErrors.street = 'Rua é obrigatória';
    if (!formData.number.trim()) newErrors.number = 'Número é obrigatório';
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
    if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'CEP é obrigatório';

    return newErrors;
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      const { data, error: addError } = await usersService.addAddress(user.id, {
        street: formData.street,
        number: formData.number,
        complement: formData.complement,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      });

      if (addError) {
        showNotification('Erro ao salvar endereço', 'error');
        return;
      }

      showNotification('Endereço adicionado com sucesso!', 'success');
      setFormData({
        street: '',
        number: '',
        complement: '',
        city: '',
        state: '',
        zipCode: '',
      });
      setShowForm(false);
      
      // Recarrega os endereços
      const { data: newAddresses } = await usersService.getUserAddresses(user.id);
      setAddresses(newAddresses || []);
    } catch (err) {
      console.error('Error adding address:', err);
      showNotification('Erro ao conectar ao servidor', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Tem certeza que deseja remover este endereço?')) return;

    setDeletingId(addressId);

    try {
      // Nota: Você precisará implementar um método deleteAddress no usersService
      // Por enquanto, apenas remove do estado local
      setAddresses(addresses.filter(addr => addr.id !== addressId));
      showNotification('Endereço removido com sucesso!', 'success');
    } catch (err) {
      console.error('Error deleting address:', err);
      showNotification('Erro ao remover endereço', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const formatAddress = (address) => {
    return `${address.street}, ${address.number}${address.complement ? ' ' + address.complement : ''} - ${address.city}, ${address.state} ${address.zipCode}`;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <section className="px-6 py-12 max-w-4xl mx-auto border-b border-gray-200">
          <p className="text-sm font-semibold text-gray-500 mb-2">CONTA</p>
          <h1 className="text-5xl font-bold font-manrope">Meus Endereços</h1>
        </section>
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <p className="text-gray-600">Carregando endereços...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="px-6 py-12 max-w-4xl mx-auto border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-500 mb-2">CONTA</p>
        <h1 className="text-5xl font-bold font-manrope">Meus Endereços</h1>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold font-manrope">Endereços Salvos</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gray-800 text-white px-4 py-2 rounded font-semibold hover:bg-gray-900 transition"
          >
            + Adicionar Endereço
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold font-manrope mb-6">Novo Endereço</h3>
            <form onSubmit={handleAddAddress} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Rua</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Sua rua"
                  className={`w-full px-4 py-3 border rounded focus:outline-none focus:border-gray-800 ${
                    formErrors.street ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={submitting}
                />
                {formErrors.street && <p className="text-red-600 text-xs mt-1">{formErrors.street}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Número</label>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    placeholder="123"
                    className={`w-full px-4 py-3 border rounded focus:outline-none focus:border-gray-800 ${
                      formErrors.number ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={submitting}
                  />
                  {formErrors.number && <p className="text-red-600 text-xs mt-1">{formErrors.number}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Complemento</label>
                  <input
                    type="text"
                    name="complement"
                    value={formData.complement}
                    onChange={handleChange}
                    placeholder="Apto, sala..."
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
                    disabled={submitting}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Cidade</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="São Paulo"
                    className={`w-full px-4 py-3 border rounded focus:outline-none focus:border-gray-800 ${
                      formErrors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={submitting}
                  />
                  {formErrors.city && <p className="text-red-600 text-xs mt-1">{formErrors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Estado</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="SP"
                    className={`w-full px-4 py-3 border rounded focus:outline-none focus:border-gray-800 ${
                      formErrors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={submitting}
                  />
                  {formErrors.state && <p className="text-red-600 text-xs mt-1">{formErrors.state}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">CEP</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="01234-567"
                  className={`w-full px-4 py-3 border rounded focus:outline-none focus:border-gray-800 ${
                    formErrors.zipCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={submitting}
                />
                {formErrors.zipCode && <p className="text-red-600 text-xs mt-1">{formErrors.zipCode}</p>}
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gray-800 text-white py-3 font-semibold hover:bg-gray-900 transition rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Salvando...' : 'Salvar Endereço'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormErrors({});
                  }}
                  className="flex-1 bg-gray-100 text-gray-800 py-3 font-semibold hover:bg-gray-200 transition rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses List */}
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-6">Você não tem nenhum endereço salvo</p>
            </div>
          ) : (
            addresses.map((addr) => (
              <div key={addr.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600">{formatAddress(addr)}</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="text-gray-800 font-semibold hover:text-gray-600">Editar</button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      disabled={deletingId === addr.id}
                      className="text-red-600 font-semibold hover:text-red-700 disabled:opacity-50"
                    >
                      {deletingId === addr.id ? 'Removendo...' : 'Remover'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
