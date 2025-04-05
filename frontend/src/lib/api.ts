import axios from "axios";

// For debugging purposes
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
console.log("API base URL:", baseURL);

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
