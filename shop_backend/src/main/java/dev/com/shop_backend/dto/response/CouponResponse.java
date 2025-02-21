package dev.com.shop_backend.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CouponResponse {
    private Long id;
    private String code; // Mã giảm giá
    private BigDecimal discountPercentage; // Tỷ lệ phần trăm giảm giá
    private LocalDate expirationDate; // Ngày hết hạn
    private boolean active; //
}
