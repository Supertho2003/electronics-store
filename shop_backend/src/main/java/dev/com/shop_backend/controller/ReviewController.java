package dev.com.shop_backend.controller;

import dev.com.shop_backend.dto.request.ReviewRequest;
import dev.com.shop_backend.dto.response.ApiResponse;
import dev.com.shop_backend.dto.response.ReviewResponse;
import dev.com.shop_backend.exceptions.ResourceNotFoundException;
import dev.com.shop_backend.service.review.IReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/reviews")
public class ReviewController {
    private final IReviewService reviewService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addReview(@Valid @RequestBody ReviewRequest reviewRequest) {
        try {
            ReviewResponse reviewResponse = reviewService.addReview(reviewRequest);
            return ResponseEntity.ok(new ApiResponse("Đánh giá thành công!", reviewResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }


    @GetMapping("/{reviewId}/review")
    public ResponseEntity<ApiResponse> getReviewById(@PathVariable Long reviewId) {
        try {
            ReviewResponse reviewResponse = reviewService.getReviewById(reviewId);
            return ResponseEntity.ok(new ApiResponse("Thành công!", reviewResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }


    @PutMapping("/review/{reviewId}/update")
    public ResponseEntity<ApiResponse> updateReview(@PathVariable Long reviewId,@Valid @RequestBody ReviewRequest reviewRequest) {
        try {
            ReviewResponse reviewResponse = reviewService.updateReview(reviewId, reviewRequest);
            return ResponseEntity.ok(new ApiResponse("Cập nhập đánh giá thành công!", reviewResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/review/{productId}/by-product")
    public ResponseEntity<ApiResponse> getReviewsByProduct(@PathVariable Long productId) {
        try {
            return ResponseEntity.ok(new ApiResponse("Lấy tất cả đánh giá thành công!", reviewService.getReviewsProduct(productId)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @DeleteMapping("review/{reviewId}/delete")
    public ResponseEntity<ApiResponse> deleteReview(@PathVariable Long reviewId) {
        try {
            reviewService.deleteReview(reviewId);
            return ResponseEntity.ok(new ApiResponse("Xóa đánh giá thành công!", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllReviews() {
        List<ReviewResponse> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(new ApiResponse("Fetched all reviews successfully!", reviews));
    }

    @GetMapping("/count/{productId}")
    public ResponseEntity<ApiResponse> getReviewCountByProductId(@PathVariable Long productId) {
        long reviewCount = reviewService.getReviewCountByProductId(productId);
        return ResponseEntity.ok(new ApiResponse("Review count fetched successfully!", reviewCount));
    }

    @GetMapping("/review/{productId}/visible")
    public ResponseEntity<ApiResponse> getVisibleReviewsByProduct(@PathVariable Long productId) {
        try {
            List<ReviewResponse> reviews = reviewService.getVisibleReviewsByProduct(productId);
            return ResponseEntity.ok(new ApiResponse("Lấy đánh giá hiển thị thành công!", reviews));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PutMapping("/review/{reviewId}/hide")
    public ResponseEntity<ApiResponse> hideReview(@PathVariable Long reviewId) {
        try {
            reviewService.hideReview(reviewId);
            return ResponseEntity.ok(new ApiResponse("Ẩn thành công!", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PutMapping("/review/{reviewId}/unhide")
    public ResponseEntity<ApiResponse> unhideReview(@PathVariable Long reviewId) {
        try {
            reviewService.unhideReview(reviewId);
            return ResponseEntity.ok(new ApiResponse("Hiển thị thành công!", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }


}
