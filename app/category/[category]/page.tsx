import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

const products = {
  meat: [
    {
      id: "chicken-breast",
      name: "Chicken Breast",
      image: "/placeholder.png",
      price: 180,
      description: "Tender and juicy chicken breast, perfect for grilling",
      subcategory: "Chicken",
    },
    {
      id: "chicken-thigh",
      name: "Chicken Thigh",
      image: "/placeholder.png",
      price: 160,
      description: "Flavorful chicken thigh with bone",
      subcategory: "Chicken",
    },
    {
      id: "mutton-curry-cut",
      name: "Mutton Curry Cut",
      image: "/placeholder.png",
      price: 450,
      description: "Fresh mutton cut perfect for curries",
      subcategory: "Mutton",
    },
    {
      id: "mutton-chops",
      name: "Mutton Chops",
      image: "/placeholder.png",
      price: 480,
      description: "Premium mutton chops for special occasions",
      subcategory: "Mutton",
    },
    {
      id: "beef-steak",
      name: "Beef Steak",
      image: "/placeholder.png",
      price: 380,
      description: "Premium beef steak cuts",
      subcategory: "Beef",
    },
    {
      id: "pork-chops",
      name: "Pork Chops",
      image: "/placeholder.png",
      price: 320,
      description: "Fresh pork chops",
      subcategory: "Pork",
    },
  ],
  fish: [
    {
      id: "rohu-fish",
      name: "Rohu Fish",
      image: "/placeholder.png",
      price: 120,
      description: "Fresh water rohu fish, cleaned and cut",
      subcategory: "Rohu",
    },
    {
      id: "katla-fish",
      name: "Katla Fish",
      image: "/placeholder.png",
      price: 140,
      description: "Fresh katla fish pieces",
      subcategory: "Katla",
    },
    {
      id: "prawns-medium",
      name: "Medium Prawns",
      image: "/placeholder.png",
      price: 280,
      description: "Fresh medium-sized prawns",
      subcategory: "Prawns",
    },
    {
      id: "prawns-large",
      name: "Large Prawns",
      image: "/placeholder.png",
      price: 350,
      description: "Premium large prawns",
      subcategory: "Prawns",
    },
    {
      id: "salmon-fillet",
      name: "Salmon Fillet",
      image: "/placeholder.png",
      price: 450,
      description: "Fresh salmon fillet",
      subcategory: "Salmon",
    },
  ],
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const categoryProducts = products[params.category as keyof typeof products] || []
  const categoryName = params.category === "meat" ? "Fresh Meat" : "Fresh Fish"

  // Group products by subcategory
  const groupedProducts = categoryProducts.reduce(
    (acc, product) => {
      if (!acc[product.subcategory]) {
        acc[product.subcategory] = []
      }
      acc[product.subcategory].push(product)
      return acc
    },
    {} as Record<string, typeof categoryProducts>,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <div className="flex items-center mb-4 sm:mb-6">
            <a href="/">
              <button className="flex items-center hover:bg-red-50 transition-colors duration-200 px-2 py-1 rounded-md text-sm sm:text-base">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </button>
            </a>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 animate-in fade-in-0 slide-in-from-top-4 duration-700">
            {categoryName}
          </h1>
          <p
            className="text-gray-600 text-sm sm:text-base animate-in fade-in-0 slide-in-from-top-4 duration-700"
            style={{ animationDelay: "200ms" }}
          >
            Choose from our premium selection of {params.category}
          </p>
        </div>

        {Object.entries(groupedProducts).map(([subcategory, products], groupIndex) => (
          <div key={subcategory} className="mb-8 sm:mb-12">
            <h2
              className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 animate-in fade-in-0 slide-in-from-left-4 duration-700"
              style={{ animationDelay: `${groupIndex * 200}ms` }}
            >
              <span>{subcategory}</span>
              <Badge variant="secondary" className="w-fit">
                {products.length} item{products.length !== 1 ? "s" : ""}
              </Badge>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product, index) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full group animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
                    style={{ animationDelay: `${groupIndex * 200 + index * 100}ms` }}
                  >
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-3 sm:p-4">
                      <h3 className="font-semibold mb-2 text-sm sm:text-base group-hover:text-red-600 transition-colors duration-200">
                        {product.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-base sm:text-lg font-bold text-red-600">₹{product.price}</span>
                        <span className="text-xs sm:text-sm text-gray-500">per 250g</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
