package dev.com.shop_backend.service.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailSenderService implements IEmailSenderService {

    JavaMailSender mailSender;

    @Override
    public void sendVerificationToken(String toEmail, String token) {
        String subject = "Xác thực tài khoản của bạn";
        String verificationUrl = "http://localhost:8080/api/v1/users/verify?token=" + token;

        // Tạo nội dung email HTML
        String body = "<div style='font-family: Arial, sans-serif; font-size: 14px;'>" +
                "<h2 style='color: #2D89EF;'>Xác thực tài khoản</h2>" +
                "<p>Chào bạn,</p>" +
                "<p>Vui lòng nhấp vào nút bên dưới để xác thực tài khoản của bạn:</p>" +
                "<a href='" + verificationUrl + "' " +
                "style='display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: white; background-color: #28a745; text-decoration: none; border-radius: 5px;'>Xác thực ngay</a>" +
                "<p>Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.</p>" +
                "</div>";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi gửi email xác thực!");
        }
    }
}
