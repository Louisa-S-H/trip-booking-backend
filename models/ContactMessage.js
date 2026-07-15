const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: String,
  subject: String,
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['New', 'Read', 'Responded'],
    default: 'New',
  },
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
