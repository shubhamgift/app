# Fix for 403 Forbidden Error on Products Endpoint

## Problem
Getting 403 Forbidden when accessing: `http://localhost:8081/api/products?categoryId=1`

## Root Cause
The Spring Security configuration needs to explicitly allow public access to the products endpoint with query parameters.

## Solution

Update the `SecurityConfig.java` file:

**File:** `/app/backend-java/src/main/java/com/jewellery/store/config/SecurityConfig.java`

**Change the `securityFilterChain` method to:**

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            // Public endpoints - anyone can access
            .requestMatchers("/auth/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/products", "/products/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/categories", "/categories/**").permitAll()
            
            // Admin endpoints - require ADMIN role
            .requestMatchers("/admin/**").hasAuthority("ADMIN")
            
            // All other endpoints require authentication
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    
    return http.build();
}
```

## Alternative Quick Fix (If rebuild is not possible)

Add this annotation to the `ProductController`:

```java
@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*") // Allow CORS from anywhere
public class ProductController {
    // ... existing code
}
```

And update the SecurityConfig to be more permissive:

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/auth/**", "/products/**", "/categories/**").permitAll()
    .requestMatchers("/admin/**").hasAuthority("ADMIN")
    .anyRequest().authenticated()
)
```

## Steps to Apply Fix

### Method 1: Full Rebuild (Recommended)

```bash
# 1. Navigate to backend directory
cd /app/backend-java

# 2. Update SecurityConfig.java (use the code above)

# 3. Rebuild the application
mvn clean package -DskipTests

# 4. Stop existing backend
pkill -f jewellery-store

# 5. Start the backend
java -jar target/jewellery-store-1.0.0.jar
```

### Method 2: Quick Test (Temporary)

If Maven/Java are not available in your current environment, you'll need to:

1. **On your local machine** (where you downloaded the code):
   - Update `SecurityConfig.java` with the fix above
   - Rebuild: `mvn clean package -DskipTests`
   - Run: `java -jar target/jewellery-store-1.0.0.jar`

2. **Or use Docker** (if available):
   ```bash
   docker run -d -p 8081:8080 \
     -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/jewellery_store \
     -v /app/backend-java/target:/app \
     openjdk:17-slim \
     java -jar /app/jewellery-store-1.0.0.jar
   ```

## Verification

After applying the fix and restarting:

```bash
# Test categories (should work)
curl http://localhost:8081/api/categories

# Test products without filter (should work)
curl http://localhost:8081/api/products

# Test products with category filter (should work)
curl "http://localhost:8081/api/products?categoryId=1"

# Test products with multiple filters (should work)
curl "http://localhost:8081/api/products?categoryId=1&minPrice=1000&maxPrice=5000"
```

**Expected Response:** JSON array of products (or empty array if no products exist)

**Should NOT see:** `{"error":"Forbidden"}` or 403 status

## Why This Happens

Spring Security by default requires authentication for all endpoints. Even though we had:

```java
.requestMatchers(HttpMethod.GET, "/products/**").permitAll()
```

The issue is that:
1. Query parameters can sometimes cause matching issues
2. The `/products` exact match wasn't explicitly allowed (only `/products/**`)
3. The matchers need to be more specific

## Alternative: Disable Security for Development

If you're still developing and want to disable security temporarily:

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
    
    return http.build();
}
```

**⚠️ Warning:** Only use this during development! Re-enable security for production.

## Testing Checklist

After fix:
- [ ] `/api/categories` works without auth
- [ ] `/api/products` works without auth
- [ ] `/api/products?categoryId=1` works without auth
- [ ] `/api/products?minPrice=1000&maxPrice=5000` works without auth
- [ ] `/api/products/1` works without auth (single product)
- [ ] `/api/auth/login` works without auth
- [ ] `/api/admin/products` requires auth (should return 403 without token)
- [ ] Angular frontend can load products

## Additional Notes

- The backend runs on port **8081** (not 8080)
- API context path is **/api**
- All endpoints should be accessed as: `http://localhost:8081/api/...`
- CORS is configured to allow Angular frontend on port 4200
- PostgreSQL should be running on port 5432

## Environment Requirements

Make sure you have:
- Java JDK 17+
- Maven 3.8+
- PostgreSQL running
- Database `jewellery_store` created
- User `jewellery_admin` with password `jewellery_2024`

If any of these are missing, refer to `/app/LOCAL_SETUP_GUIDE.md`
