const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=Event+Image'
  },
  category: {
    type: String,
    enum: ['conference', 'workshop', 'concert', 'sports', 'exhibition', 'technology', 'marketing', 'sustainability', 'leadership', 'finance', 'healthcare', 'other'],
    default: 'other'
  },
  maxAttendees: {
    type: Number,
    default: 100
  },
  currentAttendees: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);
