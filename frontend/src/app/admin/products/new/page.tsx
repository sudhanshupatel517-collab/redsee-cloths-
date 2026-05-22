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
  const [category, setCategory] = useState('Men\'s Oversized Tees');
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
    if (variants.length === 0) return alert('Please add at least one product variant (size/color/stock)');
    if (images.length === 0) return alert('Please add at least one image URL');

    setLoading(true);
    setMessage('');

    try {
      await api.post('/api/products', {
        name,
        description,
        category,
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
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/products" className="inline-flex items-center space-x-2 text-gray-500 hover:text-white transition-colors font-montserrat text-xs tracking-widest uppercase mb-8">
          <ArrowLeft size={16} />
          <span>Back to Inventory</span>
        </Link>

        <h1 className="text-3xl md:text-4xl font-bebas text-white tracking-widest uppercase mb-8">Create New Product</h1>

        {message && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg font-poppins text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* BASIC INFO */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 backdrop-blur-md">
            <h2 className="text-xl font-bebas text-white tracking-widest uppercase mb-6 flex items-center border-b border-white/10 pb-4">
              <Package className="mr-3 text-[#ff0033]" /> Basic Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Product Name</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors" placeholder="e.g. Stealth Bomber Jacket" />
              </div>
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Description</label>
                <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors resize-none" placeholder="Enter luxurious product details..."></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors appearance-none">
                    <option>Men's Oversized Tees</option>
                    <option>Men's Hoodies</option>
                    <option>Men's Streetwear Jackets</option>
                    <option>Sneakers</option>
                    <option>Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Brand</label>
                  <input required type="text" value={brand} onChange={e => setBrand(e.target.value)} className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {/* PRICING */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 backdrop-blur-md">
            <h2 className="text-xl font-bebas text-white tracking-widest uppercase mb-6 border-b border-white/10 pb-4">Pricing Strategy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Original Price (₹)</label>
                <input required type="number" min="0" value={originalPrice} onChange={e => setOriginalPrice(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Discount (%)</label>
                <input type="number" min="0" max="100" value={discountPercentage} onChange={e => setDiscountPercentage(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Final Price (Auto)</label>
                <div className="w-full bg-black/80 border border-white/5 rounded-lg px-4 py-3 text-[#ff0033] font-bold outline-none cursor-not-allowed">
                  ₹{Math.round(originalPrice - (originalPrice * discountPercentage) / 100)}
                </div>
              </div>
            </div>
          </div>

          {/* VARIANTS */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 backdrop-blur-md">
            <h2 className="text-xl font-bebas text-white tracking-widest uppercase mb-6 border-b border-white/10 pb-4">Product Variants (Inventory)</h2>
            
            {/* Add Variant Box */}
            <div className="bg-black/40 p-4 rounded-lg border border-white/5 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Size</label>
                  <input type="text" placeholder="S, M, L, XL" value={currentVariant.size} onChange={e => setCurrentVariant({...currentVariant, size: e.target.value.toUpperCase()})} className="w-full bg-white/5 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-2.5 text-white outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Color</label>
                  <input type="text" placeholder="Onyx Black" value={currentVariant.color} onChange={e => setCurrentVariant({...currentVariant, color: e.target.value})} className="w-full bg-white/5 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-2.5 text-white outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Stock</label>
                  <input type="number" min="0" value={currentVariant.stock} onChange={e => setCurrentVariant({...currentVariant, stock: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-2.5 text-white outline-none transition-colors" />
                </div>
                <button type="button" onClick={handleAddVariant} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg font-montserrat tracking-widest uppercase text-xs transition-colors flex items-center justify-center h-[42px]">
                  <Plus size={16} className="mr-2" /> Add
                </button>
              </div>
            </div>

            {/* Variants List */}
            {variants.length > 0 && (
              <div className="space-y-2">
                {variants.map((v, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-black/60 px-4 py-3 rounded-lg border border-white/5">
                    <div className="flex space-x-6 font-poppins text-sm text-gray-300">
                      <span className="font-bold text-white w-12">{v.size}</span>
                      <span className="w-32">{v.color}</span>
                      <span className={v.stock > 10 ? 'text-green-400' : 'text-orange-400'}>{v.stock} in stock</span>
                    </div>
                    <button type="button" onClick={() => removeVariant(idx)} className="text-gray-500 hover:text-[#ff0033] transition-colors"><X size={18} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MEDIA & TAGS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 backdrop-blur-md">
              <h2 className="text-xl font-bebas text-white tracking-widest uppercase mb-6 flex items-center border-b border-white/10 pb-4">
                <ImageIcon className="mr-3 text-[#ff0033]" /> Product Images
              </h2>
              <ImageUpload images={images} onChange={setImages} />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 backdrop-blur-md">
              <h2 className="text-xl font-bebas text-white tracking-widest uppercase mb-6 border-b border-white/10 pb-4">Visibility & Tags</h2>
              <div className="flex space-x-2 mb-6">
                <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="e.g. streetwear" className="flex-1 bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-2.5 text-white outline-none transition-colors text-sm" />
                <button type="button" onClick={handleAddTag} className="bg-white/10 hover:bg-white/20 px-4 rounded-lg"><Plus size={18} className="text-white" /></button>
              </div>
              <div className="flex flex-wrap gap-2 mb-8">
                {tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-[#ff0033]/10 text-[#ff0033] border border-[#ff0033]/20 text-xs font-montserrat uppercase tracking-wider flex items-center">
                    {tag} <X size={12} className="ml-2 cursor-pointer" onClick={() => removeTag(tag)} />
                  </span>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="w-5 h-5 accent-[#ff0033] bg-black/40 border-white/10" />
                  <span className="text-white font-poppins text-sm">Publish to Storefront</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-5 h-5 accent-[#ff0033] bg-black/40 border-white/10" />
                  <span className="text-white font-poppins text-sm">Feature on Homepage</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <button 
              disabled={loading} 
              type="submit" 
              className="flex items-center space-x-2 bg-[#ff0033] hover:bg-[#cc0029] text-white px-8 py-4 rounded-lg font-montserrat font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(255,0,51,0.3)] hover:shadow-[0_0_30px_rgba(255,0,51,0.5)] disabled:opacity-50"
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
