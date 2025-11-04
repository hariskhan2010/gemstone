"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Gem } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this to your backend
    console.log("Newsletter signup:", email);
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 3000); // Reset after 3 seconds
  };

  return (
    <section className="relative w-screen py-20 px-4 bg-gradient-to-r from-amber-900/20 to-gray-900/50 border-y border-amber-800/30">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <Gem className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-amber-400 mb-4 tracking-wide">
              Join Our Exclusive Newsletter
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Be the first to know about new arrivals, special offers, and gemstone care tips.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-10"
          >
            {submitted ? (
              <div className="bg-gradient-to-r from-green-700/50 to-green-800/50 border border-green-600/50 rounded-xl p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center">
                  <svg className="h-6 w-6 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-400 text-lg font-medium">Thank you for subscribing!</span>
                </div>
                <p className="text-gray-300 mt-2 text-center">You're now part of our gemstone community.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full pl-10 pr-4 py-4 bg-gray-800 border border-amber-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg shadow-amber-500/30 whitespace-nowrap"
                >
                  Subscribe Now
                </motion.button>
              </form>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-500 text-sm mt-6"
          >
            We respect your privacy. Unsubscribe at any time.
          </motion.p>
        </div>
      </div>
    </section>
  );
}