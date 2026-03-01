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
2. **Dashboard** - Overview of orders, requests, products
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
- [x] AdminController - admin-only operations
- [x] SecurityConfig with proper URL matchers
- [x] DataSeeder for initial data
- [x] File upload service for images

#### Frontend (Angular 21)
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

#### Documentation
- [x] Complete setup guide
- [x] API documentation
- [x] Local development instructions
- [x] Downloadable project archive

---

### ⏳ Pending / Future Tasks

#### Admin Panel UI (P2)
- [ ] Admin dashboard with statistics
- [ ] Product management interface
- [ ] Category management interface
- [ ] Order management with status updates
- [ ] Custom request response interface

#### Enhancements (P3)
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
- `GET /api/admin/orders`
- `PUT /api/admin/orders/{id}/status`
- `POST /api/admin/products`
- `PUT/DELETE /api/admin/products/{id}`
- `GET /api/admin/custom-requests`

---

## Default Credentials
- **Admin**: admin@jewellery.com / admin123

## File Locations
- Backend: `/app/backend-java/`
- Frontend: `/app/frontend-angular/`
- Setup Guide: `/app/COMPLETE_SETUP_GUIDE.md`
- Archive: `/app/jewellery-store-complete-v2.tar.gz`
