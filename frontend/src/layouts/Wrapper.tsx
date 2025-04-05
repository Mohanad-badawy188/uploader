"use client";

import { usePathname } from "next/navigation";
import type React from "react"; // Import React
import Navbar from "@/components/layouts/Navbar";
import Sidebar from "@/components/layouts/Sidebar";
import { NotificationProvider } from "@/context/NotificationContext";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideOn = ["/login", "/signup"];

  if (hideOn.includes(pathname)) return children;
  return (
    <NotificationProvider>
      <div className="flex flex-col h-screen bg-white">
        <div className="flex min-h-0 flex-1">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-auto p-4">{children}</main>
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
}
