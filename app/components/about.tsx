"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <section className="relative w-screen min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-20 px-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-10 w-64 h-64 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-amber-400 mb-6 tracking-wide drop-shadow-[0_0_15px_#b78d4a]"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About Asian Gemstones
          </motion.h1>
          <motion.p 
            className="max-w-3xl mx-auto text-gray-300 text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Where craftsmanship meets timeless beauty. We bring nature's most
            exquisite treasures to life through precision, passion, and authenticity.
          </motion.p>
        </motion.div>

        {/* Story Section */}
        <section className="w-full py-16 grid md:grid-cols-2 gap-16 items-center mb-20">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-xl border-2 border-amber-700/30 group">
              <Image
                src="/gem-cutting.jpg" // renamed to avoid spaces in filename
                alt="Gem Cutting"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6 text-amber-300 font-semibold text-xl drop-shadow-lg">
                Master Craftsmanship • Since 1998
              </div>
              <div className="absolute inset-0 border-2 border-amber-500/30 rounded-2xl pointer-events-none"></div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-amber-400 mb-4">Our Heritage</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Established over two decades ago in Peshawar's historic gem district,
              <span className="text-amber-400 font-semibold"> Asian Gemstones</span> 
              has grown from a humble family business into one of Asia's most trusted
              gemstone houses. Our deep-rooted relationships with local miners allow
              us to ethically source rare rubies, emeralds, sapphires, and other
              precious stones directly from the heart of nature.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Every gem we offer carries a legacy of tradition, authenticity, and
              exceptional craftsmanship — reflecting the cultural richness of Asia.
            </p>
          </motion.div>
        </section>

        {/* Mission Section */}
        <section className="w-full py-16 mb-20">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-amber-400 text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Our Core Values
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Ethical Sourcing",
                desc: "We ensure every gemstone is mined responsibly, supporting fair trade and sustainable practices worldwide.",
              },
              {
                title: "Exquisite Craftsmanship",
                desc: "Each gem is cut and polished with precision to reveal its natural brilliance and soul through traditional techniques.",
              },
              {
                title: "Global Trust",
                desc: "Our stones are certified and supplied to jewelers and collectors across 30+ countries with uncompromising quality.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 border border-amber-800/30 p-8 rounded-2xl shadow-2xl hover:shadow-amber-700/20 transition-all duration-300 group hover:-translate-y-2"
              >
                <div className="text-amber-400 text-4xl font-bold mb-4 group-hover:text-amber-300 transition-colors">0{i + 1}</div>
                <h3 className="text-2xl font-bold text-amber-400 mb-4 group-hover:text-amber-300 transition-colors">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials or Stats Section */}
        <section className="w-full py-16 bg-gradient-to-r from-gray-900/50 to-amber-900/10 border border-amber-800/30 rounded-3xl mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center py-12">
            { [
              { value: "25+", label: "Years Experience" },
              { value: "10K+", label: "Happy Customers" },
              { value: "500+", label: "Unique Stones" },
              { value: "30+", label: "Countries Served" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-gray-500 py-10 text-sm border-t border-amber-800/20 w-full mt-10">
          © {new Date().getFullYear()} Asian Gemstones — Crafted with Passion & Precision.
        </div>
      </div>
    </section>
  );
}
