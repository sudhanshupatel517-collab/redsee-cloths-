'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Plus, Search, Trash2, Sparkles, CheckCircle, XCircle, Edit, Calendar } from 'lucide-react';

interface Banner {
  _id: string;
  imageUrl: string;
  linkUrl: string;
  title: string;
  description: string;
  isActive: boolean;
  order: number;
  startDate?: string;
  endDate?: string;
}

export default function ManageBanners() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Create / Edit Banner State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '/shop',
    order: 0,
    isActive: true,
    startDate: '',
    endDate: ''
  });
  
  useEffect(() => {
    if (!user || !['admin', 'coadmin'].includes(user.role)) {
      router.push('/');
      return;
    }
    fetchBanners();
  }, [user, router]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/banners/all');
      setBanners(data);
    } catch (err) {
      console.error('Error fetching banners:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormState({
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '/shop',
      order: 0,
      isActive: true,
      startDate: '',
      endDate: ''
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (banner: Banner) => {
    setEditingId(banner._id);
    setFormState({
      title: banner.title || '',
      description: banner.description || '',
      imageUrl: banner.imageUrl || '',
      linkUrl: banner.linkUrl || '/shop',
      order: banner.order || 0,
      isActive: banner.isActive,
      startDate: banner.startDate ? new Date(banner.startDate).toISOString().slice(0, 16) : '',
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().slice(0, 16) : ''
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.imageUrl) {
      alert('Image is required');
      return;
    }
    
    const body = {
      ...formState,
      startDate: formState.startDate ? new Date(formState.startDate).toISOString() : null,
      endDate: formState.endDate ? new Date(formState.endDate).toISOString() : null
    };

    try {
      if (editingId) {
        await api.put(`/api/banners/${editingId}`, body);
      } else {
        await api.post('/api/banners', body);
      }
      setIsFormOpen(false);
      fetchBanners();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save banner');
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

  const deleteBanner = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await api.delete(`/api/banners/${id}`);
        setBanners(banners.filter((b) => b._id !== id));
      } catch (err) {
        alert('Failed to delete banner');
      }
    }
  };

  const toggleBannerStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/api/banners/${id}`, { isActive: !currentStatus });
      setBanners(banners.map(b => b._id === id ? { ...b, isActive: !currentStatus } : b));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredBanners = banners.filter(b => 
    b.title?.toLowerCase().includes(search.toLowerCase()) || 
    b.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full py-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bebas text-white tracking-widest uppercase flex items-center">
              <Sparkles className="mr-3 text-[#ff0033]" /> Homepage Banners
            </h1>
            <p className="text-gray-400 font-poppins text-sm mt-1">Manage slides, schedule campaigns, and upload promo creatives.</p>
          </div>
          <button 
            onClick={handleOpenCreate}
            className="flex items-center justify-center space-x-2 bg-[#ff0033] hover:bg-[#cc0029] text-white px-6 py-3 rounded-lg font-montserrat font-bold tracking-widest uppercase text-sm transition-all shadow-[0_0_15px_rgba(255,0,51,0.3)]"
          >
            <Plus size={18} />
            <span>New Banner</span>
          </button>
        </div>

        {/* Create / Edit Form Drawer */}
        {isFormOpen && (
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 backdrop-blur-md animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bebas text-white tracking-widest uppercase">
                {editingId ? 'Edit Banner' : 'Create Banner'}
              </h2>
              <button 
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-white text-xs font-montserrat uppercase tracking-wider"
              >
                Cancel
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Banner Title</label>
                <input 
                  type="text" 
                  value={formState.title} 
                  onChange={e => setFormState({...formState, title: e.target.value})} 
                  className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors" 
                  placeholder="e.g. BUY 1 GET 1 FREE" 
                />
              </div>
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Link URL</label>
                <input 
                  required
                  type="text" 
                  value={formState.linkUrl} 
                  onChange={e => setFormState({...formState, linkUrl: e.target.value})} 
                  className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors" 
                  placeholder="/category/hoodies" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Description / Promotional Subtitle</label>
                <textarea 
                  rows={2} 
                  value={formState.description} 
                  onChange={e => setFormState({...formState, description: e.target.value})} 
                  className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors resize-none" 
                  placeholder="e.g. BUY 1 HOODIE, GET 1 TEE FREE" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Banner Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={uploadImage}
                  disabled={uploadingImage}
                  className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-2.5 text-white outline-none transition-colors file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#ff0033] file:text-white hover:file:bg-[#cc0029] disabled:opacity-50" 
                />
                {uploadingImage && <p className="text-xs text-[#ff0033] mt-2 animate-pulse font-poppins">Uploading to Cloudinary...</p>}
                {formState.imageUrl && !uploadingImage && (
                  <div className="mt-3 relative w-full h-24 bg-zinc-950 rounded-lg overflow-hidden border border-white/10">
                    <img src={formState.imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                  </div>
                )}
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

              <div>
                <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Start Date (Scheduling - Optional)</label>
                <input 
                  type="datetime-local" 
                  value={formState.startDate} 
                  onChange={e => setFormState({...formState, startDate: e.target.value})} 
                  className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors" 
                />
              </div>

              <div>
                <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">End Date (Scheduling - Optional)</label>
                <input 
                  type="datetime-local" 
                  value={formState.endDate} 
                  onChange={e => setFormState({...formState, endDate: e.target.value})} 
                  className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors" 
                />
              </div>
            </div>
            
            <button type="submit" className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-8 py-3 rounded-lg font-montserrat font-bold tracking-widest uppercase text-sm transition-colors">
              {editingId ? 'Save Changes' : 'Create Banner'}
            </button>
          </form>
        )}

        {/* Search Bar */}
        <div className="relative w-full mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search banners..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96 bg-white/5 border border-white/10 focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-3 text-white outline-none transition-colors font-poppins text-sm"
          />
        </div>

        {/* Banners List */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-gray-500 uppercase font-medium">Creative / Info</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-gray-500 uppercase font-medium">Link</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-gray-500 uppercase font-medium">Order</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-gray-500 uppercase font-medium">Schedule</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-gray-500 uppercase font-medium">Status</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-gray-500 uppercase font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center">
                      <div className="flex justify-center items-center space-x-3 text-gray-400">
                        <div className="w-5 h-5 border-2 border-[#ff0033] border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-poppins text-sm">Loading banners...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredBanners.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500 font-poppins text-sm">
                      No banners found. Add a banner to display on the homepage slider!
                    </td>
                  </tr>
                ) : (
                  filteredBanners.map((banner) => {
                    const hasSchedule = banner.startDate || banner.endDate;
                    return (
                      <tr key={banner._id} className="hover:bg-white/[0.02] transition-colors border-b border-white/5">
                        <td className="px-6 py-4 max-w-xs">
                          <div className="flex items-center space-x-3">
                            <img src={banner.imageUrl} alt={banner.title} className="w-16 h-10 object-cover rounded-md border border-white/10" />
                            <div>
                              <p className="text-white font-bold font-poppins truncate">{banner.title || 'Untitled Banner'}</p>
                              <p className="text-gray-500 text-xs truncate mt-0.5">{banner.description || 'No description'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-400 text-xs font-mono">{banner.linkUrl}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white font-semibold font-poppins">{banner.order}</span>
                        </td>
                        <td className="px-6 py-4">
                          {hasSchedule ? (
                            <div className="text-xs text-gray-400 font-poppins space-y-0.5">
                              {banner.startDate && <div className="flex items-center"><Calendar size={10} className="mr-1 text-green-500" /> Start: {new Date(banner.startDate).toLocaleDateString()}</div>}
                              {banner.endDate && <div className="flex items-center"><Calendar size={10} className="mr-1 text-red-500" /> End: {new Date(banner.endDate).toLocaleDateString()}</div>}
                            </div>
                          ) : (
                            <span className="text-gray-600 text-xs font-poppins">Always Visible</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => toggleBannerStatus(banner._id, banner.isActive)}
                            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase transition-colors ${
                              banner.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20 hover:bg-gray-500/20'
                            }`}
                          >
                            {banner.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                            <span>{banner.isActive ? 'Active' : 'Hidden'}</span>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button onClick={() => handleOpenEdit(banner)} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Edit">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => deleteBanner(banner._id)} className="p-2 text-gray-500 hover:text-[#ff0033] hover:bg-[#ff0033]/10 rounded-lg transition-colors" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
