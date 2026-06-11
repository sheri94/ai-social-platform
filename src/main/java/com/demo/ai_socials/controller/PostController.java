package com.demo.ai_socials.controller;

import com.demo.ai_socials.dto.response.PostResponse;
import com.demo.ai_socials.model.Post;
import com.demo.ai_socials.model.User;
import com.demo.ai_socials.service.PostService;
import com.demo.ai_socials.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public ResponseEntity<?> createPost(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String content = request.get("content");
            String aiQuestion = request.get("aiQuestion");
            String photo = request.get("photo"); // base64 фото

            User user = userService.findByUsername(username);
            Post post;

            if (photo != null && !photo.isEmpty()) {
                // Сохраняем пост с фото
                post = postService.createPostWithBase64Photo(user, content, aiQuestion, photo);
            } else {
                post = postService.createPost(user, content, aiQuestion);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("id", post.getId());
            response.put("content", post.getContent());
            response.put("postDate", post.getPostDate());
            response.put("photoPaths", post.getPhotoPaths());
            response.put("message", "Пост успешно создан!");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Получить посты пользователя
    @GetMapping("/user/{username}")
    public ResponseEntity<?> getUserPosts(@PathVariable String username) {
        try {
            User user = userService.findByUsername(username);
            List<Post> posts = postService.getUserPosts(user);

            List<PostResponse> postResponses = posts.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(postResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Получить ленту (посты подписок)
    @GetMapping("/feed/{username}")
    public ResponseEntity<?> getFeed(@PathVariable String username) {
        try {
            User user = userService.findByUsername(username);
            Set<User> following = user.getFollowing();

            List<Post> feedPosts = new ArrayList<>();
            for (User followedUser : following) {
                feedPosts.addAll(postService.getUserPosts(followedUser));
            }

            // Сортируем по дате (новые сверху)
            feedPosts.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

            List<PostResponse> postResponses = feedPosts.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(postResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private PostResponse convertToResponse(Post post) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setContent(post.getContent());
        response.setAiQuestion(post.getAiQuestion());
        response.setPostDate(post.getPostDate());
        response.setUsername(post.getUser().getUsername());
        response.setUserFullName(post.getUser().getFullName());
        response.setProfilePhoto(post.getUser().getProfilePhoto());
        response.setPhotoPaths(post.getPhotoPaths());
        return response;
    }
}