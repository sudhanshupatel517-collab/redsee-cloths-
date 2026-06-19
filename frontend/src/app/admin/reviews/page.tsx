'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { getSocket } from '@/lib/socket';
import api from '@/lib/axios';
import { 
  Star, 
  Search, 
  MessageSquare, 
  Trash2, 
  EyeOff, 
  Eye, 
  Pin, 
  Bookmark, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle,
  RotateCcw,
  CornerDownRight,
  Filter
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
  isVerifiedPurchase: boolean;
  isHidden: boolean;
  isFeatured: boolean;
  isPinned: boolean;
  isResolved: boolean;
  createdAt: string;
  productId: {
    _id: string;
    name: string;
    images?: any[];
  } | null;
  adminReply?: {
    message: string;
    repliedAt: string;
  };
}

export default function AdminReviews() {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [hiddenFilter, setHiddenFilter] = useState('');

  // Reply States
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      let query = `?search=${search}`;
      if (ratingFilter) query += `&rating=${ratingFilter}`;
      if (verifiedFilter) query += `&verified=${verifiedFilter}`;
      if (hiddenFilter) query += `&hidden=${hiddenFilter}`;

      const { data } = await api.get(`/api/admin/reviews${query}`);
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching admin reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [ratingFilter, verifiedFilter, hiddenFilter]);

  // Real-time synchronization
  useEffect(() => {
    const socket = getSocket();
    socket.connect();
    socket.emit('join_room', 'admin_reviews');

    socket.on('review_created', (newReview: Review) => {
      // Re-fetch or manually add if matches filter
      setReviews(prev => {
        if (prev.some(r => r._id === newReview._id)) return prev;
        return [newReview, ...prev];
      });
    });

    socket.on('review_updated', (updatedReview: Review) => {
      setReviews(prev => prev.map(r => r._id === updatedReview._id ? updatedReview : r));
    });

    socket.on('review_deleted', (deletedId: string) => {
      setReviews(prev => prev.filter(r => r._id !== deletedId));
    });

    return () => {
      socket.emit('leave_room', 'admin_reviews');
      socket.off('review_created');
      socket.off('review_updated');
      socket.off('review_deleted');
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReviews();
  };

  // Actions
  const handleToggleHide = async (id: string) => {
    try {
      await api.put(`/api/admin/reviews/${id}/toggle-hide`);
    } catch (err) {
      console.error('Failed to toggle hide:', err);
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      await api.put(`/api/admin/reviews/${id}/toggle-pin`);
    } catch (err) {
      console.error('Failed to toggle pin:', err);
    }
  };

  const handleToggleFeature = async (id: string) => {
    try {
      await api.put(`/api/admin/reviews/${id}/toggle-feature`);
    } catch (err) {
      console.error('Failed to toggle feature:', err);
    }
  };

  const handleToggleResolve = async (id: string) => {
    try {
      await api.put(`/api/admin/reviews/${id}/resolve`);
    } catch (err) {
      console.error('Failed to toggle resolve:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this review? This action is permanent.')) return;
    try {
      await api.delete(`/api/admin/reviews/${id}`);
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  const handleSubmitReply = async (id: string) => {
    if (!replyText.trim()) return;
    setSubmittingReply(true);
    try {
      await api.put(`/api/admin/reviews/${id}/reply`, { message: replyText });
      setActiveReplyId(null);
      setReplyText('');
    } catch (err) {
      console.error('Failed to reply:', err);
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="w-full py-4 text-zinc-900 dark:text-zinc-100 font-poppins">
      <div className="mb-8">
        <h1 className="text-3xl font-bebas tracking-widest text-[#ff0033] uppercase">REVIEWS DASHBOARD</h1>
        <p className="text-zinc-550 dark:text-gray-400 text-sm mt-1">Moderate customer reviews, publish replies, pin critical feedback, and feature user media.</p>
      </div>

      {/* Filters & Search Row */}
      <div className="bg-zinc-50 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 p-5 rounded-2xl mb-8 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="flex-1 bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-2 flex items-center">
            <Search size={16} className="text-zinc-500 mr-3" />
            <input 
              type="text" 
              placeholder="Search reviews by user name, keywords, titles..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-full text-black dark:text-white"
            />
          </div>
          <button type="submit" className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-5 rounded-lg text-xs font-montserrat font-bold tracking-wider uppercase transition-colors">
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-4 text-xs font-montserrat font-bold">
          <div className="flex items-center space-x-2">
            <Filter size={14} className="text-zinc-500" />
            <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Filter by:</span>
          </div>

          <select 
            value={ratingFilter} 
            onChange={(e) => setRatingFilter(e.target.value)}
            className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-white/10 rounded px-2.5 py-1 text-xs"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <select 
            value={verifiedFilter} 
            onChange={(e) => setVerifiedFilter(e.target.value)}
            className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-white/10 rounded px-2.5 py-1 text-xs"
          >
            <option value="">All Purchases</option>
            <option value="true">Verified Buyers Only</option>
            <option value="false">Unverified Only</option>
          </select>

          <select 
            value={hiddenFilter} 
            onChange={(e) => setHiddenFilter(e.target.value)}
            className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-white/10 rounded px-2.5 py-1 text-xs"
          >
            <option value="false">Visible Only</option>
            <option value="true">Hidden Reviews Only</option>
            <option value="">All (Incl. Hidden)</option>
          </select>

          {(ratingFilter || verifiedFilter || hiddenFilter || search) && (
            <button 
              onClick={() => { setSearch(''); setRatingFilter(''); setVerifiedFilter(''); setHiddenFilter('false'); }}
              className="text-[#ff0033] hover:underline flex items-center gap-1 font-bold"
            >
              <RotateCcw size={12} /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#ff0033] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map(review => (
            <div 
              key={review._id} 
              className={`bg-zinc-550/5 dark:bg-white/[0.01] border ${
                review.isHidden ? 'border-dashed border-red-500/30 bg-red-500/[0.01]' : 'border-zinc-200 dark:border-white/5'
              } rounded-2xl p-5 md:p-6 space-y-4`}
            >
              {/* Top Row: User details & Product name */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-zinc-200 dark:border-white/5 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {review.userProfileImage ? (
                      <img src={review.userProfileImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bebas text-sm font-bold">{review.userName.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-montserrat font-bold text-xs text-black dark:text-white leading-none">{review.userName}</span>
                      {review.isVerifiedPurchase && (
                        <span className="text-[8px] font-montserrat uppercase font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/10">
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-poppins block mt-1">Review ID: {review._id} | {new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {review.productId && (
                  <div className="flex items-center space-x-2 bg-white dark:bg-black/35 border border-zinc-200 dark:border-white/5 px-3 py-1.5 rounded-xl max-w-xs self-start md:self-auto">
                    <div className="w-6 h-8 bg-zinc-150 dark:bg-zinc-900 rounded overflow-hidden flex-shrink-0">
                      {review.productId.images && (
                        <img 
                          src={optimizeImageUrl(typeof review.productId.images[0] === 'string' ? review.productId.images[0] : review.productId.images[0]?.url, 80)} 
                          alt="" 
                          className="w-full h-full object-cover" 
                        />
                      )}
                    </div>
                    <span className="text-[10px] font-montserrat font-bold text-black dark:text-white truncate max-w-[150px]">{review.productId.name}</span>
                  </div>
                )}
              </div>

              {/* Review Details */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex text-[#ff0033]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < review.rating ? "fill-[#ff0033]" : "text-gray-600"} />
                    ))}
                  </div>
                  {review.reviewTitle && (
                    <span className="font-montserrat font-bold text-xs text-black dark:text-white">— {review.reviewTitle}</span>
                  )}
                </div>
                
                <p className="text-xs md:text-sm text-zinc-650 dark:text-gray-400 font-poppins leading-relaxed">
                  {review.reviewDescription}
                </p>

                {review.reviewImages && review.reviewImages.length > 0 && (
                  <div className="flex gap-2 pt-2">
                    {review.reviewImages.map((img, i) => (
                      <div key={i} className="w-14 h-18 rounded border border-zinc-200 dark:border-white/5 overflow-hidden">
                        <img src={optimizeImageUrl(img, 150)} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Admin response block if present */}
              {review.adminReply && (
                <div className="bg-[#ff0033]/5 border-l-2 border-[#ff0033] p-4 rounded-r-xl space-y-1 font-poppins ml-4">
                  <div className="flex justify-between items-center text-[9px] font-montserrat font-bold uppercase tracking-wider text-[#ff0033]">
                    <span>Staff Reply</span>
                    <span className="text-zinc-500 normal-case font-normal">{new Date(review.adminReply.repliedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-gray-300 italic">
                    "{review.adminReply.message}"
                  </p>
                </div>
              )}

              {/* Actions Toolbar */}
              <div className="pt-3 border-t border-zinc-200 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-montserrat font-bold text-zinc-500">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {/* Hide Toggle */}
                  <button 
                    onClick={() => handleToggleHide(review._id)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      review.isHidden 
                        ? 'bg-red-500/10 border-red-500/25 text-red-500' 
                        : 'border-zinc-200 dark:border-white/10 hover:text-black dark:hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {review.isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                    <span className="hidden sm:inline">{review.isHidden ? 'Hidden' : 'Hide'}</span>
                  </button>

                  {/* Pin Toggle */}
                  <button 
                    onClick={() => handleTogglePin(review._id)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      review.isPinned 
                        ? 'bg-[#ff0033]/15 border-[#ff0033]/30 text-[#ff0033]' 
                        : 'border-zinc-200 dark:border-white/10 hover:text-black dark:hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Pin size={13} />
                    <span className="hidden sm:inline">{review.isPinned ? 'Pinned' : 'Pin'}</span>
                  </button>

                  {/* Feature Toggle */}
                  <button 
                    onClick={() => handleToggleFeature(review._id)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      review.isFeatured 
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' 
                        : 'border-zinc-200 dark:border-white/10 hover:text-black dark:hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Bookmark size={13} />
                    <span className="hidden sm:inline">{review.isFeatured ? 'Featured' : 'Feature'}</span>
                  </button>

                  {/* Resolve Toggle */}
                  <button 
                    onClick={() => handleToggleResolve(review._id)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      review.isResolved 
                        ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                        : 'border-zinc-200 dark:border-white/10 hover:text-black dark:hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <CheckCircle2 size={13} />
                    <span className="hidden sm:inline">{review.isResolved ? 'Resolved' : 'Mark Resolved'}</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setActiveReplyId(activeReplyId === review._id ? null : review._id)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-[#ff0033]/10 hover:bg-[#ff0033]/20 border border-[#ff0033]/25 text-[#ff0033] rounded-lg transition-all cursor-pointer"
                  >
                    <MessageSquare size={13} />
                    <span>Reply</span>
                  </button>

                  <button 
                    onClick={() => handleDelete(review._id)}
                    className="p-2 border border-zinc-200 dark:border-white/10 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Reply Form */}
              {activeReplyId === review._id && (
                <div className="pt-2 pl-4 border-l border-zinc-200 dark:border-white/5 space-y-3 font-poppins">
                  <div className="flex items-center space-x-2 text-zinc-500 text-xs">
                    <CornerDownRight size={14} className="text-[#ff0033]" />
                    <span>Draft Reply:</span>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="e.g. Thank you for your feedback ❤️"
                      className="flex-1 bg-white dark:bg-black/35 border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-xs outline-none text-black dark:text-white focus:border-[#ff0033] transition-colors"
                      required
                    />
                    <button 
                      onClick={() => handleSubmitReply(review._id)}
                      disabled={submittingReply}
                      className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-5 rounded-lg text-xs font-montserrat font-bold uppercase tracking-wider flex items-center justify-center transition-colors"
                    >
                      {submittingReply ? <Loader2 className="animate-spin" size={14} /> : 'Send'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-550/5 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-2xl font-poppins">
          <AlertTriangle size={32} className="text-zinc-500 mb-3" />
          <p className="text-zinc-500 text-sm">No reviews found matching filters.</p>
        </div>
      )}
    </div>
  );
}
