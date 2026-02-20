async function fetchUserProfile() {
  const token = localStorage.getItem("token");

  if (!token) {
    const loginPromptDiv = document.getElementById("login-prompt");
    loginPromptDiv.innerHTML = `<p class="lead">
            <a href="./login.html" class="btn btn-md btn-primary fw-bold"
              >Log in</a
            >
          </p>
          <a href="./signup.html">Don't have an account? Sign up here</a>`;
    return;
  }

  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      displayUserData(data.user);
    } else {
      console.error("Session invalid:", data.message);
      localStorage.removeItem("token");
      window.location.href = "/login.html";
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

function displayUserData(user) {
  const loginPromptDiv = document.getElementById("login-prompt");

  if (loginPromptDiv) loginPromptDiv.innerText = `Welcome ${user.firstName}`;
}

fetchUserProfile();
