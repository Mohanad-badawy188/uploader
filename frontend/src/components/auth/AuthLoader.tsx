"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Spinner from "@/components/common/Spinner";
import { api } from "@/lib/api";

interface AuthLoaderProps {
  children: React.ReactNode;
}

export default function AuthLoader({ children }: AuthLoaderProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const publicPages = ["/login", "/signup"];
  const isPublicPage = publicPages.includes(pathname || "");

  useEffect(() => {
    if (isPublicPage) {
      setIsCheckingAuth(false);
      return;
    }

    if (!isLoading) {
      if (!user) {
        router.push("/login");
      }
      setIsCheckingAuth(false);
      return;
    }

    const checkAuth = async () => {
      try {
        await api.get("/auth/profile");
        setIsCheckingAuth(false);
      } catch (error) {
        router.push("/login");
      }
    };

    if (isLoading) {
      checkAuth();
    }
  }, [user, isLoading, router, pathname, isPublicPage]);

  useEffect(() => {
    if (isPublicPage) {
      setShowContent(true);
      return;
    }

    if (!isCheckingAuth) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isCheckingAuth, isPublicPage]);

  if (isPublicPage) {
    return <>{children}</>;
  }

  if (isCheckingAuth || !showContent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size={40} />
      </div>
    );
  }

  return <>{children}</>;
}
