package dev.com.shop_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class AddProductRequest {

    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name; // Tên sản phẩm

    @NotBlank(message = "Hãng sản xuất không được để trống")
    private String brand; // Hãng sản xuất

    @NotNull(message = "Giá bán không được để trống")
    @Positive(message = "Giá bán phải là số dương")
    private Long price; // Giá bán

    @NotNull(message = "Số lượng tồn kho không được để trống")
    @Positive(message = "Số lượng tồn kho phải là số dương")
    private Integer stock; // Số lượng tồn kho

    private String description; // Mô tả sản phẩm

    @NotBlank(message = "Tên danh mục sản phẩm không được để trống")
    private String categoryName; // Tên danh mục sản phẩm

    private Boolean isAvailable = true;

    private List<Long> colors; // Danh sách ID màu sắc

    private List<AttributeProduct> attributes; // Danh sách thuộc tính sản phẩm

    // Thêm các trường khác nếu cần
}