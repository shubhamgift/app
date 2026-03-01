import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRequests: number;
  pendingOrders: number;
  revenue: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-dashboard">
      <div class="dashboard-header">
        <h1 data-testid="admin-dashboard-title">Admin Dashboard</h1>
        <p class="subtitle">Welcome back, Admin</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid" data-testid="stats-grid">
        <div class="stat-card" data-testid="stat-products">
          <div class="stat-icon products">&#128142;</div>
          <div class="stat-content">
            <h3>{{ stats.totalProducts }}</h3>
            <p>Total Products</p>
          </div>
          <a routerLink="/admin/products" class="stat-link">Manage</a>
        </div>

        <div class="stat-card" data-testid="stat-orders">
          <div class="stat-icon orders">&#128230;</div>
          <div class="stat-content">
            <h3>{{ stats.totalOrders }}</h3>
            <p>Total Orders</p>
          </div>
          <a routerLink="/admin/orders" class="stat-link">View All</a>
        </div>

        <div class="stat-card highlight" data-testid="stat-pending">
          <div class="stat-icon pending">&#9203;</div>
          <div class="stat-content">
            <h3>{{ stats.pendingOrders }}</h3>
            <p>Pending Orders</p>
          </div>
          <a routerLink="/admin/orders" class="stat-link">Process</a>
        </div>

        <div class="stat-card" data-testid="stat-requests">
          <div class="stat-icon requests">&#9997;</div>
          <div class="stat-content">
            <h3>{{ stats.totalRequests }}</h3>
            <p>Custom Requests</p>
          </div>
          <a routerLink="/admin/requests" class="stat-link">Review</a>
        </div>

        <div class="stat-card revenue" data-testid="stat-revenue">
          <div class="stat-icon revenue-icon">&#128176;</div>
          <div class="stat-content">
            <h3>\${{ stats.revenue | number:'1.0-0' }}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <div class="stat-card" data-testid="stat-users">
          <div class="stat-icon users">&#128100;</div>
          <div class="stat-content">
            <h3>{{ stats.totalUsers }}</h3>
            <p>Registered Users</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <a routerLink="/admin/products/new" class="action-card" data-testid="action-add-product">
            <span class="action-icon">+</span>
            <span>Add New Product</span>
          </a>
          <a routerLink="/admin/categories" class="action-card" data-testid="action-categories">
            <span class="action-icon">&#128193;</span>
            <span>Manage Categories</span>
          </a>
          <a routerLink="/admin/orders" class="action-card" data-testid="action-orders">
            <span class="action-icon">&#128203;</span>
            <span>Process Orders</span>
          </a>
          <a routerLink="/admin/requests" class="action-card" data-testid="action-requests">
            <span class="action-icon">&#128172;</span>
            <span>Custom Requests</span>
          </a>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="recent-section">
        <div class="recent-orders">
          <div class="section-header">
            <h2>Recent Orders</h2>
            <a routerLink="/admin/orders">View All</a>
          </div>
          <div class="orders-table" data-testid="recent-orders">
            <div class="table-header">
              <span>Order ID</span>
              <span>Customer</span>
              <span>Amount</span>
              <span>Status</span>
            </div>
            <div *ngFor="let order of recentOrders" class="table-row">
              <span>#{{ order.id }}</span>
              <span>{{ order.customerName }}</span>
              <span>\${{ order.amount | number:'1.2-2' }}</span>
              <span class="status" [class]="order.status.toLowerCase()">{{ order.status }}</span>
            </div>
            <div *ngIf="recentOrders.length === 0" class="empty-state">
              No recent orders
            </div>
          </div>
        </div>

        <div class="recent-requests">
          <div class="section-header">
            <h2>Recent Custom Requests</h2>
            <a routerLink="/admin/requests">View All</a>
          </div>
          <div class="requests-list" data-testid="recent-requests">
            <div *ngFor="let request of recentRequests" class="request-item">
              <div class="request-info">
                <h4>{{ request.name }}</h4>
                <p>{{ request.customerName }}</p>
              </div>
              <span class="status" [class]="request.status.toLowerCase()">{{ request.status }}</span>
            </div>
            <div *ngIf="recentRequests.length === 0" class="empty-state">
              No recent requests
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      padding: 40px 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 40px;
    }

    .dashboard-header h1 {
      font-family: 'Bodoni Moda', serif;
      font-size: 2.5rem;
      color: #C6A87C;
      margin-bottom: 8px;
    }

    .subtitle {
      color: #A1A1AA;
      font-size: 1rem;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(198, 168, 124, 0.2);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      transition: all 0.3s;
    }

    .stat-card:hover {
      border-color: rgba(198, 168, 124, 0.4);
      transform: translateY(-2px);
    }

    .stat-card.highlight {
      border-color: #F59E0B;
      background: rgba(245, 158, 11, 0.05);
    }

    .stat-card.revenue {
      border-color: #10B981;
      background: rgba(16, 185, 129, 0.05);
    }

    .stat-icon {
      font-size: 2rem;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(198, 168, 124, 0.1);
      border-radius: 8px;
    }

    .stat-content h3 {
      font-family: 'Bodoni Moda', serif;
      font-size: 2rem;
      color: #FAFAFA;
      margin-bottom: 4px;
    }

    .stat-content p {
      color: #A1A1AA;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .stat-link {
      color: #C6A87C;
      text-decoration: none;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: auto;
      transition: color 0.3s;
    }

    .stat-link:hover {
      color: #E5CFA0;
    }

    /* Quick Actions */
    .quick-actions {
      margin-bottom: 48px;
    }

    .quick-actions h2 {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.5rem;
      color: #C6A87C;
      margin-bottom: 24px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .action-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 24px;
      background: rgba(198, 168, 124, 0.05);
      border: 1px solid rgba(198, 168, 124, 0.2);
      text-decoration: none;
      color: #FAFAFA;
      transition: all 0.3s;
    }

    .action-card:hover {
      background: rgba(198, 168, 124, 0.1);
      border-color: #C6A87C;
    }

    .action-icon {
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(198, 168, 124, 0.2);
      border-radius: 8px;
      color: #C6A87C;
    }

    /* Recent Section */
    .recent-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .section-header h2 {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.25rem;
      color: #C6A87C;
    }

    .section-header a {
      color: #C6A87C;
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.3s;
    }

    .section-header a:hover {
      color: #E5CFA0;
    }

    /* Orders Table */
    .orders-table {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(198, 168, 124, 0.2);
    }

    .table-header {
      display: grid;
      grid-template-columns: 80px 1fr 100px 100px;
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
      grid-template-columns: 80px 1fr 100px 100px;
      gap: 16px;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: #D4D4D8;
      font-size: 0.9375rem;
    }

    .table-row:last-child {
      border-bottom: none;
    }

    /* Requests List */
    .requests-list {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(198, 168, 124, 0.2);
    }

    .request-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .request-item:last-child {
      border-bottom: none;
    }

    .request-info h4 {
      color: #FAFAFA;
      font-size: 0.9375rem;
      margin-bottom: 4px;
    }

    .request-info p {
      color: #A1A1AA;
      font-size: 0.8125rem;
    }

    /* Status Badge */
    .status {
      padding: 4px 12px;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    .status.pending {
      background: rgba(245, 158, 11, 0.2);
      color: #F59E0B;
    }

    .status.processing {
      background: rgba(59, 130, 246, 0.2);
      color: #3B82F6;
    }

    .status.shipped {
      background: rgba(139, 92, 246, 0.2);
      color: #8B5CF6;
    }

    .status.delivered {
      background: rgba(16, 185, 129, 0.2);
      color: #10B981;
    }

    .status.cancelled {
      background: rgba(239, 68, 68, 0.2);
      color: #EF4444;
    }

    .empty-state {
      padding: 40px 20px;
      text-align: center;
      color: #A1A1AA;
    }

    @media (max-width: 968px) {
      .recent-section {
        grid-template-columns: 1fr;
      }

      .table-header,
      .table-row {
        grid-template-columns: 60px 1fr 80px 80px;
        font-size: 0.8125rem;
      }
    }

    @media (max-width: 640px) {
      .admin-dashboard {
        padding: 24px 16px;
      }

      .dashboard-header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRequests: 0,
    pendingOrders: 0,
    revenue: 0
  };

  recentOrders: any[] = [];
  recentRequests: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load stats
    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        // Set mock data for demo
        this.stats = {
          totalProducts: 12,
          totalOrders: 48,
          totalUsers: 156,
          totalRequests: 8,
          pendingOrders: 5,
          revenue: 125750
        };
      }
    });

    // Load recent orders
    this.adminService.getAllOrders().subscribe({
      next: (orders) => {
        this.recentOrders = orders.slice(0, 5).map(order => ({
          id: order.id,
          customerName: order.user?.fullName || 'Guest',
          amount: order.totalAmount,
          status: order.status
        }));
      },
      error: () => {
        this.recentOrders = [];
      }
    });

    // Load recent requests
    this.adminService.getAllCustomRequests().subscribe({
      next: (requests) => {
        this.recentRequests = requests.slice(0, 4).map(req => ({
          name: req.name,
          customerName: req.user?.fullName || 'Guest',
          status: req.status
        }));
      },
      error: () => {
        this.recentRequests = [];
      }
    });
  }
}
