const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const SiteContent = require('../models/SiteContent');

const router = express.Router();

// Public: fetch a content block by key (e.g. 'company_profile', 'vision_mission', 'contact_info')
router.get('/:key', asyncHandler(async (req, res) => {
  const content = await SiteContent.findOne({ key: req.params.key });
  if (!content) {
    return res.status(404).json({ message: 'Content not found' });
  }
  res.json(content);
}));

// Admin: create or update a content block
router.put('/:key', authMiddleware, roleMiddleware(['admin']), asyncHandler(async (req, res) => {
  const { title, body } = req.body;
  const content = await SiteContent.findOneAndUpdate(
    { key: req.params.key },
    { key: req.params.key, title, body },
    { new: true, upsert: true }
  );
  res.json(content);
}));

module.exports = router;
