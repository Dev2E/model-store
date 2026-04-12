import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { adminService, productsService } from '../services/supabaseService';
import { storageService } from '../services/storageService';
import { formatCurrency } from '../utils/formatters';

export default function AdminProdutos() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newColor, setNewColor] = useState({ name: '', label: '' });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    collection: '',
    stock: '',
    image: '',
    shipping: '',
    sustainability: '',
    image_path: '',
    sizes: [],
    colors: [],
    active: true
  });

  const sizesOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const checkAdminAndLoadProducts = async () => {
      try {
        const { isAdmin } = await adminService.isUserAdmin(user?.id);
        
        if (!isAdmin) {
          navigate('/');
          return;
        }

        const { data, error: productsError } = await productsService.getAllProducts();
        
        if (productsError) {
          setError('Erro ao carregar produtos');
          showNotification('Erro ao carregar produtos', 'error');
        } else {
          setProducts(data || []);
        }

        // Carregar categorias
        const { data: catsData, error: catsError } = await adminService.getCategories();
        if (!catsError && catsData) {
          setCategories(catsData);
        }
      } catch (err) {
        console.error('Error:', err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoadProducts();
  }, [user?.id, isAuthenticated, navigate, showNotification]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => {
      const sizes = prev.sizes || [];
      if (sizes.includes(size)) {
        return { ...prev, sizes: sizes.filter(s => s !== size) };
      } else {
        return { ...prev, sizes: [...sizes, size] };
      }
    });
  };

  const handleAddColor = () => {
    if (newColor.name && newColor.label) {
      setFormData(prev => ({
        ...prev,
        colors: [...(prev.colors || []), { ...newColor }]
      }));
      setNewColor({ name: '', label: '' });
    }
  };

  const handleRemoveColor = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    
    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = formData.image;
      let imagePath = formData.image_path;

      // Se há arquivo de imagem para upload
      if (imageFile) {
        setUploadingImage(true);
        
        // Se é edição e já tinha imagem, deletar a antiga
        if (editingId && imagePath) {
          await storageService.deleteImage(imagePath);
        }

        // Upload da nova imagem
        const { url, path, error: uploadError } = await storageService.uploadImage(imageFile, 'products');
        
        if (uploadError) {
          setUploadingImage(false);
          showNotification(`Erro ao fazer upload: ${uploadError}`, 'error');
          setSubmitting(false);
          return;
        }

        imageUrl = url;
        imagePath = path;
        setUploadingImage(false);
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        collection: formData.collection || null,
        stock: parseInt(formData.stock) || 0,
        image: imageUrl,
        image_path: imagePath,
        shipping: formData.shipping || null,
        sustainability: formData.sustainability || null,
        active: true,
      };

      let response;
      if (editingId) {
        response = await productsService.updateProduct(editingId, productData);
      } else {
        response = await productsService.createProduct(productData);
      }

      if (response.error) {
        showNotification('Erro ao salvar produto', 'error');
        return;
      }

      showNotification(editingId ? 'Produto atualizado!' : 'Produto criado!', 'success');

      // Recarrega produtos
      const { data } = await productsService.getAllProducts();
      setProducts(data || []);

      // Limpa formulário
      resetForm();
    } catch (err) {
      console.error('Error:', err);
      showNotification('Erro ao conectar', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      collection: '',
      stock: '',
      image: '',
      shipping: '',
      sustainability: '',
      image_path: '',
      sizes: [],
      colors: [],
      active: true
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setShowForm(false);
    setNewColor({ name: '', label: '' });
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      collection: product.collection || '',
      stock: product.stock || '',
      image: product.image || '',
      shipping: product.shipping || '',
      sustainability: product.sustainability || '',
      image_path: product.image_path || '',
    });
    setImagePreview(product.image || null);
    setImageFile(null);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Tem certeza que deseja deletar este produto?')) return;

    try {
      // Buscar produto para pegar o path da imagem
      const product = products.find(p => p.id === productId);
      
      // Deletar imagem do Storage se existir
      if (product?.image_path) {
        await storageService.deleteImage(product.image_path);
      }

      // Deletar produto do banco
      const { error } = await productsService.deleteProduct(productId);
      
      if (error) {
        showNotification('Erro ao deletar produto', 'error');
        return;
      }

      showNotification('Produto deletado!', 'success');
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      console.error('Error:', err);
      showNotification('Erro ao conectar', 'error');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100">
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold font-manrope">Gerenciar Produtos</h1>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-gray-800 text-white px-4 py-2 rounded font-semibold hover:bg-gray-900"
            >
              + Novo Produto
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-12">
            <h2 className="text-2xl font-bold font-manrope mb-6">
              {editingId ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Nome</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Preço</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Descrição</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
                  disabled={submitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Categoria</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
                    disabled={submitting}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Coleção</label>
                  <input
                    type="text"
                    name="collection"
                    value={formData.collection}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Estoque</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Upload de Imagem</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
                    disabled={submitting || uploadingImage}
                  />
                  {uploadingImage && <p className="text-sm text-blue-600 mt-2">Enviando imagem...</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Envio</label>
                  <input
                    type="text"
                    name="shipping"
                    value={formData.shipping}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Preview da imagem */}
              {imagePreview && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Preview da Imagem</label>
                  <div className="border border-gray-300 rounded p-4 bg-gray-50">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2">Sustentabilidade</label>
                <input
                  type="text"
                  name="sustainability"
                  value={formData.sustainability}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-800"
                  disabled={submitting}
                />
              </div>

              {/* TAMANHOS */}
              <div>
                <label className="block text-sm font-semibold mb-3">Tamanhos</label>
                <div className="grid grid-cols-3 gap-3">
                  {sizesOptions.map(size => (
                    <label key={size} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.sizes.includes(size)}
                        onChange={() => handleSizeToggle(size)}
                        disabled={submitting}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* CORES */}
              <div>
                <label className="block text-sm font-semibold mb-2">Cores</label>
                <div className="space-y-3 mb-4">
                  {(formData.colors || []).map((color, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-50 p-3 rounded">
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{color.label}</p>
                        <p className="text-xs text-gray-500">{color.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(idx)}
                        disabled={submitting}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Nome da cor (ex: black)"
                    value={newColor.name}
                    onChange={(e) => setNewColor({...newColor, name: e.target.value})}
                    disabled={submitting}
                    className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-800"
                  />
                  <input
                    type="text"
                    placeholder="Label (ex: Preto)"
                    value={newColor.label}
                    onChange={(e) => setNewColor({...newColor, label: e.target.value})}
                    disabled={submitting}
                    className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-800"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddColor}
                  disabled={submitting || !newColor.name || !newColor.label}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 disabled:opacity-50"
                >
                  + Adicionar Cor
                </button>
              </div>

              {/* STATUS */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    disabled={submitting}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold">Produto Ativo</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="flex-1 bg-gray-800 text-white py-3 font-semibold hover:bg-gray-900 rounded disabled:opacity-50"
                >
                  {submitting ? (uploadingImage ? 'Salvando imagem...' : 'Salvando...') : 'Salvar Produto'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 font-semibold hover:bg-gray-300 rounded"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Produto</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Preço</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Categoria</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Estoque</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold">{product.name}</td>
                    <td className="px-6 py-4 text-sm">{formatCurrency(product.price)}</td>
                    <td className="px-6 py-4 text-sm">{product.category}</td>
                    <td className="px-6 py-4 text-sm">{product.stock}</td>
                    <td className="px-6 py-4 text-sm space-x-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 font-semibold hover:text-blue-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 font-semibold hover:text-red-700"
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
