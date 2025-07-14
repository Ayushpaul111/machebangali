"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCart, type CartItem } from "../context/CartContext"
import { useRouter } from "next/navigation"

interface OrderFormProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  total: number
}

export default function OrderForm({ isOpen, onClose, cartItems, total }: OrderFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryTime: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { clearCart } = useCart()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create order data
    const orderData = {
      id: `ORD-${Date.now()}`,
      items: cartItems,
      customer: formData,
      total,
      deliveryCharge: 10,
      subtotal: total - 10,
      orderDate: new Date().toISOString(),
      status: "confirmed",
    }

    // Store order data in localStorage for the success page
    localStorage.setItem("lastOrder", JSON.stringify(orderData))

    // Clear cart and redirect
    clearCart()
    router.push("/order-success")
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const timeSlots = [
    "9:00 AM - 11:00 AM",
    "11:00 AM - 1:00 PM",
    "1:00 PM - 3:00 PM",
    "3:00 PM - 5:00 PM",
    "5:00 PM - 7:00 PM",
    "7:00 PM - 9:00 PM",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Order Details</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              className="mt-1 h-10 sm:h-11 text-sm sm:text-base"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
              className="mt-1 h-10 sm:h-11 text-sm sm:text-base"
            />
          </div>

          <div>
            <Label htmlFor="address" className="text-sm font-medium">
              Delivery Address *
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              rows={3}
              required
              className="mt-1 text-sm sm:text-base resize-none"
            />
          </div>

          <div>
            <Label htmlFor="deliveryTime" className="text-sm font-medium">
              Preferred Delivery Time *
            </Label>
            <Select value={formData.deliveryTime} onValueChange={(value) => handleInputChange("deliveryTime", value)}>
              <SelectTrigger className="mt-1 h-10 sm:h-11 text-sm sm:text-base">
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot} className="text-sm sm:text-base">
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes" className="text-sm font-medium">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={2}
              placeholder="Any special instructions..."
              className="mt-1 text-sm sm:text-base resize-none"
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2 text-sm sm:text-base">
              <span>Total Amount:</span>
              <span className="font-bold">₹{total.toFixed(2)}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Payment will be collected on delivery</p>
          </div>

          <div className="flex space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent h-10 sm:h-11 text-sm sm:text-base hover:bg-red-50 hover:border-red-300 transition-colors duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-red-600 hover:bg-red-700 h-10 sm:h-11 text-sm sm:text-base transition-all duration-200 hover:shadow-lg"
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
