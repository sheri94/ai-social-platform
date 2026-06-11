package com.demo.ai_socials.dto.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PostResponse {
    private Long id;
    private String content;
    private String aiQuestion;
    private LocalDate postDate;
    private String username;
    private String userFullName;
    private String profilePhoto;
    private String photoPaths;
}