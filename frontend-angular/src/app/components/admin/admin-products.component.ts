import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-products">
      <div class="page-header">
        <div class="header-left">
          <h1 data-testid="admin-products-title">Product Management</h1>
          <p>Manage your jewellery inventory</p>
        </div>
        <button class="btn-primary" (click)="openProductModal()" data-testid="add-product-btn">
          + Add Product
        </button>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            placeholder="Search products..."
            (input)="filterProducts()"
            data-testid="search-input">
        </div>
        <select [(ngModel)]="selectedCategory" (change)="filterProducts()" data-testid="category-filter">
          <option value="">All Categories</option>
          <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
        </select>
      </div>

      <!-- Products Table -->
      <div class="products-table" data-testid="products-table">
        <div class="table-header">
          <span class="col-image">Image</span>
          <span class="col-name">Product Name</span>
          <span class="col-category">Category</span>
          <span class="col-price">Price</span>
          <span class="col-status">Status</span>
          <span class="col-actions">Actions</span>
        </div>

        <div *ngIf="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading products...</p>
        </div>

        <div *ngIf="!loading && filteredProducts.length === 0" class="empty-state">
          <p>No products found</p>
        </div>

        <div 
          *ngFor="let product of filteredProducts; let i = index" 
          class="table-row"
          [attr.data-testid]="'product-row-' + i">
          <div class="col-image">
            <img [src]="getProductImage(product)" [alt]="product.name">
          </div>
          <div class="col-name">
            <h4>{{ product.name }}</h4>
            <p class="product-meta">{{ product.metal }} | {{ product.gemstone }}</p>
          </div>
          <div class="col-category">{{ product.category?.name }}</div>
          <div class="col-price">\${{ product.price | number:'1.2-2' }}</div>
          <div class="col-status">
            <span class="status-badge" [class.active]="product.available">
              {{ product.available ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div class="col-actions">
            <button class="btn-icon edit" (click)="editProduct(product)" [attr.data-testid]="'edit-' + i">
              &#9998;
            </button>
            <button class="btn-icon delete" (click)="deleteProduct(product)" [attr.data-testid]="'delete-' + i">
              &#128465;
            </button>
          </div>
        </div>
      </div>

      <!-- Product Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()" data-testid="product-modal">
          <div class="modal-header">
            <h2>{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h2>
            <button class="close-btn" (click)="closeModal()">&#10005;</button>
          </div>

          <form (ngSubmit)="saveProduct()" class="product-form">
            <div class="form-row">
              <div class="form-group">
                <label>Product Name *</label>
                <input 
                  type="text" 
                  [(ngModel)]="productForm.name" 
                  name="name"
                  placeholder="e.g., Diamond Solitaire Ring"
                  data-testid="product-name"
                  required>
              </div>
              <div class="form-group">
                <label>Category *</label>
                <select [(ngModel)]="productForm.categoryId" name="categoryId" data-testid="product-category" required>
                  <option value="">Select Category</option>
                  <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea 
                [(ngModel)]="productForm.description" 
                name="description"
                rows="3"
                placeholder="Product description..."
                data-testid="product-description"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Price *</label>
                <input 
                  type="number" 
                  [(ngModel)]="productForm.price" 
                  name="price"
                  placeholder="0.00"
                  step="0.01"
                  data-testid="product-price"
                  required>
              </div>
              <div class="form-group">
                <label>Metal Type</label>
                <select [(ngModel)]="productForm.metal" name="metal" data-testid="product-metal">
                  <option value="">Select Metal</option>
                  <option value="18K Gold">18K Gold</option>
                  <option value="14K Gold">14K Gold</option>
                  <option value="White Gold">White Gold</option>
                  <option value="Rose Gold">Rose Gold</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Sterling Silver">Sterling Silver</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Gemstone</label>
                <select [(ngModel)]="productForm.gemstone" name="gemstone" data-testid="product-gemstone">
                  <option value="">Select Gemstone</option>
                  <option value="Diamond">Diamond</option>
                  <option value="Ruby">Ruby</option>
                  <option value="Sapphire">Sapphire</option>
                  <option value="Emerald">Emerald</option>
                  <option value="Pearl">Pearl</option>
                  <option value="None">None</option>
                </select>
              </div>
              <div class="form-group">
                <label>Style</label>
                <select [(ngModel)]="productForm.style" name="style" data-testid="product-style">
                  <option value="">Select Style</option>
                  <option value="Classic">Classic</option>
                  <option value="Modern">Modern</option>
                  <option value="Vintage">Vintage</option>
                  <option value="Minimalist">Minimalist</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Image URLs (one per line)</label>
              <textarea 
                [(ngModel)]="imageUrls" 
                name="imageUrls"
                rows="3"
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                data-testid="product-images"></textarea>
            </div>

            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="productForm.available" 
                  name="available"
                  data-testid="product-available">
                <span>Product is available for sale</span>
              </label>
            </div>

            <p *ngIf="formError" class="error-message">{{ formError }}</p>

            <div class="form-actions">
              <button type="button" class="btn-outline" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn-primary" [disabled]="saving" data-testid="save-product-btn">
                {{ saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="showDeleteModal" class="modal-overlay" (click)="cancelDelete()">
        <div class="modal-content delete-modal" (click)="$event.stopPropagation()" data-testid="delete-modal">
          <div class="delete-icon">&#9888;</div>
          <h2>Delete Product</h2>
          <p>Are you sure you want to delete "{{ productToDelete?.name }}"? This action cannot be undone.</p>
          <div class="form-actions">
            <button class="btn-outline" (click)="cancelDelete()">Cancel</button>
            <button class="btn-danger" (click)="confirmDelete()" data-testid="confirm-delete-btn">
              Delete Product
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-products {
      padding: 40px 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
    }

    .header-left h1 {
      font-family: 'Bodoni Moda', serif;
      font-size: 2rem;
      color: #C6A87C;
      margin-bottom: 8px;
    }

    .header-left p {
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
      width: 200px;
      cursor: pointer;
    }

    .filters-bar select option {
      background: #1a1a1a;
    }

    /* Products Table */
    .products-table {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(198, 168, 124, 0.2);
    }

    .table-header {
      display: grid;
      grid-template-columns: 80px 1fr 120px 100px 100px 100px;
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
      grid-template-columns: 80px 1fr 120px 100px 100px 100px;
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

    .col-image img {
      width: 60px;
      height: 75px;
      object-fit: cover;
      border: 1px solid rgba(198, 168, 124, 0.2);
    }

    .col-name h4 {
      color: #FAFAFA;
      font-size: 0.9375rem;
      margin-bottom: 4px;
    }

    .product-meta {
      color: #A1A1AA;
      font-size: 0.8125rem;
    }

    .col-category,
    .col-price {
      color: #D4D4D8;
      font-size: 0.9375rem;
    }

    .col-price {
      color: #C6A87C;
      font-weight: 500;
    }

    .status-badge {
      padding: 4px 12px;
      font-size: 0.75rem;
      text-transform: uppercase;
      background: rgba(239, 68, 68, 0.2);
      color: #EF4444;
    }

    .status-badge.active {
      background: rgba(16, 185, 129, 0.2);
      color: #10B981;
    }

    .col-actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #A1A1AA;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 1rem;
    }

    .btn-icon.edit:hover {
      border-color: #C6A87C;
      color: #C6A87C;
    }

    .btn-icon.delete:hover {
      border-color: #EF4444;
      color: #EF4444;
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
      max-width: 700px;
      max-height: 90vh;
      overflow-y: auto;
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
      transition: color 0.3s;
    }

    .close-btn:hover {
      color: #FAFAFA;
    }

    .product-form {
      padding: 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
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

    .form-group input,
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

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: #C6A87C;
    }

    .form-group select option {
      background: #1a1a1a;
    }

    .checkbox-group {
      margin-top: 8px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      color: #D4D4D8;
    }

    .checkbox-label input {
      width: 20px;
      height: 20px;
      accent-color: #C6A87C;
    }

    .error-message {
      color: #EF4444;
      text-align: center;
      padding: 12px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      margin-bottom: 16px;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 24px;
    }

    /* Delete Modal */
    .delete-modal {
      max-width: 450px;
      text-align: center;
      padding: 40px;
    }

    .delete-icon {
      font-size: 3rem;
      margin-bottom: 16px;
    }

    .delete-modal h2 {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.5rem;
      color: #EF4444;
      margin-bottom: 16px;
    }

    .delete-modal p {
      color: #A1A1AA;
      margin-bottom: 24px;
    }

    .delete-modal .form-actions {
      justify-content: center;
    }

    .btn-danger {
      background: #EF4444;
      border: none;
      color: white;
      padding: 12px 24px;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 0.875rem;
      transition: background 0.3s;
    }

    .btn-danger:hover {
      background: #DC2626;
    }

    /* Loading & Empty States */
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

    @media (max-width: 968px) {
      .table-header,
      .table-row {
        grid-template-columns: 60px 1fr 80px 80px;
      }

      .col-category,
      .col-status {
        display: none;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .page-header {
        flex-direction: column;
        gap: 16px;
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
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  
  loading = false;
  saving = false;
  showModal = false;
  showDeleteModal = false;
  editingProduct: Product | null = null;
  productToDelete: Product | null = null;
  
  searchTerm = '';
  selectedCategory = '';
  formError = '';
  imageUrls = '';

  productForm = {
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    metal: '',
    gemstone: '',
    style: '',
    available: true
  };

  constructor(
    private adminService: AdminService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.loading = true;
    this.adminService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.selectedCategory || 
        product.category?.id?.toString() === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  getProductImage(product: Product): string {
    return product.images?.[0] || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200';
  }

  openProductModal(): void {
    this.editingProduct = null;
    this.resetForm();
    this.showModal = true;
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.productForm = {
      name: product.name,
      description: product.description || '',
      price: product.price,
      categoryId: product.category?.id?.toString() || '',
      metal: product.metal || '',
      gemstone: product.gemstone || '',
      style: product.style || '',
      available: product.available
    };
    this.imageUrls = product.images?.join('\n') || '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingProduct = null;
    this.resetForm();
  }

  resetForm(): void {
    this.productForm = {
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      metal: '',
      gemstone: '',
      style: '',
      available: true
    };
    this.imageUrls = '';
    this.formError = '';
  }

  saveProduct(): void {
    if (!this.productForm.name || !this.productForm.categoryId || !this.productForm.price) {
      this.formError = 'Please fill in all required fields';
      return;
    }

    this.saving = true;
    this.formError = '';

    const images = this.imageUrls.split('\n').filter(url => url.trim());
    
    const productData: any = {
      ...this.productForm,
      images,
      category: { id: parseInt(this.productForm.categoryId) }
    };

    const request = this.editingProduct
      ? this.adminService.updateProduct(this.editingProduct.id!, productData)
      : this.adminService.createProduct(productData);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.closeModal();
        this.loadProducts();
      },
      error: (error) => {
        this.saving = false;
        this.formError = error.error?.message || 'Failed to save product';
      }
    });
  }

  deleteProduct(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  confirmDelete(): void {
    if (!this.productToDelete) return;

    this.adminService.deleteProduct(this.productToDelete.id!).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.productToDelete = null;
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error deleting product:', error);
      }
    });
  }
}
