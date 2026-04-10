import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1 */}
          <div>
            <h3 className="font-manrope font-bold text-lg mb-4">Vellenia Store</h3>
            <p className="text-sm text-gray-600">
              A galeria digital curada de produtos para viver bem em qualquer espaço.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Compras</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/produtos" className="hover:text-black">Todos os Produtos</Link></li>
              <li><Link to="/categorias" className="hover:text-black">Categorias</Link></li>
              <li><Link to="/produtos" className="hover:text-black">Novos Produtos</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Atendimento</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/contato" className="hover:text-black">Contato</Link></li>
              <li><a href="#" className="hover:text-black">Envios</a></li>
              <li><a href="#" className="hover:text-black">Devolução</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/politicas" className="hover:text-black">Privacidade</a></li>
              <li><a href="/politicas" className="hover:text-black">Termos</a></li>
              <li><Link to="/politicas" className="hover:text-black">Sustentabilidade</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 mb-4">
            <p>&copy; 2024 Vellenia Store. Todos os direitos reservados.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-black">Instagram</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-black">Facebook</a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:text-black">Pinterest</a>
            </div>
          </div>
          <div className="flex items-center gap-6 justify-center md:justify-end mb-4">
            <span className="text-2xl">🔒</span>
            <div className="text-xs text-gray-500">
              <p className="font-semibold">Site Seguro</p>
              <p>SSL Certificado</p>
            </div>
          </div>
          <p className="text-center md:text-right text-xs text-gray-500">Feito por <span className="font-semibold">2E</span></p>
        </div>
      </div>
    </footer>
  );
}
