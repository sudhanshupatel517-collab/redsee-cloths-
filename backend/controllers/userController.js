const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch(err) {
      res.status(500).json({ message: 'Database connection failed. Please use preview accounts: admin@redsee.com / password123' });
  }
};

const getUserProfile = async (req, res) => {
  // Handle hardcoded users
  if (req.user && ['1', '2', '3'].includes(req.user._id?.toString())) {
     return res.json(req.user);
  }

  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch(err) {
    res.status(500).json({ message: 'Database Error' });
  }
};
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.gender = req.body.gender || user.gender;
      user.avatar = req.body.avatar || user.avatar;
      
      // We will add DOB later if needed
      
      // Update address if provided
      if (req.body.address) {
        if (user.addresses && user.addresses.length > 0) {
          Object.assign(user.addresses[0], req.body.address);
        } else {
          user.addresses.push(req.body.address);
        }
      }

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        hasPassword: updatedUser.hasPassword || false,
        addresses: updatedUser.addresses,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add product to recently viewed list
// @route   POST /api/users/recently-viewed
// @access  Private
const addRecentlyViewed = async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.recentlyViewed) {
      user.recentlyViewed = [];
    }

    // Remove duplicates if already exists
    user.recentlyViewed = user.recentlyViewed.filter(
      (item) => item.productId && item.productId.toString() !== productId.toString()
    );

    // Add most recently viewed at first position
    user.recentlyViewed.unshift({ productId, viewedAt: new Date() });

    // Cap at 20 products
    if (user.recentlyViewed.length > 20) {
      user.recentlyViewed = user.recentlyViewed.slice(0, 20);
    }

    await user.save();
    res.status(200).json({ message: 'Product added to recently viewed list' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's recently viewed products list
// @route   GET /api/users/recently-viewed
// @access  Private
const getRecentlyViewed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'recentlyViewed.productId',
      model: 'Product'
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out items where the populated product might be null (e.g. deleted products)
    const validProducts = user.recentlyViewed
      .filter((item) => item.productId != null)
      .map((item) => item.productId);

    res.status(200).json(validProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Merge guest recently viewed items (from localStorage) with user's profile
// @route   POST /api/users/recently-viewed/merge
// @access  Private
const mergeRecentlyViewed = async (req, res) => {
  const { history } = req.body;
  if (!history || !Array.isArray(history)) {
    return res.status(400).json({ message: 'History array is required' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.recentlyViewed) {
      user.recentlyViewed = [];
    }

    const combined = [...user.recentlyViewed];

    history.forEach((localItem) => {
      if (!localItem.productId) return;
      const index = combined.findIndex(
        (dbItem) => dbItem.productId && dbItem.productId.toString() === localItem.productId.toString()
      );
      if (index > -1) {
        // If both exist, preserve the latest timestamp
        const dbTime = new Date(combined[index].viewedAt).getTime();
        const localTime = new Date(localItem.viewedAt).getTime();
        if (localTime > dbTime) {
          combined[index].viewedAt = new Date(localItem.viewedAt);
        }
      } else {
        combined.push({
          productId: localItem.productId,
          viewedAt: new Date(localItem.viewedAt)
        });
      }
    });

    // Sort by viewedAt desc
    combined.sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime());

    // Slice to cap at 20
    user.recentlyViewed = combined.slice(0, 20);

    await user.save();
    res.status(200).json({ message: 'Recently viewed list merged successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Toggle product in wishlist
// @route   POST /api/users/wishlist
// @access  Private
const toggleWishlist = async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.wishlist) {
      user.wishlist = [];
    }

    const index = user.wishlist.indexOf(productId);
    let isAdded = false;

    if (index > -1) {
      // Remove from wishlist
      user.wishlist.splice(index, 1);
    } else {
      // Add to wishlist
      user.wishlist.push(productId);
      isAdded = true;
    }

    await user.save();
    res.status(200).json({ 
      message: isAdded ? 'Added to wishlist' : 'Removed from wishlist',
      wishlist: user.wishlist
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.wishlist || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Merge guest wishlist items with user's profile wishlist
// @route   POST /api/users/wishlist/merge
// @access  Private
const mergeWishlist = async (req, res) => {
  const { wishlistIds } = req.body;
  if (!wishlistIds || !Array.isArray(wishlistIds)) {
    return res.status(400).json({ message: 'wishlistIds array is required' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.wishlist) {
      user.wishlist = [];
    }

    // Combine and remove duplicates
    const combinedSet = new Set([
      ...user.wishlist.map(id => id.toString()),
      ...wishlistIds.map(id => id.toString())
    ]);

    user.wishlist = Array.from(combinedSet);

    await user.save();
    res.status(200).json({ message: 'Wishlist merged successfully', wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
const getAddresses = async (req, res) => {
  try {
    res.json(req.user.addresses || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = async (req, res) => {
  try {
    const user = req.user;
    const { name, street, city, state, zipCode, country, phone, isDefault } = req.body;

    if (!street || !city || !state || !zipCode || !phone) {
      return res.status(400).json({ message: 'All address fields are required' });
    }

    const newAddress = {
      name: name || user.name,
      street,
      city,
      state,
      zipCode,
      country: country || 'India',
      phone,
      isDefault: isDefault || false
    };

    if (newAddress.isDefault) {
      // Clear default status of other addresses
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    } else if (user.addresses.length === 0) {
      // If first address, make it default
      newAddress.isDefault = true;
    }

    user.addresses.push(newAddress);
    await user.save();
    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
const updateAddress = async (req, res) => {
  try {
    const user = req.user;
    const { name, street, city, state, zipCode, country, phone, isDefault } = req.body;

    const address = user.addresses.id(req.params.addressId);

    if (address) {
      address.name = name !== undefined ? name : address.name;
      address.street = street !== undefined ? street : address.street;
      address.city = city !== undefined ? city : address.city;
      address.state = state !== undefined ? state : address.state;
      address.zipCode = zipCode !== undefined ? zipCode : address.zipCode;
      address.country = country !== undefined ? country : address.country;
      address.phone = phone !== undefined ? phone : address.phone;

      if (isDefault !== undefined) {
        address.isDefault = isDefault;
        if (isDefault) {
          // Clear default status of other addresses
          user.addresses.forEach(addr => {
            if (addr._id.toString() !== req.params.addressId) {
              addr.isDefault = false;
            }
          });
        }
      }

      await user.save();
      res.json(user.addresses);
    } else {
      res.status(404).json({ message: 'Address not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const user = req.user;
    const address = user.addresses.id(req.params.addressId);

    if (address) {
      const wasDefault = address.isDefault;
      address.deleteOne();
      
      // If we deleted the default address, make the first remaining address the default
      if (wasDefault && user.addresses.length > 0) {
        user.addresses[0].isDefault = true;
      }

      await user.save();
      res.json(user.addresses);
    } else {
      res.status(404).json({ message: 'Address not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addRecentlyViewed,
  getRecentlyViewed,
  mergeRecentlyViewed,
  toggleWishlist,
  getWishlist,
  mergeWishlist,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
};
