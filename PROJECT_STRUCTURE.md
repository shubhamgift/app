# Project Structure Overview

## Backend (Spring Boot + PostgreSQL)

```
/app/backend-java/
├── pom.xml                                 # Maven dependencies
├── target/
│   └── jewellery-store-1.0.0.jar          # Compiled application
└── src/main/
    ├── resources/
    │   └── application.properties          # Database & app configuration
    └── java/com/jewellery/store/
        ├── JewelleryStoreApplication.java  # Main application entry
        ├── model/                          # Entity models
        │   ├── User.java
        │   ├── Category.java
        │   ├── Product.java
        │   ├── Order.java
        │   ├── OrderItem.java
        │   └── CustomRequest.java
        ├── repository/                     # JPA repositories
        │   ├── UserRepository.java
        │   ├── CategoryRepository.java
        │   ├── ProductRepository.java
        │   ├── OrderRepository.java
        │   └── CustomRequestRepository.java
        ├── service/                        # Business logic
        │   ├── AuthService.java
        │   ├── CategoryService.java
        │   ├── ProductService.java
        │   ├── OrderService.java
        │   └── CustomRequestService.java
        ├── controller/                     # REST API endpoints
        │   ├── AuthController.java
        │   ├── CategoryController.java
        │   ├── ProductController.java
        │   ├── OrderController.java
        │   ├── CustomRequestController.java
        │   └── AdminController.java
        ├── dto/                            # Data transfer objects
        │   ├── LoginRequest.java
        │   ├── SignupRequest.java
        │   ├── AuthResponse.java
        │   └── OrderRequest.java
        ├── security/                       # Security configuration
        │   ├── JwtUtil.java
        │   └── JwtAuthenticationFilter.java
        └── config/                         # Application configuration
            ├── SecurityConfig.java
            ├── WebConfig.java
            └── DataSeeder.java
```

## Frontend (Angular)

```
/app/frontend-angular/
├── package.json                           # npm dependencies
├── angular.json                           # Angular configuration
├── tsconfig.json                          # TypeScript configuration
└── src/
    ├── index.html                         # Main HTML file
    ├── main.ts                            # Application bootstrap
    ├── styles.css                         # Global styles
    ├── environments/
    │   └── environment.ts                 # Environment config (API URL)
    └── app/
        ├── app.ts                         # Root component
        ├── app.config.ts                  # App configuration
        ├── app.routes.ts                  # Routing configuration
        ├── models/                        # TypeScript interfaces
        │   ├── user.model.ts              ✅ Complete
        │   ├── product.model.ts           ✅ Complete
        │   ├── category.model.ts          ✅ Complete
        │   ├── order.model.ts             ✅ Complete
        │   └── custom-request.model.ts    ✅ Complete
        ├── services/                      # API services
        │   ├── auth.service.ts            ✅ Complete
        │   ├── product.service.ts         ✅ Complete
        │   ├── category.service.ts        ✅ Complete
        │   ├── order.service.ts           ✅ Complete
        │   ├── custom-request.service.ts  ✅ Complete
        │   └── admin.service.ts           ✅ Complete
        ├── guards/                        # Route guards
        │   ├── auth.guard.ts              ✅ Complete
        │   └── admin.guard.ts             ✅ Complete
        ├── interceptors/                  # HTTP interceptors
        │   └── auth.interceptor.ts        ✅ Complete
        └── components/                    # UI components
            ├── home/
            │   └── home.component.ts      ✅ Complete (Basic)
            ├── login/                     ⚠️  To Be Built
            ├── signup/                    ⚠️  To Be Built
            ├── products/                  ⚠️  To Be Built
            ├── product-detail/            ⚠️  To Be Built
            ├── orders/                    ⚠️  To Be Built
            ├── order-detail/              ⚠️  To Be Built
            ├── custom-request/            ⚠️  To Be Built
            ├── admin/                     ⚠️  To Be Built
            │   ├── dashboard/
            │   ├── products/
            │   ├── categories/
            │   ├── orders/
            │   └── custom-requests/
            └── shared/                    ⚠️  To Be Built
                ├── header/
                ├── footer/
                ├── product-card/
                └── loading/
```

## Database (PostgreSQL)

```
Database: jewellery_store
Port: 5432
User: jewellery_admin
Password: jewellery_2024

Tables:
├── users                      # User accounts
├── categories                 # Product categories
├── products                   # Jewellery products
├── product_images             # Product image URLs
├── orders                     # Customer orders
├── order_items                # Order line items
├── custom_requests            # Custom jewellery requests
└── custom_request_images      # Custom request reference images
```

## Documentation Files

```
/app/
├── README.md                           # Main documentation
├── API_TESTING.md                      # API testing examples
└── ANGULAR_DEVELOPMENT_GUIDE.md        # Frontend development guide
```

## Configuration Files

```
Backend:
- /app/backend-java/src/main/resources/application.properties
  * Server port: 8081
  * Database connection
  * JWT secret
  * File upload settings

Frontend:
- /app/frontend-angular/src/environments/environment.ts
  * API URL: http://localhost:8081/api

Supervisor:
- /etc/supervisor/conf.d/jewellery-store.conf
  * Spring Boot service configuration
  * Angular dev server configuration
```

## Services & Ports

| Service      | Port | Status  | Purpose                    |
|--------------|------|---------|----------------------------|
| Spring Boot  | 8081 | Running | REST API backend           |
| Angular      | 4200 | Running | Frontend development server|
| PostgreSQL   | 5432 | Running | Database                   |

## Quick Start Commands

### Start Backend
```bash
cd /app/backend-java
java -jar target/jewellery-store-1.0.0.jar
```

### Start Frontend
```bash
cd /app/frontend-angular
ng serve
```

### Check Services
```bash
sudo supervisorctl status
```

### View Logs
```bash
# Spring Boot logs
tail -f /tmp/spring-run.log

# Angular logs
tail -f /var/log/supervisor/angular.out.log
```

## Admin Access

**Email:** admin@jewellery.com  
**Password:** admin123

Use these credentials to:
- Create products
- Manage categories
- View all orders
- Manage custom requests
- Access admin dashboard

## Seeded Data

The backend automatically seeds:
- 1 admin user
- 4 categories (Rings, Earrings, Necklaces, Bracelets)

## File Uploads

Uploaded files are stored in:
- Products: `/app/backend-java/uploads/products/`
- Custom Requests: `/app/backend-java/uploads/custom-requests/`

## Development Workflow

1. **Backend Changes:**
   ```bash
   cd /app/backend-java
   mvn package -DskipTests
   sudo killall java
   java -jar target/jewellery-store-1.0.0.jar &
   ```

2. **Frontend Changes:**
   - Angular has hot reload enabled
   - Changes are automatically reflected

3. **Database Changes:**
   - JPA auto-updates schema on startup
   - Or use manual migrations if needed

## Next Steps

1. Build remaining Angular components (see ANGULAR_DEVELOPMENT_GUIDE.md)
2. Test all API endpoints (see API_TESTING.md)
3. Add more products via admin panel
4. Customize styling and branding
5. Add additional features as needed

## Key Files to Review

1. **Backend Entry Point:** `/app/backend-java/src/main/java/com/jewellery/store/JewelleryStoreApplication.java`
2. **Security Configuration:** `/app/backend-java/src/main/java/com/jewellery/store/config/SecurityConfig.java`
3. **Frontend Entry Point:** `/app/frontend-angular/src/app/app.ts`
4. **Routing:** `/app/frontend-angular/src/app/app.routes.ts`
5. **Environment Config:** `/app/frontend-angular/src/environments/environment.ts`
