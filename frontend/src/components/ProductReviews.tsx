'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { getSocket } from '@/lib/socket';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  Camera, 
  Loader2, 
  AlertTriangle,
  Pin,
  Trash2,
  Bookmark
} from 'lucide-react';
import { optimizeImageUrl } from '@/lib/image';

interface Review {
  _id: string;
  userName: string;
  userProfileImage?: string;
  rating: number;
  reviewTitle?: string;
  reviewDescription: string;
  reviewImages?: string[];
  reviewVideos?: string[];
  isVerifiedPurchase: boolean;
  isPinned: boolean;
  isFeatured: boolean;
  createdAt: string;
  adminReply?: {
    message: string;
    repliedAt: string;
  };
}

interface ProductReviewsProps {
  productId: string;
  onStatsChange?: (stats: { totalReviews: number; averageRating: number }) => void;
}

export default function ProductReviews({ productId, onStatsChange }: ProductReviewsProps) {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<any>({ totalReviews: 0, averageRating: 0, ratingBreakdown: {} });
  const [loading, setLoading] = useState(true);
  
  // Eligibility check
  const [isEligible, setIsEligible] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Fetch reviews & stats
  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/api/products/${productId}/reviews`);
      setReviews(data.reviews || []);
      const newStats = data.stats || { totalReviews: 0, averageRating: 0, ratingBreakdown: {} };
      setStats(newStats);
      if (onStatsChange) {
        onStatsChange({
          totalReviews: newStats.totalReviews || 0,
          averageRating: newStats.averageRating || 0
        });
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Check customer review eligibility
  const checkEligibility = async () => {
    if (!isAuthenticated) return;
    setCheckingEligibility(true);
    try {
      const { data } = await api.get('/api/orders/myorders');
      // Look for a delivered order containing this product
      const hasDeliveredProduct = data.some((order: any) => 
        order.orderStatus === 'Delivered' && 
        order.products.some((p: any) => p.product?._id === productId || p.product === productId)
      );
      setIsEligible(hasDeliveredProduct);
    } catch (err) {
      console.error('Eligibility check error:', err);
    } finally {
      setCheckingEligibility(false);
    }
  };

  // 3. Socket.IO Real-time Synchronization
  useEffect(() => {
    fetchReviews();
    checkEligibility();

    const socket = getSocket();
    socket.connect();
    
    // Join the product review room
    socket.emit('join_room', `product_${productId}`);

    // Real-time Listeners
    socket.on('new_review', (newReview: Review) => {
      setReviews(prev => {
        // Prevent duplicate append
        if (prev.some(r => r._id === newReview._id)) return prev;
        const list = [newReview, ...prev];
        return list.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
      });
      // Trigger a light recount
      recalculateStats(newReview, 'add');
    });

    socket.on('review_updated', (updatedReview: Review) => {
      setReviews(prev => prev.map(r => r._id === updatedReview._id ? updatedReview : r)
        .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
      );
    });

    socket.on('review_deleted', (deletedId: string) => {
      setReviews(prev => {
        const removed = prev.find(r => r._id === deletedId);
        if (removed) recalculateStats(removed, 'remove');
        return prev.filter(r => r._id !== deletedId);
      });
    });

    return () => {
      socket.emit('leave_room', `product_${productId}`);
      socket.off('new_review');
      socket.off('review_updated');
      socket.off('review_deleted');
    };
  }, [productId, isAuthenticated]);

  const recalculateStats = (review: Review, action: 'add' | 'remove') => {
    setStats((prev: any) => {
      let total = prev.totalReviews || 0;
      let sum = (prev.averageRating || 0) * total;
      let breakdown = prev.ratingBreakdown 
        ? { ...prev.ratingBreakdown } 
        : { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      const ratingKey = Math.round(review.rating) as 5 | 4 | 3 | 2 | 1;

      if (action === 'add') {
        total += 1;
        sum += review.rating;
        breakdown[ratingKey] = (breakdown[ratingKey] || 0) + 1;
      } else {
        total = Math.max(0, total - 1);
        sum = Math.max(0, sum - review.rating);
        breakdown[ratingKey] = Math.max(0, (breakdown[ratingKey] || 0) - 1);
      }

      const updated = {
        totalReviews: total,
        averageRating: total > 0 ? Number((sum / total).toFixed(1)) : 0,
        ratingBreakdown: breakdown
      };

      if (onStatsChange) {
        onStatsChange({
          totalReviews: updated.totalReviews,
          averageRating: updated.averageRating
        });
      }

      return updated;
    });
  };

  // 4. Handle Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    setErrorMsg('');
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImages(prev => [...prev, data.url]);
      setSuccessMsg('Image uploaded successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  // 5. Submit Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) {
      setErrorMsg('Please write a review comment.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await api.post(`/api/products/${productId}/reviews`, {
        rating,
        reviewTitle: title,
        reviewDescription: description,
        reviewImages: images
      });

      setSuccessMsg('Your review has been submitted successfully!');
      setRating(5);
      setTitle('');
      setDescription('');
      setImages([]);
      setShowForm(false);
      
      // Auto-refresh eligibility state
      checkEligibility();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t border-zinc-200 dark:border-white/5 pt-12 mt-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bebas text-black dark:text-white tracking-widest uppercase">Customer Reviews</h2>
          <p className="text-zinc-550 dark:text-gray-400 font-poppins text-xs mt-1">Real reviews from verified buyers.</p>
        </div>
        
        {isAuthenticated && isEligible && !showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-5 py-2.5 text-xs font-montserrat font-bold uppercase tracking-wider rounded transition-all shadow-md active:scale-95 flex items-center gap-1.5"
          >
            <MessageSquare size={14} />
            <span>Write A Review</span>
          </button>
        )}
        
        {isAuthenticated && !isEligible && !checkingEligibility && (
          <div className="flex items-center space-x-1.5 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 p-3 rounded-lg text-[10px] uppercase font-montserrat text-zinc-500 tracking-wider">
            <AlertTriangle size={14} className="text-yellow-500" />
            <span>Only verified buyers can review this product.</span>
          </div>
        )}
      </div>

      {/* Stats Summary Dashboard */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-zinc-550/5 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-2xl mb-8">
          <div className="flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-zinc-200 dark:border-white/5 py-4 md:py-0">
            <h3 className="text-4xl md:text-5xl font-poppins font-bold text-black dark:text-white leading-none">{stats.averageRating}</h3>
            <div className="flex text-[#ff0033] mt-2 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < Math.round(stats.averageRating) ? "fill-[#ff0033]" : "text-gray-600"} />
              ))}
            </div>
            <span className="text-xs font-poppins text-zinc-500">{stats.totalReviews} total ratings</span>
          </div>

          <div className="col-span-2 space-y-2 py-2">
            {[5, 4, 3, 2, 1].map(stars => {
              const count = stats.ratingBreakdown?.[stars] || 0;
              const percent = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
              return (
                <div key={stars} className="flex items-center text-xs font-poppins text-zinc-500 gap-3">
                  <span className="w-12 text-right">{stars} star</span>
                  <div className="flex-1 h-2 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#ff0033] rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="w-8 text-left">{Math.round(percent)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review Submission Form Modal/Panel */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <form onSubmit={handleSubmitReview} className="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-2xl p-6 space-y-5 font-poppins">
              <div className="flex justify-between items-center pb-3 border-b border-zinc-200 dark:border-white/5">
                <h3 className="text-lg font-bebas text-black dark:text-white tracking-widest uppercase">Add Your Review</h3>
                <button 
                  type="button" 
                  onClick={() => { setShowForm(false); setErrorMsg(''); }}
                  className="text-xs font-montserrat text-zinc-500 hover:text-black dark:hover:text-white uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>

              {errorMsg && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs">{errorMsg}</div>}
              {successMsg && <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs">{successMsg}</div>}

              {/* Rating selection */}
              <div className="space-y-1">
                <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500">Overall Rating</label>
                <div className="flex space-x-1.5 text-zinc-400">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star size={24} className={star <= rating ? "fill-[#ff0033] text-[#ff0033]" : "text-gray-500"} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500">Review Title (Optional)</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Extremely comfortable fit!"
                  className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500">Review Details</label>
                <textarea 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write your review here. What did you like or dislike about the product?"
                  className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none text-sm resize-none"
                  required
                ></textarea>
              </div>

              {/* Images preview & upload */}
              <div className="space-y-2">
                <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500">Add Photos</label>
                <div className="flex flex-wrap gap-3 items-center">
                  {images.map((img, i) => (
                    <div key={i} className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-lg overflow-hidden relative">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-0 right-0 bg-black/80 text-white p-0.5 hover:text-[#ff0033] rounded-bl"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {images.length < 5 && (
                    <label className="w-16 h-16 border-2 border-dashed border-zinc-300 dark:border-white/10 hover:border-[#ff0033]/50 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors relative">
                      {uploading ? (
                        <Loader2 className="animate-spin text-zinc-400" size={16} />
                      ) : (
                        <>
                          <Camera size={18} className="text-zinc-500" />
                          <span className="text-[8px] text-zinc-400 font-bold uppercase mt-1">Upload</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        disabled={uploading} 
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-6 py-3 rounded-lg text-xs font-montserrat font-bold tracking-widest uppercase transition-colors flex items-center justify-center shadow-lg shadow-[#ff0033]/15"
                >
                  {submitting && <Loader2 className="animate-spin mr-2" size={14} />}
                  <span>Submit Review</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-[#ff0033] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map(review => (
            <div 
              key={review._id} 
              className={`bg-white dark:bg-white/[0.01] border ${
                review.isPinned ? 'border-[#ff0033]/30 shadow-[0_0_12px_rgba(255,0,51,0.05)]' : 'border-zinc-200 dark:border-white/5'
              } p-5 md:p-6 rounded-2xl space-y-4`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 pb-3 border-b border-zinc-200 dark:border-white/5">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-zinc-150 dark:bg-white/5 border border-zinc-200 dark:border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-bold font-montserrat">
                    {review.userProfileImage ? (
                      <img src={review.userProfileImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      review.userName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-montserrat font-bold text-xs text-black dark:text-white leading-none">{review.userName}</span>
                      {review.isVerifiedPurchase && (
                        <span className="flex items-center text-[9px] font-montserrat uppercase font-bold text-green-500 bg-green-500/5 px-2 py-0.5 rounded-full border border-green-500/10">
                          <CheckCircle2 size={10} className="mr-1" /> Verified Buyer
                        </span>
                      )}
                      {review.isPinned && (
                        <span className="flex items-center text-[9px] font-montserrat uppercase font-bold text-[#ff0033] bg-[#ff0033]/5 px-2 py-0.5 rounded-full border border-[#ff0033]/10">
                          <Pin size={10} className="mr-1" /> Pinned
                        </span>
                      )}
                      {review.isFeatured && (
                        <span className="flex items-center text-[9px] font-montserrat uppercase font-bold text-blue-500 bg-blue-500/5 px-2 py-0.5 rounded-full border border-blue-500/10">
                          <Bookmark size={10} className="mr-1" /> Featured
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-poppins block mt-1">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex text-[#ff0033]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < review.rating ? "fill-[#ff0033]" : "text-gray-600"} />
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-2">
                {review.reviewTitle && (
                  <h4 className="font-montserrat font-bold text-sm text-black dark:text-white">{review.reviewTitle}</h4>
                )}
                <p className="font-poppins text-xs md:text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed">
                  {review.reviewDescription}
                </p>
              </div>

              {/* Review Images Grid */}
              {review.reviewImages && review.reviewImages.length > 0 && (
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {review.reviewImages.map((img, i) => (
                    <div key={i} className="w-16 h-20 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-lg overflow-hidden relative cursor-zoom-in">
                      <img src={optimizeImageUrl(img, 160)} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Admin Reply */}
              {review.adminReply && (
                <div className="bg-[#ff0033]/5 border-l-2 border-[#ff0033] p-4 rounded-r-xl space-y-1.5 font-poppins">
                  <div className="flex justify-between items-center text-[10px] font-montserrat font-bold uppercase tracking-wider text-[#ff0033]">
                    <span>Response from Redsee Team ❤️</span>
                    <span className="text-zinc-500 font-normal normal-case">{new Date(review.adminReply.repliedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-gray-300 leading-relaxed font-medium">
                    "{review.adminReply.message}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-zinc-50 dark:bg-white/[0.01] rounded-2xl border border-zinc-200 dark:border-white/5 font-poppins">
          <p className="text-zinc-550 dark:text-gray-500 text-sm mb-4">No reviews yet for this product.</p>
          {isAuthenticated && isEligible ? (
            <button 
              onClick={() => setShowForm(true)}
              className="border border-[#ff0033] text-[#ff0033] hover:bg-[#ff0033] hover:text-white px-5 py-2 rounded-lg text-xs font-montserrat font-bold uppercase tracking-widest transition-colors"
            >
              Be the first to review
            </button>
          ) : (
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-montserrat">Bought this product? Log in to leave your feedback.</p>
          )}
        </div>
      )}
    </div>
  );
}
