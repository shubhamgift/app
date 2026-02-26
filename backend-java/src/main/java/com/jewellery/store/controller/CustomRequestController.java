package com.jewellery.store.controller;

import com.jewellery.store.model.CustomRequest;
import com.jewellery.store.model.User;
import com.jewellery.store.service.AuthService;
import com.jewellery.store.service.CustomRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/custom-requests")
public class CustomRequestController {
    
    private final CustomRequestService customRequestService;
    private final AuthService authService;
    
    public CustomRequestController(CustomRequestService customRequestService, AuthService authService) {
        this.customRequestService = customRequestService;
        this.authService = authService;
    }
    
    @PostMapping
    public ResponseEntity<CustomRequest> createRequest(@RequestBody CustomRequest request, Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(customRequestService.createRequest(request, user));
    }
    
    @GetMapping("/my-requests")
    public ResponseEntity<List<CustomRequest>> getMyRequests(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(customRequestService.getUserRequests(user.getId()));
    }
    
    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = customRequestService.uploadImage(file);
            return ResponseEntity.ok(imageUrl);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to upload image");
        }
    }
}