import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';

export default function Wishlist() {
  const wishlistItems = [
    { id: 1, name: 'Vaso Cerâmico Minimalista', price: 289, image: '⚪', inStock: true },
    { id: 2, name: 'Luminária Pendente Premium', price: 520, image: '💡', inStock: true },
    { id: 3, name: 'Banco de Madeira Artesanal', price: 610, image: '🪑', inStock: false },
    { id: 4, name: 'Almofada Linho Bege', price: 165, image: '🛏️', inStock: true },
  ];

  return (
    <main className="min-h-screen bg-white">
      <section className="px-6 py-12 max-w-4xl mx-auto border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-500 mb-2">CONTA</p>
        <h1 className="text-5xl font-bold font-manrope">Lista de Desejos</h1>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {wishlistItems.length > 0 ? (
          <>
            <p className="text-gray-600 mb-8">{wishlistItems.length} produtos na sua lista</p>

            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <div key={item.id} className="flex gap-6 pb-6 border-b border-gray-200 last:border-b-0">
                  {/* Image */}
                  <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-5xl flex-shrink-0">
                    {item.image}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                      <p className="text-2xl font-bold text-gray-800">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="flex gap-3">
                      {item.inStock ? (
                        <>
                          <Link to={`/produto/${item.id}`}>
                            <button className="bg-gray-800 text-white px-4 py-2 rounded font-semibold hover:bg-gray-900 transition">
                              Ver Produto
                            </button>
                          </Link>
                          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded font-semibold hover:bg-gray-200 transition">
                            Adicionar ao Carrinho
                          </button>
                        </>
                      ) : (
                        <button className="bg-gray-200 text-gray-500 px-4 py-2 rounded font-semibold cursor-not-allowed">
                          Indisponível
                        </button>
                      )}
                      <button className="text-red-600 hover:text-red-700 font-semibold">
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Share Section */}
            <div className="mt-12 bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold font-manrope mb-4">Compartilhe sua Lista</h3>
              <p className="text-gray-600 mb-4">Compartilhe sua lista de desejos com amigos e família</p>
              <button className="bg-gray-800 text-white px-6 py-3 font-semibold hover:bg-gray-900 transition rounded-lg">
                Copiar Link
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">💝</p>
            <h2 className="text-2xl font-bold font-manrope mb-2">Sua lista está vazia</h2>
            <p className="text-gray-600 mb-8">Comece adicionando produtos que você gosta</p>
            <Link to="/produtos">
              <button className="bg-gray-800 text-white px-8 py-3 font-semibold hover:bg-gray-900 transition rounded-lg">
                Explorar Produtos
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
