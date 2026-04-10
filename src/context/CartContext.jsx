import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Carregar dados do localStorage ao montar
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    const savedWishlist = localStorage.getItem('wishlist');
    
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Erro ao carregar carrinho', e);
      }
    }
    
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Erro ao carregar wishlist', e);
      }
    }
  }, []);

  // Salvar carrinho no localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Salvar wishlist no localStorage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Adicionar produto ao carrinho
  const addToCart = (product, quantity = 1, color = null, size = null) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.id === product.id && item.color === color && item.size === size
      );

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id && item.color === color && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity, color, size }];
      }
    });

    showNotification(`${product.name} adicionado ao carrinho!`, 'success');
  };

  // Remover produto do carrinho
  const removeFromCart = (productId, color = null, size = null) => {
    setCartItems(prevItems =>
      prevItems.filter(item => !(item.id === productId && item.color === color && item.size === size))
    );
    showNotification('Produto removido do carrinho', 'info');
  };

  // Atualizar quantidade no carrinho
  const updateQuantity = (productId, quantity, color = null, size = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId && item.color === color && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Limpar carrinho
  const clearCart = () => {
    setCartItems([]);
    showNotification('Carrinho limpo', 'info');
  };

  // Adicionar/remover da wishlist
  const toggleWishlist = (product) => {
    setWishlist(prevWishlist => {
      const exists = prevWishlist.find(item => item.id === product.id);
      
      if (exists) {
        showNotification(`${product.name} removido da lista de desejos`, 'info');
        return prevWishlist.filter(item => item.id !== product.id);
      } else {
        showNotification(`${product.name} adicionado à lista de desejos!`, 'success');
        return [...prevWishlist, product];
      }
    });
  };

  // Verificar se está na wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Mostrar notificação
  const showNotification = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const notification = { id, message, type };
    
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  };

  // Remover notificação
  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Calcular total do carrinho
  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.price || 0;
    return total + (price * item.quantity);
  }, 0);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const value = {
    // Carrinho
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,

    // Wishlist
    wishlist,
    toggleWishlist,
    isInWishlist,

    // Notificações
    notifications,
    showNotification,
    dismissNotification,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider');
  }
  return context;
}
