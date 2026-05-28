const API_BASE_URL = window.APP_CONFIG.apiBaseUrl;

function getImageUrl(image) {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${API_BASE_URL.replace("/api", "")}${image}`;
}

function getToken() {
  return localStorage.getItem("adminToken");
}

async function refreshToken() {
  const currentRefreshToken = localStorage.getItem("adminRefreshToken");

  if (!currentRefreshToken) return null;

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: currentRefreshToken })
  });

  if (!response.ok) return null;

  const data = await response.json();
  localStorage.setItem("adminToken", data.token);
  localStorage.setItem("adminRefreshToken", data.refreshToken);

  return data.token;
}

async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getToken();

  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (response.status === 401 && token) {
    const newToken = await refreshToken();

    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers
      });
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Erro ao comunicar com a API.");
  }

  return data;
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
