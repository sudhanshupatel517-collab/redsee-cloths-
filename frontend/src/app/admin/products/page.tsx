'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Filter, Package, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function ManageProducts() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user || !['admin', 'coadmin'].includes(user.role)) {
      router.push('/');
      return;
    }
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/products/admin');
      setProducts(data);
    } catch (err) {
      console.error('Error fetching admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  const cleanSeedProducts = async () => {
    if (window.confirm('Are you sure you want to delete all seeded/dummy products? Real products created by staff will not be deleted.')) {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${user?.token}` } };
        const { data } = await api.delete('/api/products/seed', config);
        alert(data.message || 'Seeded products deleted successfully.');
        fetchProducts(); // Refresh the list
      } catch (err: any) {
        console.error('Error cleaning seed products:', err);
        alert(err.response?.data?.message || 'Failed to remove seed products.');
        setLoading(false);
      }
    }
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await api.delete(`/api/products/${id}`);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        console.error('Error deleting product', err);
        alert('Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full py-4 text-foreground">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bebas text-black dark:text-white tracking-widest uppercase">Manage Products</h1>
            <p className="text-zinc-500 dark:text-gray-400 font-poppins text-sm mt-1">Inventory, pricing, and variant control panel.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={cleanSeedProducts}
              disabled={loading}
              className="flex items-center justify-center space-x-2 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white px-5 py-3 rounded-lg font-montserrat font-bold tracking-widest uppercase text-xs transition-all border border-zinc-200 dark:border-white/5 cursor-pointer disabled:opacity-50"
            >
              <span>Clean Seed Data</span>
            </button>
            <Link href="/admin/products/new">
              <button className="flex items-center justify-center space-x-2 bg-[#ff0033] hover:bg-[#cc0029] text-white px-6 py-3 rounded-lg font-montserrat font-bold tracking-widest uppercase text-sm transition-all shadow-[0_0_15px_rgba(255,0,51,0.3)] cursor-pointer">
                <Plus size={18} />
                <span>Add Product</span>
              </button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, SKU, or category..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-3 text-black dark:text-white outline-none transition-colors font-poppins text-sm"
            />
          </div>
          <button className="flex items-center justify-center space-x-2 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-800 dark:text-white px-6 py-3 rounded-lg border border-zinc-200 dark:border-white/10 transition-colors font-montserrat text-sm tracking-widest uppercase cursor-pointer">
            <Filter size={16} />
            <span>Filters</span>
          </button>
        </div>

        {/* Mobile View: Product Cards */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="py-12 text-center text-zinc-500 dark:text-gray-500 font-poppins">
              <div className="flex flex-col items-center justify-center space-y-4">
                 <div className="w-8 h-8 border-2 border-[#ff0033] border-t-transparent rounded-full animate-spin"></div>
                 <p className="font-montserrat tracking-widest uppercase text-xs">Loading Inventory...</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center py-8 text-zinc-500 dark:text-gray-500">No products found matching your search.</p>
          ) : (
            filteredProducts.map((product) => (
              <div key={product._id} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-4 flex flex-col space-y-3 shadow-sm dark:shadow-none">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded bg-zinc-100 dark:bg-black/50 overflow-hidden flex items-center justify-center border border-zinc-200 dark:border-white/5 flex-shrink-0">
                    {product.images && product.images[0] ? (
                      <img src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={24} className="text-zinc-400 dark:text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-800 dark:text-white font-poppins font-medium text-sm truncate">{product.name}</p>
                    <p className="text-zinc-500 dark:text-gray-500 text-xs font-montserrat uppercase tracking-wider mt-0.5">{product.brand}</p>
                    <p className="text-zinc-600 dark:text-gray-400 text-xs font-poppins mt-1">Category: {product.category}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-white/5">
                  <div>
                    <p className="text-zinc-800 dark:text-white font-poppins font-medium text-sm">₹{product.pricing?.finalPrice}</p>
                    {product.pricing?.discountPercentage > 0 && (
                      <p className="text-[#ff0033] text-xs font-poppins line-through">₹{product.pricing?.originalPrice}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1.5 justify-end">
                      <span className={`w-2 h-2 rounded-full ${product.inventoryStatus === 'In Stock' ? 'bg-green-500' : product.inventoryStatus === 'Low Stock' ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                      <span className="text-xs text-zinc-600 dark:text-gray-300 font-poppins">{product.inventoryStatus}</span>
                    </div>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-montserrat tracking-wider uppercase mt-1 ${product.published ? 'bg-green-500/10 text-green-500 dark:text-green-400 border border-green-500/20' : 'bg-zinc-500/10 text-zinc-500 dark:text-gray-400 border border-zinc-500/20'}`}>
                      {product.published ? 'Published' : 'Hidden'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-100 dark:border-white/5">
                  <button className="text-zinc-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg flex items-center justify-center flex-1 text-xs font-montserrat uppercase tracking-wider border border-zinc-200 dark:border-white/10 cursor-pointer">
                    <Edit2 size={14} className="mr-1.5" /> Edit
                  </button>
                  <button onClick={() => deleteProduct(product._id)} className="text-zinc-600 dark:text-gray-400 hover:text-[#ff0033] transition-colors p-2 hover:bg-red-500/10 rounded-lg flex items-center justify-center flex-1 text-xs font-montserrat uppercase tracking-wider border border-red-500/20 cursor-pointer">
                    <Trash2 size={14} className="mr-1.5" /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.02]">
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-zinc-500 dark:text-gray-500 uppercase font-medium">Product</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-zinc-500 dark:text-gray-500 uppercase font-medium">Category</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-zinc-500 dark:text-gray-500 uppercase font-medium">Price</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-zinc-500 dark:text-gray-500 uppercase font-medium">Stock/Status</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-zinc-500 dark:text-gray-500 uppercase font-medium">Visibility</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-zinc-500 dark:text-gray-500 uppercase font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 dark:text-gray-500 font-poppins">
                      <div className="flex flex-col items-center justify-center space-y-4">
                         <div className="w-8 h-8 border-2 border-[#ff0033] border-t-transparent rounded-full animate-spin"></div>
                         <p className="font-montserrat tracking-widest uppercase text-xs">Loading Inventory...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 dark:text-gray-500 font-poppins">No products found matching your search.</td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded bg-zinc-100 dark:bg-black/50 overflow-hidden flex items-center justify-center border border-zinc-200 dark:border-white/5">
                            {product.images && product.images[0] ? (
                              <img src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon size={20} className="text-zinc-400 dark:text-gray-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-zinc-800 dark:text-white font-poppins font-medium text-sm line-clamp-1">{product.name}</p>
                            <p className="text-zinc-500 dark:text-gray-500 text-xs font-montserrat uppercase tracking-wider mt-1">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600 dark:text-gray-400 font-poppins">{product.category}</td>
                      <td className="px-6 py-4">
                        <p className="text-zinc-800 dark:text-white font-poppins font-medium">₹{product.pricing?.finalPrice}</p>
                        {product.pricing?.discountPercentage > 0 && (
                          <p className="text-[#ff0033] text-xs font-poppins line-through">₹{product.pricing?.originalPrice}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${product.inventoryStatus === 'In Stock' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : product.inventoryStatus === 'Low Stock' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></span>
                          <span className="text-sm text-zinc-600 dark:text-gray-300 font-poppins">{product.inventoryStatus}</span>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-gray-500 font-montserrat mt-1">{product.variants?.reduce((a:any,v:any)=>a+v.stock,0) || 0} items across {product.variants?.length || 0} variants</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-montserrat tracking-wider uppercase ${product.published ? 'bg-green-500/10 text-green-500 dark:text-green-400 border border-green-500/20' : 'bg-zinc-500/10 text-zinc-500 dark:text-gray-400 border border-zinc-500/20'}`}>
                          {product.published ? 'Published' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button className="text-zinc-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg inline-flex cursor-pointer">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => deleteProduct(product._id)} className="text-zinc-500 dark:text-gray-400 hover:text-[#ff0033] transition-colors p-2 hover:bg-red-500/10 rounded-lg inline-flex cursor-pointer">
                          <Trash2 size={16} />
                        </button>
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
