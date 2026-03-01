import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-categories">
      <div class="page-header">
        <div class="header-left">
          <h1 data-testid="admin-categories-title">Category Management</h1>
          <p>Manage jewellery categories</p>
        </div>
        <button class="btn-primary" (click)="openModal()" data-testid="add-category-btn">
          + Add Category
        </button>
      </div>

      <!-- Categories Grid -->
      <div class="categories-grid" data-testid="categories-grid">
        <div *ngIf="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading categories...</p>
        </div>

        <div *ngIf="!loading && categories.length === 0" class="empty-state">
          <p>No categories found. Add your first category!</p>
        </div>

        <div 
          *ngFor="let category of categories; let i = index" 
          class="category-card"
          [attr.data-testid]="'category-card-' + i">
          <div class="category-icon">&#128193;</div>
          <div class="category-info">
            <h3>{{ category.name }}</h3>
            <p>{{ category.description || 'No description' }}</p>
            <span class="product-count">{{ category.productCount || 0 }} products</span>
          </div>
          <div class="category-actions">
            <button class="btn-icon edit" (click)="editCategory(category)" [attr.data-testid]="'edit-' + i">
              &#9998;
            </button>
            <button class="btn-icon delete" (click)="deleteCategory(category)" [attr.data-testid]="'delete-' + i">
              &#128465;
            </button>
          </div>
        </div>
      </div>

      <!-- Category Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()" data-testid="category-modal">
          <div class="modal-header">
            <h2>{{ editingCategory ? 'Edit Category' : 'Add New Category' }}</h2>
            <button class="close-btn" (click)="closeModal()">&#10005;</button>
          </div>

          <form (ngSubmit)="saveCategory()" class="category-form">
            <div class="form-group">
              <label>Category Name *</label>
              <input 
                type="text" 
                [(ngModel)]="categoryForm.name" 
                name="name"
                placeholder="e.g., Rings, Necklaces"
                data-testid="category-name"
                required>
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea 
                [(ngModel)]="categoryForm.description" 
                name="description"
                rows="4"
                placeholder="Brief description of this category..."
                data-testid="category-description"></textarea>
            </div>

            <p *ngIf="formError" class="error-message">{{ formError }}</p>

            <div class="form-actions">
              <button type="button" class="btn-outline" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn-primary" [disabled]="saving" data-testid="save-category-btn">
                {{ saving ? 'Saving...' : (editingCategory ? 'Update Category' : 'Add Category') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="showDeleteModal" class="modal-overlay" (click)="cancelDelete()">
        <div class="modal-content delete-modal" (click)="$event.stopPropagation()" data-testid="delete-modal">
          <div class="delete-icon">&#9888;</div>
          <h2>Delete Category</h2>
          <p>Are you sure you want to delete "{{ categoryToDelete?.name }}"?</p>
          <p class="warning" *ngIf="categoryToDelete?.productCount">
            This category has {{ categoryToDelete.productCount }} products. They will become uncategorized.
          </p>
          <div class="form-actions">
            <button class="btn-outline" (click)="cancelDelete()">Cancel</button>
            <button class="btn-danger" (click)="confirmDelete()" data-testid="confirm-delete-btn">
              Delete Category
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-categories {
      padding: 40px 24px;
      max-width: 1200px;
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

    /* Categories Grid */
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .category-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(198, 168, 124, 0.2);
      padding: 24px;
      display: flex;
      gap: 16px;
      transition: all 0.3s;
    }

    .category-card:hover {
      border-color: rgba(198, 168, 124, 0.4);
      transform: translateY(-2px);
    }

    .category-icon {
      font-size: 2rem;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(198, 168, 124, 0.1);
      border-radius: 8px;
      flex-shrink: 0;
    }

    .category-info {
      flex: 1;
      min-width: 0;
    }

    .category-info h3 {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.25rem;
      color: #FAFAFA;
      margin-bottom: 8px;
    }

    .category-info p {
      color: #A1A1AA;
      font-size: 0.875rem;
      margin-bottom: 12px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-count {
      display: inline-block;
      padding: 4px 10px;
      background: rgba(198, 168, 124, 0.1);
      color: #C6A87C;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .category-actions {
      display: flex;
      flex-direction: column;
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
      max-width: 500px;
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

    .category-form {
      padding: 24px;
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
    .form-group textarea {
      width: 100%;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #FAFAFA;
      font-size: 0.9375rem;
      font-family: 'Montserrat', sans-serif;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #C6A87C;
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
    }

    /* Delete Modal */
    .delete-modal {
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
      margin-bottom: 8px;
    }

    .delete-modal .warning {
      color: #F59E0B;
      font-size: 0.875rem;
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

    /* Loading & Empty */
    .loading-state,
    .empty-state {
      grid-column: 1 / -1;
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

    @media (max-width: 640px) {
      .page-header {
        flex-direction: column;
        gap: 16px;
      }

      .category-card {
        flex-direction: column;
      }

      .category-actions {
        flex-direction: row;
      }
    }
  `]
})
export class AdminCategoriesComponent implements OnInit {
  categories: (Category & { productCount?: number })[] = [];
  
  loading = false;
  saving = false;
  showModal = false;
  showDeleteModal = false;
  editingCategory: Category | null = null;
  categoryToDelete: (Category & { productCount?: number }) | null = null;
  formError = '';

  categoryForm = {
    name: '',
    description: ''
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.adminService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
      }
    });
  }

  openModal(): void {
    this.editingCategory = null;
    this.categoryForm = { name: '', description: '' };
    this.formError = '';
    this.showModal = true;
  }

  editCategory(category: Category): void {
    this.editingCategory = category;
    this.categoryForm = {
      name: category.name,
      description: category.description || ''
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingCategory = null;
    this.formError = '';
  }

  saveCategory(): void {
    if (!this.categoryForm.name) {
      this.formError = 'Category name is required';
      return;
    }

    this.saving = true;
    this.formError = '';

    const categoryData = {
      name: this.categoryForm.name,
      description: this.categoryForm.description
    };

    const request = this.editingCategory
      ? this.adminService.updateCategory(this.editingCategory.id!, categoryData)
      : this.adminService.createCategory(categoryData);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.closeModal();
        this.loadCategories();
      },
      error: (error) => {
        this.saving = false;
        this.formError = error.error?.message || 'Failed to save category';
      }
    });
  }

  deleteCategory(category: Category & { productCount?: number }): void {
    this.categoryToDelete = category;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.categoryToDelete = null;
  }

  confirmDelete(): void {
    if (!this.categoryToDelete) return;

    this.adminService.deleteCategory(this.categoryToDelete.id!).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.categoryToDelete = null;
        this.loadCategories();
      },
      error: (error) => {
        console.error('Error deleting category:', error);
      }
    });
  }
}
