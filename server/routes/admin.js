const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/admin');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Event = require('../models/Event');

// @route   GET api/admin/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -resetPasswordToken')
      .sort({ createdAt: -1 });

    const userStats = {
      total: users.length,
      active: users.filter(user => user.isActive).length,
      admins: users.filter(user => user.role === 'admin').length,
      googleUsers: users.filter(user => user.googleId).length,
      recentLogins: users.filter(user => {
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return user.lastLogin > dayAgo;
      }).length
    };

    res.json({
      users,
      stats: userStats
    });
  } catch (err) {
    console.error('Get users error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/admin/users/:id/role
// @desc    Update user role (admin only)
// @access  Private/Admin
router.put('/users/:id/role', adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ msg: 'User role updated successfully', user: { id: user._id, role: user.role } });
  } catch (err) {
    console.error('Update role error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/admin/users/:id/status
// @desc    Toggle user active status (admin only)
// @access  Private/Admin
router.put('/users/:id/status', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ 
      msg: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`, 
      user: { id: user._id, isActive: user.isActive } 
    });
  } catch (err) {
    console.error('Update status error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/admin/users/:id
// @desc    Delete user (admin only)
// @access  Private/Admin
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ msg: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/admin/bookings
// @desc    Get all bookings (admin only)
// @access  Private/Admin
router.get('/bookings', adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('event', 'title date location price')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (err) {
    console.error('Get bookings error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private/Admin
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const googleUsers = await User.countDocuments({ googleId: { $ne: null } });
    
    // Recent registrations (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentRegistrations = await User.countDocuments({ 
      createdAt: { $gte: weekAgo } 
    });

    // Recent logins (last 24 hours)
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentLogins = await User.countDocuments({ 
      lastLogin: { $gte: dayAgo } 
    });

    // Booking stats
    const totalBookings = await Booking.countDocuments();
    const totalEvents = await Event.countDocuments();
    const recentBookings = await Booking.countDocuments({
      createdAt: { $gte: dayAgo }
    });

    res.json({
      totalUsers,
      activeUsers,
      adminUsers,
      googleUsers,
      recentRegistrations,
      recentLogins,
      inactiveUsers: totalUsers - activeUsers,
      totalBookings,
      totalEvents,
      recentBookings
    });
  } catch (err) {
    console.error('Dashboard stats error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
