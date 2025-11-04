"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Here you can send data to backend or API
    console.log("Contact form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black p-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl bg-gradient-to-br from-gray-900 to-black border border-amber-800/50 rounded-2xl shadow-2xl p-8 md:p-12"
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-10 text-amber-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Contact Us
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-amber-400 mb-6">Get In Touch</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="mr-4 mt-1 text-amber-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Phone</h4>
                  <p className="text-gray-300">+1 (123) 456-7890</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 mt-1 text-amber-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Email</h4>
                  <p className="text-gray-300">info@asiangemstones.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 mt-1 text-amber-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Location</h4>
                  <p className="text-gray-300">Peshawar, Pakistan</p>
                  <p className="text-gray-300">Trade Center, GT Road</p>
                </div>
              </div>
            </div>
            
            <div className="pt-8">
              <h4 className="text-lg font-semibold text-amber-400 mb-4">Business Hours</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex justify-between border-b border-gray-700 pb-2">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 7:00 PM</span>
                </li>
                <li className="flex justify-between border-b border-gray-700 pb-2">
                  <span>Saturday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between pb-2">
                  <span>Sunday</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
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

              <div>
                <label className="block mb-2 font-medium text-amber-300">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-800 border border-amber-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
                  placeholder="Your message subject"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-amber-300">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-800 border border-amber-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white min-h-[150px]"
                  placeholder="Your message here..."
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold py-4 rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg shadow-amber-500/30"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}