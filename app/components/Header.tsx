"use client"

import type React from "react"
import Link from "next/link"
import { Search, ShoppingCart, Menu, X, Home, Phone, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCart } from "../context/CartContext"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"

// Sample product data for search
const allProducts = [
  { id: "chicken-breast", name: "Chicken Breast", category: "meat", subcategory: "Chicken" },
  { id: "chicken-thigh", name: "Chicken Thigh", category: "meat", subcategory: "Chicken" },
  { id: "mutton-curry-cut", name: "Mutton Curry Cut", category: "meat", subcategory: "Mutton" },
  { id: "mutton-chops", name: "Mutton Chops", category: "meat", subcategory: "Mutton" },
  { id: "beef-steak", name: "Beef Steak", category: "meat", subcategory: "Beef" },
  { id: "pork-chops", name: "Pork Chops", category: "meat", subcategory: "Pork" },
  { id: "rohu-fish", name: "Rohu Fish", category: "fish", subcategory: "Rohu" },
  { id: "katla-fish", name: "Katla Fish", category: "fish", subcategory: "Katla" },
  { id: "prawns-medium", name: "Medium Prawns", category: "fish", subcategory: "Prawns" },
  { id: "prawns-large", name: "Large Prawns", category: "fish", subcategory: "Prawns" },
  { id: "salmon-fillet", name: "Salmon Fillet", category: "fish", subcategory: "Salmon" },
]

