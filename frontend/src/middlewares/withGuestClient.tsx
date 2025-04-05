"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/components/common/Spinner";
import Cookies from "js-cookie";

// Cookie name constants - keep consistent with AuthContext
const TOKEN_COOKIE_NAME = "auth_token";
const USER_COOKIE_NAME = "auth_user";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withGuestClient(Component: React.ComponentType<any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function WithGuestWrapper(props: any) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication using context and cookies only
    useEffect(() => {
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

      // Simply check if token and/or user data exist in cookies
      const hasToken = !!Cookies.get(TOKEN_COOKIE_NAME);
      const hasUserData = !!Cookies.get(USER_COOKIE_NAME);

      // If either exists, consider authenticated
      setIsAuthenticated(hasToken || hasUserData);
      setIsCheckingAuth(false);
    }, [user, isLoading]);

    // Redirect if authenticated
    useEffect(() => {
      if (isAuthenticated) {
        router.push("/");
      }
    }, [isAuthenticated, router]);

    // Show loading spinner while checking
    if (isCheckingAuth || isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size={40} className="w-8 h-8" />
        </div>
      );
    }

    // Don't render the guest component if authenticated
    if (isAuthenticated) {
      return null;
    }

    // If user is not authenticated, show the component
    return <Component {...props} />;
  };
}
