// lib/productService.ts
import {
  Product,
  APIResponse,
  CategoryData,
  CategoriesResponse,
} from "../types/product";

const API_URL = process.env.NEXT_PUBLIC_SHEET_API_URL;

class ProductService {
  private readonly cache: Map<string, { data: any; timestamp: number }> =
    new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private allProductsCache: CategoryData | null = null;
  private isLoading = false;
  private loadingPromise: Promise<CategoryData> | null = null;

  // Check if cache is valid
  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_DURATION;
  }

  // Get cached data
  private getCachedData<T>(key: string): T | null {
    if (this.isCacheValid(key)) {
      return this.cache.get(key)?.data || null;
    }
    return null;
  }

  // Set cache data
  private setCacheData(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  // Fetch data from API
  private async fetchFromAPI(
    action: string,
    params?: Record<string, string>
  ): Promise<any> {
    const url = new URL(API_URL || "The sheet API URL is not set.");
    url.searchParams.set("action", action);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "API request failed");
    }

    return data;
  }

  // Initialize and load all products (called once on app start)
  async initializeProducts(): Promise<CategoryData> {
    // If already loading, return the promise
    if (this.isLoading && this.loadingPromise) {
      return this.loadingPromise;
    }

    // If we have valid cached data, return it
    if (this.allProductsCache && this.isCacheValid("allProducts")) {
      return this.allProductsCache;
    }

    // Start loading
    this.isLoading = true;
    this.loadingPromise = this._loadAllProducts();

    try {
      const result = await this.loadingPromise;
      this.allProductsCache = result;
      this.setCacheData("allProducts", result);
      return result;
    } finally {
      this.isLoading = false;
      this.loadingPromise = null;
    }
  }

  private async _loadAllProducts(): Promise<CategoryData> {
    const response: APIResponse<CategoryData> = await this.fetchFromAPI(
      "getAllProducts"
    );
    return response.data;
  }

  // Get all products (uses cache)
  async getAllProducts(): Promise<CategoryData> {
    return this.initializeProducts();
  }

  // Get products by category
  async getProductsByCategory(category: "meat" | "fish"): Promise<Product[]> {
    const cacheKey = `category_${category}`;

    // Try cache first
    const cached = this.getCachedData<Product[]>(cacheKey);
    if (cached) return cached;

    // If we have all products cached, use that
    if (this.allProductsCache) {
      const products = this.allProductsCache[category];
      this.setCacheData(cacheKey, products);
      return products;
    }

    // Otherwise fetch from API
    const response: APIResponse<Product[]> = await this.fetchFromAPI(
      "getProductsByCategory",
      { category }
    );
    this.setCacheData(cacheKey, response.data);
    return response.data;
  }

  // Get single product by ID
  async getProductById(id: string): Promise<Product | null> {
    const cacheKey = `product_${id}`;

    // Try cache first
    const cached = this.getCachedData<Product>(cacheKey);
    if (cached) return cached;

    // If we have all products cached, search there first
    if (this.allProductsCache) {
      const allProducts = [
        ...this.allProductsCache.meat,
        ...this.allProductsCache.fish,
      ];
      const product = allProducts.find((p) => p.id === id);
      if (product) {
        this.setCacheData(cacheKey, product);
        return product;
      }
    }

    // Otherwise fetch from API
    try {
      const response: APIResponse<Product> = await this.fetchFromAPI(
        "getProductById",
        { id }
      );
      this.setCacheData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  // Get featured products
  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    const cacheKey = `featured_${limit}`;

    // Try cache first
    const cached = this.getCachedData<Product[]>(cacheKey);
    if (cached) return cached;

    // If we have all products cached, calculate featured products locally
    if (this.allProductsCache) {
      const allProducts = [
        ...this.allProductsCache.meat,
        ...this.allProductsCache.fish,
      ];
      const featured = allProducts
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
      this.setCacheData(cacheKey, featured);
      return featured;
    }

    // Otherwise fetch from API
    const response: APIResponse<Product[]> = await this.fetchFromAPI(
      "getFeaturedProducts",
      { limit: limit.toString() }
    );
    this.setCacheData(cacheKey, response.data);
    return response.data;
  }

  // Search products
  searchProducts(query: string): Product[] {
    // Search should work offline using cached data
    if (!this.allProductsCache) {
      console.warn("Products not loaded yet. Initialize first.");
      return [];
    }

    const allProducts = [
      ...this.allProductsCache.meat,
      ...this.allProductsCache.fish,
    ];
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) return [];

    return allProducts.filter((product) => {
      const name = product.name.toLowerCase();
      const description = product.description.toLowerCase();
      const category = product.category.toLowerCase();
      const subcategory = product.subcategory.toLowerCase();
      const features = product.features.join(" ").toLowerCase();

      return (
        name.includes(searchTerm) ||
        description.includes(searchTerm) ||
        category.includes(searchTerm) ||
        subcategory.includes(searchTerm) ||
        features.includes(searchTerm)
      );
    });
  }

  // Get categories info
  async getCategories(): Promise<CategoriesResponse> {
    const cacheKey = "categories";

    // Try cache first
    const cached = this.getCachedData<CategoriesResponse>(cacheKey);
    if (cached) return cached;

    // If we have all products cached, calculate categories locally
    if (this.allProductsCache) {
      const meatSubcategories = [
        ...new Set(this.allProductsCache.meat.map((p) => p.subcategory)),
      ];
      const fishSubcategories = [
        ...new Set(this.allProductsCache.fish.map((p) => p.subcategory)),
      ];

      const categories: CategoriesResponse = {
        meat: {
          name: "Fresh Meat",
          subcategories: meatSubcategories,
          count: this.allProductsCache.meat.length,
        },
        fish: {
          name: "Fresh Fish",
          subcategories: fishSubcategories,
          count: this.allProductsCache.fish.length,
        },
      };

      this.setCacheData(cacheKey, categories);
      return categories;
    }

    // Otherwise fetch from API
    const response: APIResponse<CategoriesResponse> = await this.fetchFromAPI(
      "getCategories"
    );
    this.setCacheData(cacheKey, response.data);
    return response.data;
  }

  // Get products by subcategory
  getProductsBySubcategory(
    category: "meat" | "fish",
    subcategory: string
  ): Product[] {
    if (!this.allProductsCache) return [];

    return this.allProductsCache[category].filter(
      (product) => product.subcategory === subcategory
    );
  }

  // Get subcategories for a category
  getSubcategories(category: "meat" | "fish"): string[] {
    if (!this.allProductsCache) return [];

    return [
      ...new Set(this.allProductsCache[category].map((p) => p.subcategory)),
    ];
  }

  // Clear cache (useful for development or forced refresh)
  clearCache(): void {
    this.cache.clear();
    this.allProductsCache = null;
  }

  // Check if products are loaded
  isInitialized(): boolean {
    return this.allProductsCache !== null;
  }
}

// Export singleton instance
export const productService = new ProductService();
