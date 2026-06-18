'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Plus, Search, Trash2, LayoutGrid, CheckCircle, XCircle, Pencil } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  order: number;
  imageUrl?: string;
  section?: 'Men' | 'Women' | 'Accessories';
  parentCategory?: {
    _id: string;
    name: string;
    slug: string;
  } | null;
}

export default function ManageCategories() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Create / Edit Category State
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatImageUrl, setNewCatImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categoryType, setCategoryType] = useState<'navbar' | 'subcategory'>('navbar');
  const [newCatSection, setNewCatSection] = useState<'Men' | 'Women' | 'Accessories'>('Men');
  const [newCatParentId, setNewCatParentId] = useState('');
  
  useEffect(() => {
    if (!user || !['admin', 'coadmin'].includes(user.role)) {
      router.push('/');
      return;
    }
    fetchCategories();
  }, [user, router]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/categories/admin');
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await api.post('/api/upload', formData, config);
      setNewCatImageUrl(data.url);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setNewCatName('');
    setNewCatSlug('');
    setNewCatImageUrl('');
    setNewCatParentId('');
    setCategoryType('navbar');
    setNewCatSection('Men');
    setIsCreating(false);
    setEditingCategory(null);
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatSlug) return;
    if (categoryType === 'subcategory' && !newCatParentId) {
      alert('Please select a parent category');
      return;
    }
    
    const parent = categories.find(c => c._id === newCatParentId);
    const section = categoryType === 'navbar' ? newCatSection : parent?.section;
    const parentCategory = categoryType === 'subcategory' ? newCatParentId : null;
    
    try {
      if (editingCategory) {
        await api.put(`/api/categories/${editingCategory._id}`, {
          name: newCatName,
          slug: newCatSlug,
          imageUrl: newCatImageUrl,
          section,
          parentCategory
        });
      } else {
        await api.post('/api/categories', { 
          name: newCatName, 
          slug: newCatSlug, 
          imageUrl: newCatImageUrl,
          section,
          parentCategory
        });
      }
      resetForm();
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || `Failed to ${editingCategory ? 'update' : 'create'} category`);
    }
  };

  const deleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? Products within it will not be deleted.')) {
      try {
        await api.delete(`/api/categories/${id}`);
        setCategories(categories.filter((c) => c._id !== id));
      } catch (err) {
        alert('Failed to delete category');
      }
    }
  };

  const toggleCategoryStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/api/categories/${id}`, { isActive: !currentStatus });
      setCategories(categories.map(c => c._id === id ? { ...c, isActive: !currentStatus } : c));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const startEdit = (cat: Category) => {
    setEditingCategory(cat);
    setNewCatName(cat.name);
    setNewCatSlug(cat.slug);
    setNewCatImageUrl(cat.imageUrl || '');
    setCategoryType(cat.parentCategory ? 'subcategory' : 'navbar');
    setNewCatSection(cat.section || 'Men');
    
    let pId = '';
    if (cat.parentCategory) {
      pId = typeof cat.parentCategory === 'string' 
        ? cat.parentCategory 
        : (cat.parentCategory._id || '');
    }
    setNewCatParentId(pId);
    setIsCreating(false);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewCategoryClick = () => {
    if (isCreating || editingCategory) {
      resetForm();
    } else {
      setIsCreating(true);
    }
  };

  // Auto-generate slug from name
  useEffect(() => {
    if (isCreating && newCatName && !newCatSlug) {
      setNewCatSlug(newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  }, [newCatName, isCreating, newCatSlug]);

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full py-4 text-foreground">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bebas text-black dark:text-white tracking-widest uppercase flex items-center">
              <LayoutGrid className="mr-3 text-[#ff0033]" /> Manage Categories
            </h1>
            <p className="text-zinc-500 dark:text-gray-400 font-poppins text-sm mt-1">Organize your store collections dynamically.</p>
          </div>
          <button 
            onClick={handleNewCategoryClick}
            className="flex items-center justify-center space-x-2 bg-[#ff0033] hover:bg-[#cc0029] text-white px-6 py-3 rounded-lg font-montserrat font-bold tracking-widest uppercase text-sm transition-all shadow-[0_0_15px_rgba(255,0,51,0.3)] cursor-pointer"
          >
            {(isCreating || editingCategory) ? <XCircle size={18} /> : <Plus size={18} />}
            <span>{(isCreating || editingCategory) ? 'Cancel' : 'New Category'}</span>
          </button>
        </div>

        {/* Create / Edit Form */}
        {(isCreating || editingCategory) && (
          <form onSubmit={handleSubmitCategory} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-6 mb-8 backdrop-blur-md">
            <h2 className="text-xl font-bebas text-black dark:text-white tracking-widest uppercase mb-6">
              {editingCategory ? 'Edit Collection' : 'Create New Collection'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Category Name</label>
                <input required type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none transition-colors" placeholder="e.g. Winter Jackets" />
              </div>
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">URL Slug</label>
                <input required type="text" value={newCatSlug} onChange={e => setNewCatSlug(e.target.value)} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none transition-colors" placeholder="winter-jackets" />
              </div>
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Category Type</label>
                <select 
                  value={categoryType} 
                  onChange={e => setCategoryType(e.target.value as 'navbar' | 'subcategory')} 
                  className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none transition-colors font-poppins"
                >
                  <option value="navbar">Navbar Category (Top-level)</option>
                  <option value="subcategory">Subcategory</option>
                </select>
              </div>
              {categoryType === 'navbar' ? (
                <div>
                  <label className="block text-xs font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Section</label>
                  <select 
                    value={newCatSection} 
                    onChange={e => setNewCatSection(e.target.value as 'Men' | 'Women' | 'Accessories')} 
                    className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none transition-colors font-poppins"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Parent Category</label>
                  <select 
                    required
                    value={newCatParentId} 
                    onChange={e => setNewCatParentId(e.target.value)} 
                    className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none transition-colors font-poppins"
                  >
                    <option value="">Select Parent Category...</option>
                    {categories.filter(c => !c.parentCategory && c._id !== editingCategory?._id).map(c => (
                      <option key={c._id} value={c._id}>
                        {c.name} {c.section ? `(${c.section})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-xs font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Category Image / Circular Icon</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={uploadImage}
                  disabled={uploadingImage}
                  className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-2.5 text-black dark:text-white outline-none transition-colors file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#ff0033] file:text-white hover:file:bg-[#cc0029] disabled:opacity-50" 
                />
                {uploadingImage && <p className="text-xs text-[#ff0033] mt-2 animate-pulse font-poppins">Uploading to Cloudinary...</p>}
                {newCatImageUrl && !uploadingImage && (
                  <div className="mt-3 relative w-16 h-16 rounded-full overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950">
                    <img src={newCatImageUrl} alt="Category Icon Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            <button type="submit" className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-8 py-3 rounded-lg font-montserrat font-bold tracking-widest uppercase text-sm transition-colors shadow-[0_0_15px_rgba(255,0,51,0.3)] cursor-pointer">
              {editingCategory ? 'Update Category' : 'Save Category'}
            </button>
          </form>
        )}

        {/* Search Bar */}
        <div className="relative w-full mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search categories..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-3 text-black dark:text-white outline-none transition-colors font-poppins text-sm"
          />
        </div>

        {/* Categories Table */}
        <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm dark:shadow-none">
          <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-zinc-50 dark:bg-[#161616] z-10">
                <tr className="border-b border-zinc-200 dark:border-white/10">
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-zinc-500 dark:text-gray-500 uppercase font-medium">Category Name</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-zinc-500 dark:text-gray-500 uppercase font-medium">Type</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-zinc-500 dark:text-gray-500 uppercase font-medium">Section</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-zinc-500 dark:text-gray-500 uppercase font-medium">Parent Category</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-zinc-500 dark:text-gray-500 uppercase font-medium">Slug / URL</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-zinc-500 dark:text-gray-500 uppercase font-medium">Visibility</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-zinc-500 dark:text-gray-500 uppercase font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center">
                      <div className="flex justify-center items-center space-x-3 text-zinc-500 dark:text-gray-400">
                        <div className="w-5 h-5 border-2 border-[#ff0033] border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-poppins text-sm">Loading categories...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-zinc-500 dark:text-gray-500 font-poppins text-sm">
                      No categories found. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => (
                    <tr key={category._id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors border-b border-zinc-100 dark:border-white/5">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {category.imageUrl ? (
                            <img src={category.imageUrl} alt={category.name} className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-white/5" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-white/5 border border-zinc-300 dark:border-white/5 flex items-center justify-center text-[#ff0033] font-bebas text-[10px]">
                              {category.name.charAt(0)}
                            </div>
                          )}
                          <p className="text-zinc-800 dark:text-white font-bold font-poppins">{category.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-poppins text-sm text-zinc-700 dark:text-gray-300">
                        {category.parentCategory ? 'Subcategory' : 'Navbar Category'}
                      </td>
                      <td className="px-6 py-4 font-poppins text-sm text-zinc-700 dark:text-gray-300">
                        {category.section || '-'}
                      </td>
                      <td className="px-6 py-4 font-poppins text-sm text-zinc-700 dark:text-gray-300">
                        {category.parentCategory ? category.parentCategory.name : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-zinc-500 dark:text-gray-400 text-sm font-mono bg-zinc-100 dark:bg-black px-2 py-1 rounded border border-zinc-200 dark:border-white/10">/{category.slug}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleCategoryStatus(category._id, category.isActive)}
                          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase transition-colors ${
                            category.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20 hover:bg-gray-500/20'
                          }`}
                        >
                          {category.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                          <span>{category.isActive ? 'Active' : 'Hidden'}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-3">
                          <button onClick={() => startEdit(category)} className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => deleteCategory(category._id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
