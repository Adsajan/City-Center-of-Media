const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
if (!process.env.JWT_SECRET) {
  console.warn('[Auth] JWT_SECRET not set. Using insecure fallback for development.');
}
const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: '7d' });

// Register
router.post('/register', async (req, res) => {
  try {
    let { name, email, password, role } = req.body || {};
    name = (name || '').trim();
    email = (email || '').trim().toLowerCase();
    password = (password || '').trim();
    role = role || 'student';

    if (!name) return res.status(400).json({ code: 'MISSING_NAME', message: 'Name is required' });
    if (!email) return res.status(400).json({ code: 'MISSING_EMAIL', message: 'Email is required' });
    if (!password) return res.status(400).json({ code: 'MISSING_PASSWORD', message: 'Password is required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ code: 'EMAIL_IN_USE', message: 'Email already in use' });

    const user = await User.create({ name, email, password, role });
    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    if (e && e.code === 11000) {
      return res.status(400).json({ code: 'EMAIL_IN_USE', message: 'Email already in use' });
    }
    res.status(500).json({ code: 'REGISTER_FAILED', message: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Me
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user });
});

// Dev-only: seed admin
router.post('/seed-admin', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'Disabled in production' });
    }
    const existingAdmin = await User.findOne({ email: 'admin@schoolhub.local' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@schoolhub.local',
      password: 'admin123',
      role: 'admin',
    });
    const token = signToken(admin);
    return res.json({
      message: '✅ Admin created successfully',
      admin: { email: admin.email, password: 'admin123', role: admin.role },
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Seed failed' });
  }
});

module.exports = router;
