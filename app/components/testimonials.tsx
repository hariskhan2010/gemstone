"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      text: "The emerald I purchased from Asian Gemstones is absolutely stunning. The color and clarity exceeded my expectations. Their expertise and service are unmatched in the industry."
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Singapore",
      rating: 5,
      text: "As a jewelry designer, I source my materials from many places, but Asian Gemstones consistently provides the highest quality stones with excellent customer service."
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      location: "Barcelona, Spain",
      rating: 4,
      text: "I was looking for a specific type of sapphire for my engagement ring, and they helped me find the perfect stone. The entire process was seamless."
    }
  ];

  return (
    <section className="relative w-screen py-20 px-4 bg-gradient-to-b from-black to-gray-900">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Quote className="h-10 w-10 text-amber-400 mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4 tracking-wide">
            Customer Testimonials
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Hear from our satisfied customers around the world about their experience with our gemstones and service.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 border border-amber-800/30 rounded-2xl p-6 shadow-2xl hover:shadow-amber-500/20 transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-500'}`} 
                  />
                ))}
              </div>
              
              <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
              
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-700 mr-4 overflow-hidden">
                  {/* Placeholder for customer image */}
                  <div className="w-full h-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                    {testimonial.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-amber-400">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust indicators */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 py-10 border-t border-amber-800/30"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {[
            { value: "25+", label: "Years Experience" },
            { value: "10K+", label: "Happy Customers" },
            { value: "500+", label: "Unique Stones" },
            { value: "30+", label: "Countries Served" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">{stat.value}</div>
              <div className="text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}