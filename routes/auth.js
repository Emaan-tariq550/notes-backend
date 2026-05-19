const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

const router = express.Router();

// Helper: JWT token generate karo
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ─── REGISTER ───────────────────────────────────────────
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Sab fields fill karein' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password kam az kam 6 characters ka ho' });
    }

    // Email already exists?
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Yeh email pehle se registered hai' });
    }

    // Password hash karo
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // User banao
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      token: generateToken(user._id)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── LOGIN ──────────────────────────────────────────────
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email aur password daalein' });
    }

    // User dhundho
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ya password galat hai' });
    }

    // Password match karo
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ya password galat hai' });
    }

    res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      token: generateToken(user._id)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── GET PROFILE ────────────────────────────────────────
// GET /api/auth/profile
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, async (req, res) => {
  res.json({
    _id:   req.user._id,
    name:  req.user.name,
    email: req.user.email
  });
});

module.exports = router;