package dev.com.shop_backend.repository;

import dev.com.shop_backend.dto.request.AddAttributeRequest;
import dev.com.shop_backend.model.Attribute;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttributeRepository extends JpaRepository<Attribute,Long> {
    boolean existsByattributeName(String attributeName);
}
