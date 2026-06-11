async function loadMyPosts() {
    const contentDiv = document.getElementById('pageContent');

    try {
        if (!currentUser || !currentUser.username) {
            console.error('Пользователь не авторизован');
            contentDiv.innerHTML = '<div class="no-posts"><p>❌ Ошибка: пользователь не авторизован</p></div>';
            return;
        }

        console.log('Загрузка постов пользователя:', currentUser.username);

        const response = await fetch(`/api/v1/posts/user/${currentUser.username}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const posts = await response.json();
        console.log('Получено постов:', posts.length);

        if (posts.length === 0) {
            contentDiv.innerHTML = `
                <div class="no-posts">
                    <p>📝 У вас пока нет постов</p>
                    <p style="margin-top: 10px;">Ответьте на вопрос ИИ, чтобы создать первый пост!</p>
                    <button onclick="window.location.href='daily.html'" style="margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 10px; cursor: pointer;">🤖 Создать пост</button>
                </div>
            `;
            return;
        }

        let html = '';
        for (const post of posts) {
            // Отображаем фото если есть
            let photosHtml = '';
            if (post.photoPaths) {
                try {
                    const photoPaths = JSON.parse(post.photoPaths);
                    if (photoPaths.length > 0) {
                        photosHtml = '<div class="post-photos">';
                        for (const path of photoPaths) {
                            photosHtml += `<img src="${path}" alt="post photo" onclick="window.open('${path}', '_blank')">`;
                        }
                        photosHtml += '</div>';
                    }
                } catch (e) {
                    console.error('Ошибка парсинга фото:', e);
                }
            }

            html += `
                <div class="post-card">
                    <div class="post-header">
                        <div class="post-avatar">
                            ${currentUser.profilePhoto ? `<img src="${currentUser.profilePhoto}">` : '👤'}
                        </div>
                        <div class="post-author">
                            <h4>${escapeHtml(currentUser.fullName || currentUser.username)}</h4>
                            <p>${formatDate(post.postDate)}</p>
                        </div>
                    </div>
                    ${post.aiQuestion ? `<div class="post-ai-badge">💬 Вопрос: ${escapeHtml(post.aiQuestion)}</div>` : ''}
                    <div class="post-content">${escapeHtml(post.content)}</div>
                    ${photosHtml}
                </div>
            `;
        }
        contentDiv.innerHTML = html;

    } catch (error) {
        console.error('Ошибка загрузки постов:', error);
        contentDiv.innerHTML = `
            <div class="no-posts">
                <p>❌ Ошибка загрузки постов</p>
                <p style="font-size: 14px; margin-top: 10px;">${error.message}</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 10px; cursor: pointer;">🔄 Обновить</button>
            </div>
        `;
    }
}

function formatDate(dateString) {
    if (!dateString) return 'недавно';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/\n/g, '<br>');
}

// Загружаем посты после загрузки currentUser
if (typeof currentUser !== 'undefined' && currentUser) {
    loadMyPosts();
} else {
    const checkInterval = setInterval(() => {
        if (typeof currentUser !== 'undefined' && currentUser) {
            clearInterval(checkInterval);
            loadMyPosts();
        }
    }, 100);
}