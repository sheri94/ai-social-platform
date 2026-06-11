package com.demo.ai_socials.repository;

import com.demo.ai_socials.model.Post;
import com.demo.ai_socials.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserOrderByPostDateDesc(User user);

    List<Post> findAllByOrderByPostDateDesc();
}