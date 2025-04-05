"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/components/common/Spinner";
import Cookies from "js-cookie";

// Cookie name constants - keep consistent with AuthContext
const TOKEN_COOKIE_NAME = "auth_token";
const USER_COOKIE_NAME = "auth_user";

type Role = "USER" | "ADMIN";

// Define protected routes with corresponding allowed roles
// Order is important - more specific routes should come first
const protectedRoutes: Record<string, Role[]> = {
  // Admin-only routes
  "/logs": ["ADMIN"],
  "/users": ["ADMIN"],

  // User and admin routes
  "/files/": ["USER", "ADMIN"], // This covers individual file pages like /files/123
  "/files": ["USER", "ADMIN"],
  "/upload": ["USER", "ADMIN"],
  "/profile": ["USER", "ADMIN"],

  // Dashboard is accessible to both
  "/": ["USER", "ADMIN"],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withAuthClient(Component: React.ComponentType<any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function WithAuthWrapper(props: any) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userRole, setUserRole] = useState<Role | null>(null);

    // Find matching route by sorting routes by specificity
    // This ensures /admin matches before / for paths like /admin/settings
    const route = Object.keys(protectedRoutes)
      .sort((a, b) => b.length - a.length)
      .find((path) => pathname?.startsWith(path));

    useEffect(() => {
      // Check for token in cookie
      const hasToken = !!Cookies.get(TOKEN_COOKIE_NAME);

      // Try to get user from cookie if not in context
      let cookieUser = null;
      if (!user) {
        try {
          const userJson = Cookies.get(USER_COOKIE_NAME);
          if (userJson) {
            cookieUser = JSON.parse(userJson);
          }
        } catch (e) {
          console.error("Error parsing user from cookie:", e);
        }
      }

      // Use either context user or cookie user
      const effectiveUser = user || cookieUser;

      // If no user data and not loading, and no token, redirect to login
      if (!effectiveUser && !isLoading && !hasToken) {
        router.push("/login");
        return;
      }

      // If we have user data and role, check authorization
      if (effectiveUser?.role && !isLoading) {
        const role = effectiveUser.role as Role;
        setUserRole(role);

        // Check if current route requires authorization
        if (route) {
          const allowedRoles = protectedRoutes[route];
          if (allowedRoles.includes(role)) {
            // User has permission for this route
            setIsAuthorized(true);
          } else {
            // User doesn't have permission - redirect to 404
            console.log(
              `User with role ${role} attempted to access restricted route ${pathname}`
            );
            router.push("/404");
          }
        } else {
          // Route not in our protected list, so it's public or doesn't exist
          // Let's allow access and let the page handle permissions if needed
          setIsAuthorized(true);
        }
      }
    }, [user, isLoading, pathname, route, router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size={40} className="w-8 h-8" />
        </div>
      );
    }

    if (isAuthorized) {
      return <Component {...props} userRole={userRole} />;
    }

    // Show nothing while redirecting
    return null;
  };
}
