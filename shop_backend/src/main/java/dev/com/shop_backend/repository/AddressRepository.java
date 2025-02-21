package dev.com.shop_backend.repository;

import dev.com.shop_backend.model.Address;
import dev.com.shop_backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address,Long> {
    @Query("SELECT a FROM Address a WHERE a.userName = :userName AND a.streetAddress = :streetAddress AND a.province = :province AND a.district = :district AND a.ward = :ward AND a.mobile = :mobile")
    List<Address> findByUserNameAndStreetAddressAndProvinceAndDistrictAndWardAndMobile(
            @Param("userName") String userName,
            @Param("streetAddress") String streetAddress,
            @Param("province") String province,
            @Param("district") String district,
            @Param("ward") String ward,
            @Param("mobile") String mobile
    );

    List<Address> findByUserId(Long userId);

}
