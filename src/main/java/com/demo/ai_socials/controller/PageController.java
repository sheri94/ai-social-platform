package com.demo.ai_socials.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
public class PageController {

    @GetMapping(value = "/pages/{page}.html", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> getPage(@PathVariable String page) {
        try {
            Resource resource = new ClassPathResource("static/pages/" + page + ".html");

            if (resource.exists()) {
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
                return ResponseEntity.ok(content);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/")
    public ResponseEntity<String> index() {
        return getPage("register");
    }

    @GetMapping("/register")
    public ResponseEntity<String> register() {
        return getPage("register");
    }

    @GetMapping("/login")
    public ResponseEntity<String> login() {
        return getPage("login");
    }

    @GetMapping("/profile")
    public ResponseEntity<String> profile() {
        return getPage("profile");
    }

    @GetMapping("/my-posts")
    public ResponseEntity<String> myPosts() {
        return getPage("my-posts");
    }

    @GetMapping("/daily")
    public ResponseEntity<String> daily() {
        return getPage("daily");
    }

    @GetMapping("/search")
    public ResponseEntity<String> search() {
        return getPage("search");
    }

    @GetMapping("/user-profile")
    public ResponseEntity<String> userProfile() {
        return getPage("user-profile");
    }

    @GetMapping("/followers")
    public ResponseEntity<String> followers() {
        return getPage("followers");
    }

    @GetMapping("/following")
    public ResponseEntity<String> following() {
        return getPage("following");
    }
}