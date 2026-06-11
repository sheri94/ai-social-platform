package com.demo.ai_socials;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SocialAiApplication {

    public static void main(String[] args) {
        SpringApplication.run(SocialAiApplication.class, args);
        System.out.println("=========================================");
        System.out.println("Социальная сеть с ИИ запущена!");
        System.out.println("Открой в браузере: http://localhost:8080");
        System.out.println("H2 Console: http://localhost:8080/h2-console");
        System.out.println("=========================================");
    }
}
