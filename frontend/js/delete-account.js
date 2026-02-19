function deleteAccount() {
  const btn = document.getElementById("confirmDeleteBtn");
  if (!btn) return;

  btn.addEventListener("click", async function () {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login.html";
      return;
    }

    try {
      const resp = await fetch("/api/auth/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await resp.json().catch(() => ({}));

      if (resp.ok) {
        localStorage.removeItem("token");
        window.location.href = "/login.html";
      } else {
        alert(data.message || "Failed to delete account.");
        if (resp.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login.html";
        }
      }
    } catch (err) {
      console.error("Delete request failed", err);
      alert("Network error deleting account.");
    }
  });
}

deleteAccount();
