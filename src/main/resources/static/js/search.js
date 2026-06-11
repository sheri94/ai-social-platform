document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchUsers();
    }
});

async function searchUsers() {
    const query = document.getElementById('searchInput').value.trim();
    const resultsDiv = document.getElementById('searchResults');

    if (!query) {
        resultsDiv.innerHTML = '<div class="no-posts">👋 Введите имя пользователя для поиска</div>';
        return;
    }

    resultsDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>Поиск...</p></div>';

    try {
        const response = await fetch(`/api/v1/users/search?query=${encodeURIComponent(query)}&currentUser=${currentUser.username}`);

        if (response.ok) {
            const users = await response.json();

            if (users.length === 0) {
                resultsDiv.innerHTML = '<div class="no-posts">👤 Пользователи не найдены</div>';
                return;
            }

            let html = '';
            for (const user of users) {
                html += `
                    <div class="user-card">
                        <div class="user-info">
                            <div class="user-avatar">
                                ${user.profilePhoto ? `<img src="${user.profilePhoto}">` : '👤'}
                            </div>
                            <div class="user-details">
                                <h4>${user.fullName || user.username}</h4>
                                <p>@${user.username}</p>
                                ${user.bio ? `<p style="font-size: 11px; color: #999; margin-top: 3px;">${user.bio.substring(0, 50)}${user.bio.length > 50 ? '...' : ''}</p>` : ''}
                            </div>
                        </div>
                        <div>
                            <button class="view-profile-btn" onclick="viewProfile('${user.username}')">👤 Профиль</button>
                            <button id="followBtn-${user.username}" class="follow-btn" onclick="toggleFollow('${user.username}')">+ Подписаться</button>
                        </div>
                    </div>
                `;
            }
            resultsDiv.innerHTML = html;

            for (const user of users) {
                checkFollowStatus(user.username);
            }
        }
    } catch (error) {
        resultsDiv.innerHTML = '<div class="no-posts">❌ Ошибка поиска</div>';
    }
}

async function checkFollowStatus(username) {
    try {
        const response = await fetch(`/api/v1/users/${username}/is-following?currentUser=${currentUser.username}`);
        if (response.ok) {
            const data = await response.json();
            const btn = document.getElementById(`followBtn-${username}`);
            if (btn) {
                if (data.isFollowing) {
                    btn.textContent = '✓ Отписаться';
                    btn.className = 'unfollow-btn';
                } else {
                    btn.textContent = '+ Подписаться';
                    btn.className = 'follow-btn';
                }
            }
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

async function toggleFollow(username) {
    const btn = document.getElementById(`followBtn-${username}`);
    const isFollowing = btn.textContent === '✓ Отписаться';

    const url = isFollowing
        ? `/api/v1/users/${username}/unfollow?currentUser=${currentUser.username}`
        : `/api/v1/users/${username}/follow?currentUser=${currentUser.username}`;

    btn.textContent = '🔄 ...';
    btn.disabled = true;

    try {
        const response = await fetch(url, {method: 'POST'});
        if (response.ok) {
            if (isFollowing) {
                btn.textContent = '+ Подписаться';
                btn.className = 'follow-btn';
            } else {
                btn.textContent = '✓ Отписаться';
                btn.className = 'unfollow-btn';
            }
            // Обновляем статистику в сайдбаре
            location.reload();
        } else {
            alert('Ошибка');
        }
    } catch (error) {
        alert('Ошибка: ' + error.message);
    } finally {
        btn.disabled = false;
    }
}

function viewProfile(username) {
    window.location.href = `/user-profile?username=${username}`;
}