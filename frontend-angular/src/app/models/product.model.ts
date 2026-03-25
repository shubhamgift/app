import { Category } from './category.model';

export interface Product {
  id?: number;
  name: string;
  description?: string;
  // Imitation jewellery price (always shown)
  price: number;
  // Real gold/diamond version available
  hasRealVersion?: boolean;
  // Real jewellery price (null = Contact for Price)
  realPrice?: number | null;
  category?: Category;
  // Imitation version materials
  metal?: string;
  gemstone?: string;
  style?: string;
  // Real version materials
  realMetal?: string;
  realGemstone?: string;
  realSpecifications?: string;
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

export type JewelryType = 'IMITATION' | 'REAL';
