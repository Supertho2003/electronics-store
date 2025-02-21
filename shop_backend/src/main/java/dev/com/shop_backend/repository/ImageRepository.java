package dev.com.shop_backend.repository;

import dev.com.shop_backend.dto.response.ImageResponse;
import dev.com.shop_backend.model.Category;
import dev.com.shop_backend.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image,Long> {
    Image findByProductId(Long id);

    Image findByCategory(Category category);

    Image findByCategoryId(Long id);
}
