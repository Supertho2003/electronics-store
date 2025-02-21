package dev.com.shop_backend.repository;

import dev.com.shop_backend.model.Cart;
import dev.com.shop_backend.model.CartItem;
import dev.com.shop_backend.model.Color;
import dev.com.shop_backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem,Long> {
    void deleteAllByCartId(Long id);

    CartItem findByCartAndProductAndColor(Cart cart, Product product, Color color);
}
