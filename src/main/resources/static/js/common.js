let currentUser = null;

window.addEventListener('load', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login';
        return;
    }

    currentUser = JSON.parse(localStorage.getItem('user'));
    await loadSidebarProfile();

    if (currentUser.profilePhoto) {
        updateSidebarAvatar(currentUser.profilePhoto);
    }
});

async function loadSidebarProfile() {
    try {
        const response = await fetch(`/api/v1/users/${currentUser.username}`);
        let followersCount = 0;
        let followingCount = 0;
        let userData = currentUser;

        if (response.ok) {
            const data = await response.json();
            followersCount = data.followersCount || 0;
            followingCount = data.followingCount || 0;
            if (data.user) {
                userData = data.user;
            }
        }

        // Обновляем все поля профиля в левой панели
        document.getElementById('sidebarName').textContent = userData.fullName || currentUser.fullName || currentUser.username;
        document.getElementById('sidebarUsername').textContent = '@' + (userData.username || currentUser.username);
        document.getElementById('sidebarFollowers').textContent = followersCount;
        document.getElementById('sidebarFollowing').textContent = followingCount;
        document.getElementById('sidebarBio').textContent = userData.bio || currentUser.bio || '-';
        document.getElementById('sidebarInterests').textContent = userData.interests || currentUser.interests || '-';
        document.getElementById('sidebarActivity').textContent = userData.activity || currentUser.activity || '-';

        // Сохраняем актуальные данные в localStorage
        if (userData !== currentUser) {
            currentUser = {...currentUser, ...userData};
            localStorage.setItem('user', JSON.stringify(currentUser));
        }

    } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
        // Заполняем из localStorage если сервер не ответил
        document.getElementById('sidebarBio').textContent = currentUser.bio || '-';
        document.getElementById('sidebarInterests').textContent = currentUser.interests || '-';
        document.getElementById('sidebarActivity').textContent = currentUser.activity || '-';
    }
}

function updateSidebarAvatar(photoData) {
    const avatarText = document.getElementById('sidebarAvatarText');
    const avatarImage = document.getElementById('sidebarAvatarImage');

    if (avatarText && avatarImage && photoData && photoData.startsWith('data:image')) {
        avatarText.style.display = 'none';
        avatarImage.style.display = 'block';
        avatarImage.src = photoData;
    }
}

function goToMyProfile() {
    window.location.href = `/user-profile?username=${currentUser.username}`;
}

function showFollowers() {
    window.location.href = `/followers?username=${currentUser.username}`;
}

function showFollowing() {
    window.location.href = `/following?username=${currentUser.username}`;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}

window.goToMyProfile = goToMyProfile;
window.showFollowers = showFollowers;
window.showFollowing = showFollowing;
window.logout = logout;