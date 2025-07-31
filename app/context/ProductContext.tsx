// context/ProductContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Product, CategoryData } from "@/types/product";
import { productService } from "@/lib/productService";

interface ProductContextType {
  products: CategoryData | null;
  loading: boolean;
  error: string | null;
  searchProducts: (query: string) => Product[];
  getProductById: (id: string) => Product | null;
  getProductsByCategory: (category: "meat" | "fish") => Product[];
  getProductsBySubcategory: (
    category: "meat" | "fish",
    subcategory: string
  ) => Product[];
  getFeaturedProducts: (limit?: number) => Product[];
  getSubcategories: (category: "meat" | "fish") => string[];
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export function ProductProvider({ children }: ProductProviderProps) {
  const [products, setProducts] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.initializeProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const searchProducts = (query: string): Product[] => {
    if (!products) return [];
    return productService.searchProducts(query);
  };

  const getProductById = (id: string): Product | null => {
    if (!products) return null;
    const allProducts = [...products.meat, ...products.fish];
    return allProducts.find((p) => p.id === id) || null;
  };

  const getProductsByCategory = (category: "meat" | "fish"): Product[] => {
    if (!products) return [];
    return products[category];
  };

  const getProductsBySubcategory = (
    category: "meat" | "fish",
    subcategory: string
  ): Product[] => {
    if (!products) return [];
    return productService.getProductsBySubcategory(category, subcategory);
  };

  const getFeaturedProducts = (limit = 8): Product[] => {
    if (!products) return [];
    const allProducts = [...products.meat, ...products.fish];
    return allProducts.sort((a, b) => b.rating - a.rating).slice(0, limit);
  };

  const getSubcategories = (category: "meat" | "fish"): string[] => {
    if (!products) return [];
    return productService.getSubcategories(category);
  };

  const refreshProducts = async () => {
    productService.clearCache();
    await loadProducts();
  };

  const value: ProductContextType = {
    products,
    loading,
    error,
    searchProducts,
    getProductById,
    getProductsByCategory,
    getProductsBySubcategory,
    getFeaturedProducts,
    getSubcategories,
    refreshProducts,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
