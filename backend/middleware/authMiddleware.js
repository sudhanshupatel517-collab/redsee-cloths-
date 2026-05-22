const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
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

const requirePermission = (permission) => {
  return (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      return next(); // Admin has all permissions
    }
    if (req.user && req.user.role === 'coadmin' && req.user.permissions?.includes(permission)) {
      return next();
    }
    res.status(403).json({ message: `Access denied. Requires '${permission}' permission.` });
  };
};

module.exports = { protect, admin, coadmin, requirePermission };
