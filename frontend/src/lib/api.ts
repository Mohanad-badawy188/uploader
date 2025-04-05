import axios from "axios";
import Cookies from "js-cookie";

// For debugging purposes
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
console.log("API base URL:", baseURL);

// Cookie name for storing the authentication token
const TOKEN_COOKIE_NAME = "auth_token";

export const api = axios.create({
  baseURL,
});

// Add token to all requests
api.interceptors.request.use((config) => {
  // Get token from cookie instead of localStorage
  const token = Cookies.get(TOKEN_COOKIE_NAME);

  // If token exists, add it to the Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle 401 responses by redirecting to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized request, redirecting to login");
      // Clear token from cookie instead of localStorage
      Cookies.remove(TOKEN_COOKIE_NAME, { path: "/" });

      // Redirect to login if in browser
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
