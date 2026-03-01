import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product, ProductFilters } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="products-page">
      <!-- Page Header -->
      <section class="page-header">
        <div class="container">
          <h1 class="page-title" data-testid="products-title">Our Collection</h1>
          <p class="page-subtitle">Discover timeless elegance in every piece</p>
        </div>
      </section>

      <!-- Filters Section -->
      <section class="filters-section">
        <div class="container">
          <div class="filters-bar">
            <!-- Category Filter -->
            <div class="filter-group">
              <label>Category</label>
              <select [(ngModel)]="filters.categoryId" (change)="applyFilters()" data-testid="filter-category">
                <option [ngValue]="undefined">All Categories</option>
                <option *ngFor="let category of categories" [ngValue]="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <!-- Price Range -->
            <div class="filter-group">
              <label>Min Price</label>
              <input 
                type="number" 
                [(ngModel)]="filters.minPrice" 
                (change)="applyFilters()"
                placeholder="$0"
                data-testid="filter-min-price">
            </div>

            <div class="filter-group">
              <label>Max Price</label>
              <input 
                type="number" 
                [(ngModel)]="filters.maxPrice" 
                (change)="applyFilters()"
                placeholder="$10000"
                data-testid="filter-max-price">
            </div>

            <!-- Metal Filter -->
            <div class="filter-group">
              <label>Metal</label>
              <select [(ngModel)]="filters.metal" (change)="applyFilters()" data-testid="filter-metal">
                <option [ngValue]="undefined">All Metals</option>
                <option value="Gold">Gold</option>
                <option value="White Gold">White Gold</option>
                <option value="Rose Gold">Rose Gold</option>
                <option value="Platinum">Platinum</option>
                <option value="Silver">Silver</option>
              </select>
            </div>

            <!-- Gemstone Filter -->
            <div class="filter-group">
              <label>Gemstone</label>
              <select [(ngModel)]="filters.gemstone" (change)="applyFilters()" data-testid="filter-gemstone">
                <option [ngValue]="undefined">All Gemstones</option>
                <option value="Diamond">Diamond</option>
                <option value="Ruby">Ruby</option>
                <option value="Sapphire">Sapphire</option>
                <option value="Emerald">Emerald</option>
                <option value="Pearl">Pearl</option>
              </select>
            </div>

            <!-- Style Filter -->
            <div class="filter-group">
              <label>Style</label>
              <select [(ngModel)]="filters.style" (change)="applyFilters()" data-testid="filter-style">
                <option [ngValue]="undefined">All Styles</option>
                <option value="Classic">Classic</option>
                <option value="Modern">Modern</option>
                <option value="Vintage">Vintage</option>
                <option value="Minimalist">Minimalist</option>
              </select>
            </div>

            <!-- Search -->
            <div class="filter-group search-group">
              <label>Search</label>
              <input 
                type="text" 
                [(ngModel)]="filters.search" 
                (input)="applyFilters()"
                placeholder="Search products..."
                data-testid="filter-search">
            </div>

            <!-- Clear Filters -->
            <button class="btn-clear" (click)="clearFilters()" data-testid="clear-filters">
              Clear All
            </button>
          </div>
        </div>
      </section>

      <!-- Products Grid -->
      <section class="products-section">
        <div class="container">
          <!-- Loading State -->
          <div *ngIf="loading" class="loading-state" data-testid="loading">
            <div class="spinner"></div>
            <p>Loading products...</p>
          </div>

          <!-- Empty State -->
          <div *ngIf="!loading && products.length === 0" class="empty-state" data-testid="empty-state">
            <p class="empty-message">No products found</p>
            <button class="btn-outline" (click)="clearFilters()">Clear Filters</button>
          </div>

          <!-- Products Grid -->
          <div *ngIf="!loading && products.length > 0" class="products-grid">
            <div 
              *ngFor="let product of products" 
              class="product-card"
              [attr.data-testid]="'product-card-' + product.id"
              (click)="viewProduct(product.id!)">
              
              <div class="product-image">
                <img 
                  [src]="getProductImage(product)" 
                  [alt]="product.name"
                  loading="lazy">
                <div class="product-overlay">
                  <span class="view-details">View Details</span>
                </div>
              </div>

              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-price">\${{ product.price | number:'1.2-2' }}</p>
                <p class="product-category">{{ product.category?.name }}</p>
                <div class="product-meta">
                  <span *ngIf="product.metal" class="meta-tag">{{ product.metal }}</span>
                  <span *ngIf="product.gemstone" class="meta-tag">{{ product.gemstone }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Results Count -->
          <div *ngIf="!loading && products.length > 0" class="results-info">
            <p data-testid="results-count">Showing {{ products.length }} product(s)</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .products-page {
      min-height: 100vh;
      padding-bottom: 80px;
    }

    .page-header {
      padding: 80px 24px 60px;
      text-align: center;
      background: linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.4));
    }

    .page-title {
      font-family: 'Bodoni Moda', serif;
      font-size: 3.5rem;
      color: #C6A87C;
      margin-bottom: 16px;
      letter-spacing: 2px;
    }

    .page-subtitle {
      color: #A1A1AA;
      font-size: 1.125rem;
    }

    .filters-section {
      padding: 40px 24px;
      background: rgba(10, 10, 10, 0.5);
      border-bottom: 1px solid rgba(198, 168, 124, 0.2);
    }

    .filters-bar {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      align-items: flex-end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 150px;
    }

    .search-group {
      flex: 1;
      min-width: 200px;
    }

    .filter-group label {
      color: #C6A87C;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 500;
    }

    .filter-group select,
    .filter-group input {
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #FAFAFA;
      font-size: 0.9375rem;
      transition: all 0.3s;
    }

    .filter-group select:focus,
    .filter-group input:focus {
      outline: none;
      border-color: #C6A87C;
      background: rgba(255, 255, 255, 0.08);
    }

    .btn-clear {
      padding: 12px 24px;
      background: transparent;
      border: 1px solid rgba(198, 168, 124, 0.5);
      color: #C6A87C;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 0.875rem;
      transition: all 0.3s;
      align-self: flex-end;
    }

    .btn-clear:hover {
      background: rgba(198, 168, 124, 0.1);
      border-color: #C6A87C;
    }

    .products-section {
      padding: 60px 24px;
    }

    .loading-state {
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

    .loading-state p {
      color: #A1A1AA;
    }

    .empty-state {
      text-align: center;
      padding: 80px 24px;
    }

    .empty-message {
      color: #A1A1AA;
      font-size: 1.125rem;
      margin-bottom: 32px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 32px;
      margin-bottom: 60px;
    }

    .product-card {
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .product-card:hover {
      transform: translateY(-8px);
    }

    .product-image {
      position: relative;
      aspect-ratio: 3/4;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 16px;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .product-card:hover .product-image img {
      transform: scale(1.1);
    }

    .product-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .product-card:hover .product-overlay {
      opacity: 1;
    }

    .view-details {
      color: #C6A87C;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .product-info {
      text-align: center;
    }

    .product-name {
      font-size: 1.125rem;
      color: #FAFAFA;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .product-price {
      font-size: 1.375rem;
      color: #C6A87C;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .product-category {
      font-size: 0.875rem;
      color: #A1A1AA;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }

    .product-meta {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .meta-tag {
      font-size: 0.75rem;
      padding: 4px 12px;
      background: rgba(198, 168, 124, 0.2);
      color: #C6A87C;
      border: 1px solid rgba(198, 168, 124, 0.3);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .results-info {
      text-align: center;
      padding-top: 40px;
      border-top: 1px solid rgba(198, 168, 124, 0.2);
    }

    .results-info p {
      color: #A1A1AA;
      font-size: 0.9375rem;
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 2.5rem;
      }

      .filters-bar {
        flex-direction: column;
      }

      .filter-group,
      .search-group {
        width: 100%;
        min-width: auto;
      }

      .btn-clear {
        width: 100%;
      }

      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 24px;
      }
    }
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  filters: ProductFilters = {};
  loading = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Load categories
    this.loadCategories();

    // Check for category filter from route params
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.filters.categoryId = +params['category'];
      }
      this.loadProducts();
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts(this.filters).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.loadProducts();
  }

  clearFilters(): void {
    this.filters = {};
    this.loadProducts();
    // Clear query params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
  }

  viewProduct(id: number): void {
    this.router.navigate(['/products', id]);
  }

  getProductImage(product: Product): string {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400';
  }
}
