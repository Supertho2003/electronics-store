package dev.com.shop_backend.repository;

import dev.com.shop_backend.enums.RoleEnum;
import dev.com.shop_backend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role,Long> {
    Optional<Role> findByName(RoleEnum role);
}
