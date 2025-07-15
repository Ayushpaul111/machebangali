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

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [router]);

  // Handle search suggestions
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchSuggestions(filtered.slice(0, 5));
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Handle click outside to close suggestions
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

  // Prevent body scroll when menu is open and close menu on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      setIsMenuOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (productId: string) => {
    setShowSuggestions(false);
    setSearchQuery("");
    setIsMenuOpen(false);
    router.push(`/product/${productId}`);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 flex-shrink-0"
            onClick={closeMenu}
          >
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg lg:text-xl">
                🥩
              </span>
            </div>
            <span className="text-lg lg:text-xl font-bold text-gray-800 hidden sm:block">
              Mache Bangali
            </span>
          </Link>

          {/* Desktop Search */}
          <div
            className="hidden lg:flex flex-1 max-w-md mx-8 relative"
            ref={searchRef}
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search for meat, fish..."
                className="pl-10 pr-4 h-10 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
              />

              {/* Desktop Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-xl mt-1 max-h-60 overflow-y-auto z-[70] animate-in slide-in-from-top-2 duration-200">
                  {searchSuggestions.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSuggestionClick(product.id)}
                      className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 cursor-pointer"
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
            </div>
          </div>

          {/* Desktop Navigation Links */}
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
            <Link href="/cart" onClick={closeMenu}>
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
              className="lg:hidden hover:bg-red-50 transition-colors duration-200 relative z-[60]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
            onClick={closeMenu}
          />
        )}

        {/* Mobile Menu - FIXED VERSION */}
        <div
          className={`lg:hidden fixed top-16 left-0 right-0 bg-white border-t shadow-lg z-50 transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "translate-y-0 opacity-100 pointer-events-auto"
              : "-translate-y-full opacity-0 pointer-events-none"
          }`}
          style={{ maxHeight: "calc(100vh - 4rem)" }}
        >
          <div className="p-4 space-y-6 overflow-y-auto max-h-full">
            {/* Mobile Search */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search for meat, fish..."
                  className="pl-10 pr-4 h-12 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                />

                {/* Mobile Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-xl mt-1 max-h-48 overflow-y-auto z-[70] animate-in slide-in-from-top-2 duration-200">
                    {searchSuggestions.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSuggestionClick(product.id)}
                        className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 cursor-pointer"
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
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-3">
              <Link
                href="/category/meat"
                className="flex items-center text-gray-700 hover:text-red-600 py-3 px-4 rounded-lg hover:bg-red-50 transition-all duration-200 font-medium text-lg"
                onClick={closeMenu}
              >
                <span className="mr-3">🥩</span>
                Fresh Meat
              </Link>
              <Link
                href="/category/fish"
                className="flex items-center text-gray-700 hover:text-red-600 py-3 px-4 rounded-lg hover:bg-red-50 transition-all duration-200 font-medium text-lg"
                onClick={closeMenu}
              >
                <span className="mr-3">🐟</span>
                Fresh Fish
              </Link>
            </div>

            {/* Mobile Cart Summary - Dynamic */}
            {getTotalItems() > 0 && (
              <div className="border-t pt-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Cart Total</p>
                      <p className="text-lg font-bold text-red-600">
                        ₹{getTotalPrice().toFixed(0)}
                      </p>
                    </div>
                    <Badge className="bg-red-600 text-white px-2 py-1">
                      {getTotalItems()} item{getTotalItems() > 1 ? "s" : ""}
                    </Badge>
                  </div>

                  {/* Cart Items Preview */}
                  <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                    {items.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-700 truncate flex-1 mr-2">
                          {item.name} ({item.weight})
                        </span>
                        <span className="text-gray-900 font-medium">
                          {item.quantity}x ₹{item.price}
                        </span>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{items.length - 3} more item
                        {items.length - 3 > 1 ? "s" : ""}
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      closeMenu();
                      router.push("/cart");
                    }}
                  >
                    View Cart & Checkout
                  </Button>
                </div>
              </div>
            )}

            {/* Mobile Quick Actions */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="flex items-center justify-center py-3 text-sm"
                  onClick={() => {
                    closeMenu();
                    router.push("/orders");
                  }}
                >
                  <span className="mr-2">📦</span>
                  Orders
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center py-3 text-sm"
                  onClick={() => {
                    closeMenu();
                    router.push("/profile");
                  }}
                >
                  <span className="mr-2">👤</span>
                  Profile
                </Button>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="border-t pt-4">
              <div className="text-center text-sm text-gray-600">
                <p>Need help? Call us:</p>
                <a
                  href="tel:+911234567890"
                  className="text-red-600 font-medium hover:text-red-700"
                  onClick={closeMenu}
                >
                  +91 123 456 7890
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
