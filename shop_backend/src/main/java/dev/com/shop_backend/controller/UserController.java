package dev.com.shop_backend.controller;

import dev.com.shop_backend.dto.request.AddAddressRequest;
import dev.com.shop_backend.dto.request.AddUserRequest;
import dev.com.shop_backend.dto.request.UpdateUserRequest;
import dev.com.shop_backend.dto.response.AddressResponse;
import dev.com.shop_backend.dto.response.ApiResponse;
import dev.com.shop_backend.dto.response.UserResponse;
import dev.com.shop_backend.enums.RoleEnum;
import dev.com.shop_backend.exceptions.AlreadyExistsException;
import dev.com.shop_backend.exceptions.ResourceNotFoundException;
import dev.com.shop_backend.model.User;
import dev.com.shop_backend.service.user.IUserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/users")
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class UserController {
    IUserService userService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(new ApiResponse("Fetched all users successfully!", users));
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse> getUserById() {
        try {
            User user = userService.getAuthenticatedUser();
            return ResponseEntity.ok(new ApiResponse("Thành công!", userService.getUserById(user.getId())));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<Void> verifyUser(@RequestParam String token) {
        userService.verifyUser(token);
        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", "http://localhost:3000/xac-thuc-thanh-cong")
                .build();
    }

    @PutMapping("/user/update-username")
    public ResponseEntity<ApiResponse> updateUsername(@RequestParam String newUserName) {
        try {
            User user = userService.getAuthenticatedUser();
            UserResponse updatedUser = userService.updateUsername(user.getId(), newUserName);
            return ResponseEntity.ok(new ApiResponse("Đổi tên thành công!", updatedUser));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> createUser(@Valid @RequestBody AddUserRequest request) {
        try {
            return ResponseEntity.ok(new ApiResponse("Tạo tài khoản thành công, vui lòng vào email để kích hoạt!!!",userService.createUser(request)));
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse(e.getMessage(), null));
        }
    }
    @PutMapping("/user/{userId}/update")
    public ResponseEntity<ApiResponse> updateUser(@Valid @RequestBody UpdateUserRequest request, @PathVariable Long userId) {
        try {
            return ResponseEntity.ok(new ApiResponse("Cập nhập thông tin thành công!", userService.updateUser(request, userId)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
    @DeleteMapping("/user/{userId}/delete")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok(new ApiResponse("Xóa thành công người dùng!", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/count")
    public ResponseEntity<ApiResponse> countUsers() {
        long userCount = userService.countUsers();
        return ResponseEntity.ok(new ApiResponse("Lấy tổng người dùng thành công!", userCount));
    }

    @PutMapping("/user/{userId}/toggle-active")
    public ResponseEntity<ApiResponse> toggleUserStatus(@PathVariable Long userId) {
        try {
            boolean updatedStatus = userService.toggleUserStatus(userId);
            String message = updatedStatus ? "Người dùng đã được kích hoạt!" : "Người dùng đã bị vô hiệu hóa!";
            return ResponseEntity.ok(new ApiResponse(message, updatedStatus));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }



    @PutMapping("/user/{userId}/add-role")
    public ResponseEntity<ApiResponse> addRoleToUser (@PathVariable Long userId, @RequestParam RoleEnum role) {
        try {
            UserResponse updatedUser = userService.addRoleToUser(userId, role);
            return ResponseEntity.ok(new ApiResponse("Đã thêm vai trò thành công!", updatedUser));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
}
