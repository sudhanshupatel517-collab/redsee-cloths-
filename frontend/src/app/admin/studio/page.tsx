'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Plus, Search, Trash2, Camera, CheckCircle, XCircle, Edit, Sparkles } from 'lucide-react';

interface LookbookItem {
  _id: string;
  imageUrl: string;
  chapter: string;
  title: string;
  span: string;
  isActive: boolean;
  order: number;
}

export default function ManageStudio() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  
  const [items, setItems] = useState<LookbookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Create / Edit State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState({
    chapter: '',
    title: '',
    imageUrl: '',
    span: 'col-span-1 row-span-1 md:h-[217px]',
    order: 0,
    isActive: true
  });
  
  useEffect(() => {
    if (!user || !['admin', 'coadmin'].includes(user.role)) {
      router.push('/');
      return;
    }
    // coadmins must have manage_studio permission to view this page
    if (user.role === 'coadmin' && !user.permissions?.includes('manage_studio')) {
      router.push('/admin');
      alert('You do not have permission to access Studio Management');
      return;
    }
    fetchLookbookItems();
  }, [user, router]);

  const fetchLookbookItems = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/studio/all');
      setItems(data);
    } catch (err) {
      console.error('Error fetching lookbook items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormState({
      chapter: '',
      title: '',
      imageUrl: '',
      span: 'col-span-1 row-span-1 md:h-[217px]',
      order: items.length + 1,
      isActive: true
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: LookbookItem) => {
    setEditingId(item._id);
    setFormState({
      chapter: item.chapter || '',
      title: item.title || '',
      imageUrl: item.imageUrl || '',
      span: item.span || 'col-span-1 row-span-1 md:h-[217px]',
      order: item.order || 0,
      isActive: item.isActive
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.imageUrl) {
      alert('Image is required');
      return;
    }
    if (!formState.chapter) {
      alert('Chapter label is required');
      return;
    }
    if (!formState.title) {
      alert('Title is required');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/api/studio/${editingId}`, formState);
      } else {
        await api.post('/api/studio', formState);
      }
      setIsFormOpen(false);
      fetchLookbookItems();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save lookbook item');
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
      setFormState({ ...formState, imageUrl: data.url });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lookbook item?')) {
      try {
        await api.delete(`/api/studio/${id}`);
        setItems(items.filter((item) => item._id !== id));
      } catch (err) {
        alert('Failed to delete lookbook item');
      }
    }
  };

  const toggleItemStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/api/studio/${id}`, { isActive: !currentStatus });
      setItems(items.map(item => item._id === id ? { ...item, isActive: !currentStatus } : item));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredItems = items.filter(item => 
    item.title?.toLowerCase().includes(search.toLowerCase()) || 
    item.chapter?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full py-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bebas text-white tracking-widest uppercase flex items-center">
              <Camera className="mr-3 text-[#ff0033]" /> Studio Management
            </h1>
            <p className="text-gray-400 font-poppins text-sm mt-1">Manage the Redsee Store Studios editorial lookbook chapters and layout grids.</p>
          </div>
          <button 
            onClick={handleOpenCreate}
            className="flex items-center justify-center space-x-2 bg-[#ff0033] hover:bg-[#cc0029] text-white px-6 py-3 rounded-lg font-montserrat font-bold tracking-widest uppercase text-sm transition-all shadow-[0_0_15px_rgba(255,0,51,0.3)] cursor-pointer"
          >
            <Plus size={18} />
            <span>New Chapter</span>
          </button>
        </div>

        {/* Create / Edit Form Drawer */}
        {isFormOpen && (
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 backdrop-blur-md animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bebas text-white tracking-widest uppercase">
                {editingId ? 'Edit Lookbook Chapter' : 'Create Lookbook Chapter'}
              </h2>
              <button 
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-white text-xs font-montserrat uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Chapter Tag (e.g. CHAPTER 01)</label>
                <input 
                  required
                  type="text" 
                  value={formState.chapter} 
                  onChange={e => setFormState({...formState, chapter: e.target.value})} 
                  className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors" 
                  placeholder="CHAPTER 01" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Title</label>
                <input 
                  required
                  type="text" 
                  value={formState.title} 
                  onChange={e => setFormState({...formState, title: e.target.value})} 
                  className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors" 
                  placeholder="THE VOID" 
                />
              </div>

              <div>
                <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Grid Layout Size / Span</label>
                <select
                  value={formState.span}
                  onChange={e => setFormState({...formState, span: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option className="bg-zinc-950 text-white" value="col-span-1 row-span-1 md:h-[217px]">Standard Chapter (Small, 1x1 Grid)</option>
                  <option className="bg-zinc-950 text-white" value="col-span-2 row-span-2 md:h-[450px]">Feature Chapter (Large, 2x2 Grid)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Display Order</label>
                  <input 
                    type="number" 
                    value={formState.order} 
                    onChange={e => setFormState({...formState, order: parseInt(e.target.value) || 0})} 
                    className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors" 
                  />
                </div>
                <div className="flex items-center h-full pt-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formState.isActive} 
                      onChange={e => setFormState({...formState, isActive: e.target.checked})} 
                      className="accent-[#ff0033] h-4 w-4"
                    />
                    <span className="text-sm font-montserrat text-white">Active Status</span>
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Chapter Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={uploadImage}
                  disabled={uploadingImage}
                  className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-2.5 text-white outline-none transition-colors file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#ff0033] file:text-white hover:file:bg-[#cc0029] disabled:opacity-50 cursor-pointer" 
                />
                {uploadingImage && <p className="text-xs text-[#ff0033] mt-2 animate-pulse font-poppins">Uploading to Cloudinary...</p>}
                {formState.imageUrl && !uploadingImage && (
                  <div className="mt-3 relative max-w-xs h-40 bg-zinc-950 rounded-lg overflow-hidden border border-white/10">
                    <img src={formState.imageUrl} alt="Chapter Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            
            <button type="submit" className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-8 py-3 rounded-lg font-montserrat font-bold tracking-widest uppercase text-sm transition-colors cursor-pointer">
              {editingId ? 'Save Changes' : 'Create Chapter'}
            </button>
          </form>
        )}

        {/* Search & Filter */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search chapters by tag or title..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/5 focus:border-[#ff0033] rounded-lg pl-10 pr-4 py-3 text-white outline-none transition-colors font-poppins text-sm"
            />
          </div>
        </div>

        {/* Chapters Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ff0033]" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
            <Camera className="mx-auto text-gray-500 mb-4" size={48} />
            <h3 className="text-lg font-montserrat font-bold text-white mb-2">No Chapters Found</h3>
            <p className="text-gray-400 text-sm font-poppins">Get started by creating your first lookbook chapter above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map(item => (
              <div 
                key={item._id} 
                className="bg-white/5 border border-white/10 hover:border-[#ff0033]/55 rounded-xl overflow-hidden flex flex-col md:flex-row transition-all duration-300 backdrop-blur-sm"
              >
                <div className="md:w-1/3 relative h-40 md:h-auto bg-zinc-950 flex-shrink-0">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-[#ff0033] text-white text-[8px] font-montserrat font-bold px-2 py-1 rounded tracking-widest">
                    {item.chapter}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bebas text-white tracking-wider uppercase truncate max-w-[200px]">{item.title}</h3>
                      <button 
                        onClick={() => toggleItemStatus(item._id, item.isActive)}
                        className="cursor-pointer"
                        title={item.isActive ? 'Active' : 'Inactive'}
                      >
                        {item.isActive ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <XCircle size={16} className="text-red-500" />
                        )}
                      </button>
                    </div>
                    
                    <div className="mt-3 space-y-1 text-xs font-poppins text-gray-400">
                      <p><strong className="text-gray-500">Order:</strong> {item.order}</p>
                      <p>
                        <strong className="text-gray-500">Span:</strong>{' '}
                        {item.span.includes('col-span-2') ? 'Feature (2x2 Grid)' : 'Standard (1x1 Grid)'}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4 pt-4 border-t border-white/5">
                    <button 
                      onClick={() => handleOpenEdit(item)}
                      className="flex-1 flex items-center justify-center space-x-1.5 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-xs font-montserrat font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <Edit size={12} />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => deleteItem(item._id)}
                      className="flex-1 flex items-center justify-center space-x-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-2 rounded-lg text-xs font-montserrat font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
