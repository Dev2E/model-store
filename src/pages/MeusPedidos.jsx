import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ordersService } from '../services/supabaseService';

export default function MeusPedidos() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');

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

  // Carrega os pedidos do usuário
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await ordersService.getUserOrders(user.id);
        
        if (fetchError) {
          setError('Erro ao carregar pedidos');
          showNotification('Erro ao carregar pedidos', 'error');
          return;
        }

        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Erro ao conectar ao servidor');
        showNotification('Erro ao conectar ao servidor', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id, showNotification]);


  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <section className="px-6 py-12 max-w-4xl mx-auto border-b border-gray-200">
          <p className="text-sm font-semibold text-gray-500 mb-2">CONTA</p>
          <h1 className="text-5xl font-bold font-manrope">Meus Pedidos</h1>
        </section>
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <p className="text-gray-600">Carregando pedidos...</p>
        </div>
      </main>
    );
  }

  // Estatísticas dos pedidos
  const totalOrders = orders.length;
  const paidOrders = orders.filter(o => o.status === 'paid').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled' || o.status === 'failed').length;

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return { emoji: '🟢', label: 'Pago', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' };
      case 'pending':
        return { emoji: '🟡', label: 'Pendente', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' };
      case 'cancelled':
      case 'failed':
        return { emoji: '🔴', label: 'Cancelado', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' };
      case 'processing':
        return { emoji: '🔵', label: 'Processando', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' };
      default:
        return { emoji: '⚪', label: 'Desconhecido', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800' };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'entregue':
        return 'bg-green-100 text-green-700';
      case 'em_transito':
        return 'bg-blue-100 text-blue-700';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelado':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'entregue':
        return 'Entregue';
      case 'em_transito':
        return 'Em Trânsito';
      case 'pendente':
        return 'Pendente';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="px-6 py-12 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-semibold text-gray-500 mb-2">CONTA</p>
          <h1 className="text-5xl font-bold font-manrope">Meus Pedidos</h1>
          <p className="text-gray-600 mt-2">Acompanhe o status de todas as suas compras</p>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">TOTAL</p>
            <p className="text-3xl font-bold font-manrope">{totalOrders}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <p className="text-sm text-green-700 font-semibold mb-2">🟢 PAGOS</p>
            <p className="text-3xl font-bold text-green-700">{paidOrders}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <p className="text-sm text-yellow-700 font-semibold mb-2">🟡 PENDENTES</p>
            <p className="text-3xl font-bold text-yellow-700">{pendingOrders}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-6 border border-red-200">
            <p className="text-sm text-red-700 font-semibold mb-2">🔴 CANCELADOS</p>
            <p className="text-3xl font-bold text-red-700">{cancelledOrders}</p>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                filter === 'all'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-6 py-2 rounded-full font-semibold transition flex items-center gap-2 ${
                filter === 'paid'
                  ? 'bg-green-100 text-green-800 border-2 border-green-400'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <span>🟢</span> Pago
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-2 rounded-full font-semibold transition flex items-center gap-2 ${
                filter === 'pending'
                  ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-400'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <span>🟡</span> Pendente
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-6 py-2 rounded-full font-semibold transition flex items-center gap-2 ${
                filter === 'cancelled'
                  ? 'bg-red-100 text-red-800 border-2 border-red-400'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <span>🔴</span> Cancelado
            </button>
          </div>
        </div>
      </section>

      {/* Lista de Pedidos */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold font-manrope mb-6">Histórico de Pedidos</h2>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Carregando pedidos...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 text-center py-12">
            <p className="text-gray-600 mb-6">
              {filter === 'all' ? 'Você ainda não tem nenhum pedido' : 'Nenhum pedido com esse status'}
            </p>
            <Link to="/produtos">
              <button className="bg-gray-800 text-white px-8 py-3 font-semibold hover:bg-gray-900 transition rounded-lg">
                Explorar Produtos
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusBadge = getStatusBadge(order.status);
              const itemCount = order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

              return (
                <div
                  key={order.id}
                  className={`${statusBadge.bg} border-2 ${statusBadge.border} rounded-lg p-6 hover:shadow-lg transition`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                    {/* Informações Principais */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">{statusBadge.emoji}</span>
                        <div>
                          <h3 className="font-bold text-lg">Pedido #{order.id.slice(0, 8).toUpperCase()}</h3>
                          <p className={`text-sm font-semibold ${statusBadge.text}`}>
                            {statusBadge.label}
                          </p>
                        </div>
                      </div>

                      {/* Itens do Pedido */}
                      <div className="bg-white bg-opacity-50 rounded p-3 text-sm">
                        <p className="font-semibold mb-2">Itens ({itemCount})</p>
                        <ul className="space-y-1 text-gray-700">
                          {order.items?.slice(0, 2).map((item, idx) => (
                            <li key={idx}>
                              • {item.name} <span className="text-gray-600">x {item.quantity || 1}</span>
                            </li>
                          ))}
                          {order.items?.length > 2 && (
                            <li className="text-gray-500 italic">
                              + {order.items.length - 2} mais itens
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Data e Total */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Data do Pedido</p>
                        <p className="font-semibold text-lg">
                          {new Date(order.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Valor Total</p>
                        <p className="text-2xl font-bold font-manrope">
                          R$ {parseFloat(order.total || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        className="w-full bg-white text-gray-800 py-2 rounded font-semibold hover:bg-gray-50 border border-gray-300 transition"
                      >
                        {selectedOrder?.id === order.id ? '👁️ Ocultar' : '👁️ Detalhes'}
                      </button>
                      {order.status === 'paid' && (
                        <button className="w-full bg-white text-gray-800 py-2 rounded font-semibold hover:bg-gray-50 border border-gray-300 transition text-sm">
                          📦 Rastrear
                        </button>
                      )}
                      {order.status === 'pending' && (
                        <button className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition text-sm">
                          💳 Pagar Agora
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Detalhes Expandidos */}
                  {selectedOrder?.id === order.id && (
                    <div className="mt-6 pt-6 border-t-2 border-gray-200">
                      <h4 className="font-semibold mb-4 text-lg">Itens do Pedido</h4>
                      <div className="bg-white bg-opacity-50 rounded p-4 space-y-3 mb-4">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm border-b border-gray-200 pb-3 last:border-0">
                            <div>
                              <p className="font-semibold">{item.name}</p>
                              <p className="text-gray-600 text-xs">Quantidade: {item.quantity || 1}</p>
                            </div>
                            <p className="font-semibold">R$ {(item.price * (item.quantity || 1)).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                      <div className="bg-white bg-opacity-70 rounded p-4 flex justify-between font-bold border border-gray-300">
                        <span>Total:</span>
                        <span>R$ {parseFloat(order.total || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      {orders.length > 0 && (
        <section className="bg-white border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-12 text-center">
            <h3 className="text-2xl font-bold font-manrope mb-4">Continue Comprando</h3>
            <p className="text-gray-600 mb-6">Descubra mais produtos na nossa coleção</p>
            <Link to="/produtos">
              <button className="bg-gray-800 text-white px-8 py-3 font-semibold hover:bg-gray-900 transition rounded-lg">
                Ver Catálogo
              </button>
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
