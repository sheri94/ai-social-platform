let targetUsername = null;

window.addEventListener('load', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login';
        return;
    }

    currentUser = JSON.parse(localStorage.getItem('user'));

    const urlParams = new URLSearchParams(window.location.search);
    targetUsername = urlParams.get('username') || currentUser.username;

    await loadFollowing();
});

async function loadFollowing() {
    const listDiv = document.getElementById('followingList');

    try {
        const response = await fetch(`/api/v1/users/${targetUsername}/following`);

        if (response.ok) {
            const following = await response.json();

            if (following.length === 0) {
                listDiv.innerHTML = '<div class="no-posts">😢 Нет подписок</div>';
                return;
            }

            let html = '';
            for (const follow of following) {
                const isCurrentUser = currentUser.username === follow.username;
                html += `
                    <div class="user-card">
                        <div class="user-info">
                            <div class="user-avatar">
                                ${follow.profilePhoto ? `<img src="${follow.profilePhoto}">` : '👤'}
                            </div>
                            <div class="user-details">
                                <h4>${follow.fullName || follow.username}</h4>
                                <p>@${follow.username}</p>
                            </div>
                        </div>
                        <div>
                            <button class="view-profile-btn" onclick="viewProfile('${follow.username}')">👤 Профиль</button>
                            ${!isCurrentUser ? `<button id="followBtn-${follow.username}" class="follow-btn" onclick="toggleFollow('${follow.username}')">+ Подписаться</button>` : ''}
                        </div>
                    </div>
                `;
            }
            listDiv.innerHTML = html;

            for (const follow of following) {
                if (follow.username !== currentUser.username) {
                    checkFollowStatus(follow.username);
                }
            }
        }
    } catch (error) {
        listDiv.innerHTML = '<div class="no-posts">❌ Ошибка загрузки</div>';
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