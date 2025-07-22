"use client";

import React, { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { Product } from "@/types/product";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const unwrappedParams = use(params);
  const { getProductsByCategory, getSubcategories, loading, error } =
    useProducts();

  // Validate category
  if (
    unwrappedParams.category !== "meat" &&
    unwrappedParams.category !== "fish"
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Invalid Category
          </h1>
          <p className="text-gray-600 mb-6">
            The category "{unwrappedParams.category}" was not found.
          </p>
          <Link href="/" className="text-red-600 hover:text-red-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const categoryProducts = getProductsByCategory(
    unwrappedParams.category as "meat" | "fish"
  );
  const categoryName =
    unwrappedParams.category === "meat" ? "Fresh Meat" : "Fresh Fish";

  // Group products by subcategory
  const groupedProducts = categoryProducts.reduce((acc, product) => {
    if (!acc[product.subcategory]) {
      acc[product.subcategory] = [];
    }
    acc[product.subcategory].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          {/* <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-red-600" /> */}
          <img
            src="./macheBangali.webp"
            alt="Mache Bangali"
            className="h-20 w-20 animate-pulse mx-auto mb-4"
          />
          <p className="text-gray-600">Loading {categoryName}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load products: {error}</p>
          <Link href="/" className="text-red-600 hover:text-red-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <div className="flex items-center mb-4 sm:mb-6">
            <Link href="/">
              <button className="flex items-center hover:bg-red-50 transition-colors duration-200 px-2 py-1 rounded-md text-sm sm:text-base">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </button>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 animate-in fade-in-0 slide-in-from-top-4 duration-700">
            {categoryName}
          </h1>
          <p
            className="text-gray-600 text-sm sm:text-base animate-in fade-in-0 slide-in-from-top-4 duration-700"
            style={{ animationDelay: "200ms" }}
          >
            Choose from our premium selection of {unwrappedParams.category} (
            {categoryProducts.length} products)
          </p>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No products available
            </h3>
            <p className="text-gray-500">
              We're currently updating our {categoryName.toLowerCase()}{" "}
              selection. Please check back soon!
            </p>
          </div>
        ) : (
          Object.entries(groupedProducts).map(
            ([subcategory, products], groupIndex) => (
              <div key={subcategory} className="mb-8 sm:mb-12">
                <h2
                  className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 animate-in fade-in-0 slide-in-from-left-4 duration-700"
                  style={{ animationDelay: `${groupIndex * 200}ms` }}
                >
                  <span>{subcategory}</span>
                  <Badge variant="secondary" className="w-fit">
                    {products.length} item{products.length !== 1 ? "s" : ""}
                  </Badge>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {products.map((product, index) => (
                    <Link key={product.id} href={`/product/${product.id}`}>
                      <Card
                        className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full group animate-in fade-in-0 slide-in-from-bottom-4"
                        style={{
                          animationDelay: `${groupIndex * 200 + index * 100}ms`,
                        }}
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
                          {product.rating > 0 && (
                            <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">
                              ★ {product.rating}
                            </Badge>
                          )}
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
                          {product.features.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {product.features
                                .slice(0, 2)
                                .map((feature, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {feature}
                                  </Badge>
                                ))}
                              {product.features.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{product.features.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}
