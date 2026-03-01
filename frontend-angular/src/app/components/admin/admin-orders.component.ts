import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-orders">
      <div class="page-header">
        <h1 data-testid="admin-orders-title">Order Management</h1>
        <p>View and manage customer orders</p>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            placeholder="Search by order ID or customer..."
            (input)="filterOrders()"
            data-testid="search-input">
        </div>
        <select [(ngModel)]="selectedStatus" (change)="filterOrders()" data-testid="status-filter">
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <!-- Stats Bar -->
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-value">{{ totalOrders }}</span>
          <span class="stat-label">Total Orders</span>
        </div>
        <div class="stat-item pending">
          <span class="stat-value">{{ pendingCount }}</span>
          <span class="stat-label">Pending</span>
        </div>
        <div class="stat-item processing">
          <span class="stat-value">{{ processingCount }}</span>
          <span class="stat-label">Processing</span>
        </div>
        <div class="stat-item shipped">
          <span class="stat-value">{{ shippedCount }}</span>
          <span class="stat-label">Shipped</span>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="orders-table" data-testid="orders-table">
        <div class="table-header">
          <span class="col-id">Order ID</span>
          <span class="col-customer">Customer</span>
          <span class="col-items">Items</span>
          <span class="col-total">Total</span>
          <span class="col-date">Date</span>
          <span class="col-status">Status</span>
          <span class="col-actions">Actions</span>
        </div>

        <div *ngIf="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading orders...</p>
        </div>

        <div *ngIf="!loading && filteredOrders.length === 0" class="empty-state">
          <p>No orders found</p>
        </div>

        <div 
          *ngFor="let order of filteredOrders; let i = index" 
          class="table-row"
          [attr.data-testid]="'order-row-' + i">
          <div class="col-id">
            <span class="order-id">#{{ order.id }}</span>
          </div>
          <div class="col-customer">
            <h4>{{ order.user?.fullName || 'Guest' }}</h4>
            <p>{{ order.user?.email || 'N/A' }}</p>
          </div>
          <div class="col-items">
            <span>{{ order.items?.length || 0 }} item(s)</span>
          </div>
          <div class="col-total">
            \${{ order.totalAmount | number:'1.2-2' }}
          </div>
          <div class="col-date">
            {{ formatDate(order.createdAt) }}
          </div>
          <div class="col-status">
            <span class="status-badge" [class]="order.status?.toLowerCase()">
              {{ order.status }}
            </span>
          </div>
          <div class="col-actions">
            <button class="btn-icon view" (click)="viewOrder(order)" [attr.data-testid]="'view-' + i">
              &#128065;
            </button>
            <button class="btn-icon edit" (click)="openStatusModal(order)" [attr.data-testid]="'edit-' + i">
              &#9998;
            </button>
          </div>
        </div>
      </div>

      <!-- Order Detail Modal -->
      <div *ngIf="showDetailModal" class="modal-overlay" (click)="closeDetailModal()">
        <div class="modal-content detail-modal" (click)="$event.stopPropagation()" data-testid="order-detail-modal">
          <div class="modal-header">
            <h2>Order #{{ selectedOrder?.id }}</h2>
            <button class="close-btn" (click)="closeDetailModal()">&#10005;</button>
          </div>

          <div class="order-detail-content" *ngIf="selectedOrder">
            <div class="detail-section">
              <h3>Customer Information</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="label">Name:</span>
                  <span>{{ selectedOrder.user?.fullName || 'N/A' }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Email:</span>
                  <span>{{ selectedOrder.user?.email || 'N/A' }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Phone:</span>
                  <span>{{ selectedOrder.phone || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3>Shipping Address</h3>
              <p class="address">{{ selectedOrder.shippingAddress }}</p>
            </div>

            <div class="detail-section">
              <h3>Order Items</h3>
              <div class="items-list">
                <div *ngFor="let item of selectedOrder.items" class="order-item">
                  <div class="item-image">
                    <img [src]="getProductImage(item.product)" [alt]="item.product?.name">
                  </div>
                  <div class="item-info">
                    <h4>{{ item.product?.name }}</h4>
                    <p>Qty: {{ item.quantity }} × \${{ item.price | number:'1.2-2' }}</p>
                  </div>
                  <div class="item-total">
                    \${{ (item.price * item.quantity) | number:'1.2-2' }}
                  </div>
                </div>
              </div>
            </div>

            <div class="order-summary">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>\${{ selectedOrder.totalAmount | number:'1.2-2' }}</span>
              </div>
              <div class="summary-row">
                <span>Shipping:</span>
                <span>{{ selectedOrder.totalAmount >= 1000 ? 'Free' : '$50.00' }}</span>
              </div>
              <div class="summary-row total">
                <span>Total:</span>
                <span>\${{ getFinalTotal(selectedOrder) | number:'1.2-2' }}</span>
              </div>
            </div>

            <div class="order-timeline">
              <h3>Order Status</h3>
              <div class="status-display">
                <span class="status-badge large" [class]="selectedOrder.status?.toLowerCase()">
                  {{ selectedOrder.status }}
                </span>
                <span class="status-date">Last updated: {{ formatDate(selectedOrder.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Status Update Modal -->
      <div *ngIf="showStatusModal" class="modal-overlay" (click)="closeStatusModal()">
        <div class="modal-content status-modal" (click)="$event.stopPropagation()" data-testid="status-modal">
          <div class="modal-header">
            <h2>Update Order Status</h2>
            <button class="close-btn" (click)="closeStatusModal()">&#10005;</button>
          </div>

          <div class="status-form">
            <p class="order-info">Order #{{ selectedOrder?.id }} - {{ selectedOrder?.user?.fullName }}</p>
            
            <div class="current-status">
              <span class="label">Current Status:</span>
              <span class="status-badge" [class]="selectedOrder?.status?.toLowerCase()">
                {{ selectedOrder?.status }}
              </span>
            </div>

            <div class="form-group">
              <label>New Status</label>
              <select [(ngModel)]="newStatus" data-testid="new-status-select">
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div class="status-actions">
              <button class="btn-outline" (click)="closeStatusModal()">Cancel</button>
              <button 
                class="btn-primary" 
                (click)="updateOrderStatus()"
                [disabled]="updating"
                data-testid="update-status-btn">
                {{ updating ? 'Updating...' : 'Update Status' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-orders {
      padding: 40px 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-family: 'Bodoni Moda', serif;
      font-size: 2rem;
      color: #C6A87C;
      margin-bottom: 8px;
    }

    .page-header p {
      color: #A1A1AA;
    }

    /* Filters */
    .filters-bar {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }

    .search-box {
      flex: 1;
      max-width: 400px;
    }

    .search-box input,
    .filters-bar select {
      width: 100%;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #FAFAFA;
      font-size: 0.9375rem;
    }

    .filters-bar select {
      width: 180px;
      cursor: pointer;
    }

    .filters-bar select option {
      background: #1a1a1a;
    }

    /* Stats Bar */
    .stats-bar {
      display: flex;
      gap: 24px;
      margin-bottom: 24px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(198, 168, 124, 0.2);
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stat-value {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.5rem;
      color: #FAFAFA;
    }

    .stat-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #A1A1AA;
    }

    .stat-item.pending .stat-value { color: #F59E0B; }
    .stat-item.processing .stat-value { color: #3B82F6; }
    .stat-item.shipped .stat-value { color: #8B5CF6; }

    /* Orders Table */
    .orders-table {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(198, 168, 124, 0.2);
    }

    .table-header {
      display: grid;
      grid-template-columns: 80px 1fr 80px 100px 120px 100px 80px;
      gap: 16px;
      padding: 16px 20px;
      background: rgba(198, 168, 124, 0.05);
      border-bottom: 1px solid rgba(198, 168, 124, 0.1);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #A1A1AA;
    }

    .table-row {
      display: grid;
      grid-template-columns: 80px 1fr 80px 100px 120px 100px 80px;
      gap: 16px;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      align-items: center;
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .table-row:hover {
      background: rgba(198, 168, 124, 0.03);
    }

    .order-id {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.125rem;
      color: #C6A87C;
    }

    .col-customer h4 {
      color: #FAFAFA;
      font-size: 0.9375rem;
      margin-bottom: 4px;
    }

    .col-customer p {
      color: #A1A1AA;
      font-size: 0.8125rem;
    }

    .col-items,
    .col-date {
      color: #D4D4D8;
      font-size: 0.875rem;
    }

    .col-total {
      color: #C6A87C;
      font-weight: 600;
      font-size: 0.9375rem;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    .status-badge.pending {
      background: rgba(245, 158, 11, 0.2);
      color: #F59E0B;
    }

    .status-badge.processing {
      background: rgba(59, 130, 246, 0.2);
      color: #3B82F6;
    }

    .status-badge.shipped {
      background: rgba(139, 92, 246, 0.2);
      color: #8B5CF6;
    }

    .status-badge.delivered {
      background: rgba(16, 185, 129, 0.2);
      color: #10B981;
    }

    .status-badge.cancelled {
      background: rgba(239, 68, 68, 0.2);
      color: #EF4444;
    }

    .status-badge.large {
      padding: 8px 20px;
      font-size: 0.875rem;
    }

    .col-actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #A1A1AA;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 0.875rem;
    }

    .btn-icon.view:hover {
      border-color: #3B82F6;
      color: #3B82F6;
    }

    .btn-icon.edit:hover {
      border-color: #C6A87C;
      color: #C6A87C;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 24px;
    }

    .modal-content {
      background: #0a0a0a;
      border: 1px solid rgba(198, 168, 124, 0.3);
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .detail-modal {
      max-width: 700px;
    }

    .status-modal {
      max-width: 450px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid rgba(198, 168, 124, 0.2);
    }

    .modal-header h2 {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.5rem;
      color: #C6A87C;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: #A1A1AA;
      font-size: 1.5rem;
      cursor: pointer;
    }

    /* Order Detail Content */
    .order-detail-content {
      padding: 24px;
    }

    .detail-section {
      margin-bottom: 28px;
    }

    .detail-section h3 {
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #C6A87C;
      margin-bottom: 16px;
    }

    .detail-grid {
      display: grid;
      gap: 12px;
    }

    .detail-item {
      display: flex;
      gap: 12px;
    }

    .detail-item .label {
      color: #A1A1AA;
      min-width: 80px;
    }

    .detail-item span:last-child {
      color: #FAFAFA;
    }

    .address {
      color: #D4D4D8;
      line-height: 1.6;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .order-item {
      display: flex;
      gap: 16px;
      align-items: center;
      padding: 12px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .item-image {
      width: 60px;
      height: 75px;
      overflow: hidden;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-info {
      flex: 1;
    }

    .item-info h4 {
      color: #FAFAFA;
      font-size: 0.9375rem;
      margin-bottom: 4px;
    }

    .item-info p {
      color: #A1A1AA;
      font-size: 0.8125rem;
    }

    .item-total {
      color: #C6A87C;
      font-weight: 600;
    }

    .order-summary {
      padding: 20px;
      background: rgba(198, 168, 124, 0.05);
      border: 1px solid rgba(198, 168, 124, 0.2);
      margin-bottom: 24px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      color: #D4D4D8;
    }

    .summary-row.total {
      border-top: 1px solid rgba(198, 168, 124, 0.2);
      margin-top: 8px;
      padding-top: 16px;
      font-size: 1.125rem;
      font-weight: 600;
      color: #FAFAFA;
    }

    .summary-row.total span:last-child {
      color: #C6A87C;
    }

    .order-timeline {
      padding: 20px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .order-timeline h3 {
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #C6A87C;
      margin-bottom: 16px;
    }

    .status-display {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .status-date {
      color: #A1A1AA;
      font-size: 0.8125rem;
    }

    /* Status Form */
    .status-form {
      padding: 24px;
    }

    .order-info {
      color: #FAFAFA;
      margin-bottom: 20px;
    }

    .current-status {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .current-status .label {
      color: #A1A1AA;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-group label {
      display: block;
      color: #C6A87C;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }

    .form-group select {
      width: 100%;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #FAFAFA;
      font-size: 0.9375rem;
      cursor: pointer;
    }

    .form-group select option {
      background: #1a1a1a;
    }

    .status-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
    }

    /* Loading & Empty */
    .loading-state,
    .empty-state {
      padding: 60px 24px;
      text-align: center;
      color: #A1A1AA;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(198, 168, 124, 0.3);
      border-top-color: #C6A87C;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 1024px) {
      .table-header,
      .table-row {
        grid-template-columns: 70px 1fr 80px 90px 90px 80px;
      }

      .col-items {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .stats-bar {
        flex-wrap: wrap;
      }

      .filters-bar {
        flex-direction: column;
      }

      .filters-bar select {
        width: 100%;
      }
    }
  `]
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  
  loading = false;
  updating = false;
  showDetailModal = false;
  showStatusModal = false;
  selectedOrder: Order | null = null;
  newStatus = '';
  
  searchTerm = '';
  selectedStatus = '';

  // Stats
  totalOrders = 0;
  pendingCount = 0;
  processingCount = 0;
  shippedCount = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.adminService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filteredOrders = orders;
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.totalOrders = this.orders.length;
    this.pendingCount = this.orders.filter(o => o.status === 'PENDING').length;
    this.processingCount = this.orders.filter(o => o.status === 'PROCESSING').length;
    this.shippedCount = this.orders.filter(o => o.status === 'SHIPPED').length;
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = !this.searchTerm || 
        order.id?.toString().includes(this.searchTerm) ||
        order.user?.fullName?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.selectedStatus || order.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
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

  getFinalTotal(order: Order): number {
    const shipping = order.totalAmount >= 1000 ? 0 : 50;
    return order.totalAmount + shipping;
  }

  viewOrder(order: Order): void {
    this.selectedOrder = order;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedOrder = null;
  }

  openStatusModal(order: Order): void {
    this.selectedOrder = order;
    this.newStatus = order.status;
    this.showStatusModal = true;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    this.selectedOrder = null;
    this.newStatus = '';
  }

  updateOrderStatus(): void {
    if (!this.selectedOrder || !this.newStatus) return;

    this.updating = true;
    this.adminService.updateOrderStatus(this.selectedOrder.id!, this.newStatus).subscribe({
      next: () => {
        this.updating = false;
        this.closeStatusModal();
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.updating = false;
      }
    });
  }
}
