'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-amber-900/20 to-stone-900/40">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-stone-900/70 to-transparent z-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-stone-900/70 to-transparent z-10"></div>
        
        {/* Decorative gems */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-amber-400/20 blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-20 h-20 rounded-full bg-emerald-400/20 blur-xl animate-pulse delay-300"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-rose-400/20 blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text content */}
          <motion.div 
            className="text-center lg:text-left lg:w-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-100 mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Discover the <span className="text-amber-400">Art of Gemstones</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-stone-300 mb-8 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Exquisite handcrafted gems and jewelry with over 20 years of heritage in ethical sourcing and masterful craftsmanship.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link href="/collection" passHref>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-lg transition-all duration-300 transform hover:shadow-2xl"
                >
                  Explore Collection
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Gem image */}
          <motion.div 
            className="lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative w-full max-w-lg">
              <div className="relative aspect-square rounded-full overflow-hidden border-8 border-amber-900/30 shadow-2xl shadow-amber-900/30">
                <Image
                  src="/Aquamarine.jpg"
                  alt="Beautiful Aquamarine Gemstone"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              {/* Floating gems around the main image */}
              <motion.div 
                className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-emerald-500/30 backdrop-blur-sm border border-white/20"
                animate={{ 
                  y: [-10, 10, -10],
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full bg-rose-500/30 backdrop-blur-sm border border-white/20"
                animate={{ 
                  y: [10, -10, 10],
                }}
                transition={{ 
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              <motion.div 
                className="absolute -top-10 -right-10 w-12 h-12 rounded-full bg-blue-500/30 backdrop-blur-sm border border-white/20"
                animate={{ 
                  x: [10, -10, 10],
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Animated scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <span className="text-stone-400 text-sm mb-2">Discover More</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg 
            className="w-6 h-6 text-amber-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;