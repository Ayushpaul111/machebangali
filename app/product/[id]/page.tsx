"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "../../context/CartContext"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Star, ShoppingCart, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Sample product data - in a real app, this would come from an API
const productData: Record<string, any> = {
  "chicken-breast": {
    id: "chicken-breast",
    name: "Chicken Breast",
    category: "meat",
    subcategory: "Chicken",
    image: "/placeholder.png",
    description:
      "Premium quality chicken breast, tender and juicy. Perfect for grilling, roasting, or pan-frying. Rich in protein and low in fat, making it an excellent choice for healthy meals.",
    basePrice: 180, // price per 250g
    rating: 4.5,
    reviews: 128,
    features: ["Antibiotic-free", "Farm fresh", "High protein", "Low fat content"],
  },
  "rohu-fish": {
    id: "rohu-fish",
    name: "Rohu Fish",
    category: "fish",
    subcategory: "Rohu",
    image: "/placeholder.png",
    description:
      "Fresh water rohu fish, cleaned and cut into pieces. Rich in omega-3 fatty acids and protein. Perfect for Bengali fish curry or fried preparations.",
    basePrice: 120,
    rating: 4.3,
    reviews: 89,
    features: ["Fresh water fish", "Rich in Omega-3", "Cleaned & cut", "Bone-in pieces"],
  },
  "mutton-curry-cut": {
    id: "mutton-curry-cut",
    name: "Mutton Curry Cut",
    category: "meat",
    subcategory: "Mutton",
    image: "/placeholder.png",
    description:
      "Fresh mutton cut into perfect pieces for curry preparation. Tender and flavorful meat from young goats. Ideal for traditional Indian curries and biryanis.",
    basePrice: 450,
    rating: 4.7,
    reviews: 156,
    features: ["Young goat meat", "Curry cut pieces", "Tender & flavorful", "Perfect for biryanis"],
  },
  "prawns-medium": {
    id: "prawns-medium",
    name: "Medium Prawns",
    category: "fish",
    subcategory: "Prawns",
    image: "/placeholder.png",
    description:
      "Fresh medium-sized prawns, cleaned and deveined. Sweet and succulent taste perfect for curries, fries, or grilled preparations.",
    basePrice: 280,
    rating: 4.4,
    reviews: 94,
    features: ["Cleaned & deveined", "Medium size", "Sweet taste", "Versatile cooking"],
  },
}

const weightOptions = [
  { value: "250g", label: "250g", multiplier: 1 },
  { value: "500g", label: "500g", multiplier: 2 },
  { value: "750g", label: "750g", multiplier: 3 },
  { value: "1kg", label: "1kg", multiplier: 4 },
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = productData[params.id]
  const [selectedWeight, setSelectedWeight] = useState("250g")
  const [quantity, setQuantity] = useState(1)
  const { addItem, items } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const selectedWeightOption = weightOptions.find((w) => w.value === selectedWeight)
  const currentPrice = product.basePrice * (selectedWeightOption?.multiplier || 1)

  // Find existing cart item with same product and weight
  const existingCartItem = items.find((item) => item.id.startsWith(product.id) && item.weight === selectedWeight)
  const existingQuantity = existingCartItem?.quantity || 0

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: currentPrice,
      quantity,
      weight: selectedWeight,
      image: product.image,
      category: product.category,
    })

    toast({
      title: "Added to Cart",
      description: `${quantity}x ${product.name} (${selectedWeight}) added to cart`,
    })
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-4 sm:mb-6">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back()
              } else {
                router.push(`/category/${product.category}`)
              }
            }}
            className="flex items-center hover:bg-red-50 transition-colors duration-200 px-2 py-1 rounded-md text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {product.category}
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-md">
              <Image
                src={product.image || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
              <Badge className="absolute top-4 left-4 bg-red-600 hover:bg-red-700">{product.subcategory}</Badge>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 animate-in fade-in-0 slide-in-from-right-4 duration-500">
                {product.name}
              </h1>

              {/* Rating */}
              <div
                className="flex items-center mb-4 animate-in fade-in-0 slide-in-from-right-4 duration-500"
                style={{ animationDelay: "100ms" }}
              >
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <p
                className="text-gray-600 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base animate-in fade-in-0 slide-in-from-right-4 duration-500"
                style={{ animationDelay: "200ms" }}
              >
                {product.description}
              </p>

              {/* Features */}
              <div
                className="mb-4 sm:mb-6 animate-in fade-in-0 slide-in-from-right-4 duration-500"
                style={{ animationDelay: "300ms" }}
              >
                <h3 className="font-semibold mb-3 text-sm sm:text-base">Key Features:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                      <span className="text-xs sm:text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Add to Cart */}
            <Card
              className="animate-in fade-in-0 slide-in-from-right-4 duration-500"
              style={{ animationDelay: "400ms" }}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-4 sm:mb-6">
                  ₹{currentPrice}
                  <span className="text-base sm:text-lg text-gray-500 font-normal ml-2">per {selectedWeight}</span>
                </div>

                {/* Existing Cart Info */}
                {existingQuantity > 0 && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center text-green-700">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">
                        {existingQuantity} item{existingQuantity > 1 ? "s" : ""} already in cart ({selectedWeight})
                      </span>
                    </div>
                  </div>
                )}

                {/* Weight Selection */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Weight:</label>
                    <Select value={selectedWeight} onValueChange={setSelectedWeight}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {weightOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label} - ₹{product.basePrice * option.multiplier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quantity Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity:</label>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="h-10 w-10 hover:bg-red-50 hover:border-red-300 transition-colors duration-200"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= 10}
                        className="h-10 w-10 hover:bg-red-50 hover:border-red-300 transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-red-600 hover:bg-red-700 h-12 text-base font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
                    size="lg"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart - ₹{currentPrice * quantity}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Info */}
            <Card
              className="animate-in fade-in-0 slide-in-from-right-4 duration-500"
              style={{ animationDelay: "500ms" }}
            >
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Delivery Information</h3>
                <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <p>• Same day delivery available</p>
                  <p>• Flat delivery charge: ₹10</p>
                  <p>• Cold chain maintained throughout</p>
                  <p>• Fresh guarantee or money back</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
