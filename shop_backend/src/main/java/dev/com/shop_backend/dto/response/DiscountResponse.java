package dev.com.shop_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DiscountResponse {
    private Long discountAmount;
    private Long newTotalAmount;
}
