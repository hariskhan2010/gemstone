'use client';
import { useState, useEffect } from 'react';
import CartPage from '../components/cart';
import { CartItem } from '../components/gem-collection';

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  useEffect(() => {
    // Load cart items from localStorage or state management solution
    const savedCart = localStorage.getItem('gemstoneCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
  }, []);
  
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };
  
  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };
  
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };
  
  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('gemstoneCart', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <CartPage 
      cartItems={cartItems} 
      updateQuantity={updateQuantity}
      removeFromCart={removeFromCart}
      getTotalPrice={getTotalPrice}
    />
  );
}