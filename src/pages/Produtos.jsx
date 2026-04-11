import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { productsService } from '../services/supabaseService';
import { formatCurrency } from '../utils/formatters';

export default function Produtos() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(1000);
  const [sortBy, setSortBy] = useState('featured');
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Carregar produtos do Supabase
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const { data, error: fetchError } = await productsService.getAllProducts();
        if (fetchError) {
          setError(fetchError);
        } else {
          setAllProducts(data || []);
        }
      } catch (err) {
        setError('Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Mapear categorias dinamicamente
  const dataCategories = [
    { id: 'all', name: 'Todos os Produtos', count: allProducts.length },
  ];

  const uniqueCategories = [...new Set(allProducts.map(p => p.category))];
  uniqueCategories.forEach(cat => {
    const count = allProducts.filter(p => p.category === cat).length;
    dataCategories.push({
      id: cat.toLowerCase().replace(/\s+/g, '-'),
      name: cat,
      count: count
    });
  });

  const categories = dataCategories;

  // Filtrar produtos
  const filtered = allProducts.filter(p => {
    const categoryMatch = selectedCategory === 'all' || 
                          p.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory ||
                          selectedCategory === 'all';
    const priceMatch = p.price <= priceRange;
    return categoryMatch && priceMatch;
  });

  // Ordenação
  const sorted = [...filtered].sort((a, b) => {
    switch(sortBy) {
      case 'cheapest':
        return a.price - b.price;
      case 'expensive':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Paginação
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedProducts = sorted.slice(startIdx, endIdx);

  // Reset página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange, sortBy]);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="px-6 py-12 max-w-7xl mx-auto border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-500 mb-2">CATÁLOGO DIGITAL</p>
        <h1 className="text-5xl font-bold font-manrope mb-4">Objetos para o Estúdio Moderno</h1>
        <p className="text-gray-600">Coleção curada de essenciais minimalistas projetados para funcionalidade e longevidade.</p>
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-6 py-12 max-w-7xl mx-auto">
        {/* Sidebar - Filters */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
            {/* Category Filter */}
            <div className="mb-8">
              <h3 className="font-semibold text-sm mb-4">Categoria</h3>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={selectedCategory === cat.id}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      disabled={loading}
                      className="w-4 h-4 disabled:cursor-not-allowed"
                    />
                    <span className="ml-3 text-sm text-gray-700">{cat.name}</span>
                    <span className="ml-auto text-xs text-gray-500">{cat.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <h3 className="font-semibold text-sm mb-4">Faixa de Preço</h3>
              <div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-gray-600 mt-2">Até {formatCurrency(priceRange)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {/* Header with Sort */}
          <div className="flex justify-between items-center mb-8">
            <p className="text-sm text-gray-600">Mostrando {sorted.length} de {allProducts.length} produtos</p>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              disabled={loading}
              className="text-sm border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
            >
              <option value="featured">Destacados</option>
              <option value="cheapest">Preço: Menor para Maior</option>
              <option value="expensive">Preço: Maior para Menor</option>
              <option value="name">Nome (A-Z)</option>
            </select>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-600">Carregando produtos...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded p-6 mb-8">
              <p className="text-red-700">Erro ao carregar produtos: {error}</p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && sorted.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {paginatedProducts.map((product) => (
                <div key={product.id} className="group overflow-hidden">
                  <Link to={`/produto/${product.id}`} className="block">
                    <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center text-6xl mb-4 group-hover:bg-gray-300 transition relative overflow-hidden">
                      {product.image || '📦'}
                      <span className="absolute top-3 right-3 bg-white bg-opacity-90 px-3 py-1 text-xs font-semibold rounded">
                        LIMITADO
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm mb-2">{product.name}</h3>
                  </Link>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold">{formatCurrency(product.price)}</p>
                    <button 
                      onClick={() => {
                        window.location.href = `/produto/${product.id}`;
                      }}
                      className="bg-gray-800 text-white rounded px-3 py-1 text-xs font-semibold hover:bg-gray-900 transition opacity-0 group-hover:opacity-100"
                      title="Clique para selecionar tamanho e adicionar ao carrinho"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && sorted.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-600">Nenhum produto encontrado com esses critérios</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 flex-wrap">
              <button 
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => {
                const page = i + 1;
                // Mostrar página atual, primeira, última e 2 paginas ao redor
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded ${
                        currentPage === page
                          ? 'bg-gray-800 text-white'
                          : 'border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if ((page === currentPage - 2 || page === currentPage + 2) && totalPages > 1) {
                  return <span key={`dots-${page}`} className="px-2">...</span>;
                }
                return null;
              })}
              <button 
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          )}
          
          {/* Info sobre página */}
          {sorted.length > 0 && (
            <div className="text-center mt-6 text-sm text-gray-600">
              Mostrando {startIdx + 1} a {Math.min(endIdx, sorted.length)} de {sorted.length} produtos
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
