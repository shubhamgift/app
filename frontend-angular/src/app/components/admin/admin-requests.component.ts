import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { CustomRequest } from '../../models/custom-request.model';

@Component({
  selector: 'app-admin-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-requests">
      <div class="page-header">
        <h1 data-testid="admin-requests-title">Custom Requests</h1>
        <p>Manage customer custom jewellery requests</p>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <select [(ngModel)]="selectedStatus" (change)="filterRequests()" data-testid="status-filter">
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="REVIEWING">Reviewing</option>
          <option value="QUOTED">Quoted</option>
          <option value="APPROVED">Approved</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <!-- Requests List -->
      <div class="requests-list" data-testid="requests-list">
        <div *ngIf="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading requests...</p>
        </div>

        <div *ngIf="!loading && filteredRequests.length === 0" class="empty-state">
          <p>No custom requests found</p>
        </div>

        <div 
          *ngFor="let request of filteredRequests; let i = index" 
          class="request-card"
          [attr.data-testid]="'request-card-' + i">
          
          <div class="request-header">
            <div class="request-info">
              <h3>{{ request.name }}</h3>
              <p class="customer">
                <span>Customer:</span> {{ request.user?.fullName || 'Guest' }}
              </p>
              <p class="date">Submitted: {{ formatDate(request.createdAt) }}</p>
            </div>
            <div class="request-status">
              <span class="status-badge" [class]="getStatusClass(request.status)">
                {{ request.status }}
              </span>
            </div>
          </div>

          <div class="request-body">
            <div class="description-section">
              <h4>Description</h4>
              <pre class="description">{{ request.description }}</pre>
            </div>

            <div *ngIf="request.referenceImages && request.referenceImages.length > 0" class="images-section">
              <h4>Reference Images</h4>
              <div class="images-grid">
                <div *ngFor="let img of request.referenceImages; let j = index" class="image-item">
                  <img [src]="img" alt="Reference" (click)="openImageModal(img)">
                </div>
              </div>
            </div>

            <div *ngIf="request.adminResponse" class="response-section">
              <h4>Your Response</h4>
              <p class="admin-response">{{ request.adminResponse }}</p>
            </div>
          </div>

          <div class="request-actions">
            <button 
              class="btn-outline" 
              (click)="openResponseModal(request)"
              [attr.data-testid]="'respond-' + i">
              {{ request.adminResponse ? 'Update Response' : 'Respond' }}
            </button>
            <button 
              class="btn-icon status-btn" 
              (click)="openStatusModal(request)"
              [attr.data-testid]="'status-' + i"
              title="Update Status">
              &#9998;
            </button>
          </div>
        </div>
      </div>

      <!-- Response Modal -->
      <div *ngIf="showResponseModal" class="modal-overlay" (click)="closeResponseModal()">
        <div class="modal-content response-modal" (click)="$event.stopPropagation()" data-testid="response-modal">
          <div class="modal-header">
            <h2>Respond to Request</h2>
            <button class="close-btn" (click)="closeResponseModal()">&#10005;</button>
          </div>

          <div class="response-form">
            <div class="request-summary">
              <h4>{{ selectedRequest?.name }}</h4>
              <p>Customer: {{ selectedRequest?.user?.fullName }}</p>
            </div>

            <div class="form-group">
              <label>Your Response</label>
              <textarea 
                [(ngModel)]="responseText" 
                rows="6"
                placeholder="Enter your response, quote, or feedback for the customer..."
                data-testid="response-textarea"></textarea>
            </div>

            <div class="form-group">
              <label>Update Status</label>
              <select [(ngModel)]="newStatus" data-testid="response-status-select">
                <option value="PENDING">Pending</option>
                <option value="REVIEWING">Reviewing</option>
                <option value="QUOTED">Quoted</option>
                <option value="APPROVED">Approved</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div class="form-actions">
              <button class="btn-outline" (click)="closeResponseModal()">Cancel</button>
              <button 
                class="btn-primary" 
                (click)="submitResponse()"
                [disabled]="saving"
                data-testid="submit-response-btn">
                {{ saving ? 'Saving...' : 'Send Response' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Status Modal -->
      <div *ngIf="showStatusModal" class="modal-overlay" (click)="closeStatusModal()">
        <div class="modal-content status-modal" (click)="$event.stopPropagation()" data-testid="quick-status-modal">
          <div class="modal-header">
            <h2>Update Status</h2>
            <button class="close-btn" (click)="closeStatusModal()">&#10005;</button>
          </div>

          <div class="status-form">
            <p>Update status for: <strong>{{ selectedRequest?.name }}</strong></p>

            <div class="form-group">
              <label>New Status</label>
              <select [(ngModel)]="quickStatus" data-testid="quick-status-select">
                <option value="PENDING">Pending</option>
                <option value="REVIEWING">Reviewing</option>
                <option value="QUOTED">Quoted</option>
                <option value="APPROVED">Approved</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div class="form-actions">
              <button class="btn-outline" (click)="closeStatusModal()">Cancel</button>
              <button 
                class="btn-primary" 
                (click)="updateStatus()"
                [disabled]="saving"
                data-testid="quick-update-btn">
                {{ saving ? 'Updating...' : 'Update' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Image Modal -->
      <div *ngIf="showImageModal" class="modal-overlay image-modal-overlay" (click)="closeImageModal()">
        <div class="image-modal-content">
          <button class="close-image-btn" (click)="closeImageModal()">&#10005;</button>
          <img [src]="selectedImage" alt="Reference Image">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-requests {
      padding: 40px 24px;
      max-width: 1200px;
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
      margin-bottom: 24px;
    }

    .filters-bar select {
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #FAFAFA;
      font-size: 0.9375rem;
      min-width: 180px;
      cursor: pointer;
    }

    .filters-bar select option {
      background: #1a1a1a;
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
      transition: border-color 0.3s;
    }

    .request-card:hover {
      border-color: rgba(198, 168, 124, 0.4);
    }

    .request-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 24px;
      background: rgba(198, 168, 124, 0.05);
      border-bottom: 1px solid rgba(198, 168, 124, 0.1);
    }

    .request-info h3 {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.5rem;
      color: #FAFAFA;
      margin-bottom: 8px;
    }

    .request-info .customer {
      color: #D4D4D8;
      font-size: 0.9375rem;
      margin-bottom: 4px;
    }

    .request-info .customer span {
      color: #A1A1AA;
    }

    .request-info .date {
      color: #A1A1AA;
      font-size: 0.8125rem;
    }

    .status-badge {
      padding: 6px 14px;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    .status-badge.pending {
      background: rgba(245, 158, 11, 0.2);
      color: #F59E0B;
    }

    .status-badge.reviewing {
      background: rgba(59, 130, 246, 0.2);
      color: #3B82F6;
    }

    .status-badge.quoted {
      background: rgba(139, 92, 246, 0.2);
      color: #8B5CF6;
    }

    .status-badge.approved,
    .status-badge.in_progress {
      background: rgba(198, 168, 124, 0.2);
      color: #C6A87C;
    }

    .status-badge.completed {
      background: rgba(16, 185, 129, 0.2);
      color: #10B981;
    }

    .status-badge.cancelled {
      background: rgba(239, 68, 68, 0.2);
      color: #EF4444;
    }

    .request-body {
      padding: 24px;
    }

    .request-body h4 {
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #C6A87C;
      margin-bottom: 12px;
    }

    .description-section {
      margin-bottom: 24px;
    }

    .description {
      color: #D4D4D8;
      line-height: 1.7;
      white-space: pre-wrap;
      font-family: 'Montserrat', sans-serif;
      font-size: 0.9375rem;
      margin: 0;
      background: rgba(0, 0, 0, 0.2);
      padding: 16px;
      max-height: 200px;
      overflow-y: auto;
    }

    .images-section {
      margin-bottom: 24px;
    }

    .images-grid {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .image-item {
      width: 100px;
      height: 100px;
      overflow: hidden;
      border: 1px solid rgba(198, 168, 124, 0.3);
      cursor: pointer;
      transition: border-color 0.3s;
    }

    .image-item:hover {
      border-color: #C6A87C;
    }

    .image-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .response-section {
      padding: 16px;
      background: rgba(16, 185, 129, 0.05);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .admin-response {
      color: #D4D4D8;
      line-height: 1.6;
    }

    .request-actions {
      display: flex;
      gap: 12px;
      padding: 16px 24px;
      background: rgba(0, 0, 0, 0.2);
      border-top: 1px solid rgba(198, 168, 124, 0.1);
    }

    .btn-icon.status-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid rgba(198, 168, 124, 0.3);
      color: #C6A87C;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 1rem;
    }

    .btn-icon.status-btn:hover {
      background: rgba(198, 168, 124, 0.1);
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

    .response-modal {
      max-width: 600px;
    }

    .status-modal {
      max-width: 400px;
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

    .response-form,
    .status-form {
      padding: 24px;
    }

    .request-summary {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .request-summary h4 {
      color: #FAFAFA;
      font-size: 1.125rem;
      margin-bottom: 4px;
    }

    .request-summary p {
      color: #A1A1AA;
      font-size: 0.875rem;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      color: #C6A87C;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }

    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #FAFAFA;
      font-size: 0.9375rem;
      font-family: 'Montserrat', sans-serif;
    }

    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: #C6A87C;
    }

    .form-group select option {
      background: #1a1a1a;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
    }

    /* Image Modal */
    .image-modal-overlay {
      background: rgba(0, 0, 0, 0.95);
    }

    .image-modal-content {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
    }

    .image-modal-content img {
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
    }

    .close-image-btn {
      position: absolute;
      top: -40px;
      right: 0;
      background: transparent;
      border: none;
      color: #C6A87C;
      font-size: 2rem;
      cursor: pointer;
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

    @media (max-width: 768px) {
      .request-header {
        flex-direction: column;
        gap: 16px;
      }
    }
  `]
})
export class AdminRequestsComponent implements OnInit {
  requests: CustomRequest[] = [];
  filteredRequests: CustomRequest[] = [];
  
  loading = false;
  saving = false;
  showResponseModal = false;
  showStatusModal = false;
  showImageModal = false;
  
  selectedRequest: CustomRequest | null = null;
  selectedImage = '';
  selectedStatus = '';
  responseText = '';
  newStatus = '';
  quickStatus = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.adminService.getAllCustomRequests().subscribe({
      next: (requests) => {
        this.requests = requests;
        this.filteredRequests = requests;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading requests:', error);
        this.loading = false;
      }
    });
  }

  filterRequests(): void {
    this.filteredRequests = this.requests.filter(request => {
      return !this.selectedStatus || request.status === this.selectedStatus;
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

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'pending',
      'REVIEWING': 'reviewing',
      'QUOTED': 'quoted',
      'APPROVED': 'approved',
      'IN_PROGRESS': 'in_progress',
      'COMPLETED': 'completed',
      'CANCELLED': 'cancelled'
    };
    return statusMap[status] || 'pending';
  }

  openResponseModal(request: CustomRequest): void {
    this.selectedRequest = request;
    this.responseText = request.adminResponse || '';
    this.newStatus = request.status;
    this.showResponseModal = true;
  }

  closeResponseModal(): void {
    this.showResponseModal = false;
    this.selectedRequest = null;
    this.responseText = '';
    this.newStatus = '';
  }

  submitResponse(): void {
    if (!this.selectedRequest) return;

    this.saving = true;
    this.adminService.updateCustomRequest(
      this.selectedRequest.id!,
      this.newStatus,
      this.responseText
    ).subscribe({
      next: () => {
        this.saving = false;
        this.closeResponseModal();
        this.loadRequests();
      },
      error: (error) => {
        console.error('Error submitting response:', error);
        this.saving = false;
      }
    });
  }

  openStatusModal(request: CustomRequest): void {
    this.selectedRequest = request;
    this.quickStatus = request.status;
    this.showStatusModal = true;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    this.selectedRequest = null;
    this.quickStatus = '';
  }

  updateStatus(): void {
    if (!this.selectedRequest) return;

    this.saving = true;
    this.adminService.updateCustomRequest(
      this.selectedRequest.id!,
      this.quickStatus,
      this.selectedRequest.adminResponse || ''
    ).subscribe({
      next: () => {
        this.saving = false;
        this.closeStatusModal();
        this.loadRequests();
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.saving = false;
      }
    });
  }

  openImageModal(imageUrl: string): void {
    this.selectedImage = imageUrl;
    this.showImageModal = true;
  }

  closeImageModal(): void {
    this.showImageModal = false;
    this.selectedImage = '';
  }
}
