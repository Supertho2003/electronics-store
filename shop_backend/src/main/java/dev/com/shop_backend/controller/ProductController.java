package dev.com.shop_backend.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.com.shop_backend.dto.request.AddProductRequest;
import dev.com.shop_backend.dto.request.AttributeProduct;
import dev.com.shop_backend.dto.response.ApiResponse;
import dev.com.shop_backend.dto.response.ProductResponse;
import dev.com.shop_backend.exceptions.ResourceNotFoundException;
import dev.com.shop_backend.service.product.IProductService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/products")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {
    IProductService productService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addProduct(@NotBlank(message = "Tên sản phẩm không được để trống") @RequestParam("name") String name,
                                                  @NotBlank(message = "Hãng sản xuất không được để trống") @RequestParam("brand") String brand,
                                                  @NotNull(message = "Giá bán không được để trống") @Positive(message = "Giá bán phải là số dương")  @RequestParam("price") Long price,
                                                  @NotNull(message = "Số lượng tồn kho không được để trống") @Positive(message = "Số lượng tồn kho phải là số dương") @RequestParam("stock") Integer stock,
                                                  @RequestParam("description") String description,
                                                  @NotBlank(message = "Tên danh mục không được để trống") @RequestParam("categoryName") String categoryName,
                                                  @RequestParam("isAvailable") Boolean isAvailable,
                                                  @RequestParam("colors") List<Long> colors,
                                                  @RequestParam(value = "attributes", required = false) String attributesJson,
                                                  @RequestPart("file") MultipartFile file) {
        try {
            List<AttributeProduct> attributes = new ObjectMapper().readValue(attributesJson, new TypeReference<List<AttributeProduct>>() {});

            AddProductRequest request = new AddProductRequest();
            request.setName(name);
            request.setBrand(brand);
            request.setPrice(price);
            request.setStock(stock);
            request.setDescription(description);
            request.setCategoryName(categoryName);
            request.setIsAvailable(isAvailable);
            request.setColors(colors);
            request.setAttributes(attributes);
            System.out.println(attributes);
            ProductResponse productResponse = productService.addProduct(request, file);
            return ResponseEntity.ok(new ApiResponse("Tạo sản phẩm thành công!", productResponse));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(new ApiResponse(e.getMessage(), null));
        }
    }


    @PutMapping("/product/{productId}/update")
    public ResponseEntity<ApiResponse> updateProduct(
            @PathVariable Long productId,
            @NotBlank(message = "Tên sản phẩm không được để trống") @RequestParam("name") String name,
            @NotBlank(message = "Hãng sản xuất không được để trống") @RequestParam("brand") String brand,
            @NotNull(message = "Giá bán không được để trống") @Positive(message = "Giá bán phải là số dương") @RequestParam("price") Long price,
            @NotNull(message = "Số lượng tồn kho không được để trống") @Positive(message = "Số lượng tồn kho phải là số dương") @RequestParam("stock") Integer stock,
            @RequestParam("description") String description,
            @NotBlank(message = "Tên danh mục không được để trống") @RequestParam("categoryName") String categoryName,
            @RequestParam("isAvailable") Boolean isAvailable,
            @RequestParam("colors") List<Long> colors,
            @RequestParam(value = "attributes", required = false) String attributesJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            List<AttributeProduct> attributes = new ArrayList<>();
            if (attributesJson != null && !attributesJson.trim().isEmpty()) {
                attributes = new ObjectMapper().readValue(attributesJson, new TypeReference<List<AttributeProduct>>() {});
            }

            AddProductRequest request = new AddProductRequest();
            request.setName(name);
            request.setBrand(brand);
            request.setPrice(price);
            request.setStock(stock);
            request.setDescription(description);
            request.setCategoryName(categoryName);
            request.setIsAvailable(isAvailable);
            request.setColors(colors);
            request.setAttributes(attributes);
            System.out.println(attributes);

            ProductResponse productResponse = productService.updateProduct(productId, request, file);
            return ResponseEntity.ok(new ApiResponse("Cập nhập sản phẩm trành công!", productResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @DeleteMapping("/product/{productId}/delete")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Long productId) {
        try {
            productService.deleteProductById(productId);
            return ResponseEntity.ok(new ApiResponse("Delete Product Success!", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/{productId}/product")
    public ResponseEntity<ApiResponse> getProductById(@PathVariable Long productId) {
        try {
            ProductResponse productResponse = productService.getProductById(productId);
            return ResponseEntity.ok(new ApiResponse("Success", productResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/product/by/category-and-brand")
    public ResponseEntity<ApiResponse> getProductByCategoryAndBrand(@RequestParam String category, @RequestParam String brand){
        try {
            return  ResponseEntity.ok(new ApiResponse("success", productService.getProductsByCategoryAndBrand(category, brand)));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("error", e.getMessage()));
        }
    }

    @GetMapping("/product/{categoryName}/all/products")
    public ResponseEntity<ApiResponse> getProductsByCategory(@PathVariable String categoryName) {
        return ResponseEntity.ok(new ApiResponse("Success", productService.getProductsByCategory(categoryName)));
    }



    @GetMapping("/product/brand/{brand}")
    public ResponseEntity<ApiResponse> getProductsByBrand(@PathVariable String brand) {
        return ResponseEntity.ok(new ApiResponse("Success", productService.getProductsByBrand(brand)));
    }

    @GetMapping("/product/by/category-and-price")
    public ResponseEntity<ApiResponse> getProductsByCategoryAndPrice(
            @RequestParam String category,
            @RequestParam Long minPrice,
            @RequestParam Long maxPrice) {
        try {
            List<ProductResponse> products = productService.getProductsByCategoryAndPriceRange(category, minPrice, maxPrice);
            return ResponseEntity.ok(new ApiResponse("success", products));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("error", e.getMessage()));
        }
    }

    @GetMapping("/products/{name}/products")
    public ResponseEntity<ApiResponse> getProductsByName(@PathVariable String name) {
        return ResponseEntity.ok(new ApiResponse("Success", productService.getProductsByName(name)));
    }


    @GetMapping("/all/page")
    public ResponseEntity<ApiResponse> getAllProducts(@RequestParam int page, @RequestParam int size) {
        return ResponseEntity.ok(new ApiResponse("Success", productService.findAllProducts(page, size)));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllProducts() {
        return ResponseEntity.ok(new ApiResponse("Success",productService.getAllProducts()));
    }
}
