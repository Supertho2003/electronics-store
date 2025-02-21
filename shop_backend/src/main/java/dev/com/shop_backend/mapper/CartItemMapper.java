package dev.com.shop_backend.mapper;

import dev.com.shop_backend.dto.response.CartItemResponse;
import dev.com.shop_backend.model.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ColorMapper.class, ProductMapper.class})
public interface CartItemMapper {
    @Mapping(source = "color", target = "color")
    @Mapping(source = "product", target = "product")
    @Mapping(source = "id", target = "id")
    CartItemResponse toCartItemResponse(CartItem cartItem);
}
