package com.jewellery.store.service;

import com.jewellery.store.dto.OrderRequest;
import com.jewellery.store.model.Order;
import com.jewellery.store.model.OrderItem;
import com.jewellery.store.model.Product;
import com.jewellery.store.model.User;
import com.jewellery.store.repository.OrderRepository;
import com.jewellery.store.repository.ProductRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    
    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }
    
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));
    }
    
    public Order createOrder(OrderRequest request, User user) {
        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(request.getShippingAddress());
        order.setPhone(request.getPhone());
        order.setStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());
        
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        boolean hasPriceOnRequest = false;
        
        for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            
            String jewelryType = itemRequest.getJewelryType() != null ? itemRequest.getJewelryType() : "IMITATION";
            orderItem.setJewelryType(jewelryType);
            
            // Determine price based on jewelry type
            if ("REAL".equals(jewelryType)) {
                if (product.getRealPrice() != null) {
                    orderItem.setPrice(product.getRealPrice());
                    orderItem.setPriceOnRequest(false);
                    totalAmount = totalAmount.add(product.getRealPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
                } else {
                    // Real jewelry without price - will be quoted later
                    orderItem.setPrice(BigDecimal.ZERO);
                    orderItem.setPriceOnRequest(true);
                    hasPriceOnRequest = true;
                }
            } else {
                // Imitation jewelry - use standard price
                orderItem.setPrice(product.getPrice());
                orderItem.setPriceOnRequest(false);
                totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
            }
            
            orderItems.add(orderItem);
        }
        
        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);
        
        // If order contains items requiring price quote, set special status
        if (hasPriceOnRequest) {
            order.setStatus("QUOTE_PENDING");
        }
        
        return orderRepository.save(order);
    }
    
    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }
    
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}