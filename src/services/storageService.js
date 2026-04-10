import { supabase } from '../lib/supabase';

// Serviço para gerenciar uploads no Storage do Supabase
export const storageService = {
  // Bucket name - altere para o nome do seu bucket se for diferente
  BUCKET_NAME: 'produtos',

  /**
   * Upload de imagem para o Storage
   * @param {File} file - Arquivo de imagem
   * @param {string} folder - Pasta dentro do bucket (ex: 'products', 'users')
   * @returns {Promise<{url: string, path: string, error?: string}>}
   */
  async uploadImage(file, folder = 'products') {
    try {
      if (!file) {
        return { url: null, path: null, error: 'Arquivo não selecionado' };
      }

      // Validar tipo de arquivo
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        return { url: null, path: null, error: 'Tipo de arquivo inválido. Use JPG, PNG, WebP ou GIF.' };
      }

      // Validar tamanho (máx 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return { url: null, path: null, error: 'Arquivo muito grande. Máximo 5MB.' };
      }

      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}-${randomId}.${fileExtension}`;
      const filePath = `${folder}/${fileName}`;

      // Upload do arquivo
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        return { url: null, path: null, error: error.message };
      }

      // Obter URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      return { url: publicUrl, path: filePath, error: null };
    } catch (err) {
      return { url: null, path: null, error: err.message };
    }
  },

  /**
   * Upload de múltiplas imagens
   * @param {File[]} files - Array de arquivos
   * @param {string} folder - Pasta dentro do bucket
   * @returns {Promise<{urls: string[], paths: string[], errors: string[]}>}
   */
  async uploadMultipleImages(files, folder = 'products') {
    const results = {
      urls: [],
      paths: [],
      errors: [],
    };

    for (const file of files) {
      const { url, path, error } = await this.uploadImage(file, folder);
      if (error) {
        results.errors.push(`${file.name}: ${error}`);
      } else {
        results.urls.push(url);
        results.paths.push(path);
      }
    }

    return results;
  },

  /**
   * Deletar imagem do Storage
   * @param {string} filePath - Caminho do arquivo no bucket
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async deleteImage(filePath) {
    try {
      if (!filePath) {
        return { success: false, error: 'Caminho do arquivo não fornecido' };
      }

      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Deletar múltiplas imagens
   * @param {string[]} filePaths - Array de caminhos de arquivos
   * @returns {Promise<{successCount: number, errorCount: number, errors: string[]}>}
   */
  async deleteMultipleImages(filePaths) {
    const results = {
      successCount: 0,
      errorCount: 0,
      errors: [],
    };

    for (const filePath of filePaths) {
      const { success, error } = await this.deleteImage(filePath);
      if (success) {
        results.successCount++;
      } else {
        results.errorCount++;
        results.errors.push(`${filePath}: ${error}`);
      }
    }

    return results;
  },

  /**
   * Substituir imagem (delete old + upload new)
   * @param {string} oldFilePath - Caminho da imagem antiga
   * @param {File} newFile - Novo arquivo
   * @param {string} folder - Pasta dentro do bucket
   * @returns {Promise<{url: string, path: string, error?: string}>}
   */
  async replaceImage(oldFilePath, newFile, folder = 'products') {
    try {
      // Delete old image
      if (oldFilePath) {
        await this.deleteImage(oldFilePath);
      }

      // Upload new image
      const { url, path, error } = await this.uploadImage(newFile, folder);
      return { url, path, error };
    } catch (err) {
      return { url: null, path: null, error: err.message };
    }
  },
};
