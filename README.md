
# Hướng Dẫn Cấu Hình Môi Trường cho Dự Án

Để chạy dự án này trên môi trường của bạn, bạn cần phải thiết lập các biến môi trường cần thiết. Hãy làm theo các bước dưới đây để cấu hình dự án đúng cách.

📁 Bước 1: **Tạo file `.env`**

1. Sao chép file mẫu `.env.example` thành `.env` trong thư mục gốc của dự án (Electronic-store) 
và thêm các thông tin cấu hình của bạn vào nhé.

Hoặc có thể chạy câu lệnh với terminal ở thư mục gốc (Electronic-store) 
   ```bash
  cp .env.example .env  
   ```

2.Tiếp theo đến thư mục ./shop_back_end/src/main/java/dev/com/shop_backend/security/config/VNPAYConfig.java 
Bạn thêm các cấu hình thông tin VNPay của bạn
public static final String vnp_PayUrl =   (vnp_PayUrl);
public static final String vnp_TmnCode = (vnp_TmnCode);
public static final String vnp_HashSecret = (vnp_HashSecret);


🐳 Bước 2: **Cài đặt Docker và Docker Compose**

Đây là bước chuẩn bị, yêu cầu bạn cài đặt Docker và Docker Compose nếu chưa có.
Bạn có thể tham khảo hướng dẫn cài đặt trên trang chính thức của Docker:

https://docs.docker.com/get-started/get-docker/ (Cài đặt Docker)

https://docs.docker.com/compose/install/ (Cài đặt Docker Compose)

🚀 Bước 3: **Chạy Docker Compose**

Chạy lệnh `docker-compose up --build` trong thư mục gốc của dự án (Electronic-store) để khởi động toàn bộ dự án, 
bao gồm Frontend, Backend và Database.


✅ Bước 4: **Kiểm tra kết quả**

Sau khi chạy Docker Compose, bạn có thể truy cập frontend (http://localhost:3000) và backend (http://localhost:8080).



🛑 Bước 5: **Dừng các container**

Dừng các container khi bạn không cần thiết nữa bằng lệnh `docker-compose down`.
