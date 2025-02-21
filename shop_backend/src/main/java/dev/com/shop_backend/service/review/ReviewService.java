package dev.com.shop_backend.service.review;

import dev.com.shop_backend.dto.request.ReviewRequest;
import dev.com.shop_backend.dto.response.ReviewResponse;
import dev.com.shop_backend.mapper.ReviewMapper;
import dev.com.shop_backend.model.Product;
import dev.com.shop_backend.model.Review;
import dev.com.shop_backend.repository.ProductRepository;
import dev.com.shop_backend.repository.ReviewRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ReviewService implements IReviewService{
    ReviewRepository reviewRepository;
    ReviewMapper reviewMapper;
    ProductRepository productRepository;

    @Override
    public ReviewResponse addReview(ReviewRequest review) {
        Review review1 = reviewMapper.toReview(review);
        Review savedReview = reviewRepository.save(review1);
        savedReview.setDateCreated(LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")));
        updateProductRating(review.getProductId());
        return reviewMapper.toReviewResponse(savedReview);
    }

    @Override
    public ReviewResponse getReviewById(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found")); // Nếu không tìm thấy, ném ngoại lệ
        return reviewMapper.toReviewResponse(review); // Chuyển đổi sang DTO và trả về
    }

    @Override
    public List<ReviewResponse> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll(); // Fetch all reviews from the repository
        return reviews.stream()
                .map(reviewMapper::toReviewResponse) // Convert each Review to ReviewResponse
                .collect(Collectors.toList());
    }

    @Override
    public ReviewResponse updateReview(Long reviewId, ReviewRequest reviewRequest) {
        // Tìm review hiện tại
        Review existingReview = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // Cập nhật thông tin từ reviewRequest
        existingReview.setComment(reviewRequest.getComment());
        existingReview.setRating(reviewRequest.getRating());
        existingReview.setDateCreated(LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")));

        // Lưu review đã cập nhật
        Review updatedReview = reviewRepository.save(existingReview);

        // Cập nhật lại rating cho sản phẩm liên quan
        updateProductRating(existingReview.getProduct().getId());

        // Trả về DTO của review đã cập nhật
        return reviewMapper.toReviewResponse(updatedReview);
    }

    @Override
    public void updateProductRating(Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        double averageRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Hotel not found"));
        product.setRating(averageRating);
        productRepository.save(product);
    }

    @Override
    public List<ReviewResponse> getReviewsProduct(Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        return reviews.stream()
                .map(reviewMapper::toReviewResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        Long productId = review.getProduct().getId();

        reviewRepository.delete(review);

        updateProductRating(productId);
    }

    @Override
    public List<ReviewResponse> getVisibleReviewsByProduct(Long productId) {
        List<Review> reviews = reviewRepository.findByProductIdAndHiddenFalse(productId);
        return reviews.stream()
                .map(reviewMapper::toReviewResponse)
                .collect(Collectors.toList());
    }


    @Override
    public void hideReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setHidden(true);
        reviewRepository.save(review);
    }

    @Override
    public void unhideReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setHidden(false);
        reviewRepository.save(review);
    }

    @Override
    public long getReviewCountByProductId(Long productId) {
        return reviewRepository.countByProductId(productId); // Sử dụng phương thức đếm từ ReviewRepository
    }
}
