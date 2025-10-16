document.addEventListener("DOMContentLoaded", () => {
  const userEmail = localStorage.getItem("userEmail");
  const authLinks = document.querySelectorAll(".auth");
  const userLinks = document.querySelectorAll(".user-only");

  // Toggle menu items
  if (userEmail) {
    authLinks.forEach(link => link.style.display = "none");
    userLinks.forEach(link => link.style.display = "inline-block");
  } else {
    authLinks.forEach(link => link.style.display = "inline-block");
    userLinks.forEach(link => link.style.display = "none");
  }

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("userEmail");
    alert("Logged out successfully!");
    window.location.href = "login.html";
  });

  // Change Password Modal
  const modal = document.getElementById("passwordModal");
  document.getElementById("changePasswordBtn").addEventListener("click", () => {
    modal.style.display = "flex";
  });
  document.getElementById("closeModal").addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Submit password change
  document.getElementById("submitPwdChange").addEventListener("click", async () => {
    const email = localStorage.getItem("userEmail");
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;

    if (!email) {
      alert("Please login first.");
      return;
    }

    const response = await fetch("http://localhost:5000/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, oldPassword, newPassword }),
    });

    const data = await response.json();
    alert(data.message);
    modal.style.display = "none";
  });
});
