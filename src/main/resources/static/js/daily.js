let currentQuestion = "";
let currentAnswer = "";
let currentUserData = null;
let postPhotoBase64 = null;
let isLoading = false;
let isRefreshing = false;

window.addEventListener('load', () => {
    if (currentUser) {
        currentUserData = currentUser;
        loadRandomQuestion();
    } else {
        const checkInterval = setInterval(() => {
            if (typeof currentUser !== 'undefined' && currentUser) {
                currentUserData = currentUser;
                loadRandomQuestion();
                clearInterval(checkInterval);
            }
        }, 100);
    }
});

async function loadRandomQuestion() {
    const questionDiv = document.getElementById('questionText');
    if (!questionDiv) {
        console.error('Element questionText not found');
        return;
    }

    questionDiv.innerHTML = '<div class="spinner"></div><p>ИИ придумывает вопрос...</p>';

    // Проверяем существование кнопки перед отключением
    const refreshBtn = document.getElementById('refreshQuestionBtn');
    if (refreshBtn) refreshBtn.disabled = true;

    try {
        const response = await fetch('/api/v1/ai/generate-question', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: currentUserData.username})
        });

        if (response.ok) {
            const data = await response.json();
            currentQuestion = data.question;
            questionDiv.innerHTML = currentQuestion;
        } else {
            currentQuestion = "Что хорошего случилось с тобой сегодня?";
            questionDiv.innerHTML = currentQuestion;
            showMessage('❌ Не удалось загрузить вопрос от ИИ, используем стандартный', 'error');
        }
    } catch (error) {
        console.error('Ошибка загрузки вопроса:', error);
        currentQuestion = "Что хорошего случилось с тобой сегодня?";
        questionDiv.innerHTML = currentQuestion;
        showMessage('❌ Ошибка соединения, используем стандартный вопрос', 'error');
    } finally {
        if (refreshBtn) refreshBtn.disabled = false;
    }
}

async function refreshQuestion() {
    if (isRefreshing) return;
    isRefreshing = true;

    const refreshBtn = document.getElementById('refreshQuestionBtn');
    if (!refreshBtn) return;

    const originalText = refreshBtn.textContent;
    refreshBtn.disabled = true;
    refreshBtn.textContent = '⏳ Генерация...';

    const questionDiv = document.getElementById('questionText');
    if (questionDiv) {
        questionDiv.innerHTML = '<div class="spinner"></div><p>ИИ придумывает новый вопрос...</p>';
    }

    try {
        const response = await fetch('/api/v1/ai/generate-question', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: currentUserData.username})
        });

        if (response.ok) {
            const data = await response.json();
            currentQuestion = data.question;
            if (questionDiv) questionDiv.innerHTML = currentQuestion;
            showMessage('✨ Новый вопрос сгенерирован!', 'success');
        } else {
            const fallbackQuestions = [
                "Что хорошего случилось с тобой сегодня?",
                "Какая задача была самой сложной сегодня?",
                "Кто тебя сегодня удивил?",
                "Чему ты научился сегодня?",
                "Что нового ты узнал о себе?",
                "Кому ты помог сегодня?",
                "Что заставило тебя улыбнуться?"
            ];
            const randomIndex = Math.floor(Math.random() * fallbackQuestions.length);
            currentQuestion = fallbackQuestions[randomIndex];
            if (questionDiv) questionDiv.innerHTML = currentQuestion;
            showMessage('❌ Не удалось загрузить вопрос от ИИ, используем стандартный', 'error');
        }
    } catch (error) {
        console.error('Ошибка загрузки вопроса:', error);
        const fallbackQuestions = [
            "Что хорошего случилось с тобой сегодня?",
            "Какая задача была самой сложной сегодня?",
            "Кто тебя сегодня удивил?",
            "Чему ты научился сегодня?"
        ];
        const randomIndex = Math.floor(Math.random() * fallbackQuestions.length);
        currentQuestion = fallbackQuestions[randomIndex];
        if (questionDiv) questionDiv.innerHTML = currentQuestion;
        showMessage('❌ Ошибка соединения, используем стандартный вопрос', 'error');
    } finally {
        refreshBtn.disabled = false;
        refreshBtn.textContent = originalText;
        isRefreshing = false;
    }
}

