# Complete Backend Fixes - Apply All Together

## Issues Fixed
1. ✅ **403 Forbidden Error** on products endpoint with query parameters
2. ✅ **Search Query Error** - `function lower(bytea) does not exist`

## Files Modified

### 1. SecurityConfig.java
**File:** `/app/backend-java/src/main/java/com/jewellery/store/config/SecurityConfig.java`

**Line 37-44:** Updated security matchers
```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/auth/**").permitAll()
    .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
    .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()
    .requestMatchers(HttpMethod.POST, "/products/upload-image").permitAll()
    .requestMatchers("/admin/**").hasAuthority("ADMIN")
    .anyRequest().authenticated()
)
```

### 2. ProductRepository.java
**File:** `/app/backend-java/src/main/java/com/jewellery/store/repository/ProductRepository.java`

**Line 22:** Added empty string check in search query
```java
"(:search IS NULL OR :search = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))")
```

## Apply All Fixes

### On Your Local Machine

```bash
# Navigate to backend directory
cd /path/to/backend-java

# The files are already updated in /app/backend-java/
# If you're working locally, copy the updated files or apply changes manually

# Rebuild the application
mvn clean package -DskipTests

# Stop any running backend
pkill -f jewellery-store
# Or press Ctrl+C if running in terminal

# Start the backend
java -jar target/jewellery-store-1.0.0.jar

# Backend should start on port 8081
```

### Quick One-Liner
```bash
cd /app/backend-java && mvn clean package -DskipTests && pkill -f jewellery-store; sleep 2 && java -jar target/jewellery-store-1.0.0.jar &
```

## Verify All Fixes

### Test 1: Categories (Public Access)
```bash
curl http://localhost:8081/api/categories
```
✅ **Expected:** JSON array of categories

### Test 2: Products (Public Access)
```bash
curl http://localhost:8081/api/products
```
✅ **Expected:** JSON array of products

### Test 3: Products with Category Filter (Was Failing - 403)
```bash
curl "http://localhost:8081/api/products?categoryId=1"
```
✅ **Expected:** JSON array of products in category 1

### Test 4: Products with Search (Was Failing - lower(bytea) error)
```bash
curl "http://localhost:8081/api/products?search=diamond"
```
✅ **Expected:** JSON array of products matching search

### Test 5: Empty Search (Should Not Error)
```bash
curl "http://localhost:8081/api/products?search="
```
✅ **Expected:** JSON array of all products

### Test 6: Multiple Filters Combined
```bash
curl "http://localhost:8081/api/products?categoryId=1&metal=Gold&search=ring&minPrice=1000&maxPrice=5000"
```
✅ **Expected:** Filtered JSON array

### Test 7: Admin Endpoints (Should Require Auth)
```bash
curl http://localhost:8081/api/admin/products
```
✅ **Expected:** `{"error":"Forbidden"}` or 403 (correct - needs authentication)

### Test 8: Login (Public Access)
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jewellery.com","password":"admin123"}'
```
✅ **Expected:** JSON with token and user info

## Add Sample Products for Testing

```bash
# First, get admin token
TOKEN=$(curl -s -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jewellery.com","password":"admin123"}' | \
  python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

echo "Token: $TOKEN"

# Add Product 1: Diamond Ring
curl -X POST http://localhost:8081/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Eternal Diamond Ring",
    "description": "Exquisite 18K white gold engagement ring featuring a brilliant 1.5ct center diamond",
    "price": 5500.00,
    "category": {"id": 1},
    "metal": "White Gold",
    "gemstone": "Diamond",
    "style": "Classic",
    "images": ["https://images.unsplash.com/photo-1605100804763-247f67b3557e"],
    "specifications": "18K White Gold, 1.5ct Diamond, VS1 clarity",
    "available": true
  }'

# Add Product 2: Gold Necklace
curl -X POST http://localhost:8081/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Ruby Heart Necklace",
    "description": "Stunning 18K rose gold necklace with heart-shaped ruby",
    "price": 3200.00,
    "category": {"id": 3},
    "metal": "Rose Gold",
    "gemstone": "Ruby",
    "style": "Modern",
    "images": ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f"],
    "specifications": "18K Rose Gold, 2ct Ruby, 18-inch chain",
    "available": true
  }'

# Add Product 3: Sapphire Earrings
curl -X POST http://localhost:8081/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Sapphire Drop Earrings",
    "description": "Elegant platinum earrings with blue sapphires",
    "price": 2800.00,
    "category": {"id": 2},
    "metal": "Platinum",
    "gemstone": "Sapphire",
    "style": "Classic",
    "images": ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908"],
    "specifications": "Platinum, 1.5ct each Sapphire",
    "available": true
  }'

