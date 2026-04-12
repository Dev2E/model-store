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
      {/* Hero Section */}
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