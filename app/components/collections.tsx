"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard, { generateDummyProducts, Product } from "./product";
import { Search, Filter, Star, Gem } from "lucide-react";

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);

  // Categories for filtering
  const categories = [
    "All", "Precious Stones", "Semi-Precious", "Organic Gems", 
    "Collector's Items", "Rough Stones", "Cabochons", "Faceted Gems", 
    "Carved Stones", "Jewelry Set"
  ];

  // Initialize products
  useEffect(() => {
    const dummyProducts = generateDummyProducts();
    setProducts(dummyProducts);
    setFilteredProducts(dummyProducts);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Apply price filter
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      case "featured":
        result.sort((a, b) => (b.isFeatured === a.isFeatured) ? 0 : b.isFeatured ? 1 : -1);
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, sortBy, priceRange, products]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <Gem className="h-12 w-12 text-amber-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-amber-400 mb-6 tracking-wide drop-shadow-[0_0_15px_#b78d4a]">
            Gemstone Collections
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our exquisite selection of premium gemstones sourced from around the world. 
            Each piece is carefully selected for its quality, beauty, and authenticity.
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-900/50 border border-amber-800/30 rounded-2xl p-6 mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search Bar */}
            <div className="md:col-span-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search gemstones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-amber-800/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-3 px-4 bg-gray-800 border border-amber-800/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800">{category}</option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-3 px-4 bg-gray-800 border border-amber-800/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="featured" className="bg-gray-800">Featured</option>
                <option value="newest" className="bg-gray-800">Newest</option>
                <option value="price-low" className="bg-gray-800">Price: Low to High</option>
                <option value="price-high" className="bg-gray-800">Price: High to Low</option>
                <option value="rating" className="bg-gray-800">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <span className="text-amber-400">Price Range: ${priceRange[0]} - ${priceRange[1]}</span>
              <span className="text-gray-400">Max: $5000</span>
            </div>
            <input
              type="range"
              min="0"
              max="5000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-between items-center"
        >
          <h2 className="text-2xl font-bold text-white">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? "gemstone" : "gemstones"}
          </h2>
          {searchTerm && (
            <p className="text-gray-400">
              Results for "{searchTerm}"
            </p>
          )}
        </motion.div>

        {filteredProducts.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Gem className="h-16 w-16 text-amber-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-amber-400 mb-2">No Gemstones Found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSortBy("featured");
                setPriceRange([0, 5000]);
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all"
            >
              Reset Filters
            </button>
          </motion.div>
        )}

        {/* Special Offer Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 bg-gradient-to-r from-amber-900/30 to-gray-900 border border-amber-800/50 rounded-3xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-amber-400 mb-4">Special Offer</h2>
          <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
            For first-time customers: Get 15% off on your first purchase of gemstones worth $500 or more.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-full hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg shadow-amber-500/30"
          >
            Claim Your Discount
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}