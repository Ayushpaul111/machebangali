"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download } from "lucide-react"
import Link from "next/link"

interface OrderData {
  id: string
  items: Array<{
    name: string
    quantity: number
    weight: string
    price: number
  }>
  customer: {
    name: string
    phone: string
    address: string
    deliveryTime: string
    notes: string
  }
  total: number
  deliveryCharge: number
  subtotal: number
  orderDate: string
  status: string
}

export default function OrderSuccessPage() {
  const [orderData, setOrderData] = useState<OrderData | null>(null)

  useEffect(() => {
    const storedOrder = localStorage.getItem("lastOrder")
    if (storedOrder) {
      setOrderData(JSON.parse(storedOrder))
    }
  }, [])

  const handleDownloadReceipt = () => {
    if (!orderData) return

    // Create a simple text receipt
    const receipt = `
FRESHMART - ORDER RECEIPT
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
  .map((item) => `${item.name} (${item.weight}) x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`)
  .join("\n")}

BILL SUMMARY:
Subtotal: ₹${orderData.subtotal.toFixed(2)}
Delivery Charge: ₹${orderData.deliveryCharge.toFixed(2)}
Total: ₹${orderData.total.toFixed(2)}

Thank you for your order!
    `

    const blob = new Blob([receipt], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `FreshMart-Receipt-${orderData.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Order Found</h1>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your order. We'll deliver fresh to your doorstep.</p>
        </div>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Order #{orderData.id}</span>
              <span className="text-sm font-normal text-gray-500">
                {new Date(orderData.orderDate).toLocaleDateString()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Customer Details */}
            <div>
              <h3 className="font-semibold mb-3">Delivery Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p>
                  <strong>Name:</strong> {orderData.customer.name}
                </p>
                <p>
                  <strong>Phone:</strong> {orderData.customer.phone}
                </p>
                <p>
                  <strong>Address:</strong> {orderData.customer.address}
                </p>
                <p>
                  <strong>Delivery Time:</strong> {orderData.customer.deliveryTime}
                </p>
                {orderData.customer.notes && (
                  <p>
                    <strong>Notes:</strong> {orderData.customer.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Items Ordered */}
            <div>
              <h3 className="font-semibold mb-3">Items Ordered</h3>
              <div className="space-y-3">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.weight} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Summary */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Bill Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{orderData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span>₹{orderData.deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total Paid:</span>
                  <span>₹{orderData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button onClick={handleDownloadReceipt} className="w-full bg-transparent" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>

          <div className="text-center text-sm text-gray-600 mb-4">
            <p>📱 Take a screenshot of this page for your records</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/">
              <Button variant="outline" className="w-full bg-transparent">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/track-order">
              <Button className="w-full bg-red-600 hover:bg-red-700">Track Order</Button>
            </Link>
          </div>
        </div>

        {/* Delivery Info */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">What's Next?</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>🚚 Your order will be delivered during your selected time slot</p>
              <p>📞 Our delivery partner will call you before arrival</p>
              <p>💰 Payment will be collected on delivery (Cash/UPI)</p>
              <p>🔄 Easy returns if you're not satisfied</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
