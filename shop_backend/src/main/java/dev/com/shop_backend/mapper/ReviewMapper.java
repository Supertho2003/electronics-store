package dev.com.shop_backend.mapper;

import dev.com.shop_backend.dto.request.ReviewRequest;
import dev.com.shop_backend.dto.response.ReviewResponse;
import dev.com.shop_backend.model.Review;
import dev.com.shop_backend.model.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {UserMapper.class, ProductMapper.class})
public interface ReviewMapper {
    @Mapping(source = "productId", target = "product.id")
    @Mapping(source = "userId", target = "user.id")  // Sửa "userId" thành "id" nếu thuộc tính trong User là "id"
    @Mapping(source = "rating", target = "rating")
    @Mapping(source = "comment", target = "comment")
    Review toReview(ReviewRequest request);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "name")
    @Mapping(source = "user", target = "user")  // Ánh xạ trực tiếp đối tượng user
    @Mapping(source = "rating", target = "rating")
    @Mapping(source = "comment", target = "comment")
    @Mapping(source = "dateCreated", target = "dateCreated")
    ReviewResponse toReviewResponse(Review review);


}
