
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { productsService } from '../services/supabaseService';
import { ChevronDownIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Produto() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, isInWishlist, showNotification } = useCart();
  
  const [selectedColor, setSelectedColor] = useState('black');
  const [selectedSize, setSelectedSize] = useState(null); // Inicializa como null para forçar seleção
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const { data, error: fetchError } = await productsService.getProductById(id);
        if (fetchError) {
          setError(fetchError);
        } else {
          setProduct(data);
          setSelectedColor(data?.colors?.[0]?.name || 'black');
          setSelectedSize(null); // Sem tamanho pré-selecionado
          setQuantity(1);

          // Carregar produtos relacionados
          const { data: allProducts } = await productsService.getAllProducts();
          setRelatedProducts(
            allProducts
              ?.filter(p => p.id !== id)
              .slice(0, 4) || []
          );
          
          // Scroll para o topo
          window.scrollTo(0, 0);
        }
      } catch (err) {
        setError('Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    // Validar se tamanho foi selecionado (validação dupla)
    if (!selectedSize || selectedSize === null || selectedSize === '') {
      showNotification('ERRO: Você DEVE selecionar um tamanho!', 'error');
      return false;
    }

    // Validar se produto existe
    if (!product || !product.id) {
      showNotification('Erro: Produto não carregado', 'error');
      return false;
    }

    // Adicionar ao carrinho
    addToCart(product, quantity, selectedColor, selectedSize);
    return true;
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Carregando produto...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-600">{error || 'Produto não encontrado'}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Product Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12 px-4 sm:px-6 py-8 sm:py-12 max-w-7xl mx-auto">
        {/* Left Column - Images */}
        <div className="lg:col-span-2">
          {/* Main Image */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-600 rounded-lg h-64 sm:h-80 md:h-96 flex items-center justify-center text-6xl sm:text-8xl md:text-9xl mb-4 sm:mb-6">
            {product.image}
          </div>

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-300 h-24 sm:h-32 md:h-40 rounded-lg flex items-center justify-center text-4xl sm:text-5xl md:text-6xl cursor-pointer hover:opacity-80 transition">
                🖼️
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="lg:col-span-1 lg:sticky lg:top-24 lg:h-fit">
          <p className="text-xs font-semibold text-gray-500 mb-2">{product.collection}</p>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-manrope mb-4">{product.name}</h1>
          
          <p className="text-2xl sm:text-3xl font-bold mb-6">{formatCurrency(product.price)}</p>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="block text-xs sm:text-sm font-semibold mb-3">COR: {selectedColor.toUpperCase()}</label>
            <div className="flex gap-3 flex-wrap">
              {Array.isArray(product.colors) && product.colors.map((color) => {
                const colorObj = typeof color === 'string' ? { name: color, label: color } : color;
                return (
                  <button
                    key={colorObj.name}
                    onClick={() => setSelectedColor(colorObj.name)}
                    className={`w-10 h-10 rounded-full border-2 transition ${
                      selectedColor === colorObj.name
                        ? 'border-black'
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                    style={{
                      backgroundColor: 
                        colorObj.name === 'bone' ? '#f5deb3' :
                        colorObj.name === 'black' ? '#000' :
                        '#888'
                    }}
                    title={colorObj.label || colorObj.name}
                  />
                );
              })}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
              <label className="text-xs sm:text-sm font-semibold">
                SELECIONE O TAMANHO
                <span className="text-red-600 ml-1">*</span>
              </label>
              <a href="#" className="text-xs text-gray-600 hover:underline">Guia de Tamanhos</a>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
              {(Array.isArray(product.sizes) && product.sizes.length > 0 
                ? product.sizes 
                : ['P', 'M', 'G', 'GG']).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 px-2 sm:px-4 text-xs sm:text-sm font-semibold border transition ${
                    selectedSize === size
                      ? 'bg-black text-white border-black'
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Bag Button */}
          <button 
            onClick={handleAddToCart} 
            disabled={!selectedSize}
            className={`w-full font-semibold py-3 rounded transition mb-3 sm:mb-4 text-sm sm:text-base ${
              !selectedSize 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60' 
                : 'bg-gray-800 text-white hover:bg-gray-900'
            }`}
          >
            Adicionar à Sacola
          </button>
          
          {/* Add to Wishlist */}
          <button onClick={handleToggleWishlist} className={`w-full font-semibold py-3 rounded transition text-sm sm:text-base ${
            isInWishlist(product.id)
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}>
            {isInWishlist(product.id) ? '♥ Remover da Lista de Desejos' : 'Adicionar à Lista de Desejos'}
          </button>

          {/* Product Info Accordion */}
          <div className="mt-8 space-y-4 border-t border-gray-200 pt-8">
            {/* Details */}
            <details className="group cursor-pointer">
              <summary className="flex justify-between items-center py-3 font-semibold text-xs sm:text-sm list-none">
                Detalhes do Produto
                <ChevronDownIcon className="w-5 h-5 group-open:rotate-180 transition text-gray-600" />
              </summary>
              <p className="text-xs sm:text-sm text-gray-600 pb-4">{product.description}</p>
            </details>

            {/* Shipping */}
            <details className="group cursor-pointer">
              <summary className="flex justify-between items-center py-3 font-semibold text-xs sm:text-sm border-t border-gray-200 list-none">
                Envios e Devoluções
                <ChevronDownIcon className="w-5 h-5 group-open:rotate-180 transition text-gray-600" />
              </summary>
              <p className="text-xs sm:text-sm text-gray-600 pb-4">{product.shipping}</p>
            </details>

            {/* Sustainability */}
            <details className="group cursor-pointer">
              <summary className="flex justify-between items-center py-3 font-semibold text-xs sm:text-sm border-t border-gray-200 list-none">
                Sustentabilidade
                <ChevronDownIcon className="w-5 h-5 group-open:rotate-180 transition text-gray-600" />
              </summary>
              <p className="text-xs sm:text-sm text-gray-600 pb-4">{product.sustainability}</p>
            </details>
          </div>

          {/* Item Added Notification */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg flex gap-3 text-xs sm:text-sm hidden">
            <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold">Item adicionado</p>
              <p className="text-gray-600">1 item adicionado à sua sacola</p>
            </div>
          </div>
        </div>
      </section>

      {/* You Might Also Like */}
      <section className="px-4 sm:px-6 py-10 sm:py-16 max-w-7xl mx-auto border-t border-gray-200">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-manrope mb-6 sm:mb-8">Você também pode gostar</h2>

        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((relProduct) => (
              <Link key={relProduct.id} to={`/produto/${relProduct.id}`} className="group">
                <div className="bg-gray-300 h-40 sm:h-56 md:h-64 rounded-lg flex items-center justify-center text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 group-hover:bg-gray-400 transition">
                  {relProduct.image || '📦'}
                </div>
                <h3 className="font-semibold text-sm mb-2">{relProduct.name}</h3>
                <p className="text-lg font-bold">{formatCurrency(relProduct.price)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Nenhum produto relacionado encontrado</p>
        )}
      </section>
    </main>
  );
}
