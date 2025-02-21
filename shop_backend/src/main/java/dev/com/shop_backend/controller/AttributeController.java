package dev.com.shop_backend.controller;

import dev.com.shop_backend.dto.request.AddAttributeRequest;
import dev.com.shop_backend.dto.response.ApiResponse;
import dev.com.shop_backend.dto.response.AttributeResponse;
import dev.com.shop_backend.exceptions.AlreadyExistsException;
import dev.com.shop_backend.exceptions.ResourceNotFoundException;
import dev.com.shop_backend.service.attribute.IAttributeService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("${api.prefix}/attributes")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class AttributeController {
    IAttributeService attributeService;

    @GetMapping("/{attributeId}/attribute")
    public ResponseEntity<ApiResponse> getAttributeById(@PathVariable Long attributeId) {
        try {
            AttributeResponse attribute = attributeService.getAttributeById(attributeId);
            return ResponseEntity.ok(new ApiResponse("Success", attribute));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("all")
    public ResponseEntity<ApiResponse> getAllAttributes() {
        List<AttributeResponse> attributes = attributeService.getAllAttributes();
        return ResponseEntity.ok(new ApiResponse("Success", attributes));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addAttribute(@Valid @RequestBody AddAttributeRequest request) {
        try {
            attributeService.addAttribute(request);
            return ResponseEntity.ok(new ApiResponse("Tạo thuộc tính thành công!", null));
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PutMapping("/attribute/{attributeId}/update")
    public ResponseEntity<ApiResponse> updateAttribute(
            @PathVariable Long attributeId,
            @Valid @RequestBody AddAttributeRequest request
    ) {
        try {
            attributeService.updateAttribute(attributeId, request);
            return ResponseEntity.ok(new ApiResponse("Cập nhập thành công!", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @DeleteMapping("/attribute/{attributeId}/delete")
    public ResponseEntity<ApiResponse> deleteAttribute(@PathVariable Long attributeId) {
        try {
            attributeService.deleteAttribute(attributeId);
            return ResponseEntity.ok(new ApiResponse("Xóa thành công!", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
}
