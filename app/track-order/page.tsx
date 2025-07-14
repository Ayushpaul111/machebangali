import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Truck } from "lucide-react"
import Link from "next/link"

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Track Your Order</h1>

        <Card>
          <CardHeader>
            <CardTitle>Order #ORD-1234567890</CardTitle>
            <p className="text-sm text-gray-600">Placed on January 15, 2024</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Order Status Timeline */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="font-semibold">Order Confirmed</p>
                    <p className="text-sm text-gray-600">Your order has been received and confirmed</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="font-semibold">Order Prepared</p>
                    <p className="text-sm text-gray-600">Your fresh items are being prepared</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Truck className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="font-semibold">Out for Delivery</p>
                    <p className="text-sm text-gray-600">Your order is on the way!</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Clock className="h-6 w-6 text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-400">Delivered</p>
                    <p className="text-sm text-gray-400">Pending delivery</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Estimated Delivery:</strong> Today, 3:00 PM - 5:00 PM
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Delivery Partner:</strong> Raj Kumar (+91 98765 43210)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
