const express = require('express');
const { body, validationResult } = require('express-validator');
const Service = require('../models/Service');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

const CATEGORIES = ['Flight', 'Hotel', 'Activities', 'Bundles', 'Meet & Greet', 'Visa Application'];

const serviceValidators = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('category').isIn(CATEGORIES).withMessage('Invalid category'),
];

// Same rules but only applied when the field is present, for partial updates
const serviceUpdateValidators = [
  body('name').optional().trim().notEmpty().withMessage('Name is required'),
  body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('category').optional().isIn(CATEGORIES).withMessage('Invalid category'),
];

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  }
  next();
};

// Get all services
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    const services = await Service.find(filter);
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching services', error: err.message });
  }
});

// Get single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching service', error: err.message });
  }
});

// Create service (Admin only)
router.post('/', authMiddleware, roleMiddleware(['admin']), serviceValidators, checkValidation, async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: 'Error creating service', error: err.message });
  }
});

// Update service (Admin only)
router.put('/:id', authMiddleware, roleMiddleware(['admin']), serviceUpdateValidators, checkValidation, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Error updating service', error: err.message });
  }
});

// Delete service (Admin only)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting service', error: err.message });
  }
});

module.exports = router;