export default function Header() {
  const { items, getTotalItems, getTotalPrice } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchSuggestions, setSearchSuggestions] = useState<typeof allProducts>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSearchInput, setActiveSearchInput] = useState<"desktop" | "mobile" | null>(null)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const desktopSearchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Handle search suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.subcategory.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchSuggestions(filtered.slice(0, 6))
      if (isSearchFocused) {
        setShowSuggestions(true)
      }
    } else {
      setSearchSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchQuery, isSearchFocused])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setShowSuggestions(false)
    setSearchQuery("")
    setActiveSearchInput(null)
    setIsSearchFocused(false)
  }, [pathname])

  // Handle click outside
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as Node

      // Close search suggestions
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(target)
      ) {
        setShowSuggestions(false)
        setActiveSearchInput(null)
        setIsSearchFocused(false)
      }

      // Close mobile menu if clicking outside
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target) && isMobileMenuOpen) {
        const headerElement = document.querySelector("header")
        if (headerElement && !headerElement.contains(target)) {
          setIsMobileMenuOpen(false)
        }
      }
    },
    [isMobileMenuOpen],
  )

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [handleClickOutside])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
      document.body.style.paddingRight = "0px" // Prevent layout shift
    } else {
      document.body.style.overflow = "unset"
      document.body.style.paddingRight = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
      document.body.style.paddingRight = "unset"
    }
  }, [isMobileMenuOpen])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      resetSearchState()
    }
  }

  const handleSuggestionClick = (productId: string) => {
    router.push(`/product/${productId}`)
    resetSearchState()
  }

  const resetSearchState = () => {
    setShowSuggestions(false)
    setSearchQuery("")
    setActiveSearchInput(null)
    setIsSearchFocused(false)
    setIsMobileMenuOpen(false)
  }

  const handleSearchFocus = (inputType: "desktop" | "mobile") => {
    setActiveSearchInput(inputType)
    setIsSearchFocused(true)
    if (searchQuery.trim()) {
      setShowSuggestions(true)
    }
  }

  const handleSearchBlur = () => {
    // Delay to allow suggestion clicks to register
    setTimeout(() => {
      setIsSearchFocused(false)
      if (!searchQuery.trim()) {
        setShowSuggestions(false)
      }
    }, 150)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    if (!isMobileMenuOpen) {
      // Reset search when opening menu
      setShowSuggestions(false)
      setActiveSearchInput(null)
      setIsSearchFocused(false)
    }
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    resetSearchState()
  }

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600 hover:text-red-700 transition-colors duration-200 flex-shrink-0"
              onClick={closeMobileMenu}
            >
              FreshMart
            </Link>

            {/* Desktop Search Bar */}
            <div
              className="hidden md:flex flex-1 max-w-sm lg:max-w-md xl:max-w-lg mx-4 lg:mx-6 xl:mx-8 relative"
              ref={desktopSearchRef}
            >
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                <Input
                  type="search"
                  placeholder="Search for meat, fish..."
                  className="pl-10 pr-4 h-9 lg:h-10 text-sm lg:text-base focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 border-gray-200 hover:bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => handleSearchFocus("desktop")}
                  onBlur={handleSearchBlur}
                />

                {/* Desktop Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && activeSearchInput === "desktop" && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-64 overflow-y-auto z-[70] animate-in slide-in-from-top-2 duration-200">
                    {searchSuggestions.map((product, index) => (
                      <div
                        key={product.id}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          handleSuggestionClick(product.id)
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 cursor-pointer select-none"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="font-medium text-gray-900 text-sm lg:text-base">{product.name}</div>
                        <div className="text-xs lg:text-sm text-gray-500">
                          {product.subcategory} • {product.category}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <Link
                href="/category/meat"
                className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group text-sm xl:text-base"
              >
                Meat
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link
                href="/category/fish"
                className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group text-sm xl:text-base"
              >
                Fish
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Cart and Mobile Menu Button */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
              {/* Cart Button */}
              <Link href="/cart" onClick={closeMobileMenu}>
                <Button
                  variant="outline"
                  size="sm"
                  className="relative bg-transparent hover:bg-red-50 hover:border-red-300 transition-all duration-200 p-1.5 sm:p-2 lg:px-3 lg:py-2 border-gray-200"
                >
                  <ShoppingCart className="h-4 w-4 lg:h-5 lg:w-5" />
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-600 hover:bg-red-700 animate-pulse">
                      {getTotalItems()}
                    </Badge>
                  )}
                  <span className="hidden sm:inline ml-1 lg:ml-2 font-medium text-xs lg:text-sm">
                    ₹{getTotalPrice().toFixed(0)}
                  </span>
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden hover:bg-red-50 transition-colors duration-200 p-1.5 sm:p-2"
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-in fade-in-0 duration-200"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-14 sm:top-16 left-0 right-0 bg-white shadow-2xl z-50 lg:hidden transform transition-all duration-300 ease-out ${
          isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
        style={{
          maxHeight: "calc(100vh - 3.5rem)",
          minHeight: "auto",
        }}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-full">
          {/* Mobile Search */}
          <div className="relative" ref={mobileSearchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input
                type="search"
                placeholder="Search for meat, fish..."
                className="pl-10 pr-4 h-11 sm:h-12 text-base focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => handleSearchFocus("mobile")}
                onBlur={handleSearchBlur}
              />

              {/* Mobile Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && activeSearchInput === "mobile" && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-48 overflow-y-auto z-[70] animate-in slide-in-from-top-2 duration-200">
                  {searchSuggestions.map((product, index) => (
                    <div
                      key={product.id}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        handleSuggestionClick(product.id)
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 cursor-pointer select-none"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="font-medium text-gray-900">{product.name}</div>
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
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Categories
            </h3>
            <div className="space-y-2">
              <Link
                href="/category/meat"
                className="flex items-center space-x-3 text-gray-700 hover:text-red-600 py-3 px-3 sm:px-4 rounded-lg hover:bg-red-50 transition-all duration-200 font-medium group"
                onClick={closeMobileMenu}
              >
                <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-200">🥩</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm sm:text-base">Fresh Meat</div>
                  <div className="text-xs sm:text-sm text-gray-500">Chicken, Mutton, Beef & more</div>
                </div>
              </Link>
              <Link
                href="/category/fish"
                className="flex items-center space-x-3 text-gray-700 hover:text-red-600 py-3 px-3 sm:px-4 rounded-lg hover:bg-red-50 transition-all duration-200 font-medium group"
                onClick={closeMobileMenu}
              >
                <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-200">🐟</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm sm:text-base">Fresh Fish</div>
                  <div className="text-xs sm:text-sm text-gray-500">Rohu, Katla, Prawns & more</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile Quick Links */}
          <div className="space-y-3 sm:space-y-4 border-t border-gray-200 pt-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Quick Links</h3>
            <div className="space-y-1">
              <Link
                href="/"
                className="flex items-center space-x-3 text-gray-700 hover:text-red-600 py-2 px-3 sm:px-4 rounded-lg hover:bg-red-50 transition-all duration-200"
                onClick={closeMobileMenu}
              >
                <Home className="h-4 w-4" />
                <span className="text-sm sm:text-base">Home</span>
              </Link>
              <Link
                href="/cart"
                className="flex items-center justify-between text-gray-700 hover:text-red-600 py-2 px-3 sm:px-4 rounded-lg hover:bg-red-50 transition-all duration-200"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-sm sm:text-base">Shopping Cart</span>
                </div>
                {getTotalItems() > 0 && (
                  <Badge className="bg-red-600 text-white text-xs">{getTotalItems()} items</Badge>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Contact Info */}
          <div className="space-y-3 sm:space-y-4 border-t border-gray-200 pt-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Contact Us</h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>support@freshmart.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Mon-Sun: 6 AM - 10 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
