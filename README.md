# 🤖 Social AI Network

<div align="center">

![Java Version](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Ollama](https://img.shields.io/badge/Ollama-0.5.7-purple)

**Социальная сеть с ИИ-ассистентом**

[О проекте](#-о-проекте) • [Установка](#-установка) • [Настройка ИИ](#-настройка-нейросети-ollama) • [Запуск](#-запуск-приложения) • [Docker](#-docker-деплой)

</div>

---

## 📖 О проекте

**Social AI Network** — это социальная сеть, где каждый пост создаётся при помощи ИИ-ассистента. Вы отвечаете на персонализированные вопросы, а нейросеть превращает ваши ответы в красивые посты.

### ✨ Особенности

- 🤖 **ИИ-ассистент** — генерирует персонализированные вопросы и посты
- 📝 **Редактор постов** — редактируйте и дополняйте посты перед публикацией
- 📷 **Загрузка фото** — прикрепляйте изображения к постам
- 👥 **Подписки** — подписывайтесь на друзей и читайте их ленту
- 🔍 **Поиск** — находите пользователей по интересам
- 🏠 **Лента** — видите посты тех, на кого подписаны

### 🏗️ Технологии

| Технология | Версия | Назначение |
|------------|--------|------------|
| Java | 21 | Язык программирования |
| Spring Boot | 3.2.0 | Фреймворк |
| Spring AI | 1.0.0-M3 | Интеграция с ИИ |
| Ollama | 0.5.7 | Локальная нейросеть |
| H2 Database | - | База данных |
| Maven | - | Сборка проекта |

---

## 🚀 Установка

### Требования к системе

| Компонент | Минимальная версия | Примечание |
|-----------|-------------------|------------|
| Windows / Mac / Linux | - | Любая ОС |
| Java | 21 | Обязательно |
| RAM | 4 GB | Для нейросети нужно 4-8 GB |
| Диск | 10 GB | Для модели нейросети |

---

### Шаг 1: Установка Java 21

#### Windows
1. Скачайте JDK 21: https://adoptium.net/temurin/releases/?version=21
2. Выберите `Windows x64 Installer` (файл `.msi`)
3. Запустите установщик → всё по умолчанию
4. Проверьте:
```powershell
java -version
```

#### Mac
```bash
brew install openjdk@21
```

#### Linux
```bash
sudo apt update
sudo apt install openjdk-21-jdk
```

---

### Шаг 2: Установка Git

#### Windows
Скачайте с https://git-scm.com/download/win

#### Mac
```bash
brew install git
```

#### Linux
```bash
sudo apt install git
```

---

### Шаг 3: Установка Maven

#### Windows
1. Скачайте Maven: https://maven.apache.org/download.cgi
2. Распакуйте в `C:\maven`
3. Добавьте `C:\maven\bin` в переменную PATH

#### Mac
```bash
brew install maven
```

#### Linux
```bash
sudo apt install maven
```

Проверьте:
```bash
mvn -version
```

---

## 🤖 НАСТРОЙКА НЕЙРОСЕТИ OLLAMA

### Что такое Ollama?

Ollama — бесплатная программа для запуска языковых моделей **локально на вашем компьютере**.

| Преимущество | Описание |
|--------------|----------|
| 💰 **Бесплатно** | Никаких платежей и лимитов |
| 🌐 **Без интернета** | Всё работает офлайн |
| 🔒 **Конфиденциально** | Данные не уходят в облако |
| 🚀 **Быстро** | Мгновенный отклик |

---

### Шаг 4: Установка Ollama

#### Windows
1. Перейдите на https://ollama.com/download
2. Скачайте `OllamaSetup.exe`
3. Запустите установщик

#### Mac
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

#### Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Проверьте:
```bash
ollama --version
```

---

### Шаг 5: Запуск Ollama сервера

**❗ ВАЖНО!** Сервер должен работать всё время, пока вы пользуетесь приложением.

1. Откройте **отдельный** терминал
2. Запустите сервер:

```bash
ollama serve
```

✅ **Вы должны увидеть:**
```
Listening on 127.0.0.1:11434
```

**⚠️ НЕ ЗАКРЫВАЙТЕ ЭТОТ ТЕРМИНАЛ!**

---

### Шаг 6: Выбор и установка модели

#### 📊 Таблица моделей

| Модель | Размер | Качество русского | RAM | Команда |
|--------|--------|-------------------|-----|---------|
| **Qwen 2.5 (рекомендуется)** | 4.1 GB | ⭐⭐⭐⭐⭐ | 8 GB | `ollama pull qwen2.5:7b` |
| Qwen 2.5 (лёгкая) | 1.9 GB | ⭐⭐⭐⭐ | 4 GB | `ollama pull qwen2.5:3b` |
| Llama 3.2 | 2.0 GB | ⭐⭐⭐⭐ | 4 GB | `ollama pull llama3.2:3b` |
| Mistral | 4.1 GB | ⭐⭐⭐ | 8 GB | `ollama pull mistral` |
| DeepSeek Coder | 1.5 GB | ⭐⭐⭐ | 3 GB | `ollama pull deepseek-coder:1.5b` |

#### 🎯 Какую модель выбрать?

| Ваш компьютер | Рекомендуемая модель | Команда |
|---------------|---------------------|---------|
| 16+ GB RAM | Qwen 2.5 (7b) | `ollama pull qwen2.5:7b` |
| 8 GB RAM | Qwen 2.5 (3b) | `ollama pull qwen2.5:3b` |
| 4 GB RAM | DeepSeek Coder | `ollama pull deepseek-coder:1.5b` |

#### 📥 Установка модели

**В другом терминале** (не там, где запущен сервер):

```bash
# Для большинства пользователей
ollama pull qwen2.5:7b
```

**Процесс установки:**
```
pulling manifest
pulling d040cc185215: 100% ████████████████████████████████████████ 4.1 GB
verifying sha256 digest
writing manifest
success
```

⏱️ Время: 5-20 минут (зависит от скорости интернета)

---

### Шаг 7: Проверка модели

```bash
# Проверьте список моделей
ollama list

# Протестируйте модель
ollama run qwen2.5:7b "Привет! Как дела?"
```

✅ **Модель должна ответить на русском языке**

Для выхода из чата введите `/bye`

---

### Шаг 8: Настройка параметров модели

Откройте `src/main/resources/application.properties`:

```properties
# Ollama Configuration
spring.ai.ollama.base-url=http://localhost:11434
spring.ai.ollama.chat.options.model=qwen2.5:7b
spring.ai.ollama.chat.options.temperature=0.7
spring.ai.ollama.chat.options.top-k=40
```

| Параметр | Что делает | Рекомендуемое |
|----------|------------|---------------|
| `temperature` | Креативность (0-1) | 0.7 |
| `top_k` | Разнообразие слов | 40 |

---

## 📥 Установка проекта

### Шаг 9: Клонирование репозитория

```bash
git clone https://github.com/andreyvolsky/social-ai-network.git
cd social-ai-network
```

---

### Шаг 10: Сборка проекта

```bash
mvn clean package
```

**Успешная сборка:**
```
[INFO] BUILD SUCCESS
[INFO] Total time: 42.135 s
```

---

## 🚀 Запуск приложения

### Способ 1: Запуск JAR файла (рекомендуется)

```bash
java -jar target/ai_socials-0.0.1-SNAPSHOT.jar
```

### Способ 2: Запуск через Maven

```bash
mvn spring-boot:run
```

### Способ 3: Скрипт для Windows (`run.bat`)

```batch
@echo off
chcp 65001 >nul
title Social AI Network

echo ========================================
echo    Social AI Network - Социальная сеть
echo ========================================
echo.

java -version >nul 2>&1
if errorlevel 1 (
    echo [ОШИБКА] Java не найдена!
    pause
    exit /b 1
)

if not exist "uploads\posts" mkdir uploads\posts 2>nul
if not exist "data" mkdir data 2>nul

echo [OK] Запуск сервера на http://localhost:8080
echo.

java -Xmx512m -jar target\ai_socials-0.0.1-SNAPSHOT.jar

pause
```

### Способ 4: Скрипт для Mac/Linux (`run.sh`)

```bash
#!/bin/bash
echo "========================================"
echo "   Social AI Network - Социальная сеть"
echo "========================================"
echo ""

mkdir -p uploads/posts
mkdir -p data

echo "[OK] Запуск сервера на http://localhost:8080"
echo ""

java -Xmx512m -jar target/ai_socials-0.0.1-SNAPSHOT.jar
```

---

## 🌐 Страницы приложения

После запуска откройте браузер:

| Страница | URL | Описание |
|----------|-----|----------|
| Регистрация | `http://localhost:8080/register` | Создание аккаунта |
| Вход | `http://localhost:8080/login` | Авторизация |
| Лента | `http://localhost:8080/profile` | Посты подписок |
| Мои посты | `http://localhost:8080/my-posts` | Ваши посты |
| Вопрос дня | `http://localhost:8080/daily` | Создание поста через ИИ |
| Поиск | `http://localhost:8080/search` | Поиск пользователей |

---

## 📝 Первое использование

### 1. Регистрация

Заполните анкету:
- **Логин** и **пароль**
- **Полное имя**
- **О себе** — расскажите о себе
- **Интересы** — укажите хобби (**ОЧЕНЬ ВАЖНО!**)
- **Деятельность** — чем занимаетесь

### 2. Создание первого поста

1. Перейдите на `/daily`
2. ИИ задаст персонализированный вопрос
3. Напишите ответ
4. Нажмите **"Создать черновик поста"**
5. Отредактируйте пост при желании
6. Прикрепите фото
7. Нажмите **"Опубликовать"**

---

## 🐳 Docker деплой

### Dockerfile

```dockerfile
FROM openjdk:21-slim
WORKDIR /app
COPY target/ai_socials-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Xmx512m", "-jar", "app.jar"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    volumes:
      - ./data:/app/data
      - ./uploads:/app/uploads
    depends_on:
      - ollama
    environment:
      - SPRING_AI_OLLAMA_BASE_URL=http://ollama:11434
    restart: unless-stopped

  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    command: >
      sh -c "ollama serve & sleep 10 && ollama pull qwen2.5:7b"
    restart: unless-stopped

volumes:
  ollama_data:
```

### Сборка и запуск

```bash
# Сборка JAR
mvn clean package

# Сборка Docker образа
docker build -t social-ai-network .

# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

---

## 📦 Создание исполняемого JAR для распространения

### Шаг 1: Сборка

```bash
mvn clean package
```

### Шаг 2: Подготовка дистрибутива

```bash
# Создайте папку для дистрибутива
mkdir SocialAINetwork

# Скопируйте JAR
cp target/ai_socials-0.0.1-SNAPSHOT.jar SocialAINetwork/

# Скопируйте скрипты запуска
cp run.bat run.sh SocialAINetwork/

# Создайте ZIP архив
zip -r SocialAINetwork.zip SocialAINetwork/
```

### Шаг 3: Запуск на другом компьютере

1. Распаковать архив
2. Установить Java 21
3. Установить Ollama и скачать модель
4. Запустить `run.bat` (Windows) или `./run.sh` (Mac/Linux)

---

## 🔧 Устранение проблем

### Проблема 1: `java -version` не работает

**Решение:** Установите Java 21

### Проблема 2: `Connection refused: localhost:11434`

**Решение:** Запустите Ollama сервер: `ollama serve`

### Проблема 3: `Port 8080 already in use`

**Windows:**
```powershell
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :8080
kill -9 <PID>
```

### Проблема 4: Модель отвечает на английском

**Решение:** Скачайте Qwen 2.5:
```bash
ollama pull qwen2.5:7b
```

### Проблема 5: Не хватает памяти

**Решение:** Используйте лёгкую модель:
```bash
ollama pull qwen2.5:3b
```

### Проблема 6: Ошибка сборки Maven

```bash
mvn clean
rm -rf ~/.m2/repository/org/springframework/ai
mvn clean install
```

---

## 📁 Структура проекта

```
social-ai-network/
├── src/
│   └── main/
│       ├── java/com/demo/ai_socials/
│       │   ├── config/         # Конфигурации
│       │   ├── controller/     # REST контроллеры
│       │   ├── dto/           # Data Transfer Objects
│       │   ├── model/         # Сущности БД
│       │   ├── repository/    # JPA репозитории
│       │   └── service/       # Бизнес-логика
│       └── resources/
│           ├── static/        # HTML, CSS, JS
│           └── application.properties
├── target/                     # Скомпилированные файлы
│   └── ai_socials-0.0.1-SNAPSHOT.jar
├── data/                       # База данных (создаётся)
├── uploads/                    # Загруженные фото
├── docker-compose.yml
├── Dockerfile
├── pom.xml
├── run.bat
├── run.sh
└── README.md
```

---

## 📄 Лицензия

MIT License — свободное использование, модификация и распространение.

---

## 🙏 Благодарности

- [Spring AI](https://spring.io/projects/spring-ai) — интеграция с нейросетями
- [Ollama](https://ollama.com) — локальный запуск LLM
- [Qwen](https://github.com/QwenLM/Qwen) — качественная русскоязычная модель

---

<div align="center">
  <sub>Built with ❤️ for the AI community</sub>
</div>
```

Этот README содержит **всю необходимую информацию**:
- ✅ Описание проекта
- ✅ Установка Java, Git, Maven
- ✅ Полная настройка Ollama
- ✅ Таблица и выбор моделей
- ✅ Запуск приложения (4 способа)
- ✅ Docker деплой
- ✅ Создание дистрибутива
- ✅ Устранение проблем
- ✅ Структура проекта
