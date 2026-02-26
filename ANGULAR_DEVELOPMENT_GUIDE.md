# Angular Frontend Development Guide

## Current Status

### ✅ Completed
1. **Models** (`src/app/models/`)
   - user.model.ts
   - product.model.ts
   - category.model.ts
   - order.model.ts
   - custom-request.model.ts

2. **Services** (`src/app/services/`)
   - auth.service.ts - Complete authentication logic
   - product.service.ts - Product CRUD operations
   - category.service.ts - Category operations
   - order.service.ts - Order management
   - custom-request.service.ts - Custom requests
   - admin.service.ts - Admin dashboard stats

3. **Guards** (`src/app/guards/`)
   - auth.guard.ts - Protects authenticated routes
   - admin.guard.ts - Protects admin routes

4. **Interceptors** (`src/app/interceptors/`)
   - auth.interceptor.ts - Adds JWT token to requests

5. **Routing** (`src/app/app.routes.ts`)
   - Route structure defined
   - Guards configured

6. **Basic Component**
   - home.component.ts - Landing page with hero and categories

### 🔨 To Be Built

#### 1. Authentication Components

**Login Component** (`src/app/components/login/login.component.ts`)
```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Login</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <input 
              type="email" 
              [(ngModel)]="credentials.email" 
              name="email"
              placeholder="Email"
              data-testid="login-email"
              required>
          </div>
          <div class="form-group">
            <input 
              type="password" 
              [(ngModel)]="credentials.password" 
              name="password"
              placeholder="Password"
              data-testid="login-password"
              required>
          </div>
          <button 
            type="submit" 
            class="btn-primary"
            data-testid="login-submit">
            Login
          </button>
          <p *ngIf="error" class="error">{{ error }}</p>
        </form>
        <p class="auth-link">
          Don't have an account? <a routerLink="/signup">Sign up</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .auth-card {
      background: #0a0a0a;
      border: 1px solid rgba(198, 168, 124, 0.2);
      padding: 48px;
      max-width: 450px;
      width: 100%;
    }
    h2 {
      color: #C6A87C;
      margin-bottom: 32px;
      text-align: center;
    }
    .form-group {
      margin-bottom: 24px;
    }
    .error {
      color: #EF4444;
      margin-top: 16px;
      text-align: center;
    }
    .auth-link {
      text-align: center;
      margin-top: 24px;
      color: #A1A1AA;
    }
    .auth-link a {
      color: #C6A87C;
      text-decoration: none;
    }
  `]
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        if (response.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/products']);
        }
      },
      error: (err) => {
        this.error = 'Invalid credentials';
      }
    });
  }
}
```

**Signup Component** - Similar structure to login

#### 2. Product Components

**Products List Component** (`src/app/components/products/products.component.ts`)
- Display product grid
- Implement filters (category, price, metal, gemstone, style)
- Search functionality
- Click to navigate to product detail

Key features:
```typescript
- ngOnInit(): Load products and categories
- applyFilters(): Filter products based on selected criteria
- onCategoryChange(categoryId): Filter by category
- onPriceRangeChange(min, max): Filter by price
- onSearch(term): Search products
```

**Product Detail Component** (`src/app/components/product-detail/product-detail.component.ts`)
- Display product images (image gallery with thumbnails)
- Product information
- Add to cart/order button
- Zoom on image click

Key features:
```typescript
- Get product ID from route params
- Load product details
- Image gallery with main image and thumbnails
- Add to order functionality
```

#### 3. Order Components

**Orders List Component** (`src/app/components/orders/orders.component.ts`)
- Display user's order history
- Order status badges
- Click to view order details

**Order Detail Component**
- Full order information
- Items list
- Shipping details
- Order status

#### 4. Custom Request Components

**Custom Request Form** (`src/app/components/custom-request/custom-request-form.component.ts`)
- Name input
- Description textarea
- Image upload (up to 5 images)
- Preview uploaded images
- Submit button

Key features:
```typescript
- onFileSelect(event): Handle file selection
- uploadImages(): Upload reference images
- submitRequest(): Create custom request
```

**My Requests Component**
- List user's custom requests
- Status display
- Admin response display

#### 5. Admin Components

**Admin Dashboard** (`src/app/components/admin/dashboard/admin-dashboard.component.ts`)
- Display statistics cards
  - Total Products
  - Total Orders
  - Total Custom Requests
  - Total Categories
- Navigation to management sections

**Admin Products** (`src/app/components/admin/products/admin-products.component.ts`)
- Product list with edit/delete actions
- Add new product button
- Product form modal/page
- Image upload for products

**Admin Categories**
- Category list
- Add/Edit/Delete categories
- Simple CRUD interface

**Admin Orders**
- All orders list
- Update order status dropdown
- View order details
- Delete orders

**Admin Custom Requests**
- All custom requests list
- View request details and images
- Update status
- Add admin response

#### 6. Shared Components

**Header/Navigation** (`src/app/components/shared/header.component.ts`)
```typescript
- Logo
- Navigation links (Home, Products, Orders, Custom Request)
- User menu (if authenticated)
  - Profile
  - My Orders
  - Logout
