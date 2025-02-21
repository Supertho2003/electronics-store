package dev.com.shop_backend.service.color;

import dev.com.shop_backend.dto.request.AddColorRequest;
import dev.com.shop_backend.dto.response.ColorResponse;

import java.util.List;

public interface IColorService {
    ColorResponse addColor(AddColorRequest equest);
    ColorResponse updateColor(Long id,AddColorRequest equest);
    void deleteColor(Long id);
    List<ColorResponse> getAllColors();
    ColorResponse getColorById(Long id);
}
