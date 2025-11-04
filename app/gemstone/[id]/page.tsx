'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Package, MapPin, RotateCcw, Shield } from 'lucide-react';
import { GemstoneProduct } from '../components/gem-collection';

export default function GemstoneDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<GemstoneProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // This would be replaced by an actual API call to fetch the product
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
        image: "/ruby.jpg",
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
        image: "/sapphire.jpg",
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
        image: "/emerald.jpg",
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
        image: "/tourmaline.jpg",
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
        image: "/topaz.jpg",
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
        image: "/opal.jpg",
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
        image: "/tanzanite.jpg",
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
        image: "/aquamarine.jpg",
        isFeatured: false,
        inStock: true,
        carat: "5.2 ct",
        cutType: "Oval",
        color: "Ocean Blue",
        clarity: "Eye Clean",
        dimensions: "12x10mm"
      }
    ];

    const foundProduct = gemstoneProducts.find(p => p.id === Number(id));
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-900/10 via-gray-900/80 to-black/90 flex items-center justify-center">
        <p className="text-amber-400 text-xl">Loading gemstone details...</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    // In a real app, this would dispatch to a cart state management solution
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900/10 via-gray-900/80 to-black/90 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/60 backdrop-blur-sm border border-amber-700/40 rounded-2xl p-6 shadow-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="flex justify-center">
              <div className="relative w-full h-96 bg-gray-900 rounded-xl overflow-hidden border border-amber-800/30">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-gemstone.jpg";
                  }}
                />
              </div>
            </div>
            
            {/* Product Details */}
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-amber-400">{product.name}</h1>
                  <div className="flex items-center mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-500'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm ml-2">({product.rating})</span>
                  </div>
                </div>
                
                <button 
                  className="p-2 bg-gray-700 rounded-full hover:bg-amber-600 transition-colors"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                </button>
              </div>
              
              <div className="mt-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-bold text-amber-400">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                
                <p className="mt-4 text-gray-300">{product.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-gray-900/50 rounded-lg border border-amber-800/30">
                    <h3 className="font-semibold text-amber-400 mb-2">Gemstone Details</h3>
                    <p className="text-sm text-gray-300"><span className="text-amber-200">Carat:</span> {product.carat}</p>
                    <p className="text-sm text-gray-300"><span className="text-amber-200">Cut:</span> {product.cutType}</p>
                    <p className="text-sm text-gray-300"><span className="text-amber-200">Color:</span> {product.color}</p>
                    <p className="text-sm text-gray-300"><span className="text-amber-200">Clarity:</span> {product.clarity}</p>
                    <p className="text-sm text-gray-300"><span className="text-amber-200">Dimensions:</span> {product.dimensions}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-900/50 rounded-lg border border-amber-800/30">
                    <h3 className="font-semibold text-amber-400 mb-2">Additional Info</h3>
                    <p className="text-sm text-gray-300"><span className="text-amber-200">Origin:</span> {product.origin}</p>
                    <p className="text-sm text-gray-300"><span className="text-amber-200">Category:</span> {product.category}</p>
                    <p className="text-sm text-gray-300"><span className="text-amber-200">Weight:</span> {product.weight}</p>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex items-center border border-amber-700 rounded-lg overflow-hidden">
                    <button 
                      className="px-4 py-2 bg-gray-700 text-white hover:bg-amber-600 transition-colors"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-white">{quantity}</span>
                    <button 
                      className="px-4 py-2 bg-gray-700 text-white hover:bg-amber-600 transition-colors"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                      product.inStock 
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 transition-all' 
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
                
                <div className="mt-8 pt-6 border-t border-amber-800/30">
                  <h3 className="font-semibold text-amber-400 mb-4">Product Services</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-amber-400" />
                      <span className="text-gray-300 text-sm">Free Shipping</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <RotateCcw className="h-5 w-5 text-amber-400" />
                      <span className="text-gray-300 text-sm">30-Day Returns</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-amber-400" />
                      <span className="text-gray-300 text-sm">Certificate of Authenticity</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}