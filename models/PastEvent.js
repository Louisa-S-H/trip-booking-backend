const mongoose = require('mongoose');

const pastEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Case Study', 'Media'],
    default: 'Case Study',
  },
  summary: String,
  body: String,
  coverImage: String,
  images: [String],
  eventDate: Date,
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('PastEvent', pastEventSchema);
