package dev.com.shop_backend.data;

import dev.com.shop_backend.enums.RoleEnum;
import dev.com.shop_backend.model.Role;
import dev.com.shop_backend.model.User;
import dev.com.shop_backend.repository.RoleRepository;
import dev.com.shop_backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Transactional
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class DataInitializer implements ApplicationListener<ApplicationReadyEvent> {
    RoleRepository roleRepository;
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {

        Arrays.stream(RoleEnum.values()).forEach(roleEnum -> {
            if (roleRepository.findByName(roleEnum).isEmpty()) {
                Role role = new Role();
                role.setName(roleEnum);
                roleRepository.save(role);
                System.out.println("Đã thêm vai trò: " + roleEnum);
            }
        });
        createDefaultUserIfNotExits();
        createDefaultManagerIfNotExits();
        createDefaultAdminIfNotExits();
        createDefaultUserIfNotExits1();
    }

    private void createDefaultUserIfNotExits(){
        String defaultEmail = "user2025@gmail.com";
        if (!userRepository.existsByEmail(defaultEmail)){
            Role role = roleRepository.findByName(RoleEnum.USER)
                    .orElseThrow(() -> new RuntimeException("Role USER không tồn tại"));
            User user = new User();
            user.setUsername("User");
            user.setVerified(true);
            user.setEmail(defaultEmail);
            user.setPassword(passwordEncoder.encode("user@2025"));
            user.getRoles().add(role);
            userRepository.save(user);
        }
    }

    private void createDefaultUserIfNotExits1(){
        String defaultEmail = "user1234@gmail.com";
        if (!userRepository.existsByEmail(defaultEmail)){
            Role role = roleRepository.findByName(RoleEnum.USER)
                    .orElseThrow(() -> new RuntimeException("Role USER không tồn tại"));
            User user = new User();
            user.setUsername("User1");
            user.setVerified(true);
            user.setEmail(defaultEmail);
            user.setPassword(passwordEncoder.encode("user@1234"));
            user.getRoles().add(role);
            userRepository.save(user);
        }
    }
    private void createDefaultAdminIfNotExits(){
        String defaultEmail = "admin2025@gmail.com";
        if (!userRepository.existsByEmail(defaultEmail)){
            Role role = roleRepository.findByName(RoleEnum.ADMIN)
                    .orElseThrow(() -> new RuntimeException("Role USER không tồn tại"));
            User user = new User();
            user.setUsername("ADMIN");
            user.setEmail(defaultEmail);
            user.setVerified(true);
            user.setPassword(passwordEncoder.encode("admin@2025"));
            user.getRoles().add(role);
            userRepository.save(user);
        }
    }

    private void createDefaultManagerIfNotExits(){
        String defaultEmail = "manager2025@gmail.com";
        if (!userRepository.existsByEmail(defaultEmail)){
            Role role = roleRepository.findByName(RoleEnum.MANAGER)
                    .orElseThrow(() -> new RuntimeException("Role USER không tồn tại"));
            User user = new User();
            user.setUsername("MANAGER");
            user.setEmail(defaultEmail);
            user.setVerified(true);
            user.setPassword(passwordEncoder.encode("manager@2025"));
            user.getRoles().add(role);
            userRepository.save(user);
        }
    }
}
