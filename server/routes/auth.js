const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  console.log('Registration request received:', req.body);
  
  const { name, email, password } = req.body;

  try {
    // Validate input
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    console.log('Checking if user exists:', email);
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists');
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user (password will be hashed by User model pre-save middleware)
    console.log('Creating new user');
    user = new User({
      name,
      email,
      password, // Don't hash here - User model will handle it
      role: 'user',
      isActive: true,
      lastLogin: new Date()
    });

    // Save user to database
    console.log('Saving user to database');
    await user.save();
    console.log('User saved successfully:', user.id);

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };

    console.log('Generating JWT token');
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '30d' },
      (err, token) => {
        if (err) {
          console.error('JWT Error:', err);
          return res.status(500).json({ msg: 'Token generation failed' });
        }
        
        console.log('Registration successful, sending response');
        res.json({ 
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ msg: 'Server error during registration', error: err.message });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  console.log('Login request received:', { email: req.body.email });
  
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    // Check if user exists
    console.log('Looking for user:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    console.log('User found, checking password');
    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    console.log('Password matches, updating last login');
    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };

    console.log('Generating JWT token for login');
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '30d' },
      (err, token) => {
        if (err) {
          console.error('JWT Error:', err);
          return res.status(500).json({ msg: 'Token generation failed' });
        }
        
        console.log('Login successful, sending response');
        res.json({ 
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ msg: 'Server error during login', error: err.message });
  }
});

// @route   POST api/auth/forgot-password
// @desc    Handle forgot password request
// @access  Public
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: 'User with that email does not exist' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and create the update object
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Directly update the user document
    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken,
      resetPasswordExpire,
    });

    // In a real app, you would send an email with the reset link.
    // For this example, we'll just log it.
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    console.log('Password Reset Link:', resetUrl);

    res.status(200).json({ msg: 'Password reset link sent' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/auth/reset-password/:resetToken
// @desc    Reset password using the token
// @access  Public
router.put('/reset-password/:resetToken', async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send a new JWT token upon successful password reset
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/google
// @desc    Authenticate with Google
// @access  Public
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// @route   GET api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=auth_failed` }),
  (req, res) => {
    // Successful authentication - include useful user info in the JWT payload
    const payload = {
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role || 'user'
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '5d' },
      (err, token) => {
        if (err) {
          console.error('JWT Error:', err);
          return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=auth_failed`);
        }
        
        // Redirect to frontend with token
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/success?token=${token}`);
      }
    );
  }
);

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/logout
// @desc    Logout user
// @access  Public
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ msg: 'Error logging out' });
    }
    res.json({ msg: 'Logged out successfully' });
  });
});

module.exports = router;
