import { Link } from 'react-router-dom';

export default function Categorias() {
  const categories = [
    {
      id: 1,
      name: 'Camisetas',
      subtitle: 'Essenciais Atemporais',
      description: 'Peças que atravessam as estações. Projetadas para funcionalidade, fabricadas para longevidade.',
      image: '👕',
      featured: true
    },
    {
      id: 2,
      name: 'Calças',
      subtitle: 'Craft Contemporâneo',
      description: 'Conforto e estilo em perfeita harmonia. Cortadas para o corpo moderno.',
      image: '👖',
      featured: false
    },
    {
      id: 3,
      name: 'Blazers e Jaquetas',
      subtitle: 'Impacto Visual',
      description: 'Peças estruturadas que elevam qualquer look. Design sofisticado.',
      image: '🧥',
      featured: false
    },
    {
      id: 4,
      name: 'Vestidos',
      subtitle: 'Minimalismo Elegante',
      description: 'Forma reduzida ao essencial. Beleza na simplicidade.',
      image: '👗',
      featured: false
    },
    {
      id: 5,
      name: 'Cardigans e Suéteres',
      subtitle: 'Edições Confortáveis',
      description: 'Peças para os dias frios. Luxo e conforto em camadas.',
      image: '🧶',
      featured: false
    },
    {
      id: 6,
      name: 'Acessórios',
      subtitle: 'Destaques Especiais',
      description: 'Detalhes que completam o look. Peças que fazem diferença.',
      image: '⌚',
      featured: false
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="px-6 py-16 max-w-7xl mx-auto text-center border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-500 mb-2">EXPLORE CATEGORIAS</p>
        <h1 className="text-5xl font-bold font-manrope mb-6">Categorias Curadas</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Cada categoria é cuidadosamente selecionada. Descubra uma gama de essenciais de moda que exploram diferentes facetas do design minimalista.
        </p>
      </section>

      {/* Featured Category */}
      <section className="px-6 py-16 max-w-7xl mx-auto border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-gradient-to-br from-purple-200 to-blue-200 h-96 rounded-lg flex items-center justify-center text-8xl">
            {categories[0].image}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">DESTAQUE</p>
            <h2 className="text-4xl font-bold font-manrope mb-4">{categories[0].name}</h2>
            <p className="text-lg text-gray-600 mb-6">{categories[0].description}</p>
            <Link to={`/categoria/${categories[0].id}`}>
              <button className="bg-gray-800 text-white px-6 py-3 font-semibold hover:bg-gray-900 transition">
                Explorar Categoria
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold font-manrope mb-12">Mais Categorias</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.slice(1).map((category) => (
            <Link key={category.id} to={`/categoria/${category.id}`} className="group">
              <div className="bg-gray-200 h-72 rounded-lg flex items-center justify-center text-6xl mb-4 group-hover:bg-gray-300 transition overflow-hidden">
                {category.image}
              </div>
              <p className="text-xs font-semibold text-gray-500 mb-1">{category.subtitle.toUpperCase()}</p>
              <h3 className="text-2xl font-bold font-manrope mb-3">{category.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{category.description}</p>
              <button className="text-gray-800 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition">
                Ver Categoria
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
