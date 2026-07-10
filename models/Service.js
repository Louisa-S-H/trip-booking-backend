const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  category: {
    type: String,
    enum: ['Flight', 'Hotel', 'Activities', 'Bundles', 'Meet & Greet', 'Visa Application'],
  },
  price: {
    type: Number,
    required: true,
  },
  image: String,
  details: mongoose.Schema.Types.Mixed,
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Service', serviceSchema);
