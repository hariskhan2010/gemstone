"use client";

import { motion } from "framer-motion";
import ProductCard, { generateDummyProducts } from "./product";
import { Gem } from "lucide-react";

export default function FeaturedProducts() {
  const products = generateDummyProducts();
  const featuredProducts = products.filter(product => product.isFeatured).slice(0, 4);

  return (
    <section className="relative w-screen py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
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
          <div className="flex justify-center mb-4">
            <Gem className="h-10 w-10 text-amber-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4 tracking-wide">
            Featured Gemstones
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our most exquisite and rare gemstones, carefully selected for their exceptional quality and beauty.
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.a
            href="/collections"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold text-lg rounded-full hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg shadow-amber-500/30"
          >
            View All Collections
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}