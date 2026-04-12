import { supabase } from '../lib/supabase';

// Autenticação
export const authService = {
  // Registrar novo usuário
  async signup(email, password, name) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message || error };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error?.message || 'Erro ao criar conta' };
    }
  },

  // Login
  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message || error };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error?.message || 'Erro ao fazer login' };
    }
  },

  // Logout
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  },

  // Get usuário atual
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Recuperar senha com código
  async sendPasswordResetCode(email) {
    try {
      // Gera código de 6 dígitos
      const code = Math.random().toString().slice(2, 8).padStart(6, '0');
      
      // Busca o usuário pelo email
      const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
      const user = users?.find(u => u.email === email);
      
      if (!user) {
        return { data: null, error: 'Usuário não encontrado' };
      }

      // Salva o código no banco
      const expiresAt = new Date(Date.now() + 15 * 60000).toISOString(); // 15 minutos
      
      const { data, error } = await supabase
        .from('password_reset_codes')
        .insert([
          {
            user_id: user.id,
            code,
            expires_at: expiresAt,
          },
        ])
        .select();

      // Aqui você integraria com seu serviço de email (SendGrid, Mailgun, etc)
      // Por enquanto, retorna o código (em produção, enviar por email)
      console.log(`Código de reset para ${email}: ${code}`);

      return { data: { code, user: { id: user.id, email } }, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Validar código e resetar senha
  async resetPasswordWithCode(email, code, newPassword) {
    try {
      // Busca o usuário
      const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
      const user = users?.find(u => u.email === email);
      
      if (!user) {
        return { data: null, error: 'Usuário não encontrado' };
      }

      // Verifica o código
      const { data: resetData, error: codeError } = await supabase
        .from('password_reset_codes')
        .select('*')
        .eq('user_id', user.id)
        .eq('code', code)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (codeError || !resetData) {
        return { data: null, error: 'Código inválido ou expirado' };
      }

      // Atualiza a senha
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: newPassword }
      );

      if (updateError) {
        return { data: null, error: updateError };
      }

      // Marca o código como usado
      await supabase
        .from('password_reset_codes')
        .update({ used: true })
        .eq('id', resetData.id);

      return { data: { message: 'Senha redefinida com sucesso' }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};

// Serviço de Pedidos
export const ordersService = {
  // Gerar número único de pedido
  generateOrderNumber() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // Últimos 2 dígitos do ano
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    
    return `PED-${year}${month}${day}-${hour}${minute}-${random}`;
  },

  // Criar novo pedido
  async createOrder(userId, orderData) {
    try {
      const orderNumber = this.generateOrderNumber();
      
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            user_id: userId,
            order_number: orderNumber,
            items: orderData.items || [],
            total: orderData.total || 0,
            status: 'pending',
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error('Erro ao criar pedido:', error);
        return { data: null, error: error.message || 'Erro ao criar pedido' };
      }

      return { data: data?.[0], error: null };
    } catch (error) {
      console.error('Exceção ao criar pedido:', error);
      return { data: null, error: error?.message || 'Erro desconhecido ao criar pedido' };
    }
  },

  // Obter pedidos do usuário
  async getUserOrders(userId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Obter detalhes de um pedido
  async getOrder(orderId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Atualizar status do pedido
  async updateOrderStatus(orderId, status) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
};

// Serviço de Usuários
export const usersService = {
  // Obter perfil do usuário
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users_profile')
        .select('*')
        .eq('id', userId)
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Atualizar perfil
  async updateUserProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('users_profile')
        .update(profileData)
        .eq('id', userId)
        .select();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Adicionar endereço
  async addAddress(userId, addressData) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .insert([
          {
            user_id: userId,
            ...addressData,
          },
        ])
        .select();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Obter endereços do usuário
  async getUserAddresses(userId) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
};

export default {
  authService,
  ordersService,
  usersService,
};

// Serviço de Produtos
export const productsService = {
  // Obter todos os produtos com nome da categoria
  async getAllProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:category_id (id, name)
        `)
        .eq('active', true)
        .order('created_at', { ascending: false });
      
      // Transformar dados para incluir category name como string
      const transformedData = data?.map(product => ({
        ...product,
        category: product.category?.name || null,
        categoryId: product.category_id
      })) || [];
      
      return { data: transformedData, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Obter um produto por ID
  async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Filtrar produtos por categoria
  async getProductsByCategory(category) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .eq('active', true);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Criar produto (admin)
  async createProduct(productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Atualizar produto (admin)
  async updateProduct(productId, productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId)
        .select();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Deletar produto (admin)
  async deleteProduct(productId) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      return { error };
    } catch (error) {
      return { error };
    }
  },
};

// Serviço de Admin
export const adminService = {
  // Obter todos os pedidos (admin)
  async getAllOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, users_profile(name, email)')
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Obter todos os clientes (admin)
  async getAllUsers() {
    try {
      // Tenta buscar de users_profile primeiro
      const { data: profileData, error: profileError } = await supabase
        .from('users_profile')
        .select('*')
        .order('created_at', { ascending: false });

      // Se users_profile está vazio, busca de auth.users via RPC
      if (!profileData || profileData.length === 0) {
        try {
          const { data: authUsers, error: authError } = await supabase
            .rpc('get_all_auth_users');
          
          if (authUsers && authUsers.length > 0) {
            return { data: authUsers, error: null };
          }
        } catch (rpcError) {
          console.log('RPC não disponível, usando dados de auth');
        }
      }

      return { data: profileData || [], error: profileError };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Atualizar role de usuário (admin)
  async updateUserRole(userId, role) {
    try {
      const { data, error } = await supabase
        .from('users_profile')
        .update({ role })
        .eq('id', userId)
        .select();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Verificar se usuário é admin
  async isUserAdmin(userId) {
    try {
      const { data, error } = await supabase
        .from('users_profile')
        .select('role')
        .eq('id', userId)
        .single();
      return { isAdmin: data?.role === 'admin', error };
    } catch (error) {
      return { isAdmin: false, error };
    }
  },

  // Obter todas as categorias
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name', { ascending: true });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
}
