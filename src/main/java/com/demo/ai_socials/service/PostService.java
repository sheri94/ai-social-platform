package com.demo.ai_socials.service;

import com.demo.ai_socials.model.Post;
import com.demo.ai_socials.model.User;
import com.demo.ai_socials.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    private final String UPLOAD_DIR = "uploads/posts/";

    public Post createPost(User user, String content, String aiQuestion) {
        Post post = new Post();
        post.setUser(user);
        post.setContent(content);
        post.setAiQuestion(aiQuestion);
        post.setPostDate(LocalDate.now());
        return postRepository.save(post);
    }

    public Post createPostWithPhotos(User user, String content, String aiQuestion, List<MultipartFile> photos) throws IOException {
        Post post = new Post();
        post.setUser(user);
        post.setContent(content);
        post.setAiQuestion(aiQuestion);
        post.setPostDate(LocalDate.now());

        // Сохраняем фото
        if (photos != null && !photos.isEmpty()) {
            List<String> savedPaths = new ArrayList<>();

            // Создаём папку если нет
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            for (MultipartFile photo : photos) {
                if (!photo.isEmpty()) {
                    String fileName = user.getUsername() + "_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString() + ".jpg";
                    Path filePath = uploadPath.resolve(fileName);
                    Files.write(filePath, photo.getBytes());
                    savedPaths.add("/" + UPLOAD_DIR + fileName);
                }
            }

            // Сохраняем пути как JSON
            post.setPhotoPaths(savedPaths.toString());
        }

        return postRepository.save(post);
    }

    public Post createPostWithBase64Photo(User user, String content, String aiQuestion, String base64Photo) throws IOException {
        Post post = new Post();
        post.setUser(user);
        post.setContent(content);
        post.setAiQuestion(aiQuestion);
        post.setPostDate(LocalDate.now());

        if (base64Photo != null && !base64Photo.isEmpty()) {
            // Создаём папку если нет
            Path uploadPath = Paths.get("uploads/posts/");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Конвертируем base64 в файл
            String base64Image = base64Photo.split(",")[1];
            byte[] imageBytes = java.util.Base64.getDecoder().decode(base64Image);

            String fileName = user.getUsername() + "_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString() + ".jpg";
            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath, imageBytes);

            // Правильный путь для доступа через браузер
            String photoPath = "/uploads/posts/" + fileName;
            post.setPhotoPaths("[\"" + photoPath + "\"]");

            System.out.println("Фото сохранено: " + filePath.toAbsolutePath());
            System.out.println("URL фото: " + photoPath);
        }

        return postRepository.save(post);
    }

    public List<Post> getUserPosts(User user) {
        return postRepository.findByUserOrderByPostDateDesc(user);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByPostDateDesc();
    }
}