package dev.com.shop_backend.dto.response;

import dev.com.shop_backend.model.Product;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
public class OrderItemResponse {
    private Long id;
    private int quantity;
    private Double price;
    private ProductResponse product;
}
