const express = require('express');
const User = require('../models/User');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// Create an Agent/Admin account (Admin only) - the only way non-student
// accounts get created, since public signup always creates students.
router.post('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { name, email, password, role, phone, agentInfo } = req.body;

    if (!['agent', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role must be agent or admin' });
    }
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password, role, phone, agentInfo });
    await user.save();

    const { password: _pw, ...userData } = user.toObject();
    res.status(201).json(userData);
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

// Change own password
router.put('/profile/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.userId);
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating password', error: err.message });
  }
});

// Get all agents (for assignment)
router.get('/agents/list', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent', isActive: true })
      .select('name email phone agentInfo');
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching agents', error: err.message });
  }
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, agentInfo, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, phone, agentInfo, avatar },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
});

// Get all users (Admin only)
router.get('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { role } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

module.exports = router;
