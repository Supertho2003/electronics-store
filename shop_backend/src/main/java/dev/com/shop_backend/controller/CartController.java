package dev.com.shop_backend.controller;

import dev.com.shop_backend.dto.response.ApiResponse;
import dev.com.shop_backend.exceptions.ResourceNotFoundException;
import dev.com.shop_backend.model.Cart;
import dev.com.shop_backend.model.User;
import dev.com.shop_backend.service.cart.ICartService;
import dev.com.shop_backend.service.coupon.ICouponService;
import dev.com.shop_backend.service.user.IUserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("${api.prefix}/carts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CartController {
    ICartService cartService;
    IUserService userService;
    ICouponService couponService;
    @GetMapping("/my-cart")
    public ResponseEntity<ApiResponse> getCart() {
        try {
            User user = userService.getAuthenticatedUser();
            Cart cart = cartService.getCartByUserId(user.getId());
            return ResponseEntity.ok(new ApiResponse("Success",cartService.getCart(cart.getId())));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }



}
