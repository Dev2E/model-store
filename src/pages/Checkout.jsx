import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersService } from '../services/supabaseService';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart, showNotification } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: dados, 2: pagamento
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    number: '',
    city: '',
    state: '',
    zipCode: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      showNotification('Por favor, faça login para continuar', 'error');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      showNotification('Carrinho vazio', 'error');
      navigate('/carrinho');
      return;
    }

    // Pré-preenchimento
    if (user?.email) {
      setFormData(prev => ({ 
        ...prev, 
        email: user.email,
        name: user.user_metadata?.name || '',
        phone: user.user_metadata?.phone || ''
      }));
    }
  }, [isAuthenticated, cartItems.length, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    const required = ['name', 'email', 'phone', 'street', 'number', 'city', 'state', 'zipCode'];
    for (let field of required) {
      if (!formData[field]) {
        showNotification(`Campo ${field} é obrigatório`, 'error');
        return false;
      }
    }
    return true;
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    
    if (!validateStep1()) return;

    setLoading(true);

    try {
      // Criar pedido no Supabase
      const orderData = {
        items: cartItems,
        total: cartTotal,
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          street: formData.street,
          number: formData.number,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
      };

      const { data: order, error } = await ordersService.createOrder(user.id, orderData);

      if (error) {
        showNotification('Erro ao criar pedido: ' + error.message, 'error');
        return;
      }

      // Chamar Edge Function do Supabase para criar preferência
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/criar-pagamento`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            items: cartItems.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
            payer: formData,
            orderId: order?.id,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        showNotification('Erro ao criar preferência: ' + error.error, 'error');
        return;
      }

      const { preferenceId, initPoint } = await response.json();

      // Salvar dados para redirecionar
      localStorage.setItem('mpPreferenceId', preferenceId);
      localStorage.setItem('mpInitPoint', initPoint);
      localStorage.setItem('currentOrderId', order?.id);

      setStep(2);
      showNotification('Avançando para pagamento...', 'success');
    } catch (err) {
      console.error('Erro:', err);
      showNotification('Erro ao processar: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      const initPoint = localStorage.getItem('mpInitPoint');
      
      if (!initPoint) {
        showNotification('Preferência não encontrada. Volte ao passo anterior.', 'error');
        return;
      }

      // Redirecionar para Mercado Pago
      window.location.href = initPoint;
    } catch (err) {
      console.error('Erro ao processar pagamento:', err);
      showNotification('Erro ao processar pagamento', 'error');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartTotal;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  return (
    <main className="min-h-screen bg-white">
      <section className="px-6 py-12 max-w-4xl mx-auto border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-500 mb-2">COMPRA</p>
        <h1 className="text-5xl font-bold font-manrope">Finalizar Compra</h1>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Indicator */}
        <div className="flex gap-4 mb-8">
          <div className={`flex-1 h-1 rounded ${step >= 1 ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
          <div className={`flex-1 h-1 rounded ${step >= 2 ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulário / Pagamento */}
          <div>
            {step === 1 ? (
              <>
                <h2 className="text-2xl font-bold font-manrope mb-6">Dados de Entrega</h2>
                
                <form onSubmit={handleStep1Submit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Nome *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Telefone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
                      required
                    />
                  </div>

                  <h3 className="text-lg font-bold mt-8 mb-4">Endereço</h3>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Rua *</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Número *</label>
                      <input
                        type="text"
                        name="number"
                        value={formData.number}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">CEP *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        maxLength="8"
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Cidade *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Estado *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        maxLength="2"
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
                        placeholder="SP"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-800 text-white py-3 rounded font-semibold hover:bg-gray-900 transition disabled:opacity-50 mt-6"
                  >
                    {loading ? '⏳ Processando...' : 'Avançar para Pagamento'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold font-manrope mb-6">Pagamento</h2>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 text-sm">
                    💳 Você será redirecionado para o Mercado Pago para completar o pagamento de forma segura.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 mb-6">
                  <h3 className="font-bold mb-4">Resumo do Pedido</h3>
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.color}-${item.size}`} className="flex justify-between text-sm mb-2">
                      <span>{item.name} x {item.quantity}</span>
                      <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? '⏳ Processando...' : '💳 Ir para Mercado Pago'}
                  </button>
                  <button
                    onClick={() => setStep(1)}
                    className="w-full bg-gray-100 text-gray-800 py-3 rounded font-semibold hover:bg-gray-200 transition"
                  >
                    Voltar
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Resumo do Pedido */}
          <div className="bg-gray-50 rounded-lg p-6 sticky top-4 h-fit">
            <h3 className="font-bold text-lg mb-4">Resumo</h3>
            
            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.color}-${item.size}`} className="flex justify-between text-sm py-2 border-b border-gray-200">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-600 text-xs">
                      {item.color && `${item.color} • `}
                      {item.size && `${item.size} • `}
                      Qtd: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Impostos (10%)</span>
                <span>R$ {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Frete</span>
                <span>A calcular no carrinho</span>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
