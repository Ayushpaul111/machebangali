"use client";

import type React from "react";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCart, type CartItem } from "../context/CartContext";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  total: number;
}

export default function OrderForm({
  isOpen,
  onClose,
  cartItems,
  total,
}: OrderFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryTime: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCart();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Basic phone number validation
    if (!/^\+?\d{10,15}$/.test(formData.phone)) {
      setError("Please enter a valid phone number (10-15 digits).");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Cart items:", cartItems);

      const orderData = {
        customerInfo: {
          name: formData.name,
          phone: formData.phone,
          tableNumber: formData.address,
          deliveryTime: formData.deliveryTime || "ASAP",
          notes: formData.notes,
        },
        items: cartItems.map((item) => ({
          name: item.name,
          weight: item.weight || "N/A",
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.price * item.quantity,
        })),
        total: total,
      };

      console.log("Order data being sent:", orderData);

      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      const fireConfetti = () => {
        confetti({
          particleCount: 300,
          spread: 90,
          origin: { x: 1, y: 0.9 },
        });

        confetti({
          particleCount: 300,
          spread: 90,
          origin: { x: 0, y: 0.9 },
        });
      };

      if (result.success) {
        // Generate order ID and create order data for success page
        const orderId = `ORD${Date.now()}`;
        const deliveryCharge = 10;
        const subtotal = total - deliveryCharge;

        const successOrderData = {
          id: orderId,
          items: cartItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            weight: item.weight || "N/A",
            price: item.price,
          })),
          customer: {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            deliveryTime: formData.deliveryTime || "ASAP",
            notes: formData.notes,
          },
          total: total,
          deliveryCharge: deliveryCharge,
          subtotal: subtotal,
          orderDate: new Date().toISOString(),
          status: "confirmed",
        };

        // Save to localStorage with expiry (1 hour)
        const orderWithExpiry = {
          data: successOrderData,
          expiry: Date.now() + 60 * 60 * 1000, // 1 hour from now
        };

        localStorage.setItem("lastOrder", JSON.stringify(orderWithExpiry));

        clearCart();
        router.push("/order-success");
        fireConfetti();
        onClose();
      } else {
        setError(`Order failed: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      setError("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null); // Clear error on input change
  };

  // Dynamic time slots based on current time
  const generateTimeSlots = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInHours = currentHour + currentMinutes / 60;

    const baseSlots = [
      { start: 9, end: 11, label: "9:00 AM - 11:00 AM" },
      { start: 11, end: 13, label: "11:00 AM - 1:00 PM" },
      { start: 13, end: 15, label: "1:00 PM - 3:00 PM" },
      { start: 15, end: 17, label: "3:00 PM - 5:00 PM" },
      { start: 17, end: 19, label: "5:00 PM - 7:00 PM" },
      { start: 19, end: 21, label: "7:00 PM - 9:00 PM" },
    ];

    const todaySlots = baseSlots
      .filter((slot) => slot.start > currentTimeInHours + 0.5)
      .map((slot) => ({
        value: `Today ${slot.label}`,
        label: slot.label,
      }));

    const tomorrowSlots = baseSlots.map((slot) => ({
      value: `Tomorrow ${slot.label}`,
      label: slot.label,
    }));

    return { todaySlots, tomorrowSlots };
  };

  const { todaySlots, tomorrowSlots } = useMemo(generateTimeSlots, []);

  // Set default delivery time to the first available slot
  useEffect(() => {
    if (formData.deliveryTime) return;
    const firstAvailableSlot =
      todaySlots[0]?.value || tomorrowSlots[0]?.value || "";
    if (firstAvailableSlot) {
      setFormData((prev) => ({ ...prev, deliveryTime: firstAvailableSlot }));
    } else {
      setError("No delivery time slots available. Please try again later.");
    }
  }, [todaySlots, tomorrowSlots, formData.deliveryTime]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <style jsx global>{`
        /* Custom Scrollbar for WebKit browsers */
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #1a1a1a; /* Gray theme */
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #1a1a1a;
        }
        /* Firefox scrollbar */
        .custom-scroll {
          scrollbar-width: thin;
          scrollbar-color: #1a1a1a #f1f1f1;
        }
      `}</style>
      <DialogContent className="w-[90vw] max-w-[400px] sm:max-w-[500px] lg:max-w-[600px] min-h-[400px] max-h-[80vh] overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 rounded-2xl mx-auto custom-scroll">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Order Details</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="10-digit phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter your complete delivery address"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryTime">Preferred Delivery Time</Label>
            <Select
              value={formData.deliveryTime}
              onValueChange={(value) =>
                handleInputChange("deliveryTime", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select delivery time" />
              </SelectTrigger>
              <SelectContent>
                {todaySlots.length > 0 && (
                  <SelectGroup>
                    <SelectLabel>Today</SelectLabel>
                    {todaySlots.map((slot) => (
                      <SelectItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
                <SelectGroup>
                  <SelectLabel>Tomorrow</SelectLabel>
                  {tomorrowSlots.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Special Instructions (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any special requests or notes"
              rows={2}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{(total - 10).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>₹10.00</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-1">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
