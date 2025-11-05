"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useCart } from "../context/cart-context";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { getTotalItems } = useCart();

  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-md border-b border-amber-800/30 z-50 h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo & Text */}
          <Link href="/" className="flex items-center space-x-3 h-full py-2">
            <div className="w-12 h-12 relative flex items-center justify-center">
              <div className="absolute w-12 h-12 rounded-full bg-amber-500/20"></div>
              <Image
                src="/logo.png"
                alt="Asian Gemstone Logo"
                width={40}
                height={40}
                className="object-contain z-10 relative"
              />
            </div>
            <div className="flex flex-col leading-none ml-2">
              <span className="text-xl font-bold text-amber-400 tracking-widest">
                A S I A N
              </span>
              <span className="text-xl font-bold text-white tracking-widest">
                G E M S T O N E
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 text-gray-300 h-full">
            <Link href="/" className="hover:text-amber-400 transition flex items-center h-full text-lg font-medium relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/collections" className="hover:text-amber-400 transition flex items-center h-full text-lg font-medium relative group">
              Collections
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/about" className="hover:text-amber-400 transition flex items-center h-full text-lg font-medium relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/contact" className="hover:text-amber-400 transition flex items-center h-full text-lg font-medium relative group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            {/* Cart Icon with Item Count */}
            <Link href="/cart" className="relative flex items-center gap-1 hover:text-amber-400 transition flex items-center h-full text-lg font-medium relative group">
              <ShoppingCart className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-300 hover:text-amber-400 transition flex items-center h-full p-2"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-lg border-t border-amber-800/30 absolute top-20 left-0 w-full shadow-2xl">
          <div className="flex flex-col items-center space-y-6 py-6 text-gray-300">
            <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-amber-400 text-xl font-medium transition">Home</Link>
            <Link href="/collections" onClick={() => setMenuOpen(false)} className="hover:text-amber-400 text-xl font-medium transition">Collections</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)} className="hover:text-amber-400 text-xl font-medium transition">About</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="hover:text-amber-400 text-xl font-medium transition">Contact</Link>
            
            {/* Cart Link for Mobile */}
            <Link href="/cart" onClick={() => setMenuOpen(false)} className="hover:text-amber-400 text-xl font-medium transition flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Cart {getTotalItems() > 0 && `(${getTotalItems()})`}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
