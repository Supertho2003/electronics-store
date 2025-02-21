package dev.com.shop_backend.repository;

import dev.com.shop_backend.model.Verification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationRepository extends JpaRepository<Verification,Long> {
    Optional<Verification> findByToken(String token);
}
