import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomRequestService } from '../../services/custom-request.service';
import { CustomRequest } from '../../models/custom-request.model';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="requests-page">
      <div class="requests-container">
        <div class="page-header">
          <h1 class="page-title" data-testid="my-requests-title">My Custom Requests</h1>
          <a routerLink="/custom-request" class="btn-primary" data-testid="new-request-btn">
            + New Request
          </a>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="loading-container">
          <div class="spinner"></div>
          <p>Loading your requests...</p>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && requests.length === 0" class="empty-state" data-testid="empty-requests">
          <div class="empty-icon">&#128142;</div>
          <h2>No Custom Requests Yet</h2>
          <p>Create your first custom jewellery request and bring your dream design to life</p>
          <a routerLink="/custom-request" class="btn-primary" data-testid="create-first-request-btn">
            Create Custom Request
          </a>
        </div>

        <!-- Requests List -->
        <div *ngIf="!loading && requests.length > 0" class="requests-list" data-testid="requests-list">
          <div 
            *ngFor="let request of requests; let i = index" 
            class="request-card"
            [attr.data-testid]="'request-card-' + i">
            
            <div class="request-header">
              <div class="request-info">
                <h3 class="request-name" [attr.data-testid]="'request-name-' + i">{{ request.name }}</h3>
                <p class="request-date">Submitted: {{ formatDate(request.createdAt) }}</p>
              </div>
              <div class="request-status" [class]="getStatusClass(request.status)">
                <span class="status-badge" [attr.data-testid]="'request-status-' + i">{{ request.status }}</span>
              </div>
            </div>

            <div class="request-body">
              <p class="request-description" [attr.data-testid]="'request-description-' + i">
                {{ truncateDescription(request.description) }}
              </p>

              <!-- Reference Images -->
              <div *ngIf="request.referenceImages && request.referenceImages.length > 0" class="reference-images">
                <span class="images-label">Reference Images:</span>
                <div class="images-preview">
                  <div 
                    *ngFor="let image of request.referenceImages.slice(0, 3); let j = index" 
                    class="image-thumb"
                    [attr.data-testid]="'request-image-' + i + '-' + j">
                    <img [src]="image" alt="Reference">
                  </div>
                  <div *ngIf="request.referenceImages.length > 3" class="more-images">
                    +{{ request.referenceImages.length - 3 }} more
                  </div>
                </div>
              </div>
            </div>

            <!-- Admin Response -->
            <div *ngIf="request.adminResponse" class="admin-response" [attr.data-testid]="'admin-response-' + i">
              <h4>Response from Designer:</h4>
              <p>{{ request.adminResponse }}</p>
            </div>

            <div class="request-footer">
              <span class="last-updated">Last updated: {{ formatDate(request.updatedAt) }}</span>
              <button 
                class="btn-outline btn-details"
                (click)="toggleDetails(request)"
                [attr.data-testid]="'toggle-details-' + i">
                {{ request.expanded ? 'Hide Details' : 'View Full Details' }}
              </button>
            </div>

            <!-- Expanded Details -->
            <div *ngIf="request.expanded" class="expanded-details" [attr.data-testid]="'expanded-' + i">
              <h4>Full Description:</h4>
              <pre class="full-description">{{ request.description }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .requests-page {
      min-height: 100vh;
      padding: 40px 24px 80px;
    }

    .requests-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 48px;
    }

    .page-title {
      font-family: 'Bodoni Moda', serif;
      font-size: 2.5rem;
      color: #C6A87C;
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
    .empty-state {
      text-align: center;
      padding: 80px 24px;
    }

    .empty-icon {
      font-size: 5rem;
      margin-bottom: 24px;
      opacity: 0.5;
    }

    .empty-state h2 {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.75rem;
      color: #FAFAFA;
      margin-bottom: 12px;
    }

    .empty-state p {
      color: #A1A1AA;
      margin-bottom: 32px;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    /* Requests List */
    .requests-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .request-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(198, 168, 124, 0.2);
      overflow: hidden;
      transition: border-color 0.3s;
    }

    .request-card:hover {
      border-color: rgba(198, 168, 124, 0.4);
    }

    /* Request Header */
    .request-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 24px;
      background: rgba(198, 168, 124, 0.05);
      border-bottom: 1px solid rgba(198, 168, 124, 0.1);
    }

    .request-name {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.5rem;
      color: #FAFAFA;
      margin-bottom: 8px;
    }

    .request-date {
      color: #A1A1AA;
      font-size: 0.875rem;
    }

    /* Status Badge */
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    .status-pending .status-badge {
      background: rgba(245, 158, 11, 0.2);
      color: #F59E0B;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .status-reviewing .status-badge {
      background: rgba(59, 130, 246, 0.2);
      color: #3B82F6;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .status-quoted .status-badge {
      background: rgba(139, 92, 246, 0.2);
      color: #8B5CF6;
      border: 1px solid rgba(139, 92, 246, 0.3);
    }

    .status-approved .status-badge {
      background: rgba(16, 185, 129, 0.2);
      color: #10B981;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .status-in-progress .status-badge {
      background: rgba(198, 168, 124, 0.2);
      color: #C6A87C;
      border: 1px solid rgba(198, 168, 124, 0.3);
    }

    .status-completed .status-badge {
      background: rgba(16, 185, 129, 0.2);
      color: #10B981;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .status-cancelled .status-badge {
      background: rgba(239, 68, 68, 0.2);
      color: #EF4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    /* Request Body */
    .request-body {
      padding: 24px;
    }

    .request-description {
      color: #D4D4D8;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .reference-images {
      margin-top: 16px;
    }

    .images-label {
      color: #A1A1AA;
      font-size: 0.875rem;
      display: block;
      margin-bottom: 12px;
    }

    .images-preview {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .image-thumb {
      width: 60px;
      height: 60px;
      overflow: hidden;
      border: 1px solid rgba(198, 168, 124, 0.3);
    }

    .image-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .more-images {
      color: #C6A87C;
      font-size: 0.875rem;
    }

    /* Admin Response */
    .admin-response {
      padding: 20px 24px;
      background: rgba(16, 185, 129, 0.05);
      border-top: 1px solid rgba(16, 185, 129, 0.2);
      border-bottom: 1px solid rgba(16, 185, 129, 0.2);
    }

    .admin-response h4 {
      color: #10B981;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }

    .admin-response p {
      color: #D4D4D8;
      line-height: 1.6;
    }

    /* Request Footer */
    .request-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: rgba(0, 0, 0, 0.2);
    }

    .last-updated {
      color: #A1A1AA;
      font-size: 0.875rem;
    }

    .btn-details {
      padding: 8px 20px;
      font-size: 0.875rem;
    }

    /* Expanded Details */
    .expanded-details {
      padding: 24px;
      background: rgba(198, 168, 124, 0.03);
      border-top: 1px solid rgba(198, 168, 124, 0.1);
    }

    .expanded-details h4 {
      color: #C6A87C;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }

    .full-description {
      color: #D4D4D8;
      font-family: 'Montserrat', sans-serif;
      font-size: 0.9375rem;
      line-height: 1.8;
      white-space: pre-wrap;
      margin: 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 24px;
        text-align: center;
      }

      .request-header {
        flex-direction: column;
        gap: 16px;
      }

      .request-footer {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }

      .btn-details {
        width: 100%;
      }
    }

    @media (max-width: 640px) {
      .page-title {
        font-size: 2rem;
      }

      .requests-page {
        padding: 24px 16px 60px;
      }

      .request-header,
      .request-body,
      .request-footer,
      .expanded-details {
        padding: 16px;
      }
    }
  `]
})
export class MyRequestsComponent implements OnInit {
  requests: (CustomRequest & { expanded?: boolean })[] = [];
  loading = false;

  constructor(private customRequestService: CustomRequestService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.customRequestService.getMyRequests().subscribe({
      next: (requests) => {
        this.requests = requests.map(req => ({ ...req, expanded: false }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading requests:', error);
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
      day: 'numeric'
    });
  }

  truncateDescription(description: string): string {
    if (!description) return '';
    const maxLength = 200;
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'status-pending',
      'REVIEWING': 'status-reviewing',
      'QUOTED': 'status-quoted',
      'APPROVED': 'status-approved',
      'IN_PROGRESS': 'status-in-progress',
      'COMPLETED': 'status-completed',
      'CANCELLED': 'status-cancelled'
    };
    return statusMap[status?.toUpperCase()] || 'status-pending';
  }

  toggleDetails(request: CustomRequest & { expanded?: boolean }): void {
    request.expanded = !request.expanded;
  }
}
