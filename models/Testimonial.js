const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  authorName: {
    type: String,
    required: true,
  },
  programme: String,
  quote: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  photo: String,
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
