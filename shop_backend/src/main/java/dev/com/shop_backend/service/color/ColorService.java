package dev.com.shop_backend.service.color;

import dev.com.shop_backend.dto.request.AddColorRequest;
import dev.com.shop_backend.dto.response.ColorResponse;
import dev.com.shop_backend.exceptions.AlreadyExistsException;
import dev.com.shop_backend.exceptions.ResourceNotFoundException;
import dev.com.shop_backend.mapper.ColorMapper;
import dev.com.shop_backend.model.Color;
import dev.com.shop_backend.repository.ColorRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ColorService implements IColorService{
    ColorRepository colorRepository;
    ColorMapper colorMapper;

    @Override
    public ColorResponse getColorById(Long id) {
        Color color = colorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy màu!"));
        return colorMapper.toColorResponse(color);
    }

    @Override
    public List<ColorResponse> getAllColors() {
        List<Color> colors = colorRepository.findAll();
        return colors.stream()
                .map(colorMapper::toColorResponse)
                .toList();
    }

    @Override
    public ColorResponse addColor(AddColorRequest request) {
        Color savedColor = Optional.of(request)
                .filter(c -> !colorRepository.existsByName(c.getName()))
                .map(c -> colorRepository.save(colorMapper.toColor(c)))
                .orElseThrow(() -> new AlreadyExistsException("Màu " + request.getName() + " đã tồn tại!"));

        return colorMapper.toColorResponse(savedColor);
    }

    @Override
    public ColorResponse updateColor(Long id, AddColorRequest request) {
        Color existingColor = colorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Color not found with ID: " + id));

        existingColor.setCode(request.getCode());
        existingColor.setName(request.getName());

        colorRepository.save(existingColor);
        return colorMapper.toColorResponse(existingColor);
    }

    @Override
    public void deleteColor(Long id) {
        Color color = colorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Màu không tồn tại!"));
        colorRepository.delete(color);
    }
}
