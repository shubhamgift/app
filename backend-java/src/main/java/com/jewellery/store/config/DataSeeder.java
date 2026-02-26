package com.jewellery.store.config;

import com.jewellery.store.model.Category;
import com.jewellery.store.model.User;
import com.jewellery.store.repository.CategoryRepository;
import com.jewellery.store.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;

@Configuration
public class DataSeeder {
    
    @Bean
    CommandLineRunner initDatabase(CategoryRepository categoryRepository, 
                                   UserRepository userRepository,
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            // Create admin user if not exists
            if (!userRepository.existsByEmail("admin@jewellery.com")) {
                User admin = new User();
                admin.setEmail("admin@jewellery.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setFullName("Admin User");
                admin.setRole("ADMIN");
                admin.setCreatedAt(LocalDateTime.now());
                userRepository.save(admin);
                System.out.println("Admin user created: admin@jewellery.com / admin123");
            }
            
            // Create categories if not exist
            String[] categories = {"Rings", "Earrings", "Necklaces", "Bracelets"};
            for (String categoryName : categories) {
                if (categoryRepository.findByName(categoryName).isEmpty()) {
                    Category category = new Category();
                    category.setName(categoryName);
                    category.setDescription("Luxury " + categoryName.toLowerCase());
                    category.setCreatedAt(LocalDateTime.now());
                    categoryRepository.save(category);
                    System.out.println("Category created: " + categoryName);
                }
            }
        };
    }
}
