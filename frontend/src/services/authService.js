import api from "./api";

export async function loginAdmin(credentials) {
  const { data } = await api.post("/auth/login", credentials);
  return data;
}
