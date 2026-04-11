import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import { ordersService, usersService } from '../services/supabaseService';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart, showNotification } = useCart();
  const { user, isAuthenticated } = useAuth();
  const notificationShownRef = useRef(false); // Flag para evitar notificações duplicadas
  const [discount, setDiscount] = useState(0);
  const [discountCode, setDiscountCode] = useState('');
  const [selectedShipping, setSelectedShipping] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: dados, 2: pagamento
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(true); // true = novo, false = existe
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    street: '',
    number: '',
    city: '',
    state: '',
    zipCode: '',
  });

  // Carregar shipping do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('selectedShipping');
    if (saved) {
      setSelectedShipping(JSON.parse(saved));
    }
  }, []);

  // Carregar endereços salvos
  useEffect(() => {
    if (user?.id) {
      loadUserAddresses();
    }
  }, [user?.id]);

  // Pré-preenchimento com dados do usuário (SEMPRE)
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        name: user.user_metadata?.name || prev.name || '',
        phone: user.user_metadata?.phone || prev.phone || ''
      }));
    }
  }, [user?.email, user?.user_metadata?.name, user?.user_metadata?.phone]);

  const loadUserAddresses = async () => {
    try {
      const { data, error } = await usersService.getUserAddresses(user.id);
      if (!error && data && data.length > 0) {
        setSavedAddresses(data);
        // Se tem endereços salvos, seleciona o primeiro por padrão
        setSelectedAddressId(data[0].id);
        setUseNewAddress(false);
        // Popula APENAS endereço (nome, email, phone já estão preenchidos acima)
        const address = data[0];
        setFormData(prev => ({
          ...prev,
          street: address.street || '',
          number: address.number || '',
          city: address.city || '',
          state: address.state || '',
          zipCode: address.zipCode || ''
        }));
      }
    } catch (err) {
      console.error('Erro ao carregar endereços:', err);
    }
  };

  const handleSelectAddress = (addressId) => {
    if (addressId === 'new') {
      setUseNewAddress(true);
      setFormData(prev => ({
        ...prev,
        street: '',
        number: '',
        city: '',
        state: '',
        zipCode: ''
      }));
    } else {
      const address = savedAddresses.find(a => a.id === addressId);
      if (address) {
        setUseNewAddress(false);
        setSelectedAddressId(addressId);
        setFormData(prev => ({
          ...prev,
          street: address.street || '',
          number: address.number || '',
          city: address.city || '',
          state: address.state || '',
          zipCode: address.zipCode || ''
        }));
      }
    }
  };

  useEffect(() => {
    // Apenas mostrar notificações uma única vez
    if (notificationShownRef.current) return;
    
    if (!isAuthenticated) {
      showNotification('Por favor, faça login para continuar', 'error');
      notificationShownRef.current = true;
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      showNotification('Carrinho vazio', 'error');
      notificationShownRef.current = true;
      navigate('/carrinho');
      return;
    }
  }, [isAuthenticated, cartItems.length, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;

    // Formatar telefone: (XX) XXXXX-XXXX
    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 11) {
        if (cleaned.length <= 2) {
          formattedValue = cleaned ? `(${cleaned}` : '';
        } else if (cleaned.length <= 7) {
          formattedValue = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        } else {
          formattedValue = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
        }
      } else {
        return; // Bloqueia digitar mais de 11 números
      }
    }

    // Formatar CEP: XXXXX-XXX
    if (name === 'zipCode') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 8) {
        if (cleaned.length <= 5) {
          formattedValue = cleaned;
        } else {
          formattedValue = `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
        }
      } else {
        return; // Bloqueia digitar mais de 8 números
      }
    }

    // Formatar CPF: XXX.XXX.XXX-XX
    if (name === 'cpf') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 11) {
        if (cleaned.length <= 3) {
          formattedValue = cleaned;
        } else if (cleaned.length <= 6) {
          formattedValue = `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
        } else if (cleaned.length <= 9) {
          formattedValue = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
        } else {
          formattedValue = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
        }
      } else {
        return; // Bloqueia digitar mais de 11 números
      }
    }

    // Nome: bloqueia números
    if (name === 'name') {
      if (/\d/.test(value)) {
        return; // Bloqueia números
      }
      formattedValue = value;
    }

    // Cidade: bloqueia números
    if (name === 'city') {
      if (/\d/.test(value)) {
        return; // Bloqueia números
      }
      formattedValue = value;
    }

    // Email: bloqueia caracteres inválidos
    if (name === 'email') {
      const validChars = /^[a-zA-Z0-9._@\-]*$/;
      if (!validChars.test(value)) {
        return; // Bloqueia caracteres inválidos
      }
      formattedValue = value;
    }

    // Número: bloqueia se vazio (requer números)
    if (name === 'number') {
      if (value && !/\d/.test(value.substring(0, value.length))) {
        return; // Bloqueia se não tiver números
      }
      formattedValue = value;
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    
    // Aplicar o mesmo tratamento que onChange
    const syntheticEvent = {
      target: {
        name: e.currentTarget.name,
        value: pastedText
      }
    };
    handleInputChange(syntheticEvent);
  };

  // Função para validar campo individual e retornar classe CSS
  const getInputClass = (fieldName) => {
    const baseClass = 'w-full px-4 py-3 border rounded focus:outline-none transition';
    
    if (!formData[fieldName]) return baseClass + ' border-gray-300 focus:border-gray-800';

    let isValid = true;

    switch(fieldName) {
      case 'email':
        isValid = formData.email.includes('@') && formData.email.includes('.');
        break;
      case 'phone':
        const phoneClean = formData.phone.replace(/\D/g, '');
        isValid = phoneClean.length === 11;
        break;
      case 'name':
        isValid = formData.name.trim().length > 0 && !/\d/.test(formData.name);
        break;
      case 'number':
        isValid = /\d/.test(formData.number);
        break;
      case 'city':
        isValid = formData.city.trim().length > 0 && !/\d/.test(formData.city);
        break;
      case 'street':
        isValid = formData.street.trim().length > 0;
        break;
      case 'state':
        isValid = formData.state.trim().length > 0;
        break;
      case 'zipCode':
        const cepClean = formData.zipCode.replace(/\D/g, '');
        isValid = cepClean.length === 8;
        break;
      case 'cpf':
        const cpfClean = formData.cpf.replace(/\D/g, '');
        isValid = cpfClean.length === 11;
        break;
      default:
        isValid = true;
    }

    return isValid 
      ? baseClass + ' border-green-500 bg-green-50 focus:border-green-600'
      : baseClass + ' border-gray-300 focus:border-gray-800';
  };

  const validateStep1 = () => {
    const required = ['name', 'email', 'phone', 'cpf', 'street', 'number', 'city', 'state', 'zipCode'];
    
    for (let field of required) {
      if (!formData[field]) {
        showNotification(`Campo obrigatório: ${field}`, 'error');
        return false;
      }
    }

    // Validar que email tem @ e ponto
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      showNotification('Email inválido', 'error');
      return false;
    }

    // Validar que CPF tem 11 dígitos
    const cpfClean = formData.cpf.replace(/\D/g, '');
    if (cpfClean.length < 11) {
      showNotification('CPF deve ter 11 dígitos', 'error');
      return false;
    }

    // Validar que CEP tem pelo menos 8 dígitos
    const cepClean = formData.zipCode.replace(/\D/g, '');
    if (cepClean.length < 8) {
      showNotification('CEP deve ter 8 dígitos', 'error');
      return false;
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
          cpf: formData.cpf,
          street: formData.street,
          number: formData.number,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
      };

      const { data: order, error } = await ordersService.createOrder(user.id, orderData);

      if (error) {
        const errorMsg = typeof error === 'string' ? error : (error?.message || 'Erro desconhecido');
        showNotification('Erro ao criar pedido: ' + errorMsg, 'error');
        return;
      }

      // Validar que temos o ID do pedido
      if (!order?.id) {
        showNotification('Erro: Pedido não foi criado corretamente', 'error');
        return;
      }

      // Chamar Edge Function do Supabase para criar preferência
      const paymentPayload = {
        items: cartItems.map(item => ({
          id: item.id.toString(),
          name: item.name,
          size: item.size || 'Único',
          color: item.color || 'Padrão',
          price: typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0),
          quantity: typeof item.quantity === 'string' ? parseInt(item.quantity) : (item.quantity || 1),
        })),
        payer: formData,
        orderId: order.id,
        shipping: shipping,
        discount: discount,
        total: total,
      };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/criar-pagamento`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentPayload),
        }
      );

      let preferenceData;
      try {
        preferenceData = await response.json();
      } catch (parseError) {
        const responseText = await response.text();
        showNotification('Erro ao processar resposta do servidor', 'error');
        return;
      }

      if (!response.ok) {
        const errorMsg = preferenceData?.error || 'Erro ao criar preferência';
        const errorDetails = preferenceData?.details || preferenceData?.received || preferenceData?.message || '';
        showNotification('Erro: ' + errorMsg + (errorDetails ? ' - ' + String(errorDetails).substring(0, 100) : ''), 'error');
        return;
      }

      if (!preferenceData.preferenceId || !preferenceData.initPoint) {
        showNotification('Erro: Resposta inválida do servidor de pagamento', 'error');
        return;
      }

      const { preferenceId, initPoint } = preferenceData;

      // Salvar dados para redirecionar
      localStorage.setItem('mpPreferenceId', preferenceId);
      localStorage.setItem('mpInitPoint', initPoint);
      localStorage.setItem('currentOrderId', order?.id);

      setStep(2);
      showNotification('Avançando para pagamento...', 'success');
    } catch (err) {
      showNotification('Erro ao processar checkout', 'error');
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
  const shipping = selectedShipping ? parseFloat(selectedShipping.preco_final || selectedShipping.preco_ajustado || 0) : 0;
  const tax = Math.round((subtotal - discount) * 0.1 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax - discount) * 100) / 100;

  const handleApplyCoupon = () => {
    const discounts = { DESCONTO10: subtotal * 0.1, DESCONTO20: subtotal * 0.2 };
    const amount = discounts[discountCode.toUpperCase()] || 0;
    if (amount > 0) {
      setDiscount(amount);
      showNotification(`Cupom aplicado! Desconto: ${formatCurrency(amount)}`, 'success');
      setDiscountCode('');
    } else if (discountCode) {
      showNotification('Cupom inválido', 'error');
    }
  };
  return (
    <main className="min-h-screen bg-white">
      <section className="px-4 sm:px-6 py-8 sm:py-12 max-w-4xl mx-auto border-b border-gray-200">
        <p className="text-xs sm:text-sm font-semibold text-gray-500 mb-2">COMPRA</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-manrope">Finalizar Compra</h1>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Step Tabs - Navegável */}
        <div className="mb-8 sm:mb-12">
          <div className="flex gap-4 sm:gap-8 border-b-2 border-gray-200 overflow-x-auto">
            <button
              onClick={() => setStep(1)}
              className={`pb-4 transition relative font-semibold tracking-wide text-xs sm:text-base flex-shrink-0 ${
                step === 1
                  ? 'text-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full font-bold text-xs sm:text-sm transition ${
                  step === 1 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </span>
                <span className="hidden sm:inline">Entrega</span>
              </div>
              {step === 1 && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900"></div>
              )}
            </button>
            <button
              onClick={() => step === 2 && setStep(1)}
              className={`pb-4 transition relative font-semibold tracking-wide text-xs sm:text-base flex-shrink-0 ${
                step === 2
                  ? 'text-gray-900'
                  : 'text-gray-400 cursor-default'
              }`}
              disabled={step !== 2}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full font-bold text-xs sm:text-sm transition ${
                  step === 2 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </span>
                <span className="hidden sm:inline">Pagamento</span>
              </div>
              {step === 2 && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900"></div>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {/* Formulário / Pagamento */}
          <div>
            {step === 1 ? (
              <>
                <h2 className="text-xl sm:text-2xl font-bold font-manrope mb-4 sm:mb-6">Dados de Entrega</h2>
                
                <form onSubmit={handleStep1Submit} className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-2">Nome *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onPaste={handlePaste}
                        className={getInputClass('name')}
                        placeholder="João Silva"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-2">Telefone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onPaste={handlePaste}
                        className={getInputClass('phone')}
                        placeholder="(11) 9999-9999"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onPaste={handlePaste}
                      className={getInputClass('email')}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2">CPF *</label>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      onPaste={handlePaste}
                      className={getInputClass('cpf')}
                      placeholder="123.456.789-00"
                      required
                    />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Endereço</h3>

                  {savedAddresses.length > 0 && (
                    <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
                      <p className="text-sm font-semibold mb-3">Selecione um endereço salvo ou adicione um novo:</p>
                      <div className="space-y-2">
                        {savedAddresses.map(address => (
                          <label key={address.id} className="flex items-center p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name="addressSelect"
                              value={address.id}
                              checked={selectedAddressId === address.id && !useNewAddress}
                              onChange={() => handleSelectAddress(address.id)}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="ml-3 text-sm">
                              {address.street}, {address.number} - {address.city}, {address.state}
                            </span>
                          </label>
                        ))}
                        <label className="flex items-center p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="addressSelect"
                            value="new"
                            checked={useNewAddress}
                            onChange={() => handleSelectAddress('new')}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="ml-3 text-sm font-semibold">Adicionar novo endereço</span>
                        </label>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2">Rua *</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      onPaste={handlePaste}
                      className={getInputClass('street')}
                      placeholder="Rua das Flores"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-2">Número *</label>
                      <input
                        type="text"
                        name="number"
                        value={formData.number}
                        onChange={handleInputChange}
                        onPaste={handlePaste}
                        className={getInputClass('number')}
                        placeholder="123"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-2">CEP *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        onPaste={handlePaste}
                        className={getInputClass('zipCode')}
                        placeholder="12345-678"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-2">Cidade *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        onPaste={handlePaste}
                        className={getInputClass('city')}
                        placeholder="São Paulo"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-2">Estado *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        onPaste={handlePaste}
                        maxLength="2"
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800 text-sm"
                        placeholder="SP"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-800 text-white py-3 rounded font-semibold hover:bg-gray-900 transition disabled:opacity-50 mt-4 sm:mt-6 text-sm sm:text-base"
                  >
                    {loading ? '⏳ Processando...' : 'Avançar para Pagamento'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-xl sm:text-2xl font-bold font-manrope mb-4 sm:mb-6">Pagamento</h2>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <p className="text-blue-800 text-xs sm:text-sm">
                    💳 Você será redirecionado para o Mercado Pago para completar o pagamento de forma segura.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                  <h3 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Resumo do Pedido</h3>
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.color}-${item.size}`} className="flex justify-between text-xs sm:text-sm mb-2">
                      <span>{item.name} x {item.quantity}</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 mt-3 sm:mt-4 pt-3 sm:pt-4 flex justify-between font-bold text-sm sm:text-base">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-sm sm:text-base"
                  >
                    {loading ? '⏳ Processando...' : '💳 Ir para Mercado Pago'}
                  </button>
                  <button
                    onClick={() => setStep(1)}
                    className="w-full bg-gray-100 text-gray-800 py-3 rounded font-semibold hover:bg-gray-200 transition text-sm sm:text-base"
                  >
                    Voltar
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Resumo do Pedido */}
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 lg:sticky lg:top-4 lg:h-fit">
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Resumo</h3>
            
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 max-h-96 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.color}-${item.size}`} className="flex justify-between text-xs sm:text-sm py-2 border-b border-gray-200">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-600 text-xs">
                      {item.color && `${item.color} • `}
                      {item.size && `${item.size} • `}
                      Qtd: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            {/* Cupom */}
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white rounded border border-gray-200">
              <label className="block text-xs sm:text-sm font-semibold mb-2">Cupom de Desconto</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  placeholder="Ex: DESCONTO10"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:border-gray-800"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-gray-800 text-white rounded text-xs sm:text-sm font-semibold hover:bg-gray-900 transition"
                >
                  Aplicar
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">Cupons disponíveis: DESCONTO10 (10%), DESCONTO20 (20%)</p>
            </div>

            <div className="space-y-2 sm:space-y-3 border-t border-gray-200 pt-3 sm:pt-4">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Frete</span>
                <span>{selectedShipping ? formatCurrency(shipping) : 'A calcular'}</span>
              </div>
              {selectedShipping && (
                <p className="text-xs text-gray-600">
                  {selectedShipping.nome} - {selectedShipping.tempo_entrega_ajustado} dias
                </p>
              )}
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Impostos (10%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 text-xs sm:text-sm">
                  <span>Desconto</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 mt-3 sm:mt-4 pt-3 sm:pt-4 flex justify-between font-bold text-base sm:text-lg">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
