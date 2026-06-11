package com.demo.ai_socials.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String fullName;
    private String interests;
    private String activity;
    private String bio;
    private LocalDateTime createdAt;
    private String profilePhoto;

}