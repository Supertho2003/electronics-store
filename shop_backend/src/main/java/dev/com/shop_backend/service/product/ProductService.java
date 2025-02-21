package dev.com.shop_backend.service.product;

import com.amazonaws.services.kms.model.NotFoundException;
import com.amazonaws.services.s3.AmazonS3;
import dev.com.shop_backend.dto.request.AddAttributeRequest;
import dev.com.shop_backend.dto.request.AddColorRequest;
import dev.com.shop_backend.dto.request.AddProductRequest;
import dev.com.shop_backend.dto.request.AttributeProduct;
import dev.com.shop_backend.dto.response.CategoryResponse;
import dev.com.shop_backend.dto.response.ImageResponse;
import dev.com.shop_backend.dto.response.ProductResponse;
import dev.com.shop_backend.exceptions.AlreadyExistsException;
import dev.com.shop_backend.exceptions.ResourceNotFoundException;
import dev.com.shop_backend.mapper.ProductMapper;
import dev.com.shop_backend.model.*;
import dev.com.shop_backend.repository.*;
import dev.com.shop_backend.service.image.IImageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ProductService implements IProductService{
    ProductRepository productRepository;
    CategoryRepository categoryRepository;
    ColorRepository colorRepository;
    ImageRepository imageRepository;
    IImageService imageService;
    ProductMapper productMapper;
    AttributeRepository attributeRepository;
    AttributeValueRepository attributeValueRepository;
    ProductAttributeRepository productAttributeRepository;
    @Value("${aws.s3.bucket.name}")
    String bucketName;
    AmazonS3 s3Client;
    @Override
    public ProductResponse addProduct(AddProductRequest request, MultipartFile file) {
        if (productExists(request.getName(), request.getBrand())) {
            throw new AlreadyExistsException("Sản phẩm đã tồn tại");
        }

        if (request.getCategoryName() == null || request.getCategoryName().isEmpty()) {
            throw new IllegalArgumentException("Tên danh mục không được để trống");
        }

        // Tạo hoặc lấy Category
        Category category = Optional.ofNullable(categoryRepository.findByName(request.getCategoryName()))
                .orElseGet(() -> {
                    Category newCategory = new Category(request.getCategoryName());
                    return categoryRepository.save(newCategory);
                });
        // Lưu thông tin sản phẩm
        request.setCategoryName(category.getName());
        request.setIsAvailable(request.getIsAvailable());
        Product product = productRepository.save(createProduct(request, category));

        if (request.getColors() != null && !request.getColors().isEmpty()) {
            List<Color> colors = colorRepository.findAllById(request.getColors()); // Lấy danh sách màu sắc từ ID
            product.setColors(colors); // Gán màu sắc cho sản phẩm
        }
        // Xử lý các thuộc tính cho sản phẩm
        if (request.getAttributes() != null && !request.getAttributes().isEmpty()) {
            for (AttributeProduct attributeRequest : request.getAttributes()) {
                Long attributeId = attributeRequest.getAttributeId();

                Attribute attribute = attributeRepository.findById(attributeId)
                        .orElseThrow(() -> new ResourceNotFoundException("Thuộc tính không tồn tại"));

                    AttributeValue attributeValue = attributeValueRepository.findByValue(attributeRequest.getValue())
                            .orElseThrow(() -> new ResourceNotFoundException("Giá trị thuộc tính không tồn tại"));

                    // Tạo ProductAttribute để lưu các giá trị thuộc tính cho sản phẩm
                    ProductAttribute productAttribute = new ProductAttribute();
                    productAttribute.setProduct(product);
                    productAttribute.setAttribute(attribute);
                    productAttribute.setValues(Arrays.asList(attributeValue)); // Gán giá trị cho thuộc tính
                    productAttributeRepository.save(productAttribute);

            }
        }
        // Lưu hình ảnh sản phẩm
        imageService.saveProductImage(product, file);

        return productMapper.toProductResponse(product);
    }

    @Override
    public void deleteProductById(Long id) {
        productRepository.findById(id).ifPresentOrElse(productRepository::delete,
                () ->  { throw new NotFoundException("Sản phẩm không tồn tại");});
    }

    private Product createProduct(AddProductRequest request, Category category) {
        Product product = new Product();
        product.setName(request.getName());
        product.setBrand(request.getBrand());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setDescription(request.getDescription());
        product.setCategory(category);
        product.setIsAvailable(request.getIsAvailable()); // Đảm bảo giá trị isAvailable được thiết lập
        return product;
    }
    @Override
    public ProductResponse updateProduct(Long id, AddProductRequest request, MultipartFile file) {
        try {
            // Kiểm tra xem sản phẩm có tồn tại không
            Product existingProduct = productRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại với ID: " + id));

            // Cập nhật thông tin sản phẩm
            existingProduct.setName(request.getName());
            existingProduct.setBrand(request.getBrand());
            existingProduct.setPrice(request.getPrice());
            existingProduct.setIsAvailable(request.getIsAvailable());
            existingProduct.setStock(request.getStock());
            existingProduct.setDescription(request.getDescription());

            // Cập nhật danh mục nếu có thay đổi
            Category category = Optional.ofNullable(categoryRepository.findByName(request.getCategoryName()))
                    .orElseGet(() -> categoryRepository.save(new Category(request.getCategoryName())));
            existingProduct.setCategory(category);

            // Cập nhật màu sắc
            if (request.getColors() != null && !request.getColors().isEmpty()) {
                List<Color> colors = colorRepository.findAllById(request.getColors());
                existingProduct.setColors(colors);
            }

            if (request.getAttributes() != null && !request.getAttributes().isEmpty()) {
                for (AttributeProduct attributeRequest : request.getAttributes()) {
                    Long attributeId = attributeRequest.getAttributeId();
                    System.out.println("Cập nhật thuộc tính với ID: " + attributeId);

                    // Kiểm tra xem thuộc tính đã tồn tại trong sản phẩm chưa
                    Optional<ProductAttribute> existingAttribute = existingProduct.getProductAttributes().stream()
                            .filter(pa -> pa.getAttribute().getId().equals(attributeId))
                            .findFirst();

                    if (existingAttribute.isPresent()) {
                        // Nếu thuộc tính đã tồn tại, cập nhật giá trị mới
                        ProductAttribute productAttribute = existingAttribute.get();
                        System.out.println("Cập nhật giá trị cho thuộc tính: " + productAttribute.getAttribute().getAttributeName());

                        // Cập nhật giá trị
                        AttributeValue newValue = attributeValueRepository.findByValue(attributeRequest.getValue())
                                .orElseThrow(() -> new ResourceNotFoundException("Giá trị thuộc tính không tồn tại"));

                        // Sử dụng ArrayList để cập nhật giá trị
                        List<AttributeValue> values = new ArrayList<>();
                        values.add(newValue);
                        productAttribute.setValues(values); // Cập nhật giá trị mới
                        productAttributeRepository.save(productAttribute);
                    } else {
                        // Tạo mới thuộc tính nếu chưa tồn tại
                        ProductAttribute productAttribute = new ProductAttribute();
                        productAttribute.setProduct(existingProduct);
                        productAttribute.setAttribute(attributeRepository.findById(attributeId)
                                .orElseThrow(() -> new ResourceNotFoundException("Thuộc tính không tồn tại")));
                        List<AttributeValue> values = new ArrayList<>();
                        AttributeValue newValue = attributeValueRepository.findByValue(attributeRequest.getValue())
                                .orElseThrow(() -> new ResourceNotFoundException("Giá trị thuộc tính không tồn tại"));
                        values.add(newValue);
                        productAttribute.setValues(values);

                        productAttributeRepository.save(productAttribute);
                        existingProduct.getProductAttributes().add(productAttribute);
                        System.out.println("Thêm mới thuộc tính: " + productAttribute.getAttribute().getAttributeName());
                    }
                }
            }

            // Cập nhật hình ảnh sản phẩm
            if (file != null && !file.isEmpty()) {
                if (existingProduct.getImage() != null) {
                    String oldFileName = existingProduct.getImage().getFileName();
                    s3Client.deleteObject(bucketName, oldFileName); // Xóa ảnh cũ trên AWS S3
                }

                Image newImage = imageService.saveUpdateProductImage(existingProduct, file);
                existingProduct.setImage(newImage); // Cập nhật ảnh mới
                System.out.println("Hình ảnh đã cập nhật: " + newImage);
            }

            // Lưu sản phẩm đã cập nhật vào cơ sở dữ liệu
            productRepository.save(existingProduct);
            System.out.println("Sản phẩm đã lưu: " + existingProduct);

            return productMapper.toProductResponse(existingProduct);
        } catch (Exception e) {
            System.out.println("❌ Lỗi xảy ra: " + e.getMessage());
            e.printStackTrace(); // In ra stack trace để dễ dàng gỡ lỗi
            throw e; // Ném lại ngoại lệ để xử lý ở nơi khác nếu cần
        }
    }


    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Sản phẩm không tồn tại"));
        return productMapper.toProductResponse(product);
    }

    @Override
    public Product findProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Sản phẩm không tồn tại"));
        return product;
    }

    @Override
    public List<ProductResponse> getProductsByCategory(String category) {
        return productRepository.findByCategoryName(category)
                .stream()
                .map(productMapper::toProductResponse)
                .toList();
    }

    @Override
    public List<ProductResponse> getAllProducts() {
      List<Product> products = (List<Product>) productRepository.findAll();
        return products.stream()
                .map(productMapper::toProductResponse)
                .collect(Collectors.toList());
    }
    @Override
    public List<ProductResponse> getProductsByName(String name) {
        return productRepository.findByName(name).stream()
                .map(productMapper::toProductResponse)
                .toList();
    }

    @Override
    public List<ProductResponse> getProductsByCategoryAndBrand(String category, String brand) {
        List<Product> products = productRepository.findByCategoryNameAndBrand(category, brand);
        return products.stream()
                .map(productMapper::toProductResponse)
                .collect(Collectors.toList());
    }


    @Override
    public List<ProductResponse> getProductsByBrand(String brand) {
        return productRepository.findByBrand(brand).stream()
                .map(productMapper::toProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getProductsByCategoryAndPriceRange(String category, Long minPrice, Long maxPrice) {
        List<Product> products = productRepository.findByCategoryNameAndPriceBetween(category, minPrice, maxPrice);
        return products.stream()
                .map(productMapper::toProductResponse)
                .collect(Collectors.toList());
    }


    @Override
    public List<ProductResponse> findAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        return productRepository.findAll(pageable)
                .stream()
                .map(productMapper::toProductResponse)
                .collect(Collectors.toList());
    }


    private boolean productExists(String name,String brand){
        return productRepository.existsByNameAndBrand(name,brand);
    }

    private BigDecimal formatPrice(BigDecimal price) {
        DecimalFormat formatter = new DecimalFormat("#,###");
        return new BigDecimal(formatter.format(price));
    }

}
