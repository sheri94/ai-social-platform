package com.demo.ai_socials.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"user"})
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 5000)
    private String content;

    private String aiQuestion;  // Вопрос ИИ

    private LocalDate postDate;

    private LocalDateTime createdAt;

    // Для хранения путей к фото (JSON строка)
    @Column(length = 2000)
    private String photoPaths;  // Хранит JSON массив путей к фото

    // Для хранения путей к видео
    @Column(length = 2000)
    private String videoPaths;  // Хранит JSON массив путей к видео

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (postDate == null) {
            postDate = LocalDate.now();
        }
    }
}