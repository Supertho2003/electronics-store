package dev.com.shop_backend.service.product;

import dev.com.shop_backend.dto.request.AddProductRequest;
import dev.com.shop_backend.dto.response.ProductResponse;
import dev.com.shop_backend.model.Product;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public interface IProductService {
    ProductResponse addProduct(AddProductRequest request,MultipartFile file);
    ProductResponse updateProduct(Long id, AddProductRequest request, MultipartFile file);
    void deleteProductById(Long id);

    ProductResponse getProductById(Long id);
    Product findProductById(Long id);
    List<ProductResponse> getProductsByCategory(String category);
    List<ProductResponse> getProductsByName(String name);
    List<ProductResponse> getProductsByBrand(String brand);
    List<ProductResponse> findAllProducts(int page, int size);
    List<ProductResponse> getAllProducts();
    List<ProductResponse> getProductsByCategoryAndPriceRange(String category, Long minPrice, Long maxPrice);
    List<ProductResponse> getProductsByCategoryAndBrand(String category, String brand);
}
