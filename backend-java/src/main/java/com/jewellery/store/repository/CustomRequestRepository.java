package com.jewellery.store.repository;

import com.jewellery.store.model.CustomRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CustomRequestRepository extends JpaRepository<CustomRequest, Long> {
    List<CustomRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<CustomRequest> findAllByOrderByCreatedAtDesc();
}