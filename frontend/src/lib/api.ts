import axios from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
console.log("API base URL:", baseURL);

const TOKEN_COOKIE_NAME = "auth_token";
const USER_COOKIE_NAME = "auth_user";

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get(TOKEN_COOKIE_NAME);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized request, redirecting to login");

      // Clear all auth cookies
      Cookies.remove(TOKEN_COOKIE_NAME, { path: "/" });
      Cookies.remove(USER_COOKIE_NAME, { path: "/" });

      Cookies.remove("auth_refresh_token", { path: "/" });

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
