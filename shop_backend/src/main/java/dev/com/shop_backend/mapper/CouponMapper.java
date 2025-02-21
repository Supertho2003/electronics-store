package dev.com.shop_backend.mapper;

import dev.com.shop_backend.dto.request.AddCouponRequest;
import dev.com.shop_backend.dto.response.CouponResponse;
import dev.com.shop_backend.model.Coupon;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Mapper(componentModel = "spring")
public interface CouponMapper {
    Coupon toCoupon(AddCouponRequest request);
    CouponResponse toCouponResponse(Coupon coupon);

}
