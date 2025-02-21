package dev.com.shop_backend.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CartItemResponse {
    private Long id;
    private Integer quantity;
    private Long unitPrice;
    private ColorResponse color;
    private Long totalPrice;
    private ProductResponse product;
}
