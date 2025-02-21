package dev.com.shop_backend.dto.response;

import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
public class ReviewResponse {
    private Long id;
    private Long productId;
    private String name;
    private UserResponse user;
    private Integer rating;
    private String comment;
    private LocalDateTime dateCreated;
    private boolean hidden;
}
