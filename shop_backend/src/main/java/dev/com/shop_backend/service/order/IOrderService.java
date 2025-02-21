package dev.com.shop_backend.service.order;

import dev.com.shop_backend.dto.request.AddAddressRequest;
import dev.com.shop_backend.dto.response.OrderResponse;
import dev.com.shop_backend.enums.DeliveryMethod;
import dev.com.shop_backend.enums.OrderStatus;
import dev.com.shop_backend.enums.PaymentMethod;
import dev.com.shop_backend.model.Address;
import dev.com.shop_backend.model.Order;

import java.util.List;

public interface IOrderService {
    OrderResponse placeOrder(Long userId, AddAddressRequest addressRequest, String note, Long discountAmount, DeliveryMethod deliveryMethod, PaymentMethod paymentMethod);
    OrderResponse getOrder(Long orderId);
    OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus);
    List<OrderResponse> getUserOrders(Long userId);
    List<OrderResponse> getAllOrders();
    void deleteOrder(Long orderId);
    long getTotalOrders();
    long getTotalSales();
    long getTotalItemsSold();
    List<OrderResponse> getOrdersByStatus(OrderStatus status);
    List<OrderResponse> getUserOrdersByStatus(Long userId, OrderStatus status);
}
