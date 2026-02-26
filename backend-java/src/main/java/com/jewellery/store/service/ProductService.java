package com.jewellery.store.service;

import com.jewellery.store.model.Product;
import com.jewellery.store.repository.ProductRepository;
import com.jewellery.store.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final String uploadDir = "uploads/products/";
    
    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        createUploadDirectory();
    }
    
    private void createUploadDirectory() {
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public Product getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
    }
    
    public List<Product> searchProducts(Long categoryId, String metal, String gemstone, 
                                       String style, BigDecimal minPrice, BigDecimal maxPrice, String search) {
        return productRepository.findByFilters(categoryId, metal, gemstone, style, minPrice, maxPrice, search);
    }
    
    public Product createProduct(Product product) {
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            product.setCategory(categoryRepository.findById(product.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Category not found")));
        }
        product.setCreatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }
    
    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setMetal(productDetails.getMetal());
        product.setGemstone(productDetails.getGemstone());
        product.setStyle(productDetails.getStyle());
        product.setSpecifications(productDetails.getSpecifications());
        product.setAvailable(productDetails.getAvailable());
        
        if (productDetails.getCategory() != null && productDetails.getCategory().getId() != null) {
            product.setCategory(categoryRepository.findById(productDetails.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Category not found")));
        }
        
        if (productDetails.getImages() != null) {
            product.setImages(productDetails.getImages());
        }
        
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }
    
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    
    public String uploadImage(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + fileName);
        Files.write(filePath, file.getBytes());
        return "/uploads/products/" + fileName;
    }
    
    public List<String> uploadImages(List<MultipartFile> files) throws IOException {
        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                imageUrls.add(uploadImage(file));
            }
        }
        return imageUrls;
    }
}