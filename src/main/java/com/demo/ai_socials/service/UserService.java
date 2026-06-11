package com.demo.ai_socials.service;

import com.demo.ai_socials.dto.request.RegisterRequest;
import com.demo.ai_socials.dto.response.UserResponse;
import com.demo.ai_socials.model.User;
import com.demo.ai_socials.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Пользователь с таким логином уже существует");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setInterests(request.getInterests());
        user.setActivity(request.getActivity());
        user.setBio(request.getBio());

        return userRepository.save(user);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
    }

    public UserResponse convertToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setFullName(user.getFullName());
        response.setInterests(user.getInterests());
        response.setActivity(user.getActivity());
        response.setBio(user.getBio());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }

    public User updateProfilePhoto(String username, String profilePhoto) {
        User user = findByUsername(username);
        user.setProfilePhoto(profilePhoto);
        return userRepository.save(user);
    }

    // Генерация уникального URL при регистрации
    public String generateUniqueUrl(String username) {
        return "/profile/" + username;
    }

    // Подписаться на пользователя
    public void followUser(String currentUsername, String usernameToFollow) {
        User currentUser = findByUsername(currentUsername);
        User userToFollow = findByUsername(usernameToFollow);

        // Проверяем что не подписываемся на себя
        if (currentUser.getId().equals(userToFollow.getId())) {
            throw new RuntimeException("Нельзя подписаться на самого себя");
        }

        if (!currentUser.getFollowing().contains(userToFollow)) {
            // Добавляем связь в обе стороны
            currentUser.getFollowing().add(userToFollow);
            userToFollow.getFollowers().add(currentUser);

            // Сохраняем только один раз через отдельный запрос
            userRepository.save(currentUser);
            // userToFollow сохранится автоматически благодаря cascade
        }
    }

    // Отписаться от пользователя
    public void unfollowUser(String currentUsername, String usernameToUnfollow) {
        User currentUser = findByUsername(currentUsername);
        User userToUnfollow = findByUsername(usernameToUnfollow);

        if (currentUser.getFollowing().contains(userToUnfollow)) {
            currentUser.getFollowing().remove(userToUnfollow);
            userToUnfollow.getFollowers().remove(currentUser);

            userRepository.save(currentUser);
            userRepository.save(userToUnfollow);
        }
    }

    // Получить подписчиков пользователя
    public Set<User> getFollowers(String username) {
        User user = findByUsername(username);
        return user.getFollowers();
    }

    // Получить подписки пользователя
    public Set<User> getFollowing(String username) {
        User user = findByUsername(username);
        return user.getFollowing();
    }

    // Проверить, подписан ли текущий пользователь
    public boolean isFollowing(String currentUsername, String targetUsername) {
        User currentUser = findByUsername(currentUsername);
        User targetUser = findByUsername(targetUsername);
        return currentUser.getFollowing().contains(targetUser);
    }

    // Получить пользователя по username
    public User getUserByUsername(String username) {
        return findByUsername(username);
    }

    // Поиск пользователей (исключая текущего)
    public List<User> searchUsers(String query, String currentUsername) {
        if (query == null || query.trim().isEmpty()) {
            return new ArrayList<>();
        }

        String searchTerm = "%" + query.toLowerCase() + "%";
        return userRepository.searchUsers(searchTerm, currentUsername);
    }
}