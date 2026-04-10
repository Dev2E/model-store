import { useState } from 'react';
import { usersService } from '../services/supabaseService';

export default function Modal({ isOpen, user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    phone: user?.user_metadata?.phone || '',
    avatar: user?.user_metadata?.avatar || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Atualizar perfil no Supabase
      const { error: updateError } = await usersService.updateUserProfile(user.id, {
        name: formData.name,
        phone: formData.phone,
        avatar: formData.avatar
      });

      if (updateError) {
        setError(updateError);
      } else {
        setSuccess('Perfil atualizado com sucesso!');
        setTimeout(() => {
          onSave();
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError('Erro ao atualizar perfil. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 pt-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-manrope">Editar Perfil</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-2xl hover:text-gray-600 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold mb-2">Nome</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800 disabled:bg-gray-100"
              placeholder="Seu nome"
            />
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-semibold mb-2">Telefone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800 disabled:bg-gray-100"
              placeholder="(11) 99999-9999"
            />
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-sm font-semibold mb-2">Emoji Avatar</label>
            <input
              type="text"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              disabled={loading}
              maxLength={2}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800 disabled:bg-gray-100 text-center text-3xl"
              placeholder="😊"
            />
            <p className="text-xs text-gray-500 mt-2">Use um emoji simples (ex: 😊, 🎉, 👨)</p>
          </div>

          {/* Mensagens */}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm text-center">{success}</p>}

          {/* Botões */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded font-semibold hover:bg-gray-300 transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gray-800 text-white py-3 rounded font-semibold hover:bg-gray-900 transition disabled:bg-gray-400"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
