import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { productsService } from '../services/supabaseService';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

export default function Produtos() {
  const { addToCart, showNotification } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(1000);
  const [sortBy, setSortBy] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtros avançados
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  // Modal para adicionar ao carrinho
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

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

  const uniqueCategories = [...new Set(allProducts.map(p => p.category || '').filter(c => c))];
  uniqueCategories.forEach(cat => {
    const count = allProducts.filter(p => p.category === cat).length;
    dataCategories.push({
      id: (cat || '').toLowerCase().replace(/\s+/g, '-'),
      name: cat,
      count: count
    });
  });

  const categories = dataCategories;

  // Extrair todos os tamanhos e cores únicos
  const allSizes = [...new Set(allProducts.flatMap(p => p.sizes || []))].sort();
  const allColorObjects = [...new Map(allProducts.flatMap(p => p.colors || []).map(c => [c.name, c])).values()];

  // Filtrar produtos
  const filtered = allProducts.filter(p => {
    const categoryMatch = selectedCategory === 'all' || 
                          (p.category || '').toLowerCase().replace(/\s+/g, '-') === selectedCategory ||
                          selectedCategory === 'all';
    const priceMatch = p.price <= priceRange;
    const searchMatch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de tamanho (se nenhum selecionado, mostra todos)
    const sizeMatch = selectedSizes.length === 0 || (p.sizes && selectedSizes.some(s => p.sizes.includes(s)));
    
    // Filtro de cor (se nenhuma selecionada, mostra todas)
    const colorMatch = selectedColors.length === 0 || (p.colors && selectedColors.some(sc => p.colors.some(pc => pc.name === sc)));
    
    return categoryMatch && priceMatch && searchMatch && sizeMatch && colorMatch;
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
  }, [selectedCategory, priceRange, sortBy, searchTerm, selectedSizes, selectedColors]);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="px-4 sm:px-6 py-8 sm:py-12 max-w-7xl mx-auto border-b border-gray-200">
        <p className="text-xs sm:text-sm font-semibold text-gray-500 mb-2">CATÁLOGO DIGITAL</p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-manrope mb-4">Objetos para o Estúdio Moderno</h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600">Coleção curada de essenciais minimalistas projetados para funcionalidade e longevidade.</p>
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 py-8 sm:py-12 max-w-7xl mx-auto">
        {/* Sidebar - Filters */}
        <div className="md:col-span-1">
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg md:sticky md:top-4 md:h-fit">
            {/* Search Filter */}
            <div className="mb-6 sm:mb-8">
              <h3 className="font-semibold text-xs sm:text-sm mb-3 sm:mb-4">🔍 Buscar</h3>
              <input
                type="text"
                placeholder="Procure por nome..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                disabled={loading}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-6 sm:mb-8">
              <h3 className="font-semibold text-xs sm:text-sm mb-3 sm:mb-4">Categoria</h3>
              <div className="space-y-2 sm:space-y-3">
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
                    <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700">{cat.name}</span>
                    <span className="ml-auto text-xs text-gray-500">{cat.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6 sm:mb-8">
              <h3 className="font-semibold text-xs sm:text-sm mb-3 sm:mb-4">Faixa de Preço</h3>
              <div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs sm:text-sm text-gray-600 mt-2">Até {formatCurrency(priceRange)}</p>
              </div>
            </div>

            {/* Size Filter */}
            {allSizes.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h3 className="font-semibold text-xs sm:text-sm mb-3 sm:mb-4">Tamanho</h3>
                <div className="space-y-2">
                  {allSizes.map((size) => (
                    <label key={size} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSizes([...selectedSizes, size]);
                          } else {
                            setSelectedSizes(selectedSizes.filter(s => s !== size));
                          }
                          setCurrentPage(1);
                        }}
                        disabled={loading}
                        className="w-4 h-4 disabled:cursor-not-allowed"
                      />
                      <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Color Filter */}
            {allColorObjects.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h3 className="font-semibold text-xs sm:text-sm mb-3 sm:mb-4">Cor</h3>
                <div className="space-y-2">
                  {allColorObjects.map((color) => (
                    <label key={color.name} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedColors([...selectedColors, color.name]);
                          } else {
                            setSelectedColors(selectedColors.filter(c => c !== color.name));
                          }
                          setCurrentPage(1);
                        }}
                        disabled={loading}
                        className="w-4 h-4 disabled:cursor-not-allowed"
                      />
                      <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700">{color.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-3">
          {/* Header with Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <p className="text-xs sm:text-sm text-gray-600">Mostrando {sorted.length} de {allProducts.length} produtos</p>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              disabled={loading}
              className="text-xs sm:text-sm border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100 w-full sm:w-auto"
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
              <p className="text-sm text-gray-600">Carregando produtos...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded p-4 sm:p-6 mb-8">
              <p className="text-xs sm:text-sm text-red-700">Erro ao carregar produtos: {error}</p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && sorted.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-8 sm:mb-12">
              {paginatedProducts.map((product) => (
                <div key={product.id} className="group overflow-hidden">
                  <Link to={`/produto/${product.id}`} className="block">
                    <div className="bg-gray-200 h-40 sm:h-56 md:h-64 rounded-lg flex items-center justify-center text-3xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 group-hover:bg-gray-300 transition relative overflow-hidden">
                      {product.image || '📦'}
                      <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white bg-opacity-90 px-2 sm:px-3 py-1 text-xs font-semibold rounded">
                        LIMITADO
                      </span>
                    </div>
                    <h3 className="font-semibold text-xs sm:text-sm mb-2 line-clamp-2">{product.name}</h3>
                  </Link>
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-base sm:text-lg font-bold">{formatCurrency(product.price)}</p>
                    <button 
                      onClick={() => {
                        setSelectedProductModal(product);
                        setSelectedSize(product.sizes?.[0] || '');
                        setSelectedColor(product.colors?.[0]?.name || '');
                        setQuantity(1);
                        setModalOpen(true);
                      }}
                      className="bg-gray-800 text-white rounded px-2 sm:px-3 py-1 text-xs font-semibold hover:bg-gray-900 transition opacity-0 group-hover:opacity-100"
                      title="Clique para adicionar ao carrinho"
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
              <p className="text-sm text-gray-600">Nenhum produto encontrado com esses critérios</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1 sm:gap-2 flex-wrap">
              <button 
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-2 sm:px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
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
                      className={`px-2 sm:px-4 py-2 rounded text-xs sm:text-sm ${
                        currentPage === page
                          ? 'bg-gray-800 text-white'
                          : 'border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if ((page === currentPage - 2 || page === currentPage + 2) && totalPages > 1) {
                  return <span key={`dots-${page}`} className="px-1 sm:px-2 text-xs">...</span>;
                }
                return null;
              })}
              <button 
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2 sm:px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
              >
                →
              </button>
            </div>
          )}
          
          {/* Info sobre página */}
          {sorted.length > 0 && (
            <div className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600">
              Mostrando {startIdx + 1} a {Math.min(endIdx, sorted.length)} de {sorted.length} produtos
            </div>
          )}
        </div>
      </div>

      {/* Modal de Adicionar ao Carrinho */}
      {modalOpen && selectedProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedProductModal.name}</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Cor */}
            {selectedProductModal.colors && selectedProductModal.colors.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Cor</label>
                <div className="flex flex-wrap gap-2">
                  {selectedProductModal.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`px-4 py-2 rounded border-2 transition ${
                        selectedColor === color.name
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 hover:border-gray-900'
                      }`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tamanho */}
            {selectedProductModal.sizes && selectedProductModal.sizes.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Tamanho</label>
                <div className="flex flex-wrap gap-2">
                  {selectedProductModal.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-2 rounded border-2 transition text-sm ${
                        selectedSize === size
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 hover:border-gray-900'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantidade */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Quantidade</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border border-gray-300 rounded py-1"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Preço */}
            <div className="mb-6 text-center">
              <p className="text-sm text-gray-600">Preço</p>
              <p className="text-2xl font-bold">
                {formatCurrency(selectedProductModal.price * quantity)}
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  addToCart(selectedProductModal, quantity, selectedColor, selectedSize);
                  showNotification('Produto adicionado ao carrinho!', 'success');
                  setModalOpen(false);
                }}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition font-semibold"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
