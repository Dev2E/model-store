import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { adminService, ordersService } from '../services/supabaseService';
import { formatCurrency } from '../utils/formatters';

export default function AdminPedidos() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('order_id'); // 'order_id', 'cpf', 'client_name'
  const [filterDateType, setFilterDateType] = useState('all'); // 'all', 'day', 'month', 'year'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filterStatus, setFilterStatus] = useState('all');

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
          applyFilters(data || []);
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

  // Efeito para aplicar filtros quando qualquer filtro mudar
  useEffect(() => {
    applyFilters(orders);
  }, [searchTerm, searchType, filterDateType, selectedDate, selectedMonth, selectedYear, filterStatus]);

  const applyFilters = (ordersToFilter) => {
    let filtered = [...ordersToFilter];

    // Filtrar por data
    if (filterDateType !== 'all') {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.created_at);
        
        if (filterDateType === 'day') {
          const selectedDateObj = new Date(selectedDate);
          return orderDate.toDateString() === selectedDateObj.toDateString();
        } else if (filterDateType === 'month') {
          const [year, month] = selectedMonth.split('-');
          return orderDate.getFullYear() === parseInt(year) && 
                 orderDate.getMonth() === parseInt(month) - 1;
        } else if (filterDateType === 'year') {
          return orderDate.getFullYear() === selectedYear;
        }
        return true;
      });
    }

    // Filtrar por status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // Filtrar por busca
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => {
        if (searchType === 'order_id') {
          return order.id.toString().includes(term);
        } else if (searchType === 'cpf') {
          return order.users_profile?.cpf?.includes(term) || false;
        } else if (searchType === 'client_name') {
          return order.users_profile?.name?.toLowerCase().includes(term) || false;
        }
        return true;
      });
    }

    setFilteredOrders(filtered);
  };

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
      const updated = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updated);
      applyFilters(updated);
    } catch (err) {
      console.error('Error:', err);
      showNotification('Erro ao conectar', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const generateReport = () => {
    const reportWindow = window.open('', '', 'width=900,height=600');
    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Relatório de Pedidos - Vellenia Store</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          h1 { text-align: center; margin-bottom: 10px; }
          .info { text-align: center; color: #666; margin-bottom: 20px; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #333; color: white; padding: 10px; text-align: left; }
          td { border-bottom: 1px solid #ddd; padding: 10px; }
          tr:hover { background: #f9f9f9; }
          .total { font-weight: bold; }
          .summary { margin-top: 30px; padding: 15px; background: #f0f0f0; border-radius: 5px; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <h1>📋 Relatório de Pedidos</h1>
        <div class="info">
          <p><strong>Vellenia Store</strong></p>
          <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
          <p>Total de pedidos: ${filteredOrders.length}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>CPF</th>
              <th>Data</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${filteredOrders.map(order => `
              <tr>
                <td>#${order.id}</td>
                <td>${order.users_profile?.name || 'N/A'}</td>
                <td>${order.users_profile?.cpf || 'N/A'}</td>
                <td>${new Date(order.created_at).toLocaleDateString('pt-BR')}</td>
                <td><strong>${getStatusLabel(order.status)}</strong></td>
                <td>${formatCurrency(order.total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="summary">
          <p><strong>Resumo:</strong></p>
          <p>Total de Pedidos: ${filteredOrders.length}</p>
          <p>Valor Total: ${formatCurrency(filteredOrders.reduce((sum, o) => sum + parseFloat(o.total), 0))}</p>
          <p>Pendentes: ${filteredOrders.filter(o => o.status === 'pendente').length}</p>
          <p>Em Trânsito: ${filteredOrders.filter(o => o.status === 'em_transito').length}</p>
          <p>Entregues: ${filteredOrders.filter(o => o.status === 'entregue').length}</p>
          <p>Cancelados: ${filteredOrders.filter(o => o.status === 'cancelado').length}</p>
        </div>
        
        <div class="footer">
          <p>Este relatório foi gerado automaticamente em ${new Date().toLocaleString('pt-BR')}</p>
        </div>
      </body>
      </html>
    `;
    reportWindow.document.write(reportHTML);
    reportWindow.document.close();
    reportWindow.print();
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
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold font-manrope">Gerenciar Pedidos</h1>
            <button
              onClick={generateReport}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded flex items-center gap-2"
            >
              🖨️ Gerar Relatório / Imprimir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Filtros e Buscas */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold font-manrope mb-6">🔍 Filtros e Buscas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Busca */}
            <div>
              <label className="block text-sm font-semibold mb-2">Tipo de Busca</label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="order_id">Por Nº Pedido</option>
                <option value="cpf">Por CPF</option>
                <option value="client_name">Por Nome do Cliente</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Busca</label>
              <input
                type="text"
                placeholder={
                  searchType === 'order_id' ? 'Ex: 123' :
                  searchType === 'cpf' ? 'Ex: 123.456.789-00' :
                  'Ex: João Silva'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filtro de Data */}
            <div>
              <label className="block text-sm font-semibold mb-2">Período</label>
              <select
                value={filterDateType}
                onChange={(e) => setFilterDateType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos os Períodos</option>
                <option value="day">Por Dia</option>
                <option value="month">Por Mês</option>
                <option value="year">Por Ano</option>
              </select>
            </div>

            {/* Seletor de Data Dinâmico */}
            {filterDateType === 'day' && (
              <div>
                <label className="block text-sm font-semibold mb-2">Selecione o Dia</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            
            {filterDateType === 'month' && (
              <div>
                <label className="block text-sm font-semibold mb-2">Selecione o Mês</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {filterDateType === 'year' && (
              <div>
                <label className="block text-sm font-semibold mb-2">Selecione o Ano</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[...Array(5)].map((_, i) => {
                    const year = new Date().getFullYear() - 2 + i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </div>
            )}

            {/* Filtro de Status */}
            <div>
              <label className="block text-sm font-semibold mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                <option value="pendente">Pendente</option>
                <option value="em_transito">Em Trânsito</option>
                <option value="entregue">Entregue</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              📊 <strong>{filteredOrders.length}</strong> pedido(s) encontrado(s) | 
              💰 Total: <strong>{formatCurrency(filteredOrders.reduce((sum, o) => sum + parseFloat(o.total), 0))}</strong>
            </p>
          </div>
        </div>

        {/* Tabela de Pedidos */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              <p className="text-lg">❌ Nenhum pedido encontrado com os filtros aplicados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Cliente</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">CPF</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Data</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-semibold">#{order.id}</td>
                      <td className="px-6 py-4 text-sm">
                        {order.users_profile?.name || 'Desconhecido'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {order.users_profile?.cpf || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        {formatCurrency(order.total)}
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
          )}
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
                <p className="text-gray-600">CPF: {selectedOrder.users_profile?.cpf || 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Total</h3>
                <p className="text-lg font-bold">{formatCurrency(selectedOrder.total)}</p>
                <p className="text-gray-600">
                  {new Date(selectedOrder.created_at).toLocaleDateString('pt-BR')} às {new Date(selectedOrder.created_at).toLocaleTimeString('pt-BR')}
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
                      {formatCurrency((item.price || 0) * (item.quantity || 1))}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Update */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Atualizar Status</h3>
              <div className="space-x-3 flex flex-wrap gap-3">
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
              {updatingId === selectedOrder.id && (
                <p className="mt-3 text-yellow-600 text-sm">⏳ Atualizando...</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
