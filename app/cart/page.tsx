"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "../context/CartContext"
import { Trash2, Plus, Minus } from "lucide-react"
import Link from "next/link"
import OrderForm from "../components/OrderForm"

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart()
  const [showOrderForm, setShowOrderForm] = useState(false)

  const deliveryCharge = 10
  const subtotal = getTotalPrice()
  const total = subtotal + deliveryCharge

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <div className="text-6xl sm:text-8xl mb-4">🛒</div>
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">Add some delicious items to get started!</p>
          <Link href="/">
            <Button className="bg-red-600 hover:bg-red-700 transition-all duration-200 hover:shadow-lg transform hover:scale-105">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 animate-in fade-in-0 slide-in-from-top-4 duration-700">
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <Card
                key={item.id}
                className="animate-in fade-in-0 slide-in-from-left-4 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base truncate">{item.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Weight: {item.weight}</p>
                      <p className="text-base sm:text-lg font-bold text-red-600">₹{item.price}</p>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-red-50 hover:border-red-300 transition-colors duration-200"
                      >
                        <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <span className="w-6 sm:w-8 text-center text-sm sm:text-base font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-red-50 hover:border-red-300 transition-colors duration-200"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-sm sm:text-base">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 mt-1"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card
              className="animate-in fade-in-0 slide-in-from-right-4 duration-700"
              style={{ animationDelay: "300ms" }}
            >
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Delivery Charge:</span>
                  <span>₹{deliveryCharge.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-base sm:text-lg">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                <Button
                  className="w-full bg-red-600 hover:bg-red-700 h-11 sm:h-12 text-sm sm:text-base font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
                  size="lg"
                  onClick={() => setShowOrderForm(true)}
                >
                  Order Now
                </Button>

                <Link href="/">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent h-11 sm:h-12 text-sm sm:text-base hover:bg-red-50 hover:border-red-300 transition-colors duration-200"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showOrderForm && (
        <OrderForm isOpen={showOrderForm} onClose={() => setShowOrderForm(false)} cartItems={items} total={total} />
      )}
    </div>
  )
}
