package dev.com.shop_backend.mapper;

import dev.com.shop_backend.dto.response.OrderResponse;
import dev.com.shop_backend.model.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses ={ OrderItemMapper.class,AddressMapper.class})
public interface OrderMapper {
    @Mapping(source = "subtotalAmount", target = "subtotalAmount")
    @Mapping(source = "discountAmount", target = "discountAmount")
    @Mapping(source = "orderItems", target = "orderItems")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "address", target = "address")
    @Mapping(source = "deliveryMethod", target = "deliveryMethod")
    @Mapping(source = "paymentMethod", target = "paymentMethod")
    @Mapping(source = "note", target = "note")
    OrderResponse toOrderResponse(Order order);
}
