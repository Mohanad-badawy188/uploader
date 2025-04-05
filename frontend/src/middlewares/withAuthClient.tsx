"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/components/common/Spinner";

type Role = "USER" | "ADMIN";

const protectedRoutes: Record<string, Role[]> = {
  "/": ["USER", "ADMIN"],
  "/admin": ["ADMIN"],
  "/files": ["USER", "ADMIN"],
  "/upload": ["USER", "ADMIN"],
  "/logs": ["ADMIN"],
  "/users": ["ADMIN"],
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

    const route = Object.keys(protectedRoutes)
      .sort((a, b) => b.length - a.length)
      .find((path) => pathname?.startsWith(path));

    useEffect(() => {
      if (!user && !isLoading) {
        router.push("/login");
        return;
      }

      if (user?.role && !isLoading) {
        const role = user.role as Role;
        setUserRole(role);

        if (route) {
          const allowedRoles = protectedRoutes[route];
          if (allowedRoles.includes(role)) {
            setIsAuthorized(true);
          } else {
            router.push("/404");
          }
        } else {
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

    return null;
  };
}
