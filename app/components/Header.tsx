"use client";

import type React from "react";
import Link from "next/link";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";

export default function Header() {
  const { items, getTotalItems, getTotalPrice } = useCart();
  const { searchProducts, loading } = useProducts();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle search suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 0 && !loading) {
      const results = searchProducts(searchQuery).slice(0, 5);
      setSearchSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, searchProducts, loading]);

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e?: React.MouseEvent | React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (productId: string) => {
    setShowSuggestions(false);
    setSearchQuery("");
    router.push(`/product/${productId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center ">
              <div className="text-xl lg:text-2xl font-bold text-red-600 flex items-center space-x-2">
                <img
                  src="/macheBangali.webp"
                  alt="Mache Bangali"
                  className="h-10 w-10"
                />
                <div>
                  মাছে&nbsp;<span className="text-gray-800">বাঙ্গালী</span>
                </div>
              </div>
            </Link>

            {/* Desktop Search */}
            <div
              className="hidden lg:flex flex-1 max-w-md mx-8 relative"
              ref={searchRef}
            >
              <form
                onSubmit={handleSearch}
                className="w-full relative flex items-center group"
              >
                <Input
                  type="search"
                  placeholder="Search for meat, fish..."
                  className="pl-12 pr-4 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 rounded-full shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-1 h-9 w-9 rounded-full hover:bg-red-100 transition-all duration-200 group-focus-within:bg-red-100"
                  onClick={handleSearch}
                  aria-label="Search"
                >
                  <Search className="h-4 w-4 text-gray-500 group-hover:text-red-600 transition-colors duration-200" />
                </Button>

                {/* Desktop Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl mt-2 max-h-60 overflow-y-auto z-[70] animate-in slide-in-from-top-2 duration-200">
                    {searchSuggestions.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSuggestionClick(product.id)}
                        className="px-4 py-3 hover:bg-red-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 cursor-pointer"
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
                className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200"
              >
                Fresh Meat
              </Link>
              <Link
                href="/category/fish"
                className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200"
              >
                Fresh Fish
              </Link>
            </nav>

            {/* Cart and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Link href="/cart">
                <Button
                  variant="outline"
                  size="sm"
                  className="relative hover:bg-red-50 hover:border-red-200 transition-all duration-200"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-600 text-white text-xs">
                      {getTotalItems()}
                    </Badge>
                  )}
                  <span className="hidden sm:inline ml-2">
                    ₹{getTotalPrice().toFixed(0)}
                  </span>
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
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
      <div
        className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      />

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="sm" onClick={closeMenu}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto max-h-full">
          {/* Mobile Search */}
          <div className="relative" ref={searchRef}>
            <form
              onSubmit={handleSearch}
              className="relative flex items-center group"
            >
              <Input
                type="search"
                placeholder="Search for meat, fish..."
                className="pl-12 pr-4 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 rounded-full shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-1 h-10 w-10 rounded-full hover:bg-red-100 transition-all duration-200 group-focus-within:bg-red-100;"
                onClick={handleSearch}
                aria-label="Search"
              >
                <Search className="h-4 w-4 text-gray-500 group-hover:text-red-600 transition-colors duration-200" />
              </Button>

              {/* Mobile Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl mt-2 max-h-48 overflow-y-auto z-[70] animate-in slide-in-from-top-2 duration-200">
                  {searchSuggestions.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSuggestionClick(product.id)}
                      className="px-4 py-3 hover:bg-red-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 cursor-pointer"
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

          {/* Mobile Cart Summary */}
          {getTotalItems() > 0 && (
            <div className="border-t pt-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-600">CartironoCart Total</p>
                    <p className="text-lg font-bold text-red-600">
                      ₹{getTotalPrice().toFixed(0)}
                    </p>
                  </div>
                  <Badge className="bg-red-600 text-white px-2 py-1">
                    {getTotalItems()} item{getTotalItems() > 1 ? "s" : ""}
                  </Badge>
                </div>

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

                <Link href="/cart" onClick={closeMenu}>
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    View Cart
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
