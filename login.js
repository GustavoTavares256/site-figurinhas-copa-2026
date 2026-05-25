const API_URL = "http://localhost:3000/auth/login";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

loginForm.addEventListener("submit", async event => {
  event.preventDefault();

  const loginData = {
    email: emailInput.value,
    password: passwordInput.value
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(loginData)
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Erro ao fazer login.");
      return;
    }

    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("adminName", data.admin.name);

    alert("Login realizado com sucesso!");

    window.location.href = "admin.html";

  } catch (error) {
    console.log(error);
    alert("Erro ao conectar com o servidor.");
  }
});