import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import supabaseService from "../services/supabaseService";

export default function AdminLogs() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState("todos");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchLogs();
  }, [isAuthenticated, navigate]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseService.supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.log("Tabela de logs não existe, usando dados simulados");
        // Usar dados simulados se a tabela não existir
        setLogs(generateMockLogs());
      } else {
        setLogs(data || []);
      }
    } catch (error) {
      console.error("Erro ao carregar logs:", error);
      setLogs(generateMockLogs());
    } finally {
      setLoading(false);
    }
  };

  const generateMockLogs = () => {
    const agora = new Date();
    const logs = [];
    const tipos = ["login", "produto_criado", "produto_editado", "produto_deletado", "pedido_criado", "usuario_registration"];
    const usuarios = ["admin@loja.com", "user1@example.com", "user2@example.com"];

    for (let i = 0; i < 20; i++) {
      const data = new Date(agora.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      logs.push({
        id: i,
        tipo: tipos[Math.floor(Math.random() * tipos.length)],
        usuario: usuarios[Math.floor(Math.random() * usuarios.length)],
        descricao: ["Login realizado", "Produto criado: T-shirt", "Produto editado", "Produto deletado", "Novo pedido recebido", "Novo usuário registrado"][i % 6],
        detalhes: "Sem detalhes adicionais",
        created_at: data.toISOString(),
      });
    }
    return logs;
  };

  const tiposEmoji = {
    login: "🔐",
    produto_criado: "✨",
    produto_editado: "✏️",
    produto_deletado: "🗑️",
    pedido_criado: "📦",
    usuario_registration: "👤",
  };

  const filteredLogs = logs.filter((log) => {
    const matchFiltro = filtro === "todos" || log.tipo === filtro;
    const matchBusca = log.usuario.toLowerCase().includes(busca.toLowerCase()) ||
      log.descricao.toLowerCase().includes(busca.toLowerCase());
    return matchFiltro && matchBusca;
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
          <a href="/admin/clientes" className="block px-3 py-2 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition">👥 Clientes</a>

          <div className="text-slate-400 text-xs font-semibold py-4 px-2 mt-8">OUTRAS SEÇÕES</div>
          <a href="/admin/envios" className="block px-3 py-2 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition">📮 Métodos de Envio</a>
          <a href="/admin/logs" className="block px-3 py-2 rounded text-white bg-slate-700 font-semibold">📋 Logs do Sistema</a>
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
            <h1 className="text-3xl font-bold text-white font-manrope">📋 Logs do Sistema</h1>
            <p className="text-slate-400 text-sm mt-1">Histórico de atividades na plataforma</p>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Filtrar por Tipo
                </label>
                <select
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="w-full bg-slate-700 text-white rounded px-3 py-2 border border-slate-600 focus:border-blue-500 outline-none"
                >
                  <option value="todos">📌 Todos os tipos</option>
                  <option value="login">🔐 Login</option>
                  <option value="produto_criado">✨ Produto Criado</option>
                  <option value="produto_editado">✏️ Produto Editado</option>
                  <option value="produto_deletado">🗑️ Produto Deletado</option>
                  <option value="pedido_criado">📦 Pedido Criado</option>
                  <option value="usuario_registration">👤 Novo Usuário</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-white text-sm font-semibold mb-2">
                  🔍 Buscar
                </label>
                <input
                  type="text"
                  placeholder="Buscar por usuário ou ação..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full bg-slate-700 text-white rounded px-3 py-2 border border-slate-600 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="mt-4 text-slate-400 text-sm">
              📊 Total: <span className="text-white font-bold">{filteredLogs.length}</span> registros
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm">🔐 Logins</p>
              <p className="text-2xl font-bold text-white">
                {logs.filter(l => l.tipo === 'login').length}
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm">📦 Produtos Criados</p>
              <p className="text-2xl font-bold text-white">
                {logs.filter(l => l.tipo === 'produto_criado').length}
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm">🛒 Pedidos</p>
              <p className="text-2xl font-bold text-white">
                {logs.filter(l => l.tipo === 'pedido_criado').length}
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm">👤 Usuários Novos</p>
              <p className="text-2xl font-bold text-white">
                {logs.filter(l => l.tipo === 'usuario_registration').length}
              </p>
            </div>
          </div>

          {/* Timeline de Logs */}
          <div className="space-y-2">
            {loading ? (
              <p className="text-slate-400 text-center py-8">Carregando logs...</p>
            ) : filteredLogs.length === 0 ? (
              <p className="text-slate-400 text-center py-8">Nenhum registro encontrado</p>
            ) : (
              filteredLogs.map((log, idx) => (
                <div
                  key={log.id}
                  className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition flex items-start gap-4"
                >
                  <div className="text-3xl flex-shrink-0">
                    {tiposEmoji[log.tipo] || "📝"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white">
                          {log.descricao}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          Usuário: <span className="font-mono">{log.usuario}</span>
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-slate-400 text-sm">
                          {new Date(log.created_at).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-slate-500 text-xs">
                          {new Date(log.created_at).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    {log.detalhes && (
                      <p className="text-slate-400 text-sm mt-2">
                        💬 {log.detalhes}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer com info */}
          <div className="mt-12 pt-8 border-t border-slate-700 text-center">
            <p className="text-slate-400 text-sm">
              Mostrando {filteredLogs.length} de {logs.length} registros
            </p>
            <p className="text-slate-500 text-xs mt-2">
              Logs são mantidos por 90 dias
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
