import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isBuyer } = useAuth();

  useEffect(() => {
    if (isAuthenticated && isBuyer) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, isBuyer]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get();
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await cartAPI.addItem(productId, quantity);
      setCart(response.data);
      toast.success('Product added to cart!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to add to cart';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await cartAPI.updateItem(itemId, quantity);
      setCart(response.data);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update cart';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await cartAPI.removeItem(itemId);
      setCart(response.data);
      toast.success('Product removed from cart');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to remove from cart';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const clearCart = async () => {
    try {
      const response = await cartAPI.clear();
      setCart(response.data);
      toast.success('Cart cleared');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to clear cart';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    cart,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    itemCount: cart?.total_items || 0,
    totalAmount: cart?.total_amount || 0,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
