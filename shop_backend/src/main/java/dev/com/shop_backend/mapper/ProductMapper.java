package dev.com.shop_backend.mapper;

import dev.com.shop_backend.dto.request.AddProductRequest;
import dev.com.shop_backend.dto.response.AttributeResponse;
import dev.com.shop_backend.dto.response.ColorResponse;
import dev.com.shop_backend.dto.response.ProductResponse;
import dev.com.shop_backend.model.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {ColorMapper.class, AttributeMapper.class,ReviewMapper.class})
public interface ProductMapper {
    Product toProduct(AddProductRequest request);

    @Mapping(source = "image.downloadUrl", target = "imageUrl")
    @Mapping(target = "colors", source = "colors")
    @Mapping(target = "reviews", source = "reviews")
    @Mapping(target = "attributes", source = "productAttributes")
    @Mapping(source = "category.name", target = "categoryName")
    ProductResponse toProductResponse(Product product);

    @Mapping(target = "id", source = "attribute.id")
    @Mapping(target = "attributeName", source = "attribute.attributeName")
    @Mapping(target = "values", source = "values")
    AttributeResponse toAttributeResponse(ProductAttribute productAttribute);

    default List<Color> mapColorIdsToColors(List<Long> colorIds) {
        if (colorIds == null) {
            return null;
        }
        return colorIds.stream()
                .map(id -> new Color(id, "Default Color", "Default Code"))
                .collect(Collectors.toList());
    }

}
