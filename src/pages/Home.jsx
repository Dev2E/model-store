import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/supabaseService';
// Importado do cliente Supabase centralizado
import { supabase } from "../lib/supabase";
import { formatCurrency } from '../utils/formatters';

export default function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  // 1. Criamos o estado para guardar os produtos que vêm do banco
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slides do Herói
  const heroSlides = [
    {
      id: 1,
      title: 'Coleção Primavera',
      subtitle: 'Cores vibrantes e roupas leves para a estação',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&h=600&fit=crop',
      color: 'from-pink-100 to-orange-100'
    },
    {
      id: 2,
      title: 'Minimalismo Urbano',
      subtitle: 'Peças essenciais para o dia a dia',
      image: 'https://images.unsplash.com/photo-1485969962222-b8430a75612b?w=1200&h=600&fit=crop',
      color: 'from-blue-100 to-gray-100'
    },
    {
      id: 3,
      title: 'Elegância Atemporal',
      subtitle: 'Peças que transcendem as estações',
      image: 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=1200&h=600&fit=crop',
      color: 'from-purple-100 to-blue-100'
    }
  ];

  // Auto-slide a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Verificar se é admin e redirecionar
  useEffect(() => {
    const checkAdminRedirect = async () => {
      if (isAuthenticated && user?.id) {
        try {
          const { isAdmin } = await adminService.isUserAdmin(user.id);
          if (isAdmin) {
            navigate('/admin');
          }
        } catch (err) {
          console.error('Erro ao verificar admin:', err);
        }
      }
    };

    checkAdminRedirect();
  }, [isAuthenticated, user, navigate]);

  // Mantemos as categorias focadas em ROUPAS
  const categories = [
    { id: 'camisetas', name: 'Camisetas', image: '👕' },
    { id: 'calcas', name: 'Calças', image: '👖' },
    { id: 'blazers', name: 'Blazers', image: '🧥' },
    { id: 'vestidos', name: 'Vestidos', image: '👗' },
  ];

  // 2. Buscamos os produtos do Supabase assim que a página carrega
  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('active', true)
          .limit(4); // Puxamos apenas 4 para não quebrar o seu grid de destaques

        if (error) throw error;
        
        setFeaturedProducts(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Carousel Hero Section */}
      <section className="relative w-full h-96 sm:h-[500px] md:h-[600px] overflow-hidden bg-gray-200">
        {/* Slides */}
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay escuro para melhor legibilidade */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-manrope mb-3 sm:mb-4">
                {slide.title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl">
                {slide.subtitle}
              </p>
              <Link to="/produtos" className="inline-block">
                <button className="bg-white text-gray-900 px-6 sm:px-8 py-2 sm:py-3 rounded-md hover:bg-gray-100 transition font-semibold text-sm sm:text-base">
                  Explorar Agora
                </button>
              </Link>
            </div>
          </div>
        ))}

        {/* Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 text-gray-900 p-2 rounded-full transition z-10"
          aria-label="Slide anterior"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 text-gray-900 p-2 rounded-full transition z-10"
          aria-label="Próximo slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      {/* Hero Section - MANTÉM ORIGINAL COMO FALLBACK */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-6 py-10 sm:py-16 max-w-7xl mx-auto">
        {/* Text Content */}
        <div className="flex flex-col justify-center">
          <p className="text-xs sm:text-sm font-semibold text-gray-500 mb-2">VELLENIA STORE 2026</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-manrope leading-tight mb-4 sm:mb-6">
            Moda Contemporânea.
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
            Descubra uma seleção curada de peças que combinam estilo, qualidade e conforto. Cada item foi selecionado para trazer sofisticação ao seu guarda-roupa.
          </p>
          <Link to="/produtos" className="inline-block">
            <button className="bg-gray-900 text-white px-4 sm:px-6 py-3 rounded-md hover:bg-gray-800 transition text-sm sm:text-base">
              Explorar Coleção
            </button>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="bg-gray-200 rounded-lg h-64 sm:h-80 md:h-96 lg:h-full flex items-center justify-center text-5xl sm:text-6xl shadow-inner">
          👔
        </div>
      </section>

      {/* Carrossel de Produtos em Destaque */}
      {!loading && featuredProducts.length > 0 && (
        <section className="px-4 sm:px-6 py-10 sm:py-16 max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-manrope mb-6 sm:mb-8">Novidades da Semana</h2>
          
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 sm:gap-6 pb-4">
              {featuredProducts.map((product) => (
                <Link key={product.id} to={`/produto/${product.id}`} className="flex-shrink-0 w-40 sm:w-56">
                  <div className="group cursor-pointer">
                    <div className="bg-gray-100 rounded-lg h-40 sm:h-56 flex items-center justify-center text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:bg-gray-200 transition duration-300">
                      {product.image}
                    </div>
                    <h3 className="font-semibold text-xs sm:text-sm mb-1 text-gray-800 group-hover:text-black transition truncate">
                      {product.name}
                    </h3>
                    <p className="text-base sm:text-lg font-bold text-gray-900">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="px-4 sm:px-6 py-10 sm:py-16 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-manrope">Compre por Categoria</h2>
          <a href="#" className="text-xs sm:text-sm font-semibold text-gray-800 hover:underline">VER TODAS AS CATEGORIAS</a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {categories.map((category) => (
            <Link key={category.id} to={`/produtos?categoria=${category.id}`}>
              <div className="bg-gray-100 rounded-lg h-40 sm:h-56 md:h-64 flex items-center justify-center text-4xl sm:text-5xl md:text-6xl cursor-pointer hover:bg-gray-200 transition duration-300">
                {category.image}
              </div>
              <h3 className="mt-3 sm:mt-4 font-semibold text-sm sm:text-base md:text-lg text-gray-800">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products - AGORA DINÂMICO! */}
      <section className="px-4 sm:px-6 py-10 sm:py-16 max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-manrope mb-6 sm:mb-8">Destaques</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 animate-pulse text-sm sm:text-base">Carregando coleção...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/produto/${product.id}`}>
                <div className="group cursor-pointer">
                  <div className="bg-gray-100 rounded-lg h-40 sm:h-56 md:h-64 flex items-center justify-center text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 group-hover:bg-gray-200 transition duration-300">
                    {/* Usamos o emoji que está salvo no banco de dados temporariamente */}
                    {product.image}
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm mb-1 text-gray-800 group-hover:text-black transition truncate">
                    {product.name}
                  </h3>
                  <p className="text-base sm:text-lg font-bold text-gray-900">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Article Section */}
      <section className="px-4 sm:px-6 py-10 sm:py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="bg-gray-200 h-64 sm:h-80 md:h-96 rounded-lg flex items-center justify-center text-5xl sm:text-6xl">
            🪴
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">ARTIGO EM DESTAQUE</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-manrope mb-4 sm:mb-6 text-gray-900">
              A Arte de Viver Bem em Pequenos Espaços.
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 sm:mb-8">
              Descubra como o design minimalista está revolucionando a vida urbana. Neste artigo, conversamos com arquitetos sobre a intersecção entre utilidade e beleza na casa moderna.
            </p>
            <a href="#" className="font-bold text-gray-900 flex items-center gap-2 hover:gap-4 transition-all text-sm sm:text-base">
              LER ARTIGO
              <span className="text-xl">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="px-4 sm:px-6 py-10 sm:py-16 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-manrope">Estilizado por Você</h2>
          <a href="#" className="text-xs sm:text-sm font-semibold text-gray-800 hover:underline">Marque @boutique_digital</a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-gray-100 hover:bg-gray-200 transition h-32 sm:h-40 md:h-48 rounded-lg flex items-center justify-center text-2xl sm:text-3xl md:text-4xl cursor-pointer">
              📸
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}