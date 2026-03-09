import http from "./http";

export const register = async (payload) => {
  const { data } = await http.post("/auth/register", payload);
  return data;
};

export const login = async (payload) => {
  const { data } = await http.post("/auth/login", payload);
  return data;
};

export const getMe = async () => {
  const { data } = await http.get("/auth/me");
  return data;
};

export const changePassword = async (payload) => {
  const { data } = await http.patch("/auth/change-password", payload);
  return data;
};
