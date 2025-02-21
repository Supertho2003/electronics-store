package dev.com.shop_backend.controller;

import dev.com.shop_backend.dto.request.AddCouponRequest;
import dev.com.shop_backend.dto.response.ApiResponse;
import dev.com.shop_backend.dto.response.CouponResponse;
import dev.com.shop_backend.dto.response.DiscountResponse;
import dev.com.shop_backend.exceptions.AlreadyExistsException;
import dev.com.shop_backend.exceptions.ResourceNotFoundException;
import dev.com.shop_backend.model.Cart;
import dev.com.shop_backend.model.Coupon;
import dev.com.shop_backend.model.User;
import dev.com.shop_backend.service.cart.ICartService;
import dev.com.shop_backend.service.coupon.ICouponService;
import dev.com.shop_backend.service.user.IUserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/coupons")
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CouponController {
    ICouponService couponService;
    IUserService userService;
    ICartService cartService;
    HttpSession httpSession;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> createCoupon(@Valid @RequestBody AddCouponRequest request) {
        try {
            CouponResponse couponResponse = couponService.createCoupon(request);
            return ResponseEntity.ok(new ApiResponse("Tạo mã giảm giá thành công!", couponResponse));
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllCoupons() {
        List<CouponResponse> coupons = couponService.getAllCoupons();
        return ResponseEntity.ok(new ApiResponse("Lấy danh sách mã giảm giá thành công!", coupons));
    }

    @PostMapping("/apply-discount")
    public ResponseEntity<ApiResponse> applyDiscount(
            @RequestParam String discountCode) {
        try {
            User user = userService.getAuthenticatedUser ();
            Cart cart = cartService.getCartByUserId(user.getId());
            Long totalAmount = cart.getTotalAmount();

            Long discountAmount = couponService.applyDiscount(discountCode, totalAmount);
            if (discountAmount > 0) {
                Long newTotalAmount = totalAmount - discountAmount;
                httpSession.setAttribute("discountAmount", discountAmount);
                DiscountResponse discountResponse = new DiscountResponse(discountAmount, newTotalAmount);
                return ResponseEntity.ok(new ApiResponse("Áp mã thành công", discountResponse));
            } else {
                DiscountResponse discountResponse = new DiscountResponse(0L, totalAmount);
                return ResponseEntity.status(BAD_REQUEST).body(new ApiResponse("Mã đã hết hạn", null));
            }

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }


    @PutMapping("/{id}/active")
    public ResponseEntity<ApiResponse> setActiveStatus(@PathVariable Long id, @RequestParam boolean isActive) {
        try {
            CouponResponse couponResponse = couponService.setActiveStatus(id, isActive);
            return ResponseEntity.ok(new ApiResponse("Cập nhật trạng thái thành công!", couponResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }


    @PutMapping("/{id}/update")
    public ResponseEntity<ApiResponse> updateCoupon(@PathVariable Long id,@Valid  @RequestBody AddCouponRequest request) {
        try {
            CouponResponse couponResponse = couponService.updateCoupon(id, request);
            return ResponseEntity.ok(new ApiResponse("Cập nhật mã giảm giá thành công!", couponResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }


    @GetMapping("/coupon/{id}")
    public ResponseEntity<ApiResponse> getCouponById(@PathVariable Long id) {
        try {
            CouponResponse couponResponse = couponService.getCouponById(id);
            return ResponseEntity.ok(new ApiResponse("Lấy mã giảm giá thành công!", couponResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<ApiResponse> deleteCoupon(@PathVariable Long id) {
        try {
            couponService.deleteCoupon(id);
            return ResponseEntity.ok(new ApiResponse("Xóa mã giảm giá thành công!", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
}
