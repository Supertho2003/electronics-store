package dev.com.shop_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class AddAttributeRequest {
    @NotBlank(message = "Tên thuộc tính không được để trống")
    private String attributeName;
    @NotEmpty(message = "Danh sách giá trị không được để trống")
    private List<String> values;
}
