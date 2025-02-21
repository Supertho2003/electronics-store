package dev.com.shop_backend.dto.response;

import dev.com.shop_backend.model.*;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductResponse {
    private Long id;
    private String categoryName;
    private String name;
    private String brand;
    private Long price;
    private String imageUrl;
    private String description;
    private Double rating;
    private Integer stock;
    private Boolean isAvailable;
    private List<ReviewResponse> reviews;
    private List<ColorResponse> colors;
    private List<AttributeResponse> attributes;
}
