package dev.com.shop_backend.service.user;

import dev.com.shop_backend.dto.request.AddAddressRequest;
import dev.com.shop_backend.dto.request.AddUserRequest;
import dev.com.shop_backend.dto.request.UpdateUserRequest;
import dev.com.shop_backend.dto.response.AddressResponse;
import dev.com.shop_backend.dto.response.UserResponse;
import dev.com.shop_backend.enums.RoleEnum;
import dev.com.shop_backend.exceptions.AlreadyExistsException;
import dev.com.shop_backend.exceptions.ResourceNotFoundException;
import dev.com.shop_backend.mapper.AddressMapper;
import dev.com.shop_backend.mapper.UserMapper;
import dev.com.shop_backend.model.Address;
import dev.com.shop_backend.model.Role;
import dev.com.shop_backend.model.User;
import dev.com.shop_backend.model.Verification;
import dev.com.shop_backend.repository.AddressRepository;
import dev.com.shop_backend.repository.RoleRepository;
import dev.com.shop_backend.repository.UserRepository;
import dev.com.shop_backend.repository.VerificationRepository;
import dev.com.shop_backend.service.email.IEmailSenderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class UserService implements IUserService{
    UserRepository userRepository;
    AddressRepository addressRepository;
    AddressMapper addressMapper;
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;
    IEmailSenderService emailSenderService;
    VerificationRepository verificationRepository;
    UserMapper userMapper;
    @Override
    public UserResponse createUser(AddUserRequest request) {
        return Optional.of(request)
                .filter(user -> !userRepository.existsByEmail(request.getEmail()))
                .map(req -> {
                    User user = userMapper.toUser(req);
                    Role role = roleRepository.findByName(RoleEnum.USER)
                            .orElseThrow(() -> new RuntimeException("Role USER không tồn tại"));
                    user.setPassword(passwordEncoder.encode(req.getPassword()));
                    user.setCreatedAt(LocalDateTime.now());
                    user.getRoles().add(role);
                    userRepository.save(user);
                    // Tạo token và tạo verification
                    String token = UUID.randomUUID().toString();
                    Verification verification = new Verification();
                    verification.setToken(token);
                    verification.setUser(user);
                    verification.setExpiredAt(LocalDateTime.now().plusHours(24));
                    verificationRepository.save(verification);
                    emailSenderService.sendVerificationToken(user.getEmail(), token);
                    return userMapper.toUserResponse(user);
                })
                .orElseThrow(() -> new AlreadyExistsException("Tài khoản " + request.getEmail() + " đã tồn tại!"));
    }

    @Override
    public UserResponse updateUser(UpdateUserRequest request, Long userId) {
        return  userRepository.findById(userId).map(existingUser ->{
            existingUser.setUsername(request.getUserName());
            User updatedUser = userRepository.save(existingUser);
            return userMapper.toUserResponse(updatedUser);
        }).orElseThrow(() -> new ResourceNotFoundException("Tài khoản không tồn tại!"));
    }

    @Override
    public User getUserByEmailAndPassword(String email, String password) {
        return (User) userRepository.findByEmailAndPassword(email, password)
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản không tồn tại"));
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng " + id + "không tồn tại!"));
        return userMapper.toUserResponse(user);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Người dùng  " + id + " không tồn tại!");
        }
        userRepository.deleteById(id);
    }

    @Override
    public String verifyUser(String token) {
        Optional<Verification> verificationOpt = verificationRepository.findByToken(token);
        if (verificationOpt.isEmpty()) {
            return "Mã xác minh không hợp lệ!";
        }
        Verification verification = verificationOpt.get();
        User user = verification.getUser();

        if (verification.getExpiredAt().isBefore(LocalDateTime.now())) {
            return "Mã xác minh đã hết hạn!";
        }
        user.setVerified(true);
        userRepository.save(user);
        verificationRepository.delete(verification);
        return "Người dùng đã xác minh thành công!";
    }

    @Override
    public List<AddressResponse> getUserAddresses(Long userId) {
        List<Address> addresses = addressRepository.findByUserId(userId);
        return addresses.stream()
                .map(addressMapper::toAddressResponse)
                .collect(Collectors.toList());
    }

    public User getAuthenticatedUser() {
        Authentication authentication  = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại!"));
    }

    @Override
    public boolean toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        user.setActive(!user.isActive());
        userRepository.save(user);
        return user.isActive();
    }

    @Override
    public UserResponse updateUsername(Long userId, String newUserName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại!"));

        if (userRepository.existsByUsername(newUserName)){
            throw new AlreadyExistsException("Tên người dùng đã tồn tại!");
        }
        user.setUsername(newUserName);
        User updatedUser  = userRepository.save(user);
        return userMapper.toUserResponse(updatedUser );
    }

    @Override
    public UserResponse addRoleToUser(Long userId, RoleEnum roleEnum) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
        user.getRoles().clear();
        Role role = roleRepository.findByName(roleEnum)
                .orElseThrow(() -> new RuntimeException("Role không hợp lệ"));
        user.getRoles().add(role);
        userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    @Override
    public AddressResponse addAddress(Long userId, AddAddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User  not found"));
        Address address = addressMapper.toAddress(request);
        address.setUser (user);
        Address savedAddress = addressRepository.save(address);
        return addressMapper.toAddressResponse(savedAddress);
    }

    @Override
    public AddressResponse getAddressById(Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy địa chỉ"));
        return addressMapper.toAddressResponse(address);
    }

    @Override
    public void deleteAddress(Long addressId) {
        if (!addressRepository.existsById(addressId)) {
            throw new ResourceNotFoundException("Địa chỉ không tồn tại !");
        }
        addressRepository.deleteById(addressId);
    }

    @Override
    public AddressResponse updateAddress(Long addressId, AddAddressRequest request) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Địa chỉ không tồn tại !"));
        Address updatedAddress = addressMapper.toAddress(request);
        address.setUserName(updatedAddress.getUserName());
        address.setStreetAddress(updatedAddress.getStreetAddress());
        address.setProvince(updatedAddress.getProvince());
        address.setDistrict(updatedAddress.getDistrict());
        address.setWard(updatedAddress.getWard());
        address.setMobile(updatedAddress.getMobile());
        Address savedAddress = addressRepository.save(address);
        return addressMapper.toAddressResponse(savedAddress);
    }

    @Override
    public long countUsers() {
        return userRepository.count();
    }
}
