package dev.com.shop_backend.controller;

import dev.com.shop_backend.dto.response.ApiResponse;
import dev.com.shop_backend.dto.response.CartItemResponse;
import dev.com.shop_backend.dto.response.CartResponse;
import dev.com.shop_backend.exceptions.ResourceNotFoundException;
import dev.com.shop_backend.model.Cart;
import dev.com.shop_backend.model.User;
import dev.com.shop_backend.service.cart.ICartItemService;
import dev.com.shop_backend.service.cart.ICartService;
import dev.com.shop_backend.service.user.IUserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("${api.prefix}/cartItems")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CartItemController {
    ICartItemService cartItemService;
    IUserService userService;
    ICartService cartService;

    @PostMapping("/item/add")
    public ResponseEntity<ApiResponse> addItemToCart(
            @RequestParam Long productId,
            @RequestParam int quantity,
            @RequestParam Long colorId) {
        try {
            User user = userService.getAuthenticatedUser();
            Cart cart= cartService.initializeNewCart(user);
            if (cart == null || cart.getId() == null) {
                throw new RuntimeException("Lỗi: Cart ID không tồn tại!");
            }
            System.out.println("Cart ID: " + cart.getId());
            cartItemService.addItemToCart(cart.getId(), productId, quantity, colorId);
            return ResponseEntity.ok(new ApiResponse("Đã thêm vào giỏ hàng!", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage(), null));
        }
    }

    @DeleteMapping("/cart/item/{itemId}/remove")
    public ResponseEntity<ApiResponse> removeItemFromCart(
            @PathVariable Long itemId
            ) {
        try {
            User user = userService.getAuthenticatedUser();
            Cart cart = cartService.getCartByUserId(user.getId());
            cartItemService.removeItemFromCart(cart.getId(), itemId);
            return ResponseEntity.ok(new ApiResponse("Đã xóa sản phẩm khỏi giỏ hàng!", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PutMapping("/cart/item/{itemId}/update")
    public ResponseEntity<ApiResponse> updateItemQuantity(
            @PathVariable Long itemId,
            @RequestParam int quantity) {
        try {
            User user = userService.getAuthenticatedUser();
            Cart cart = cartService.getCartByUserId(user.getId());
            cartItemService.updateItemQuantity(cart.getId(), itemId, quantity);
            return ResponseEntity.ok(new ApiResponse("Cập nhập số lượng thành công!", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getCartItemsByCartId(
            @PathVariable Long cartId) {
        try {
            return ResponseEntity.ok(new ApiResponse("Success", cartItemService.getCartItemsByCartId(cartId)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/total-quantity")
    public ResponseEntity<ApiResponse> getTotalQuantityInCart() {
        try {
            User user = userService.getAuthenticatedUser ();
            Cart cart = cartService.getCartByUserId(user.getId());
            Long totalQuantity = cartItemService.getTotalQuantityInCart(cart.getId());
            return ResponseEntity.ok(new ApiResponse("Success", totalQuantity));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
}
