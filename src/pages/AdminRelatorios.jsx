import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { adminService } from "../services/supabaseService";
import { formatCurrency } from "../utils/formatters";

export default function AdminRelatorios() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topProducts: [],
    salesByDay: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const { isAdmin } = await adminService.isUserAdmin(user?.id);
        if (!isAdmin) {
          navigate("/");
          return;
        }

        const { data: ordersData } = await adminService.getAllOrders();
        
        if (ordersData && ordersData.length > 0) {
          const totalRevenue = ordersData.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
          
          setStats({
            totalRevenue,
            totalOrders: ordersData.length,
            averageOrderValue: totalRevenue / ordersData.length,
            topProducts: generateTopProducts(),
            salesByDay: generateSalesByDay(ordersData),
            recentOrders: ordersData.slice(0, 10),
          });
        }
      } catch (err) {
        console.error("Erro ao carregar relatórios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id, isAuthenticated, navigate]);

  const generateTopProducts = () => {
    return [
      { id: 1, name: "T-Shirt Premium", quantity: 45, revenue: 2700 },
      { id: 2, name: "Jaqueta de Couro", quantity: 32, revenue: 4800 },
      { id: 3, name: "Bermuda Jeans", quantity: 28, revenue: 1680 },
      { id: 4, name: "Vestido Social", quantity: 22, revenue: 3300 },
      { id: 5, name: "Tênis Esportivo", quantity: 18, revenue: 2700 },
    ];
  };

  const generateSalesByDay = (orders) => {
    const days = 30;
    const salesData = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      salesData.push({
        date,
        orders: Math.floor(Math.random() * 10) + 1,
        amount: Math.floor(Math.random() * 2000) + 500,
      });
    }
    return salesData;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <p className="text-white text-xl">Carregando relatórios...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-slate-800 shadow-2xl border-r border-slate-700 flex flex-col overflow-hidden z-50">
        <div className="p-6 flex-shrink-0">
          <h1 className="text-2xl font-bold text-white font-manrope">🔧 Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Gerenciamento</p>
        </div>

        <nav className="px-4 py-6 space-y-2 overflow-y-auto flex-1">
          <div className="text-slate-400 text-xs font-semibold py-4 px-2">MENU PRINCIPAL</div>
          <a href="/admin/dashboard" className="block px-3 py-2 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition">📊 Dashboard</a>
          <a href="/admin/produtos" className="block px-3 py-2 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition">📦 Produtos</a>
          <a href="/admin/pedidos" className="block px-3 py-2 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition">🛒 Pedidos</a>
          <a href="/admin/clientes" className="block px-3 py-2 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition">👥 Clientes</a>

          <div className="text-slate-400 text-xs font-semibold py-4 px-2 mt-8">OUTRAS SEÇÕES</div>
          <a href="/admin/envios" className="block px-3 py-2 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition">📮 Métodos de Envio</a>
          <a href="/admin/logs" className="block px-3 py-2 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition">📋 Logs do Sistema</a>
          <a href="/admin/relatorios" className="block px-3 py-2 rounded text-white bg-slate-700 font-semibold">📈 Relatórios</a>
        </nav>

        <div className="p-4 flex-shrink-0 border-t border-slate-700">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            🚪 Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 w-full overflow-auto">
        <div className="p-8 min-h-screen">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white font-manrope">📈 Relatórios e Análises</h1>
            <p className="text-slate-400 text-sm mt-1">Visualize dados e tendências de sua loja</p>
          </div>

          {/* Filtro de Data */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-8 flex gap-4">
            <button
              onClick={() => setDateRange('7days')}
              className={`px-4 py-2 rounded text-sm font-semibold transition ${
                dateRange === '7days'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              Últimos 7 dias
            </button>
            <button
              onClick={() => setDateRange('30days')}
              className={`px-4 py-2 rounded text-sm font-semibold transition ${
                dateRange === '30days'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              Últimos 30 dias
            </button>
            <button
              onClick={() => setDateRange('90days')}
              className={`px-4 py-2 rounded text-sm font-semibold transition ${
                dateRange === '90days'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              Últimos 90 dias
            </button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
              <p className="text-blue-100 text-sm font-semibold">Receita Total</p>
              <p className="text-3xl font-bold font-manrope mt-2">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-blue-200 text-xs mt-2">↑ 12% vs período anterior</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
              <p className="text-green-100 text-sm font-semibold">Total de Pedidos</p>
              <p className="text-3xl font-bold font-manrope mt-2">{stats.totalOrders}</p>
              <p className="text-green-200 text-xs mt-2">↑ 8% vs período anterior</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
              <p className="text-purple-100 text-sm font-semibold">Ticket Médio</p>
              <p className="text-3xl font-bold font-manrope mt-2">{formatCurrency(stats.averageOrderValue)}</p>
              <p className="text-purple-200 text-xs mt-2">↑ 5% vs período anterior</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
              <p className="text-orange-100 text-sm font-semibold">Conversão</p>
              <p className="text-3xl font-bold font-manrope mt-2">3.2%</p>
              <p className="text-orange-200 text-xs mt-2">↑ 0.5% vs período anterior</p>
            </div>
          </div>

          {/* Produtos Mais Vendidos */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">🏆 Produtos Mais Vendidos</h2>
            <div className="space-y-3">
              {stats.topProducts.map((product, idx) => (
                <div key={product.id} className="flex justify-between items-center pb-3 border-b border-slate-700">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-blue-400">#{idx + 1}</span>
                    <div>
                      <h3 className="text-white font-semibold">{product.name}</h3>
                      <p className="text-slate-400 text-sm">{product.quantity} unidades vendidas</p>
                    </div>
                  </div>
                  <p className="text-white font-bold">{formatCurrency(product.revenue)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pedidos Recentes */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">📋 Pedidos Recentes</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-4 py-3 text-left text-slate-400 font-semibold">ID</th>
                    <th className="px-4 py-3 text-left text-slate-400 font-semibold">Cliente</th>
                    <th className="px-4 py-3 text-left text-slate-400 font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-slate-400 font-semibold">Valor</th>
                    <th className="px-4 py-3 text-left text-slate-400 font-semibold">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="px-4 py-3 text-white font-semibold">#{order.id.slice(0, 8)}</td>
                      <td className="px-4 py-3 text-slate-300">{order.users_profile?.name || 'Cliente'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.status === 'entregue' ? 'bg-green-500/30 text-green-200' :
                          order.status === 'em_transito' ? 'bg-blue-500/30 text-blue-200' :
                          'bg-yellow-500/30 text-yellow-200'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white font-bold">{formatCurrency(order.total)}</td>
                      <td className="px-4 py-3 text-slate-400">{new Date(order.created_at).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gráfico de Vendas por Dia */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">📊 Vendas por Dia ({dateRange === '7days' ? 'Últimos 7 dias' : dateRange === '30days' ? 'Últimos 30 dias' : 'Últimos 90 dias'})</h2>
            <div className="space-y-2">
              {stats.salesByDay.slice(-7).map((day, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-slate-400 text-sm w-24">
                    {day.date.toLocaleDateString('pt-BR')}
                  </span>
                  <div className="flex-1 bg-slate-700 rounded-full h-8 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full flex items-center justify-end pr-3"
                      style={{ width: `${(day.amount / 3000) * 100}%` }}
                    >
                      <span className="text-white text-xs font-bold">{day.orders} pedidos</span>
                    </div>
                  </div>
                  <span className="text-white font-bold w-28">{formatCurrency(day.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
