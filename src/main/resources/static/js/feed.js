async function loadFeed() {
    const contentDiv = document.getElementById('pageContent');

    try {
        if (!currentUser || !currentUser.username) {
            console.error('Пользователь не авторизован');
            contentDiv.innerHTML = '<div class="no-posts"><p>❌ Ошибка: пользователь не авторизован</p></div>';
            return;
        }

        console.log('Загрузка ленты для пользователя:', currentUser.username);

        const response = await fetch(`/api/v1/posts/feed/${currentUser.username}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const posts = await response.json();
        console.log('Получено постов:', posts.length);

        if (posts.length === 0) {
            contentDiv.innerHTML = `
                <div class="no-posts">
                    <p>📭 В вашей ленте пока нет постов</p>
                    <p style="margin-top: 10px;">Подпишитесь на пользователей, чтобы видеть их посты здесь</p>
                    <button onclick="window.location.href='search.html'" style="margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 10px; cursor: pointer;">🔍 Найти друзей</button>
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
                        <div class="post-avatar" onclick="window.location.href='user-profile.html?username=${post.username}'">
                            ${post.profilePhoto ? `<img src="${post.profilePhoto}">` : '👤'}
                        </div>
                        <div class="post-author">
                            <h4 onclick="window.location.href='user-profile.html?username=${post.username}'">${escapeHtml(post.userFullName || post.username)}</h4>
                            <p>@${post.username} • ${formatDate(post.postDate)}</p>
                        </div>
                    </div>
                    <div class="post-ai-badge">🤖 Создано ИИ</div>
                    <div class="post-content">${escapeHtml(post.content)}</div>
                    ${photosHtml}
                </div>
            `;
        }
        contentDiv.innerHTML = html;

    } catch (error) {
        console.error('Ошибка загрузки ленты:', error);
        contentDiv.innerHTML = `
            <div class="no-posts">
                <p>❌ Ошибка загрузки ленты</p>
                <p style="font-size: 14px; margin-top: 10px;">${error.message}</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 10px; cursor: pointer;">🔄 Обновить</button>
            </div>
        `;
    }
}

function formatDate(dateString) {
    if (!dateString) return 'недавно';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'только что';
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    if (days < 7) return `${days} д назад`;
    return date.toLocaleDateString();
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

// Загружаем ленту после загрузки currentUser
if (typeof currentUser !== 'undefined' && currentUser) {
    loadFeed();
} else {
    const checkInterval = setInterval(() => {
        if (typeof currentUser !== 'undefined' && currentUser) {
            clearInterval(checkInterval);
            loadFeed();
        }
    }, 100);
}