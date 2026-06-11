package com.demo.ai_socials.controller;

import com.demo.ai_socials.model.User;
import com.demo.ai_socials.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private UserService userService;

    private final String UPLOAD_DIR = "uploads/profiles/";

    @PostMapping("/upload-photo")
    public ResponseEntity<?> uploadProfilePhoto(
            @RequestParam("username") String username,
            @RequestParam("photo") MultipartFile photo) {

        try {
            // Создаем папку если не существует
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Генерируем уникальное имя файла
            String fileExtension = getFileExtension(photo.getOriginalFilename());
            String fileName = username + "_" + UUID.randomUUID().toString() + fileExtension;
            Path filePath = uploadPath.resolve(fileName);

            // Сохраняем файл
            Files.write(filePath, photo.getBytes());

            // Сохраняем путь в базе данных
            String photoPath = "/uploads/" + fileName;
            User user = userService.updateProfilePhoto(username, photoPath);

            Map<String, String> response = new HashMap<>();
            response.put("photoUrl", photoPath);
            response.put("message", "Фото успешно загружено!");

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Ошибка загрузки фото: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/upload-photo-base64")
    public ResponseEntity<?> uploadProfilePhotoBase64(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String base64Image = request.get("photo");

            // Сохраняем base64 строку прямо в БД
            User user = userService.updateProfilePhoto(username, base64Image);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Фото успешно загружено!");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Ошибка: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return ".jpg";
        }
        return filename.substring(filename.lastIndexOf("."));
    }
}