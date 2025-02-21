package dev.com.shop_backend.mapper;

import dev.com.shop_backend.dto.response.ImageResponse;
import dev.com.shop_backend.model.Image;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ImageMapper {
    ImageResponse toImageResponse(Image image);
}
