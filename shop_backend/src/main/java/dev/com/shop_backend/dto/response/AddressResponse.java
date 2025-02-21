package dev.com.shop_backend.dto.response;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class AddressResponse {
    private Long id;
    private String userName;
    private String streetAddress;
    private String province;
    private String district;
    private String ward;
    private String mobile;
}
