package dev.com.shop_backend.service.image;

import dev.com.shop_backend.dto.response.ImageResponse;
import dev.com.shop_backend.model.Category;
import dev.com.shop_backend.model.Image;
import dev.com.shop_backend.model.Product;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IImageService {
    ImageResponse getImageById(Long id);
    void deleteImageById(Long id);
    ImageResponse saveProductImage(Product product, MultipartFile file);
    ImageResponse saveCategoryImage(Category category, MultipartFile file);
    Image saveUpdateCategoryImage(Category category, MultipartFile file);
    Image saveUpdateProductImage(Product product, MultipartFile file);
}
