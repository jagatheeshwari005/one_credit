const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/admin');
const isAdmin = require('../middleware/isAdmin');
const Event = require('../models/Event');

// @route   GET api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/events - Fetching events...');
    const events = await Event.find().sort({ date: 1 });
    console.log(`Found ${events.length} events`);
    res.json(events);
  } catch (err) {
    console.error('Events route error:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   POST api/events
// @desc    Create an event
// @access  Private
router.post(
  '/',
  [
    // Only admins may create events
    adminAuth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('date', 'Please include a valid date').isISO8601(),
      check('location', 'Location is required').not().isEmpty(),
      check('price', 'Price is required').isNumeric().isFloat({ min: 0 })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, date, location, price, image, category, maxAttendees } = req.body;

      const newEvent = new Event({
        title,
        description,
        date,
        location,
        price,
        image,
        category,
        maxAttendees,
        createdBy: req.user.id
      });

      const event = await newEvent.save();
      res.json(event);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/events/:id
// @desc    Update an event (admin only)
// @access  Private/Admin
router.put('/:id', [adminAuth], async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Update allowed fields
    const updates = (({ title, description, date, location, price, image, category, maxAttendees }) => ({ title, description, date, location, price, image, category, maxAttendees }))(req.body);

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) event[key] = updates[key];
    });

    await event.save();
    res.json(event);
  } catch (err) {
    console.error('Update event error:', err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Event not found' });
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/events/:id
// @desc    Delete an event (admin only)
// @access  Private/Admin
router.delete('/:id', [adminAuth], async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Event deleted successfully' });
  } catch (err) {
    console.error('Delete event error:', err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Event not found' });
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
