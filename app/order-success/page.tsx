"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download } from "lucide-react";
import Link from "next/link";

interface OrderData {
  id: string;
  items: Array<{
    name: string;
    quantity: number;
    weight: string;
    price: number;
  }>;
  customer: {
    name: string;
    phone: string;
    address: string;
    deliveryTime: string;
    notes: string;
  };
  total: number;
  deliveryCharge: number;
  subtotal: number;
  orderDate: string;
  status: string;
}

export default function OrderSuccessPage() {
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    const storedOrder = localStorage.getItem("lastOrder");
    if (storedOrder) {
      setOrderData(JSON.parse(storedOrder));
    }
  }, []);

  const handleDownloadReceipt = () => {
    if (!orderData) return;

    const receipt = `
Mache Bangali - ORDER RECEIPT
========================

Order ID: ${orderData.id}
Date: ${new Date(orderData.orderDate).toLocaleDateString()}
Status: ${orderData.status.toUpperCase()}

CUSTOMER DETAILS:
Name: ${orderData.customer.name}
Phone: ${orderData.customer.phone}
Address: ${orderData.customer.address}
Delivery Time: ${orderData.customer.deliveryTime}

ITEMS ORDERED:
${orderData.items
  .map(
    (item) =>
      `${item.name} (${item.weight}) x${item.quantity} - ₹${(
        item.price * item.quantity
      ).toFixed(2)}`
  )
  .join("\n")}

BILL SUMMARY:
Subtotal: ₹${orderData.subtotal.toFixed(2)}
Delivery Charge: ₹${orderData.deliveryCharge.toFixed(2)}
Total: ₹${orderData.total.toFixed(2)}

Thank you for your order!
    `;

    const blob = new Blob([receipt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Mache Bangali-Receipt-${orderData.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="text-center p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              No Order Found
            </h1>
            <Link href="/">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                Go Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8 sm:mb-12">
          <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 mx-auto mb-4 animate-pulse" />
          <h1 className="text-2xl sm:text-4xl font-extrabold text-green-600 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
            Thank you for your order. We'll deliver fresh to your doorstep.
          </p>
        </div>

        {/* Order Details */}
        <Card className="mb-6 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-lg sm:text-xl font-bold">
                Order #{orderData.id}
              </span>
              <span className="text-xs sm:text-sm font-normal text-gray-500">
                {new Date(orderData.orderDate).toLocaleDateString()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-6">
            {/* Customer Details */}
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-3">
                Delivery Details
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm sm:text-base">
                <p>
                  <strong>Name:</strong> {orderData.customer.name}
                </p>
                <p>
                  <strong>Phone:</strong> {orderData.customer.phone}
                </p>
                <p className="whitespace-pre-line">
                  <strong>Address:</strong> {orderData.customer.address}
                </p>
                <p>
                  <strong>Delivery Time:</strong>{" "}
                  {orderData.customer.deliveryTime}
                </p>
                {orderData.customer.notes && (
                  <p className="whitespace-pre-line">
                    <strong>Notes:</strong> {orderData.customer.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Items Ordered */}
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-3">
                Items Ordered
              </h3>
              <div className="space-y-3">
                {orderData.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b gap-2"
                  >
                    <div>
                      <p className="font-medium text-sm sm:text-base">
                        {item.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {item.weight} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-sm sm:text-base">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Summary */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-base sm:text-lg mb-3">
                Bill Summary
              </h3>
              <div className="space-y-2 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{orderData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span>₹{orderData.deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base sm:text-lg border-t pt-2">
                  <span>Total Paid:</span>
                  <span>₹{orderData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4 mb-6">
          <Button
            onClick={handleDownloadReceipt}
            className="w-full bg-transparent text-blue-600 hover:bg-blue-50"
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>

          <div className="text-center text-xs sm:text-sm text-gray-600">
            <p>📱 Take a screenshot of this page for your records</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Link href="/">
              <Button
                variant="outline"
                className="w-full bg-transparent text-gray-700 hover:bg-gray-100"
              >
                Continue Shopping
              </Button>
            </Link>
            <Link href="tel:+919732266082">
              <Button className="w-full bg-red-600 hover:bg-red-700">
                Track Order
              </Button>
            </Link>
          </div>
        </div>

        {/* Delivery Info */}
        <Card className="shadow-lg rounded-xl">
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-semibold text-base sm:text-lg mb-3">
              What's Next?
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-600">
              <p>
                🚚 Your order will be delivered during your selected time slot
              </p>
              <p>📞 Our delivery partner will call you before arrival</p>
              <p>💰 Payment will be collected on delivery (Cash/UPI)</p>
              <p>🔄 Easy returns if you're not satisfied</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
