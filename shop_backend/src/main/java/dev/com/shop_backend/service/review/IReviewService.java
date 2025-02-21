package dev.com.shop_backend.service.review;

import dev.com.shop_backend.dto.request.ReviewRequest;
import dev.com.shop_backend.dto.response.ReviewResponse;

import java.util.List;

public interface IReviewService {
    ReviewResponse addReview(ReviewRequest review);
    void updateProductRating(Long productId);
    ReviewResponse getReviewById(Long reviewId);
    List<ReviewResponse> getReviewsProduct(Long productId);
    void deleteReview(Long reviewId);
    ReviewResponse updateReview(Long reviewId, ReviewRequest reviewRequest);
    long getReviewCountByProductId(Long productId);
    List<ReviewResponse> getAllReviews();
    void hideReview(Long reviewId);
    void unhideReview(Long reviewId);
    List<ReviewResponse> getVisibleReviewsByProduct(Long productId);
}
