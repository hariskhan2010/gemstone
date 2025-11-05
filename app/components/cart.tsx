"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, Package, CreditCard, MapPin, User } from "lucide-react";
import { useCart } from "../context/cart-context";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleCheckout = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900/10 via-gray-900/80 to-black/90 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-amber-400 mb-4">Your Gemstone Collection</h1>
          <p className="text-gray-300">Review your selected precious stones</p>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Package className="h-16 w-16 text-amber-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-amber-400 mb-2">Your Cart is Empty</h3>
            <p className="text-gray-400 mb-6">Add some beautiful gemstones to your collection</p>
            <Link 
              href="/collections" 
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all"
            >
              Browse Collection
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/60 backdrop-blur-sm border border-amber-700/40 rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-amber-400 mb-6">Your Selection</h2>
                
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-900/50 rounded-xl border border-amber-800/30"
                    >
                      <div className="w-24 h-24 flex-shrink-0">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover rounded-lg border border-amber-700/30"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-gemstone.jpg";
                          }}
                        />
                      </div>
                      
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-bold text-white text-lg">{item.product.name}</h3>
                        <p className="text-amber-400 font-semibold">${item.product.price.toFixed(2)}</p>
                        <p className="text-gray-400 text-sm mt-1">{item.product.carat} • {item.product.origin}</p>
                        
                        <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-amber-600 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          
                          <span className="text-white w-8 text-center">{item.quantity}</span>
                          
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-amber-600 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          
                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            className="ml-4 text-red-500 hover:text-red-400 flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-amber-400">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-gray-800/60 backdrop-blur-sm border border-amber-700/40 rounded-2xl p-6 shadow-xl sticky top-6">
                <h2 className="text-xl font-bold text-amber-400 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Subtotal</span>
                    <span className="text-white">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-300">Shipping</span>
                    <span className="text-white">Free</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-300">Taxes</span>
                    <span className="text-white">$0.00</span>
                  </div>
                  
                  <div className="border-t border-amber-800/50 pt-4 flex justify-between font-bold text-lg">
                    <span className="text-amber-400">Total</span>
                    <span className="text-white">${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
                
                <Link href="/checkout">
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className={`w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 ${
                      isProcessing ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        Proceed to Checkout
                      </>
                    )}
                  </button>
                </Link>
                
                <div className="mt-6 pt-6 border-t border-amber-800/50">
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin className="h-5 w-5 text-amber-400 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-400">Secure Shipping</h3>
                      <p className="text-gray-400 text-sm">Free insured shipping on all orders</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 mb-4">
                    <User className="h-5 w-5 text-amber-400 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-400">Authentication</h3>
                      <p className="text-gray-400 text-sm">Every gemstone comes with certificate of authenticity</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-amber-400 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-400">Satisfaction Guaranteed</h3>
                      <p className="text-gray-400 text-sm">30-day return policy on all gemstones</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}