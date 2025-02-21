package dev.com.shop_backend.dto.response;

import lombok.Data;

@Data
public class CategoryResponse {
    private Long id;        // ID của danh mục
    private String name;    // Tên danh mục
    private String imageUrl;
}
