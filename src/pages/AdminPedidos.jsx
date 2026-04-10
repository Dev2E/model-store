import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { adminService, ordersService } from '../services/supabaseService';

export default function AdminPedidos() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const checkAdminAndLoadOrders = async () => {
      try {
        const { isAdmin } = await adminService.isUserAdmin(user?.id);
        
        if (!isAdmin) {
          navigate('/');
          return;
        }

        const { data, error: ordersError } = await adminService.getAllOrders();
        
        if (ordersError) {
          setError('Erro ao carregar pedidos');
          showNotification('Erro ao carregar pedidos', 'error');
        } else {
          setOrders(data || []);
        }
      } catch (err) {
        console.error('Error:', err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoadOrders();
  }, [user?.id, isAuthenticated, navigate, showNotification]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);

    try {
      const { error } = await ordersService.updateOrderStatus(orderId, newStatus);
      
      if (error) {
        showNotification('Erro ao atualizar status', 'error');
        setUpdatingId(null);
        return;
      }

      showNotification('Status atualizado!', 'success');

      // Atualiza a lista
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error('Error:', err);
      showNotification('Erro ao conectar', 'error');
    } finally {
      setUpdatingId(null);
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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100">
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold font-manrope">Gerenciar Pedidos</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Pedidos Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Cliente</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Data</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold">#{order.id}</td>
                    <td className="px-6 py-4 text-sm">
                      {order.users_profile?.name || 'Desconhecido'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      R$ {parseFloat(order.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        className="text-blue-600 font-semibold hover:text-blue-700"
                      >
                        {selectedOrder?.id === order.id ? 'Ocultar' : 'Detalhes'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details */}
        {selectedOrder && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold font-manrope mb-6">Detalhes do Pedido #{selectedOrder.id}</h2>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Cliente</h3>
                <p>{selectedOrder.users_profile?.name || 'Desconhecido'}</p>
                <p className="text-gray-600">{selectedOrder.users_profile?.email}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Total</h3>
                <p className="text-lg font-bold">R$ {parseFloat(selectedOrder.total).toFixed(2)}</p>
                <p className="text-gray-600">
                  {new Date(selectedOrder.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Itens do Pedido</h3>
              <div className="space-y-2 bg-gray-50 p-4 rounded">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span className="font-semibold">
                      R$ {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Update */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Atualizar Status</h3>
              <div className="space-x-3">
                {['pendente', 'em_transito', 'entregue', 'cancelado'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                    disabled={updatingId === selectedOrder.id}
                    className={`px-4 py-2 rounded font-semibold transition ${
                      selectedOrder.status === status
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    } disabled:opacity-50`}
                  >
                    {getStatusLabel(status)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
