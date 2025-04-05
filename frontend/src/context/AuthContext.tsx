"use client";

import { createContext, useCallback, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/types/User";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import { api } from "@/lib/api";

type AuthContextType = {
  user: User | null;
  login: (user?: User) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isPublicPage = ["/login", "/signup"].includes(pathname);
  const shouldFetch = typeof window !== "undefined" && !isPublicPage;

  const {
    data: user,
    isLoading,
    error,
    mutate,
  } = useSWR<User | null>(shouldFetch ? "/auth/profile" : null, fetcher);

  const login = (user?: User) => {
    if (user) {
      mutate(user, { revalidate: false });
    } else {
      mutate(); // refetch from server
    }
  };

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");

      mutate(null, false);

      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);

      mutate(null, false);
      router.push("/login");
    }
  }, [mutate, router]);

  useEffect(() => {
    if (error) {
      logout();
    }
  }, [error, router, logout]);

  return (
    <AuthContext.Provider
      value={{ user: user ?? null, login, logout, isLoading }}
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