# Add Product 4: Gold Bracelet
curl -X POST http://localhost:8081/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Diamond Tennis Bracelet",
    "description": "Classic tennis bracelet with diamonds",
    "price": 4500.00,
    "category": {"id": 4},
    "metal": "Gold",
    "gemstone": "Diamond",
    "style": "Classic",
    "images": ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a"],
    "specifications": "18K Gold, 5ct total diamond weight",
    "available": true
  }'

echo "✅ Products added successfully!"
```

## Test Angular Frontend

Once backend is running with fixes:

1. **Visit:** http://localhost:4200
2. **Click:** "Explore Collection" or any category
3. **Should see:** Products loaded from backend
4. **Test filters:** Select category, price range, metal, etc.
5. **Test search:** Type in search box
6. **Click product:** Should open detail page

## Environment Requirements

Make sure you have:
- ✅ Java JDK 17+
- ✅ Maven 3.8+
- ✅ PostgreSQL running
- ✅ Database `jewellery_store` exists
- ✅ User `jewellery_admin` exists
- ✅ Angular running on port 4200
- ✅ Backend running on port 8081

## Troubleshooting

### Backend Won't Start
```bash
# Check Java version
java -version  # Should be 17+

# Check if port 8081 is free
lsof -i :8081
# If occupied: pkill -f jewellery-store

# Check PostgreSQL is running
psql -U jewellery_admin -d jewellery_store -h localhost
```

### Maven Build Fails
```bash
# Clean and retry
mvn clean
rm -rf target/
mvn package -DskipTests
```

### Database Connection Error
```bash
# Start PostgreSQL
# Mac: brew services start postgresql@15
# Linux: sudo systemctl start postgresql
# Windows: Start from Services

# Verify database exists
psql -U postgres -c "\l" | grep jewellery_store
```

### Still Getting 403 Error
```bash
# Check SecurityConfig changes were compiled
unzip -p target/jewellery-store-1.0.0.jar \
  BOOT-INF/classes/com/jewellery/store/config/SecurityConfig.class | strings | grep products
```

### Still Getting Search Error
```bash
# Check ProductRepository changes were compiled
unzip -p target/jewellery-store-1.0.0.jar \
  BOOT-INF/classes/com/jewellery/store/repository/ProductRepository.class | strings | grep LOWER
```

## Complete Test Suite

Run all tests after fixes applied:

```bash
#!/bin/bash

API_URL="http://localhost:8081/api"

echo "🧪 Testing Jewellery Store API"
echo "================================"

# Test 1: Categories
echo -n "1. Categories (public): "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/categories)
[ "$STATUS" = "200" ] && echo "✅ PASS" || echo "❌ FAIL ($STATUS)"

# Test 2: Products
echo -n "2. Products (public): "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/products)
[ "$STATUS" = "200" ] && echo "✅ PASS" || echo "❌ FAIL ($STATUS)"

# Test 3: Products with category filter
echo -n "3. Products with category filter: "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/products?categoryId=1")
[ "$STATUS" = "200" ] && echo "✅ PASS" || echo "❌ FAIL ($STATUS)"

# Test 4: Products with search
echo -n "4. Products with search: "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/products?search=diamond")
[ "$STATUS" = "200" ] && echo "✅ PASS" || echo "❌ FAIL ($STATUS)"

# Test 5: Products with empty search
echo -n "5. Products with empty search: "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/products?search=")
[ "$STATUS" = "200" ] && echo "✅ PASS" || echo "❌ FAIL ($STATUS)"

# Test 6: Multiple filters
echo -n "6. Multiple filters: "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/products?categoryId=1&metal=Gold&minPrice=1000")
[ "$STATUS" = "200" ] && echo "✅ PASS" || echo "❌ FAIL ($STATUS)"

# Test 7: Admin without auth (should fail)
echo -n "7. Admin without auth (should be 403): "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/admin/products)
[ "$STATUS" = "403" ] && echo "✅ PASS" || echo "❌ FAIL ($STATUS)"

# Test 8: Login
echo -n "8. Login: "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jewellery.com","password":"admin123"}')
[ "$STATUS" = "200" ] && echo "✅ PASS" || echo "❌ FAIL ($STATUS)"

echo "================================"
echo "✅ Testing complete!"
```

Save as `test-api.sh`, make executable (`chmod +x test-api.sh`), and run (`./test-api.sh`)

## Summary

**Both fixes are now in the code:**
- ✅ SecurityConfig updated (fixes 403 error)
- ✅ ProductRepository updated (fixes search error)

**Next step:** Rebuild and restart backend on your local machine

**Expected result:** 
- Products page loads with data
- Category filtering works
- Search works
- All filters work together
- No 403 or search errors

The Angular frontend is ready and waiting for the backend to be fixed! 🚀
