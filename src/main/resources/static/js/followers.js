let targetUsername = null;

window.addEventListener('load', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    currentUser = JSON.parse(localStorage.getItem('user'));

    const urlParams = new URLSearchParams(window.location.search);
    targetUsername = urlParams.get('username') || currentUser.username;

    await loadFollowers();
});

async function loadFollowers() {
    const listDiv = document.getElementById('followersList');

    try {
        const response = await fetch(`/api/v1/users/${targetUsername}/followers`);

        if (response.ok) {
            const followers = await response.json();

            if (followers.length === 0) {
                listDiv.innerHTML = '<div class="no-posts">😢 Нет подписчиков</div>';
                return;
            }

            let html = '';
            for (const follower of followers) {
                const isCurrentUser = currentUser.username === follower.username;
                html += `
                    <div class="user-card">
                        <div class="user-info">
                            <div class="user-avatar">
                                ${follower.profilePhoto ? `<img src="${follower.profilePhoto}">` : '👤'}
                            </div>
                            <div class="user-details">
                                <h4>${follower.fullName || follower.username}</h4>
                                <p>@${follower.username}</p>
                            </div>
                        </div>
                        <div>
                            <button class="view-profile-btn" onclick="viewProfile('${follower.username}')">👤 Профиль</button>
                            ${!isCurrentUser ? `<button id="followBtn-${follower.username}" class="follow-btn" onclick="toggleFollow('${follower.username}')">+ Подписаться</button>` : ''}
                        </div>
                    </div>
                `;
            }
            listDiv.innerHTML = html;

            for (const follower of followers) {
                if (follower.username !== currentUser.username) {
                    checkFollowStatus(follower.username);
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