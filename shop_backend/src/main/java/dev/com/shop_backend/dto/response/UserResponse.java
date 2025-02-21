package dev.com.shop_backend.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserResponse {
    Long id;
    private String username;;
    private String email;
    private boolean isVerified;
    LocalDateTime createdAt;
    boolean active;
    List<String> roles;
    List<AddressResponse> addresses;
}
