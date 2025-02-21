package dev.com.shop_backend.mapper;

import dev.com.shop_backend.dto.response.CartItemResponse;
import dev.com.shop_backend.dto.response.CartResponse;
import dev.com.shop_backend.model.Cart;
import dev.com.shop_backend.model.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = CartItemMapper.class)
public interface CartMapper {

    @Mapping(source = "items", target = "items")
    @Mapping(source = "totalAmount", target = "totalAmount")
    CartResponse toCartResponse(Cart cart);

    Set<CartItemResponse> mapCartItemsToCartItemResponses(Set<CartItem> cartItems);
}
