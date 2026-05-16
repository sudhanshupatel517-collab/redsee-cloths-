const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      
      // HARDCODED FALLBACK FOR PREVIEW
      if (['1', '2', '3'].includes(decoded.id)) {
        if (decoded.id === '1') req.user = { _id: '1', role: 'admin', name: 'Admin User', email: 'admin@redsee.com' };
        if (decoded.id === '2') req.user = { _id: '2', role: 'coadmin', name: 'Staff Member', email: 'staff@redsee.com' };
        if (decoded.id === '3') req.user = { _id: '3', role: 'user', name: 'Regular User', email: 'user@redsee.com' };
        return next();
      }

      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

const coadmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'coadmin')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a coadmin/admin' });
  }
};

module.exports = { protect, admin, coadmin };
