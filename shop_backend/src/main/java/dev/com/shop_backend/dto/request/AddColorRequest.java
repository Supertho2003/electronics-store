package dev.com.shop_backend.dto.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AddColorRequest {
    @NotBlank(message = "Mã màu không được để trống")
    private String code;
    @NotBlank(message = "Tên màu không được để trống")
    private String name;
}
