package dev.com.shop_backend.mapper;

import dev.com.shop_backend.dto.request.AddCategoryRequest;
import dev.com.shop_backend.dto.response.CategoryResponse;
import dev.com.shop_backend.model.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    Category toCategory(String name);

    @Mapping(source = "image.downloadUrl", target = "imageUrl")
    CategoryResponse toCategoryResponse(Category category);
}
