# API Testing Examples

## Test Backend API

### 1. Test Categories Endpoint (Public)
```bash
curl -X GET http://localhost:8081/api/categories
```

### 2. Test Login (Get JWT Token)
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@jewellery.com",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "email": "admin@jewellery.com",
  "fullName": "Admin User",
  "role": "ADMIN"
}
```

Save the token for authenticated requests.

### 3. Test User Signup
```bash
curl -X POST http://localhost:8081/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "customer123",
    "fullName": "John Customer",
    "phone": "+1234567890",
    "address": "123 Main Street, City, Country"
  }'
```

### 4. Test Create Product (Admin Only)
```bash
# First, get the admin token from login

TOKEN="YOUR_ADMIN_TOKEN_HERE"

curl -X POST http://localhost:8081/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Diamond Engagement Ring",
    "description": "Stunning 18K white gold diamond ring with 1.5ct center stone",
    "price": 5500.00,
    "category": {"id": 1},
    "metal": "White Gold",
    "gemstone": "Diamond",
    "style": "Classic",
    "images": [],
    "specifications": "18K White Gold, 1.5ct Diamond, SI1 Clarity",
    "available": true
  }'
```

### 5. Test Get All Products (Public)
```bash
curl -X GET http://localhost:8081/api/products
```

### 6. Test Get Products with Filters
```bash
# Filter by category
curl -X GET "http://localhost:8081/api/products?categoryId=1"

# Filter by price range
curl -X GET "http://localhost:8081/api/products?minPrice=1000&maxPrice=10000"

# Filter by metal
curl -X GET "http://localhost:8081/api/products?metal=Gold"

# Combined filters
curl -X GET "http://localhost:8081/api/products?categoryId=1&metal=Gold&minPrice=2000"

# Search
curl -X GET "http://localhost:8081/api/products?search=diamond"
```

### 7. Test Create Order (Authenticated)
```bash
# Login first and get user token
USER_TOKEN="YOUR_USER_TOKEN_HERE"

curl -X POST http://localhost:8081/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "items": [
      {
        "productId": 1,
        "quantity": 1
      }
    ],
    "shippingAddress": "123 Main Street, City, State 12345",
    "phone": "+1234567890"
  }'
```

### 8. Test Get My Orders
```bash
curl -X GET http://localhost:8081/api/orders/my-orders \
  -H "Authorization: Bearer $USER_TOKEN"
```

### 9. Test Create Custom Request (Authenticated)
```bash
curl -X POST http://localhost:8081/api/custom-requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "name": "Custom Diamond Necklace",
    "description": "I would like a custom necklace with emerald-cut diamonds in a vintage art deco style. Approximately 18 inches in length.",
    "referenceImages": []
  }'
```

### 10. Test Get My Custom Requests
```bash
curl -X GET http://localhost:8081/api/custom-requests/my-requests \
  -H "Authorization: Bearer $USER_TOKEN"
```

### 11. Test Admin Dashboard Stats
```bash
curl -X GET http://localhost:8081/api/admin/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "totalProducts": 5,
  "totalOrders": 12,
  "totalRequests": 3,
  "totalCategories": 4
}
```

### 12. Test Get All Orders (Admin)
```bash
curl -X GET http://localhost:8081/api/admin/orders \
  -H "Authorization: Bearer $TOKEN"
```

### 13. Test Update Order Status (Admin)
```bash
curl -X PUT http://localhost:8081/api/admin/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "SHIPPED"
  }'
```

**Valid Status Values:**
- PENDING
- PROCESSING
- SHIPPED
- DELIVERED
- CANCELLED
- COMPLETED

### 14. Test Get All Custom Requests (Admin)
```bash
curl -X GET http://localhost:8081/api/admin/custom-requests \
  -H "Authorization: Bearer $TOKEN"
```

### 15. Test Update Custom Request (Admin)
```bash
curl -X PUT http://localhost:8081/api/admin/custom-requests/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "IN_PROGRESS",
    "adminResponse": "We have received your custom design request. Our master jeweler will begin creating sketches based on your specifications. We will send you the initial designs within 5-7 business days for your approval."
  }'
```

**Valid Status Values:**
- PENDING
- IN_PROGRESS
- COMPLETED
- REJECTED

### 16. Test Create Category (Admin)
```bash
curl -X POST http://localhost:8081/api/admin/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Pendants",
    "description": "Luxury pendant necklaces"
  }'
```

### 17. Test Update Product (Admin)
```bash
curl -X PUT http://localhost:8081/api/admin/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Diamond Engagement Ring - Updated",
    "description": "Stunning 18K white gold diamond ring",
    "price": 5800.00,
    "category": {"id": 1},
    "metal": "White Gold",
    "gemstone": "Diamond",
    "style": "Classic",
    "images": [],
    "specifications": "18K White Gold, 1.5ct Diamond",
    "available": true
  }'
```

### 18. Test Delete Product (Admin)
```bash
curl -X DELETE http://localhost:8081/api/admin/products/1 \
  -H "Authorization: Bearer $TOKEN"
```

## Quick Test Script

Save this as `test-api.sh` and run it:

```bash
#!/bin/bash

API_URL="http://localhost:8081/api"

echo "=== Testing Jewellery Store API ==="
echo ""

echo "1. Testing public categories endpoint..."
curl -s $API_URL/categories | python3 -m json.tool | head -20
echo ""

echo "2. Testing admin login..."
RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jewellery.com","password":"admin123"}')

TOKEN=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed"
  exit 1
fi

echo "✅ Login successful"
echo "Token: ${TOKEN:0:50}..."
echo ""

echo "3. Testing admin dashboard..."
curl -s $API_URL/admin/dashboard \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

echo "4. Testing create product..."
curl -s -X POST $API_URL/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Gold Ring",
    "description": "Beautiful test ring",
    "price": 1500.00,
    "category": {"id": 1},
    "metal": "Gold",
    "gemstone": "Ruby",
    "style": "Modern",
    "images": [],
    "specifications": "18K Gold",
    "available": true
  }' | python3 -m json.tool | head -20
echo ""

echo "5. Testing get all products..."
curl -s $API_URL/products | python3 -m json.tool | head -30
echo ""

echo "=== All tests completed ==="
```

Make it executable and run:
```bash
chmod +x test-api.sh
./test-api.sh
```

## Image Upload Testing

### Upload Single Product Image
```bash
curl -X POST http://localhost:8081/api/products/upload-image \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/your/image.jpg"
```

### Upload Multiple Product Images (Admin)
```bash
curl -X POST http://localhost:8081/api/admin/products/upload-images \
  -H "Authorization: Bearer $TOKEN" \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpg" \
  -F "files=@/path/to/image3.jpg"
```

### Upload Custom Request Reference Image
```bash
curl -X POST http://localhost:8081/api/custom-requests/upload-image \
  -H "Authorization: Bearer $USER_TOKEN" \
  -F "file=@/path/to/reference.jpg"
```

## Notes

- All authenticated endpoints require the `Authorization: Bearer TOKEN` header
- Admin endpoints require a user with `ADMIN` role
- Image uploads support JPEG, JPG, and PNG formats
- Maximum file size: 200MB
- Products can have 1-5 images
- Custom requests can have up to 5 reference images
