import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Product, JewelryType } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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
            <span class="back-arrow">&#8592;</span> Back to Products
          </button>
        </div>

        <div class="product-detail-content">
          <!-- Image Gallery -->
          <div class="image-gallery-section">
            <div class="main-image-container" data-testid="main-image">
              <img 
                [src]="selectedImage" 
                [alt]="product.name"
                class="main-image"
                (click)="toggleZoom()"
                [class.zoomed]="isZoomed">
              <div class="zoom-hint" *ngIf="!isZoomed">Click to zoom</div>
            </div>

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
            <div class="category-badge" data-testid="product-category">
              {{ product.category?.name }}
            </div>

            <h1 class="product-name" data-testid="product-name">{{ product.name }}</h1>

            <!-- Jewelry Type Selection -->
            <div class="jewelry-type-selection" data-testid="jewelry-type-selection">
              <h3>Select Type</h3>
              <div class="type-options">
                <!-- Imitation Option -->
                <div 
                  class="type-option"
                  [class.selected]="selectedType === 'IMITATION'"
                  (click)="selectType('IMITATION')"
                  data-testid="type-imitation">
                  <div class="type-header">
                    <span class="type-radio">
                      <span class="radio-inner" *ngIf="selectedType === 'IMITATION'"></span>
                    </span>
                    <span class="type-name">Imitation Jewellery</span>
                  </div>
                  <div class="type-details">
                    <p class="type-materials">{{ product.metal || 'Alloy' }} | {{ product.gemstone || 'Crystal' }}</p>
                    <p class="type-price" data-testid="imitation-price">
                      \${{ product.price | number:'1.2-2' }}
                    </p>
                  </div>
                  <p class="type-description">High-quality imitation piece with premium finish</p>
                </div>

                <!-- Real Gold/Diamond Option -->
                <div 
                  *ngIf="product.hasRealVersion !== false"
                  class="type-option real-option"
                  [class.selected]="selectedType === 'REAL'"
                  (click)="selectType('REAL')"
                  data-testid="type-real">
                  <div class="type-header">
                    <span class="type-radio">
                      <span class="radio-inner" *ngIf="selectedType === 'REAL'"></span>
                    </span>
                    <span class="type-name">Real Gold / Diamond</span>
                    <span class="premium-badge">Premium</span>
                  </div>
                  <div class="type-details">
                    <p class="type-materials">{{ product.realMetal || '18K Gold' }} | {{ product.realGemstone || 'Natural Diamond' }}</p>
                    <p class="type-price" data-testid="real-price">
                      <span *ngIf="product.realPrice">\${{ product.realPrice | number:'1.2-2' }}</span>
                      <span *ngIf="!product.realPrice" class="contact-price">Contact for Price</span>
                    </p>
                  </div>
                  <p class="type-description">Authentic precious metals and certified gemstones</p>
                </div>
              </div>
            </div>

            <!-- Availability -->
            <div class="availability" [class.in-stock]="product.available" data-testid="availability">
              <span class="status-dot"></span>
              {{ product.available ? 'In Stock' : 'Out of Stock' }}
            </div>

            <div class="divider"></div>

            <!-- Description -->
            <div class="product-description">
              <h3>Description</h3>
              <p data-testid="product-description">{{ product.description || 'No description available.' }}</p>
            </div>

            <!-- Product Details - Dynamic based on selected type -->
            <div class="product-details">
              <h3>{{ selectedType === 'REAL' ? 'Premium Details' : 'Details' }}</h3>
              <div class="details-grid">
                <div class="detail-item">
                  <span class="detail-label">Metal:</span>
                  <span class="detail-value" data-testid="product-metal">
                    {{ selectedType === 'REAL' ? (product.realMetal || '18K Gold') : (product.metal || 'Alloy') }}
                  </span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Gemstone:</span>
                  <span class="detail-value" data-testid="product-gemstone">
                    {{ selectedType === 'REAL' ? (product.realGemstone || 'Natural Diamond') : (product.gemstone || 'Crystal') }}
                  </span>
                </div>
                <div class="detail-item" *ngIf="product.style">
                  <span class="detail-label">Style:</span>
                  <span class="detail-value" data-testid="product-style">{{ product.style }}</span>
                </div>
              </div>
            </div>

            <!-- Specifications -->
            <div class="product-specifications" *ngIf="getSpecifications()">
              <h3>Specifications</h3>
              <p data-testid="product-specifications">{{ getSpecifications() }}</p>
            </div>

            <div class="divider"></div>

            <!-- Selected Price Display -->
            <div class="selected-price-display">
              <span class="price-label">Selected:</span>
              <span class="price-type">{{ selectedType === 'REAL' ? 'Real Gold/Diamond' : 'Imitation' }}</span>
              <span class="price-value" *ngIf="getCurrentPrice() !== null">
                \${{ getCurrentPrice() | number:'1.2-2' }}
              </span>
              <span class="price-value contact" *ngIf="getCurrentPrice() === null">
                Price on Request
              </span>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button 
                *ngIf="getCurrentPrice() !== null"
                class="btn-primary btn-order"
                [disabled]="!product.available"
                (click)="addToCart()"
                data-testid="add-to-cart-btn">
                {{ isInCart() ? 'Added to Cart &#10004;' : (product.available ? 'Add to Cart' : 'Out of Stock') }}
              </button>
              
              <button 
                *ngIf="getCurrentPrice() === null"
                class="btn-primary btn-order quote-btn"
                [disabled]="!product.available"
                (click)="requestQuote()"
                data-testid="request-quote-btn">
                Request Quote
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
                <span class="info-icon">&#10004;</span>
                <span>{{ selectedType === 'REAL' ? 'Certificate of Authenticity' : 'Quality Guaranteed' }}</span>
              </div>
              <div class="info-item">
                <span class="info-icon">&#128230;</span>
                <span>Free Shipping over $1,000</span>
              </div>
              <div class="info-item">
                <span class="info-icon">&#128274;</span>
                <span>Secure Payment</span>
              </div>
              <div class="info-item" *ngIf="selectedType === 'REAL'">
                <span class="info-icon">&#128142;</span>
                <span>Lifetime Warranty</span>
              </div>
            </div>
          </div>
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

    .not-found-container h2 {
      font-family: 'Bodoni Moda', serif;
      color: #C6A87C;
      margin-bottom: 16px;
    }

    .not-found-container p {
      color: #A1A1AA;
      margin-bottom: 24px;
    }

    .product-detail-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .back-navigation {
      margin-bottom: 32px;
    }

    .btn-back {
      background: transparent;
      border: 1px solid rgba(198, 168, 124, 0.3);
      color: #C6A87C;
      padding: 10px 20px;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .btn-back:hover {
      background: rgba(198, 168, 124, 0.1);
    }

    .product-detail-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
    }

    /* Image Gallery */
    .image-gallery-section {
      position: sticky;
      top: 120px;
      align-self: start;
    }

    .main-image-container {
      position: relative;
      aspect-ratio: 4/5;
      overflow: hidden;
      margin-bottom: 16px;
      cursor: pointer;
    }

    .main-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .main-image.zoomed {
      transform: scale(1.5);
    }

    .zoom-hint {
      position: absolute;
      bottom: 16px;
      right: 16px;
      background: rgba(0, 0, 0, 0.7);
      color: #C6A87C;
      padding: 8px 12px;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .thumbnails-container {
      display: flex;
      gap: 12px;
    }

    .thumbnail {
      width: 80px;
      height: 100px;
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.3s;
      overflow: hidden;
    }

    .thumbnail.active,
    .thumbnail:hover {
      border-color: #C6A87C;
    }

    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Product Info */
    .product-info-section {
      padding-top: 20px;
    }

    .category-badge {
      display: inline-block;
      padding: 6px 16px;
      background: rgba(198, 168, 124, 0.1);
      border: 1px solid rgba(198, 168, 124, 0.3);
      color: #C6A87C;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 16px;
    }

    .product-name {
      font-family: 'Bodoni Moda', serif;
      font-size: 2.5rem;
      color: #FAFAFA;
      margin-bottom: 24px;
      line-height: 1.2;
    }

    /* Jewelry Type Selection */
    .jewelry-type-selection {
      margin-bottom: 24px;
    }

    .jewelry-type-selection h3 {
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #C6A87C;
      margin-bottom: 16px;
    }

    .type-options {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .type-option {
      padding: 20px;
      border: 2px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.02);
      cursor: pointer;
      transition: all 0.3s;
    }

    .type-option:hover {
      border-color: rgba(198, 168, 124, 0.4);
    }

    .type-option.selected {
      border-color: #C6A87C;
      background: rgba(198, 168, 124, 0.05);
    }

    .type-option.real-option.selected {
      border-color: #10B981;
      background: rgba(16, 185, 129, 0.05);
    }

    .type-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .type-radio {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .type-option.selected .type-radio {
      border-color: #C6A87C;
    }

    .type-option.real-option.selected .type-radio {
      border-color: #10B981;
    }

    .radio-inner {
      width: 10px;
      height: 10px;
      background: #C6A87C;
      border-radius: 50%;
    }

    .type-option.real-option.selected .radio-inner {
      background: #10B981;
    }

    .type-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: #FAFAFA;
    }

    .premium-badge {
      padding: 4px 10px;
      background: linear-gradient(135deg, #10B981, #059669);
      color: white;
      font-size: 0.625rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    .type-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .type-materials {
      color: #A1A1AA;
      font-size: 0.875rem;
    }

    .type-price {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.5rem;
      color: #C6A87C;
    }

    .type-option.real-option .type-price {
      color: #10B981;
    }

    .contact-price {
      font-size: 1rem;
      color: #F59E0B;
      font-family: 'Montserrat', sans-serif;
      font-style: italic;
    }

    .type-description {
      color: #71717A;
      font-size: 0.8125rem;
    }

    /* Availability */
    .availability {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #EF4444;
      font-size: 0.875rem;
    }

    .availability.in-stock {
      color: #10B981;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background: currentColor;
      border-radius: 50%;
    }

    .divider {
      height: 1px;
      background: rgba(198, 168, 124, 0.2);
      margin: 24px 0;
    }

    .product-description h3,
    .product-details h3,
    .product-specifications h3 {
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #C6A87C;
      margin-bottom: 12px;
    }

    .product-description p,
    .product-specifications p {
      color: #D4D4D8;
      line-height: 1.7;
    }

    .product-description,
    .product-details,
    .product-specifications {
      margin-bottom: 24px;
    }

    .details-grid {
      display: grid;
      gap: 12px;
    }

    .detail-item {
      display: flex;
      gap: 12px;
    }

    .detail-label {
      color: #A1A1AA;
      min-width: 100px;
    }

    .detail-value {
      color: #FAFAFA;
    }

    /* Selected Price Display */
    .selected-price-display {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: rgba(198, 168, 124, 0.1);
      border: 1px solid rgba(198, 168, 124, 0.3);
      margin-bottom: 24px;
    }

    .price-label {
      color: #A1A1AA;
      font-size: 0.875rem;
    }

    .price-type {
      color: #FAFAFA;
      font-weight: 500;
    }

    .price-value {
      margin-left: auto;
      font-family: 'Bodoni Moda', serif;
      font-size: 1.75rem;
      color: #C6A87C;
    }

    .price-value.contact {
      font-size: 1rem;
      color: #F59E0B;
      font-family: 'Montserrat', sans-serif;
    }

    /* Action Buttons */
    .action-buttons {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .btn-primary {
      flex: 1;
      padding: 16px 32px;
      background: #C6A87C;
      border: none;
      color: #000;
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary:hover {
      background: #E5CFA0;
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary.quote-btn {
      background: #F59E0B;
    }

    .btn-primary.quote-btn:hover {
      background: #D97706;
    }

    .btn-outline {
      flex: 1;
      padding: 16px 32px;
      background: transparent;
      border: 1px solid #C6A87C;
      color: #C6A87C;
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-outline:hover {
      background: rgba(198, 168, 124, 0.1);
    }

    .view-cart-wrapper {
      margin-bottom: 24px;
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

    /* Additional Info */
    .additional-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(198, 168, 124, 0.2);
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #A1A1AA;
      font-size: 0.8125rem;
    }

    .info-icon {
      color: #C6A87C;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .product-detail-content {
        grid-template-columns: 1fr;
        gap: 40px;
      }

      .image-gallery-section {
        position: static;
      }
    }

    @media (max-width: 640px) {
      .product-name {
        font-size: 2rem;
      }

      .action-buttons {
        flex-direction: column;
      }

      .additional-info {
        grid-template-columns: 1fr;
      }

      .type-details {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  selectedImage = '';
  isZoomed = false;
  selectedType: JewelryType = 'IMITATION';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProduct(productId);
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.selectedImage = product.images?.[0] || '';
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
      }
    });
  }

  selectImage(image: string): void {
    this.selectedImage = image;
    this.isZoomed = false;
  }

  toggleZoom(): void {
    this.isZoomed = !this.isZoomed;
  }

  selectType(type: JewelryType): void {
    this.selectedType = type;
  }

  getCurrentPrice(): number | null {
    if (!this.product) return null;
    
    if (this.selectedType === 'REAL') {
      return this.product.realPrice || null;
    }
    return this.product.price;
  }

  getSpecifications(): string {
    if (!this.product) return '';
    
    if (this.selectedType === 'REAL' && this.product.realSpecifications) {
      return this.product.realSpecifications;
    }
    return this.product.specifications || '';
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  addToCart(): void {
    if (this.product && this.product.available) {
      this.cartService.addToCart(this.product, 1, this.selectedType);
    }
  }

  requestQuote(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: `/products/${this.product?.id}` }
      });
      return;
    }

    // Add to cart with quote pending
    if (this.product) {
      this.cartService.addToCart(this.product, 1, 'REAL');
      this.router.navigate(['/cart']);
    }
  }

  isInCart(): boolean {
    return this.product ? this.cartService.isInCart(this.product.id!, this.selectedType) : false;
  }

  getCartCount(): number {
    return this.cartService.getCartCount();
  }
}
