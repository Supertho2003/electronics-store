package dev.com.shop_backend.mapper;

import dev.com.shop_backend.dto.request.AddColorRequest;
import dev.com.shop_backend.dto.request.AddUserRequest;
import dev.com.shop_backend.dto.response.ColorResponse;
import dev.com.shop_backend.dto.response.UserResponse;
import dev.com.shop_backend.model.Color;
import dev.com.shop_backend.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ColorMapper {
    Color toColor(AddColorRequest request);
    ColorResponse toColorResponse(Color color);
}
