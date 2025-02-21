package dev.com.shop_backend.controller;

import dev.com.shop_backend.dto.request.AddColorRequest;
import dev.com.shop_backend.dto.response.ApiResponse;
import dev.com.shop_backend.exceptions.AlreadyExistsException;
import dev.com.shop_backend.exceptions.ResourceNotFoundException;
import dev.com.shop_backend.service.color.IColorService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/colors")
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ColorController {
    IColorService colorService;

    @GetMapping("/{colorId}/color")
    public ResponseEntity<ApiResponse> getColorById(@PathVariable Long colorId) {
        try {
            return ResponseEntity.ok(new ApiResponse("Thành công", colorService.getColorById(colorId)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllColors() {
        return ResponseEntity.ok(new ApiResponse("Thành công", colorService.getAllColors()));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addColor(@Valid @RequestBody AddColorRequest request) {
        try {
            return ResponseEntity.ok(new ApiResponse("Thêm màu thành công!", colorService.addColor(request)));
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PutMapping("/color/{colorId}/update")
    public ResponseEntity<ApiResponse> updateColor(@Valid @RequestBody AddColorRequest request, @PathVariable Long colorId) {
        try {
            return ResponseEntity.ok(new ApiResponse("Cập nhập thành công!", colorService.updateColor(colorId, request)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @DeleteMapping("/color/{colorId}/delete")
    public ResponseEntity<ApiResponse> deleteColor(@PathVariable Long colorId) {
        try {
            colorService.deleteColor(colorId);
            return ResponseEntity.ok(new ApiResponse("Xóa màu thành công!", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
}
