import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import supabaseService from "../services/supabaseService";

export default function AdminEnvios() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [metodos, setMetodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    tempo_dias: "",
    ativo: true,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchMetodos();
  }, [isAuthenticated, navigate]);

  const fetchMetodos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseService.supabase
        .from("shipping_methods")
        .select("*")
        .order("nome");

      if (error) throw error;
      setMetodos(data || []);
    } catch (error) {
      console.error("Erro ao carregar métodos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (editingId) {
        // Atualizar existente
        const { error } = await supabaseService.supabase
          .from("shipping_methods")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        setEditingId(null);
      } else {
        // Criar novo
        const { error } = await supabaseService.supabase
          .from("shipping_methods")
          .insert([formData]);

        if (error) throw error;
      }

      setFormData({
        nome: "",
        descricao: "",
        preco: "",
        tempo_dias: "",
        ativo: true,
      });

      fetchMetodos();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar método de envio");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja deletar?")) return;

    try {
      setLoading(true);
      const { error } = await supabaseService.supabase
        .from("shipping_methods")
        .delete()
        .eq("id", id);

      if (error) throw error;
      fetchMetodos();
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao deletar método");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (metodo) => {
    setEditingId(metodo.id);
    setFormData({
      nome: metodo.nome,
      descricao: metodo.descricao,
      preco: metodo.preco,
      tempo_dias: metodo.tempo_dias,
      ativo: metodo.ativo,
    });
  };

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
          <a href="/admin/envios" className="block px-3 py-2 rounded text-white bg-slate-700 font-semibold">📮 Métodos de Envio</a>
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white font-manrope">📮 Métodos de Envio</h1>
              <p className="text-slate-400 text-sm mt-1">Gerenciar opções de envio</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingId ? "Editar Método de Envio" : "Novo Método de Envio"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nome (ex: PAC, Sedex, Urgente)"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  className="bg-slate-700 text-white rounded px-3 py-2 border border-slate-600 focus:border-blue-500 outline-none"
                  required
                />
                <input
                  type="number"
                  placeholder="Tempo de entrega (dias)"
                  value={formData.tempo_dias}
                  onChange={(e) =>
                    setFormData({ ...formData, tempo_dias: e.target.value })
                  }
                  className="bg-slate-700 text-white rounded px-3 py-2 border border-slate-600 focus:border-blue-500 outline-none"
                  required
                />
                <input
                  type="number"
                  placeholder="Preço do envio (R$)"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) =>
                    setFormData({ ...formData, preco: e.target.value })
                  }
                  className="bg-slate-700 text-white rounded px-3 py-2 border border-slate-600 focus:border-blue-500 outline-none"
                  required
                />
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={formData.ativo}
                    onChange={(e) =>
                      setFormData({ ...formData, ativo: e.target.checked })
                    }
                  />
                  Ativo
                </label>
              </div>

              <textarea
                placeholder="Descrição do método de envio"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                className="w-full bg-slate-700 text-white rounded px-3 py-2 border border-slate-600 focus:border-blue-500 outline-none"
                rows="3"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition disabled:opacity-50"
                >
                  {editingId ? "Atualizar" : "Criar"} Método
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        nome: "",
                        descricao: "",
                        preco: "",
                        tempo_dias: "",
                        ativo: true,
                      });
                    }}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-6 rounded transition"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Lista de Métodos */}
          <div className="space-y-3">
            {metodos.length === 0 ? (
              <p className="text-slate-400 text-center py-8">
                Nenhum método de envio cadastrado
              </p>
            ) : (
              metodos.map((metodo) => (
                <div
                  key={metodo.id}
                  className="bg-slate-800 rounded-lg p-4 border border-slate-700 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg">{metodo.nome}</h3>
                    <p className="text-slate-400 text-sm mt-1">
                      {metodo.descricao}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm text-slate-400">
                      <span>💰 R$ {parseFloat(metodo.preco).toFixed(2)}</span>
                      <span>📅 {metodo.tempo_dias} dias</span>
                      <span>
                        🟢 {metodo.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(metodo)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(metodo.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                    >
                      🗑️ Deletar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
