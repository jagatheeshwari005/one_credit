const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const Event = require('../models/Event');

// @route   GET api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.event');
    
    if (!cart) {
      return res.json({ items: [], totalAmount: 0 });
    }
    
    res.json(cart);
  } catch (err) {
    console.error('Get cart error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', auth, async (req, res) => {
  try {
    const { eventId, quantity = 1 } = req.body;
    
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.event.toString() === eventId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        event: eventId,
        quantity,
        price: event.price
      });
    }
    
    await cart.save();
    await cart.populate('items.event');
    
    res.json({ msg: 'Item added to cart', cart });
  } catch (err) {
    console.error('Add to cart error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/cart/update/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/update/:itemId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (quantity < 1) {
      return res.status(400).json({ msg: 'Quantity must be at least 1' });
    }
    
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === req.params.itemId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ msg: 'Item not found in cart' });
    }
    
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.event');
    
    res.json({ msg: 'Cart updated', cart });
  } catch (err) {
    console.error('Update cart error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/cart/remove/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(
      item => item._id.toString() !== req.params.itemId
    );
    
    await cart.save();
    await cart.populate('items.event');
    
    res.json({ msg: 'Item removed from cart', cart });
  } catch (err) {
    console.error('Remove from cart error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }
    
    cart.items = [];
    await cart.save();
    
    res.json({ msg: 'Cart cleared', cart });
  } catch (err) {
    console.error('Clear cart error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
