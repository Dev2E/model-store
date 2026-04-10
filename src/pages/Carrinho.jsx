
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import shippingService from '../services/shippingService';

export default function Carrinho() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, showNotification } = useCart();
  const [showConfirmModal, setShowConfirmModal] = useState(null);
  const [cep, setCep] = useState('');
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [shippingError, setShippingError] = useState(null);
  const [addressInfo, setAddressInfo] = useState(null);

  const subtotal = cartTotal;
  const shipping = selectedShipping ? parseFloat(selectedShipping.preco_final) : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleRemoveClick = (item) => {
    setShowConfirmModal(item);
  };

  const confirmRemove = () => {
    if (showConfirmModal) {
      removeFromCart(showConfirmModal.id, showConfirmModal.color, showConfirmModal.size);
      setShowConfirmModal(null);
    }
  };

  const calculateShipping = async (e) => {
    e.preventDefault();
    
    if (!cep || cep.length < 8) {
      setShippingError('Digite um CEP válido');
      return;
    }

    setLoadingShipping(true);
    setShippingError(null);

    try {
      const { data: metodos, address, error } = await shippingService.calcularFrete(cep, 1);
      
      if (error) {
        setShippingError(error);
        setShippingMethods([]);
      } else {
        setShippingMethods(metodos || []);
        setAddressInfo(address);
        if (metodos && metodos.length > 0) {
          setSelectedShipping(metodos[0]);
          showNotification(`Frete calculado para ${address?.cidade}, ${address?.estado}`, 'success');
        }
      }
    } catch (err) {
      console.error('Erro ao calcular frete:', err);
      setShippingError('Erro ao calcular frete. Tente novamente.');
    } finally {
      setLoadingShipping(false);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showNotification('Carrinho vazio!', 'error');
      return;
    }
    if (!selectedShipping) {
      showNotification('Selecione um método de frete!', 'error');
      return;
    }
    showNotification('Redirecionando para pagamento...', 'info');
  };

  return (
    <>
      {cartItems.length === 0 ? (
        <main className="min-h-screen bg-white">
          <section className="px-6 py-12 max-w-4xl mx-auto border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-500 mb-2">COMPRAS</p>
            <h1 className="text-5xl font-bold font-manrope">Carrinho Vazio</h1>
          </section>
          <div className="max-w-4xl mx-auto px-6 py-12 text-center">
            <p className="text-6xl mb-4">🛒</p>
            <p className="text-gray-600 mb-6">Seu carrinho está vazio. Explore nossa coleção!</p>
            <Link
              to="/produtos"
              className="inline-block bg-gray-800 text-white px-8 py-3 rounded font-semibold hover:bg-gray-900 transition"
            >
              Ver Produtos
            </Link>
          </div>
        </main>
      ) : (
        <main className="min-h-screen bg-white">
          <section className="px-6 py-12 max-w-6xl mx-auto border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-500 mb-2">COMPRAS</p>
            <h1 className="text-5xl font-bold font-manrope">Carrinho</h1>
          </section>

          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.color}-${item.size}`} className="border border-gray-200 rounded-lg p-6 flex gap-6 hover:shadow-lg transition">
                      <div className="text-6xl flex-shrink-0">{item.image || '📦'}</div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-3">{item.category}</p>
                        
                        <div className="flex items-center gap-4 mb-4">
                          <div>
                            {item.color && <p className="text-sm"><span className="text-gray-600">Cor:</span> {item.color}</p>}
                            {item.size && <p className="text-sm"><span className="text-gray-600">Tamanho:</span> {item.size}</p>}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.color, item.size)}
                              className="px-3 py-1 hover:bg-gray-200 transition rounded"
                            >
                              −
                            </button>
                            <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.color, item.size)}
                              className="px-3 py-1 hover:bg-gray-200 transition rounded"
                            >
                              +
                            </button>
                          </div>
                          <p className="font-bold text-lg">R$ {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveClick(item)}
                        className="flex-shrink-0 text-red-600 hover:text-red-800 transition p-2"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-4 space-y-6">
                  {/* Cálculo de Frete */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="font-bold text-lg mb-4">📮 Calcular Frete</h3>
                    
                    <form onSubmit={calculateShipping} className="space-y-3">
                      <input
                        type="text"
                        placeholder="Digite seu CEP"
                        value={cep}
                        onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                        maxLength="8"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gray-800 outline-none text-sm"
                      />
                      <button
                        type="submit"
                        disabled={loadingShipping}
                        className="w-full bg-gray-800 text-white py-2 rounded font-semibold hover:bg-gray-900 transition disabled:opacity-50"
                      >
                        {loadingShipping ? '⏳ Calculando...' : '🔍 Calcular'}
                      </button>
                    </form>

                    {shippingError && (
                      <p className="text-xs text-red-600 bg-red-50 p-2 rounded mt-2">
                        ❌ {shippingError}
                      </p>
                    )}

                    {addressInfo && (
                      <p className="text-xs text-gray-600 mt-2">
                        📍 {addressInfo.rua}, {addressInfo.bairro} - {addressInfo.cidade}, {addressInfo.estado}
                      </p>
                    )}

                    {shippingMethods.length > 0 && (
                      <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                        {shippingMethods.map((metodo) => (
                          <label key={metodo.id} className="flex items-center gap-2 p-2 border border-gray-200 rounded cursor-pointer hover:bg-white transition">
                            <input
                              type="radio"
                              name="shipping"
                              checked={selectedShipping?.id === metodo.id}
                              onChange={() => setSelectedShipping(metodo)}
                              className="w-4 h-4"
                            />
                            <div className="flex-1 text-sm">
                              <p className="font-semibold">{metodo.nome}</p>
                              <p className="text-gray-600 text-xs">{metodo.tempo_entrega_ajustado} dias úteis</p>
                            </div>
                            <p className="font-bold">R$ {metodo.preco_final.toFixed(2)}</p>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Resumo do Pedido */}
                  <div className="pt-4">
                    <h3 className="font-bold text-lg mb-4">Resumo do Pedido</h3>
                    
                    <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span>R$ {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Frete</span>
                        <span className={selectedShipping && shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                          {selectedShipping ? `R$ ${shipping.toFixed(2)}` : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Impostos</span>
                        <span>R$ {tax.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between font-bold text-lg mb-6">
                      <span>Total</span>
                      <span>R$ {total.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={!selectedShipping}
                      className="w-full bg-gray-800 text-white py-3 rounded font-semibold hover:bg-gray-900 transition mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Finalizar Compra
                    </button>

                    <Link
                      to="/produtos"
                      className="block text-center text-gray-600 hover:text-gray-800 transition py-2 text-sm"
                    >
                      Continuar Comprando
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full animate-in fade-in zoom-in duration-300">
            <h3 className="font-bold text-lg mb-4">Remover Produto?</h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja remover <span className="font-semibold">{showConfirmModal.name}</span> do carrinho?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded font-semibold hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmRemove}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
