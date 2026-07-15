const express = require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('../middleware/asyncHandler');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const ContactMessage = require('../models/ContactMessage');

const router = express.Router();

// Public: submit the Contact Us form
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const { name, email, phone, subject, message } = req.body;
    const contactMessage = new ContactMessage({ name, email, phone, subject, message });
    await contactMessage.save();
    res.status(201).json(contactMessage);
  })
);

// Admin: list submitted messages
router.get('/', authMiddleware, roleMiddleware(['admin']), asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json(messages);
}));

// Admin: update a message's status
router.put('/:id/status', authMiddleware, roleMiddleware(['admin']), asyncHandler(async (req, res) => {
  const { status } = req.body;
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!message) {
    return res.status(404).json({ message: 'Message not found' });
  }
  res.json(message);
}));

module.exports = router;
