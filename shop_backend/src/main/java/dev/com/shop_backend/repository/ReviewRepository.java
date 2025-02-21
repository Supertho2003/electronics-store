package dev.com.shop_backend.repository;

import dev.com.shop_backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review,Long> {
    List<Review> findByProductId(Long productId);
    long countByProductId(Long productId);

    List<Review> findByProductIdAndHiddenFalse(Long productId);
}
