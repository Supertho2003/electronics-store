package dev.com.shop_backend.dto.response;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
public class ColorResponse {
    private Long id;
    private String code;
    private String name;
}
