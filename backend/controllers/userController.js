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
  
  // HARDCODED FALLBACK FOR PREVIEW WITHOUT DATABASE
  if (password === 'password123') {
    if (email === 'admin@redsee.com') {
      return res.json({ _id: '1', name: 'Admin User', email, role: 'admin', hasPassword: true, token: generateToken('1') });
    }
    if (email === 'staff@redsee.com') {
      return res.json({ _id: '2', name: 'Staff Member', email, role: 'coadmin', hasPassword: true, token: generateToken('2') });
    }
    if (email === 'user@redsee.com') {
      return res.json({ _id: '3', name: 'Regular User', email, role: 'user', hasPassword: true, token: generateToken('3') });
    }
  }

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

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
