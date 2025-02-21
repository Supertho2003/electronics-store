package dev.com.shop_backend.controller;

import dev.com.shop_backend.dto.request.AddAddressRequest;
import dev.com.shop_backend.dto.response.AddressResponse;
import dev.com.shop_backend.dto.response.ApiResponse;
import dev.com.shop_backend.exceptions.ResourceNotFoundException;
import dev.com.shop_backend.model.User;
import dev.com.shop_backend.service.user.IUserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/addresses")
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class AddressController {
    IUserService userService;

    @GetMapping("/users/addresses")
    public ResponseEntity<List<AddressResponse>> getUserAddresses() {
        User user = userService.getAuthenticatedUser();
        System.out.println(user.getEmail());
        List<AddressResponse> addresses = userService.getUserAddresses(user.getId());
        return ResponseEntity.ok(addresses);
    }
    @PostMapping("/addresses/add")
    public ResponseEntity<ApiResponse> addAddress(@Valid @RequestBody AddAddressRequest request) {
        try {
            User user = userService.getAuthenticatedUser();
            AddressResponse addressResponse = userService.addAddress(user.getId(), request); // Gọi phương thức mới
            return ResponseEntity.ok(new ApiResponse("Thêm địa chỉ thành công!", addressResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/addresses/{addressId}")
    public ResponseEntity<ApiResponse> getAddressById(@PathVariable Long addressId) {
        try {
            AddressResponse addressResponse = userService.getAddressById(addressId);
            return ResponseEntity.ok(new ApiResponse("Lấy địa chỉ thành công!", addressResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @DeleteMapping("/addresses/{addressId}")
    public ResponseEntity<ApiResponse> deleteAddress(@PathVariable Long addressId) {
        try {
            userService.deleteAddress(addressId);
            return ResponseEntity.ok(new ApiResponse("Xóa địa chỉ thành công!", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PutMapping("/addresses/{addressId}/update")
    public ResponseEntity<ApiResponse> updateAddress(@PathVariable Long addressId,@Valid @RequestBody AddAddressRequest request) {
        try {
            AddressResponse updatedAddress = userService.updateAddress(addressId, request);
            return ResponseEntity.ok(new ApiResponse("Cập nhật địa chỉ thành công!", updatedAddress));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
}
