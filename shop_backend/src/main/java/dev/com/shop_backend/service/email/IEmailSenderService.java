package dev.com.shop_backend.service.email;

import jakarta.mail.MessagingException;
import org.springframework.stereotype.Repository;

@Repository
public interface IEmailSenderService {
    void sendVerificationToken(String toEmail,String token);
}
