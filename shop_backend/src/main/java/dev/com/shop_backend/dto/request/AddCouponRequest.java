package dev.com.shop_backend.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class AddCouponRequest {
    @NotBlank(message = "Mã giảm giá không được để trống")
    private String code;

    @NotNull(message = "Tỷ lệ phần trăm giảm giá không được để trống")
    @Positive(message = "Tỷ lệ phần trăm giảm giá phải lớn hơn 0")
    private BigDecimal discountPercentage;

    @NotNull(message = "Ngày hết hạn không được để trống")
    @Future(message = "Ngày hết hạn phải là một ngày trong tương lai")
    private LocalDate expirationDate;

    @NotNull(message = "Kích hoạt không được để trống")
    private boolean active;
}
