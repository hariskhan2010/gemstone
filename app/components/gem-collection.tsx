"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Star, Gem, ShoppingCart, Heart, Minus, Plus } from "lucide-react";
import Link from "next/link";

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

export default function GemCollectionPage() {
  const [products, setProducts] = useState<GemstoneProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<GemstoneProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  // Categories for filtering
  const categories = [
    "All", "Precious Stones", "Semi-Precious", "Organic Gems", 
    "Collector's Items", "Rough Stones", "Cabochons", "Faceted Gems", 
    "Carved Stones", "Jewelry Set"
  ];

  // Initialize products with actual gemstone images and details
  useEffect(() => {
    const gemstoneProducts: GemstoneProduct[] = [
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
      }
    ];
    
    setProducts(gemstoneProducts);
    setFilteredProducts(gemstoneProducts);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.origin.toLowerCase().includes(searchTerm.toLowerCase())
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
      case "carat":
        result.sort((a, b) => parseFloat(b.carat) - parseFloat(a.carat));
        break;
      case "featured":
        result.sort((a, b) => (b.isFeatured === a.isFeatured) ? 0 : b.isFeatured ? 1 : -1);
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, sortBy, priceRange, products]);

  // Cart functions
  const addToCart = (product: GemstoneProduct) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevItems, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900/10 via-gray-900/80 to-black/90 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 relative"
        >
          <div className="flex justify-center mb-4">
            <Gem className="h-12 w-12 text-amber-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-amber-400 mb-6 tracking-wide drop-shadow-[0_0_15px_rgba(245,167,66,0.5)]">
            Premium Gemstone Collection
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Discover our exquisite selection of certified premium gemstones sourced from around the world. 
            Each piece is carefully selected for its quality, beauty, and authenticity.
          </p>
          
          {/* Cart Button */}
          <button 
            onClick={() => setShowCart(!showCart)}
            className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2 bg-amber-700/80 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Cart ({getTotalItems()})</span>
          </button>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-800/60 backdrop-blur-sm border border-amber-700/40 rounded-2xl p-6 mb-12 shadow-xl shadow-amber-900/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Search Bar */}
            <div className="md:col-span-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-amber-400" />
              </div>
              <input
                type="text"
                placeholder="Search gemstones, origin, color..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border border-amber-800/50 rounded-lg text-amber-50 placeholder:text-amber-300/70 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-3 px-4 bg-gray-900/80 border border-amber-800/50 rounded-lg text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-900 text-amber-50">{category}</option>
                ))}
              </select>
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

            {/* Cart Toggle on Mobile */}
            <div className="md:hidden">
              <button 
                onClick={() => setShowCart(!showCart)}
                className="w-full py-3 px-4 bg-amber-700/80 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart ({getTotalItems()})</span>
              </button>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <span className="text-amber-400 font-medium">Price Range: ${priceRange[0]} - ${priceRange[1]}</span>
              <span className="text-amber-300/80">Max: $5000</span>
            </div>
            <input
              type="range"
              min="0"
              max="5000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-gradient-to-r from-amber-800/50 via-amber-600/60 to-amber-500/70 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </motion.div>

        {/* Cart Sidebar */}
        {showCart && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full md:w-96 bg-gray-900/95 backdrop-blur-lg border-l border-amber-700/50 z-50 p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-amber-400">Your Cart</h2>
              <button 
                onClick={() => setShowCart(false)}
                className="text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>
            
            {cartItems.length === 0 ? (
              <p className="text-gray-400 text-center py-10">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-amber-800/30">
                      <div className="w-16 h-16 bg-gray-700 rounded-md overflow-hidden">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-gemstone.jpg";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{item.product.name}</h3>
                        <p className="text-amber-400 font-bold">${item.product.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-amber-800/50 pt-4">
                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span className="text-amber-400">Total: </span>
                    <span className="text-white">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <button className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg shadow-amber-500/30">
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Products Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-between items-center p-4 bg-gray-800/40 backdrop-blur-sm border border-amber-700/30 rounded-xl"
        >
          <h2 className="text-2xl font-bold text-amber-300 drop-shadow-[0_0_8px_rgba(245,167,66,0.3)]">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? "gemstone" : "gemstones"}
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
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all shadow-md shadow-amber-900/30"
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
          className="mt-20 bg-gradient-to-r from-amber-900/20 to-gray-900/80 border border-amber-800/50 rounded-3xl p-8 md:p-12 text-center"
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
            <Link href="/cart">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  product.inStock 
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800' 
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                onClick={() => product.inStock && onAddToCart(product)}
                disabled={!product.inStock}
              >
                {product.inStock ? 'View Cart' : 'Out of Stock'}
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};