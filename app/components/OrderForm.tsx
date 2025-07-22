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

      if (result.success) {
        clearCart();
        router.push("/order-success");
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
    const now = new Date(); // Use real-time date in production
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
      .filter((slot) => slot.start > currentTimeInHours + 0.5) // 30-minute buffer
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
    if (formData.deliveryTime) return; // Skip if already set
    const firstAvailableSlot =
      todaySlots[0]?.value || tomorrowSlots[0]?.value || "";
    if (firstAvailableSlot) {
      setFormData((prev) => ({ ...prev, deliveryTime: firstAvailableSlot }));
    } else {
      setError("No delivery time slots available. Please try again later.");
    }
  }, [todaySlots, tomorrowSlots]);

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
          <DialogTitle className="text-base sm:text-lg lg:text-xl font-semibold">
            Order Details
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          <div>
            <Label htmlFor="name" className="text-sm sm:text-base font-medium">
              Full Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              className="mt-1 h-9 m:h-10 lg:h-11 text-sm sm:text-base"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm sm:text-base font-medium">
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
              className="mt-1 h-9 sm:h-10 lg:h-11 text-sm sm:text-base"
            />
          </div>

          <div>
            <Label
              htmlFor="address"
              className="text-sm sm:text-base font-medium"
            >
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
            <Label
              htmlFor="deliveryTime"
              className="text-sm sm:text-base font-medium"
            >
              Preferred Delivery Time *
            </Label>
            <Select
              value={formData.deliveryTime}
              onValueChange={(value) =>
                handleInputChange("deliveryTime", value)
              }
            >
              <SelectTrigger className="mt-1 h-9 sm:h-10 lg:h-11 text-sm sm:text-base">
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent className="custom-scroll max-h-[40vh]">
                {todaySlots.length > 0 ? (
                  <SelectGroup>
                    <SelectLabel>Today</SelectLabel>
                    {todaySlots.map((slot) => (
                      <SelectItem
                        key={slot.value}
                        value={slot.value}
                        className="text-sm sm:text-base"
                      >
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ) : (
                  <SelectItem
                    value="no-today-slots"
                    disabled
                    className="text-sm sm:text-base text-gray-500"
                  >
                    No slots available today
                  </SelectItem>
                )}
                <SelectGroup>
                  <SelectLabel>Tomorrow</SelectLabel>
                  {tomorrowSlots.map((slot) => (
                    <SelectItem
                      key={slot.value}
                      value={slot.value}
                      className="text-sm sm:text-base"
                    >
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes" className="text-sm sm:text-base font-medium">
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
            <p className="text-xs sm:text-sm text-gray-600">
              Payment will be collected on delivery
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent h-9 sm:h-10 lg:h-11 text-sm sm:text-base hover:bg-red-50 hover:border-red-300 transition-colors duration-200 rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.deliveryTime ||
                formData.deliveryTime === "no-today-slots"
              }
              className="flex-1 bg-red-600 hover:bg-red-700 h-9 sm:h-10 lg:h-11 text-sm sm:text-base transition-all duration-200 hover:shadow-lg rounded-full"
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
