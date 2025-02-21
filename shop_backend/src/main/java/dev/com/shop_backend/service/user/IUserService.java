package dev.com.shop_backend.service.user;

import dev.com.shop_backend.dto.request.AddAddressRequest;
import dev.com.shop_backend.dto.request.AddUserRequest;
import dev.com.shop_backend.dto.request.UpdateUserRequest;
import dev.com.shop_backend.dto.response.AddressResponse;
import dev.com.shop_backend.dto.response.UserResponse;
import dev.com.shop_backend.enums.RoleEnum;
import dev.com.shop_backend.model.User;

import java.util.List;

public interface IUserService {
    UserResponse createUser(AddUserRequest user);
    User getUserByEmailAndPassword(String email, String password);
    String verifyUser(String token);
    UserResponse getUserById(Long id);
    List<UserResponse> getAllUsers();
    UserResponse updateUser(UpdateUserRequest request, Long userId);
    void deleteUser(Long id);
    List<AddressResponse> getUserAddresses(Long userId);
    User getAuthenticatedUser();
    long countUsers();
    boolean toggleUserStatus(Long userId);
    UserResponse addRoleToUser(Long userId, RoleEnum roleEnum);
    AddressResponse addAddress(Long userId, AddAddressRequest request);
    AddressResponse updateAddress(Long addressId, AddAddressRequest request);
    AddressResponse getAddressById(Long addressId);
    void deleteAddress(Long addressId);
    UserResponse updateUsername(Long userId, String newUsername);
}
