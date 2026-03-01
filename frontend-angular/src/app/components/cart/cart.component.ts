import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="cart-page">
      <div class="cart-container">
        <h1 class="cart-title" data-testid="cart-title">Shopping Cart</h1>

        <!-- Empty Cart -->
        <div *ngIf="cartItems.length === 0" class="empty-cart" data-testid="empty-cart">
          <div class="empty-icon">&#128717;</div>
          <h2>Your cart is empty</h2>
          <p>Browse our collection and add items to your cart</p>
          <a routerLink="/products" class="btn-primary" data-testid="browse-products-btn">
            Browse Products
          </a>
        </div>

        <!-- Cart Items -->
        <div *ngIf="cartItems.length > 0" class="cart-content">
          <div class="cart-items">
            <div 
              *ngFor="let item of cartItems; let i = index" 
              class="cart-item"
              [attr.data-testid]="'cart-item-' + i">
              
              <div class="item-image">
                <img [src]="getProductImage(item.product)" [alt]="item.product.name">
              </div>

              <div class="item-details">
                <h3 class="item-name" [attr.data-testid]="'item-name-' + i">{{ item.product.name }}</h3>
                <p class="item-category">{{ item.product.category?.name }}</p>
                <p class="item-price">\${{ item.product.price | number:'1.2-2' }}</p>
              </div>

              <div class="item-quantity">
                <label>Quantity</label>
                <div class="quantity-controls">
                  <button 
                    class="qty-btn" 
                    (click)="decreaseQuantity(item)"
                    [attr.data-testid]="'decrease-qty-' + i">-</button>
                  <input 
                    type="number" 
                    [value]="item.quantity" 
                    (change)="updateQuantity(item, $event)"
                    min="1"
                    class="qty-input"
                    [attr.data-testid]="'qty-input-' + i">
                  <button 
                    class="qty-btn" 
                    (click)="increaseQuantity(item)"
                    [attr.data-testid]="'increase-qty-' + i">+</button>
                </div>
              </div>

              <div class="item-subtotal">
                <label>Subtotal</label>
                <p class="subtotal-amount" [attr.data-testid]="'subtotal-' + i">
                  \${{ (item.product.price * item.quantity) | number:'1.2-2' }}
                </p>
              </div>

              <button 
                class="btn-remove" 
                (click)="removeItem(item.product.id!)"
                [attr.data-testid]="'remove-item-' + i">
                &#10005;
              </button>
            </div>
          </div>

          <!-- Cart Summary -->
          <div class="cart-summary">
            <div class="summary-card">
              <h2>Order Summary</h2>
              
              <div class="summary-row">
                <span>Subtotal ({{ getTotalItems() }} items)</span>
                <span data-testid="cart-subtotal">\${{ getCartTotal() | number:'1.2-2' }}</span>
              </div>
              
              <div class="summary-row">
                <span>Shipping</span>
                <span data-testid="shipping-cost">{{ getCartTotal() >= 1000 ? 'Free' : '$50.00' }}</span>
              </div>
              
              <div class="divider"></div>
              
              <div class="summary-row total">
                <span>Total</span>
                <span data-testid="cart-total">\${{ getFinalTotal() | number:'1.2-2' }}</span>
              </div>

              <button 
                class="btn-primary btn-checkout"
                (click)="proceedToCheckout()"
                data-testid="checkout-btn">
                Proceed to Checkout
              </button>

              <button 
                class="btn-outline btn-clear"
                (click)="clearCart()"
                data-testid="clear-cart-btn">
                Clear Cart
              </button>

              <p class="shipping-note">
                Free shipping on orders over $1,000
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-page {
      min-height: 100vh;
      padding: 40px 24px 80px;
    }

    .cart-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .cart-title {
      font-family: 'Bodoni Moda', serif;
      font-size: 2.5rem;
      color: #C6A87C;
      margin-bottom: 48px;
      text-align: center;
      letter-spacing: 1px;
    }

    /* Empty Cart */
    .empty-cart {
      text-align: center;
      padding: 80px 24px;
    }

    .empty-icon {
      font-size: 5rem;
      margin-bottom: 24px;
      opacity: 0.5;
    }

    .empty-cart h2 {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.75rem;
      color: #FAFAFA;
      margin-bottom: 12px;
    }

    .empty-cart p {
      color: #A1A1AA;
      margin-bottom: 32px;
    }

    /* Cart Content */
    .cart-content {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 48px;
      align-items: start;
    }

    /* Cart Items */
    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .cart-item {
      display: grid;
      grid-template-columns: 120px 1fr auto auto auto;
      gap: 24px;
      align-items: center;
      padding: 24px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(198, 168, 124, 0.2);
      transition: border-color 0.3s;
    }

    .cart-item:hover {
      border-color: rgba(198, 168, 124, 0.4);
    }

    .item-image {
      width: 120px;
      height: 150px;
      overflow: hidden;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-details {
      min-width: 200px;
    }

    .item-name {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.25rem;
      color: #FAFAFA;
      margin-bottom: 8px;
    }

    .item-category {
      color: #A1A1AA;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }

    .item-price {
      color: #C6A87C;
      font-size: 1rem;
      font-weight: 500;
    }

    .item-quantity label,
    .item-subtotal label {
      display: block;
      color: #A1A1AA;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .qty-btn {
      width: 32px;
      height: 32px;
      background: rgba(198, 168, 124, 0.2);
      border: 1px solid rgba(198, 168, 124, 0.3);
      color: #C6A87C;
      font-size: 1.25rem;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .qty-btn:hover {
      background: #C6A87C;
      color: #000;
    }

    .qty-input {
      width: 50px;
      height: 32px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #FAFAFA;
      text-align: center;
      font-size: 1rem;
    }

    .qty-input::-webkit-inner-spin-button,
    .qty-input::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .subtotal-amount {
      color: #FAFAFA;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .btn-remove {
      width: 36px;
      height: 36px;
      background: transparent;
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #EF4444;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 1rem;
    }

    .btn-remove:hover {
      background: rgba(239, 68, 68, 0.1);
      border-color: #EF4444;
    }

    /* Cart Summary */
    .summary-card {
      padding: 32px;
      background: rgba(10, 10, 10, 0.95);
      border: 1px solid rgba(198, 168, 124, 0.3);
      position: sticky;
      top: 120px;
    }

    .summary-card h2 {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.5rem;
      color: #C6A87C;
      margin-bottom: 24px;
      text-align: center;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      color: #D4D4D8;
      font-size: 0.9375rem;
    }

    .summary-row.total {
      font-size: 1.25rem;
      font-weight: 600;
      color: #FAFAFA;
    }

    .summary-row.total span:last-child {
      color: #C6A87C;
    }

    .divider {
      height: 1px;
      background: rgba(198, 168, 124, 0.2);
      margin: 16px 0;
    }

    .btn-checkout {
      width: 100%;
      margin-top: 24px;
      padding: 16px;
    }

    .btn-clear {
      width: 100%;
      margin-top: 12px;
      padding: 12px;
    }

    .shipping-note {
      text-align: center;
      color: #A1A1AA;
      font-size: 0.75rem;
      margin-top: 16px;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .cart-content {
        grid-template-columns: 1fr;
      }

      .summary-card {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .cart-item {
        grid-template-columns: 80px 1fr;
        gap: 16px;
      }

      .item-quantity,
      .item-subtotal {
        grid-column: 2;
      }

      .btn-remove {
        position: absolute;
        top: 16px;
        right: 16px;
      }

      .cart-item {
        position: relative;
        padding-right: 60px;
      }
    }

    @media (max-width: 640px) {
      .cart-title {
        font-size: 2rem;
      }

      .cart-page {
        padding: 24px 16px 60px;
      }
    }
  `]
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  private cartSubscription?: Subscription;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }

  getProductImage(product: any): string {
    return product.images?.[0] || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400';
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.product.id!, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.product.id!, item.quantity - 1);
    }
  }

  updateQuantity(item: CartItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value, 10);
    if (quantity > 0) {
      this.cartService.updateQuantity(item.product.id!, quantity);
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
    }
  }

  getTotalItems(): number {
    return this.cartService.getCartCount();
  }

  getCartTotal(): number {
    return this.cartService.getCartTotal();
  }

  getFinalTotal(): number {
    const subtotal = this.getCartTotal();
    const shipping = subtotal >= 1000 ? 0 : 50;
    return subtotal + shipping;
  }

  proceedToCheckout(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/checkout' }
      });
      return;
    }
    this.router.navigate(['/checkout']);
  }
}
