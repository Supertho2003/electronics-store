package dev.com.shop_backend.dto.response;

import dev.com.shop_backend.model.AttributeValue;
import lombok.Data;

import java.util.List;

@Data
public class AttributeResponse {
    private Long id;
    private String attributeName;
    private List<String> values;

    // Constructor sửa lại để nhận giá trị List<String> values
    public AttributeResponse(Long id, String attributeName, List<String> values) {
        this.id = id;
        this.attributeName = attributeName;
        this.values = values;
    }
}
