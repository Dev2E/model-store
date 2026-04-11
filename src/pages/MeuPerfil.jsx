import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ModalEditarPerfil from '../components/ModalEditarPerfil';

export default function MeuPerfil() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Atualizar dados do perfil quando o usuário muda
    if (user) {
      setProfileData({
        name: user.user_metadata?.name || 'Sem nome',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        avatar: user.user_metadata?.avatar || '👤',
      });
    }
  }, [user]);

  if (!profileData) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  const handleSaveProfile = (updatedData) => {
    // Atualizar dados na tela com os dados que vieram da modal
    if (updatedData) {
      setProfileData(prevData => ({
        ...prevData,
        name: updatedData.name || prevData.name,
        phone: updatedData.phone || prevData.phone,
        avatar: updatedData.avatar || prevData.avatar,
      }));
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="px-6 py-12 max-w-4xl mx-auto border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-500 mb-2">CONTA</p>
        <h1 className="text-5xl font-bold font-manrope">Meu Perfil</h1>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Card de Informações */}
        <div className="bg-gray-50 rounded-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{profileData.avatar}</div>
              <div>
                <h2 className="text-2xl font-bold font-manrope">{profileData.name}</h2>
                <p className="text-gray-600">{profileData.email}</p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gray-800 text-white px-6 py-2 rounded font-semibold hover:bg-gray-900 transition"
            >
              Editar Perfil
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Email</label>
              <p className="text-lg">{profileData.email}</p>
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Telefone</label>
              <p className="text-lg">{profileData.phone || 'Não informado'}</p>
            </div>
          </div>
        </div>

        {/* Seção Perigosa */}
        <div className="mt-12 bg-red-50 rounded-lg p-8 border border-red-200">
          <h3 className="text-xl font-bold font-manrope mb-4 text-red-600">Zona Perigosa</h3>
          <p className="text-gray-600 mb-4">Você pode deletar sua conta, mas todos os dados associados serão perdidos.</p>
          <button className="bg-red-600 text-white px-6 py-3 rounded font-semibold hover:bg-red-700 transition">
            Deletar Minha Conta
          </button>
        </div>
      </div>

      {/* Modal de Edição */}
      <ModalEditarPerfil
        isOpen={isModalOpen}
        user={user}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </main>
  );
}
