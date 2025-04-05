import React from "react";
import Notifications from "./Notifications/Notifications";
import UserProfile from "./Profile/UserProfile";
import { useAuth } from "@/context/AuthContext";
import { useFileUpdates } from "@/hooks/useFileUpdates";

export default function Navbar() {
  const { user } = useAuth();
  useFileUpdates(user?.id ? +user.id : undefined);
  return (
    <header className="flex items-center justify-end border-b px-4 md:px-6 py-4">
      <div className="flex items-center gap-2 md:gap-4">
        <Notifications />
        <UserProfile />
      </div>
    </header>
  );
}
