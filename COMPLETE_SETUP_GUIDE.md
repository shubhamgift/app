# Luxury Jewellery Store - Complete Setup Guide

## Project Overview
A full-stack luxury jewellery e-commerce platform built with:
- **Frontend**: Angular 21 (TypeScript)
- **Backend**: Java 17 + Spring Boot 3.2
- **Database**: PostgreSQL

## Prerequisites
- Java JDK 17+
- Maven 3.8+
- Node.js 18+ and npm/yarn
- Angular CLI (`npm install -g @angular/cli`)
- PostgreSQL 14+

## Quick Start

### 1. Database Setup

```bash
# Login to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE jewellery_store;
CREATE USER jewellery_admin WITH ENCRYPTED PASSWORD 'jewellery_2024';
GRANT ALL PRIVILEGES ON DATABASE jewellery_store TO jewellery_admin;

# Connect to the database and grant schema permissions
\c jewellery_store
GRANT ALL ON SCHEMA public TO jewellery_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO jewellery_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO jewellery_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO jewellery_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO jewellery_admin;

\q
```

### 2. Backend Setup

```bash
cd backend-java

# Build the project
mvn clean install -DskipTests

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8081/api`

### 3. Frontend Setup

```bash
cd frontend-angular

# Install dependencies
npm install
# or
yarn install

# Start development server
ng serve --open
```

The frontend will start on `http://localhost:4200`

## Default Credentials

**Admin User:**
- Email: `admin@jewellery.com`
- Password: `admin123`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | User login |

### Products (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/{id}` | Get product details |
| GET | `/api/products?categoryId={id}` | Filter by category |
| GET | `/api/products?search={term}` | Search products |

### Categories (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| GET | `/api/categories/{id}` | Get category details |

### Orders (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create new order |
| GET | `/api/orders/my-orders` | Get user's orders |
| GET | `/api/orders/{id}` | Get order details |

### Custom Requests (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/custom-requests` | Submit custom request |
| GET | `/api/custom-requests/my-requests` | Get user's requests |
| POST | `/api/custom-requests/upload-image` | Upload reference image |

### Admin Endpoints (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/orders` | List all orders |
| PUT | `/api/admin/orders/{id}/status` | Update order status |
| POST | `/api/admin/products` | Create product |
| PUT | `/api/admin/products/{id}` | Update product |
| DELETE | `/api/admin/products/{id}` | Delete product |
| GET | `/api/admin/custom-requests` | List all requests |
| PUT | `/api/admin/custom-requests/{id}` | Respond to request |

## Frontend Features

### Implemented Pages
1. **Home** (`/home`) - Landing page with featured collections
2. **Products** (`/products`) - Product listing with filters
3. **Product Detail** (`/products/:id`) - Individual product view with image gallery
4. **Login** (`/login`) - User authentication
5. **Signup** (`/signup`) - User registration
6. **Cart** (`/cart`) - Shopping cart
7. **Checkout** (`/checkout`) - Order placement (requires login)
8. **Orders** (`/orders`) - Order history (requires login)
9. **Custom Request** (`/custom-request`) - Custom jewellery form (requires login)
10. **My Requests** (`/my-requests`) - View custom requests (requires login)

### Key Components
- `HeaderComponent` - Navigation with cart indicator
- `CartService` - Local storage cart management
- `AuthService` - JWT authentication
- `AuthInterceptor` - Auto-attach JWT tokens

## Project Structure

```
/app
├── backend-java/
│   ├── src/main/java/com/jewellery/store/
│   │   ├── config/          # Security, CORS config
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # Data transfer objects
│   │   ├── model/           # JPA entities
│   │   ├── repository/      # Spring Data repositories
│   │   ├── security/        # JWT utilities
│   │   └── service/         # Business logic
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
└── frontend-angular/
    └── src/app/
        ├── components/
        │   ├── cart/            # Shopping cart
        │   ├── checkout/        # Order placement
        │   ├── custom-request/  # Custom jewellery form
        │   ├── home/            # Landing page
        │   ├── login/           # Authentication
        │   ├── orders/          # Order history
        │   ├── product-detail/  # Product view
        │   ├── products/        # Product listing
        │   ├── shared/          # Header, footer
        │   └── signup/          # Registration
        ├── guards/              # Route guards
        ├── interceptors/        # HTTP interceptors
        ├── models/              # TypeScript interfaces
        └── services/            # API services
```

## Configuration

### Backend (`application.properties`)
```properties
server.port=8081
server.servlet.context-path=/api
spring.datasource.url=jdbc:postgresql://localhost:5432/jewellery_store
spring.datasource.username=jewellery_admin
spring.datasource.password=jewellery_2024
jwt.secret=your-secret-key
jwt.expiration=86400000
```

### Frontend (`environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081/api'
};
```

## Troubleshooting

### 403 Forbidden on API calls
- Ensure `SecurityConfig.java` has correct request matchers
- Check JWT token is being sent in Authorization header

### Database connection issues
- Verify PostgreSQL is running
- Check database credentials in `application.properties`
- Ensure user has proper schema permissions

### CORS errors
- Backend allows origins: `http://localhost:4200`, `http://localhost:4201`
- Add your frontend URL to `SecurityConfig.corsConfigurationSource()`

### Angular build errors
- Run `npm install` or `yarn install`
- Clear Angular cache: `ng cache clean`
- Delete `node_modules` and reinstall

## Production Build

### Backend
```bash
cd backend-java
mvn clean package -DskipTests
java -jar target/jewellery-store-1.0.0.jar
```

### Frontend
```bash
cd frontend-angular
ng build --configuration production
# Deploy dist/frontend-angular/ to your web server
```

## Support
For issues or questions, please create an issue in the repository.
