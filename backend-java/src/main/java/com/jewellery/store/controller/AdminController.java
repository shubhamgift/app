package com.jewellery.store.controller;

import com.jewellery.store.model.Category;
import com.jewellery.store.model.CustomRequest;
import com.jewellery.store.model.Order;
import com.jewellery.store.model.Product;
import com.jewellery.store.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {
    
    private final ProductService productService;
    private final CategoryService categoryService;
    private final OrderService orderService;
    private final CustomRequestService customRequestService;
    
    public AdminController(ProductService productService, CategoryService categoryService, 
                          OrderService orderService, CustomRequestService customRequestService) {
        this.productService = productService;
        this.categoryService = categoryService;
        this.orderService = orderService;
        this.customRequestService = customRequestService;
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        List<Order> allOrders = orderService.getAllOrders();
        long pendingOrders = allOrders.stream()
            .filter(o -> "PENDING".equals(o.getStatus()))
            .count();
        double totalRevenue = allOrders.stream()
            .filter(o -> !"CANCELLED".equals(o.getStatus()))
            .mapToDouble(o -> o.getTotalAmount().doubleValue())
            .sum();
        
        dashboard.put("totalProducts", productService.getAllProducts().size());
        dashboard.put("totalOrders", allOrders.size());
        dashboard.put("totalRequests", customRequestService.getAllRequests().size());
        dashboard.put("totalCategories", categoryService.getAllCategories().size());
        dashboard.put("totalUsers", 0); // Would need UserService
        dashboard.put("pendingOrders", pendingOrders);
        dashboard.put("revenue", totalRevenue);
        
        return ResponseEntity.ok(dashboard);
    }
    
    // Category Management
    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(categoryService.createCategory(category));
    }
    
    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        return ResponseEntity.ok(categoryService.updateCategory(id, category));
    }
    
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }
    
    // Product Management
    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.createProduct(product));
    }
    
    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }
    
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/products/upload-images")
    public ResponseEntity<List<String>> uploadProductImages(@RequestParam("files") List<MultipartFile> files) {
        try {
            List<String> imageUrls = productService.uploadImages(files);
            return ResponseEntity.ok(imageUrls);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Order Management
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
    
    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request.get("status")));
    }
    
    @DeleteMapping("/orders/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok().build();
    }
    
    // Custom Request Management
    @GetMapping("/custom-requests")
    public ResponseEntity<List<CustomRequest>> getAllRequests() {
        return ResponseEntity.ok(customRequestService.getAllRequests());
    }
    
    @PutMapping("/custom-requests/{id}")
    public ResponseEntity<CustomRequest> updateRequest(@PathVariable Long id, @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(customRequestService.updateRequest(id, request.get("status"), request.get("adminResponse")));
    }
    
    @DeleteMapping("/custom-requests/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        customRequestService.deleteRequest(id);
        return ResponseEntity.ok().build();
    }
}