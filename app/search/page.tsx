"use client"

import type React from "react"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Sample product data - in a real app, this would come from an API
const allProducts = [
  {
    id: "chicken-breast",
    name: "Chicken Breast",
    image: "/placeholder.png",
    price: 180,
    description: "Tender and juicy chicken breast, perfect for grilling",
    subcategory: "Chicken",
    category: "meat",
  },
  {
    id: "chicken-thigh",
    name: "Chicken Thigh",
    image: "/placeholder.png",
    price: 160,
    description: "Flavorful chicken thigh with bone",
    subcategory: "Chicken",
    category: "meat",
  },
  {
    id: "mutton-curry-cut",
    name: "Mutton Curry Cut",
    image: "/placeholder.png",
    price: 450,
    description: "Fresh mutton cut perfect for curries",
    subcategory: "Mutton",
    category: "meat",
  },
  {
    id: "mutton-chops",
    name: "Mutton Chops",
    image: "/placeholder.png",
    price: 480,
    description: "Premium mutton chops for special occasions",
    subcategory: "Mutton",
    category: "meat",
  },
  {
    id: "beef-steak",
    name: "Beef Steak",
    image: "/placeholder.png",
    price: 380,
    description: "Premium beef steak cuts",
    subcategory: "Beef",
    category: "meat",
  },
  {
    id: "pork-chops",
    name: "Pork Chops",
    image: "/placeholder.png",
    price: 320,
    description: "Fresh pork chops",
    subcategory: "Pork",
    category: "meat",
  },
  {
    id: "rohu-fish",
    name: "Rohu Fish",
    image: "/placeholder.png",
    price: 120,
    description: "Fresh water rohu fish, cleaned and cut",
    subcategory: "Rohu",
    category: "fish",
  },
  {
    id: "katla-fish",
    name: "Katla Fish",
    image: "/placeholder.png",
    price: 140,
    description: "Fresh katla fish pieces",
    subcategory: "Katla",
    category: "fish",
  },
  {
    id: "prawns-medium",
    name: "Medium Prawns",
    image: "/placeholder.png",
    price: 280,
    description: "Fresh medium-sized prawns",
    subcategory: "Prawns",
    category: "fish",
  },
  {
    id: "prawns-large",
    name: "Large Prawns",
    image: "/placeholder.png",
    price: 350,
    description: "Premium large prawns",
    subcategory: "Prawns",
    category: "fish",
  },
  {
    id: "salmon-fillet",
    name: "Salmon Fillet",
    image: "/placeholder.png",
    price: 450,
    description: "Fresh salmon fillet",
    subcategory: "Salmon",
    category: "fish",
  },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchResults, setSearchResults] = useState<typeof allProducts>([])
  const [currentQuery, setCurrentQuery] = useState(query)

  useEffect(() => {
    if (query) {
      const filtered = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.subcategory.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()),
      )
      setSearchResults(filtered)
    }
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(currentQuery.trim())}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Search Header */}
        <div className="mb-6 sm:mb-8">
          <form onSubmit={handleSearch} className="relative max-w-md mx-auto mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for meat, fish..."
              className="pl-10 pr-4 h-12 text-base focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
            />
          </form>

          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Search Results</h1>
            {query && (
              <p className="text-gray-600">
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} found for "{query}"
              </p>
            )}
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {searchResults.map((product, index) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full group animate-in fade-in-0 slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-48 sm:h-52 overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-700">{product.subcategory}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 text-sm sm:text-base group-hover:text-red-600 transition-colors duration-200">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-red-600">₹{product.price}</span>
                      <span className="text-xs sm:text-sm text-gray-500">per 250g</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">No results found</h2>
            <p className="text-gray-600 mb-6">Try searching with different keywords</p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Popular searches:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Chicken", "Fish", "Mutton", "Prawns"].map((term) => (
                  <Link key={term} href={`/search?q=${term}`}>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-red-50 hover:border-red-300 transition-colors duration-200"
                    >
                      {term}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">Start your search</h2>
            <p className="text-gray-600">Find fresh meat and fish products</p>
          </div>
        )}
      </div>
    </div>
  )
}
