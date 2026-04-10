import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/supabaseService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar se há usuário logado ao iniciar
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      setLoading(true);
      const { data, error } = await authService.getCurrentUser();
      if (error) {
        setUser(null);
      } else {
        setUser(data?.user || null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await authService.signup(email, password, name);
      if (error) {
        setError(error.message);
        return { success: false, error };
      }
      setUser(data?.user || null);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await authService.login(email, password);
      if (error) {
        setError(error.message);
        return { success: false, error };
      }
      setUser(data?.user || null);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await authService.logout();
      if (error) {
        setError(error.message);
        return { success: false, error };
      }
      setUser(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await authService.resetPassword(email);
      if (error) {
        setError(error.message);
        return { success: false, error };
      }
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    resetPassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
