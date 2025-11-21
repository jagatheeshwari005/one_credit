import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaCreditCard } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const handleBuyNow = async () => {
    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would integrate with a payment processor like Stripe
      toast.success('Payment successful! Your tickets have been booked.');
      
      // Clear cart after successful purchase
      await clearCart();
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="loading">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>
          <FaShoppingCart className="cart-icon" />
          Shopping Cart
        </h1>
        {cart.items.length > 0 && (
          <button onClick={handleClearCart} className="clear-cart-btn">
            Clear Cart
          </button>
        )}
      </div>

      {cart.items.length === 0 ? (
        <div className="empty-cart">
          <FaShoppingCart className="empty-cart-icon" />
          <h2>Your cart is empty</h2>
          <p>Add some events to get started!</p>
          <a href="/events" className="continue-shopping-btn">
            Browse Events
          </a>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.event.image || 'https://via.placeholder.com/150x100?text=Event'} 
                    alt={item.event.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150x100?text=Event';
                    }}
                  />
                </div>

                <div className="item-details">
                  <h3 className="item-title">{item.event.title}</h3>
                  <p className="item-date">{formatDate(item.event.date)}</p>
                  <p className="item-location">{item.event.location}</p>
                  <p className="item-price">{formatPrice(item.price)} each</p>
                </div>

                <div className="item-quantity">
                  <button 
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    className="quantity-btn"
                    disabled={item.quantity <= 1}
                  >
                    <FaMinus />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    <FaPlus />
                  </button>
                </div>

                <div className="item-total">
                  <p className="total-price">{formatPrice(item.price * item.quantity)}</p>
                  <button 
                    onClick={() => handleRemoveItem(item._id)}
                    className="remove-btn"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-details">
              <div className="summary-row">
                <span>Items ({cart.items.reduce((total, item) => total + item.quantity, 0)}):</span>
                <span>{formatPrice(cart.totalAmount)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>{formatPrice(cart.totalAmount)}</span>
              </div>
            </div>

            <div className="checkout-section">
              <button 
                onClick={handleBuyNow}
                disabled={isProcessing}
                className="buy-now-btn"
              >
                <FaCreditCard />
                {isProcessing ? 'Processing...' : `Buy Now - ${formatPrice(cart.totalAmount)}`}
              </button>
              
              <a href="/events" className="continue-shopping-link">
                Continue Shopping
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
