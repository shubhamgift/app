# Luxury Jewellery Store - Full Stack Application

## Tech Stack
- **Frontend:** Angular 19 (Port 4200)
- **Backend:** Java Spring Boot 3.2.0 (Port 8081)
- **Database:** PostgreSQL 15

## Design Theme
- **Color Scheme:** Gold (#C6A87C) / Black (#050505) Luxury Theme
- **Style:** Minimalist Modern
- **Typography:** Bodoni Moda (headings) + Montserrat (body)

---

## Backend Setup Complete ✅

### Services Running
- Spring Boot API: `http://localhost:8081/api`
- PostgreSQL: `localhost:5432/jewellery_store`
- Angular Dev Server: `http://localhost:4200`

### Admin Credentials
```
Email: admin@jewellery.com
Password: admin123
```

### Database
- Database: `jewellery_store`
- User: `jewellery_admin`
- Password: `jewellery_2024`

---

## API Endpoints Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user
```json
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "address": "123 Main St"
}

Response:
{
  "token": "eyJhbGc...",
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "USER"
}
```

#### POST `/api/auth/login`
Login existing user
```json
Request:
{
  "email": "admin@jewellery.com",
  "password": "admin123"
}

Response:
{
  "token": "eyJhbGc...",
  "email": "admin@jewellery.com",
  "fullName": "Admin User",
  "role": "ADMIN"
}
```

### Category Endpoints

#### GET `/api/categories`
Get all categories (Public)
```json
Response: [
  {
    "id": 1,
    "name": "Rings",
    "description": "Luxury rings",
    "createdAt": "2024-01-01T00:00:00"
  }
]
```

#### GET `/api/categories/{id}`
Get category by ID (Public)

### Product Endpoints

#### GET `/api/products`
Get all products with optional filters (Public)
```
Query Parameters:
- categoryId (optional)
- metal (optional)
- gemstone (optional)
- style (optional)
- minPrice (optional)
- maxPrice (optional)
- search (optional)

Example: /api/products?categoryId=1&minPrice=1000&maxPrice=5000
```

#### GET `/api/products/{id}`
Get product by ID (Public)
```json
Response:
{
  "id": 1,
  "name": "Diamond Ring",
  "description": "Beautiful diamond ring",
  "price": 2500.00,
  "category": {
    "id": 1,
    "name": "Rings"
  },
  "metal": "Gold",
  "gemstone": "Diamond",
  "style": "Classic",
  "images": ["/uploads/products/image1.jpg"],
  "specifications": "18K Gold, 1ct Diamond",
  "available": true,
  "createdAt": "2024-01-01T00:00:00"
}
```

#### POST `/api/products/upload-image`
Upload single product image (Authenticated)
```
Content-Type: multipart/form-data
Body: file (image)

Response: "/uploads/products/filename.jpg"
```

### Order Endpoints (Require Authentication)

#### POST `/api/orders`
Create a new order
```json
Headers:
Authorization: Bearer {token}

Request:
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ],
  "shippingAddress": "123 Main St, City",
  "phone": "+1234567890"
}

Response:
{
  "id": 1,
  "user": {...},
  "items": [...],
  "totalAmount": 5000.00,
  "status": "PENDING",
  "shippingAddress": "123 Main St, City",
  "phone": "+1234567890",
  "createdAt": "2024-01-01T00:00:00"
}
```

#### GET `/api/orders/my-orders`
Get current user's orders
```
Headers:
Authorization: Bearer {token}
```

#### GET `/api/orders/{id}`
Get order by ID

### Custom Request Endpoints (Require Authentication)

#### POST `/api/custom-requests`
Create custom jewellery request
```json
Headers:
Authorization: Bearer {token}

Request:
{
  "name": "Custom Diamond Necklace",
  "description": "I want a custom diamond necklace with...",
  "referenceImages": [
    "/uploads/custom-requests/ref1.jpg",
    "/uploads/custom-requests/ref2.jpg"
  ]
}
```

#### GET `/api/custom-requests/my-requests`
Get current user's custom requests

#### POST `/api/custom-requests/upload-image`
Upload reference image
```
Content-Type: multipart/form-data
Body: file (image)
```

### Admin Endpoints (Require ADMIN Role)

#### GET `/api/admin/dashboard`
Get dashboard statistics
```json
Response:
{
  "totalProducts": 50,
  "totalOrders": 120,
  "totalRequests": 25,
  "totalCategories": 4
}
```

#### POST `/api/admin/categories`
Create new category
```json
Request:
{
  "name": "Pendants",
  "description": "Luxury pendants"
}
```

#### PUT `/api/admin/categories/{id}`
Update category

#### DELETE `/api/admin/categories/{id}`
Delete category

#### POST `/api/admin/products`
Create new product
```json
Request:
{
  "name": "Gold Ring",
  "description": "Beautiful gold ring",
  "price": 1500.00,
  "category": {"id": 1},
  "metal": "Gold",
  "gemstone": "Ruby",
  "style": "Modern",
  "images": ["/uploads/products/image.jpg"],
  "specifications": "18K Gold",
  "available": true
}
```

#### PUT `/api/admin/products/{id}`
Update product

#### DELETE `/api/admin/products/{id}`
Delete product

#### POST `/api/admin/products/upload-images`
Upload multiple product images
```
Content-Type: multipart/form-data
Body: files[] (multiple images)

Response: ["/uploads/products/image1.jpg", "/uploads/products/image2.jpg"]
```

#### GET `/api/admin/orders`
Get all orders

#### PUT `/api/admin/orders/{id}/status`
Update order status
```json
Request:
{
  "status": "COMPLETED"
}

Status values: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, COMPLETED
```

#### DELETE `/api/admin/orders/{id}`
Delete order

#### GET `/api/admin/custom-requests`
Get all custom requests

#### PUT `/api/admin/custom-requests/{id}`
Update custom request
```json
Request:
{
  "status": "IN_PROGRESS",
  "adminResponse": "We are working on your custom design..."
}

Status values: PENDING, IN_PROGRESS, COMPLETED, REJECTED
```

#### DELETE `/api/admin/custom-requests/{id}`
Delete custom request

---

## Frontend Structure (Angular)

### What's Complete
- ✅ Angular project initialized
- ✅ Development server running
- ✅ Global styles with luxury theme
- ✅ Environment configuration
- ✅ Basic project structure

### What Needs to Be Built

#### 1. Services (`src/app/services/`)
- `auth.service.ts` - Authentication (login, signup, token management)
- `api.service.ts` - HTTP client wrapper
- `product.service.ts` - Product CRUD operations
- `category.service.ts` - Category operations
- `order.service.ts` - Order operations
- `custom-request.service.ts` - Custom request operations

#### 2. Models (`src/app/models/`)
- `user.model.ts`
- `product.model.ts`
- `category.model.ts`
- `order.model.ts`
- `custom-request.model.ts`

#### 3. Components

**Public Pages:**
- `home` - Homepage with hero section and category grid
- `products` - Product listing with filters
- `product-detail` - Single product view with image gallery
- `login` - User login form
- `signup` - User registration form

**User Dashboard:**
- `user-dashboard` - User profile and navigation
- `orders` - Order history
- `order-detail` - Single order view
- `custom-request` - Custom jewellery request form
- `custom-requests-list` - User's custom requests

**Admin Panel:**
- `admin-dashboard` - Statistics and overview
- `admin-products` - Product management (list, add, edit, delete)
- `admin-categories` - Category management
- `admin-orders` - Order management
- `admin-custom-requests` - Custom request management

#### 4. Guards
- `auth.guard.ts` - Protect authenticated routes
- `admin.guard.ts` - Protect admin routes

#### 5. Interceptors
- `auth.interceptor.ts` - Add JWT token to requests
- `error.interceptor.ts` - Handle HTTP errors

---

## Starting the Application

### Backend
```bash
cd /app/backend-java
java -jar target/jewellery-store-1.0.0.jar
```

### Frontend
```bash
cd /app/frontend-angular
ng serve
```

Access at: `http://localhost:4200`

---

## Database Schema

### Tables
- `users` - User accounts (id, email, password, full_name, phone, address, role, created_at, updated_at)
- `categories` - Product categories (id, name, description, created_at, updated_at)
- `products` - Jewellery products (id, name, description, price, category_id, metal, gemstone, style, specifications, available, created_at, updated_at)
- `product_images` - Product image URLs (product_id, image_url)
- `orders` - Customer orders (id, user_id, total_amount, status, shipping_address, phone, created_at, updated_at)
- `order_items` - Order line items (id, order_id, product_id, quantity, price)
- `custom_requests` - Custom jewellery requests (id, user_id, name, description, status, admin_response, created_at, updated_at)
- `custom_request_images` - Reference images (request_id, image_url)

---

## Image Upload Configuration
- Max file size: 200MB
- Allowed formats: JPEG, JPG, PNG
- Products: 1-5 images per product
- Custom requests: Up to 5 reference images

---

## Next Steps for Frontend Development

1. **Create Authentication Service**
   - Implement login/signup
   - Store JWT token in localStorage
   - Add token to HTTP headers

2. **Create API Services**
   - Use Angular HttpClient
   - Connect to backend endpoints
   - Handle responses and errors

3. **Build Components**
   - Start with public pages (home, products, product-detail)
   - Then user dashboard (orders, custom requests)
   - Finally admin panel

4. **Implement Routing**
   - Set up route guards
   - Configure lazy loading for better performance

5. **Add Styling**
   - Follow design guidelines in `/app/design_guidelines.json`
   - Use Gold/Black luxury theme
   - Ensure responsive design

6. **Testing**
   - Test all API integrations
   - Verify authentication flow
   - Test file uploads
   - Validate forms

---

## Example API Usage

```bash
# Login as admin
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jewellery.com","password":"admin123"}'

# Get all categories
curl http://localhost:8081/api/categories

# Get all products
curl http://localhost:8081/api/products

# Create product (with auth token)
curl -X POST http://localhost:8081/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"Gold Ring","description":"Beautiful gold ring","price":1500,"category":{"id":1},"metal":"Gold","images":[],"available":true}'
```

---

## Troubleshooting

### Backend not starting
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Start PostgreSQL
sudo service postgresql start

# Check backend logs
tail -f /tmp/spring-run.log
```

### Frontend not starting
```bash
# Install dependencies
cd /app/frontend-angular
npm install

# Start dev server
ng serve
```

### Port conflicts
- Backend: Port 8081
- Frontend: Port 4200
- PostgreSQL: Port 5432
