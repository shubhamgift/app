# Fix for Product Search Query Error

## Problem
Error when searching products: `function lower(bytea) does not exist`

## Root Cause
The JPQL query in `ProductRepository.java` was using `LOWER()` function on the search parameter without properly checking for empty strings, which can cause PostgreSQL to interpret the parameter type incorrectly.

## Solution Applied

**File:** `/app/backend-java/src/main/java/com/jewellery/store/repository/ProductRepository.java`

**Updated Query:**
```java
@Query("SELECT p FROM Product p WHERE " +
       "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
       "(:metal IS NULL OR p.metal = :metal) AND " +
       "(:gemstone IS NULL OR p.gemstone = :gemstone) AND " +
       "(:style IS NULL OR p.style = :style) AND " +
       "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
       "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
       "(:search IS NULL OR :search = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))")
List<Product> findByFilters(@Param("categoryId") Long categoryId,
                            @Param("metal") String metal,
                            @Param("gemstone") String gemstone,
                            @Param("style") String style,
                            @Param("minPrice") BigDecimal minPrice,
                            @Param("maxPrice") BigDecimal maxPrice,
                            @Param("search") String search);
```

**Key Change:**
- **Before:** `(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))`
- **After:** `(:search IS NULL OR :search = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))`

**Added:** `:search = ''` check to handle empty strings before applying LOWER() function.

## Alternative Solutions

### Option 1: Use Native SQL Query (More Explicit)

```java
@Query(value = "SELECT * FROM products p WHERE " +
       "(:categoryId IS NULL OR p.category_id = :categoryId) AND " +
       "(:metal IS NULL OR p.metal = :metal) AND " +
       "(:gemstone IS NULL OR p.gemstone = :gemstone) AND " +
       "(:style IS NULL OR p.style = :style) AND " +
       "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
       "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
       "(:search IS NULL OR :search = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))",
       nativeQuery = true)
List<Product> findByFilters(...);
```

### Option 2: Remove LOWER() Functions (Case-Sensitive Search)

```java
@Query("SELECT p FROM Product p WHERE " +
       "... AND " +
       "(:search IS NULL OR p.name LIKE CONCAT('%', :search, '%'))")
```

### Option 3: Use UPPER() Instead

```java
@Query("SELECT p FROM Product p WHERE " +
       "... AND " +
       "(:search IS NULL OR UPPER(p.name) LIKE UPPER(CONCAT('%', :search, '%')))")
```

### Option 4: Handle in Service Layer

Update `ProductService.java`:

```java
public List<Product> searchProducts(Long categoryId, String metal, String gemstone, 
                                   String style, BigDecimal minPrice, BigDecimal maxPrice, String search) {
    // Normalize search parameter
    String normalizedSearch = (search == null || search.trim().isEmpty()) ? null : search.trim();
    
    return productRepository.findByFilters(categoryId, metal, gemstone, style, 
                                          minPrice, maxPrice, normalizedSearch);
}
```

## Apply the Fix

### Step 1: Update the File
The file has already been updated with the fix. You need to rebuild and restart.

### Step 2: Rebuild Backend
```bash
cd /app/backend-java
mvn clean package -DskipTests
```

### Step 3: Restart Backend
```bash
# Stop existing backend
pkill -f jewellery-store

# Start with updated code
java -jar target/jewellery-store-1.0.0.jar
```

## Testing

### Test 1: Search Without Filters
```bash
curl "http://localhost:8081/api/products?search=diamond"
```
**Expected:** Returns products with "diamond" in the name

### Test 2: Search with Empty String
```bash
curl "http://localhost:8081/api/products?search="
```
**Expected:** Returns all products (no error)

### Test 3: Search with Category Filter
```bash
curl "http://localhost:8081/api/products?categoryId=1&search=ring"
```
**Expected:** Returns rings with "ring" in the name

### Test 4: Multiple Filters with Search
```bash
curl "http://localhost:8081/api/products?metal=Gold&search=diamond&minPrice=1000"
```
**Expected:** Returns gold products with "diamond" in name, priced >= 1000

### Test 5: Case Insensitive Search
```bash
curl "http://localhost:8081/api/products?search=DIAMOND"
curl "http://localhost:8081/api/products?search=diamond"
curl "http://localhost:8081/api/products?search=DiAmOnD"
```
**Expected:** All three should return the same results

## Why This Error Occurs

1. **PostgreSQL Type System:** When a parameter is NULL or empty, PostgreSQL might not be able to infer the correct type for the `LOWER()` function.

2. **JPQL to SQL Translation:** Hibernate translates JPQL to SQL, and sometimes the parameter binding doesn't preserve the expected String type.

3. **Empty String vs NULL:** An empty string `""` is different from `NULL`, and both need to be handled properly.

## Prevention

### In Service Layer (Recommended)
```java
// Sanitize search input before calling repository
if (search != null && search.trim().isEmpty()) {
    search = null;
}
```

### In Repository Query
```java
// Always check for both NULL and empty string
(:search IS NULL OR :search = '' OR ...)
```

### Add Validation
```java
@NotBlank(message = "Search term cannot be empty")
@Size(min = 2, message = "Search term must be at least 2 characters")
private String search;
```

## Related Files

**Files Modified:**
- `/app/backend-java/src/main/java/com/jewellery/store/repository/ProductRepository.java`

**Files That May Need Updates:**
- `/app/backend-java/src/main/java/com/jewellery/store/service/ProductService.java` (optional: add search sanitization)
- `/app/backend-java/src/main/java/com/jewellery/store/controller/ProductController.java` (optional: add validation)

## Additional Improvements (Optional)

### Add Search Validation in Controller
```java
@GetMapping
public ResponseEntity<List<Product>> getAllProducts(
        @RequestParam(required = false) Long categoryId,
        @RequestParam(required = false) String metal,
        @RequestParam(required = false) String gemstone,
        @RequestParam(required = false) String style,
        @RequestParam(required = false) BigDecimal minPrice,
        @RequestParam(required = false) BigDecimal maxPrice,
        @RequestParam(required = false) @Size(min = 2, max = 100) String search) {
    
    // Sanitize search parameter
    if (search != null && search.trim().isEmpty()) {
        search = null;
    }
    
    // ... rest of the code
}
```

### Add Index for Better Performance
```sql
-- Add index on product name for faster searches
CREATE INDEX idx_products_name_lower ON products (LOWER(name));
```

### Extend Search to Description
```java
@Query("SELECT p FROM Product p WHERE " +
       "... AND " +
       "(:search IS NULL OR :search = '' OR " +
       "LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
       "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
```

## Quick Reference

**Error Message:**
```
ERROR: function lower(bytea) does not exist
HINT: No function matches the given name and argument types. 
You might need to add explicit type casts.
```

**Fix:**
Add empty string check: `:search = ''` in the WHERE clause before using LOWER()

**Rebuild Command:**
```bash
cd /app/backend-java && mvn clean package -DskipTests && pkill -f jewellery-store && java -jar target/jewellery-store-1.0.0.jar &
```

## Verification Checklist

After applying fix:
- [ ] Backend builds without errors
- [ ] Backend starts successfully
- [ ] Can search products without error
- [ ] Empty search doesn't cause error
- [ ] NULL search doesn't cause error
- [ ] Case-insensitive search works
- [ ] Search combined with filters works
- [ ] Angular frontend search works

## Notes

- This fix also improves the Security configuration from the previous fix
- Both fixes need to be applied together and backend rebuilt
- Remember to restart backend after rebuilding
- Test thoroughly with various search terms
- Consider adding input validation on the frontend as well
