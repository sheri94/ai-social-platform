package com.demo.ai_socials.controller;

import com.demo.ai_socials.dto.request.LoginRequest;
import com.demo.ai_socials.dto.request.RegisterRequest;
import com.demo.ai_socials.dto.response.UserResponse;
import com.demo.ai_socials.model.User;
import com.demo.ai_socials.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = userService.register(request);
            UserResponse response = userService.convertToResponse(user);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            User user = userService.findByUsername(request.getUsername());

            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                UserResponse userResponse = userService.convertToResponse(user);
                Map<String, Object> response = new HashMap<>();
                response.put("token", "temp-token-for-testing");
                response.put("user", userResponse);
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Неверный логин или пароль");
                return ResponseEntity.status(401).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Ошибка входа: " + e.getMessage());
            return ResponseEntity.status(401).body(error);
        }
    }
}