// app/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useProducts } from "./context/ProductContext";

// Static categories (only these two as you mentioned)
const categories = [
  {
    id: "meat",
    name: "Fresh Meat",
    image: "./fresh-meat.webp",
    description: "Premium quality fresh meat",
  },
  {
    id: "fish",
    name: "Fresh Fish",
    image: "./fresh-fish.webp",
    description: "Fresh catch of the day",
  },
];

export default function HomePage() {
  const { getFeaturedProducts, loading, error } = useProducts();

  const featuredProducts = getFeaturedProducts(4);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-red-600" />
          <p className="text-gray-600">Loading fresh products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load products: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-black py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        {/* Background Image */}
        <Image
          src="/hero.webp"
          alt="Fresh meat and fish"
          fill
          priority
          className="object-cover z-0"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

        {/* Content */}
        <div className="container mx-auto px-4 text-center relative z-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-in fade-in-0 slide-in-from-top-4 duration-700 text-gray-100">
            Fresh Meat & Fish
          </h1>

          <p
            className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 animate-in fade-in-0 slide-in-from-top-4 duration-700 text-gray-200"
            style={{ animationDelay: "200ms" }}
          >
            Premium quality delivered to your doorstep
          </p>
          <a href="#featured-products">
            <button
              className="bg-white text-gray-900 hover:bg-gray-200 text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3 animate-in fade-in-0 slide-in-from-top-4 duration-700 rounded"
              style={{ animationDelay: "400ms" }}
            >
              Shop Now
            </button>
          </a>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 animate-in fade-in-0 slide-in-from-top-4 duration-700">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {categories.map((category, index) => (
              <Link key={category.id} href={`/category/${category.id}`}>
                <Card
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group animate-in fade-in-0 slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                          {category.name}
                        </h3>
                        <p className="text-sm sm:text-base opacity-90">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section
        className="py-12 sm:py-16 lg:py-20 bg-white"
        id="featured-products"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 animate-in fade-in-0 slide-in-from-top-4 duration-700">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product, index) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group animate-in fade-in-0 slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-700">
                      {product.subcategory}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 text-sm sm:text-base group-hover:text-red-600 transition-colors duration-200">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-red-600">
                        ₹{product.price}
                      </span>
                      <span className="text-xs text-gray-500">
                        {product.unit}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8 sm:mt-12">
            <Button asChild>
              <Link href="/category/meat">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
