package dev.com.shop_backend.dto.response;

import dev.com.shop_backend.enums.DeliveryMethod;
import dev.com.shop_backend.enums.OrderStatus;
import dev.com.shop_backend.enums.PaymentMethod;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Data
public class OrderResponse {
    private Long id;
    private LocalDate orderDate;
    private Long subtotalAmount;
    private Long discountAmount;
    private Long totalAmount;
    private OrderStatus orderStatus;
    private DeliveryMethod deliveryMethod;
    private PaymentMethod paymentMethod;
    private Set<OrderItemResponse> orderItems;
    private Long userId;
    AddressResponse address;
    private String note;
}
