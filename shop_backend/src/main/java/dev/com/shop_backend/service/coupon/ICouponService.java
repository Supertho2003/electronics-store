package dev.com.shop_backend.service.coupon;

import dev.com.shop_backend.dto.request.AddCouponRequest;
import dev.com.shop_backend.dto.response.CouponResponse;

import java.util.List;

public interface ICouponService {
    Long applyDiscount(String code, Long totalAmount);
    CouponResponse createCoupon(AddCouponRequest request);
    CouponResponse updateCoupon(Long id, AddCouponRequest request);
    void deleteCoupon(Long id);
    List<CouponResponse> getAllCoupons();
    CouponResponse getCouponById(Long id);
    CouponResponse setActiveStatus(Long id, boolean isActive);
}
