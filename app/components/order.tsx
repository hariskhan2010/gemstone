"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, MapPin, Package, CheckCircle, User, Mail, Phone, Calendar } from "lucide-react";
import { useCart } from "../context/cart-context";
import Link from "next/link";

export default function OrderPage() {
  const { cartItems, getTotalPrice, removeFromCart } = useCart();

  const [step, setStep] = useState(1); // 1: shipping, 2: payment, 3: confirmation
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = () => {
    // In a real application, you would process the payment and place the order
    // For now, we'll just clear the cart and show the success page
    // Since we don't have a clear cart function, we'll remove each item individually
    cartItems.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        removeFromCart(item.product.id);
      }
    });
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-900/10 via-gray-900/80 to-black/90 flex items-center justify-center py-10 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center bg-gray-800/60 backdrop-blur-sm border border-amber-700/40 rounded-2xl p-10 shadow-xl"
        >
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-amber-400 mb-4">Order Confirmed!</h1>
          <p className="text-gray-300 mb-6 text-lg">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          <p className="text-gray-400 mb-8">
            We've sent a confirmation email to {shippingInfo.email}. Your gemstones will be shipped within 2-3 business days.
          </p>
          <div className="bg-gray-900/50 rounded-xl p-4 mb-8">
            <p className="text-amber-400 font-semibold">Order Number: GEM-{Math.floor(100000 + Math.random() * 900000)}</p>
          </div>
          <Link 
            href="/collections" 
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all inline-block"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900/10 via-gray-900/80 to-black/90 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">Complete Your Order</h1>
          <p className="text-gray-300">Secure checkout for your precious gemstones</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center">
            <div className={`flex items-center ${step >= 1 ? 'text-amber-400' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 1 ? 'bg-amber-600' : 'bg-gray-700'}`}>
                1
              </div>
              <span>Shipping</span>
            </div>
            <div className="w-16 h-0.5 bg-amber-600 mx-2"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-amber-400' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 2 ? 'bg-amber-600' : 'bg-gray-700'}`}>
                2
              </div>
              <span>Payment</span>
            </div>
            <div className="w-16 h-0.5 bg-amber-600 mx-2"></div>
            <div className={`flex items-center ${step >= 3 ? 'text-amber-400' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 3 ? 'bg-amber-600' : 'bg-gray-700'}`}>
                3
              </div>
              <span>Confirm</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/60 backdrop-blur-sm border border-amber-700/40 rounded-2xl p-6 shadow-xl sticky top-6">
              <h2 className="text-xl font-bold text-amber-400 mb-6">Order Summary</h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-16 h-16 flex-shrink-0">
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
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm">{item.product.name}</h3>
                      <p className="text-amber-400 text-sm">${item.product.price.toFixed(2)} × {item.quantity}</p>
                      <p className="text-gray-400 text-xs">{item.product.carat}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-400 font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-amber-800/50 pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="text-white">${getTotalPrice().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Shipping</span>
                  <span className="text-white">Customer needs to pay</span>
                </div>
                
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Taxes</span>
                  <span className="text-white">$1.00</span>
                </div>
                
                <div className="border-t border-amber-800/50 pt-4 flex justify-between font-bold text-lg">
                  <span className="text-amber-400">Total</span>
                  <span className="text-white">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/60 backdrop-blur-sm border border-amber-700/40 rounded-2xl p-6 shadow-xl">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="h-5 w-5 text-amber-400" />
                    <h2 className="text-xl font-bold text-amber-400">Shipping Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-gray-900/80 border border-amber-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="John"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-gray-900/80 border border-amber-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-900/80 border border-amber-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-900/80 border border-amber-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Shipping Address</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-900/80 border border-amber-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="123 Main St"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-gray-900/80 border border-amber-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="New York"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-gray-900/80 border border-amber-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="NY"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-gray-900/80 border border-amber-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-900/80 border border-amber-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="United States"
                    />
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </motion.div>
              )}
              
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="h-5 w-5 text-amber-400" />
                    <h2 className="text-xl font-bold text-amber-400">Payment Information</h2>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={paymentInfo.cardholderName}
                      onChange={handlePaymentChange}
                      className="w-full p-3 bg-gray-900/80 border border-amber-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentChange}
                      className="w-full p-3 bg-gray-900/80 border border-amber-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={paymentInfo.expiryDate}
                        onChange={handlePaymentChange}
                        className="w-full p-3 bg-gray-900/80 border border-amber-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="MM/YY"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentChange}
                        className="w-full p-3 bg-gray-900/80 border border-amber-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="123"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all"
                    >
                      Back to Shipping
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all"
                    >
                      Review Order
                    </button>
                  </div>
                </motion.div>
              )}
              
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Package className="h-5 w-5 text-amber-400" />
                    <h2 className="text-xl font-bold text-amber-400">Order Review</h2>
                  </div>
                  
                  <div className="bg-gray-900/50 rounded-xl p-4">
                    <h3 className="font-semibold text-amber-400 mb-2">Shipping Information</h3>
                    <p className="text-gray-300">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                    <p className="text-gray-300">{shippingInfo.address}</p>
                    <p className="text-gray-300">{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                    <p className="text-gray-300">{shippingInfo.country}</p>
                    <p className="text-gray-300 mt-2">{shippingInfo.phone}</p>
                    <p className="text-gray-300">{shippingInfo.email}</p>
                  </div>
                  
                  <div className="bg-gray-900/50 rounded-xl p-4">
                    <h3 className="font-semibold text-amber-400 mb-2">Payment Information</h3>
                    <p className="text-gray-300">Card ending in: {paymentInfo.cardNumber.slice(-4)}</p>
                    <p className="text-gray-300">Expiry: {paymentInfo.expiryDate}</p>
                  </div>
                  
                  <div className="bg-gray-900/50 rounded-xl p-4">
                    <h3 className="font-semibold text-amber-400 mb-2">Order Summary</h3>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Subtotal</span>
                      <span className="text-white">${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Shipping</span>
                      <span className="text-white">Customer needs to pay</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Taxes</span>
                      <span className="text-white">$1.00</span>
                    </div>
                    <div className="border-t border-amber-800/50 pt-2 flex justify-between font-bold">
                      <span className="text-amber-400">Total</span>
                      <span className="text-white">${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all"
                    >
                      Back to Payment
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all"
                    >
                      Place Order
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}