package com.demo.ai_socials.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(onlyExplicitlyIncluded = true)  // Только явно указанные поля
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ToString.Include
    @EqualsAndHashCode.Include
    private Long id;

    @Column(unique = true, nullable = false)
    @ToString.Include
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    @ToString.Include
    private String fullName;

    @Column(length = 2000)
    private String interests;

    @Column(length = 2000)
    private String activity;

    @Column(length = 1000)
    private String bio;

    @Column(length = 500)
    private String profilePhoto;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    private Set<Post> posts = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "user_followers",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "follower_id")
    )
    @ToString.Exclude
    private Set<User> followers = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "followers", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @ToString.Exclude
    private Set<User> following = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}