"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function OrderPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    address: "",
    payment: "",
    orderItems: "",
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Here you can send data to backend or API
    console.log("Order Submitted:", formData);
    alert("Thank you for your order! We'll contact you shortly.");
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      number: "",
      address: "",
      payment: "",
      orderItems: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black p-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl bg-gradient-to-br from-gray-900 to-black border border-amber-800/50 rounded-2xl shadow-2xl p-8 md:p-12"
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-10 text-amber-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Place Your Order
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Name */}
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-amber-300">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 bg-gray-800 border border-amber-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 font-medium text-amber-300">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 bg-gray-800 border border-amber-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
                placeholder="example@email.com"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block mb-2 font-medium text-amber-300">Phone Number</label>
              <input
                type="tel"
                name="number"
                value={formData.number}
                onChange={handleChange}
                className="w-full p-4 bg-gray-800 border border-amber-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
                placeholder="+1234567890"
                required
              />
            </div>

            {/* Shipping Address */}
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-amber-300">Shipping Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-4 bg-gray-800 border border-amber-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white min-h-[100px]"
                placeholder="123 Main Street, City, Country"
                required
              />
            </div>

            {/* Payment Method */}
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-amber-300">Payment Method</label>
              <select
                name="payment"
                value={formData.payment}
                onChange={handleChange}
                className="w-full p-4 bg-gray-800 border border-amber-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
                required
              >
                <option value="" className="bg-gray-800">Select Payment Method</option>
                <option value="cash" className="bg-gray-800">Cash on Delivery</option>
                <option value="card" className="bg-gray-800">Credit/Debit Card</option>
                <option value="paypal" className="bg-gray-800">PayPal</option>
                <option value="bank" className="bg-gray-800">Bank Transfer</option>
              </select>
            </div>

            {/* Order Items */}
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-amber-300">Order Items</label>
              <textarea
                name="orderItems"
                value={formData.orderItems}
                onChange={handleChange}
                className="w-full p-4 bg-gray-800 border border-amber-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white min-h-[120px]"
                placeholder="Please specify the gemstones or jewelry you'd like to order, including size, color, and quantity..."
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold py-4 rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg shadow-amber-500/30 mt-6"
          >
            Submit Order Request
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
