package dev.com.shop_backend.repository;

import dev.com.shop_backend.model.ProductAttribute;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductAttributeRepository extends JpaRepository<ProductAttribute,Long> {
}
