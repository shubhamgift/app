# Luxury Jewellery Store - Product Requirements Document

## Project Overview
A full-stack luxury jewellery e-commerce platform enabling customers to browse, purchase, and request custom jewellery.

## Tech Stack
- **Frontend**: Angular 21 (TypeScript)
- **Backend**: Java 17 + Spring Boot 3.2
- **Database**: PostgreSQL
- **Authentication**: JWT

## User Requirements

### Customer Features
1. **Homepage** - Featured jewellery categories (rings, earrings, necklaces, bracelets)
2. **Product Listing** - Filters by type, price, metal, gemstone, and style
3. **Product Detail** - Images, description, specifications, price, availability
4. **Place Order** - Shopping cart and checkout workflow
5. **User Account** - Signup/login with JWT authentication
6. **Order History** - View past orders and status
7. **Custom Jewellery Request** - Form with image upload

### Admin Features
1. **Secure Admin Login** - Role-based access
2. **Dashboard** - Overview of orders, requests, products, revenue
3. **Product CRUD** - Create, update, delete jewellery items
4. **Category CRUD** - Manage product categories
5. **Order Management** - View and update order status
6. **Custom Request Management** - Respond to custom requests

---

## Implementation Status

### ✅ Completed (December 2025)

#### Backend (Java/Spring Boot)
- [x] Project structure with Spring Boot 3.2
- [x] PostgreSQL database integration with JPA/Hibernate
- [x] JWT authentication system
- [x] User entity and repository
- [x] Product entity with category relationship
- [x] Category entity and CRUD operations
- [x] Order entity with OrderItem relationship
- [x] CustomRequest entity for custom jewellery
- [x] AuthController - signup/login endpoints
- [x] ProductController - public product endpoints
- [x] CategoryController - public category endpoints  
- [x] OrderController - authenticated order operations
- [x] CustomRequestController - request submission
- [x] AdminController - full admin API
- [x] SecurityConfig with proper URL matchers
- [x] DataSeeder for initial data
- [x] File upload service for images

#### Frontend (Angular 21) - Customer
- [x] Project setup with standalone components
- [x] Routing configuration
- [x] Auth service with JWT management
- [x] Auth interceptor for token injection
- [x] Auth guard for protected routes
- [x] Header component with cart indicator
- [x] Home page with featured collections
- [x] Products page with filtering
- [x] Product detail with image gallery
- [x] Login component with form validation
- [x] Signup component with form validation
- [x] Cart service (local storage)
- [x] Cart component with quantity controls
- [x] Checkout component with shipping form
- [x] Order history component
- [x] Custom request form with image upload
- [x] My requests component

#### Frontend (Angular 21) - Admin Panel
- [x] Admin Dashboard with stats and quick actions
- [x] Admin Products - List, create, edit, delete products
- [x] Admin Orders - View all orders, update status, view details
- [x] Admin Categories - CRUD for categories
- [x] Admin Requests - View and respond to custom requests

#### Documentation
- [x] Complete setup guide
- [x] API documentation
- [x] Local development instructions
- [x] Downloadable project archive

---

### ⏳ Future Enhancements (P3)
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] Advanced search with autocomplete
- [ ] Product recommendations
- [ ] Inventory management
- [ ] Discount/coupon system

---

## API Endpoints Summary

### Public
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/categories`

### Authenticated
- `POST /api/orders`
- `GET /api/orders/my-orders`
- `POST /api/custom-requests`
- `GET /api/custom-requests/my-requests`

### Admin Only
- `GET /api/admin/dashboard`
- `GET /api/admin/orders`
- `PUT /api/admin/orders/{id}/status`
- `POST /api/admin/products`
- `PUT/DELETE /api/admin/products/{id}`
- `POST /api/admin/categories`
- `PUT/DELETE /api/admin/categories/{id}`
- `GET /api/admin/custom-requests`
- `PUT /api/admin/custom-requests/{id}`

---

## Default Credentials
- **Admin**: admin@jewellery.com / admin123

## File Locations
- Backend: `/app/backend-java/`
- Frontend: `/app/frontend-angular/`
- Setup Guide: `/app/COMPLETE_SETUP_GUIDE.md`
- Archive: `/app/jewellery-store-complete-v3.tar.gz`
