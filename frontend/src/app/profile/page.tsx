'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import api from '@/lib/axios';
import { 
  Package, 
  Heart, 
  Gift, 
  ChevronRight, 
  Calendar,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { optimizeImageUrl } from '@/lib/image';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    images?: any[];
  } | null;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

interface Order {
  _id: string;
  createdAt: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  products: OrderItem[];
}

export default function ProfileDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items) || [];
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/api/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders for dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Sort orders to get the most recent first
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const recentOrder = sortedOrders[0];
  const activeOrdersCount = orders.filter(
    order => !['Delivered', 'Cancelled'].includes(order.orderStatus)
  ).length;

  // Determine loyalty tier based on rewards points
  const points = user?.rewards || 0;
  let loyaltyTier = 'Bronze Member';
  let tierColor = 'from-amber-600 to-amber-800';
  let nextTierPoints = 150;
  
  if (points > 500) {
    loyaltyTier = 'Gold Elite';
    tierColor = 'from-yellow-400 to-amber-500';
    nextTierPoints = 0;
  } else if (points > 150) {
    loyaltyTier = 'Silver Elite';
    tierColor = 'from-zinc-300 to-zinc-500';
    nextTierPoints = 500;
  }

  const getStepperProgress = (status: string) => {
    switch (status) {
      case 'Pending': return 10;
      case 'Confirmed':
      case 'Packed': return 40;
      case 'Shipped':
      case 'Out for Delivery': return 75;
      case 'Delivered': return 100;
      default: return 0;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Confirmed':
      case 'Packed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Shipped':
      case 'Out for Delivery': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="pb-24 md:pb-0 space-y-8">
      {/* 1. Welcome & Loyalty Card */}
      <div className="bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff0033]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#ff0033] to-[#7a0000] border-2 border-white/10 flex items-center justify-center flex-shrink-0 shadow-lg">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bebas text-white text-3xl tracking-widest">{user?.name?.charAt(0) || 'U'}</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bebas tracking-wider">Hello, {user?.name || 'User'}</h1>
              <p className="text-zinc-400 text-xs font-poppins mt-1">Manage your account, track orders, and view rewards details.</p>
              {user?.createdAt && (
                <p className="text-[10px] text-zinc-500 font-poppins mt-0.5">
                  Member since {formatDate(user.createdAt)}
                </p>
              )}
            </div>
          </div>

          {/* Loyalty Badge */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center space-x-4 max-w-xs">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tierColor} flex items-center justify-center flex-shrink-0 shadow-md`}>
              <Award size={20} className="text-white" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-montserrat">Loyalty Status</span>
              <h4 className="font-montserrat font-bold text-sm text-white">{loyaltyTier}</h4>
              {nextTierPoints > 0 && (
                <p className="text-[9px] text-zinc-500 font-poppins mt-0.5">
                  {nextTierPoints - points} points to next tier
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        <Link href="/profile/orders" className="bg-white dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center group transition-all hover:bg-zinc-50 dark:hover:bg-white/[0.03] shadow-sm">
          <div className="bg-red-500/10 text-[#ff0033] p-2.5 rounded-xl mb-2 group-hover:scale-105 transition-transform">
            <Package size={20} />
          </div>
          <span className="text-xl md:text-2xl font-bebas text-black dark:text-white tracking-wider">{activeOrdersCount}</span>
          <span className="text-[10px] md:text-xs font-poppins text-zinc-500">Active Orders</span>
        </Link>
        <Link href="/profile/wishlist" className="bg-white dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center group transition-all hover:bg-zinc-50 dark:hover:bg-white/[0.03] shadow-sm">
          <div className="bg-red-500/10 text-[#ff0033] p-2.5 rounded-xl mb-2 group-hover:scale-105 transition-transform">
            <Heart size={20} />
          </div>
          <span className="text-xl md:text-2xl font-bebas text-black dark:text-white tracking-wider">{wishlistItems.length}</span>
          <span className="text-[10px] md:text-xs font-poppins text-zinc-500">Saved Items</span>
        </Link>
        <Link href="/profile/rewards" className="bg-white dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center group transition-all hover:bg-zinc-50 dark:hover:bg-white/[0.03] shadow-sm">
          <div className="bg-red-500/10 text-[#ff0033] p-2.5 rounded-xl mb-2 group-hover:scale-105 transition-transform">
            <Gift size={20} />
          </div>
          <span className="text-xl md:text-2xl font-bebas text-black dark:text-white tracking-wider">{points}</span>
          <span className="text-[10px] md:text-xs font-poppins text-zinc-500">Rewards Points</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* 3. Recent Order Section (Takes 3 columns) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-montserrat uppercase tracking-widest font-bold text-gray-500">Recent Order Status</h3>
            {orders.length > 1 && (
              <Link href="/profile/orders" className="text-xs font-montserrat uppercase tracking-wider text-[#ff0033] hover:underline flex items-center gap-1 font-bold">
                <span>All Orders</span>
                <ArrowRight size={12} />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10 bg-white dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-2xl">
              <div className="w-6 h-6 border-2 border-[#ff0033] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : recentOrder ? (
            <div className="bg-white dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-2xl p-5 md:p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-white/5 flex-wrap gap-2">
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-zinc-500 dark:text-gray-400 font-poppins">
                    <Calendar size={12} className="mr-1 text-zinc-400" />
                    <span>Ordered: {formatDate(recentOrder.createdAt)}</span>
                  </div>
                  <div className="text-[10px] text-zinc-450 font-mono">
                    ID: #{recentOrder._id.substring(0, 12)}...
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-[9px] font-montserrat uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusColor(recentOrder.orderStatus)}`}>
                    {recentOrder.orderStatus}
                  </span>
                  <span className="text-sm font-poppins font-bold text-black dark:text-white">
                    ₹{recentOrder.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Product list preview (first 2 items) */}
              <div className="space-y-3">
                {recentOrder.products.slice(0, 2).map((item, idx) => {
                  const firstImg = item.product?.images?.[0];
                  const itemImage = typeof firstImg === 'string' ? firstImg : (firstImg?.url || '/logo(4).png');
                  const itemTitle = item.product?.name || 'Unknown Product';
                  return (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-10 h-12 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded overflow-hidden flex-shrink-0">
                        <img src={optimizeImageUrl(itemImage, 100)} alt={itemTitle} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-poppins font-bold text-black dark:text-white truncate">{itemTitle}</h4>
                        <p className="text-[10px] text-zinc-500 font-poppins mt-0.5">Size: {item.size} • Qty: {item.quantity}</p>
                      </div>
                    </div>
                  );
                })}
                {recentOrder.products.length > 2 && (
                  <p className="text-[10px] text-zinc-500 font-poppins pl-13">
                    + {recentOrder.products.length - 2} more item(s)
                  </p>
                )}
              </div>

              {/* Progress bar tracker */}
              <div className="pt-2">
                <div className="h-1 bg-zinc-100 dark:bg-white/10 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-[#ff0033] shadow-[0_0_8px_rgba(255,0,51,0.5)] transition-all duration-500" 
                    style={{ width: `${getStepperProgress(recentOrder.orderStatus)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-montserrat uppercase font-bold text-zinc-400 dark:text-gray-500 mt-2">
                  <span className={recentOrder.orderStatus !== 'Cancelled' ? 'text-[#ff0033]' : ''}>Placed</span>
                  <span className={['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(recentOrder.orderStatus) ? 'text-[#ff0033]' : ''}>Packed</span>
                  <span className={['Shipped', 'Out for Delivery', 'Delivered'].includes(recentOrder.orderStatus) ? 'text-[#ff0033]' : ''}>Shipped</span>
                  <span className={recentOrder.orderStatus === 'Delivered' ? 'text-green-500' : ''}>Delivered</span>
                </div>
              </div>

              <div className="pt-2">
                <Link 
                  href="/profile/orders" 
                  className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.01] hover:bg-zinc-100 dark:hover:bg-white/[0.04] text-xs font-montserrat font-bold tracking-wider uppercase transition-colors"
                >
                  <ShoppingBag size={12} />
                  <span>View Details & Tracking</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 bg-white dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-2xl text-center px-4">
              <div className="w-12 h-12 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
                <ShoppingBag size={20} className="text-zinc-400" />
              </div>
              <h4 className="text-sm font-montserrat font-bold text-black dark:text-white mb-1">No orders yet</h4>
              <p className="text-xs text-zinc-500 max-w-xs font-poppins">Place your first order to start tracking items here.</p>
              <Link href="/shop" className="mt-4 text-xs font-montserrat font-bold uppercase tracking-wider text-[#ff0033] hover:underline">
                Shop Our Collection
              </Link>
            </div>
          )}
        </div>

        {/* 4. Wishlist Preview (Takes 2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-montserrat uppercase tracking-widest font-bold text-gray-500">Wishlist Preview</h3>
            {wishlistItems.length > 3 && (
              <Link href="/profile/wishlist" className="text-xs font-montserrat uppercase tracking-wider text-[#ff0033] hover:underline flex items-center gap-1 font-bold">
                <span>View All</span>
                <ArrowRight size={12} />
              </Link>
            )}
          </div>

          {wishlistItems.length > 0 ? (
            <div className="bg-white dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="grid grid-cols-3 gap-3">
                {wishlistItems.slice(0, 3).map((item: any) => {
                  const firstImg = item.images?.[0];
                  const itemImage = typeof firstImg === 'string' ? firstImg : (firstImg?.url || '/logo(4).png');
                  return (
                    <Link 
                      key={item._id} 
                      href={`/product/${item._id}`}
                      className="group block"
                    >
                      <div className="aspect-[3/4] w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-lg overflow-hidden relative mb-2">
                        <img 
                          src={optimizeImageUrl(itemImage, 120)} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                      <h4 className="text-[10px] font-poppins font-bold text-black dark:text-white truncate">{item.name}</h4>
                      <p className="text-[10px] text-zinc-500 font-poppins mt-0.5">₹{item.price?.toFixed(2)}</p>
                    </Link>
                  );
                })}
              </div>

              <Link 
                href="/profile/wishlist"
                className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.01] hover:bg-zinc-100 dark:hover:bg-white/[0.04] text-xs font-montserrat font-bold tracking-wider uppercase transition-colors"
              >
                <Heart size={12} />
                <span>Go to Wishlist</span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 bg-white dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-2xl text-center px-4">
              <div className="w-12 h-12 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
                <Heart size={20} className="text-zinc-400" />
              </div>
              <h4 className="text-sm font-montserrat font-bold text-black dark:text-white mb-1">Wishlist is empty</h4>
              <p className="text-xs text-zinc-500 max-w-xs font-poppins">Save items you love to keep track of them here.</p>
              <Link href="/shop" className="mt-4 text-xs font-montserrat font-bold uppercase tracking-wider text-[#ff0033] hover:underline">
                Explore Styles
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
