package com.jewellery.store.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "custom_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 2000)
    private String description;
    
    @ElementCollection
    @CollectionTable(name = "custom_request_images", joinColumns = @JoinColumn(name = "request_id"))
    @Column(name = "image_url")
    private List<String> referenceImages = new ArrayList<>();
    
    @Column(nullable = false)
    private String status = "PENDING";
    
    @Column(length = 1000)
    private String adminResponse;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt;
}