'use client';
import { useState, useEffect } from 'react';
import OrderPageComponent from '../components/order';
import { CartItem } from '../components/gem-collection';

export default function Checkout() {
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
  
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return (
    <OrderPageComponent 
      cartItems={cartItems} 
      getTotalPrice={getTotalPrice} 
    />
  );
}