"use client";

import type React from "react";

import Link from "next/link";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "../context/CartContext";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Sample product data for search
const allProducts = [
  {
    id: "chicken-breast",
    name: "Chicken Breast",
    category: "meat",
    subcategory: "Chicken",
  },
  {
    id: "chicken-thigh",
    name: "Chicken Thigh",
    category: "meat",
    subcategory: "Chicken",
  },
  {
    id: "mutton-curry-cut",
    name: "Mutton Curry Cut",
    category: "meat",
    subcategory: "Mutton",
  },
  {
    id: "mutton-chops",
    name: "Mutton Chops",
    category: "meat",
    subcategory: "Mutton",
  },
  {
    id: "beef-steak",
    name: "Beef Steak",
    category: "meat",
    subcategory: "Beef",
  },
  {
    id: "pork-chops",
    name: "Pork Chops",
    category: "meat",
    subcategory: "Pork",
  },
  { id: "rohu-fish", name: "Rohu Fish", category: "fish", subcategory: "Rohu" },
  {
    id: "katla-fish",
    name: "Katla Fish",
    category: "fish",
    subcategory: "Katla",
  },
  {
    id: "prawns-medium",
    name: "Medium Prawns",
    category: "fish",
    subcategory: "Prawns",
  },
  {
    id: "prawns-large",
    name: "Large Prawns",
    category: "fish",
    subcategory: "Prawns",
  },
  {
    id: "salmon-fillet",
    name: "Salmon Fillet",
    category: "fish",
    subcategory: "Salmon",
  },
];

export default function Header() {
  const { items, getTotalItems, getTotalPrice } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<
    typeof allProducts
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle search suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setSearchQuery("");
    }
  };

  const handleSuggestionClick = (productId: string) => {
    router.push(`/product/${productId}`);
    setShowSuggestions(false);
    setSearchQuery("");
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold text-red-600 hover:text-red-700 transition-colors duration-200"
          >
            FreshMart
          </Link>

          {/* Search Bar - Hidden on mobile, shown on tablet+ */}
          <div
            className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8 relative"
            ref={searchRef}
          >
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search for meat, fish..."
                className="pl-10 pr-4 h-10 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSuggestions(true)}
              />

              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-xl mt-1 max-h-60 overflow-y-auto z-[60] animate-in slide-in-from-top-2 duration-200">
                  {searchSuggestions.map((product) => (
                    <div
                      key={product.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSuggestionClick(product.id);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSuggestionClick(product.id);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 cursor-pointer select-none"
                    >
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.subcategory} • {product.category}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/category/meat"
              className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group"
            >
              Meat
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              href="/category/fish"
              className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group"
            >
              Fish
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/cart">
              <Button
                variant="outline"
                className="relative bg-transparent hover:bg-red-50 hover:border-red-300 transition-all duration-200 p-2 sm:px-4"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-600 hover:bg-red-700 animate-pulse">
                    {getTotalItems()}
                  </Badge>
                )}
                <span className="hidden sm:inline ml-2 font-medium">
                  ₹{getTotalPrice().toFixed(0)}
                </span>
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-red-50 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
          } overflow-visible`}
        >
          <div className="py-4 border-t space-y-4 relative">
            {/* Mobile Search */}
            <div className="relative z-50" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search for meat, fish..."
                  className="pl-10 pr-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowSuggestions(true)}
                />

                {/* Mobile Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-xl mt-1 max-h-48 overflow-y-auto z-[60] animate-in slide-in-from-top-2 duration-200">
                    {searchSuggestions.map((product) => (
                      <div
                        key={product.id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSuggestionClick(product.id);
                          setIsMenuOpen(false);
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSuggestionClick(product.id);
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 cursor-pointer select-none"
                      >
                        <div className="font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.subcategory} • {product.category}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-3">
              <Link
                href="/category/meat"
                className="text-gray-700 hover:text-red-600 py-2 px-2 rounded-md hover:bg-red-50 transition-all duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                🥩 Fresh Meat
              </Link>
              <Link
                href="/category/fish"
                className="text-gray-700 hover:text-red-600 py-2 px-2 rounded-md hover:bg-red-50 transition-all duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                🐟 Fresh Fish
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
