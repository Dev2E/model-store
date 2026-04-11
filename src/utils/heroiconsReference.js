/**
 * HEROICONS - Guia de Importação e Uso
 * 
 * Existem 3 estilos disponíveis em heroicons:
 * 1. Outline (padrão) - ícones com traços finos
 * 2. Solid (preenchido) - ícones preenchidos
 * 3. Mini (pequeno) - versão compacta
 * 
 * IMPORTAÇÃO:
 * import { NomeDoIcone } from '@heroicons/react/24/outline';
 * import { NomeDoIcone } from '@heroicons/react/24/solid';
 * import { NomeDoIcone } from '@heroicons/react/24/mini';
 */

// EXEMPLOS DE ÍCONES MAIS USADOS:

export const HEROICONS_COMMON = {
  
  // Menu & Navigation
  MENU: 'Bars3Icon',           // ☰ Menu hamburger
  CLOSE: 'XMarkIcon',          // ✕ Fechar
  CHEVRON_DOWN: 'ChevronDownIcon',  // ⌄ Expandir
  
  // Shopping
  SHOPPING_CART: 'ShoppingCartIcon',  // 🛒 Carrinho
  SHOPPING_BAG: 'ShoppingBagIcon',    // 🛍️ Sacola
  
  // User & Account
  USER: 'UserIcon',               // 👤 Usuário
  USER_CIRCLE: 'UserCircleIcon',  // Usuário com círculo
  
  // Status
  CHECK_CIRCLE: 'CheckCircleIcon',      // ✓ Sucesso
  EXCLAMATION_CIRCLE: 'ExclamationCircleIcon',  // ⚠️ Aviso
  INFORMATION_CIRCLE: 'InformationCircleIcon',  // ℹ️ Informação
  
  // Common Actions
  SEARCH: 'MagnifyingGlassIcon',   // 🔍 Buscar
  STAR: 'StarIcon',                 // ⭐ Favorito
  HEART: 'HeartIcon',               // ❤️ Curtir
  EYE: 'EyeIcon',                   // 👁️ Ver
  TRASH: 'TrashIcon',               // 🗑️ Deletar
  EDIT: 'PencilIcon',               // ✏️ Editar
  
  // Package & Shipping
  PACKAGE: 'RectangleStackIcon',    // 📦 Pacote
  TRUCK: 'TruckIcon',               // 🚚 Entrega
  MAP_PIN: 'MapPinIcon',            // 📍 Localização
  
  // Other
  LOCK: 'LockClosedIcon',           // 🔒 Seguro
  PHONE: 'PhoneIcon',               // ☎️ Telefone
  ENVELOPE: 'EnvelopeIcon',         // 📧 Email
  CODE: 'CodeBracketIcon',          // Code
};

/**
 * EXEMPLO DE USO EM COMPONENTE:
 * 
 * import { ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline';
 * 
 * export default function Example() {
 *   return (
 *     <div>
 *       <ShoppingCartIcon className="w-6 h-6 text-gray-900" />
 *       <XMarkIcon className="w-6 h-6 text-gray-600 hover:text-black" />
 *     </div>
 *   );
 * }
 */

/**
 * TAMANHOS RECOMENDADOS:
 * 
 * - Tiny:        w-3 h-3   (12px)
 * - Small:       w-4 h-4   (16px) - padrão
 * - Base:        w-5 h-5   (20px) - recomendado
 * - Medium:      w-6 h-6   (24px) - ícones principais
 * - Large:       w-8 h-8   (32px) - hero sections
 * - Extra Large: w-12 h-12 (48px) - grandes
 */

/**
 * ÍCONES MAIS USADOS NO PROJETO:
 * 
 * Header.jsx:
 * - ShoppingCartIcon (carrinho)
 * - UserIcon (usuário)
 * - Bars3Icon (menu)
 * - XMarkIcon (fechar)
 * 
 * CookieNotice.jsx:
 * - XMarkIcon (fechar)
 * - CheckCircleIcon (aceitar)
 * 
 * Toast.jsx:
 * - CheckCircleIcon (sucesso)
 * - ExclamationCircleIcon (erro)
 * - InformationCircleIcon (info)
 * 
 * AdminDashboard.jsx:
 * - Squares2X2Icon (dashboard)
 * - PackageIcon (produtos)
 * - ShoppingCartIcon (pedidos)
 * - UserGroupIcon (clientes)
 * - TruckIcon (envios)
 * - DocumentTextIcon (logs)
 * - ArrowLeftOnRectangleIcon (sair)
 * 
 * MeusPedidos.jsx:
 * - EyeIcon (ver detalhes)
 * - TruckIcon (rastrear)
 * - CreditCardIcon (pagar)
 * 
 * Produto.jsx:
 * - StarIcon (avaliação)
 * - HeartIcon (favoritar)
 * - ChevronDownIcon (expandir)
 * 
 * Contato.jsx:
 * - ChevronDownIcon (expandir FAQ)
 * - PhoneIcon (telefone)
 * - EnvelopeIcon (email)
 * 
 * Footer.jsx:
 * - LockClosedIcon (seguro)
 */

// Lista completa de ícones disponíveis em heroicons:
// https://heroicons.com/
