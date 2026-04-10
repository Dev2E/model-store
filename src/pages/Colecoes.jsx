import { Link } from 'react-router-dom';

export default function Colecoes() {
  const collections = [
    {
      id: 1,
      name: 'Coleção Herança',
      subtitle: 'Essenciais Atemporais',
      description: 'Peças que atravessam as estações. Projetadas para funcionalidade, fabricadas para longevidade.',
      image: '🏛️',
      featured: true
    },
    {
      id: 2,
      name: 'Studio Artisan',
      subtitle: 'Craft Contemporâneo',
      description: 'Colaboração com artisãos locais. Cada peça é única e feita à mão.',
      image: '🎨',
      featured: false
    },
    {
      id: 3,
      name: 'Sustainable Living',
      subtitle: 'Impacto Positivo',
      description: 'Materiais reciclados e processos sustentáveis. Beleza com responsabilidade.',
      image: '🌱',
      featured: false
    },
    {
      id: 4,
      name: 'Monolith',
      subtitle: 'Minimalismo Extremo',
      description: 'Forma reduzida ao essencial. Função refinada em sua expressão mais pura.',
      image: '⬛',
      featured: false
    },
    {
      id: 5,
      name: 'Seasonal Edit',
      subtitle: 'Edições Limitadas',
      description: 'Coleções sazonais celebrando a mutabilidade do design contemporâneo.',
      image: '🔄',
      featured: false
    },
    {
      id: 6,
      name: 'Heritage Archive',
      subtitle: 'Peças Clássicas',
      description: 'Resgata designs icônicos do passado com uma perspectiva moderna.',
      image: '📜',
      featured: false
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="px-6 py-16 max-w-7xl mx-auto text-center border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-500 mb-2">EXPLORANDO COLEÇÕES</p>
        <h1 className="text-5xl font-bold font-manrope mb-6">Coleções Curadas</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Cada coleção é uma declaração de intenção. Discover edições temáticas que exploram diferentes facetas do design moderno.
        </p>
      </section>

      {/* Featured Collection */}
      <section className="px-6 py-16 max-w-7xl mx-auto border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-gradient-to-br from-purple-200 to-blue-200 h-96 rounded-lg flex items-center justify-center text-8xl">
            {collections[0].image}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">DESTAQUE</p>
            <h2 className="text-4xl font-bold font-manrope mb-4">{collections[0].name}</h2>
            <p className="text-lg text-gray-600 mb-6">{collections[0].description}</p>
            <Link to={`/colecao/${collections[0].id}`}>
              <button className="bg-gray-800 text-white px-6 py-3 font-semibold hover:bg-gray-900 transition">
                Explorar Coleção
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold font-manrope mb-12">Mais Coleções</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.slice(1).map((collection) => (
            <Link key={collection.id} to={`/colecao/${collection.id}`} className="group">
              <div className="bg-gray-200 h-72 rounded-lg flex items-center justify-center text-6xl mb-4 group-hover:bg-gray-300 transition overflow-hidden">
                {collection.image}
              </div>
              <p className="text-xs font-semibold text-gray-500 mb-1">{collection.subtitle.toUpperCase()}</p>
              <h3 className="text-2xl font-bold font-manrope mb-3">{collection.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{collection.description}</p>
              <button className="text-gray-800 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition">
                Ver Coleção
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto bg-gray-100 rounded-lg text-center">
        <h2 className="text-3xl font-bold font-manrope mb-4">Coleção Personalizada</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Não encontrou o que procura? Nossa equipe de curadores pode criar uma seleção exclusiva para você.
        </p>
        <button className="bg-gray-800 text-white px-6 py-3 font-semibold hover:bg-gray-900 transition">
          Solicitar Consultoria
        </button>
      </section>
    </main>
  );
}
