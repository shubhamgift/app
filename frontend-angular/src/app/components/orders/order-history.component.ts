import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="orders-page">
      <div class="orders-container">
        <h1 class="orders-title" data-testid="orders-title">My Orders</h1>

        <!-- Loading State -->
        <div *ngIf="loading" class="loading-container">
          <div class="spinner"></div>
          <p>Loading your orders...</p>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && orders.length === 0" class="empty-orders" data-testid="empty-orders">
          <div class="empty-icon">&#128230;</div>
          <h2>No Orders Yet</h2>
          <p>Start shopping and your orders will appear here</p>
          <a routerLink="/products" class="btn-primary" data-testid="start-shopping-btn">
            Start Shopping
          </a>
        </div>

        <!-- Orders List -->
        <div *ngIf="!loading && orders.length > 0" class="orders-list" data-testid="orders-list">
          <div 
            *ngFor="let order of orders; let i = index" 
            class="order-card"
            [attr.data-testid]="'order-card-' + i">
            
            <!-- Order Header -->
            <div class="order-header">
              <div class="order-id">
                <span class="label">Order ID</span>
                <span class="value" [attr.data-testid]="'order-id-' + i">#{{ order.id }}</span>
              </div>
              <div class="order-date">
                <span class="label">Placed On</span>
                <span class="value">{{ formatDate(order.createdAt) }}</span>
              </div>
              <div class="order-total">
                <span class="label">Total</span>
                <span class="value">\${{ order.totalAmount | number:'1.2-2' }}</span>
              </div>
              <div class="order-status" [class]="getStatusClass(order.status)">
                <span class="status-badge" [attr.data-testid]="'order-status-' + i">
                  {{ order.status }}
                </span>
              </div>
            </div>

            <!-- Order Items -->
            <div class="order-items">
              <div 
                *ngFor="let item of order.items; let j = index" 
                class="order-item"
                [attr.data-testid]="'order-item-' + i + '-' + j">
                <div class="item-image">
                  <img [src]="getProductImage(item.product)" [alt]="item.product?.name">
                </div>
                <div class="item-details">
                  <h4 class="item-name">{{ item.product?.name || 'Product' }}</h4>
                  <p class="item-meta">
                    <span>Qty: {{ item.quantity }}</span>
                    <span class="divider">|</span>
                    <span>\${{ item.price | number:'1.2-2' }} each</span>
                  </p>
                </div>
                <p class="item-subtotal">\${{ (item.price * item.quantity) | number:'1.2-2' }}</p>
              </div>
            </div>

            <!-- Order Footer -->
            <div class="order-footer">
              <div class="shipping-info">
                <span class="label">Shipping to:</span>
                <span class="address">{{ order.shippingAddress }}</span>
              </div>
              <button 
                class="btn-outline btn-view-details"
                (click)="toggleDetails(order)"
                [attr.data-testid]="'view-details-' + i">
                {{ order.expanded ? 'Hide Details' : 'View Details' }}
              </button>
            </div>

            <!-- Expanded Details -->
            <div *ngIf="order.expanded" class="order-details-expanded" [attr.data-testid]="'expanded-details-' + i">
              <div class="detail-row">
                <span class="detail-label">Contact Phone:</span>
                <span class="detail-value">{{ order.phone }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Last Updated:</span>
                <span class="detail-value">{{ formatDate(order.updatedAt) }}</span>
              </div>
              <div class="detail-row" *ngIf="getStatusMessage(order.status)">
                <span class="detail-label">Status Info:</span>
                <span class="detail-value">{{ getStatusMessage(order.status) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-page {
      min-height: 100vh;
      padding: 40px 24px 80px;
    }

    .orders-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .orders-title {
      font-family: 'Bodoni Moda', serif;
      font-size: 2.5rem;
      color: #C6A87C;
      margin-bottom: 48px;
      text-align: center;
      letter-spacing: 1px;
    }

    /* Loading State */
    .loading-container {
      text-align: center;
      padding: 80px 24px;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(198, 168, 124, 0.3);
      border-top-color: #C6A87C;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 24px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-container p {
      color: #A1A1AA;
    }

    /* Empty State */
    .empty-orders {
      text-align: center;
      padding: 80px 24px;
    }

    .empty-icon {
      font-size: 5rem;
      margin-bottom: 24px;
      opacity: 0.5;
    }

    .empty-orders h2 {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.75rem;
      color: #FAFAFA;
      margin-bottom: 12px;
    }

    .empty-orders p {
      color: #A1A1AA;
      margin-bottom: 32px;
    }

    /* Orders List */
    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .order-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(198, 168, 124, 0.2);
      overflow: hidden;
      transition: border-color 0.3s;
    }

    .order-card:hover {
      border-color: rgba(198, 168, 124, 0.4);
    }

    /* Order Header */
    .order-header {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      padding: 24px;
      background: rgba(198, 168, 124, 0.05);
      border-bottom: 1px solid rgba(198, 168, 124, 0.1);
    }

    .order-header > div {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .order-header .label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #A1A1AA;
    }

    .order-header .value {
      font-size: 1rem;
      color: #FAFAFA;
      font-weight: 500;
    }

    .order-id .value {
      color: #C6A87C;
      font-family: 'Bodoni Moda', serif;
      font-size: 1.25rem;
    }

    .order-total .value {
      color: #C6A87C;
      font-size: 1.125rem;
    }

    /* Status Badge */
    .order-status {
      align-items: flex-start !important;
    }

    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
      border-radius: 0;
    }

    .status-pending .status-badge {
      background: rgba(245, 158, 11, 0.2);
      color: #F59E0B;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .status-processing .status-badge {
      background: rgba(59, 130, 246, 0.2);
      color: #3B82F6;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .status-shipped .status-badge {
      background: rgba(139, 92, 246, 0.2);
      color: #8B5CF6;
      border: 1px solid rgba(139, 92, 246, 0.3);
    }

    .status-delivered .status-badge {
      background: rgba(16, 185, 129, 0.2);
      color: #10B981;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .status-cancelled .status-badge {
      background: rgba(239, 68, 68, 0.2);
      color: #EF4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    /* Order Items */
    .order-items {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .order-item {
      display: grid;
      grid-template-columns: 80px 1fr auto;
      gap: 16px;
      align-items: center;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .order-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .item-image {
      width: 80px;
      height: 100px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.05);
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-name {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.125rem;
      color: #FAFAFA;
      margin-bottom: 8px;
    }

    .item-meta {
      color: #A1A1AA;
      font-size: 0.875rem;
    }

    .item-meta .divider {
      margin: 0 8px;
      opacity: 0.5;
    }

    .item-subtotal {
      color: #C6A87C;
      font-size: 1rem;
      font-weight: 500;
    }

    /* Order Footer */
    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: rgba(0, 0, 0, 0.2);
      border-top: 1px solid rgba(198, 168, 124, 0.1);
    }

    .shipping-info {
      display: flex;
      gap: 8px;
      color: #A1A1AA;
      font-size: 0.875rem;
    }

    .shipping-info .label {
      color: #C6A87C;
    }

    .shipping-info .address {
      max-width: 400px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .btn-view-details {
      padding: 8px 20px;
      font-size: 0.875rem;
    }

    /* Expanded Details */
    .order-details-expanded {
      padding: 24px;
      background: rgba(198, 168, 124, 0.03);
      border-top: 1px solid rgba(198, 168, 124, 0.1);
    }

    .detail-row {
      display: flex;
      gap: 16px;
      padding: 8px 0;
    }

    .detail-label {
      color: #A1A1AA;
      min-width: 140px;
      font-size: 0.875rem;
    }

    .detail-value {
      color: #FAFAFA;
      font-size: 0.875rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .order-header {
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .order-item {
        grid-template-columns: 60px 1fr;
      }

      .item-subtotal {
        grid-column: 2;
      }

      .order-footer {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }

      .shipping-info .address {
        max-width: 100%;
        white-space: normal;
      }

      .btn-view-details {
        width: 100%;
      }
    }

    @media (max-width: 640px) {
      .orders-title {
        font-size: 2rem;
      }

      .orders-page {
        padding: 24px 16px 60px;
      }

      .order-header,
      .order-items,
      .order-footer {
        padding: 16px;
      }
    }
  `]
})
export class OrderHistoryComponent implements OnInit {
  orders: (Order & { expanded?: boolean })[] = [];
  loading = false;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders = orders.map(order => ({ ...order, expanded: false }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getProductImage(product: any): string {
    return product?.images?.[0] || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200';
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'status-pending',
      'PROCESSING': 'status-processing',
      'SHIPPED': 'status-shipped',
      'DELIVERED': 'status-delivered',
      'CANCELLED': 'status-cancelled'
    };
    return statusMap[status?.toUpperCase()] || 'status-pending';
  }

  getStatusMessage(status: string): string {
    const messages: { [key: string]: string } = {
      'PENDING': 'Your order is being reviewed and will be processed shortly.',
      'PROCESSING': 'Your order is being prepared for shipment.',
      'SHIPPED': 'Your order has been shipped and is on its way!',
      'DELIVERED': 'Your order has been delivered. Enjoy!',
      'CANCELLED': 'This order has been cancelled.'
    };
    return messages[status?.toUpperCase()] || '';
  }

  toggleDetails(order: Order & { expanded?: boolean }): void {
    order.expanded = !order.expanded;
  }
}
