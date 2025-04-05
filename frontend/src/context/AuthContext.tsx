"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/types/User";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import { api } from "@/lib/api";
import Cookies from "js-cookie";

// Cookie configuration
const TOKEN_COOKIE_NAME = "auth_token";
const USER_COOKIE_NAME = "auth_user";
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

type AuthContextType = {
  user: User | null;
  login: (userData: { user: User; accessToken: string }) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isPublicPage = ["/login", "/signup"].includes(pathname);

  // Try to load initial user data from cookie
  const [initialUser, setInitialUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const userJson = Cookies.get(USER_COOKIE_NAME);
        return userJson ? JSON.parse(userJson) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Only fetch from API if we're not on a public page and don't have user data in cookie
  const shouldFetch =
    typeof window !== "undefined" && !isPublicPage && !initialUser;

  // Initialize SWR first to get the mutate function
  const {
    data: user,
    isLoading,
    error,
    mutate,
  } = useSWR<User | null>(shouldFetch ? "/auth/profile" : null, fetcher, {
    fallbackData: initialUser,
    revalidateOnMount: !!initialUser, // Revalidate if we have cookie data
  });

  // Define clearAuthData function for reuse
  const clearAuthData = useCallback(() => {
    // Remove token and user cookies
    Cookies.remove(TOKEN_COOKIE_NAME, { path: "/" });
    Cookies.remove(USER_COOKIE_NAME, { path: "/" });

    // Clear user data in state
    setInitialUser(null);
  }, []);

  // Implement logout function
  const logout = useCallback(async () => {
    try {
      // Call the logout endpoint

      // Clear auth data (cookies and state)
      clearAuthData();

      // Clear context data
      mutate(null, false);

      // Redirect to login
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);

      // Still clear auth data and redirect
      clearAuthData();
      mutate(null, false);
      router.push("/login");
    }
  }, [mutate, router, clearAuthData]);

  // Setup error handling for SWR
  useEffect(() => {
    const handleAuthError = (err: Error) => {
      // Immediately logout on any auth API error
      console.error("Auth API error:", err);
      clearAuthData();
      mutate(null, false);

      // Only redirect if not already on a public page
      if (!isPublicPage) {
        router.push("/login");
      }
    };

    // If there's an error, handle it
    if (error) {
      handleAuthError(error);
    }
  }, [error, clearAuthData, mutate, router, isPublicPage]);

  // Update user in state when API fetch completes
  useEffect(() => {
    if (user && user !== initialUser) {
      setInitialUser(user);
      // Also update the cookie
      Cookies.set(USER_COOKIE_NAME, JSON.stringify(user), COOKIE_OPTIONS);
    }
  }, [user, initialUser]);

  const login = useCallback(
    (userData: { user: User; accessToken: string }) => {
      // Store the token in a cookie
      if (userData.accessToken) {
        Cookies.set(TOKEN_COOKIE_NAME, userData.accessToken, COOKIE_OPTIONS);
      }

      // Store the user data in a cookie
      if (userData.user) {
        Cookies.set(
          USER_COOKIE_NAME,
          JSON.stringify(userData.user),
          COOKIE_OPTIONS
        );
      }

      // Update the user state
      if (userData.user) {
        mutate(userData.user, { revalidate: false });
      } else {
        mutate(); // refetch from server
      }
    },
    [mutate]
  );

  return (
    <AuthContext.Provider
      value={{ user: user ?? initialUser ?? null, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
