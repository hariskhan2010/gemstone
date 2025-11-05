"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Star, Gem, ShoppingCart, Heart, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useCart } from "../context/cart-context";

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

export default function CustomGemCollection() {
  const [products, setProducts] = useState<GemstoneProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<GemstoneProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  
  // Using the global cart context
  const { addToCart, getTotalItems } = useCart();

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
        id: 11,
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
        id: 12,
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
        id: 13,
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
        id: 14,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900/10 via-gray-900/80 to-black/90 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <Gem className="h-12 w-12 text-amber-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-amber-400 mb-6 tracking-wide drop-shadow-[0_0_15px_rgba(245,167,66,0.5)]">
            Exclusive Collection
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Discover our unique and rare gemstones, carefully selected for their exceptional properties and beauty.
          </p>
        </motion.div>

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
            animate={{ opacity: 50 }}
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
              EXCLUSIVE
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