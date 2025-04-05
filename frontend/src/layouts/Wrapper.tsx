"use client";

import { usePathname } from "next/navigation";
import type React from "react"; // Import React
import Navbar from "@/components/layouts/Navbar";
import Sidebar from "@/components/layouts/Sidebar";
import { NotificationProvider } from "@/context/NotificationContext";
import AuthLoader from "@/components/auth/AuthLoader";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideOn = ["/login", "/signup"];

  if (hideOn.includes(pathname)) return children;
  return (
    <AuthLoader>
      <NotificationProvider>
        <div className="flex flex-col min-h-screen bg-white">
          <div className="flex flex-1">
            <Sidebar />
            <div className="flex flex-col flex-1 w-full">
              <Navbar />
              <main className="flex-1 overflow-y-auto pb-20 sm:pb-6">
                {children}
              </main>
            </div>
          </div>
        </div>
      </NotificationProvider>
    </AuthLoader>
  );
}
