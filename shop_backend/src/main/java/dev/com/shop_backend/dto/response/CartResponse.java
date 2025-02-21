package dev.com.shop_backend.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;

@Data
public class CartResponse {
    private Long cartId;
    private Set<CartItemResponse> items;
    private Long totalAmount;
}
