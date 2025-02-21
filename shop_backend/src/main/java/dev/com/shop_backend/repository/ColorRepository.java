package dev.com.shop_backend.repository;

import dev.com.shop_backend.model.Color;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ColorRepository extends JpaRepository<Color,Long> {
    boolean existsByName(String name);
}
