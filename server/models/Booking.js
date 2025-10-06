const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  attendees: {
    type: Number,
    required: true,
    min: 1
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  decorationPackage: {
    type: String,
    enum: ['none', 'basic', 'premium', 'luxury'],
    default: 'none'
  },
  decorationCost: {
    type: Number,
    default: 0,
    min: 0
  },
  specialRequests: {
    type: String,
    maxLength: 500
  },
  contactInfo: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  confirmationNumber: {
    type: String,
    unique: true
  }
});

// Generate confirmation number before saving
bookingSchema.pre('save', function(next) {
  if (!this.confirmationNumber) {
    this.confirmationNumber = 'EVT' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
