document.addEventListener('DOMContentLoaded', () => {
    const photoUpload = document.getElementById('photoUpload');
    if (photoUpload) {
        photoUpload.addEventListener('change', uploadPhoto);
    }
});

async function uploadPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        alert('Файл слишком большой! Максимум 5MB');
        return;
    }

    const reader = new FileReader();
    reader.onloadend = async function () {
        try {
            const response = await fetch('/api/v1/profile/upload-photo-base64', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: currentUser.username,
                    photo: reader.result
                })
            });

            if (response.ok) {
                currentUser.profilePhoto = reader.result;
                localStorage.setItem('user', JSON.stringify(currentUser));
                updateSidebarAvatar(reader.result);
                alert('Фото обновлено!');
            }
        } catch (error) {
            alert('Ошибка: ' + error.message);
        }
    };
    reader.readAsDataURL(file);
}