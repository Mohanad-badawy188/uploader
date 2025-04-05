import axios from "axios";

// For debugging purposes
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  return config;
});
