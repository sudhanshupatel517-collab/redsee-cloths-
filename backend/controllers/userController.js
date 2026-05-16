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
      return res.json({ _id: '1', name: 'Admin User', email, role: 'admin', token: generateToken('1') });
    }
    if (email === 'staff@redsee.com') {
      return res.json({ _id: '2', name: 'Staff Member', email, role: 'coadmin', token: generateToken('2') });
    }
    if (email === 'user@redsee.com') {
      return res.json({ _id: '3', name: 'Regular User', email, role: 'user', token: generateToken('3') });
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

module.exports = { registerUser, loginUser, getUserProfile };
