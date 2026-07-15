const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  title: String,
  body: String,
}, { timestamps: true });

module.exports = mongoose.model('SiteContent', siteContentSchema);
