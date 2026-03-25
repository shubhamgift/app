import { User } from './user.model';
import { Product, JewelryType } from './product.model';

export interface Order {
  id?: number;
  user?: User;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  shippingAddress: string;
  phone: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id?: number;
  product: Product;
  quantity: number;
  price: number;
  jewelryType: JewelryType;
  priceOnRequest?: boolean;
}

export interface OrderRequest {
  items: {
    productId: number;
    quantity: number;
    jewelryType: JewelryType;
  }[];
  shippingAddress: string;
  phone: string;
}
