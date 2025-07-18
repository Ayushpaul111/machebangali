// types/product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  category: "meat" | "fish";
  subcategory: string;
  features: string[];
  unit: string;
  inStock: boolean;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  count?: number;
}

export interface CategoryData {
  meat: Product[];
  fish: Product[];
  all: Product[];
}

export interface CategoryInfo {
  name: string;
  subcategories: string[];
  count: number;
}

export interface CategoriesResponse {
  meat: CategoryInfo;
  fish: CategoryInfo;
}
