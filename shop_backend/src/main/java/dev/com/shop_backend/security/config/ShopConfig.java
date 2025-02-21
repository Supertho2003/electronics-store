package dev.com.shop_backend.security.config;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import dev.com.shop_backend.security.jwt.AuthTokenFilter;
import dev.com.shop_backend.security.jwt.JwtAuthEntryPoint;
import dev.com.shop_backend.security.user.ShopUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.filter.HiddenHttpMethodFilter;

import java.util.List;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class ShopConfig {
    private final ShopUserDetailsService userDetailsService;
    private final JwtAuthEntryPoint authEntryPoint;

    @Value("${aws.access.key.id}")
    private String accessKey;

    @Value("${aws.secret.access.key}")
    private String secretKey;

    @Value("${aws.s3.region}")
    private String region;

    private static final String BASE_URL = "/api/v1";

    public static final List<String> ADMIN_MANAGER_URLS = List.of(
            // URLs cho ColorController
            BASE_URL + "/colors//add",
            BASE_URL + "/colors//color/{colorId}/update",
            BASE_URL + "/colors//color/{colorId}/delete",
            BASE_URL + "/{colorId}/color",

            // URLs cho CategoryController
            BASE_URL + "/categories/add",
            BASE_URL + "/categories/category/{categoryId}/update",
            BASE_URL + "/categories/category/{categoryId}/delete",

            // URLs cho CouponController
            BASE_URL + "/coupons/add",
            BASE_URL + "/coupons/{id}/active",
            BASE_URL + "/coupons/{id}/update",
            BASE_URL + "/coupons/{id}/delete",

            // URLs cho ProductController
            BASE_URL + "/products/add",
            BASE_URL + "/products/product/{productId}/update",
            BASE_URL + "/products/product/{productId}/delete",

            // URLs cho ReviewController
            BASE_URL + "/reviews/review/{reviewId}/delete",
            BASE_URL + "/reviews/review/{reviewId}/hide",
            BASE_URL + "/reviews/review/{reviewId}/unhide",

            // URLs cho OrderController
            BASE_URL + "/orders/{orderId}/update-status",
            BASE_URL + "/orders/user/{userId}",
            BASE_URL + "/orders/all",
            BASE_URL + "/orders/order/{orderId}/delete",
            BASE_URL + "/orders/total-orders",
            BASE_URL + "/orders/total-sales",
            BASE_URL + "/orders/total-items-sold",
            // URLs cho AttributeController
            BASE_URL + "/attributes/{attributeId}/attribute",
            BASE_URL + "/attributes/add",
            BASE_URL + "/attributes/attribute/{attributeId}/update",
            BASE_URL + "/attributes/attribute/{attributeId}/delete"

    );

    // URLs chỉ dành cho ADMIN
    public static final List<String> ADMIN_ONLY_URLS = List.of(
            BASE_URL + "/users/user/{userId}/toggle-active",
            BASE_URL + "/users/user/{userId}/add-role",
            BASE_URL + "/users/user/{userId}/delete"
    );


    public static final List<String> USER_ONLY_URLS = List.of(
            BASE_URL + "/cartItems/item/add",
            BASE_URL + "/cartItems/cart/item/{itemId}/remove",
            BASE_URL + "/cartItems/cart/item/{itemId}/update",
            BASE_URL + "/orders/place",
            BASE_URL + "/orders/user/{userId}",
            BASE_URL + "/orders/status/{status}",
            BASE_URL + "/addresses/users/addresses",
            BASE_URL + "/addresses/addresses/add",
            BASE_URL + "/addresses/addresses/{addressId}",
            BASE_URL + "/addresses/addresses/{addressId}",
            BASE_URL + "/addresses/addresses/{addressId}/update",
            BASE_URL + "/carts/my-cart"
            );


    @Bean
    public AmazonS3 s3Client(){
        AWSCredentials awsCredentials = new BasicAWSCredentials(accessKey,secretKey);
        return AmazonS3ClientBuilder
                .standard()
                .withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthTokenFilter authTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return  authConfig.getAuthenticationManager();

    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        var authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(exception -> exception.authenticationEntryPoint(authEntryPoint))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> {
                    // Các URL chỉ dành cho ADMIN
                    for (String url : ShopConfig.ADMIN_ONLY_URLS) {
                        auth.requestMatchers(url).hasAnyAuthority("ADMIN");
                    }
                    for (String url : ShopConfig.ADMIN_MANAGER_URLS) {
                        auth.requestMatchers(url).hasAnyAuthority("ADMIN", "MANAGER");
                    }
                    for (String url : ShopConfig.USER_ONLY_URLS) {
                        auth.requestMatchers(url).hasAnyAuthority("USER");
                    }
                    auth.requestMatchers(BASE_URL + "/orders/{orderId}/order").hasAnyAuthority("ADMIN", "MANAGER", "USER");
                    auth.anyRequest().permitAll();
                });;

        http.authenticationProvider(daoAuthenticationProvider());
        http.addFilterBefore(authTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of(HttpMethod.GET.name(), HttpMethod.POST.name(), HttpMethod.PUT.name(), HttpMethod.DELETE.name()));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public String someStringBean() {
        return "Some String Value";
    }

    @Bean
    public HiddenHttpMethodFilter hiddenHttpMethodFilter() {
        return new HiddenHttpMethodFilter();
    }
}
