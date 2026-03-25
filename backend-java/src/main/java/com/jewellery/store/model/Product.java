package com.jewellery.store.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 2000)
    private String description;
    
    // Price for imitation jewellery (always shown)
    @Column(nullable = false)
    private BigDecimal price;
    
    // Flag to indicate if real gold/diamond version is available
    @Column(nullable = false)
    private Boolean hasRealVersion = true;
    
    // Price for real gold/diamond (optional - null means "Contact for Price")
    private BigDecimal realPrice;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;
    
    private String metal;
    private String gemstone;
    private String style;
    
    // Metal for real version (e.g., "18K Gold", "Platinum")
    private String realMetal;
    
    // Gemstone for real version (e.g., "Natural Diamond", "Certified Ruby")
    private String realGemstone;
    
    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();
    
    @Column(length = 1000)
    private String specifications;
    
    // Specifications for real version
    @Column(length = 1000)
    private String realSpecifications;
    
    @Column(nullable = false)
    private Boolean available = true;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt;
}