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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<
    typeof allProducts
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSearchInput, setActiveSearchInput] = useState<
    "desktop" | "mobile" | null
  >(null);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
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

  // Close suggestions and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Close search suggestions if clicking outside search areas
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(target)
      ) {
        setShowSuggestions(false);
        setActiveSearchInput(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // lg breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setSearchQuery("");
      setActiveSearchInput(null);
      setIsMobileMenuOpen(false);
    }
  };

  const handleSuggestionClick = (productId: string) => {
    router.push(`/product/${productId}`);
    setShowSuggestions(false);
    setSearchQuery("");
    setActiveSearchInput(null);
    setIsMobileMenuOpen(false);
  };

  const handleSearchFocus = (inputType: "desktop" | "mobile") => {
    setActiveSearchInput(inputType);
    if (searchQuery.trim()) {
      setShowSuggestions(true);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl sm:text-2xl font-bold text-red-600 hover:text-red-700 transition-colors duration-200 z-10"
              onClick={closeMobileMenu}
            >
              FreshMart
            </Link>

            {/* Desktop Search Bar */}
            <div
              className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8 relative"
              ref={desktopSearchRef}
            >
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                <Input
                  type="search"
                  placeholder="Search for meat, fish..."
                  className="pl-10 pr-4 h-10 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => handleSearchFocus("desktop")}
                />

                {/* Desktop Search Suggestions */}
                {showSuggestions &&
                  searchSuggestions.length > 0 &&
                  activeSearchInput === "desktop" && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-xl mt-1 max-h-60 overflow-y-auto z-[70]">
                      {searchSuggestions.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleSuggestionClick(product.id)}
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

            {/* Cart and Mobile Menu Button */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Cart Button */}
              <Link href="/cart" onClick={closeMobileMenu}>
                <Button
                  variant="outline"
                  className="relative bg-transparent hover:bg-red-50 hover:border-red-300 transition-all duration-200 p-2 sm:px-4"
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-600 hover:bg-red-700">
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
                className="lg:hidden hover:bg-red-50 transition-colors duration-200 z-10"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-16 left-0 right-0 bg-white shadow-xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ maxHeight: "calc(100vh - 4rem)" }}
      >
        <div className="container mx-auto px-4 py-6 space-y-6 overflow-y-auto max-h-full">
          {/* Mobile Search */}
          <div className="relative" ref={mobileSearchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input
                type="search"
                placeholder="Search for meat, fish..."
                className="pl-10 pr-4 h-12 text-base focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => handleSearchFocus("mobile")}
              />

              {/* Mobile Search Suggestions */}
              {showSuggestions &&
                searchSuggestions.length > 0 &&
                activeSearchInput === "mobile" && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-xl mt-1 max-h-48 overflow-y-auto z-[70]">
                    {searchSuggestions.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSuggestionClick(product.id)}
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
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Categories
            </h3>
            <div className="space-y-3">
              <Link
                href="/category/meat"
                className="flex items-center space-x-3 text-gray-700 hover:text-red-600 py-3 px-4 rounded-lg hover:bg-red-50 transition-all duration-200 font-medium"
                onClick={closeMobileMenu}
              >
                <span className="text-2xl">🥩</span>
                <div>
                  <div className="font-semibold">Fresh Meat</div>
                  <div className="text-sm text-gray-500">
                    Chicken, Mutton, Beef & more
                  </div>
                </div>
              </Link>
              <Link
                href="/category/fish"
                className="flex items-center space-x-3 text-gray-700 hover:text-red-600 py-3 px-4 rounded-lg hover:bg-red-50 transition-all duration-200 font-medium"
                onClick={closeMobileMenu}
              >
                <span className="text-2xl">🐟</span>
                <div>
                  <div className="font-semibold">Fresh Fish</div>
                  <div className="text-sm text-gray-500">
                    Rohu, Katla, Prawns & more
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile Quick Links */}
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/"
                className="block text-gray-700 hover:text-red-600 py-2 px-4 rounded-lg hover:bg-red-50 transition-all duration-200"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                href="/cart"
                className="block text-gray-700 hover:text-red-600 py-2 px-4 rounded-lg hover:bg-red-50 transition-all duration-200"
                onClick={closeMobileMenu}
              >
                Cart ({getTotalItems()} items)
              </Link>
            </div>
          </div>

          {/* Mobile Contact Info */}
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Us</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>📞 +91 98765 43210</p>
              <p>📧 support@freshmart.com</p>
              <p>🕒 Mon-Sun: 6 AM - 10 PM</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
