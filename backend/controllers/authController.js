const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const admin = require('firebase-admin');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

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
        // Return 200 with flag for frontend to prompt onboarding
        return res.status(200).json({
          isNewUser: true,
          email: decodedToken.email,
          name: decodedToken.name || 'Google User',
          avatar: decodedToken.picture || ''
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

// @desc    Complete Google Onboarding
// @route   POST /api/auth/google-signup
// @access  Public
const googleSignup = async (req, res) => {
  const { idToken, email, name, avatar, phone, gender } = req.body;

  try {
    if (admin.apps.length === 0) {
      return res.status(500).json({ message: 'Firebase Admin not initialized' });
    }

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (verifyError) {
      return res.status(401).json({ message: 'Firebase Token Verification Failed', error: verifyError.message });
    }

    if (decodedToken.email !== email) {
      return res.status(401).json({ message: 'Invalid token email payload' });
    }

    let user = await User.findOne({ email });
    if (user) {
       return res.status(400).json({ message: 'User already exists' });
    }

    user = await User.create({
      name,
      email,
      phone,
      gender,
      authProvider: 'google',
      avatar,
      isVerified: true
    });

    const token = generateTokenAndSetCookie(res, user._id);
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Send Email OTP for Signup
// @route   POST /api/auth/send-email-otp
// @access  Public
const sendEmailOtp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ message: 'User already exists and is verified' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (user) {
      // Update unverified user
      user.name = name;
      user.password = hashedPassword;
      user.emailOtp = hashedOtp;
      user.otpExpire = otpExpire;
      await user.save();
    } else {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        authProvider: 'email',
        isVerified: false,
        emailOtp: hashedOtp,
        otpExpire,
      });
    }

    const message = `Your Redsee verification code is: ${otp}\nThis code will expire in 10 minutes.`;
    
    // For local development without SMTP, log the OTP
    console.log(`\n\n=== OTP FOR ${email} IS: ${otp} ===\n\n`);

    await sendEmail({
      email: user.email,
      subject: 'Redsee - Email Verification Code',
      message,
    });

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify Email OTP
// @route   POST /api/auth/verify-email-otp
// @access  Public
const verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    
    const user = await User.findOne({
      email,
      emailOtp: hashedOtp,
      otpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.emailOtp = undefined;
    user.otpExpire = undefined;
    await user.save();

    const token = generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
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

    if (user && !user.isVerified && user.authProvider === 'email') {
      return res.status(401).json({ message: 'Please verify your email first before logging in' });
    }

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
  googleSignup,
  phoneLogin,
  sendEmailOtp,
  verifyEmailOtp,
  login,
  logout,
};
