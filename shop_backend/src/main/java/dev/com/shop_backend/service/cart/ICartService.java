package dev.com.shop_backend.service.cart;

import dev.com.shop_backend.dto.response.CartResponse;
import dev.com.shop_backend.model.Cart;
import dev.com.shop_backend.model.User;

import java.math.BigDecimal;

public interface ICartService {
    CartResponse getCart(Long id);
    void clearCart(Long id);
    Long getTotalPrice(Long id);
    Cart initializeNewCart(User user);
    Cart getCartByUserId(Long userId);
}
