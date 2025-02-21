package dev.com.shop_backend.controller;

import dev.com.shop_backend.dto.request.AddCategoryRequest;
import dev.com.shop_backend.dto.response.ApiResponse;
import dev.com.shop_backend.dto.response.CategoryResponse;
import dev.com.shop_backend.exceptions.ResourceNotFoundException;
import dev.com.shop_backend.service.category.ICategoryService;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/categories")
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CategoryController {
    ICategoryService categoryService;

    @GetMapping("/{categoryId}/category")
    public ResponseEntity<ApiResponse> getCategoryById(@PathVariable Long categoryId) {
        try {
            CategoryResponse response = categoryService.getCategoryById(categoryId);
            return ResponseEntity.ok(new ApiResponse("Thành công", response));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/category/name/{categoryName}")
    public ResponseEntity<ApiResponse> getCategoryByName(@PathVariable String categoryName) {
        try {
            CategoryResponse response = categoryService.getCategoryByName(categoryName);
            return ResponseEntity.ok(new ApiResponse("Thành công", response));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllCategories() {
        return ResponseEntity.ok(new ApiResponse("Thành công", categoryService.getAllCategories()));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addCategory(@RequestParam("file") MultipartFile file,
                                                   @NotBlank(message = "Tên danh mục không được để trống") @RequestParam("name") String name) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("Tệp không được để trống", null));
        }
        try {
            CategoryResponse response = categoryService.addCategory(name, file);
            return ResponseEntity.ok(new ApiResponse("Thêm danh mục thành công", response));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(new ApiResponse("Lỗi tạo danh mục: " + e.getMessage(), null));
        }
    }


    @PutMapping("/category/{categoryId}/update")
    public ResponseEntity<ApiResponse> updateCategory(@PathVariable Long categoryId,
                                                      @RequestParam(value = "file", required = false) MultipartFile file,
                                                      @NotBlank(message = "Tên danh mục không được để trống") @RequestParam("name") String name) {
        try {
            CategoryResponse response = categoryService.updateCategory(name, categoryId, file);
            return ResponseEntity.ok(new ApiResponse("Category updated successfully", response));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(new ApiResponse("Lỗi cập nhập danh mục: " + e.getMessage(), null));
        }
    }


    @DeleteMapping("/category/{categoryId}/delete")
    public ResponseEntity<ApiResponse> deleteCategory(@PathVariable Long categoryId) {
        try {
            categoryService.deleteCategory(categoryId);
            return ResponseEntity.ok(new ApiResponse("Xóa danh mục thành công", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(new ApiResponse("Lỗi xóa danh mục: " + e.getMessage(), null));
        }
    }
}
