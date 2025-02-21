package dev.com.shop_backend.controller;

import dev.com.shop_backend.dto.request.LoginRequest;
import dev.com.shop_backend.dto.response.ApiResponse;
import dev.com.shop_backend.dto.response.JwtResponse;
import dev.com.shop_backend.model.RefreshToken;
import dev.com.shop_backend.model.User;
import dev.com.shop_backend.repository.RefreshTokenRepository;
import dev.com.shop_backend.security.jwt.JwtUtils;
import dev.com.shop_backend.security.user.ShopUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final RefreshTokenRepository refreshTokenRepository;
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(
                            request.getEmail(), request.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String accessToken = jwtUtils.generateTokenForUser(authentication);
            ShopUserDetails userDetails = (ShopUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser();

            if (!user.isVerified()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiResponse("Tài khoản chưa được kích hoạt vui lòng vào email kiểm tra!!!", null));
            }
            if (!user.isActive()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiResponse("Tài khoản đã bị khóa!!!", null));
            }
            String refreshToken = jwtUtils.generateRefreshToken(authentication);

            RefreshToken newRefreshToken = new RefreshToken();
            newRefreshToken.setToken(refreshToken);
            newRefreshToken.setCreatedAt(LocalDateTime.now());
            newRefreshToken.setExpiresAt(LocalDateTime.now().plusDays(30));
            newRefreshToken.setUser(((ShopUserDetails) authentication.getPrincipal()).getUser());
            refreshTokenRepository.save(newRefreshToken);
            JwtResponse jwtResponse = new JwtResponse(userDetails.getId(), accessToken,refreshToken);
            return ResponseEntity.ok(new ApiResponse("Đăng nhập thành công", jwtResponse));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse("Tài khoản hoặc mật khẩu không chính xác", null));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse> refresh(@RequestBody Map<String, String> request) {

        String refreshToken = request.get("refreshToken");
        System.out.println("refreshToKENNNNNN " + refreshToken);
        Optional<RefreshToken> token = refreshTokenRepository.findByToken(refreshToken);
        if (token.isPresent() && !token.get().isRevoked() && token.get().getExpiresAt().isAfter(LocalDateTime.now())) {
            User user = token.get().getUser ();
            ShopUserDetails userDetails = ShopUserDetails.buildUserDetails(user);
            Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

            String newAccessToken = jwtUtils.generateTokenForUser (authentication);
            String newRefreshToken = jwtUtils.generateRefreshToken(authentication);

            RefreshToken newRefreshTokenEntity = new RefreshToken();
            newRefreshTokenEntity.setToken(newRefreshToken);
            newRefreshTokenEntity.setCreatedAt(LocalDateTime.now());
            newRefreshTokenEntity.setExpiresAt(LocalDateTime.now().plusDays(7));
            newRefreshTokenEntity.setUser (user);
            refreshTokenRepository.save(newRefreshTokenEntity);

            return ResponseEntity.ok(new ApiResponse("Refresh token successful", new JwtResponse(userDetails.getId(), newAccessToken, newRefreshToken)));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse("Refresh token is invalid or has expired!", null));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        Optional<RefreshToken> token = refreshTokenRepository.findByToken(refreshToken);
        if (token.isPresent()) {
            token.get().setRevoked(true);
            refreshTokenRepository.save(token.get());
            return ResponseEntity.ok(new ApiResponse("Đăng xuất thành công", null));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse("Refresh token không hợp lệ!", null));
    }
}

