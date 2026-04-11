import { supabase } from '../lib/supabase';

/**
 * STORE SERVICE
 * 
 * Operações CRUD e lógica de negócio para multi-tenant
 * Todos os queries devem filtrar por store_id automaticamente
 */

// ==========================================
// OPERAÇÕES DE LOJA
// ==========================================

export const storeService = {
  /**
   * Buscar loja por slug (público)
   * @param {string} slug - Slug único da loja
   */
  async getStoreBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  /**
   * Buscar all lojas do usuário (for admin)
   */
  async getUserStores(userId) {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('owner_id', userId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  /**
   * Criar nova loja
   */
  async createStore(storeData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('stores')
        .insert({
          owner_id: user.id,
          name: storeData.name,
          slug: storeData.slug,
          description: storeData.description,
          colors: storeData.colors,
          settings: storeData.settings,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  /**
   * Atualizar loja
   */
  async updateStore(storeId, updates) {
    try {
      const { data, error } = await supabase
        .from('stores')
        .update(updates)
        .eq('id', storeId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  /**
   * Deletar loja (apenas dono)
   */
  async deleteStore(storeId) {
    try {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', storeId);

      if (error) throw error;
      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // ==========================================
  // OPERAÇÕES DE PRODUTOS (COM FILTRO STORE_ID)
  // ==========================================

  /**
   * Buscar produtos de uma loja
   */
  async getStoreProducts(storeId, options = {}) {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .eq('active', true);

      // Paginação
      if (options.page && options.limit) {
        const offset = (options.page - 1) * options.limit;
        query = query.range(offset, offset + options.limit - 1);
      }

      // Ordenação
      if (options.sort) {
        query = query.order(options.sort, { ascending: options.ascending !== false });
      }

      const { data, error, count } = await query;

      if (error) throw error;
      return { data, count, error: null };
    } catch (error) {
      return { data: null, count: 0, error: error.message };
    }
  },

  /**
   * Adicionar produto a uma loja (admin)
   */
  async addProductToStore(storeId, productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          store_id: storeId,
          ...productData,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // ==========================================
  // OPERAÇÕES DE PEDIDOS (COM FILTRO STORE_ID)
  // ==========================================

  /**
   * Buscar pedidos de uma loja
   */
  async getStoreOrders(storeId, options = {}) {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .eq('store_id', storeId);

      // Filtros adicionais
      if (options.status) {
        query = query.eq('status', options.status);
      }

      if (options.dateFrom) {
        query = query.gte('created_at', options.dateFrom);
      }

      if (options.dateTo) {
        query = query.lte('created_at', options.dateTo);
      }

      // Paginação
      if (options.page && options.limit) {
        const offset = (options.page - 1) * options.limit;
        query = query.range(offset, offset + options.limit - 1);
      }

      // Ordenação
      if (options.sort) {
        query = query.order(options.sort, { ascending: false });
      }

      const { data, error, count } = await query;

      if (error) throw error;
      return { data, count, error: null };
    } catch (error) {
      return { data: null, count: 0, error: error.message };
    }
  },

  /**
   * Buscar estatísticas da loja
   */
  async getStoreStats(storeId, dateRange = '30d') {
    try {
      // Data inicial baseada em dateRange
      const dateFrom = new Date();
      if (dateRange === '7d') dateFrom.setDate(dateFrom.getDate() - 7);
      else if (dateRange === '30d') dateFrom.setDate(dateFrom.getDate() - 30);
      else if (dateRange === '90d') dateFrom.setDate(dateFrom.getDate() - 90);

      // Total vendido
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total')
        .eq('store_id', storeId)
        .gte('created_at', dateFrom.toISOString());

      if (ordersError) throw ordersError;

      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const totalOrders = orders.length;

      return {
        data: {
          totalRevenue,
          totalOrders,
          averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
          dateRange
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },
};

/**
 * EXEMPLO DE USO:
 * 
 * // Buscar loja por slug (público)
 * const { data: store } = await storeService.getStoreBySlug('minha-loja');
 * 
 * // Buscar produtos de uma loja
 * const { data: products } = await storeService.getStoreProducts(storeId, {
 *   sort: 'price',
 *   page: 1,
 *   limit: 10
 * });
 * 
 * // Buscar pedidos da loja (admin)
 * const { data: orders } = await storeService.getStoreOrders(storeId, {
 *   status: 'completed',
 *   dateFrom: '2026-04-01',
 *   dateTo: '2026-04-30'
 * });
 * 
 * // Estatísticas
 * const { data: stats } = await storeService.getStoreStats(storeId, '30d');
 */
