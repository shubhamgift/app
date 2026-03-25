import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, JewelryType } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  jewelryType: JewelryType;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next(this.cartItems);
    }
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.cartSubject.next(this.cartItems);
  }

  addToCart(product: Product, quantity: number = 1, jewelryType: JewelryType = 'IMITATION'): void {
    // Check if same product with same jewelry type exists
    const existingItem = this.cartItems.find(
      item => item.product.id === product.id && item.jewelryType === jewelryType
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity, jewelryType });
    }
    
    this.saveCart();
  }

  removeFromCart(productId: number, jewelryType: JewelryType): void {
    this.cartItems = this.cartItems.filter(
      item => !(item.product.id === productId && item.jewelryType === jewelryType)
    );
    this.saveCart();
  }

  updateQuantity(productId: number, jewelryType: JewelryType, quantity: number): void {
    const item = this.cartItems.find(
      item => item.product.id === productId && item.jewelryType === jewelryType
    );
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveCart();
    }
  }

  clearCart(): void {
    this.cartItems = [];
    localStorage.removeItem('cart');
    this.cartSubject.next([]);
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  getCartCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => {
      const price = this.getItemPrice(item);
      return total + (price * item.quantity);
    }, 0);
  }

  getItemPrice(item: CartItem): number {
    if (item.jewelryType === 'REAL') {
      return item.product.realPrice || 0;
    }
    return item.product.price;
  }

  hasQuotePendingItems(): boolean {
    return this.cartItems.some(
      item => item.jewelryType === 'REAL' && !item.product.realPrice
    );
  }

  isInCart(productId: number, jewelryType?: JewelryType): boolean {
    if (jewelryType) {
      return this.cartItems.some(
        item => item.product.id === productId && item.jewelryType === jewelryType
      );
    }
    return this.cartItems.some(item => item.product.id === productId);
  }
}
