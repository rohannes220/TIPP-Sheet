async function fetchUserProfile() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const response = await fetch('/api/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            displayUserData(data.user);
        } else {
            console.error("Session invalid:", data.message);
            localStorage.removeItem('token');
            window.location.href = '/login.html';
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}

function displayUserData(user) {
   const firstNameDisplay = document.getElementById('firstNameDisplay');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const deleteQuestion = document.getElementById('deleteQuestion');

    if (firstNameDisplay) firstNameDisplay.innerText = `${user.firstName}`;
    if (usernameDisplay) usernameDisplay.innerText = `${user.username}`;
    if (deleteQuestion) {
        const a = document.createElement('a');
        a.href = 'delete-account.html';
        a.innerText = 'Delete account';
        a.className = 'delete-link';
        deleteQuestion.appendChild(a);
    }
}

const logoutButton = document.getElementById('logout-btn')

if(logoutButton) {
    logoutButton.addEventListener("click", logout)
}

function logout() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    localStorage.removeItem('token');
    window.location.href = '/index.html';
}

fetchUserProfile();