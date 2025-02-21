package dev.com.shop_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@NoArgsConstructor
@Entity
public class Color {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String name; // Tên màu (Đỏ, Xanh dương, Vàng, v.v.)

    // Constructor thêm để tạo Color từ ID, mã màu và tên màu
    public Color(Long id, String name, String code) {
        this.id = id;
        this.name = name;
        this.code = code;
    }
}
