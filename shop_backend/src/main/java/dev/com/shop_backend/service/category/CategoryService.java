package dev.com.shop_backend.service.category;

import com.amazonaws.services.s3.AmazonS3;
import dev.com.shop_backend.dto.request.AddCategoryRequest;
import dev.com.shop_backend.dto.response.CategoryResponse;
import dev.com.shop_backend.exceptions.AlreadyExistsException;
import dev.com.shop_backend.exceptions.ResourceNotFoundException;
import dev.com.shop_backend.mapper.CategoryMapper;
import dev.com.shop_backend.mapper.ImageMapper;
import dev.com.shop_backend.model.Category;
import dev.com.shop_backend.model.Image;
import dev.com.shop_backend.repository.CategoryRepository;
import dev.com.shop_backend.repository.ImageRepository;
import dev.com.shop_backend.service.image.IImageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CategoryService implements ICategoryService {
    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;
    IImageService imageService;
    @Value("${aws.s3.bucket.name}")
    String bucketName;
    ImageRepository imageRepository;
    ImageMapper imageMapper;
    AmazonS3 s3Client;

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục!"));
        return categoryMapper.toCategoryResponse(category);
    }

    @Override
    public CategoryResponse getCategoryByName(String name) {
        Category category = categoryRepository.findByName(name);
        if (category == null) {
            throw new ResourceNotFoundException("Không tìm thấy danh mục!");
        }
        return categoryMapper.toCategoryResponse(category);
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(categoryMapper::toCategoryResponse)
                .toList();
    }

    @Override
    public CategoryResponse addCategory(String name, MultipartFile file) {
        if (categoryRepository.existsByName(name)) {
            throw new AlreadyExistsException(name + " đã tồn tại!");
        }

        Category newCategory = categoryMapper.toCategory(name);
        Category savedCategory = categoryRepository.save(newCategory);

        if (file != null && !file.isEmpty()) {
            imageService.saveCategoryImage(savedCategory, file);
        }

        return categoryMapper.toCategoryResponse(savedCategory);
    }


    @Override
    public CategoryResponse updateCategory(String name, Long id, MultipartFile file) throws IOException {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));

        existingCategory.setName(name);
        if (file != null && !file.isEmpty()) {
            if (existingCategory.getImage() != null) {
                String oldFileName = existingCategory.getImage().getFileName();
                s3Client.deleteObject(bucketName, oldFileName);
            }

            Image newImage = imageService.saveUpdateCategoryImage(existingCategory, file);
            existingCategory.setImage(newImage);
        }

        categoryRepository.save(existingCategory);
        return categoryMapper.toCategoryResponse(existingCategory);
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));
        if (category.getImage() != null) {
            String fileName = category.getImage().getFileName();
            s3Client.deleteObject(bucketName, fileName);
            imageRepository.delete(category.getImage());
        }
        categoryRepository.delete(category);
    }

}


