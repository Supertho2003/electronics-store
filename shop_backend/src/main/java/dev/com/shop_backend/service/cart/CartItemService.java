package dev.com.shop_backend.service.cart;

import dev.com.shop_backend.dto.response.CartItemResponse;
import dev.com.shop_backend.exceptions.ResourceNotFoundException;
import dev.com.shop_backend.mapper.CartItemMapper;
import dev.com.shop_backend.model.Cart;
import dev.com.shop_backend.model.CartItem;
import dev.com.shop_backend.model.Color;
import dev.com.shop_backend.model.Product;
import dev.com.shop_backend.repository.CartItemRepository;
import dev.com.shop_backend.repository.CartRepository;
import dev.com.shop_backend.repository.ColorRepository;
import dev.com.shop_backend.repository.ProductRepository;
import dev.com.shop_backend.service.product.IProductService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CartItemService implements ICartItemService{
    CartItemRepository cartItemRepository;
    CartRepository cartRepository;
    ColorRepository colorRepository;
    ProductRepository productRepository;
    IProductService productService;
    ICartService cartService;
    CartItemMapper cartItemMapper;


    @Override
    public void addItemToCart(Long cartId, Long productId, int quantity, Long colorId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        Color color = colorRepository.findById(colorId)
                .orElseThrow(() -> new RuntimeException("Màu sắc không tồn tại"));

        CartItem cartItem = cart.getItems()
                .stream()
                .filter(item -> item.getProduct().getId().equals(productId) &&
                        ((color == null && item.getColor() == null) ||
                                (color != null && color.equals(item.getColor()))))
                .findFirst()
                .orElse(new CartItem());

        if (cartItem.getId() == null) {
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setColor(color);
            cartItem.setQuantity(quantity);
            cartItem.setUnitPrice(product.getPrice());
        } else {
            int newQuantity = cartItem.getQuantity() + quantity;
            if (newQuantity > product.getStock()) {
                throw new RuntimeException("Số lượng sản phẩm vượt quá tồn kho");
            }
            cartItem.setQuantity(newQuantity);
        }

        cartItem.setTotalPrice();
        cart.addItem(cartItem);
        cartItemRepository.save(cartItem);
        cartRepository.save(cart);
    }


    @Override
    public void removeItemFromCart(Long cartId, Long itemId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));

        CartItem itemToRemove = getCartItem(cartId,itemId);
        cart.removeItem(itemToRemove);
        cartRepository.save(cart);
    }

    @Override
    public void updateItemQuantity(Long cartId, Long itemId, int quantity) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));
        cart.getItems()
                .stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .ifPresent(item -> {
                    item.setQuantity(quantity);
                    item.setUnitPrice(item.getProduct().getPrice());
                    item.setTotalPrice();
                });
        Long totalAmount = cart.getItems()
                .stream()
                .map(CartItem::getTotalPrice)
                .reduce(0L, Long::sum);

        cart.setTotalAmount(totalAmount);
        cartRepository.save(cart);
    }

    @Override
    public CartItem getCartItem(Long cartId, Long itemId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng không tồn tại"));
        return cart.getItems()
                .stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Các mặt hàng không tìm thấy"));
    }

    @Override
    public List<CartItemResponse> getCartItemsByCartId(Long cartId) {
        // Tìm Cart theo cartId
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng không tồn tại"));

        return cart.getItems()
                .stream()
                .map(cartItemMapper::toCartItemResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Long getTotalQuantityInCart(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng không tồn tại"));

        return (long) cart.getItems().size();
    }
}
