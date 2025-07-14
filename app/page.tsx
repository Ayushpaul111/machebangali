import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    id: "meat",
    name: "Fresh Meat",
    image: "/placeholder.png",
    description: "Premium quality fresh meat",
    subcategories: ["Chicken", "Mutton", "Beef", "Pork"],
  },
  {
    id: "fish",
    name: "Fresh Fish",
    image: "/placeholder.png",
    description: "Fresh catch of the day",
    subcategories: ["Rohu", "Katla", "Prawns", "Salmon"],
  },
]

const featuredProducts = [
  {
    id: "chicken-breast",
    name: "Chicken Breast",
    category: "meat",
    image: "/placeholder.png",
    price: 180,
    unit: "250g",
  },
  {
    id: "rohu-fish",
    name: "Rohu Fish",
    category: "fish",
    image: "/placeholder.png",
    price: 120,
    unit: "250g",
  },
  {
    id: "mutton-curry-cut",
    name: "Mutton Curry Cut",
    category: "meat",
    image: "/placeholder.png",
    price: 450,
    unit: "250g",
  },
  {
    id: "prawns-medium",
    name: "Medium Prawns",
    category: "fish",
    image: "/placeholder.png",
    price: 280,
    unit: "250g",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-in fade-in-0 slide-in-from-top-4 duration-700">
            Fresh Meat & Fish
          </h1>
          <p
            className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 animate-in fade-in-0 slide-in-from-top-4 duration-700"
            style={{ animationDelay: "200ms" }}
          >
            Premium quality delivered to your doorstep
          </p>
          <Button
            size="lg"
            className="bg-white text-red-600 hover:bg-gray-100 px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105 animate-in fade-in-0 slide-in-from-top-4 duration-700"
            style={{ animationDelay: "400ms" }}
          >
            Shop Now
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            Shop by Category
          </h2>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {categories.map((category, index) => (
              <Link key={category.id} href={`/category/${category.id}`}>
                <Card
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative h-48 sm:h-56 md:h-64">
                    <Image
                      src={category.image || "/placeholder.png"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="text-center text-white transform group-hover:scale-105 transition-transform duration-300">
                        <h3 className="text-xl sm:text-2xl font-bold mb-2">{category.name}</h3>
                        <p className="text-base sm:text-lg">{category.description}</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.map((sub) => (
                        <span
                          key={sub}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs sm:text-sm hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product, index) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group h-full animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative h-40 sm:h-48">
                    <Image
                      src={product.image || "/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <h3 className="font-semibold mb-2 text-sm sm:text-base group-hover:text-red-600 transition-colors duration-200">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-base sm:text-lg font-bold text-red-600">₹{product.price}</span>
                      <span className="text-xs sm:text-sm text-gray-500">per {product.unit}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: "🥩",
                title: "Fresh Quality",
                description: "Hand-picked fresh meat and fish delivered daily",
              },
              {
                icon: "🚚",
                title: "Fast Delivery",
                description: "Same day delivery with proper cold chain maintenance",
              },
              {
                icon: "💰",
                title: "Best Prices",
                description: "Competitive prices with no compromise on quality",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center group animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-700 transition-colors duration-300 transform group-hover:scale-110">
                  <span className="text-white text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-red-600 transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
