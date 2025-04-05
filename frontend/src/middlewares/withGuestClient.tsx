"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/components/common/Spinner";
import { api } from "@/lib/api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withGuestClient(Component: React.ComponentType<any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function WithGuestWrapper(props: any) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication using both context and API fallback
    useEffect(() => {
      const checkAuth = async () => {
        // If user is available from context and not loading, use that
        if (user && !isLoading) {
          setIsAuthenticated(true);
          setIsCheckingAuth(false);
          return;
        }

        // If we're still loading from context, wait
        if (isLoading) {
          return;
        }

        // If user isn't found in context, try API call as fallback
        try {
          // Try to fetch the user profile - if it succeeds, user is logged in
          await api.get("/auth/profile");
          setIsAuthenticated(true);
        } catch {
          // If it fails, user is not logged in
          setIsAuthenticated(false);
        } finally {
          setIsCheckingAuth(false);
        }
      };

      checkAuth();
    }, [user, isLoading]);

    // Handle redirects in a separate effect
    useEffect(() => {
      // Redirect authenticated users to home
      if (isAuthenticated) {
        router.push("/");
      }
    }, [isAuthenticated, router]);

    // If we're still checking authentication or loading the user from context
    if (isCheckingAuth || isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size={40} className="w-8 h-8" />
        </div>
      );
    }

    // Render nothing while the redirect happens
    if (isAuthenticated) {
      return null;
    }

    // If user is not authenticated, show the component
    return <Component {...props} />;
  };
}
