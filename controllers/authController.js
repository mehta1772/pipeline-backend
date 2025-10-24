// backend/controllers/authController.js
const User = require('../models/User');

// Login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create session
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.role = user.role;

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
};

// Get current user
const getCurrentUser = (req, res) => {
  if (req.session && req.session.userId) {
    res.json({
      user: {
        id: req.session.userId,
        username: req.session.username,
        role: req.session.role,
      },
    });
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
};

module.exports = { login, logout, getCurrentUser };