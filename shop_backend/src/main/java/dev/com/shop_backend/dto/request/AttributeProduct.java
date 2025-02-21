package dev.com.shop_backend.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class AttributeProduct {
    private Long attributeId;
    private String name;
    private String value;
}
