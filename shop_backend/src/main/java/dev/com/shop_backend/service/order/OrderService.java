package dev.com.shop_backend.service.order;


import com.amazonaws.services.kms.model.NotFoundException;
import dev.com.shop_backend.dto.request.AddAddressRequest;
import dev.com.shop_backend.dto.response.OrderResponse;
import dev.com.shop_backend.enums.DeliveryMethod;
import dev.com.shop_backend.enums.OrderStatus;
import dev.com.shop_backend.enums.PaymentMethod;
import dev.com.shop_backend.exceptions.ResourceNotFoundException;
import dev.com.shop_backend.mapper.AddressMapper;
import dev.com.shop_backend.mapper.OrderMapper;
import dev.com.shop_backend.model.*;
import dev.com.shop_backend.repository.AddressRepository;
import dev.com.shop_backend.repository.OrderRepository;
import dev.com.shop_backend.repository.ProductRepository;
import dev.com.shop_backend.repository.UserRepository;
import dev.com.shop_backend.service.cart.CartService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class OrderService implements IOrderService{
    OrderRepository orderRepository;
    ProductRepository productRepository;
    AddressRepository addressRepository;
    UserRepository userRepository;
    CartService cartService;
    AddressMapper addressMapper;
    OrderMapper orderMapper;

    @Transactional
    @Override
    public OrderResponse placeOrder(Long userId, AddAddressRequest addressRequest, String note, Long discountAmount,DeliveryMethod deliveryMethod, PaymentMethod paymentMethod) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng!"));
        Address address = addressMapper.toAddress(addressRequest);
        address.setUser (user);

        List<Address> existingAddresses = addressRepository.findByUserNameAndStreetAddressAndProvinceAndDistrictAndWardAndMobile(
                address.getUserName(),
                address.getStreetAddress(),
                address.getProvince(),
                address.getDistrict(),
                address.getWard(),
                address.getMobile()
        );

        if (!existingAddresses.isEmpty()) {
            address = existingAddresses.get(0);
        } else {
            address = addressRepository.save(address);
        }

        Cart cart = cartService.getCartByUserId(userId);
        Order order = createOrder(cart);
        order.setAddress(address);
        order.setNote(note);
        order.setDeliveryMethod(deliveryMethod);
        order.setPaymentMethod(paymentMethod);
        List<OrderItem> orderItemList = createOrderItems(order, cart);
        order.setOrderItems(new HashSet<>(orderItemList));

        Long totalAmount = calculateTotalAmount(orderItemList);
        order.setDiscountAmount(discountAmount);
        order.setTotalAmount(totalAmount - discountAmount);
        order.setSubtotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);
        cartService.clearCart(cart.getId());
        return orderMapper.toOrderResponse(savedOrder);
    }
    private Order createOrder(Cart cart) {
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setOrderStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDate.now());
        return order;
    }

    @Override
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không có đơn hàng nào đã đặt!"));
        order.setOrderStatus(newStatus);
        orderRepository.save(order);
        return orderMapper.toOrderResponse(order);
    }

    @Override
    public List<OrderResponse> getOrdersByStatus(OrderStatus status) {
        List<Order> orders = orderRepository.findByOrderStatus(status);
        return orders.stream().map(orderMapper::toOrderResponse).collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getUserOrdersByStatus(Long userId, OrderStatus status) {
        List<Order> orders = orderRepository.findByUserIdAndOrderStatus(userId, status);
        return orders.stream().map(orderMapper::toOrderResponse).collect(Collectors.toList());
    }

    private List<OrderItem> createOrderItems(Order order, Cart cart) {
        return cart.getItems().stream().map(cartItem -> {
            Product product = cartItem.getProduct();
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
            return new OrderItem(
                    order,
                    product,
                    cartItem.getQuantity(),
                    cartItem.getUnitPrice());
        }).collect(Collectors.toList());
    }

    private Long calculateTotalAmount(List<OrderItem> orderItemList) {
        return orderItemList.stream()
                .map(item -> {
                    Long price = item.getPrice();
                    if (price == null) {
                        return 0L;
                    }
                    return price * item.getQuantity();
                })
                .reduce(0L, Long::sum);
    }

    @Override
    public OrderResponse getOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .map(orderMapper::toOrderResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));
    }

    @Override
    public List<OrderResponse> getUserOrders(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream().map(orderMapper::toOrderResponse).collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(orderMapper::toOrderResponse).collect(Collectors.toList());
    }

    @Override
    public void deleteOrder(Long orderId) {
        Optional<Order> order = orderRepository.findById(orderId);
        if (order.isPresent()) {
            orderRepository.delete(order.get());
        } else {
            throw new NotFoundException("Đơn hàng không tồn tại");
        }
    }

    @Override
    public long getTotalOrders() {
        return orderRepository.count();
    }

    @Override
    public long getTotalSales() {
        return orderRepository.findAll().stream()
                .mapToLong(Order::getTotalAmount)
                .sum();
    }

    @Override
    public long getTotalItemsSold() {
        return orderRepository.findAll().stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.SHIPPED || order.getOrderStatus() == OrderStatus.DELIVERED)
                .flatMap(order -> order.getOrderItems().stream())
                .mapToInt(OrderItem::getQuantity)
                .sum();
    }
}
