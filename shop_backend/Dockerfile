# Sử dụng image Maven có sẵn từ Docker Hub
FROM maven:3.9.8-eclipse-temurin-21 AS build

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy tất cả file từ máy chủ vào container
COPY . .

# Chạy lệnh để build ứng dụng
RUN mvn clean package -DskipTests

# Sử dụng image openjdk để chạy ứng dụng đã build
FROM openjdk:21

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy file JAR đã build từ bước trước vào container
COPY --from=build /app/target/electronics-store.jar app.jar

# Mở cổng 8080 cho ứng dụng
EXPOSE 8080

# Chạy ứng dụng Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
