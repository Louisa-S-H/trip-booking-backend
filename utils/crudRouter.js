const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Generates a standard public-read / admin-write CRUD router for the
// simple ordered content models (TeamMember, Destination, TripStyle,
// PastEvent, Testimonial), which are all structurally identical:
// isActive/order fields, optional slug lookup, admin-only writes.
function createCrudRouter(Model, { slugLookup = false } = {}) {
  const router = express.Router();

  // Public: active items only
  router.get('/', asyncHandler(async (req, res) => {
    const filter = { isActive: true };
    if (req.query.type) filter.type = req.query.type;
    const items = await Model.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(items);
  }));

  // Admin: all items (including inactive), for the CMS list view
  router.get('/admin', authMiddleware, roleMiddleware(['admin']), asyncHandler(async (req, res) => {
    const items = await Model.find().sort({ order: 1, createdAt: 1 });
    res.json(items);
  }));

  if (slugLookup) {
    router.get('/:slug', asyncHandler(async (req, res) => {
      const item = await Model.findOne({ slug: req.params.slug, isActive: true });
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json(item);
    }));
  } else {
    router.get('/:id', asyncHandler(async (req, res) => {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json(item);
    }));
  }

  router.post('/', authMiddleware, roleMiddleware(['admin']), asyncHandler(async (req, res) => {
    const item = new Model(req.body);
    await item.save();
    res.status(201).json(item);
  }));

  router.put('/:id', authMiddleware, roleMiddleware(['admin']), asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  }));

  router.delete('/:id', authMiddleware, roleMiddleware(['admin']), asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  }));

  return router;
}

module.exports = createCrudRouter;
