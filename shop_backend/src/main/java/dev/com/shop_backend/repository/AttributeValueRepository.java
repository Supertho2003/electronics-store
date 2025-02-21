package dev.com.shop_backend.repository;

import dev.com.shop_backend.model.AttributeValue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AttributeValueRepository extends JpaRepository<AttributeValue,Long> {
    Optional<AttributeValue> findByValue(String value);
}
