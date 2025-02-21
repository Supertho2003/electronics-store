package dev.com.shop_backend.dto.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddAddressRequest {
    @NotBlank(message = "Tên người nhận không được để trống")
    private String userName;

    @NotBlank(message = "Địa chỉ không được để trống")
    private String streetAddress;

    @NotBlank(message = "Tỉnh/Thành phố không được để trống")
    private String province;

    @NotBlank(message = "Quận/Huyện không được để trống")
    private String district;

    @NotBlank(message = "Phường/Xã không được để trống")
    private String ward;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String mobile;
}
