package dev.com.shop_backend.repository;

import dev.com.shop_backend.enums.OrderStatus;
import dev.com.shop_backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order,Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findAll();

    List<Order> findByOrderStatus(OrderStatus status);

    List<Order> findByUserIdAndOrderStatus(Long userId, OrderStatus status);
}
