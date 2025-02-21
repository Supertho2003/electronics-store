package dev.com.shop_backend.service.cart;

import dev.com.shop_backend.dto.response.CartItemResponse;
import dev.com.shop_backend.model.CartItem;

import java.util.List;

public interface ICartItemService {
    void addItemToCart(Long cartId, Long productId, int quantity, Long colorId);
    void removeItemFromCart(Long cartId, Long itemId);
    void updateItemQuantity(Long cartId, Long productId, int quantity);
    CartItem getCartItem(Long cartId, Long productId);
    List<CartItemResponse> getCartItemsByCartId(Long cartId);
    Long getTotalQuantityInCart(Long cartId);
}
