import axios from "axios";
import { getStoredToken } from "../utils/storage";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://dashboard-management-z1lb.onrender.com/api"
});

http.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
