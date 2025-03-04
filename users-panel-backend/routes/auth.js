const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../auth/verify');
const { signUp } = require('../auth/signUp');
const { signIn } = require('../auth/signIn');

// Sign up route
router.post('/signup', signUp);

// Sign in route
router.post('/signin', signIn);

// Verify token route
router.get('/verify', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id.toString(), // Explicitly convert to string
        name: user.name,
        email: user.email,
        registeredEvents: user.registeredEvents
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  res.json({ success: true });
});

module.exports = router;