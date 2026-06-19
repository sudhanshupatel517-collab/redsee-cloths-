'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, X, Save, Image as ImageIcon, Loader2, Package } from 'lucide-react';
import Link from 'next/link';
import ImageUpload, { CloudinaryImage } from '@/components/ImageUpload';

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSection, setSelectedSection] = useState<'Men' | 'Women' | 'Accessories'>('Men');
  const [selectedNavbarCategory, setSelectedNavbarCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [bannerId, setBannerId] = useState('');
  const [brand, setBrand] = useState('Redsee Store');
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

  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    if (!user || !['admin', 'coadmin'].includes(user.role)) {
      router.push('/');
    }
  }, [user]);

  // Fetch product details and categories on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setFetching(true);
        // Fetch categories
        const catRes = await api.get('/api/categories/admin');
        setDbCategories(catRes.data);

        // Fetch banners
        try {
          const bannerRes = await api.get('/api/banners');
          setBanners(bannerRes.data);
        } catch (bannerErr) {
          console.error('Failed to load banners:', bannerErr);
        }

        // Fetch product
        const prodRes = await api.get(`/api/products/${id}`);
        const p = prodRes.data;
        setName(p.name || '');
        setDescription(p.description || '');
        setSelectedSection(p.section || 'Men');
        setSelectedNavbarCategory(p.navbarCategory || '');
        setSelectedSubcategory(p.category || '');
        setBannerId(p.bannerId?._id || p.bannerId || '');
        setBrand(p.brand || 'Redsee Store');
        setOriginalPrice(p.pricing?.originalPrice || 0);
        setDiscountPercentage(p.pricing?.discountPercentage || 0);
        setImages(p.images || []);
        setTags(p.tags || []);
        setVariants(p.variants || []);
        setFeatured(p.featured || false);
        setPublished(p.published !== undefined ? p.published : true);
      } catch (err: any) {
        console.error('Failed to load initial data:', err);
        setMessage(err.response?.data?.message || 'Failed to load product details.');
      } finally {
        setFetching(false);
      }
    };
    if (id) {
      fetchInitialData();
    }
  }, [id]);

  const handleSectionChange = (val: 'Men' | 'Women' | 'Accessories') => {
    setSelectedSection(val);
    setSelectedNavbarCategory('');
    setSelectedSubcategory('');
  };

  const handleNavbarCategoryChange = (val: string) => {
    setSelectedNavbarCategory(val);
    setSelectedSubcategory('');
  };

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
      await api.put(`/api/products/${id}`, {
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
      setMessage(err.response?.data?.error || err.response?.data?.message || 'Failed to update product');
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#ff0033] animate-spin" />
        <p className="font-montserrat text-xs tracking-widest uppercase text-zinc-500">Loading Product Details...</p>
      </div>
    );
  }

  return (
    <div className="w-full py-4 text-foreground">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/products" className="inline-flex items-center space-x-2 text-zinc-500 hover:text-black dark:hover:text-white transition-colors font-montserrat text-xs tracking-widest uppercase mb-8">
          <ArrowLeft size={16} />
          <span>Back to Inventory</span>
        </Link>

        <h1 className="text-3xl md:text-4xl font-bebas text-black dark:text-white tracking-widest uppercase mb-8">Edit Product</h1>

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

          {/* QUICK SIZE VARIANT GENERATOR */}
          <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-6 md:p-8 shadow-sm dark:shadow-none">
            <h2 className="text-xl font-bebas text-black dark:text-white tracking-widest uppercase mb-2 border-b border-zinc-200 dark:border-white/10 pb-4">Bulk Sizes Generator</h2>
            <p className="text-xs text-zinc-400 font-poppins mb-6">Quickly add variants for multiple sizes at once using a unified color and stock level.</p>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-3">Select Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', 'UK7', 'UK8', 'UK9', 'UK10', 'UK11'].map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={`px-3 py-1.5 rounded font-montserrat text-xs font-bold transition-all border cursor-pointer ${
                          isSelected 
                            ? 'bg-[#ff0033] text-white border-[#ff0033] shadow-[0_0_10px_rgba(255,0,51,0.2)]' 
                            : 'bg-zinc-50 dark:bg-black/40 text-zinc-600 dark:text-gray-400 border-zinc-200 dark:border-white/10 hover:border-zinc-400'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div>
                  <label className="block text-xs font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Variant Color</label>
                  <input type="text" value={bulkColor} onChange={e => setBulkColor(e.target.value)} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none transition-colors" placeholder="e.g. Matte Crimson" />
                </div>
                <div>
                  <label className="block text-xs font-montserrat tracking-widest text-zinc-500 dark:text-gray-500 uppercase mb-2">Initial Stock</label>
                  <input type="number" min="0" value={bulkStock} onChange={e => setBulkStock(Number(e.target.value))} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none transition-colors" />
                </div>
                <button
                  type="button"
                  onClick={handleBulkAddVariants}
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-[#ff0033] hover:text-white dark:hover:bg-[#ff0033] dark:hover:text-white py-3 rounded-lg font-montserrat font-bold tracking-widest uppercase text-xs transition-all border border-zinc-200 dark:border-white/5 cursor-pointer"
                >
                  Generate Variants
                </button>
              </div>
            </div>
          </div>

          {/* DETAILED VARIANTS LIST */}
          <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-6 md:p-8 shadow-sm dark:shadow-none">
            <h2 className="text-xl font-bebas text-black dark:text-white tracking-widest uppercase mb-6 border-b border-zinc-200 dark:border-white/10 pb-4">Variant Inventory</h2>
            
            {/* Form to add single variant */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end mb-6 p-4 bg-zinc-50 dark:bg-black/20 border border-zinc-150 dark:border-white/5 rounded-lg">
              <div>
                <label className="block text-[10px] font-montserrat tracking-widest text-zinc-400 dark:text-gray-500 uppercase mb-2">Size</label>
                <input type="text" value={currentVariant.size} onChange={e => setCurrentVariant({...currentVariant, size: e.target.value})} className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded px-3 py-2 text-sm text-black dark:text-white outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-montserrat tracking-widest text-zinc-400 dark:text-gray-500 uppercase mb-2">Color</label>
                <input type="text" value={currentVariant.color} onChange={e => setCurrentVariant({...currentVariant, color: e.target.value})} className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded px-3 py-2 text-sm text-black dark:text-white outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-montserrat tracking-widest text-zinc-400 dark:text-gray-500 uppercase mb-2">Stock</label>
                <input type="number" min="0" value={currentVariant.stock} onChange={e => setCurrentVariant({...currentVariant, stock: Number(e.target.value)})} className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded px-3 py-2 text-sm text-black dark:text-white outline-none transition-colors" />
              </div>
              <button type="button" onClick={handleAddVariant} className="flex items-center justify-center bg-[#ff0033] hover:bg-[#cc0029] text-white py-2 rounded text-xs font-montserrat font-bold tracking-widest uppercase transition-colors cursor-pointer">
                <Plus size={14} className="mr-1" /> Add
              </button>
            </div>

            {/* List of current variants */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {variants.length === 0 ? (
                <p className="text-zinc-500 dark:text-gray-500 text-sm font-poppins py-4 text-center">No variants added yet. Use the bulk generator or add one above.</p>
              ) : (
                variants.map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-white/5 border border-zinc-150 dark:border-white/5 rounded-lg">
                    <div className="flex items-center space-x-6 text-sm font-poppins">
                      <span className="text-zinc-500 dark:text-gray-400 text-xs font-montserrat uppercase tracking-wider">Size: <strong className="text-black dark:text-white">{v.size}</strong></span>
                      <span className="text-zinc-500 dark:text-gray-400 text-xs font-montserrat uppercase tracking-wider">Color: <strong className="text-black dark:text-white">{v.color}</strong></span>
                      <span className="text-zinc-500 dark:text-gray-400 text-xs font-montserrat uppercase tracking-wider">Stock: <strong className="text-black dark:text-white">{v.stock}</strong></span>
                    </div>
                    <button type="button" onClick={() => removeVariant(i)} className="text-zinc-400 hover:text-[#ff0033] transition-colors p-1 cursor-pointer">
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* IMAGE UPLOAD */}
          <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-6 md:p-8 shadow-sm dark:shadow-none">
            <h2 className="text-xl font-bebas text-black dark:text-white tracking-widest uppercase mb-6 flex items-center border-b border-zinc-200 dark:border-white/10 pb-4">
              <ImageIcon className="mr-3 text-[#ff0033]" /> Media Gallery
            </h2>
            <div className="space-y-6">
              <ImageUpload images={images} onChange={setImages} />
            </div>
          </div>

          {/* TAGS */}
          <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-6 md:p-8 shadow-sm dark:shadow-none">
            <h2 className="text-xl font-bebas text-black dark:text-white tracking-widest uppercase mb-6 border-b border-zinc-200 dark:border-white/10 pb-4">Search Tagging</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())} className="flex-1 bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none transition-colors" placeholder="e.g. oversize, premium, winter" />
                <button type="button" onClick={handleAddTag} className="bg-zinc-800 dark:bg-white/10 hover:bg-zinc-700 dark:hover:bg-white/20 text-black dark:text-white px-6 py-3 rounded-lg font-montserrat font-bold tracking-widest uppercase text-xs transition-colors cursor-pointer border border-zinc-200 dark:border-white/10">Add Tag</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.length === 0 ? (
                  <p className="text-zinc-500 dark:text-gray-500 text-xs font-poppins">No tags added. Tags help buyers find products via search bar.</p>
                ) : (
                  tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center bg-[#ff0033]/10 text-[#ff0033] border border-[#ff0033]/20 px-3 py-1 rounded-full text-xs font-poppins font-medium">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-1.5 hover:text-[#ff0033]/80 outline-none cursor-pointer"><X size={12} /></button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* VISIBILITY & STATUS */}
          <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-6 md:p-8 shadow-sm dark:shadow-none">
            <h2 className="text-xl font-bebas text-black dark:text-white tracking-widest uppercase mb-6 border-b border-zinc-200 dark:border-white/10 pb-4">Visibility Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-poppins font-bold text-black dark:text-white">Announce as Feature</h3>
                  <p className="text-xs text-zinc-500 dark:text-gray-500 font-poppins mt-0.5">Feature this product in landing shelves.</p>
                </div>
                <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="accent-[#ff0033] h-5 w-5 cursor-pointer" />
              </div>
              <hr className="border-zinc-200 dark:border-white/5" />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-poppins font-bold text-black dark:text-white">Publish Directly</h3>
                  <p className="text-xs text-zinc-500 dark:text-gray-500 font-poppins mt-0.5">Allow users to search and purchase this product immediately.</p>
                </div>
                <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="accent-[#ff0033] h-5 w-5 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end space-x-4">
            <Link href="/admin/products" className="bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-800 dark:text-white px-8 py-3 rounded-lg font-montserrat font-bold tracking-widest uppercase text-sm transition-colors border border-zinc-200 dark:border-white/5">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center space-x-2 bg-[#ff0033] hover:bg-[#cc0029] disabled:bg-zinc-700 text-white px-10 py-3 rounded-lg font-montserrat font-bold tracking-widest uppercase text-sm transition-all shadow-[0_0_15px_rgba(255,0,51,0.3)] disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={16} className="animate-spin mr-2" />}
              <Save size={16} className="mr-1.5" />
              <span>Update Product</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
