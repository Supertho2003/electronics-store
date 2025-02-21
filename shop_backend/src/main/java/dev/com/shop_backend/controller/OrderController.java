package dev.com.shop_backend.controller;

import dev.com.shop_backend.dto.request.AddAddressRequest;
import dev.com.shop_backend.dto.response.ApiResponse;
import dev.com.shop_backend.dto.response.OrderResponse;
import dev.com.shop_backend.enums.DeliveryMethod;
import dev.com.shop_backend.enums.OrderStatus;
import dev.com.shop_backend.enums.PaymentMethod;
import dev.com.shop_backend.exceptions.ResourceNotFoundException;
import dev.com.shop_backend.mapper.AddressMapper;
import dev.com.shop_backend.model.Address;
import dev.com.shop_backend.model.Cart;
import dev.com.shop_backend.model.User;
import dev.com.shop_backend.service.cart.ICartService;
import dev.com.shop_backend.service.order.IOrderService;
import dev.com.shop_backend.service.user.IUserService;
import dev.com.shop_backend.service.vnpay.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/orders")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {
    IOrderService orderService;
    IUserService userService;
    VNPayService vnPayService;
    ICartService cartService;
    HttpSession httpSession;

    @PostMapping("/place")
    public ResponseEntity<ApiResponse> placeOrder(
            @Valid @RequestBody AddAddressRequest addressRequest,
            @RequestParam String note,
            @RequestParam PaymentMethod paymentMethod,
            @RequestParam DeliveryMethod deliveryMethod,
            @RequestParam Long totalPayable,
            @RequestParam(required = false, defaultValue = "0") Long discountAmount) {
        try {
            User user = userService.getAuthenticatedUser();
            Cart cart = cartService.getCartByUserId(user.getId());

            if (paymentMethod == PaymentMethod.VNPAY) {
                int totalAmountInt = totalPayable.intValue();

                String returnUrl = "http://localhost:8080/api/v1/orders/vnpay-payment?" +
                        "userId=" + user.getId() +
                        "&userName=" + addressRequest.getUserName() +
                        "&streetAddress=" + addressRequest.getStreetAddress() +
                        "&province=" + addressRequest.getProvince() +
                        "&district=" + addressRequest.getDistrict() +
                        "&ward=" + addressRequest.getWard() +
                        "&mobile=" + addressRequest.getMobile() +
                        "&note=" + (note != null ? note : "Không có ghi chú") +
                        "&discountAmount=" + discountAmount +
                        "&deliveryMethod=" + deliveryMethod.toString() +
                        "&paymentMethod=" + paymentMethod.toString();


                String paymentUrl = vnPayService.createOrder(totalAmountInt, "Thanh toán đơn hàng", returnUrl);
                return ResponseEntity.ok(new ApiResponse("Chuyển hướng đến thanh toán!", paymentUrl));
            } else {
                OrderResponse orderResponse = orderService.placeOrder(user.getId(), addressRequest, note, discountAmount,
                        deliveryMethod, paymentMethod);
                return ResponseEntity.ok(new ApiResponse("Đặt hàng thành công!", orderResponse));
            }
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/vnpay-payment")
    public ResponseEntity<ApiResponse> vnpayReturn(
            HttpServletRequest request,
            @RequestParam Long userId,
            @RequestParam String userName,
            @RequestParam String streetAddress,
            @RequestParam String province,
            @RequestParam String district,
            @RequestParam String ward,
            @RequestParam String mobile,
            @RequestParam String note,
            @RequestParam Long discountAmount,
            @RequestParam DeliveryMethod deliveryMethod,
            @RequestParam PaymentMethod paymentMethod) {

        String transactionStatus = request.getParameter("vnp_TransactionStatus");
        String transactionNo = request.getParameter("vnp_TransactionNo");

        if ("00".equals(transactionStatus)) {
            AddAddressRequest addressRequest = new AddAddressRequest();
            addressRequest.setUserName(userName);
            addressRequest.setStreetAddress(streetAddress);
            addressRequest.setProvince(province);
            addressRequest.setDistrict(district);
            addressRequest.setWard(ward);
            addressRequest.setMobile(mobile);

            OrderResponse orderResponse = orderService.placeOrder(userId, addressRequest, note, discountAmount, deliveryMethod, paymentMethod);
            String redirectUrl = "http://localhost:3000/dat-hang/thanh-cong";
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(redirectUrl)).build();
        } else {
            String redirectUrl = "http://localhost:3000/dat-hang/that-bai";
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(redirectUrl)).build();
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse> getOrdersByStatus(@PathVariable OrderStatus status) {
        try {
            List<OrderResponse> orders = orderService.getOrdersByStatus(status);
            return ResponseEntity.ok(new ApiResponse("Đơn hàng đã được lấy thành công!", orders));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/user/status/{status}")
    public ResponseEntity<ApiResponse> getUserOrdersByStatus(@PathVariable OrderStatus status) {
        try {
            User user = userService.getAuthenticatedUser();
            return ResponseEntity.ok(new ApiResponse("Đã lấy được đơn hàng của người dùng thành công!", orderService.getUserOrdersByStatus(user.getId(), status)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PutMapping("/{orderId}/update-status")
    public ResponseEntity<ApiResponse> updateOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus newStatus) {
        try {
            OrderResponse orderResponse = orderService.updateOrderStatus(orderId, newStatus);
            return ResponseEntity.ok(new ApiResponse("Cập nhập trạng thái thành công!", orderResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/{orderId}/order")
    public ResponseEntity<ApiResponse> getOrder(@PathVariable Long orderId) {
        try {
            OrderResponse orderResponse = orderService.getOrder(orderId);
            return ResponseEntity.ok(new ApiResponse("Đơn hàng được tìm thấy!", orderResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getUserOrders() {
        try {
            User user = userService.getAuthenticatedUser();
            return ResponseEntity.ok(new ApiResponse("Đã lấy được đơn hàng của người dùng thành công!", orderService.getUserOrders(user.getId())));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllOrders() {
        try {
            return ResponseEntity.ok(new ApiResponse("Tất cả các đơn hàng đã được lấy thành công!", orderService.getAllOrders()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }


    @DeleteMapping("/order/{orderId}/delete")
    public ResponseEntity<ApiResponse> deleteOrder(@PathVariable Long orderId) {
        try {
            orderService.deleteOrder(orderId);
            return ResponseEntity.ok(new ApiResponse("Xóa đơn hàng thành công!", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/total-orders")
    public ResponseEntity<ApiResponse> getTotalOrders() {
        long totalOrders = orderService.getTotalOrders();
        return ResponseEntity.ok(new ApiResponse("Tổng số đơn hàng đã được lấy thành công!", totalOrders));
    }

    @GetMapping("/total-sales")
    public ResponseEntity<ApiResponse> getTotalSales() {
        long totalSales = orderService.getTotalSales();
        return ResponseEntity.ok(new ApiResponse("Tổng doanh số đã được lấy thành công!", totalSales));
    }

    @GetMapping("/total-items-sold")
    public ResponseEntity<ApiResponse> getTotalItemsSold() {
        long totalItemsSold = orderService.getTotalItemsSold();
        return ResponseEntity.ok(new ApiResponse("Tổng số mặt hàng đã bán đã được lấy thành công!", totalItemsSold));
    }
}
