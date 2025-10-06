const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');
const { sendBookingNotification, sendBookingConfirmation } = require('../services/emailService');

// Decoration packages with pricing
const decorationPackages = {
  none: { name: 'No Decoration', price: 0 },
  basic: { name: 'Basic Package', price: 150 },
  premium: { name: 'Premium Package', price: 350 },
  luxury: { name: 'Luxury Package', price: 750 }
};

// @route   POST api/bookings
// @desc    Create a new booking
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('eventId', 'Event ID is required').not().isEmpty(),
      check('attendees', 'Number of attendees is required').isInt({ min: 1 }),
      check('contactInfo.name', 'Contact name is required').not().isEmpty(),
      check('contactInfo.email', 'Valid email is required').isEmail(),
      check('contactInfo.phone', 'Phone number is required').not().isEmpty(),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { eventId, attendees, decorationPackage, specialRequests, contactInfo } = req.body;

      // Check if event exists
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ msg: 'Event not found' });
      }

      // Check if enough spots available
      const availableSpots = event.maxAttendees - event.currentAttendees;
      if (attendees > availableSpots) {
        return res.status(400).json({ msg: `Only ${availableSpots} spots available` });
      }

      // Calculate costs
      const eventCost = event.price * attendees;
      const decorationCost = decorationPackages[decorationPackage]?.price || 0;
      const totalAmount = eventCost + decorationCost;

      // Create booking
      const booking = new Booking({
        user: req.user.id,
        event: eventId,
        attendees,
        totalAmount,
        decorationPackage: decorationPackage || 'none',
        decorationCost,
        specialRequests,
        contactInfo,
        status: 'confirmed',
        paymentStatus: 'paid' // Assuming immediate payment for demo
      });

      await booking.save();

      // Update event attendee count
      event.currentAttendees += attendees;
      await event.save();

      // Populate booking details for response
      await booking.populate([
        { path: 'event', select: 'title date location' },
        { path: 'user', select: 'name email' }
      ]);

      // Send email notifications (async, don't wait for completion)
      try {
        const bookingData = {
          user: booking.user,
          event: booking.event,
          attendees,
          totalAmount,
          bookingId: booking._id,
          contactInfo,
          specialRequests
        };

        // Send notification to admin
        sendBookingNotification(bookingData).catch(err => 
          console.error('Failed to send admin notification:', err)
        );

        // Send confirmation to customer
        sendBookingConfirmation(bookingData).catch(err => 
          console.error('Failed to send customer confirmation:', err)
        );
      } catch (emailError) {
        console.error('Email notification error:', emailError);
        // Don't fail the booking if email fails
      }

      res.json({
        msg: 'Booking created successfully',
        booking,
        confirmationNumber: booking.confirmationNumber
      });

    } catch (err) {
      console.error('Booking creation error:', err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

// @route   GET api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('event', 'title date location image category')
      .sort({ bookingDate: -1 });

    res.json(bookings);
  } catch (err) {
    console.error('Get bookings error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    }).populate([
      { path: 'event', select: 'title date location image category price' },
      { path: 'user', select: 'name email' }
    ]);

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    res.json(booking);
  } catch (err) {
    console.error('Get booking error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:bookingId/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ msg: 'Booking already cancelled' });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Update event attendee count
    const event = await Event.findById(booking.event);
    if (event) {
      event.currentAttendees -= booking.attendees;
      await event.save();
    }

    res.json({ msg: 'Booking cancelled successfully', booking });
  } catch (err) {
    console.error('Cancel booking error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/bookings/decoration-packages
// @desc    Get available decoration packages
// @access  Public
router.get('/decoration-packages', (req, res) => {
  res.json(decorationPackages);
});

module.exports = router;
