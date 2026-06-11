package com.demo.ai_socials.controller;

import com.demo.ai_socials.dto.response.UserResponse;
import com.demo.ai_socials.model.User;
import com.demo.ai_socials.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<?> getUserProfile(@PathVariable String username) {
        try {
            User user = userService.getUserByUsername(username);
            UserResponse response = userService.convertToResponse(user);

            Map<String, Object> profile = new HashMap<>();
            profile.put("user", response);
            profile.put("followersCount", user.getFollowers().size());
            profile.put("followingCount", user.getFollowing().size());

            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{username}/follow")
    public ResponseEntity<?> followUser(@PathVariable String username, @RequestParam String currentUser) {
        try {
            userService.followUser(currentUser, username);
            return ResponseEntity.ok(Map.of("message", "Вы подписались на " + username));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{username}/unfollow")
    public ResponseEntity<?> unfollowUser(@PathVariable String username, @RequestParam String currentUser) {
        try {
            userService.unfollowUser(currentUser, username);
            return ResponseEntity.ok(Map.of("message", "Вы отписались от " + username));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{username}/followers")
    public ResponseEntity<?> getFollowers(@PathVariable String username) {
        try {
            Set<User> followers = userService.getFollowers(username);
            Set<UserResponse> responses = followers.stream()
                    .map(userService::convertToResponse)
                    .collect(Collectors.toSet());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{username}/following")
    public ResponseEntity<?> getFollowing(@PathVariable String username) {
        try {
            Set<User> following = userService.getFollowing(username);
            Set<UserResponse> responses = following.stream()
                    .map(userService::convertToResponse)
                    .collect(Collectors.toSet());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{username}/is-following")
    public ResponseEntity<?> isFollowing(@PathVariable String username, @RequestParam String currentUser) {
        try {
            boolean isFollowing = userService.isFollowing(currentUser, username);
            return ResponseEntity.ok(Map.of("isFollowing", isFollowing));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Поиск пользователей
    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String query, @RequestParam String currentUser) {
        try {
            List<User> users = userService.searchUsers(query, currentUser);
            List<UserResponse> responses = users.stream()
                    .map(userService::convertToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}