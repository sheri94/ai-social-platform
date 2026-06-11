package com.demo.ai_socials.service;

import com.demo.ai_socials.model.User;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiAssistantService {

    private final ChatClient chatClient;

    public AiAssistantService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String generateQuestionForUser(User user) {
        String prompt = String.format("""
                        Ты — дружелюбный ИИ-ассистент в социальной сети.
                        
                        Информация о пользователе:
                        - Имя: %s
                        - Интересы: %s
                        - Деятельность: %s
                        
                        Задай один интересный, открытый вопрос пользователю о его дне.
                        Вопрос должен быть на русском языке, персональным.
                        Напиши только вопрос, без пояснений и кавычек.
                        """,
                user.getFullName() != null ? user.getFullName() : "пользователь",
                user.getInterests() != null ? user.getInterests() : "не указаны",
                user.getActivity() != null ? user.getActivity() : "не указана"
        );

        try {
            return chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
        } catch (Exception e) {
            System.err.println("Ошибка генерации вопроса: " + e.getMessage());
            return "Что хорошего случилось с тобой сегодня?";
        }
    }

    public String generatePostFromAnswer(User user, String question, String answer) {
        String prompt = String.format("""
                Преврати ответ пользователя в красивый пост для соцсети.
                
                Вопрос ИИ: "%s"
                Ответ пользователя: "%s"
                
                Напиши пост от первого лица (как пользователь). 1-3 предложения. 
                Пост должен быть грамотным, эмоциональным.
                Добавь эмодзи в конце. На русском языке.
                Напиши только пост, без пояснений и кавычек.
                """, question, answer);

        try {
            return chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
        } catch (Exception e) {
            System.err.println("Ошибка генерации поста: " + e.getMessage());
            return "📝 " + answer;
        }
    }
}