import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CustomRequestService } from '../../services/custom-request.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-custom-request',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="custom-request-page">
      <div class="custom-request-container">
        <!-- Header Section -->
        <div class="page-header">
          <h1 class="page-title" data-testid="custom-request-title">Request Custom Jewellery</h1>
          <p class="page-subtitle">
            Have a unique design in mind? Let our master craftsmen bring your vision to life.
          </p>
        </div>

        <!-- Success Message -->
        <div *ngIf="submitSuccess" class="success-message" data-testid="success-message">
          <div class="success-icon">&#10004;</div>
          <h2>Request Submitted Successfully!</h2>
          <p>Thank you for your custom jewellery request. Our design team will review your requirements and contact you within 2-3 business days.</p>
          <div class="success-actions">
            <a routerLink="/my-requests" class="btn-primary" data-testid="view-requests-btn">View My Requests</a>
            <button class="btn-outline" (click)="resetForm()" data-testid="new-request-btn">Submit Another Request</button>
          </div>
        </div>

        <!-- Request Form -->
        <div *ngIf="!submitSuccess" class="form-container">
          <form (ngSubmit)="submitRequest()" class="custom-request-form" data-testid="custom-request-form">
            
            <!-- Design Name -->
            <div class="form-section">
              <h2 class="section-title">Design Details</h2>
              
              <div class="form-group">
                <label for="designName">Design Name / Title *</label>
                <input 
                  type="text" 
                  id="designName"
                  [(ngModel)]="requestData.name" 
                  name="designName"
                  placeholder="e.g., Vintage Emerald Engagement Ring"
                  data-testid="design-name-input"
                  required>
              </div>

              <!-- Jewellery Type -->
              <div class="form-group">
                <label for="jewelryType">Type of Jewellery *</label>
                <select 
                  id="jewelryType"
                  [(ngModel)]="requestData.jewelryType" 
                  name="jewelryType"
                  data-testid="jewelry-type-select"
                  required>
                  <option value="">Select Type</option>
                  <option value="Ring">Ring</option>
                  <option value="Necklace">Necklace</option>
                  <option value="Earrings">Earrings</option>
                  <option value="Bracelet">Bracelet</option>
                  <option value="Pendant">Pendant</option>
                  <option value="Brooch">Brooch</option>
                  <option value="Set">Jewellery Set</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <!-- Description -->
              <div class="form-group">
                <label for="description">Detailed Description *</label>
                <textarea 
                  id="description"
                  [(ngModel)]="requestData.description" 
                  name="description"
                  placeholder="Describe your dream piece in detail - include style preferences, gemstones, metal type, size, occasion, and any other specific requirements..."
                  rows="6"
                  data-testid="description-input"
                  required></textarea>
                <span class="char-count">{{ requestData.description.length }}/1000 characters</span>
              </div>
            </div>

            <!-- Material Preferences -->
            <div class="form-section">
              <h2 class="section-title">Material Preferences</h2>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="metalType">Preferred Metal</label>
                  <select 
                    id="metalType"
                    [(ngModel)]="requestData.metalType" 
                    name="metalType"
                    data-testid="metal-type-select">
                    <option value="">Select Metal</option>
                    <option value="18K Gold">18K Gold</option>
                    <option value="14K Gold">14K Gold</option>
                    <option value="White Gold">White Gold</option>
                    <option value="Rose Gold">Rose Gold</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Silver">Sterling Silver</option>
                    <option value="Mixed">Mixed Metals</option>
                    <option value="Other">Other (specify in description)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="gemstones">Primary Gemstone</label>
                  <select 
                    id="gemstones"
                    [(ngModel)]="requestData.gemstone" 
                    name="gemstones"
                    data-testid="gemstone-select">
                    <option value="">Select Gemstone</option>
                    <option value="Diamond">Diamond</option>
                    <option value="Ruby">Ruby</option>
                    <option value="Sapphire">Sapphire</option>
                    <option value="Emerald">Emerald</option>
                    <option value="Pearl">Pearl</option>
                    <option value="Amethyst">Amethyst</option>
                    <option value="Topaz">Topaz</option>
                    <option value="Opal">Opal</option>
                    <option value="None">No Gemstone</option>
                    <option value="Other">Other (specify in description)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Budget Section -->
            <div class="form-section">
              <h2 class="section-title">Budget & Timeline</h2>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="budget">Budget Range</label>
                  <select 
                    id="budget"
                    [(ngModel)]="requestData.budget" 
                    name="budget"
                    data-testid="budget-select">
                    <option value="">Select Budget Range</option>
                    <option value="$500 - $1,000">$500 - $1,000</option>
                    <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                    <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                    <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                    <option value="$25,000+">$25,000+</option>
                    <option value="Flexible">Flexible / Open to Discussion</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="timeline">Desired Timeline</label>
                  <select 
                    id="timeline"
                    [(ngModel)]="requestData.timeline" 
                    name="timeline"
                    data-testid="timeline-select">
                    <option value="">Select Timeline</option>
                    <option value="2-4 weeks">2-4 weeks</option>
                    <option value="1-2 months">1-2 months</option>
                    <option value="2-3 months">2-3 months</option>
                    <option value="3+ months">3+ months</option>
                    <option value="Flexible">No Rush / Flexible</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Reference Images -->
            <div class="form-section">
              <h2 class="section-title">Reference Images</h2>
              <p class="section-description">Upload images that inspire your design (optional but recommended)</p>
              
              <div class="upload-area" 
                   (drop)="onDrop($event)" 
                   (dragover)="onDragOver($event)"
                   (dragleave)="onDragLeave($event)"
                   [class.drag-over]="isDragOver"
                   data-testid="upload-area">
                <div class="upload-content">
                  <span class="upload-icon">&#128247;</span>
                  <p class="upload-text">Drag & drop images here or</p>
                  <label class="upload-btn">
                    Browse Files
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      (change)="onFileSelect($event)"
                      data-testid="file-input">
                  </label>
                  <p class="upload-hint">Supports JPG, PNG, WEBP up to 5MB each</p>
                </div>
              </div>

              <!-- Preview Images -->
              <div *ngIf="previewImages.length > 0" class="preview-container" data-testid="image-previews">
                <div *ngFor="let preview of previewImages; let i = index" class="preview-item">
                  <img [src]="preview" alt="Preview">
                  <button 
                    type="button" 
                    class="remove-btn" 
                    (click)="removeImage(i)"
                    [attr.data-testid]="'remove-image-' + i">&#10005;</button>
                </div>
              </div>

              <p *ngIf="uploadError" class="upload-error" data-testid="upload-error">{{ uploadError }}</p>
            </div>

            <!-- Contact Preference -->
            <div class="form-section">
              <h2 class="section-title">Contact Preference</h2>
              
              <div class="form-group">
                <label for="contactMethod">Preferred Contact Method</label>
                <select 
                  id="contactMethod"
                  [(ngModel)]="requestData.contactMethod" 
                  name="contactMethod"
                  data-testid="contact-method-select">
                  <option value="Email">Email</option>
                  <option value="Phone">Phone Call</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Any">Any Method</option>
                </select>
              </div>

              <div class="form-group">
                <label for="additionalNotes">Additional Notes</label>
                <textarea 
                  id="additionalNotes"
                  [(ngModel)]="requestData.additionalNotes" 
                  name="additionalNotes"
                  placeholder="Any other information you'd like to share..."
                  rows="3"
                  data-testid="additional-notes-input"></textarea>
              </div>
            </div>

            <!-- Error Message -->
            <p *ngIf="errorMessage" class="error-message" data-testid="error-message">
              {{ errorMessage }}
            </p>

            <!-- Submit Button -->
            <button 
              type="submit" 
              class="btn-primary btn-submit"
              [disabled]="loading"
              data-testid="submit-request-btn">
              {{ loading ? 'Submitting Request...' : 'Submit Custom Request' }}
            </button>
          </form>

          <!-- Info Cards -->
          <div class="info-sidebar">
            <div class="info-card">
              <h3>How It Works</h3>
              <div class="step">
                <span class="step-number">1</span>
                <div class="step-content">
                  <h4>Submit Your Request</h4>
                  <p>Share your vision with detailed description and reference images.</p>
                </div>
              </div>
              <div class="step">
                <span class="step-number">2</span>
                <div class="step-content">
                  <h4>Design Consultation</h4>
                  <p>Our designers will contact you to discuss and refine your concept.</p>
                </div>
              </div>
              <div class="step">
                <span class="step-number">3</span>
                <div class="step-content">
                  <h4>Quote & Approval</h4>
                  <p>Receive a detailed quote with 3D renderings for your approval.</p>
                </div>
              </div>
              <div class="step">
                <span class="step-number">4</span>
                <div class="step-content">
                  <h4>Crafting Your Piece</h4>
                  <p>Master craftsmen bring your dream jewellery to life.</p>
                </div>
              </div>
            </div>

            <div class="info-card highlight">
              <h3>Why Custom?</h3>
              <ul>
                <li>One-of-a-kind designs</li>
                <li>Hand-selected materials</li>
                <li>Expert craftsmanship</li>
                <li>Lifetime warranty</li>
                <li>Certificate of authenticity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-request-page {
      min-height: 100vh;
      padding: 40px 24px 80px;
    }

    .custom-request-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Header */
    .page-header {
      text-align: center;
      margin-bottom: 48px;
    }

    .page-title {
      font-family: 'Bodoni Moda', serif;
      font-size: 2.5rem;
      color: #C6A87C;
      margin-bottom: 16px;
      letter-spacing: 1px;
    }

    .page-subtitle {
      color: #A1A1AA;
      font-size: 1.125rem;
      max-width: 600px;
      margin: 0 auto;
    }

    /* Success Message */
    .success-message {
      text-align: center;
      padding: 60px 40px;
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

    .success-message h2 {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.75rem;
      color: #10B981;
      margin-bottom: 16px;
    }

    .success-message p {
      color: #D4D4D8;
      margin-bottom: 32px;
      line-height: 1.6;
    }

    .success-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    /* Form Container */
    .form-container {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 48px;
      align-items: start;
    }

    /* Form Sections */
    .custom-request-form {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .form-section {
      padding: 32px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(198, 168, 124, 0.2);
    }

    .section-title {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.5rem;
      color: #C6A87C;
      margin-bottom: 24px;
    }

    .section-description {
      color: #A1A1AA;
      font-size: 0.9375rem;
      margin-bottom: 20px;
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

    .form-group select option {
      background: #1a1a1a;
      color: #FAFAFA;
    }

    .char-count {
      align-self: flex-end;
      color: #A1A1AA;
      font-size: 0.75rem;
    }

    /* Upload Area */
    .upload-area {
      border: 2px dashed rgba(198, 168, 124, 0.3);
      padding: 40px;
      text-align: center;
      transition: all 0.3s;
      cursor: pointer;
    }

    .upload-area:hover,
    .upload-area.drag-over {
      border-color: #C6A87C;
      background: rgba(198, 168, 124, 0.05);
    }

    .upload-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: 16px;
      opacity: 0.6;
    }

    .upload-text {
      color: #A1A1AA;
      margin-bottom: 12px;
    }

    .upload-btn {
      display: inline-block;
      padding: 10px 24px;
      background: rgba(198, 168, 124, 0.2);
      border: 1px solid #C6A87C;
      color: #C6A87C;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .upload-btn:hover {
      background: #C6A87C;
      color: #000;
    }

    .upload-btn input {
      display: none;
    }

    .upload-hint {
      color: #666;
      font-size: 0.75rem;
      margin-top: 12px;
    }

    /* Image Previews */
    .preview-container {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-top: 20px;
    }

    .preview-item {
      position: relative;
      width: 100px;
      height: 100px;
    }

    .preview-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border: 1px solid rgba(198, 168, 124, 0.3);
    }

    .remove-btn {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 24px;
      height: 24px;
      background: #EF4444;
      border: none;
      color: white;
      font-size: 0.875rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .upload-error {
      color: #EF4444;
      font-size: 0.875rem;
      margin-top: 12px;
    }

    /* Error Message */
    .error-message {
      color: #EF4444;
      text-align: center;
      font-size: 0.875rem;
      padding: 12px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .btn-submit {
      width: 100%;
      padding: 18px;
      font-size: 1.125rem;
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Info Sidebar */
    .info-sidebar {
      display: flex;
      flex-direction: column;
      gap: 24px;
      position: sticky;
      top: 120px;
    }

    .info-card {
      padding: 28px;
      background: rgba(10, 10, 10, 0.95);
      border: 1px solid rgba(198, 168, 124, 0.3);
    }

    .info-card h3 {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.25rem;
      color: #C6A87C;
      margin-bottom: 20px;
    }

    .step {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
    }

    .step:last-child {
      margin-bottom: 0;
    }

    .step-number {
      width: 32px;
      height: 32px;
      background: rgba(198, 168, 124, 0.2);
      border: 1px solid #C6A87C;
      color: #C6A87C;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      flex-shrink: 0;
    }

    .step-content h4 {
      color: #FAFAFA;
      font-size: 0.9375rem;
      margin-bottom: 4px;
    }

    .step-content p {
      color: #A1A1AA;
      font-size: 0.8125rem;
      line-height: 1.5;
    }

    .info-card.highlight {
      background: rgba(198, 168, 124, 0.05);
    }

    .info-card ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .info-card ul li {
      color: #D4D4D8;
      font-size: 0.9375rem;
      padding: 8px 0;
      padding-left: 24px;
      position: relative;
    }

    .info-card ul li::before {
      content: '\\2713';
      position: absolute;
      left: 0;
      color: #C6A87C;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .form-container {
        grid-template-columns: 1fr;
      }

      .info-sidebar {
        position: static;
        flex-direction: row;
        flex-wrap: wrap;
      }

      .info-card {
        flex: 1;
        min-width: 280px;
      }
    }

    @media (max-width: 640px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .page-title {
        font-size: 2rem;
      }

      .custom-request-page {
        padding: 24px 16px 60px;
      }

      .form-section {
        padding: 24px 16px;
      }

      .upload-area {
        padding: 24px;
      }
    }
  `]
})
export class CustomRequestComponent implements OnInit {
  requestData = {
    name: '',
    jewelryType: '',
    description: '',
    metalType: '',
    gemstone: '',
    budget: '',
    timeline: '',
    contactMethod: 'Email',
    additionalNotes: ''
  };

  previewImages: string[] = [];
  selectedFiles: File[] = [];
  isDragOver = false;
  uploadError = '';
  loading = false;
  errorMessage = '';
  submitSuccess = false;

  constructor(
    private customRequestService: CustomRequestService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/custom-request' }
      });
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
  }

  handleFiles(files: File[]): void {
    this.uploadError = '';
    
    for (const file of files) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        this.uploadError = 'Only image files are allowed';
        continue;
      }

      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.uploadError = 'File size must be less than 5MB';
        continue;
      }

      // Check max files
      if (this.selectedFiles.length >= 5) {
        this.uploadError = 'Maximum 5 images allowed';
        break;
      }

      this.selectedFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImages.push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number): void {
    this.previewImages.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  submitRequest(): void {
    // Validation
    if (!this.requestData.name || !this.requestData.jewelryType || !this.requestData.description) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (this.requestData.description.length < 50) {
      this.errorMessage = 'Please provide a more detailed description (at least 50 characters)';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // Build full description
    const fullDescription = `
Type: ${this.requestData.jewelryType}
Metal: ${this.requestData.metalType || 'Not specified'}
Gemstone: ${this.requestData.gemstone || 'Not specified'}
Budget: ${this.requestData.budget || 'Not specified'}
Timeline: ${this.requestData.timeline || 'Not specified'}
Contact Method: ${this.requestData.contactMethod}

Description:
${this.requestData.description}

Additional Notes:
${this.requestData.additionalNotes || 'None'}
    `.trim();

    const request = {
      name: this.requestData.name,
      description: fullDescription,
      referenceImages: this.previewImages, // In production, these would be uploaded to a server
      status: 'PENDING'
    };

    this.customRequestService.createRequest(request).subscribe({
      next: (response) => {
        this.loading = false;
        this.submitSuccess = true;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Failed to submit request. Please try again.';
      }
    });
  }

  resetForm(): void {
    this.submitSuccess = false;
    this.requestData = {
      name: '',
      jewelryType: '',
      description: '',
      metalType: '',
      gemstone: '',
      budget: '',
      timeline: '',
      contactMethod: 'Email',
      additionalNotes: ''
    };
    this.previewImages = [];
    this.selectedFiles = [];
  }
}
