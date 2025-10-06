import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  // Fetch cart on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: { 'x-auth-token': token }
      };

      const res = await axios.get('/api/cart', config);
      setCart(res.data);
    } catch (err) {
      console.error('Fetch cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (eventId, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add items to cart');
        return;
      }

      const config = {
        headers: { 'x-auth-token': token }
      };

      const res = await axios.post('/api/cart/add', { eventId, quantity }, config);
      setCart(res.data.cart);
      toast.success('Event added to cart!');
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.msg || 'Failed to add to cart';
      toast.error(error);
      return { success: false, error };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: { 'x-auth-token': token }
      };

      const res = await axios.put(`/api/cart/update/${itemId}`, { quantity }, config);
      setCart(res.data.cart);
      toast.success('Cart updated!');
    } catch (err) {
      const error = err.response?.data?.msg || 'Failed to update cart';
      toast.error(error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: { 'x-auth-token': token }
      };

      const res = await axios.delete(`/api/cart/remove/${itemId}`, config);
      setCart(res.data.cart);
      toast.success('Item removed from cart!');
    } catch (err) {
      const error = err.response?.data?.msg || 'Failed to remove item';
      toast.error(error);
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: { 'x-auth-token': token }
      };

      const res = await axios.delete('/api/cart/clear', config);
      setCart(res.data.cart);
      toast.success('Cart cleared!');
    } catch (err) {
      const error = err.response?.data?.msg || 'Failed to clear cart';
      toast.error(error);
    }
  };

  const getCartItemCount = () => {
    return cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart.items || [],
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCart,
        getCartItemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
