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
4. **Imitation/Real Selection** - Choose between imitation or real gold/diamond version
5. **Place Order** - Shopping cart and checkout workflow
6. **User Account** - Signup/login with JWT authentication
7. **Order History** - View past orders and status
8. **Custom Jewellery Request** - Form with image upload

### Admin Features
1. **Secure Admin Login** - Role-based access
2. **Dashboard** - Overview of orders, requests, products, revenue
3. **Product CRUD** - Create, update, delete jewellery items (with real/imitation pricing)
4. **Category CRUD** - Manage product categories
5. **Order Management** - View and update order status
6. **Custom Request Management** - Respond to custom requests

---

## Implementation Status

### ✅ Completed (December 2025)

#### Imitation/Real Jewelry Feature (NEW)
- [x] Product model supports imitation price and real price (optional)
- [x] Product detail page with type selection (Imitation vs Real Gold/Diamond)
- [x] Real jewelry shows "Contact for Price" when price is null
- [x] Cart tracks jewelry type per item
- [x] Checkout includes jewelry type in order
- [x] Orders with quote-pending items get "QUOTE_PENDING" status
- [x] Visual badges showing imitation vs real in cart/checkout

#### Backend (Java/Spring Boot)
- [x] Product model with hasRealVersion, realPrice, realMetal, realGemstone
- [x] OrderItem model with jewelryType and priceOnRequest fields
- [x] Order service handles pricing based on jewelry type
- [x] DataSeeder creates sample products with both versions
- [x] All API endpoints support new fields

#### Frontend (Angular 21) - Customer
- [x] Product detail with imitation/real selection UI
- [x] Price display logic (show price vs "Contact for Price")
- [x] Cart service handles jewelry type per item
- [x] Cart shows jewelry type badges and quote notices
- [x] Checkout passes jewelry type to backend
- [x] Order history shows jewelry type per item

#### Admin Panel
- [x] Admin Dashboard with stats
- [x] Admin Products - CRUD with imitation/real fields
- [x] Admin Orders - View orders with jewelry types
- [x] Admin Categories - CRUD
- [x] Admin Requests - View and respond

---

## Key Feature: Imitation vs Real Jewelry

### How It Works:
1. **Each product has two versions**:
   - Imitation: Uses alloy/crystal, always has a price shown
   - Real: Uses precious metals/gems, may have price or "Contact for Price"

2. **Product Display**:
   - Both options shown on product detail page
   - User clicks to select imitation or real
   - Price updates based on selection

3. **Ordering**:
   - Cart tracks which type was selected
   - Checkout shows jewelry type per item
   - Orders with "Contact for Price" items get special status

4. **Database Fields**:
   - `price` - Imitation jewelry price (always set)
   - `realPrice` - Real jewelry price (null = Contact for Price)
   - `hasRealVersion` - Whether real version is available
   - `realMetal`, `realGemstone`, `realSpecifications` - Real version details

---

## API Endpoints Summary

### Public
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/products` (includes real version fields)
- `GET /api/products/{id}`
- `GET /api/categories`

### Authenticated
- `POST /api/orders` (accepts jewelryType per item)
- `GET /api/orders/my-orders`
- `POST /api/custom-requests`
- `GET /api/custom-requests/my-requests`

### Admin Only
- `GET /api/admin/dashboard`
- All CRUD operations for products, categories, orders, requests

---

## Default Credentials
- **Admin**: admin@jewellery.com / admin123

## File Locations
- Backend: `/app/backend-java/`
- Frontend: `/app/frontend-angular/`
- Setup Guide: `/app/COMPLETE_SETUP_GUIDE.md`
- Archive: `/app/jewellery-store-complete-v4.tar.gz`
