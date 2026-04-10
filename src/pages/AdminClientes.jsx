import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/supabaseService';

export default function AdminClientes() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const checkAdminAndLoadUsers = async () => {
      try {
        const { isAdmin } = await adminService.isUserAdmin(user?.id);
        
        if (!isAdmin) {
          navigate('/');
          return;
        }

        const { data } = await adminService.getAllUsers();
        
        if (data) {
          // Trata dados que podem vir com diferentes estruturas
          const formattedUsers = data.map(u => ({
            id: u.id,
            email: u.email || u.user_email || 'sem email',
            name: u.name || u.user_metadata?.name || u.email?.split('@')[0] || 'Sem nome',
            phone: u.phone || u.user_metadata?.phone || '-',
            role: u.role || 'customer',
            created_at: u.created_at || new Date().toISOString(),
            avatar: u.avatar || '👤',
          }));
          setUsers(formattedUsers);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoadUsers();
  }, [user?.id, isAuthenticated, navigate]);

  const handleChangeRole = async (userId, newRole) => {
    try {
      const { error } = await adminService.updateUserRole(userId, newRole);
      
      if (!error) {
        setUsers(users.map(u => 
          u.id === userId ? { ...u, role: newRole } : u
        ));
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const filteredUsers = users.filter(u => {
    if (filtro === 'admin') return u.role === 'admin';
    if (filtro === 'clientes') return u.role === 'customer';
    return true;
  });

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
          <a href="/admin/clientes" className="block px-3 py-2 rounded text-white bg-slate-700 font-semibold">👥 Clientes</a>

          <div className="text-slate-400 text-xs font-semibold py-4 px-2 mt-8">OUTRAS SEÇÕES</div>
          <a href="/admin/envios" className="block px-3 py-2 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition">📮 Métodos de Envio</a>
          <a href="/admin/logs" className="block px-3 py-2 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition">📋 Logs do Sistema</a>
          <a href="/admin/relatorios" className="block px-3 py-2 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition">📈 Relatórios</a>
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
            <h1 className="text-3xl font-bold text-white font-manrope">👥 Gerenciar Clientes</h1>
            <p className="text-slate-400 text-sm mt-1">Visualize e gerencie todos os clientes cadastrados</p>
          </div>

          {/* Filtro */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
            <label className="block text-white text-sm font-semibold mb-2">Filtrar por Role</label>
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="bg-slate-700 text-white rounded px-3 py-2 border border-slate-600 focus:border-blue-500 outline-none"
            >
              <option value="todos">📌 Todos ({users.length})</option>
              <option value="clientes">👥 Apenas Clientes ({users.filter(u => u.role === 'customer').length})</option>
              <option value="admin">👑 Apenas Admins ({users.filter(u => u.role === 'admin').length})</option>
            </select>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
              <p className="text-blue-100 text-sm font-semibold">Total de Clientes</p>
              <p className="text-3xl font-bold font-manrope mt-2">{users.length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
              <p className="text-purple-100 text-sm font-semibold">Admins</p>
              <p className="text-3xl font-bold font-manrope mt-2">{users.filter(u => u.role === 'admin').length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
              <p className="text-green-100 text-sm font-semibold">Clientes Ativos</p>
              <p className="text-3xl font-bold font-manrope mt-2">{users.filter(u => u.role === 'customer').length}</p>
            </div>
          </div>

          {/* Clientes List */}
          {loading ? (
            <p className="text-slate-400 text-center py-8">Carregando clientes...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-slate-400 text-center py-8">Nenhum cliente encontrado</p>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition flex justify-between items-center"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-3xl">{u.avatar}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">{u.name}</h3>
                      <p className="text-slate-400 text-sm">📧 {u.email}</p>
                      <p className="text-slate-400 text-sm">📱 {u.phone}</p>
                      <p className="text-slate-500 text-xs mt-1">
                        📅 {new Date(u.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.role === 'admin' 
                        ? 'bg-purple-500/30 text-purple-200' 
                        : 'bg-blue-500/30 text-blue-200'
                    }`}>
                      {u.role === 'admin' ? '👑 Admin' : '👥 Cliente'}
                    </span>

                    {u.role !== 'admin' ? (
                      <button
                        onClick={() => handleChangeRole(u.id, 'admin')}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition"
                      >
                        Tornar Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => handleChangeRole(u.id, 'customer')}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition"
                      >
                        Remover Admin
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
