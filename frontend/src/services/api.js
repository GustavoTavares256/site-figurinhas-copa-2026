import axios from "axios";

const fallbackApiUrl =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000/api"
    : "https://site-figurinhas-copa-2026.onrender.com/api";

export const API_BASE_URL = import.meta.env.VITE_API_URL || fallbackApiUrl;
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      localStorage.getItem("adminRefreshToken")
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken: localStorage.getItem("adminRefreshToken")
        });

        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminRefreshToken", data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.token}`;

        return api(originalRequest);
      } catch {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRefreshToken");
      }
    }

    return Promise.reject(error);
  }
);

export function getApiError(error, fallback = "Erro ao comunicar com a API.") {
  return error.response?.data?.message || error.message || fallback;
}

export function getImageUrl(image) {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${API_ORIGIN}${image}`;
}

export function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export default api;