- Admin link (if admin role)
- Login/Signup buttons (if not authenticated)
```

**Footer Component**
- Company information
- Links
- Social media

**Loading Spinner Component**
- Display during API calls

**Product Card Component** (Reusable)
- Used in products grid
- Product image
- Name, price
- Click to view details

## Implementation Steps

### Step 1: Set up routing
Update `app.routes.ts` to import and configure all components

### Step 2: Build authentication flow
1. Create login component
2. Create signup component
3. Test login/signup with backend
4. Implement token storage and auto-login

### Step 3: Build public pages
1. Complete home component (already started)
2. Create products list with filters
3. Create product detail page
4. Test navigation

### Step 4: Build user dashboard
1. Create user orders page
2. Create order detail page
3. Create custom request form
4. Create my requests page

### Step 5: Build admin panel
1. Create admin dashboard
2. Create product management
3. Create category management
4. Create order management
5. Create custom request management

### Step 6: Add polish
1. Error handling
2. Loading states
3. Form validation
4. Responsive design
5. Animations

## Component Generation Commands

```bash
# Generate components
ng generate component components/login
ng generate component components/signup
ng generate component components/products
ng generate component components/product-detail
ng generate component components/orders
ng generate component components/order-detail
ng generate component components/custom-request/form
ng generate component components/custom-request/list
ng generate component components/admin/dashboard
ng generate component components/admin/products
ng generate component components/admin/categories
ng generate component components/admin/orders
ng generate component components/admin/custom-requests
ng generate component components/shared/header
ng generate component components/shared/footer
ng generate component components/shared/product-card
ng generate component components/shared/loading
```

## Design Guidelines Reference

Use the design system from `/app/design_guidelines.json`:

### Colors
- Primary Gold: `#C6A87C`
- Background: `#050505`
- Card Background: `#0a0a0a`
- Text: `#FAFAFA`
- Muted Text: `#A1A1AA`
- Border: `rgba(255, 255, 255, 0.1)`

### Typography
- Headings: `font-family: 'Bodoni Moda', serif`
- Body: `font-family: 'Montserrat', sans-serif`

### Buttons
```css
.btn-primary {
  background: #C6A87C;
  color: #000;
  padding: 16px 32px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.btn-outline {
  border: 1px solid #C6A87C;
  color: #C6A87C;
  background: transparent;
}
```

## Example: Complete Product Card Component

```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-card" 
         (click)="navigateToDetail()"
         [attr.data-testid]="'product-card-' + product.id">
      <div class="product-image">
        <img 
          [src]="product.images[0] || 'https://via.placeholder.com/400x500'" 
          [alt]="product.name">
      </div>
      <div class="product-info">
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-price">\${{ product.price | number:'1.2-2' }}</p>
        <span class="product-category">{{ product.category?.name }}</span>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    .product-card:hover {
      transform: translateY(-8px);
    }
    .product-image {
      aspect-ratio: 3/4;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 16px;
    }
    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
    }
    .product-card:hover .product-image img {
      transform: scale(1.1);
    }
    .product-info {
      text-align: center;
    }
    .product-name {
      font-size: 1.125rem;
      color: #FAFAFA;
      margin-bottom: 8px;
    }
    .product-price {
      font-size: 1.25rem;
      color: #C6A87C;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .product-category {
      font-size: 0.875rem;
      color: #A1A1AA;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private router: Router) {}

  navigateToDetail() {
    this.router.navigate(['/products', this.product.id]);
  }
}
```

## Testing Components

### Test authentication:
1. Navigate to `/login`
2. Enter credentials
3. Verify token stored in localStorage
4. Verify redirect based on role

### Test products:
1. Navigate to `/products`
2. Verify products load from API
3. Test filters
4. Click product → verify detail page loads

### Test orders:
1. Login as user
2. Navigate to `/orders`
3. Verify orders list displays
4. Test create order flow

### Test admin:
1. Login as admin
2. Navigate to `/admin`
3. Test CRUD operations on products/categories
4. Test order status updates
5. Test custom request management

## Common Patterns

### Loading State
```typescript
isLoading = false;

loadData() {
  this.isLoading = true;
  this.service.getData().subscribe({
    next: (data) => {
      this.data = data;
      this.isLoading = false;
    },
    error: (err) => {
      this.error = err.message;
      this.isLoading = false;
    }
  });
}
```

### Error Handling
```typescript
error = '';

handleError(err: any) {
  this.error = err.error?.message || 'An error occurred';
  setTimeout(() => this.error = '', 5000); // Clear after 5s
}
```

### Form Validation
```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

form: FormGroup;

constructor(private fb: FormBuilder) {
  this.form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
}

get email() { return this.form.get('email'); }
get password() { return this.form.get('password'); }

onSubmit() {
  if (this.form.valid) {
    // Submit form
  }
}
```

## Resources

- Angular Documentation: https://angular.dev
- Backend API: http://localhost:8081/api
- API Documentation: `/app/README.md`
- API Testing Guide: `/app/API_TESTING.md`
- Design Guidelines: `/app/design_guidelines.json`
