package dev.com.shop_backend.service.cart;

import dev.com.shop_backend.dto.response.CartResponse;
import dev.com.shop_backend.exceptions.ResourceNotFoundException;
import dev.com.shop_backend.mapper.CartMapper;
import dev.com.shop_backend.model.Cart;
import dev.com.shop_backend.model.User;
import dev.com.shop_backend.repository.CartItemRepository;
import dev.com.shop_backend.repository.CartRepository;
import dev.com.shop_backend.service.product.IProductService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CartService implements ICartService{
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final AtomicLong cartIdGenerator = new AtomicLong(0);
    private final IProductService productService;
    CartMapper cartMapper;

    @Override
    public CartResponse getCart(Long id) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        Long totalAmount = cart.getTotalAmount();
        cart.setTotalAmount(totalAmount);

        cartRepository.save(cart);
        return cartMapper.toCartResponse(cart);
    }

    @Transactional
    @Override
    public void clearCart(Long id) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        cartItemRepository.deleteAllByCartId(id);
        cart.clearCart();
        cartRepository.deleteById(id);
    }

    @Override
    public Long getTotalPrice(Long id) {
            Cart cart = cartRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        return cart.getTotalAmount();
    }

    @Override
    public Cart initializeNewCart(User user) {
        return Optional.ofNullable(getCartByUserId(user.getId()))
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    @Override
    public Cart getCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId);
    }
}
