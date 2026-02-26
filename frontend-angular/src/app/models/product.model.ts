import { Category } from './category.model';

export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  category?: Category;
  metal?: string;
  gemstone?: string;
  style?: string;
  images: string[];
  specifications?: string;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  categoryId?: number;
  metal?: string;
  gemstone?: string;
  style?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}
