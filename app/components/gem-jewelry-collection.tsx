'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Gem, ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../context/cart-context';

export interface GemstoneProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  category: string;
  weight: string; // e.g., "2.5 carats"
  origin: string;
  image: string;
  isFeatured?: boolean;
  inStock: boolean;
  carat: string;
  cutType: string;
  color: string;
  clarity: string;
  dimensions: string; // e.g., "12x8mm"
}

export interface CartItem {
  product: GemstoneProduct;
  quantity: number;
}

// Function to differentiate between gemstones and jewelry products
const isJewelryProduct = (product: GemstoneProduct): boolean => {
  return product.category === 'Jewelry Set';
};

export default function GemJewelryCollection() {
  const [products, setProducts] = useState<GemstoneProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<GemstoneProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'gemstones' | 'jewelries'>('gemstones');
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  
  // Using the global cart context
  const { addToCart } = useCart();

  useEffect(() => {
    // All products - both gemstones and jewelry
    const allProducts: GemstoneProduct[] = [
      // Gemstone products
      {
        id: 1,
        name: "Premium Ruby",
        description: "Exceptional quality ruby with intense red color and excellent clarity. Sourced from Myanmar.",
        price: 2499.99,
        originalPrice: 2999.99,
        rating: 4.8,
        category: "Precious Stones",
        weight: "3.2 carats",
        origin: "Myanmar",
        image: "https://images.unsplash.com/photo-1619804002165-4a62e53e50e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        isFeatured: true,
        inStock: true,
        carat: "3.2 ct",
        cutType: "Oval Brilliant",
        color: "Vivid Red",
        clarity: "Eye Clean",
        dimensions: "10x8mm"
      },
      {
        id: 2,
        name: "Ceylon Sapphire",
        description: "Beautiful blue sapphire with excellent saturation and clarity. Heat treated for enhanced color.",
        price: 1899.99,
        rating: 4.7,
        category: "Precious Stones",
        weight: "2.8 carats",
        origin: "Sri Lanka",
        image: "https://images.unsplash.com/photo-1619804002148-7a0e52d578eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        isFeatured: true,
        inStock: true,
        carat: "2.8 ct",
        cutType: "Cushion",
        color: "Cornflower Blue",
        clarity: "Slightly Included",
        dimensions: "9x7mm"
      },
      {
        id: 3,
        name: "Zambian Emerald",
        description: "Vibrant green emerald with excellent color distribution and minimal inclusions.",
        price: 1999.99,
        rating: 4.6,
        category: "Precious Stones",
        weight: "2.1 carats",
        origin: "Zambia",
        image: "https://images.unsplash.com/photo-1619804002157-4a1cc03d4d9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        isFeatured: true,
        inStock: true,
        carat: "2.1 ct",
        cutType: "Emerald Cut",
        color: "Deep Green",
        clarity: "Very Slightly Included",
        dimensions: "8x6mm"
      },
      {
        id: 4,
        name: "Paraiba Tourmaline",
        description: "Rare and stunning electric blue-green tourmaline with exceptional color intensity.",
        price: 4299.99,
        rating: 4.9,
        category: "Semi-Precious",
        weight: "1.5 carats",
        origin: "Brazil",
        image: "https://images.unsplash.com/photo-1619804002150-4a62e53e50e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        isFeatured: true,
        inStock: true,
        carat: "1.5 ct",
        cutType: "Round Brilliant",
        color: "Electric Blue-Green",
        clarity: "Eye Clean",
        dimensions: "7mm"
      },
      {
        id: 5,
        name: "Imperial Topaz",
        description: "Exceptional orangey-gold topaz with excellent clarity and brilliance.",
        price: 1299.99,
        rating: 4.5,
        category: "Semi-Precious",
        weight: "4.3 carats",
        origin: "Brazil",
        image: "https://images.unsplash.com/photo-1619804002144-7a0e52d578eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        isFeatured: false,
        inStock: true,
        carat: "4.3 ct",
        cutType: "Pear",
        color: "Imperial Orange",
        clarity: "Very Slightly Included",
        dimensions: "12x8mm"
      },
      {
        id: 6,
        name: "Black Opal",
        description: "Mesmerizing black opal with vibrant play-of-color from Lightning Ridge, Australia.",
        price: 3599.99,
        rating: 4.8,
        category: "Organic Gems",
        weight: "2.7 carats",
        origin: "Australia",
        image: "https://images.unsplash.com/photo-1619804002155-4a62e53e50e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        isFeatured: true,
        inStock: true,
        carat: "2.7 ct",
        cutType: "Freeform",
        color: "Black with Fire",
        clarity: "Semi-translucent",
        dimensions: "14x10mm"
      },
      {
        id: 7,
        name: "Tanzanite",
        description: "Rare blue to violet Tanzanite with excellent clarity and color saturation.",
        price: 899.99,
        rating: 4.4,
        category: "Semi-Precious",
        weight: "3.1 carats",
        origin: "Tanzania",
        image: "https://images.unsplash.com/photo-1619804002146-7a0e52d578eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        isFeatured: false,
        inStock: true,
        carat: "3.1 ct",
        cutType: "Cushion",
        color: "Blue-Violet",
        clarity: "Slightly Included",
        dimensions: "10x8mm"
      },
      {
        id: 8,
        name: "Aquamarine",
        description: "Stunning sea-blue aquamarine with excellent clarity and minimal inclusions.",
        price: 799.99,
        rating: 4.3,
        category: "Semi-Precious",
        weight: "5.2 carats",
        origin: "Brazil",
        image: "https://images.unsplash.com/photo-1619804002152-4a62e53e50e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        isFeatured: false,
        inStock: true,
        carat: "5.2 ct",
        cutType: "Oval",
        color: "Ocean Blue",
        clarity: "Eye Clean",
        dimensions: "12x10mm"
      },
      {
        id: 9,
        name: "Amethyst",
        description: "Deep purple amethyst with excellent clarity and minimal inclusions.",
        price: 599.99,
        originalPrice: 699.99,
        rating: 4.2,
        category: "Semi-Precious",
        weight: "4.0 carats",
        origin: "Uruguay",
        image: "https://images.unsplash.com/photo-1619804002148-7a0e52d578eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        isFeatured: false,
        inStock: true,
        carat: "4.0 ct",
        cutType: "Round Brilliant",
        color: "Deep Purple",
        clarity: "Eye Clean",
        dimensions: "10mm"
      },
      {
        id: 10,
        name: "Garnet",
        description: "Vibrant red garnet with excellent brilliance and clarity.",
        price: 449.99,
        rating: 4.1,
        category: "Semi-Precious",
        weight: "3.5 carats",
        origin: "India",
        image: "https://images.unsplash.com/photo-1619804002150-4a62e53e50e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        isFeatured: false,
        inStock: true,
        carat: "3.5 ct",
        cutType: "Cushion",
        color: "Vibrant Red",
        clarity: "Very Slightly Included",
        dimensions: "9x7mm"
      },
      // Jewelry products
      {
        id: 11,
        name: "Ruby & Diamond Ring",
        description: "Elegant 18K gold ring featuring a 2.0 carat premium ruby surrounded by brilliant diamonds.",
        price: 4299.99,
        originalPrice: 4999.99,
        rating: 4.9,
        category: "Jewelry Set",
        weight: "5.0g",
        origin: "Italy",
        image: "https://images.unsplash.com/photo-1611934467150-0b056b8114c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        isFeatured: true,
        inStock: true,
        carat: "2.0 ct center",
        cutType: "Round Brilliant",
        color: "Vivid Red",
        clarity: "Eye Clean",
        dimensions: "6.5 US"
      },
      {
        id: 12,
        name: "Sapphire Earrings",
        description: "Pair of stunning 18K white gold earrings with 1.5 carat sapphires and diamond accents.",
        price: 3499.99,
        rating: 4.8,
        category: "Jewelry Set",
        weight: "8.2g",
        origin: "Switzerland",
        image: "https://images.unsplash.com/photo-1599607759646-95c2d9f3ebc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        isFeatured: true,
        inStock: true,
        carat: "1.5 ct each",
        cutType: "Princess",
        color: "Royal Blue",
        clarity: "Slightly Included",
        dimensions: "14mm drop"
      },
      {
        id: 13,
        name: "Emerald Necklace",
        description: "Beautiful 18K gold necklace featuring a 3.0 carat emerald with diamond chain.",
        price: 6799.99,
        originalPrice: 7499.99,
        rating: 4.9,
        category: "Jewelry Set",
        weight: "12.0g",
        origin: "Colombia",
        image: "https://images.unsplash.com/photo-1605853484483-72275220ca2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        isFeatured: true,
        inStock: true,
        carat: "3.0 ct center",
        cutType: "Oval",
        color: "Deep Green",
        clarity: "Very Slightly Included",
        dimensions: "18\" length"
      },
      {
        id: 14,
        name: "Tourmaline Bracelet",
        description: "Exquisite bracelet showcasing 20 Paraiba tourmalines with 14K rose gold setting.",
        price: 8499.99,
        rating: 4.7,
        category: "Jewelry Set",
        weight: "10.5g",
        origin: "Brazil",
        image: "https://images.unsplash.com/photo-1599607761728-ec9130fbec22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        isFeatured: true,
        inStock: true,
        carat: "14 ct total",
        cutType: "Mixed cuts",
        color: "Electric Blue-Green",
        clarity: "Eye Clean",
        dimensions: "7\" length"
      },
      {
        id: 15,
        name: "Morganite",
        description: "Beautiful pink morganite with excellent clarity and brilliance. Sourced from Madagascar.",
        price: 1299.99,
        originalPrice: 1599.99,
        rating: 4.7,
        category: "Semi-Precious",
        weight: "2.5 carats",
        origin: "Madagascar",
        image: "https://images.unsplash.com/photo-1619804002165-4a62e53e50e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        isFeatured: true,
        inStock: true,
        carat: "2.5 ct",
        cutType: "Round Brilliant",
        color: "Pink",
        clarity: "Eye Clean",
        dimensions: "8mm"
      },
      {
        id: 16,
        name: "Spinel",
        description: "Vibrant red spinel with exceptional color and clarity. A rare alternative to ruby.",
        price: 2199.99,
        rating: 4.6,
        category: "Semi-Precious",
        weight: "2.0 carats",
        origin: "Sri Lanka",
        image: "https://images.unsplash.com/photo-1619804002148-7a0e52d578eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        isFeatured: true,
        inStock: true,
        carat: "2.0 ct",
        cutType: "Cushion",
        color: "Red",
        clarity: "Slightly Included",
        dimensions: "7x5mm"
      },
      {
        id: 17,
        name: "Chrysoberyl",
        description: "Unique chrysoberyl with excellent color change properties between natural and fluorescent light.",
        price: 1899.99,
        originalPrice: 2299.99,
        rating: 4.5,
        category: "Semi-Precious",
        weight: "3.0 carats",
        origin: "Brazil",
        image: "https://images.unsplash.com/photo-1619804002157-4a1cc03d4d9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        isFeatured: true,
        inStock: true,
        carat: "3.0 ct",
        cutType: "Oval",
        color: "Yellow-Green",
        clarity: "Very Slightly Included",
        dimensions: "10x8mm"
      },
      {
        id: 18,
        name: "Alexandrite",
        description: "Rare color-changing alexandrite with dramatic transformation from green to red under different lighting.",
        price: 8999.99,
        rating: 4.9,
        category: "Precious Stones",
        weight: "1.8 carats",
        origin: "Brazil",
        image: "https://images.unsplash.com/photo-1619804002150-4a62e53e50e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        isFeatured: true,
        inStock: true,
        carat: "1.8 ct",
        cutType: "Cushion",
        color: "Green-Red",
        clarity: "Eye Clean",
        dimensions: "8x6mm"
      }
    ];
    
    setProducts(allProducts);
    updateFilteredProducts(allProducts, activeTab, searchTerm, sortBy, priceRange);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    updateFilteredProducts(products, activeTab, searchTerm, sortBy, priceRange);
  }, [activeTab, searchTerm, sortBy, priceRange, products]);

  const updateFilteredProducts = (
    allProducts: GemstoneProduct[],
    tab: 'gemstones' | 'jewelries',
    search: string,
    sort: string,
    price: [number, number]
  ) => {
    let result = [...allProducts];

    // Filter by tab
    if (tab === 'gemstones') {
      result = result.filter(product => !isJewelryProduct(product));
    } else {
      result = result.filter(product => isJewelryProduct(product));
    }

    // Apply search filter
    if (search) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()) ||
        product.origin.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply price filter
    result = result.filter(product => 
      product.price >= price[0] && product.price <= price[1]
    );

    // Apply sorting
    switch (sort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "carat":
        result.sort((a, b) => {
          // Extract numeric value from carat string for comparison
          const aCarat = parseFloat(a.carat) || 0;
          const bCarat = parseFloat(b.carat) || 0;
          return bCarat - aCarat;
        });
        break;
      case "featured":
        result.sort((a, b) => (b.isFeatured === a.isFeatured) ? 0 : b.isFeatured ? 1 : -1);
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900/10 via-gray-900/80 to-black/90 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Tab buttons for Gemstones and Jewelries */}
        <div className="flex justify-center mb-12 space-x-4">
          <button
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'gemstones'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-500/30'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setActiveTab('gemstones')}
          >
            Gemstones
          </button>
          <button
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'jewelries'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-500/30'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setActiveTab('jewelries')}
          >
            Jewelries
          </button>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            {activeTab === 'gemstones' ? (
              <Gem className="h-12 w-12 text-amber-500" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-amber-400 mb-6 tracking-wide drop-shadow-[0_0_15px_rgba(245,167,66,0.5)]">
            {activeTab === 'gemstones' ? 'Premium Gemstone Collection' : 'Premium Jewelry Collection'}
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            {activeTab === 'gemstones' 
              ? 'Discover our exquisite selection of certified premium gemstones sourced from around the world.' 
              : 'Exquisite jewelry pieces featuring our finest gemstones, crafted with exceptional skill and attention to detail.'}
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-800/60 backdrop-blur-sm border border-amber-700/40 rounded-2xl p-6 mb-12 shadow-xl shadow-amber-900/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search Bar */}
            <div className="md:col-span-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-amber-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border border-amber-800/50 rounded-lg text-amber-50 placeholder:text-amber-300/70 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Sort Options */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-3 px-4 bg-gray-900/80 border border-amber-800/50 rounded-lg text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              >
                <option value="featured" className="bg-gray-900 text-amber-50">Featured</option>
                <option value="carat" className="bg-gray-900 text-amber-50">Carat Size</option>
                <option value="price-low" className="bg-gray-900 text-amber-50">Price: Low to High</option>
                <option value="price-high" className="bg-gray-900 text-amber-50">Price: High to Low</option>
                <option value="rating" className="bg-gray-900 text-amber-50">Top Rated</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-amber-400 font-medium text-sm">Max: ${priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-gradient-to-r from-amber-800/50 via-amber-600/60 to-amber-500/70 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-between items-center p-4 bg-gray-800/40 backdrop-blur-sm border border-amber-700/30 rounded-xl"
        >
          <h2 className="text-2xl font-bold text-amber-300 drop-shadow-[0_0_8px_rgba(245,167,66,0.3)]">
            Showing {filteredProducts.length} {activeTab === 'gemstones' ? 'gemstones' : 'jewelry pieces'}
          </h2>
          {searchTerm && (
            <p className="text-amber-300 font-medium bg-amber-900/30 px-3 py-1 rounded-full">
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
                <GemstoneProductCard product={product} onAddToCart={addToCart} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 50 }}
            className="text-center py-20"
          >
            <Gem className="h-16 w-16 text-amber-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-amber-400 mb-2">
              No {activeTab === 'gemstones' ? 'gemstones' : 'jewelry'} Found
            </h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setSortBy("featured");
                setPriceRange([0, 10000]);
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all shadow-md shadow-amber-900/30"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

interface GemstoneProductCardProps {
  product: GemstoneProduct;
  onAddToCart: (product: GemstoneProduct) => void;
}

const GemstoneProductCard: React.FC<GemstoneProductCardProps> = ({ product, onAddToCart }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="bg-gradient-to-br from-gray-700/90 to-gray-800/90 border border-amber-600/50 rounded-2xl overflow-hidden shadow-2xl shadow-amber-900/30 hover:shadow-amber-500/40 transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            // Fallback image if the image fails to load
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-gemstone.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {product.isFeatured && (
            <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
              FEATURED
            </span>
          )}
          {product.originalPrice && (
            <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
              SALE
            </span>
          )}
        </div>
        
        {/* Favorite button */}
        <button 
          className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-amber-600 transition-colors"
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`} />
        </button>
        
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">{product.name}</h3>
          <div className="flex items-center mt-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-gray-200 text-sm ml-2">({product.rating})</span>
          </div>
          <div className="flex items-center mt-2">
            {product.originalPrice ? (
              <>
                <span className="text-amber-300 font-bold text-lg">${product.price.toFixed(2)}</span>
                <span className="text-gray-300/70 line-through text-sm ml-2">${product.originalPrice.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-amber-300 font-bold text-lg">${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-5">
        {/* Gemstone details */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div className="text-amber-300">
            <span className="text-amber-100">Carat:</span> {product.carat}
          </div>
          <div className="text-amber-300">
            <span className="text-amber-100">Cut:</span> {product.cutType}
          </div>
          <div className="text-amber-300">
            <span className="text-amber-100">Color:</span> {product.color}
          </div>
          <div className="text-amber-300">
            <span className="text-amber-100">Clarity:</span> {product.clarity}
          </div>
        </div>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-300">Origin: {product.origin}</span>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-full transition-colors ${product.inStock ? 'bg-gray-600/80 hover:bg-amber-600' : 'bg-gray-700/50 cursor-not-allowed'}`}
              title="Add to Cart"
              onClick={() => product.inStock && onAddToCart(product)}
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-5 w-5 text-white" />
            </motion.button>
            <Link href={`/gemstone/${product.id}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  product.inStock 
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800' 
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {product.inStock ? 'View Details' : 'Out of Stock'}
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};