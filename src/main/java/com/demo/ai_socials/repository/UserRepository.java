package com.demo.ai_socials.repository;

import com.demo.ai_socials.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    @Query("SELECT u FROM User u WHERE LOWER(u.username) LIKE :searchTerm OR LOWER(u.fullName) LIKE :searchTerm AND u.username != :currentUsername")
    List<User> searchUsers(@Param("searchTerm") String searchTerm, @Param("currentUsername") String currentUsername);

    // Для предотвращения StackOverflowError - используем проекции
    @Query("SELECT u.id, u.username, u.fullName, u.profilePhoto FROM User u WHERE u.username = :username")
    Object findUserSimpleByUsername(@Param("username") String username);
}