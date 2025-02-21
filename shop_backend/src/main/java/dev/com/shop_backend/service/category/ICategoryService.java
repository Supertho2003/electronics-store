package dev.com.shop_backend.service.category;

import dev.com.shop_backend.dto.request.AddCategoryRequest;
import dev.com.shop_backend.dto.response.CategoryResponse;
import dev.com.shop_backend.model.Category;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ICategoryService {
    CategoryResponse getCategoryById(Long id);
    CategoryResponse getCategoryByName(String name);
    List<CategoryResponse> getAllCategories();
    CategoryResponse addCategory(String name, MultipartFile file);
    CategoryResponse updateCategory(String name, Long id, MultipartFile file) throws IOException;
    void deleteCategory(Long id);
}
