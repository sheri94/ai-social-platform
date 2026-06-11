let profileUsername = null;

window.addEventListener('load', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login';
        return;
    }

    currentUser = JSON.parse(localStorage.getItem('user'));

    const urlParams = new URLSearchParams(window.location.search);
    profileUsername = urlParams.get('username');

    if (!profileUsername || profileUsername === currentUser.username) {
        window.location.href = 'profile.html';
        return;
    }

    await loadOtherUserProfile();
    await loadOtherUserPosts();
    await checkFollowStatus();
});

async function loadOtherUserProfile() {
    try {
        const response = await fetch(`/api/v1/users/${profileUsername}`);

        if (response.ok) {
            const data = await response.json();
            const user = data.user;

            document.getElementById('otherName').textContent = user.fullName || user.username;
            document.getElementById('otherUsername').textContent = '@' + user.username;
            document.getElementById('otherFollowers').textContent = data.followersCount || 0;
            document.getElementById('otherFollowing').textContent = data.followingCount || 0;
            document.getElementById('otherBio').textContent = user.bio || '-';
            document.getElementById('otherInterests').textContent = user.interests || '-';

            if (user.profilePhoto) {
                const avatarText = document.getElementById('otherAvatarText');
                const avatarImage = document.getElementById('otherAvatarImage');
                avatarText.style.display = 'none';
                avatarImage.style.display = 'block';
                avatarImage.src = user.profilePhoto;
            }
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

async function loadOtherUserPosts() {
    const contentDiv = document.getElementById('pageContent');

    try {
        const response = await fetch(`/api/v1/posts/user/${profileUsername}`);

        if (response.ok) {
            const posts = await response.json();

            if (posts.length === 0) {
                contentDiv.innerHTML = '<div class="no-posts">📝 У пользователя пока нет постов</div>';
                return;
            }

            let html = '';
            for (const post of posts) {
                html += `
                    <div class="post-card">
                        <div class="post-header">
                            <div class="post-avatar">
                                ${document.getElementById('otherAvatarImage').src ?
                    `<img src="${document.getElementById('otherAvatarImage').src}">` : '👤'}
                            </div>
                            <div class="post-author">
                                <h4>${document.getElementById('otherName').textContent}</h4>
                                <p>${new Date(post.postDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        ${post.aiQuestion ? `<div class="post-ai-badge">💬 Вопрос: ${post.aiQuestion}</div>` : ''}
                        <div class="post-content">${post.content}</div>
                    </div>
                `;
            }
            contentDiv.innerHTML = html;
        }
    } catch (error) {
        contentDiv.innerHTML = '<div class="no-posts">❌ Ошибка загрузки постов</div>';
    }
}

async function checkFollowStatus() {
    try {
        const response = await fetch(`/api/v1/users/${profileUsername}/is-following?currentUser=${currentUser.username}`);
        if (response.ok) {
            const data = await response.json();
            const btn = document.getElementById('followActionBtn');
            if (data.isFollowing) {
                btn.textContent = '✓ Отписаться';
                btn.className = 'unfollow-btn';
            } else {
                btn.textContent = '+ Подписаться';
                btn.className = 'follow-btn';
            }
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

async function toggleFollow() {
    const btn = document.getElementById('followActionBtn');
    const isFollowing = btn.textContent === '✓ Отписаться';

    const url = isFollowing
        ? `/api/v1/users/${profileUsername}/unfollow?currentUser=${currentUser.username}`
        : `/api/v1/users/${profileUsername}/follow?currentUser=${currentUser.username}`;

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

window.toggleFollow = toggleFollow;