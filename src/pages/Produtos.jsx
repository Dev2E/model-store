import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { productsService } from '../services/supabaseService';

export default function Produtos() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(1000);
  const [sortBy, setSortBy] = useState('featured');
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
                <p className="text-sm text-gray-600 mt-2">Até R$ {priceRange.toLocaleString('pt-BR')},00</p>
              </div>
            </div>

            {/* Featured Banner */}
            <div className="bg-gray-300 h-40 rounded-lg flex items-center justify-center text-4xl overflow-hidden">
              🎨
            </div>
          </div>
        </div>

        {/* Products Grid */}
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
              {sorted.map((product) => (
                <div key={product.id} className="group">
                  <Link to={`/produto/${product.id}`} className="block">
                    <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center text-6xl mb-4 group-hover:bg-gray-300 transition relative">
                      {product.image || '📦'}
                      <span className="absolute top-3 right-3 bg-white bg-opacity-90 px-3 py-1 text-xs font-semibold rounded">
                        LIMITADO
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm mb-2">{product.name}</h3>
                  </Link>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold">R$ {product.price.toLocaleString('pt-BR')},00</p>
                    <button 
                      onClick={() => addToCart({ ...product, image: product.image || '📦' }, 1)}
                      className="bg-gray-800 text-white rounded px-3 py-1 text-xs font-semibold hover:bg-gray-900 transition opacity-0 group-hover:opacity-100"
                    >
                      Adicionar
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
          <div className="flex justify-center items-center gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100">←</button>
            <button className="px-4 py-2 bg-gray-800 text-white rounded">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">3</button>
            <span className="px-3 py-2">...</span>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">32</button>
            <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100">→</button>
          </div>
        </div>
      </div>
    </main>
  );
}
