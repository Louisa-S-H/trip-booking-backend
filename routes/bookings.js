const express = require('express');
const Booking = require('../models/Booking');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// Generate booking number
const generateBookingNumber = () => {
  return 'BK' + Date.now().toString().slice(-9);
};

// Create booking (Students)
router.post('/', authMiddleware, roleMiddleware(['student']), async (req, res) => {
  try {
    const { services, totalPrice, travelDate } = req.body;

    const booking = new Booking({
      bookingNumber: generateBookingNumber(),
      student: req.user.userId,
      services,
      totalPrice,
      travelDate,
      status: 'Pending',
    });

    await booking.save();
    await booking.populate(['student', 'services.service', 'assignedAgent']);

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Error creating booking', error: err.message });
  }
});

// Get student's bookings
router.get('/my-bookings', authMiddleware, roleMiddleware(['student']), async (req, res) => {
  try {
    const bookings = await Booking.find({ student: req.user.userId })
      .populate('assignedAgent', 'name email phone agentInfo')
      .populate('services.service');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
});

// Get agent's assigned bookings
router.get('/agent/assignments', authMiddleware, roleMiddleware(['agent']), async (req, res) => {
  try {
    const bookings = await Booking.find({ assignedAgent: req.user.userId })
      .populate('student', 'name email phone')
      .populate('services.service');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching assignments', error: err.message });
  }
});

// Get all bookings (Admin)
router.get('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('student', 'name email')
      .populate('assignedAgent', 'name email')
      .populate('services.service');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
});

// Get single booking
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('student', 'name email phone')
      .populate('assignedAgent', 'name email phone agentInfo')
      .populate('services.service');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching booking', error: err.message });
  }
});

// Update booking status (Agent/Admin)
router.put('/:id/status', authMiddleware, roleMiddleware(['agent', 'admin']), async (req, res) => {
  try {
    const { status, paymentStatus, notes } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status,
        paymentStatus: paymentStatus || booking.paymentStatus,
        notes: notes || booking.notes,
        updatedAt: Date.now(),
      },
      { new: true }
    ).populate('student', 'name email').populate('services.service');

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Error updating booking', error: err.message });
  }
});

// Assign booking to agent (Admin only)
router.put('/:id/assign-agent', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { agentId } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { assignedAgent: agentId, updatedAt: Date.now() },
      { new: true }
    ).populate('assignedAgent', 'name email phone agentInfo');

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Error assigning agent', error: err.message });
  }
});

module.exports = router;
