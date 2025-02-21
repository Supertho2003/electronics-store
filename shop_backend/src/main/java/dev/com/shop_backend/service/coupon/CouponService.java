package dev.com.shop_backend.service.coupon;


import com.amazonaws.services.kms.model.NotFoundException;
import dev.com.shop_backend.dto.request.AddCouponRequest;
import dev.com.shop_backend.dto.response.CouponResponse;
import dev.com.shop_backend.exceptions.ResourceNotFoundException;
import dev.com.shop_backend.mapper.CouponMapper;
import dev.com.shop_backend.model.Coupon;
import dev.com.shop_backend.repository.CouponRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CouponService implements ICouponService{
    CouponRepository couponRepository;
    CouponMapper couponMapper;

    @Override
    public Long applyDiscount(String code, Long totalAmount) {
        Coupon coupon = couponRepository.findByCode(code);
        if(coupon == null){
            throw new ResourceNotFoundException("Mã không tồn tại");
        }
        if (coupon != null && coupon.isActive() && !coupon.getExpirationDate().isBefore(LocalDate.now())) {
            Long discountAmount = (totalAmount * coupon.getDiscountPercentage().longValue()) / 100;
            return discountAmount;
        }
        return 0L;
    }

    @Override
    public CouponResponse setActiveStatus(Long id, boolean isActive) {
        Coupon coupon = couponRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Coupon not found"));

        coupon.setActive(isActive);
        coupon = couponRepository.save(coupon);
        return couponMapper.toCouponResponse(coupon);
    }

    @Transactional
    @Override
    public CouponResponse createCoupon(AddCouponRequest request) {
        if (couponRepository.findByCode(request.getCode()) != null) {
            throw new ResourceNotFoundException("Coupon code already exists");
        }
        Coupon coupon = couponMapper.toCoupon(request);
        coupon = couponRepository.save(coupon);
        return couponMapper.toCouponResponse(coupon);
    }

    @Override
    public CouponResponse updateCoupon(Long id, AddCouponRequest request) {
        Coupon coupon = couponRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Coupon not found"));

        coupon.setCode(request.getCode());
        coupon.setDiscountPercentage(request.getDiscountPercentage());
        coupon.setExpirationDate(request.getExpirationDate());
        coupon.setActive(request.isActive());

        coupon = couponRepository.save(coupon);
        return couponMapper.toCouponResponse(coupon);
    }

    @Override
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Coupon not found"));
        couponRepository.delete(coupon);
    }

    @Override
    public List<CouponResponse> getAllCoupons() {
        List<Coupon> coupons = couponRepository.findAll();
        return coupons.stream()
                .map(couponMapper::toCouponResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CouponResponse getCouponById(Long id) {
        Coupon coupon = couponRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Coupon not found"));
        return couponMapper.toCouponResponse(coupon);
    }

}
