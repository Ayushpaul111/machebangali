// app/product/[id]/page.tsx
"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductContext";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Plus,
  Minus,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Weight options for conversion from 1kg base price
const weightOptions = [
  { value: "250g", label: "250g", multiplier: 0.25 },
  { value: "500g", label: "500g", multiplier: 0.5 },
  { value: "750g", label: "750g", multiplier: 0.75 },
  { value: "1kg", label: "1kg", multiplier: 1 },
  { value: "1.5kg", label: "1.5kg", multiplier: 1.5 },
  { value: "2kg", label: "2kg", multiplier: 2 },
];

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const [selectedWeight, setSelectedWeight] = useState("500g");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { getProductById, loading } = useProducts();
  const { toast } = useToast();
  const router = useRouter();

  const product = getProductById(id);

  useEffect(() => {
    if (!loading && !product) {
      // Product not found, redirect to home after showing error
      toast({
        title: "Product not found",
        description: "The product you're looking for doesn't exist.",
        variant: "destructive",
      });
      router.push("/");
    }
  }, [product, loading, router, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-red-600" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Link href="/" className="text-red-600 hover:text-red-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const selectedWeightOption =
    weightOptions.find((w) => w.value === selectedWeight) || weightOptions[1];
  const calculatedPrice = Math.round(
    product.price * selectedWeightOption.multiplier
  );
  const totalPrice = calculatedPrice * quantity;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: calculatedPrice,
      image: product.image,
      weight: selectedWeight,
      quantity: quantity,
      category: product.category,
    });

    toast({
      title: "Added to cart!",
      description: `${quantity}x ${product.name} (${selectedWeight}) added to your cart.`,
    });
  };

  const adjustQuantity = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Back Button */}
        <div className="mb-6 sm:mb-8">
          <Link href={`/category/${product.category}`}>
            <button className="flex items-center hover:bg-red-50 transition-colors duration-200 px-2 py-1 rounded-md text-sm sm:text-base">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to{" "}
              {product.category === "meat" ? "Fresh Meat" : "Fresh Fish"}
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="animate-in fade-in-0 slide-in-from-left-4 duration-700">
            <Card className="overflow-hidden">
              <div className="relative h-64 sm:h-80 lg:h-96">
                <Image
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-red-600">
                  {product.subcategory}
                </Badge>
                <Badge className="absolute top-4 right-4 bg-gray-800 text-white">
                  {product.category}
                </Badge>
              </div>
            </Card>
          </div>

          {/* Product Details */}
          <div
            className="animate-in fade-in-0 slide-in-from-right-4 duration-700"
            style={{ animationDelay: "200ms" }}
          >
            <div className="space-y-6">
              {/* Product Title and Rating */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                {product.rating > 0 && (
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.rating})
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              {product.features.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Key Features:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Price per {selectedWeight}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-red-600">
                      ₹{calculatedPrice}
                    </p>
                    <p className="text-xs text-gray-500">
                      Base price: ₹{product.price}/kg
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    In Stock
                  </Badge>
                </div>
              </div>

              {/* Weight Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Weight:
                </label>
                <Select
                  value={selectedWeight}
                  onValueChange={setSelectedWeight}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {weightOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label} - ₹
                        {Math.round(product.price * option.multiplier)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity:
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => adjustQuantity(-1)}
                      disabled={quantity <= 1}
                      className="h-10 w-10 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => adjustQuantity(1)}
                      disabled={quantity >= 99}
                      className="h-10 w-10 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Total: ₹{totalPrice}
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 text-base"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart - ₹{totalPrice}
              </Button>

              {/* Additional Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Delivery Information:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Fresh delivery within 2-4 hours</li>
                  <li>• 100% quality guarantee</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <RelatedProducts currentProduct={product} />
      </div>
    </div>
  );
}

// Related Products Component
function RelatedProducts({ currentProduct }: { currentProduct: Product }) {
  const { getProductsBySubcategory } = useProducts();

  const relatedProducts = getProductsBySubcategory(
    currentProduct.category,
    currentProduct.subcategory
  )
    .filter((p) => p.id !== currentProduct.id)
    .slice(0, 4);

  if (relatedProducts.length === 0) return null;

  return (
    <section className="mt-12 lg:mt-16">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
        More {currentProduct.subcategory} Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {relatedProducts.map((product, index) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <Card
              className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group animate-in fade-in-0 slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <Image
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-2 left-2 bg-red-600">
                  {product.subcategory}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-sm group-hover:text-red-600 transition-colors duration-200">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-red-600">
                    ₹{product.price}
                  </span>
                  <span className="text-xs text-gray-500">{product.unit}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
