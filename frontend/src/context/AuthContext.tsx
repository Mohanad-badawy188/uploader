"use client";

import { createContext, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/types/User";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

type AuthContextType = {
  user: User | null;
  login: (user?: User) => void;
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

  useEffect(() => {
    if (error) {
      // router.push("/login");
    }
  }, [error, router]);

  return (
    <AuthContext.Provider value={{ user: user ?? null, login, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
