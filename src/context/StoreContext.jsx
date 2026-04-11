import { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext(null);

export function StoreProvider({ children, storeSlug }) {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStore = async () => {
      try {
        setLoading(true);
        setError(null);

        // Se for rota /loja/[slug], carregar loja específica
        // Senão, usar loja padrão ou contexto do proprietário
        
        if (storeSlug) {
          // Buscar por slug público
          const response = await fetch(`/api/stores/${storeSlug}`);
          const data = await response.json();
          setStore(data);
        } else {
          // Usuário logado vê sua própria loja
          // TODO: Implementar busca de loja do usuário current
          setStore(null);
        }
      } catch (err) {
        console.error('Erro ao carregar loja:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStore();
  }, [storeSlug]);

  return (
    <StoreContext.Provider value={{ store, loading, error }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore deve ser usado dentro de StoreProvider');
  }
  return context;
}

/**
 * ESTRUTURA DE STORE
 * 
 * {
 *   id: "uuid",
 *   owner_id: "uuid",
 *   name: "Minha Loja",
 *   slug: "minha-loja",
 *   description: "Descrição...",
 *   colors: {
 *     primary: "#000000",
 *     secondary: "#ffffff",
 *     accent: "#ef4444"
 *   },
 *   logo_url: "https://...",
 *   favicon_url: "https://...",
 *   address: {
 *     street: "Rua X",
 *     number: "123",
 *     city: "São Paulo",
 *     state: "SP",
 *     zip_code: "01234-567"
 *   },
 *   settings: {
 *     currency: "BRL",
 *     language: "pt-BR",
 *     timezone: "America/Sao_Paulo",
 *     accept_orders: true,
 *     sandbox_mode: true
 *   },
 *   created_at: "2026-04-11T...",
 *   updated_at: "2026-04-11T..."
 * }
 */
