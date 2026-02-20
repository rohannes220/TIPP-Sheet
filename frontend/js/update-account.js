document.addEventListener("DOMContentLoaded", async () => {
  const nameInput = document.getElementById("firstNameInput");
  const form = document.getElementById("updateNameForm");
  const statusMsg = document.getElementById("statusMessage");
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login.html";
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
    console.log(data)
    if (response.ok) {
      nameInput.value = data.user.firstName;
    }
  } catch (error) {
    console.error("Failed to load user data", error);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusMsg.innerText = "Updating...";
    statusMsg.className = "text-white-50";

    try {
      const response = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName: nameInput.value }),
      });

      const result = await response.json();

      if (response.ok) {
        statusMsg.innerText = "Name updated successfully!";
        statusMsg.className = "text-success";
        setTimeout(() => (window.location.href = "./account.html"), 1500);
      } else {
        statusMsg.innerText = result.message || "Update failed.";
        statusMsg.className = "text-danger";
      }
    } catch (error) {
      console.error(error);
      statusMsg.innerText = "Network error.";
      statusMsg.className = "text-danger";
    }
  });
});
