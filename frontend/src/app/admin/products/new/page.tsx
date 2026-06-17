'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, X, Save, Image as ImageIcon, Loader2, Package } from 'lucide-react';
import Link from 'next/link';
import ImageUpload, { CloudinaryImage } from '@/components/ImageUpload';

export default function AddProduct() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSection, setSelectedSection] = useState<'Men' | 'Women' | 'Accessories'>('Men');
  const [selectedNavbarCategory, setSelectedNavbarCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [bannerId, setBannerId] = useState('');
  const [brand, setBrand] = useState('Redsee');
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [images, setImages] = useState<(string | CloudinaryImage)[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);

  // Variants State
  const [variants, setVariants] = useState<{size: string, color: string, stock: number}[]>([]);
  const [currentVariant, setCurrentVariant] = useState({ size: 'M', color: 'Black', stock: 10 });

  // Quick Variant Generator State
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['M', 'L', 'XL']);
  const [bulkColor, setBulkColor] = useState('Onyx Black');
  const [bulkStock, setBulkStock] = useState(15);

  const handleBulkAddVariants = () => {
    if (!bulkColor.trim()) return alert('Please enter a color for bulk variants');
    if (selectedSizes.length === 0) return alert('Please select at least one size');
    
    const newVariants = selectedSizes.map(size => ({
      size,
      color: bulkColor.trim(),
      stock: bulkStock
    }));
    
    const filteredNew = newVariants.filter(nv => 
      !variants.some(v => v.size === nv.size && v.color.toLowerCase() === nv.color.toLowerCase())
    );
    
    setVariants([...variants, ...filteredNew]);
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    const fetchDbCategories = async () => {
      try {
        const { data } = await api.get('/api/categories/admin');
        setDbCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    const fetchBanners = async () => {
      try {
        const { data } = await api.get('/api/banners');
        setBanners(data);
      } catch (err) {
        console.error('Failed to fetch banners:', err);
      }
    };
    fetchDbCategories();
    fetchBanners();
  }, []);

  const handleSectionChange = (val: 'Men' | 'Women' | 'Accessories') => {
    setSelectedSection(val);
    setSelectedNavbarCategory('');
    setSelectedSubcategory('');
  };

  const handleNavbarCategoryChange = (val: string) => {
    setSelectedNavbarCategory(val);
    setSelectedSubcategory('');
  };

  useEffect(() => {
    if (!user || !['admin', 'coadmin'].includes(user.role)) {
      router.push('/');
    }
  }, [user]);

  const handleAddTag = () => {
    if (tagInput.trim() !== '' && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleAddVariant = () => {
    setVariants([...variants, { ...currentVariant }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSection) return alert('Please select a section');
    if (!selectedNavbarCategory) return alert('Please select a navbar category');
    if (!selectedSubcategory) return alert('Please select a subcategory');
    if (variants.length === 0) return alert('Please add at least one product variant (size/color/stock)');
    if (images.length === 0) return alert('Please add at least one image URL');

    setLoading(true);
    setMessage('');

    try {
      await api.post('/api/products', {
        name,
        description,
        section: selectedSection,
        navbarCategory: selectedNavbarCategory,
        category: selectedSubcategory, // subcategory is saved in category field
        bannerId: bannerId || null,
        brand,
        pricing: {
          originalPrice,
          discountPercentage,
          finalPrice: 0 // Backend auto-calculates this
        },
        variants,
        images,
        tags,
        featured,
        published
      });
      router.push('/admin/products');
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.error || err.response?.data?.message || 'Failed to create product');
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-4 text-foreground">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/products" className="inline-flex items-center space-x-2 text-zinc-500 hover:text-black dark:hover:text-white transition-colors font-montserrat text-xs tracking-widest uppercase mb-8">
          <ArrowLeft size={16} />
          <span>Back to Inventory</span>
        </Link>

        <h1 className="text-3xl md:text-4xl font-bebas text-black dark:text-white tracking-widest uppercase mb-8">Create New Product</h1>

        {message && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 rounded-lg font-poppins text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* BASIC INFO */}
          <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-6 md:p-8 shadow-sm dark:shadow-none">
            <h2 className="text-xl font-bebas text-black dark:text-white tracking-widest uppercase mb-6 flex items-center border-b border-zinc-200 dark:border-white/10 pb-4">
              <Package className="mr-3 text-[#ff0033]" /> Basic Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Product Name</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none transition-colors" placeholder="e.g. Stealth Bomber Jacket" />
              </div>
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Description</label>
                <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none transition-colors resize-none" placeholder="Enter luxurious product details..."></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Section</label>
                  <select 
                    value={selectedSection} 
                    onChange={e => handleSectionChange(e.target.value as 'Men' | 'Women' | 'Accessories')} 
                    className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none transition-colors appearance-none cursor-pointer font-poppins"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Brand</label>
                  <input required type="text" value={brand} onChange={e => setBrand(e.target.value)} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Navbar Category</label>
                  <select 
                    required
                    value={selectedNavbarCategory} 
                    onChange={e => handleNavbarCategoryChange(e.target.value)} 
                    className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none transition-colors appearance-none cursor-pointer font-poppins"
                  >
                    <option value="">Select Navbar Category...</option>
                    {dbCategories.filter(cat => !cat.parentCategory && cat.section === selectedSection).map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Subcategory</label>
                  <select 
                    required
                    value={selectedSubcategory} 
                    onChange={e => setSelectedSubcategory(e.target.value)} 
                    className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none transition-colors appearance-none cursor-pointer font-poppins"
                  >
                    <option value="">Select Subcategory...</option>
                    {(() => {
                      const parentCatObj = dbCategories.find(cat => !cat.parentCategory && cat.section === selectedSection && cat.name === selectedNavbarCategory);
                      return parentCatObj 
                        ? dbCategories.filter(cat => cat.parentCategory?._id === parentCatObj._id || cat.parentCategory === parentCatObj._id).map(cat => (
                          <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))
                        : [];
                    })()}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Ongoing Banner (Optional)</label>
                  <select 
                    value={bannerId} 
                    onChange={e => setBannerId(e.target.value)} 
                    className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none transition-colors appearance-none cursor-pointer font-poppins"
                  >
                    <option value="">No Active Banner</option>
                    {banners.map(b => (
                      <option key={b._id} value={b._id}>{b.title || `Banner - ${b.linkUrl}`}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* PRICING */}
          <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-6 md:p-8 shadow-sm dark:shadow-none">
            <h2 className="text-xl font-bebas text-black dark:text-white tracking-widest uppercase mb-6 border-b border-zinc-200 dark:border-white/10 pb-4">Pricing Strategy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Original Price (₹)</label>
                <input required type="number" min="0" value={originalPrice} onChange={e => setOriginalPrice(Number(e.target.value))} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Discount (%)</label>
                <input type="number" min="0" max="100" value={discountPercentage} onChange={e => setDiscountPercentage(Number(e.target.value))} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Final Price (Auto)</label>
                <div className="w-full bg-zinc-200 dark:bg-black/80 border border-zinc-300 dark:border-white/5 rounded-lg px-4 py-3 text-[#ff0033] font-bold outline-none cursor-not-allowed">
                  ₹{Math.round(originalPrice - (originalPrice * discountPercentage) / 100)}
                </div>
              </div>
            </div>
          </div>

          {/* VARIANTS */}
          <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-6 md:p-8 shadow-sm dark:shadow-none">
            <h2 className="text-xl font-bebas text-black dark:text-white tracking-widest uppercase mb-6 border-b border-zinc-200 dark:border-white/10 pb-4">Product Variants (Inventory)</h2>
            
            {/* Quick Generator Box */}
            <div className="bg-zinc-50 dark:bg-black/40 p-5 rounded-lg border border-zinc-200 dark:border-white/5 mb-6">
              <h3 className="text-xs font-montserrat tracking-widest text-[#ff0033] uppercase font-bold mb-4">⚡ Quick Bulk Size Generator</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Select Sizes to Generate</label>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map(size => {
                      const isSelected = selectedSizes.includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeToggle(size)}
                          className={`px-3 py-1.5 rounded text-xs font-montserrat font-bold border transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-[#ff0033] border-[#ff0033] text-white' 
                              : 'bg-zinc-100 dark:bg-white/5 border-zinc-300 dark:border-white/10 text-zinc-700 dark:text-gray-400 hover:border-zinc-400 dark:hover:border-white/30'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-[10px] font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Color Name</label>
                    <input type="text" placeholder="e.g. Onyx Black" value={bulkColor} onChange={e => setBulkColor(e.target.value)} className="w-full bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-3 py-2 text-black dark:text-white text-sm outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Default Stock</label>
                    <input type="number" min="0" value={bulkStock} onChange={e => setBulkStock(Number(e.target.value))} className="w-full bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-3 py-2 text-black dark:text-white text-sm outline-none transition-colors" />
                  </div>
                  <button type="button" onClick={handleBulkAddVariants} className="bg-zinc-800 hover:bg-zinc-700 dark:bg-white/10 dark:hover:bg-white/20 text-white px-4 py-2 rounded-lg font-montserrat tracking-widest uppercase text-xs transition-colors flex items-center justify-center h-[38px] cursor-pointer">
                    Generate Variants
                  </button>
                </div>
              </div>
            </div>

            {/* Manual Variant Box */}
            <div className="bg-zinc-100 dark:bg-black/20 p-5 rounded-lg border border-zinc-200 dark:border-white/5 mb-6">
              <h3 className="text-xs font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase font-bold mb-4">Or Add Single Variant Manually</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-[10px] font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Size</label>
                  <input type="text" placeholder="S, M, L, XL" value={currentVariant.size} onChange={e => setCurrentVariant({...currentVariant, size: e.target.value.toUpperCase()})} className="w-full bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-3 py-2 text-black dark:text-white text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Color</label>
                  <input type="text" placeholder="Onyx Black" value={currentVariant.color} onChange={e => setCurrentVariant({...currentVariant, color: e.target.value})} className="w-full bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-3 py-2 text-black dark:text-white text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Stock</label>
                  <input type="number" min="0" value={currentVariant.stock} onChange={e => setCurrentVariant({...currentVariant, stock: Number(e.target.value)})} className="w-full bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-3 py-2 text-black dark:text-white text-sm outline-none transition-colors" />
                </div>
                <button type="button" onClick={handleAddVariant} className="bg-zinc-800 hover:bg-zinc-700 dark:bg-white/10 dark:hover:bg-white/20 text-white px-4 py-2 rounded-lg font-montserrat tracking-widest uppercase text-xs transition-colors flex items-center justify-center h-[38px] cursor-pointer">
                  <Plus size={16} className="mr-2" /> Add
                </button>
              </div>
            </div>

            {/* Variants List */}
            {variants.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Added Variants ({variants.length})</label>
                {variants.map((v, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-zinc-50 dark:bg-black/60 px-4 py-3 rounded-lg border border-zinc-200 dark:border-white/5">
                    <div className="flex space-x-6 font-poppins text-sm text-zinc-600 dark:text-gray-300">
                      <span className="font-bold text-zinc-800 dark:text-white w-12">{v.size}</span>
                      <span className="w-32">{v.color}</span>
                      <span className={v.stock > 10 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}>{v.stock} in stock</span>
                    </div>
                    <button type="button" onClick={() => removeVariant(idx)} className="text-zinc-400 hover:text-[#ff0033] transition-colors cursor-pointer"><X size={18} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MEDIA & TAGS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-6 md:p-8 shadow-sm dark:shadow-none">
              <h2 className="text-xl font-bebas text-black dark:text-white tracking-widest uppercase mb-6 flex items-center border-b border-zinc-200 dark:border-white/10 pb-4">
                <ImageIcon className="mr-3 text-[#ff0033]" /> Product Images
              </h2>
              <ImageUpload images={images} onChange={setImages} />
            </div>

            <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-6 md:p-8 shadow-sm dark:shadow-none">
              <h2 className="text-xl font-bebas text-black dark:text-white tracking-widest uppercase mb-6 border-b border-zinc-200 dark:border-white/10 pb-4">Visibility & Tags</h2>
              <div className="flex space-x-2 mb-6">
                <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="e.g. streetwear" className="flex-1 bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-2.5 text-black dark:text-white outline-none transition-colors text-sm" />
                <button type="button" onClick={handleAddTag} className="bg-zinc-100 hover:bg-zinc-200 dark:bg-white/10 dark:hover:bg-white/20 px-4 rounded-lg cursor-pointer"><Plus size={18} className="text-black dark:text-white" /></button>
              </div>
              <div className="flex flex-wrap gap-2 mb-8">
                {tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-[#ff0033]/10 text-[#ff0033] border border-[#ff0033]/20 text-xs font-montserrat uppercase tracking-wider flex items-center">
                    {tag} <X size={12} className="ml-2 cursor-pointer" onClick={() => removeTag(tag)} />
                  </span>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-white/10">
                <label className="flex items-center space-x-3 cursor-pointer select-none">
                  <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="w-5 h-5 accent-[#ff0033] bg-zinc-100 dark:bg-black/40 border-zinc-200 dark:border-white/10 rounded" />
                  <span className="text-zinc-800 dark:text-white font-poppins text-sm">Publish to Storefront</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer select-none">
                  <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-5 h-5 accent-[#ff0033] bg-zinc-100 dark:bg-black/40 border-zinc-200 dark:border-white/10 rounded" />
                  <span className="text-zinc-800 dark:text-white font-poppins text-sm">Feature on Homepage</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-200 dark:border-white/10">
            <button 
              disabled={loading} 
              type="submit" 
              className="flex items-center space-x-2 bg-[#ff0033] hover:bg-[#cc0029] text-white px-8 py-4 rounded-lg font-montserrat font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(255,0,51,0.3)] hover:shadow-[0_0_30px_rgba(255,0,51,0.5)] disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              <span>{loading ? 'Creating...' : 'Create Product'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
