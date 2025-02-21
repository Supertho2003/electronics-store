package dev.com.shop_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddCategoryRequest {
    @NotBlank(message = "Tên danh mục không được để trống")
    private String name;
}
