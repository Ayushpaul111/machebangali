"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import OrderForm from "../components/OrderForm";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);

  const deliveryCharge = 10;
  const subtotal = getTotalPrice();
  const total = subtotal + deliveryCharge;

  if (items.length === 0) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center animate-in fade-in-50 zoom-in-95 duration-1000 w-full max-w-md">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-6 sm:h-20 sm:w-20" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-gray-500 mb-8 text-base sm:text-lg">
            Explore our delicious items and start adding to your cart!
          </p>
          <Link href="/">
            <Button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">
      <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6 sm:mb-8 lg:mb-12 animate-in fade-in-50 slide-in-from-top-3 duration-1000">
            Your Shopping Cart
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-4 sm:space-y-6">
              {items.map((item, index) => (
                <Card
                  key={item.id}
                  className="overflow-hidden border-none shadow-lg rounded-2xl bg-white animate-in fade-in-50 slide-in-from-left-3 duration-1000 w-full"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <div className="flex flex-row sm:flex-row items-center sm:items-center gap-0 sm:gap-4 lg:gap-6">
                      {/* Mobile: Image and Details take 2/3, Controls take 1/3 */}
                      <div className="flex items-center gap-3 w-full sm:flex-1 sm:w-auto ">
                        <div className="relative w-24 h-24 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-gray-100">
                          <Image
                            src={item.image || "./placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105 "
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 ">
                            {item.name}
                          </h3>
                          <p className="text-sm sm:text-md font-bold text-gray-800 mt-1">
                            ₹{item.price.toFixed(2)}{" "}
                            <span className="text-gray-500 text-xs sm:text-sm">
                              Per
                            </span>
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Weight: {item.weight}
                          </p>
                        </div>
                      </div>

                      {/* Mobile: Stack total, controls, and delete vertically on right */}
                      <div className="flex flex-col items-end gap-2 w-full max-w-[33%] sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-3 lg:gap-4 sm:justify-end">
                        {/* Item Total - First on mobile */}
                        <div className="text-right flex-shrink-0 order-1 sm:order-3">
                          <p className="text-lg sm:text-lg font-semibold text-blue-500">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls - Second on mobile */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-full px-1.5 py-0.5 sm:px-2 sm:py-1 order-2 sm:order-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="h-6 w-6 sm:h-8 sm:w-8 hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                          >
                            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <span className="w-5 sm:w-8 text-center text-xs sm:text-base font-medium text-gray-800">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="h-6 w-6 sm:h-8 sm:w-8 hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                          >
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>

                        {/* Delete Button - Third on mobile */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="h-7 w-7 sm:h-8 sm:w-8 text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 order-3 sm:order-2"
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
            <div className="lg:col-span-4 w-full">
              <Card
                className="border-none shadow-lg rounded-2xl bg-white lg:sticky lg:top-24 animate-in fade-in-50 slide-in-from-right-3 duration-1000 w-full"
                style={{ animationDelay: "400ms" }}
              >
                <CardHeader className="border-b border-gray-100 pb-4">
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-800">
                        ₹{subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Delivery Charge</span>
                      <span className="font-medium text-gray-800">
                        ₹{deliveryCharge.toFixed(2)}
                      </span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between items-center">
                      <span className="text-base sm:text-lg font-semibold text-gray-800">
                        Total
                      </span>
                      <span className="text-base sm:text-lg font-bold text-red-500">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-full text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    onClick={() => setShowOrderForm(true)}
                  >
                    Proceed to Checkout
                  </Button>

                  <Link href="/">
                    <Button
                      variant="outline"
                      className="w-full mt-2 border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 py-3 rounded-full text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300"
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {showOrderForm && (
        <OrderForm
          isOpen={showOrderForm}
          onClose={() => setShowOrderForm(false)}
          cartItems={items}
          total={total}
        />
      )}
    </div>
  );
}
