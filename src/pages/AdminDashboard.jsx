import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/supabaseService';
import { formatCurrency } from '../utils/formatters';
import {
  ChartBarIcon,
  CubeIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  ArrowTrendingUpIcon,
  CogIcon,
  PlusIcon,
  EnvelopeIcon,
  ArrowLeftOnRectangleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
  });

  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const checkAdminAndLoadStats = async () => {
      try {
        // Verifica se é admin
        const { isAdmin: adminCheck, error: adminError } = await adminService.isUserAdmin(user?.id);
        
        if (!adminCheck) {
          navigate('/');
          return;
        }

        setIsAdmin(true);

        // Carrega estatísticas
        const { data: ordersData } = await adminService.getAllOrders();
        const { data: usersData } = await adminService.getAllUsers();

        const totalRevenue = ordersData?.reduce((sum, order) => sum + parseFloat(order.total || 0), 0) || 0;

        setStats({
          totalOrders: ordersData?.length || 0,
          totalUsers: usersData?.length || 0,
          totalProducts: 0,
          totalRevenue: totalRevenue,
          recentOrders: ordersData?.slice(0, 5) || [],
        });
      } catch (err) {
        console.error('Error loading admin stats:', err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoadStats();
  }, [user?.id, isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white font-semibold">Carregando Dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex">
      {/* Sidebar - FIXED */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-slate-800 shadow-2xl border-r border-slate-700 flex flex-col overflow-hidden z-50">
        <div className="p-6 flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <CogIcon className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold text-white font-manrope">Admin</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">Gerenciamento</p>
        </div>

        {/* Scrollable Nav */}
        <nav className="px-4 py-6 space-y-2 overflow-y-auto flex-1">
          <div className="text-slate-400 text-xs font-semibold py-4 px-2">MENU PRINCIPAL</div>
          <NavLink to="/admin/dashboard" Icon={ChartBarIcon} label="Dashboard" active />
          <NavLink to="/admin/produtos" Icon={CubeIcon} label="Produtos" />
          <NavLink to="/admin/pedidos" Icon={ShoppingCartIcon} label="Pedidos" />
          <NavLink to="/admin/clientes" Icon={UserGroupIcon} label="Clientes" />

          <div className="text-slate-400 text-xs font-semibold py-4 px-2 mt-8">OUTRAS SEÇÕES</div>
          <NavLink to="/admin/envios" Icon={TruckIcon} label="Métodos de Envio" />
          <NavLink to="/admin/logs" Icon={ClipboardDocumentListIcon} label="Logs do Sistema" />
          <NavLink to="/admin/relatorios" Icon={ArrowTrendingUpIcon} label="Relatórios" />
          <NavLink to="/admin/configuracoes" Icon={CogIcon} label="Configurações" />
        </nav>

        {/* Logout Button - FIXED AT BOTTOM */}
        <div className="p-4 flex-shrink-0 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition flex items-center justify-center gap-2"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 w-full overflow-auto">
        <div className="p-8 min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-700">
            <div>
              <h1 className="text-4xl font-bold text-white font-manrope">⚙️ Painel de Administração</h1>
              <p className="text-slate-400 text-sm mt-2">Gerencie sua loja online</p>
            </div>
            <div className="text-right bg-slate-700/30 backdrop-blur border border-slate-600 rounded-lg p-4">
              <p className="text-white font-semibold">{user?.user_metadata?.name || user?.email}</p>
              <p className="text-slate-400 text-sm">👑 Administrador</p>
            </div>
          </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            Icon={ShoppingCartIcon}
            title="Pedidos"
            value={stats.totalOrders}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            Icon={SparklesIcon}
            title="Receita Total"
            value={formatCurrency(stats.totalRevenue)}
            color="from-green-500 to-green-600"
          />
          <StatCard
            Icon={UserGroupIcon}
            title="Clientes"
            value={stats.totalUsers}
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            Icon={CubeIcon}
            title="Produtos"
            value={stats.totalProducts}
            color="from-orange-500 to-orange-600"
          />
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-slate-700/50 backdrop-blur border border-slate-600 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white font-manrope mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
              <QuickActionButton to="/admin/produtos/novo" Icon={PlusIcon} label="Novo Produto" />
              <QuickActionButton to="/admin/pedidos" Icon={ClipboardDocumentListIcon} label="Ver Pedidos" />
              <QuickActionButton to="/admin/clientes" Icon={EnvelopeIcon} label="Mensagens" />
              <QuickActionButton to="/admin/configuracoes" Icon={CogIcon} label="Configurações" />
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-slate-700/50 backdrop-blur border border-slate-600 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white font-manrope">Pedidos Recentes</h3>
                <Link to="/admin/pedidos" className="text-blue-400 hover:text-blue-300 text-sm">
                  Ver tudo →
                </Link>
              </div>
              {stats.recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center p-3 bg-slate-600/30 rounded-lg hover:bg-slate-600/50 transition"
                    >
                      <div>
                        <p className="text-white font-semibold">
                          {order.users_profile?.name || 'Cliente'}
                        </p>
                        <p className="text-slate-400 text-sm">
                          Pedido #{order.id} • {new Date(order.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{formatCurrency(order.total)}</p>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">Nenhum pedido recente</p>
              )}
            </div>
          </div>
        </div>

        {/* Management Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ManagementCard
            Icon={CubeIcon}
            title="Gerenciar Produtos"
            description="Adicione, edite ou remova produtos do catálogo"
            to="/admin/produtos"
          />
          <ManagementCard
            Icon={ShoppingCartIcon}
            title="Gerenciar Pedidos"
            description="Visualize e atualize o status dos pedidos"
            to="/admin/pedidos"
          />
          <ManagementCard
            Icon={UserGroupIcon}
            title="Gerenciar Clientes"
            description="Visualize e gerencie dados dos clientes"
            to="/admin/clientes"
          />
        </div>
        </div>
      </div>
    </main>
  );
}

// Components
function NavLink({ to, Icon, label, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-slate-300 hover:bg-slate-700/50'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function StatCard({ Icon, title, value, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white shadow-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white/80 text-sm font-semibold">{title}</p>
          <p className="text-3xl font-bold font-manrope mt-2">{value}</p>
        </div>
        <Icon className="w-10 h-10 opacity-80" />
      </div>
    </div>
  );
}

function QuickActionButton({ to, Icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-3 bg-slate-600/50 hover:bg-slate-600 rounded-lg text-slate-100 transition"
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function ManagementCard({ Icon, title, description, to }) {
  return (
    <Link to={to}>
      <div className="bg-slate-700/50 backdrop-blur border border-slate-600 rounded-xl p-6 hover:border-slate-500 hover:bg-slate-700/70 transition cursor-pointer">
        <Icon className="w-8 h-8 mb-4 text-blue-400" />
        <h3 className="text-lg font-bold text-white font-manrope mb-2">{title}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
    </Link>
  );
}

function StatusBadge({ status }) {
  const colors = {
    entregue: 'bg-green-500/30 text-green-200',
    em_transito: 'bg-blue-500/30 text-blue-200',
    pendente: 'bg-yellow-500/30 text-yellow-200',
    cancelado: 'bg-red-500/30 text-red-200',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[status] || colors.pendente}`}>
      {status}
    </span>
  );
}
