import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-detail-page">
      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading product...</p>
      </div>

      <!-- Product Not Found -->
      <div *ngIf="!loading && !product" class="not-found-container">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <button class="btn-primary" routerLink="/products">Back to Products</button>
      </div>

      <!-- Product Detail -->
      <div *ngIf="!loading && product" class="product-detail-container">
        <!-- Back Button -->
        <div class="back-navigation">
          <button class="btn-back" (click)="goBack()" data-testid="back-btn">
            <span class="back-arrow">←</span> Back to Products
          </button>
        </div>

        <div class="product-detail-content">
          <!-- Image Gallery -->
          <div class="image-gallery-section">
            <!-- Main Image -->
            <div class="main-image-container" data-testid="main-image">
              <img 
                [src]="selectedImage" 
                [alt]="product.name"
                class="main-image"
                (click)="toggleZoom()"
                [class.zoomed]="isZoomed">
              <div class="zoom-hint" *ngIf="!isZoomed">Click to zoom</div>
            </div>

            <!-- Thumbnails -->
            <div class="thumbnails-container" *ngIf="product.images && product.images.length > 1">
              <div 
                *ngFor="let image of product.images; let i = index" 
                class="thumbnail"
                [class.active]="selectedImage === image"
                (click)="selectImage(image)"
                [attr.data-testid]="'thumbnail-' + i">
                <img [src]="image" [alt]="product.name + ' - Image ' + (i + 1)">
              </div>
            </div>
          </div>

          <!-- Product Information -->
          <div class="product-info-section">
            <!-- Category Badge -->
            <div class="category-badge" data-testid="product-category">
              {{ product.category?.name }}
            </div>

            <!-- Product Name -->
            <h1 class="product-name" data-testid="product-name">{{ product.name }}</h1>

            <!-- Price -->
            <div class="product-price" data-testid="product-price">
              \${{ product.price | number:'1.2-2' }}
            </div>

            <!-- Availability -->
            <div class="availability" [class.in-stock]="product.available" data-testid="availability">
              <span class="status-dot"></span>
              {{ product.available ? 'In Stock' : 'Out of Stock' }}
            </div>

            <!-- Divider -->
            <div class="divider"></div>

            <!-- Description -->
            <div class="product-description">
              <h3>Description</h3>
              <p data-testid="product-description">{{ product.description || 'No description available.' }}</p>
            </div>

            <!-- Product Details -->
            <div class="product-details">
              <h3>Details</h3>
              <div class="details-grid">
                <div class="detail-item" *ngIf="product.metal">
                  <span class="detail-label">Metal:</span>
                  <span class="detail-value" data-testid="product-metal">{{ product.metal }}</span>
                </div>
                <div class="detail-item" *ngIf="product.gemstone">
                  <span class="detail-label">Gemstone:</span>
                  <span class="detail-value" data-testid="product-gemstone">{{ product.gemstone }}</span>
                </div>
                <div class="detail-item" *ngIf="product.style">
                  <span class="detail-label">Style:</span>
                  <span class="detail-value" data-testid="product-style">{{ product.style }}</span>
                </div>
              </div>
            </div>

            <!-- Specifications -->
            <div class="product-specifications" *ngIf="product.specifications">
              <h3>Specifications</h3>
              <p data-testid="product-specifications">{{ product.specifications }}</p>
            </div>

            <!-- Divider -->
            <div class="divider"></div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button 
                class="btn-primary btn-order"
                [disabled]="!product.available"
                (click)="addToCart()"
                data-testid="add-to-cart-btn">
                {{ isInCart() ? 'Added to Cart ✓' : (product.available ? 'Add to Cart' : 'Out of Stock') }}
              </button>
              
              <button 
                class="btn-outline"
                routerLink="/custom-request"
                data-testid="customize-btn">
                Customize This Design
              </button>
            </div>

            <!-- View Cart Button -->
            <div *ngIf="isInCart()" class="view-cart-wrapper">
              <a routerLink="/cart" class="btn-view-cart" data-testid="view-cart-btn">
                View Cart ({{ getCartCount() }} items)
              </a>
            </div>

            <!-- Additional Info -->
            <div class="additional-info">
              <div class="info-item">
                <span class="info-icon">✓</span>
                <span>Authenticity Certificate Included</span>
              </div>
              <div class="info-item">
                <span class="info-icon">✓</span>
                <span>Free Shipping on Orders Over $1000</span>
              </div>
              <div class="info-item">
                <span class="info-icon">✓</span>
                <span>30-Day Return Policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Zoom Modal -->
      <div class="zoom-modal" *ngIf="isZoomed" (click)="toggleZoom()" data-testid="zoom-modal">
        <div class="zoom-modal-content">
          <button class="close-zoom" (click)="toggleZoom()">✕</button>
          <img [src]="selectedImage" [alt]="product?.name" class="zoomed-image">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-detail-page {
      min-height: 100vh;
      padding: 40px 24px 80px;
    }

    .loading-container,
    .not-found-container {
      text-align: center;
      padding: 120px 24px;
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

    .loading-container p,
    .not-found-container p {
      color: #A1A1AA;
      margin-bottom: 24px;
    }

    .not-found-container h2 {
      color: #C6A87C;
      font-family: 'Bodoni Moda', serif;
      font-size: 2rem;
      margin-bottom: 16px;
    }

    .product-detail-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .back-navigation {
      margin-bottom: 40px;
    }

    .btn-back {
      background: transparent;
      border: none;
      color: #C6A87C;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s;
      padding: 8px 0;
    }

    .btn-back:hover {
      gap: 12px;
      color: #E5CFA0;
    }

    .back-arrow {
      font-size: 1.5rem;
      transition: transform 0.3s;
    }

    .btn-back:hover .back-arrow {
      transform: translateX(-4px);
    }

    .product-detail-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
    }

    /* Image Gallery */
    .image-gallery-section {
      position: sticky;
      top: 100px;
      height: fit-content;
    }

    .main-image-container {
      position: relative;
      aspect-ratio: 3/4;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      overflow: hidden;
      margin-bottom: 24px;
      cursor: zoom-in;
    }

    .main-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .main-image-container:hover .main-image {
      transform: scale(1.05);
    }

    .zoom-hint {
      position: absolute;
      bottom: 16px;
      right: 16px;
      background: rgba(0, 0, 0, 0.8);
      color: #C6A87C;
      padding: 8px 16px;
      font-size: 0.875rem;
      border: 1px solid rgba(198, 168, 124, 0.3);
      pointer-events: none;
    }

    .thumbnails-container {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding-bottom: 8px;
    }

    .thumbnail {
      flex-shrink: 0;
      width: 80px;
      height: 100px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.3s;
      overflow: hidden;
    }

    .thumbnail:hover {
      border-color: rgba(198, 168, 124, 0.5);
    }

    .thumbnail.active {
      border-color: #C6A87C;
    }

    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Product Info */
    .product-info-section {
      padding: 20px 0;
    }

    .category-badge {
      display: inline-block;
      padding: 6px 16px;
      background: rgba(198, 168, 124, 0.2);
      color: #C6A87C;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      border: 1px solid rgba(198, 168, 124, 0.3);
      margin-bottom: 24px;
    }

    .product-name {
      font-family: 'Bodoni Moda', serif;
      font-size: 2.5rem;
      color: #FAFAFA;
      margin-bottom: 16px;
      line-height: 1.2;
    }

    .product-price {
      font-size: 2rem;
      color: #C6A87C;
      font-weight: 600;
      margin-bottom: 16px;
    }

    .availability {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9375rem;
      color: #EF4444;
      margin-bottom: 32px;
    }

    .availability.in-stock {
      color: #10B981;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
    }

    .divider {
      height: 1px;
      background: rgba(198, 168, 124, 0.2);
      margin: 32px 0;
    }

    .product-description h3,
    .product-details h3,
    .product-specifications h3 {
      color: #C6A87C;
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 16px;
      font-weight: 600;
    }

    .product-description p,
    .product-specifications p {
      color: #D4D4D8;
      line-height: 1.8;
      font-size: 0.9375rem;
    }

    .product-details {
      margin: 32px 0;
    }

    .details-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .detail-item {
      display: flex;
      gap: 12px;
      font-size: 0.9375rem;
    }

    .detail-label {
      color: #A1A1AA;
      min-width: 100px;
    }

    .detail-value {
      color: #FAFAFA;
      font-weight: 500;
    }

    .action-buttons {
      display: flex;
      gap: 16px;
      margin: 32px 0;
    }

    .btn-order {
      flex: 1;
    }

    .btn-order:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .view-cart-wrapper {
      margin-top: 16px;
    }

    .btn-view-cart {
      display: block;
      width: 100%;
      text-align: center;
      padding: 12px 24px;
      background: rgba(198, 168, 124, 0.1);
      border: 1px solid #C6A87C;
      color: #C6A87C;
      text-decoration: none;
      transition: all 0.3s;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 0.875rem;
    }

    .btn-view-cart:hover {
      background: rgba(198, 168, 124, 0.2);
    }

    .btn-outline {
      flex: 1;
      padding: 16px 32px;
    }

    .additional-info {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 24px;
      background: rgba(198, 168, 124, 0.05);
      border: 1px solid rgba(198, 168, 124, 0.2);
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #D4D4D8;
      font-size: 0.875rem;
    }

    .info-icon {
      color: #C6A87C;
      font-weight: bold;
    }

    /* Zoom Modal */
    .zoom-modal {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      cursor: zoom-out;
      animation: fadeIn 0.3s;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .zoom-modal-content {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
    }

    .close-zoom {
      position: absolute;
      top: -40px;
      right: 0;
      background: transparent;
      border: none;
      color: #C6A87C;
      font-size: 2rem;
      cursor: pointer;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s;
    }

    .close-zoom:hover {
      transform: rotate(90deg);
    }

    .zoomed-image {
      max-width: 90vw;
      max-height: 90vh;
      object-fit: contain;
    }

    /* Responsive */
    @media (max-width: 968px) {
      .product-detail-content {
        grid-template-columns: 1fr;
        gap: 40px;
      }

      .image-gallery-section {
        position: static;
      }

      .product-name {
        font-size: 2rem;
      }

      .action-buttons {
        flex-direction: column;
      }
    }

    @media (max-width: 640px) {
      .product-detail-page {
        padding: 24px 16px 60px;
      }

      .product-name {
        font-size: 1.75rem;
      }

      .product-price {
        font-size: 1.5rem;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  selectedImage = '';
  isZoomed = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.selectedImage = this.getDefaultImage(product);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
      }
    });
  }

  getDefaultImage(product: Product): string {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800';
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  toggleZoom(): void {
    this.isZoomed = !this.isZoomed;
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  placeOrder(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: `/products/${this.product?.id}` }
      });
      return;
    }

    // For now, navigate to orders page
    // In a complete implementation, this would open a cart or checkout flow
    alert('Order functionality will be implemented. For now, please contact us to place an order.');
  }
}
