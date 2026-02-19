const nameDiv = document.getElementById('username-div');

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
   const welcomeHeading = document.getElementById('welcomeMessage');
    const usernameDisplay = document.getElementById('usernameDisplay');

    if (welcomeHeading) welcomeHeading.innerText = `Welcome back, ${user.firstName}!`;
    if (usernameDisplay) usernameDisplay.innerText = `Username: ${user.username} (ID: ${user.userId})`;
}

fetchUserProfile();