package dev.com.shop_backend.repository;

import dev.com.shop_backend.model.Product;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

public interface ProductRepository  extends PagingAndSortingRepository<Product,Long>, CrudRepository<Product,Long> {
    boolean existsByNameAndBrand(String name,String brand);
    List<Product> findByCategoryName(String category);
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', ?1, '%'))")
    List<Product> findByName(String name);
    List<Product> findByBrand(String brand);
    List<Product> findByCategoryNameAndBrand(String category, String brand);
    List<Product> findByCategoryNameAndPriceBetween(String category, Long minPrice, Long maxPrice);
}
