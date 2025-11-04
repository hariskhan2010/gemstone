"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";

export interface Product {
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
}

export default function ProductCard({ product }: { product: Product }) {
  const isNew = product.id <= 5; // First 5 products are marked as new
  const isOnSale = product.originalPrice !== undefined; // Products with originalPrice are on sale
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-amber-700/50 rounded-2xl overflow-hidden shadow-2xl shadow-amber-900/20 hover:shadow-amber-500/30 transition-all duration-300 group"
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            // Fallback image if the image fails to load
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-gemstone.jpg";
          }}
        />
        <div className="absolute inset-0  from-black/70 to-transparent opacity-80"></div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {isNew && (
            <span className="px-2 py-1 bg-amber-500 text-gray-900 text-xs font-bold rounded-full">
              NEW
            </span>
          )}
          {isOnSale && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              SALE
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
              FEATURED
            </span>
          )}
        </div>
        
        {/* Favorite button */}
        <button className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-amber-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">{product.name}</h3>
          <div className="flex items-center mt-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-400'}`} 
                />
              ))}
            </div>
            <span className="text-gray-300 text-sm ml-2">({product.rating})</span>
          </div>
          <div className="flex items-center mt-2">
            {isOnSale ? (
              <>
                <span className="text-amber-400 font-bold text-lg">${product.price}</span>
                <span className="text-gray-400 line-through text-sm ml-2">${product.originalPrice}</span>
              </>
            ) : (
              <span className="text-amber-400 font-bold text-lg">${product.price}</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between text-sm text-gray-300 mb-3">
          <span className="text-amber-200">Category: {product.category}</span>
          <span className="text-gray-400">{product.weight}</span>
        </div>
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Origin: {product.origin}</span>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-gray-700/80 hover:bg-amber-600 rounded-full transition-colors"
              title="Add to Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-sm font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all"
            >
              View Details
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Function to generate dummy product data
export const generateDummyProducts = (): Product[] => {
  const gemstoneNames = [
    "Ruby", "Sapphire", "Emerald", "Aquamarine", "Garnet", "Amethyst",
    "Topaz", "Tourmaline", "Opal", "Peridot", "Citrine", "Jade",
    "Onyx", "Lapis Lazuli", "Moonstone", "Rose Quartz", "Tanzanite",
    "Turquoise", "Zircon", "Spinel", "Alexandrite", "Iolite", "Kyanite",
    "Chrysoprase", "Chalcedony", "Agate", "Carnelian", "Jasper", "Fluorite",
    "Apatite", "Beryl", "Chrysoberyl", "Diaspore", "Euclase", "Hambergite",
    "Jeremejevite", "Pezzottaite", "Scapolite", "Serpentine", "Tremolite",
    "Uvite", "Vivianite", "Willemite", "Xonotlite", "Zektzerite", "Ammolite",
    "Benitoite", "Danburite", "Eudialyte", "Hackmanite", "Jeremejevite"
  ];

  const origins = [
    "Myanmar", "Sri Lanka", "Colombia", "Brazil", "Madagascar", "Afghanistan",
    "Tanzania", "Zambia", "Mozambique", "Pakistan", "India", "Australia",
    "Russia", "United States", "Canada", "Ethiopia", "Nigeria", "Kenya"
  ];

  const categories = [
    "Precious Stones", "Semi-Precious", "Organic Gems", "Collector's Items",
    "Rough Stones", "Cabochons", "Faceted Gems", "Carved Stones", "Jewelry Set"
  ];

  const products: Product[] = [];

  for (let i = 1; i <= 50; i++) {
    const name = gemstoneNames[i % gemstoneNames.length] + ` #${i}`;
    const price = Math.floor(Math.random() * 5000) + 50; // Price between $50 and $5050
    const weight = (Math.random() * 10 + 0.5).toFixed(2) + " carats";
    const origin = origins[Math.floor(Math.random() * origins.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const rating = parseFloat((Math.random() * 2 + 3).toFixed(1)); // Rating between 3.0 and 5.0

    // Randomly decide if this product is on sale (about 20% of products)
    const isOnSale = Math.random() < 0.2;
    const originalPrice = isOnSale ? price + Math.floor(Math.random() * 1000) + 100 : undefined;

    // First 10 products are featured
    const isFeatured = i <= 10;

    products.push({
      id: i,
      name: name,
      description: `Exquisite ${name.toLowerCase()} of the finest quality. Meticulously selected from ${origin} for its exceptional color, clarity, and brilliance. This ${weight} gemstone features perfect cut and exceptional fire.`,
      price: price,
      originalPrice: isOnSale ? originalPrice : undefined,
      rating: rating,
      category: category,
      weight: weight,
      origin: origin,
      image: `/${name.split(' ')[0].toLowerCase()}.jpg`, // Using the gemstone name for image path
      isFeatured: isFeatured
    });
  }

  return products;
};