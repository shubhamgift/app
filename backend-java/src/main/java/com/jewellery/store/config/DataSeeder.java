package com.jewellery.store.config;

import com.jewellery.store.model.Category;
import com.jewellery.store.model.Product;
import com.jewellery.store.model.User;
import com.jewellery.store.repository.CategoryRepository;
import com.jewellery.store.repository.ProductRepository;
import com.jewellery.store.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataSeeder {
    
    @Bean
    CommandLineRunner initDatabase(CategoryRepository categoryRepository, 
                                   UserRepository userRepository,
                                   ProductRepository productRepository,
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
            String[] categoryNames = {"Rings", "Earrings", "Necklaces", "Bracelets"};
            for (String categoryName : categoryNames) {
                if (categoryRepository.findByName(categoryName).isEmpty()) {
                    Category category = new Category();
                    category.setName(categoryName);
                    category.setDescription("Luxury " + categoryName.toLowerCase());
                    category.setCreatedAt(LocalDateTime.now());
                    categoryRepository.save(category);
                    System.out.println("Category created: " + categoryName);
                }
            }

            // Create sample products if none exist
            if (productRepository.count() == 0) {
                List<Category> categories = categoryRepository.findAll();
                Category rings = categories.stream().filter(c -> c.getName().equals("Rings")).findFirst().orElse(null);
                Category necklaces = categories.stream().filter(c -> c.getName().equals("Necklaces")).findFirst().orElse(null);
                Category earrings = categories.stream().filter(c -> c.getName().equals("Earrings")).findFirst().orElse(null);
                Category bracelets = categories.stream().filter(c -> c.getName().equals("Bracelets")).findFirst().orElse(null);

                if (rings != null) {
                    // Product 1 - Ring with real price
                    Product p1 = new Product();
                    p1.setName("Solitaire Diamond Ring");
                    p1.setDescription("A stunning solitaire ring that captures elegance in its purest form. Available in imitation crystal or real certified diamond.");
                    p1.setCategory(rings);
                    p1.setPrice(new BigDecimal("149.00")); // Imitation price
                    p1.setHasRealVersion(true);
                    p1.setRealPrice(new BigDecimal("4999.00")); // Real price
                    p1.setMetal("Sterling Silver");
                    p1.setGemstone("Crystal");
                    p1.setRealMetal("18K White Gold");
                    p1.setRealGemstone("1 Carat Natural Diamond (GIA Certified)");
                    p1.setStyle("Classic");
                    p1.setSpecifications("Band width: 2mm, Setting: 4-prong, Crystal size: 6.5mm");
                    p1.setRealSpecifications("Band width: 2mm, Setting: 4-prong, Diamond: 1ct, VS1 clarity, F color");
                    p1.setImages(Arrays.asList("https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800"));
                    p1.setAvailable(true);
                    p1.setCreatedAt(LocalDateTime.now());
                    productRepository.save(p1);

                    // Product 2 - Ring without real price (contact for price)
                    Product p2 = new Product();
                    p2.setName("Vintage Emerald Ring");
                    p2.setDescription("Art deco inspired emerald ring with intricate detailing. Real version features natural Colombian emerald.");
                    p2.setCategory(rings);
                    p2.setPrice(new BigDecimal("199.00"));
                    p2.setHasRealVersion(true);
                    p2.setRealPrice(null); // Contact for price
                    p2.setMetal("Gold Plated");
                    p2.setGemstone("Green Crystal");
                    p2.setRealMetal("18K Yellow Gold");
                    p2.setRealGemstone("Natural Colombian Emerald");
                    p2.setStyle("Vintage");
                    p2.setImages(Arrays.asList("https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=800"));
                    p2.setAvailable(true);
                    p2.setCreatedAt(LocalDateTime.now());
                    productRepository.save(p2);
                }

                if (necklaces != null) {
                    Product p3 = new Product();
                    p3.setName("Pearl Strand Necklace");
                    p3.setDescription("Classic pearl strand necklace perfect for any occasion. Choose between quality faux pearls or luxurious Akoya pearls.");
                    p3.setCategory(necklaces);
                    p3.setPrice(new BigDecimal("89.00"));
                    p3.setHasRealVersion(true);
                    p3.setRealPrice(new BigDecimal("2499.00"));
                    p3.setMetal("Silver Clasp");
                    p3.setGemstone("Faux Pearl");
                    p3.setRealMetal("14K Gold Clasp");
                    p3.setRealGemstone("AAA Grade Akoya Pearls");
                    p3.setStyle("Classic");
                    p3.setImages(Arrays.asList("https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800"));
                    p3.setAvailable(true);
                    p3.setCreatedAt(LocalDateTime.now());
                    productRepository.save(p3);
                }

                if (earrings != null) {
                    Product p4 = new Product();
                    p4.setName("Diamond Stud Earrings");
                    p4.setDescription("Timeless diamond studs that add sparkle to any look. Available in crystal or natural diamonds.");
                    p4.setCategory(earrings);
                    p4.setPrice(new BigDecimal("79.00"));
                    p4.setHasRealVersion(true);
                    p4.setRealPrice(new BigDecimal("1999.00"));
                    p4.setMetal("Sterling Silver");
                    p4.setGemstone("Cubic Zirconia");
                    p4.setRealMetal("Platinum");
                    p4.setRealGemstone("0.5ct Each Natural Diamond");
                    p4.setStyle("Classic");
                    p4.setImages(Arrays.asList("https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800"));
                    p4.setAvailable(true);
                    p4.setCreatedAt(LocalDateTime.now());
                    productRepository.save(p4);
                }

                if (bracelets != null) {
                    Product p5 = new Product();
                    p5.setName("Tennis Bracelet");
                    p5.setDescription("Elegant tennis bracelet with continuous line of stones. Available in crystal or real diamond.");
                    p5.setCategory(bracelets);
                    p5.setPrice(new BigDecimal("129.00"));
                    p5.setHasRealVersion(true);
                    p5.setRealPrice(null); // Contact for price
                    p5.setMetal("Rhodium Plated");
                    p5.setGemstone("Crystal");
                    p5.setRealMetal("18K White Gold");
                    p5.setRealGemstone("5ct Total Natural Diamonds");
                    p5.setStyle("Classic");
                    p5.setImages(Arrays.asList("https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800"));
                    p5.setAvailable(true);
                    p5.setCreatedAt(LocalDateTime.now());
                    productRepository.save(p5);
                }

                System.out.println("Sample products created with imitation and real versions");
            }
        };
    }
}
