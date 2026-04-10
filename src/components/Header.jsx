import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems = [] } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    setSidebarOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold font-manrope">
          Boutique
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/produtos" className={`text-sm font-semibold transition-colors ${
            location.pathname === '/produtos' 
              ? 'text-gray-900 border-b-2 border-gray-900 pb-1' 
              : 'text-gray-600 hover:text-gray-900'
          }`}>
            Produtos
          </Link>
          <Link to="/categorias" className={`text-sm font-semibold transition-colors ${
            location.pathname === '/categorias' 
              ? 'text-gray-900 border-b-2 border-gray-900 pb-1' 
              : 'text-gray-600 hover:text-gray-900'
          }`}>
            Categorias
          </Link>
          <Link to="/sobre" className={`text-sm font-semibold transition-colors ${
            location.pathname === '/sobre' 
              ? 'text-gray-900 border-b-2 border-gray-900 pb-1' 
              : 'text-gray-600 hover:text-gray-900'
          }`}>
            Sobre
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-6">
          {/* Cart */}
          <Link to="/carrinho" className="relative">
            <span className="text-2xl">🛍️</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth Status */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">
                Oi, {user?.user_metadata?.name || user?.email?.split('@')[0]}
              </span>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-2xl"
              >
                👤
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-semibold hover:text-gray-600">
              Entrar
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)}>
          <div
            className="fixed right-0 top-0 w-80 h-screen bg-white shadow-lg overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Close Button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="float-right text-2xl"
              >
                ✕
              </button>

              <h2 className="text-xl font-bold font-manrope mb-6 clear-both">Menu</h2>

              {/* Navigation */}
              <div className="space-y-4 mb-8">
                <Link
                  to="/produtos"
                  className="block text-sm font-semibold hover:text-gray-600"
                  onClick={() => setSidebarOpen(false)}
                >
                  Produtos
                </Link>
                <Link
                  to="/sobre"
                  className="block text-sm font-semibold hover:text-gray-600"
                  onClick={() => setSidebarOpen(false)}
                >
                  Sobre
                </Link>
                <Link
                  to="/contato"
                  className="block text-sm font-semibold hover:text-gray-600"
                  onClick={() => setSidebarOpen(false)}
                >
                  Contato
                </Link>
              </div>

              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="border-t pt-6">
                  <p className="font-semibold mb-4">
                    👤 {user?.user_metadata?.name || user?.email}
                  </p>
                  <div className="space-y-2">
                    <Link
                      to="/meu-perfil"
                      className="block text-sm font-semibold hover:text-gray-600 py-2"
                      onClick={() => setSidebarOpen(false)}
                    >
                      Meu Perfil
                    </Link>
                    <Link
                      to="/meus-pedidos"
                      className="block text-sm font-semibold hover:text-gray-600 py-2"
                      onClick={() => setSidebarOpen(false)}
                    >
                      Meus Pedidos
                    </Link>
                    <Link
                      to="/enderecos"
                      className="block text-sm font-semibold hover:text-gray-600 py-2"
                      onClick={() => setSidebarOpen(false)}
                    >
                      Meus Endereços
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block text-sm font-semibold hover:text-gray-600 py-2"
                      onClick={() => setSidebarOpen(false)}
                    >
                      Wishlist
                    </Link>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full mt-6 bg-red-600 text-white py-2 rounded font-semibold hover:bg-red-700 transition"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="border-t pt-6">
                  <Link
                    to="/login"
                    className="block w-full bg-gray-800 text-white py-2 rounded font-semibold text-center hover:bg-gray-900 transition mb-3"
                    onClick={() => setSidebarOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/criar-conta"
                    className="block w-full bg-gray-200 text-gray-800 py-2 rounded font-semibold text-center hover:bg-gray-300 transition"
                    onClick={() => setSidebarOpen(false)}
                  >
                    Criar Conta
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
