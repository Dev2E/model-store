import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { adminService } from '../services/supabaseService';
import { formatCurrency } from '../utils/formatters';

export default function PedidoConfirmado() {
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  const paymentId = searchParams.get('payment_id');
  const externalRef = searchParams.get('external_reference');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Consultar status do pagamento via Edge Function
        if (paymentId) {
          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/consultar-pagamento?payment_id=${paymentId}`,
            {
              headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setPaymentData(data);
          }
        }

        // Buscar dados do pedido
        const { data: orders } = await adminService.getAllOrders();
        const order = orders?.find(o => o.id === externalRef);
        
        if (order) {
          setOrderData(order);
        }
      } catch (error) {
        console.error('Erro ao buscar pedido:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [paymentId, externalRef]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Cabeçalho Decorativo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>

      {/* Header com Animação */}
      <section className="px-6 py-16 max-w-5xl mx-auto text-center">
        <div className="mb-6 text-6xl animate-bounce">✅</div>
        <h1 className="text-6xl font-bold font-manrope text-gray-900 mb-4">
          Pedido Confirmado!
        </h1>
        <p className="text-xl text-gray-600">
          Sua compra foi processada com sucesso. Você receberá um email de confirmação em instantes.
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-600">Processando pedido...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Confirmação Premium */}
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-8 text-white shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl">
                  💳
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Pagamento Aprovado com Sucesso! 🎉</h2>
                  <p className="text-green-100">Status: Confirmado e processando</p>
                </div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <p className="text-sm text-green-50">
                  Seu pagamento foi autorizado e validado. Sua compra está sendo preparada para envio.
                </p>
              </div>
            </div>

            {/* Grid de Informações */}
            {orderData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dados do Pedido */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-xl font-bold font-manrope mb-6 flex items-center gap-2">
                    <span>📋</span> Detalhes do Pedido
                  </h3>
                  
                  <div className="space-y-5">
                    <div className="border-b border-gray-200 pb-4">
                      <p className="text-sm text-gray-600 mb-1">Número do Pedido</p>
                      <p className="text-2xl font-bold font-manrope text-gray-900">
                        #{orderData.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Data</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(orderData.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Hora</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(orderData.created_at).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold text-sm">
                        ✓ Confirmado
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dados de Pagamento */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-xl font-bold font-manrope mb-6 flex items-center gap-2">
                    <span>💰</span> Informações de Pagamento
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Valor Total</p>
                      <p className="text-3xl font-bold text-green-600">
                        {formatCurrency(orderData.total)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Método de Pagamento</p>
                      <div className="flex items-center gap-2 text-gray-900 font-semibold">
                        <span className="text-xl">
                          {paymentData?.payment_method_id === 'account_money' ? '💰' : 
                           paymentData?.payment_method_id === 'debit_card' ? '💳' :
                           paymentData?.payment_method_id === 'credit_card' ? '💳' :
                           '💳'}
                        </span>
                        <span>
                          {paymentData?.payment_method_id === 'account_money' ? 'Saldo Mercado Pago' : 
                           paymentData?.payment_method_id === 'debit_card' ? 'Cartão de Débito' :
                           paymentData?.payment_method_id === 'credit_card' ? `Cartão de Crédito ****${paymentData?.last_four_digits}` :
                           'Mercado Pago'}
                        </span>
                      </div>
                    </div>

                    {paymentData?.cardholder_name && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Titular</p>
                        <p className="font-semibold text-gray-900">{paymentData.cardholder_name}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Resumo de Produtos */}
            {orderData && orderData.items && orderData.items.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold font-manrope mb-6 flex items-center gap-2">
                  <span>🛍️</span> Itens do Pedido
                </h3>
                
                <div className="space-y-4">
                  {orderData.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0">
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantidade: {item.quantity || 1}</p>
                      </div>
                      <p className="font-bold text-gray-900">
                        {formatCurrency(item.price * (item.quantity || 1))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Próximos Passos */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold font-manrope mb-6 flex items-center gap-2 text-blue-900">
                <span>📦</span> Próximos Passos
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0 mt-1">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Confirmação por Email</p>
                    <p className="text-sm text-gray-600">Você receberá um email com os detalhes da sua compra</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0 mt-1">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Preparação do Pedido</p>
                    <p className="text-sm text-gray-600">Seu pedido está sendo preparado para envio (entre 24-48 horas)</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0 mt-1">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Código de Rastreamento</p>
                    <p className="text-sm text-gray-600">Você receberá um link de rastreamento para acompanhar seu pedido</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0 mt-1">
                    4
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Entrega</p>
                    <p className="text-sm text-gray-600">Seu pedido será entregue conforme o método de envio selecionado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações CTA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/meus-pedidos"
                className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 text-lg"
              >
                <span>📋</span> Ver Meus Pedidos
              </Link>
              <Link
                to="/produtos"
                className="bg-white border-2 border-gray-800 text-gray-800 py-4 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2 text-lg"
              >
                <span>🛍️</span> Continuar Comprando
              </Link>
            </div>

            {/* Suporte */}
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <p className="text-gray-600 mb-2">Precisa de ajuda?</p>
              <Link to="/suporte" className="text-blue-600 font-semibold hover:text-blue-800">
                Entre em contato com nosso suporte →
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
