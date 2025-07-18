// app/search/page.tsx
"use client";

import type React from "react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { Product } from "@/types/product";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [currentQuery, setCurrentQuery] = useState(query);
  const { searchProducts, loading } = useProducts();

  useEffect(() => {
    if (query && !loading) {
      const results = searchProducts(query);
      setSearchResults(results);
    } else if (!query) {
      setSearchResults([]);
    }
  }, [query, searchProducts, loading]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(
        currentQuery.trim()
      )}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Back Button */}
        <div className="mb-6 sm:mb-8">
          <Link href="/">
            <button className="flex items-center hover:bg-red-50 transition-colors duration-200 px-2 py-1 rounded-md text-sm sm:text-base">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </button>
          </Link>
        </div>

        {/* Search Header */}
        <div className="mb-6 sm:mb-8">
          <form
            onSubmit={handleSearch}
            className="relative max-w-md mx-auto mb-4"
          >
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
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Search Results
            </h1>
            {query && (
              <p className="text-gray-600">
                {searchResults.length} result
                {searchResults.length !== 1 ? "s" : ""} found for "{query}"
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
                    <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-700">
                      {product.subcategory}
                    </Badge>
                    <Badge className="absolute top-2 right-2 bg-gray-800 text-white">
                      {product.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 text-sm sm:text-base group-hover:text-red-600 transition-colors duration-200">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-bold text-red-600">
                        ₹{product.price}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {product.unit}
                      </span>
                    </div>
                    {product.rating > 0 && (
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="text-yellow-500 mr-1">★</span>
                        {product.rating}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No results found
            </h3>
            <p className="text-gray-500 mb-6">
              We couldn't find any products matching "{query}". Try searching
              with different keywords.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Suggestions:</p>
              <ul className="space-y-1">
                <li>• Check your spelling</li>
                <li>• Use more general terms</li>
                <li>• Try searching for "chicken", "fish", or "meat"</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Search for products
            </h3>
            <p className="text-gray-500">
              Enter a search term above to find fresh meat and fish products.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
