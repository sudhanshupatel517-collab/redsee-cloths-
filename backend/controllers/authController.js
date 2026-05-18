const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const admin = require('firebase-admin');

// Initialize Firebase Admin (Only works if credentials are provided in env, else we mock verification for preview)
try {
  if (process.env.FIREBASE_PROJECT_ID) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
} catch (error) {
  console.log('Firebase Admin initialization skipped (missing or invalid credentials)');
}

const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

// @desc    Auth with Google
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  const { idToken, email, name, avatar } = req.body;

  try {
    if (admin.apps.length === 0) {
      return res.status(500).json({ message: 'Firebase Admin not initialized. Please configure FIREBASE_PROJECT_ID in .env' });
    }
    
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (verifyError) {
      return res.status(401).json({ message: 'Firebase Token Verification Failed', error: verifyError.message });
    }

    try {
      let user = await User.findOne({ email: decodedToken.email });

      if (!user) {
        user = await User.create({
          name: decodedToken.name || 'Google User',
          email: decodedToken.email,
          avatar: decodedToken.picture || '',
          authProvider: 'google',
          isVerified: true,
        });
      }

      const token = generateTokenAndSetCookie(res, user._id);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token,
      });
    } catch (dbError) {
      res.status(500).json({ message: 'MongoDB Database Error', error: dbError.message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Auth with Phone OTP
// @route   POST /api/auth/phone
// @access  Public
const phoneLogin = async (req, res) => {
  const { idToken, phone } = req.body;

  try {
    if (admin.apps.length === 0) {
      return res.status(500).json({ message: 'Firebase Admin not initialized. Please configure FIREBASE_PROJECT_ID in .env' });
    }

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (verifyError) {
      return res.status(401).json({ message: 'Firebase Token Verification Failed', error: verifyError.message });
    }

    try {
      let user = await User.findOne({ phone: decodedToken.phone_number });

      if (!user) {
        user = await User.create({
          name: 'Mobile User',
          phone: decodedToken.phone_number,
          authProvider: 'phone',
          isVerified: true,
        });
      }

      const token = generateTokenAndSetCookie(res, user._id);

      res.json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        token,
      });
    } catch (dbError) {
      res.status(500).json({ message: 'MongoDB Database Error', error: dbError.message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      authProvider: 'email',
    });

    const token = generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;



  try {
    const user = await User.findOne({ email });

    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      const token = generateTokenAndSetCookie(res, user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch(err) {
      res.status(500).json({ message: 'Server or Database error.', error: err.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
  googleLogin,
  phoneLogin,
  signup,
  login,
  logout,
};