async function generatePostPreview() {
    const answer = document.getElementById('answer').value.trim();

    if (!answer) {
        showMessage('❌ Пожалуйста, напишите ответ на вопрос', 'error');
        return;
    }

    if (isLoading) return;
    isLoading = true;

    currentAnswer = answer;

    const previewBtn = document.querySelector('.submit-btn');
    const originalText = previewBtn.textContent;
    previewBtn.disabled = true;
    previewBtn.textContent = '🤔 ИИ создаёт пост...';

    try {
        const response = await fetch('/api/v1/ai/generate-post', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: currentUserData.username,
                question: currentQuestion,
                answer: answer
            })
        });

        if (response.ok) {
            const data = await response.json();
            const generatedPost = data.post;

            document.getElementById('postEditor').style.display = 'block';
            document.getElementById('aiQuestionDisplay').innerHTML = `💬 Вопрос ИИ: ${currentQuestion}`;
            document.getElementById('postPreview').innerHTML = generatedPost;
            document.getElementById('editPostContent').value = generatedPost;
            document.getElementById('postPhotoPreview').innerHTML = '';
            postPhotoBase64 = null;

            document.getElementById('postEditor').scrollIntoView({behavior: 'smooth'});
        } else {
            const error = await response.json();
            showMessage('❌ Ошибка генерации поста: ' + (error.error || 'Неизвестная ошибка'), 'error');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        showMessage('❌ Ошибка соединения с сервером: ' + error.message, 'error');
    } finally {
        previewBtn.disabled = false;
        previewBtn.textContent = originalText;
        isLoading = false;
    }
}

function attachPhotoToPost() {
    const input = document.getElementById('postPhotoInput');
    input.click();

    input.onchange = function (event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showMessage('❌ Файл слишком большой! Максимум 5MB', 'error');
            return;
        }

        if (!file.type.startsWith('image/')) {
            showMessage('❌ Пожалуйста, выберите изображение', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = function () {
            postPhotoBase64 = reader.result;
            const previewDiv = document.getElementById('postPhotoPreview');
            previewDiv.innerHTML = `
                <div style="position: relative; display: inline-block;">
                    <img src="${postPhotoBase64}" alt="photo" style="width: 100px; height: 100px; object-fit: cover; border-radius: 10px; border: 2px solid #667eea;">
                    <button onclick="removePhoto()" style="position: absolute; top: -5px; right: -5px; background: #dc3545; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 12px; line-height: 1;">✖</button>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    };
}

function removePhoto() {
    postPhotoBase64 = null;
    document.getElementById('postPhotoPreview').innerHTML = '';
    showMessage('Фото удалено', 'success');
}

function cancelPost() {
    document.getElementById('postEditor').style.display = 'none';
    document.getElementById('answer').value = '';
    document.getElementById('editPostContent').value = '';
    document.getElementById('postPhotoPreview').innerHTML = '';
    postPhotoBase64 = null;
    showMessage('Черновик отменён', 'success');
}

async function publishPost() {
    const finalContent = document.getElementById('editPostContent').value.trim();

    if (!finalContent) {
        showMessage('❌ Пост не может быть пустым', 'error');
        return;
    }

    const publishBtn = document.querySelector('.publish-btn');
    publishBtn.disabled = true;
    publishBtn.textContent = '📤 Публикация...';

    try {
        const postData = {
            username: currentUserData.username,
            content: finalContent,
            aiQuestion: currentQuestion,
            photo: postPhotoBase64 || null
        };

        const response = await fetch('/api/v1/posts/create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(postData)
        });

        if (response.ok) {
            showMessage('✅ Пост успешно опубликован!', 'success');

            document.getElementById('postEditor').style.display = 'none';
            document.getElementById('answer').value = '';
            document.getElementById('editPostContent').value = '';
            document.getElementById('postPhotoPreview').innerHTML = '';
            postPhotoBase64 = null;

            setTimeout(() => {
                loadRandomQuestion();
            }, 2000);

            setTimeout(() => {
                if (confirm('Пост опубликован! Перейти к просмотру своих постов?')) {
                    window.location.href = '/my-posts';
                }
            }, 1000);
        } else {
            const error = await response.json();
            showMessage('❌ Ошибка при публикации: ' + (error.error || 'Неизвестная ошибка'), 'error');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        showMessage('❌ Ошибка соединения с сервером: ' + error.message, 'error');
    } finally {
        publishBtn.disabled = false;
        publishBtn.textContent = '📢 Опубликовать';
    }
}

function showMessage(msg, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = msg;
    messageDiv.className = 'message ' + type;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}