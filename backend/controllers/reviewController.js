const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Helper to check if a socket trigger is active and notify
const emitRealTimeUpdate = (req, roomId, event, data) => {
  const io = req.app.get('socketio');
  if (io) {
    io.to(roomId).emit(event, data);
  }
};

// @desc    Create a new product review
// @route   POST /api/products/:id/reviews
// @access  Private (Verified Purchase Only)
const createReview = async (req, res) => {
  const { rating, reviewTitle, reviewDescription, reviewImages, reviewVideos } = req.body;
  const productId = req.params.id;
  const userId = req.user._id;

  try {
    // 1. Verify that product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // 2. Verify that the user has a delivered order for this product
    const order = await Order.findOne({
      userId,
      orderStatus: 'Delivered',
      'products.product': productId
    });

    if (!order) {
      return res.status(403).json({ 
        message: 'Only verified buyers who have received this product can submit a review.' 
      });
    }

    // 3. Check if user already reviewed this order/product combination
    const existingReview = await Review.findOne({ userId, productId, orderId: order._id });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product for this order.' });
    }

    // 4. Create review
    const review = await Review.create({
      productId,
      userId,
      orderId: order._id,
      userName: req.user.name,
      userProfileImage: req.user.avatar || '',
      rating: Number(rating),
      reviewTitle,
      reviewDescription,
      reviewImages: reviewImages || [],
      reviewVideos: reviewVideos || [],
      isVerifiedPurchase: true
    });

    // Notify real-time connections watching this product reviews room
    emitRealTimeUpdate(req, `product_${productId}`, 'new_review', review);
    emitRealTimeUpdate(req, 'admin_reviews', 'review_created', review);

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create review', error: error.message });
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res) => {
  const productId = req.params.id;

  try {
    // Fetch only unhidden reviews
    const reviews = await Review.find({ productId, isHidden: false })
      .sort({ isPinned: -1, createdAt: -1 });

    // Calculate rating aggregates
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
      : 0;

    // Breakdown rating counts
    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const rate = Math.round(r.rating);
      if (ratingBreakdown[rate] !== undefined) {
        ratingBreakdown[rate]++;
      }
    });

    res.json({
      reviews,
      stats: {
        totalReviews,
        averageRating,
        ratingBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};

// @desc    Get logged in user's reviews
// @route   GET /api/users/reviews
// @access  Private
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .populate('productId', 'name images pricing')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch your reviews', error: error.message });
  }
};

// @desc    Get all reviews for Admin/Co-admin
// @route   GET /api/admin/reviews
// @access  Private (Staff only)
const getAllReviewsAdmin = async (req, res) => {
  try {
    const { rating, verified, hidden, search, productId } = req.query;
    
    let query = {};

    if (rating) query.rating = Number(rating);
    if (verified) query.isVerifiedPurchase = verified === 'true';
    if (hidden) query.isHidden = hidden === 'true';
    if (productId) query.productId = productId;

    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { reviewTitle: { $regex: search, $options: 'i' } },
        { reviewDescription: { $regex: search, $options: 'i' } }
      ];
    }

    const reviews = await Review.find(query)
      .populate('productId', 'name images pricing')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch admin reviews', error: error.message });
  }
};

// @desc    Reply to a review
// @route   PUT /api/admin/reviews/:id/reply
// @access  Private (Staff only)
const replyToReview = async (req, res) => {
  const { message } = req.body;
  const reviewId = req.params.id;

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.adminReply = {
      message,
      repliedAt: new Date(),
      repliedBy: req.user._id
    };

    const updatedReview = await review.save();
    
    // Notify frontend real-time connections
    emitRealTimeUpdate(req, `product_${review.productId}`, 'review_updated', updatedReview);
    emitRealTimeUpdate(req, 'admin_reviews', 'review_updated', updatedReview);

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Failed to reply to review', error: error.message });
  }
};

// @desc    Toggle review visibility (hide/unhide)
// @route   PUT /api/admin/reviews/:id/toggle-hide
// @access  Private (Staff only)
const toggleHideReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.isHidden = !review.isHidden;
    const updatedReview = await review.save();

    emitRealTimeUpdate(req, `product_${review.productId}`, 'review_updated', updatedReview);
    emitRealTimeUpdate(req, 'admin_reviews', 'review_updated', updatedReview);

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle review visibility', error: error.message });
  }
};

// @desc    Toggle feature review
// @route   PUT /api/admin/reviews/:id/toggle-feature
// @access  Private (Staff only)
const toggleFeatureReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.isFeatured = !review.isFeatured;
    const updatedReview = await review.save();

    emitRealTimeUpdate(req, `product_${review.productId}`, 'review_updated', updatedReview);
    emitRealTimeUpdate(req, 'admin_reviews', 'review_updated', updatedReview);

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle featured status', error: error.message });
  }
};

// @desc    Toggle pin review
// @route   PUT /api/admin/reviews/:id/toggle-pin
// @access  Private (Staff only)
const togglePinReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.isPinned = !review.isPinned;
    const updatedReview = await review.save();

    emitRealTimeUpdate(req, `product_${review.productId}`, 'review_updated', updatedReview);
    emitRealTimeUpdate(req, 'admin_reviews', 'review_updated', updatedReview);

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle pinned status', error: error.message });
  }
};

// @desc    Resolve review feedback
// @route   PUT /api/admin/reviews/:id/resolve
// @access  Private (Staff only)
const resolveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.isResolved = !review.isResolved;
    const updatedReview = await review.save();

    emitRealTimeUpdate(req, `product_${review.productId}`, 'review_updated', updatedReview);
    emitRealTimeUpdate(req, 'admin_reviews', 'review_updated', updatedReview);

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark review resolved', error: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/admin/reviews/:id
// @access  Private (Staff only)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.deleteOne();

    emitRealTimeUpdate(req, `product_${review.productId}`, 'review_deleted', req.params.id);
    emitRealTimeUpdate(req, 'admin_reviews', 'review_deleted', req.params.id);

    res.json({ message: 'Review deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete review', error: error.message });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  getUserReviews,
  getAllReviewsAdmin,
  replyToReview,
  toggleHideReview,
  toggleFeatureReview,
  togglePinReview,
  resolveReview,
  deleteReview
};
