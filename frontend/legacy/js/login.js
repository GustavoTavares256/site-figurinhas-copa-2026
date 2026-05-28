const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: emailInput.value.trim(),
        password: passwordInput.value
      })
    });

    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("adminRefreshToken", data.refreshToken);
    localStorage.setItem("adminName", data.admin.name);

    window.location.href = "admin.html";
  } catch (error) {
    alert(error.message || "Erro ao fazer login.");
  }
});
