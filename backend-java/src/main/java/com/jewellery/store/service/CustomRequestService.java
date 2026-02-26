package com.jewellery.store.service;

import com.jewellery.store.model.CustomRequest;
import com.jewellery.store.model.User;
import com.jewellery.store.repository.CustomRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CustomRequestService {
    
    private final CustomRequestRepository customRequestRepository;
    private final String uploadDir = "uploads/custom-requests/";
    
    public CustomRequestService(CustomRequestRepository customRequestRepository) {
        this.customRequestRepository = customRequestRepository;
        createUploadDirectory();
    }
    
    private void createUploadDirectory() {
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }
    
    public List<CustomRequest> getAllRequests() {
        return customRequestRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public List<CustomRequest> getUserRequests(Long userId) {
        return customRequestRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public CustomRequest getRequestById(Long id) {
        return customRequestRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Custom request not found"));
    }
    
    public CustomRequest createRequest(CustomRequest request, User user) {
        request.setUser(user);
        request.setStatus("PENDING");
        request.setCreatedAt(LocalDateTime.now());
        return customRequestRepository.save(request);
    }
    
    public CustomRequest updateRequest(Long id, String status, String adminResponse) {
        CustomRequest request = getRequestById(id);
        if (status != null) {
            request.setStatus(status);
        }
        if (adminResponse != null) {
            request.setAdminResponse(adminResponse);
        }
        request.setUpdatedAt(LocalDateTime.now());
        return customRequestRepository.save(request);
    }
    
    public void deleteRequest(Long id) {
        customRequestRepository.deleteById(id);
    }
    
    public String uploadImage(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + fileName);
        Files.write(filePath, file.getBytes());
        return "/uploads/custom-requests/" + fileName;
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