package com.demo.ai_socials.controller;

import com.demo.ai_socials.model.User;
import com.demo.ai_socials.service.AiAssistantService;
import com.demo.ai_socials.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@CrossOrigin(origins = "*")
public class AiController {

    @Autowired
    private AiAssistantService aiAssistantService;

    @Autowired
    private UserService userService;

    @PostMapping("/generate-question")
    public ResponseEntity<?> generateQuestion(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            User user = userService.findByUsername(username);

            String question = aiAssistantService.generateQuestionForUser(user);

            Map<String, String> response = new HashMap<>();
            response.put("question", question);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/generate-post")
    public ResponseEntity<?> generatePost(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String question = request.get("question");
            String answer = request.get("answer");

            User user = userService.findByUsername(username);

            String post = aiAssistantService.generatePostFromAnswer(user, question, answer);

            Map<String, String> response = new HashMap<>();
            response.put("post", post);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}