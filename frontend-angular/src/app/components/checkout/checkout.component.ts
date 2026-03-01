import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="checkout-page">
      <div class="checkout-container">
        <h1 class="checkout-title" data-testid="checkout-title">Checkout</h1>

        <!-- Empty Cart Redirect -->
        <div *ngIf="cartItems.length === 0 && !orderSuccess" class="empty-checkout">
          <p>Your cart is empty. Please add items before checkout.</p>
          <a routerLink="/products" class="btn-primary">Browse Products</a>
        </div>

        <!-- Order Success -->
        <div *ngIf="orderSuccess" class="order-success" data-testid="order-success">
          <div class="success-icon">&#10004;</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your order. We'll send you a confirmation email shortly.</p>
          <p class="order-id">Order ID: <strong>{{ orderId }}</strong></p>
          <div class="success-actions">
            <a routerLink="/orders" class="btn-primary" data-testid="view-orders-btn">View My Orders</a>
            <a routerLink="/products" class="btn-outline">Continue Shopping</a>
          </div>
        </div>

        <!-- Checkout Form -->
        <div *ngIf="cartItems.length > 0 && !orderSuccess" class="checkout-content">
          <div class="checkout-form-section">
            <form (ngSubmit)="placeOrder()" class="checkout-form" data-testid="checkout-form">
              <!-- Shipping Information -->
              <div class="form-section">
                <h2>Shipping Information</h2>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="fullName">Full Name *</label>
                    <input 
                      type="text" 
                      id="fullName"
                      [(ngModel)]="shippingInfo.fullName" 
                      name="fullName"
                      placeholder="John Doe"
                      data-testid="shipping-fullname"
                      required>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="phone">Phone Number *</label>
                    <input 
                      type="tel" 
                      id="phone"
                      [(ngModel)]="shippingInfo.phone" 
                      name="phone"
                      placeholder="+1 (555) 123-4567"
                      data-testid="shipping-phone"
                      required>
                  </div>
                  <div class="form-group">
                    <label for="email">Email *</label>
                    <input 
                      type="email" 
                      id="email"
                      [(ngModel)]="shippingInfo.email" 
                      name="email"
                      placeholder="your@email.com"
                      data-testid="shipping-email"
                      required>
                  </div>
                </div>

                <div class="form-group">
                  <label for="address">Shipping Address *</label>
                  <textarea 
                    id="address"
                    [(ngModel)]="shippingInfo.address" 
                    name="address"
                    placeholder="Enter your complete shipping address"
                    rows="3"
                    data-testid="shipping-address"
                    required></textarea>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="city">City *</label>
                    <input 
                      type="text" 
                      id="city"
                      [(ngModel)]="shippingInfo.city" 
                      name="city"
                      placeholder="New York"
                      data-testid="shipping-city"
                      required>
                  </div>
                  <div class="form-group">
                    <label for="zipCode">Zip Code *</label>
                    <input 
                      type="text" 
                      id="zipCode"
                      [(ngModel)]="shippingInfo.zipCode" 
                      name="zipCode"
                      placeholder="10001"
                      data-testid="shipping-zipcode"
                      required>
                  </div>
                </div>

                <div class="form-group">
                  <label for="country">Country *</label>
                  <select 
                    id="country"
                    [(ngModel)]="shippingInfo.country" 
                    name="country"
                    data-testid="shipping-country"
                    required>
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="IN">India</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <!-- Special Instructions -->
              <div class="form-section">
                <h2>Special Instructions (Optional)</h2>
                <div class="form-group">
                  <textarea 
                    id="instructions"
                    [(ngModel)]="shippingInfo.instructions" 
                    name="instructions"
                    placeholder="Any special delivery instructions or gift message..."
                    rows="3"
                    data-testid="special-instructions"></textarea>
                </div>
              </div>

              <!-- Error Message -->
              <p *ngIf="errorMessage" class="error-message" data-testid="checkout-error">
                {{ errorMessage }}
              </p>

              <!-- Submit Button -->
              <button 
                type="submit" 
                class="btn-primary btn-place-order"
                [disabled]="loading"
                data-testid="place-order-btn">
                {{ loading ? 'Processing Order...' : 'Place Order - $' + getFinalTotal().toFixed(2) }}
              </button>
            </form>
          </div>

          <!-- Order Summary -->
          <div class="order-summary-section">
            <div class="summary-card">
              <h2>Order Summary</h2>
              
              <div class="summary-items">
                <div 
                  *ngFor="let item of cartItems; let i = index" 
                  class="summary-item"
                  [attr.data-testid]="'summary-item-' + i">
                  <div class="summary-item-image">
                    <img [src]="getProductImage(item.product)" [alt]="item.product.name">
                  </div>
                  <div class="summary-item-details">
                    <p class="summary-item-name">{{ item.product.name }}</p>
                    <p class="summary-item-qty">Qty: {{ item.quantity }}</p>
                  </div>
                  <p class="summary-item-price">\${{ (item.product.price * item.quantity) | number:'1.2-2' }}</p>
                </div>
              </div>

              <div class="divider"></div>

              <div class="summary-row">
                <span>Subtotal</span>
                <span>\${{ getCartTotal() | number:'1.2-2' }}</span>
              </div>
              
              <div class="summary-row">
                <span>Shipping</span>
                <span>{{ getCartTotal() >= 1000 ? 'Free' : '$50.00' }}</span>
              </div>

              <div class="divider"></div>

              <div class="summary-row total">
                <span>Total</span>
                <span data-testid="checkout-total">\${{ getFinalTotal() | number:'1.2-2' }}</span>
              </div>

              <a routerLink="/cart" class="edit-cart-link" data-testid="edit-cart-link">
                Edit Cart
              </a>
            </div>

            <!-- Security Info -->
            <div class="security-info">
              <div class="security-item">
                <span class="security-icon">&#128274;</span>
                <span>Secure SSL Encryption</span>
              </div>
              <div class="security-item">
                <span class="security-icon">&#10004;</span>
                <span>Authenticity Guaranteed</span>
              </div>
              <div class="security-item">
                <span class="security-icon">&#128230;</span>
                <span>Insured Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-page {
      min-height: 100vh;
      padding: 40px 24px 80px;
    }

    .checkout-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .checkout-title {
      font-family: 'Bodoni Moda', serif;
      font-size: 2.5rem;
      color: #C6A87C;
      margin-bottom: 48px;
      text-align: center;
      letter-spacing: 1px;
    }

    /* Empty/Success States */
    .empty-checkout,
    .order-success {
      text-align: center;
      padding: 80px 24px;
    }

    .empty-checkout p {
      color: #A1A1AA;
      margin-bottom: 24px;
    }

    .order-success {
      background: rgba(16, 185, 129, 0.05);
      border: 1px solid rgba(16, 185, 129, 0.3);
      max-width: 600px;
      margin: 0 auto;
    }

    .success-icon {
      width: 80px;
      height: 80px;
      background: rgba(16, 185, 129, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      color: #10B981;
      margin: 0 auto 24px;
    }

    .order-success h2 {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.75rem;
      color: #10B981;
      margin-bottom: 16px;
    }

    .order-success p {
      color: #D4D4D8;
      margin-bottom: 12px;
    }

    .order-id {
      color: #C6A87C;
      font-size: 1.125rem;
      margin-bottom: 32px;
    }

    .success-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    /* Checkout Content */
    .checkout-content {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 48px;
      align-items: start;
    }

    /* Form Section */
    .checkout-form {
      display: flex;
      flex-direction: column;
      gap: 40px;
    }

    .form-section {
      padding: 32px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(198, 168, 124, 0.2);
    }

    .form-section h2 {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.5rem;
      color: #C6A87C;
      margin-bottom: 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 20px;
    }

    .form-group label {
      color: #C6A87C;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 500;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      padding: 14px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #FAFAFA;
      font-size: 1rem;
      font-family: 'Montserrat', sans-serif;
      transition: all 0.3s;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: #C6A87C;
      background: rgba(255, 255, 255, 0.08);
    }

    .form-group input::placeholder,
    .form-group textarea::placeholder {
      color: #666;
    }

    .form-group select {
      cursor: pointer;
    }

    .form-group select option {
      background: #1a1a1a;
      color: #FAFAFA;
    }

    .error-message {
      color: #EF4444;
      text-align: center;
      font-size: 0.875rem;
      padding: 12px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .btn-place-order {
      width: 100%;
      padding: 18px;
      font-size: 1.125rem;
    }

    .btn-place-order:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Order Summary */
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

    .summary-items {
      max-height: 300px;
      overflow-y: auto;
      margin-bottom: 16px;
    }

    .summary-item {
      display: grid;
      grid-template-columns: 60px 1fr auto;
      gap: 16px;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .summary-item:last-child {
      border-bottom: none;
    }

    .summary-item-image {
      width: 60px;
      height: 75px;
      overflow: hidden;
    }

    .summary-item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .summary-item-name {
      color: #FAFAFA;
      font-size: 0.875rem;
      margin-bottom: 4px;
    }

    .summary-item-qty {
      color: #A1A1AA;
      font-size: 0.75rem;
    }

    .summary-item-price {
      color: #C6A87C;
      font-weight: 500;
    }

    .divider {
      height: 1px;
      background: rgba(198, 168, 124, 0.2);
      margin: 16px 0;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      color: #D4D4D8;
      font-size: 0.9375rem;
    }

    .summary-row.total {
      font-size: 1.25rem;
      font-weight: 600;
      color: #FAFAFA;
      padding-top: 16px;
    }

    .summary-row.total span:last-child {
      color: #C6A87C;
    }

    .edit-cart-link {
      display: block;
      text-align: center;
      color: #C6A87C;
      font-size: 0.875rem;
      margin-top: 20px;
      text-decoration: none;
      transition: color 0.3s;
    }

    .edit-cart-link:hover {
      color: #E5CFA0;
    }

    /* Security Info */
    .security-info {
      margin-top: 24px;
      padding: 20px;
      background: rgba(198, 168, 124, 0.05);
      border: 1px solid rgba(198, 168, 124, 0.2);
    }

    .security-item {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #A1A1AA;
      font-size: 0.875rem;
      padding: 8px 0;
    }

    .security-icon {
      font-size: 1.125rem;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .checkout-content {
        grid-template-columns: 1fr;
      }

      .summary-card {
        position: static;
      }

      .order-summary-section {
        order: -1;
      }
    }

    @media (max-width: 640px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .checkout-title {
        font-size: 2rem;
      }

      .checkout-page {
        padding: 24px 16px 60px;
      }

      .form-section {
        padding: 24px 16px;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  orderSuccess = false;
  orderId = '';
  loading = false;
  errorMessage = '';
  private cartSubscription?: Subscription;

  shippingInfo = {
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    instructions: ''
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    this.cartSubscription = this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });

    // Pre-fill user info if available
    const user = this.authService.getCurrentUser();
    if (user) {
      this.shippingInfo.fullName = user.fullName;
      this.shippingInfo.email = user.email;
    }
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }

  getProductImage(product: any): string {
    return product.images?.[0] || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200';
  }

  getCartTotal(): number {
    return this.cartService.getCartTotal();
  }

  getFinalTotal(): number {
    const subtotal = this.getCartTotal();
    const shipping = subtotal >= 1000 ? 0 : 50;
    return subtotal + shipping;
  }

  placeOrder(): void {
    // Validation
    if (!this.shippingInfo.fullName || !this.shippingInfo.phone || 
        !this.shippingInfo.email || !this.shippingInfo.address ||
        !this.shippingInfo.city || !this.shippingInfo.zipCode ||
        !this.shippingInfo.country) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const fullAddress = `${this.shippingInfo.address}, ${this.shippingInfo.city}, ${this.shippingInfo.zipCode}, ${this.shippingInfo.country}`;
    
    const orderRequest = {
      items: this.cartItems.map(item => ({
        productId: item.product.id!,
        quantity: item.quantity
      })),
      shippingAddress: fullAddress,
      phone: this.shippingInfo.phone
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: (order) => {
        this.loading = false;
        this.orderSuccess = true;
        this.orderId = order.id?.toString() || 'N/A';
        this.cartService.clearCart();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Failed to place order. Please try again.';
      }
    });
  }
}
