const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Token nikalo
      token = req.headers.authorization.split(' ')[1];

      // Verify karo
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // User attach karo (password minus)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token galat hai, authorization denied' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Token nahi mila, authorization denied' });
  }
};

module.exports = { protect };