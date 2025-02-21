package dev.com.shop_backend.mapper;

import dev.com.shop_backend.dto.response.OrderItemResponse;
import dev.com.shop_backend.model.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class, ProductMapper.class})
public interface OrderItemMapper {
    @Mapping(source = "product.id", target = "product.id")
    @Mapping(source = "product.image.downloadUrl", target = "product.imageUrl")
    OrderItemResponse orderItemToOrderItemResponse(OrderItem orderItem);
}
