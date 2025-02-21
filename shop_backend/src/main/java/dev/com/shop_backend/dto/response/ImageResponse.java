package dev.com.shop_backend.dto.response;

import lombok.Data;

@Data
public class ImageResponse {
    private Long id;
    private String fileName;
    private String downloadUrl;
}
