"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { FaRegBell } from "react-icons/fa";
import { useNotifications } from "@/hooks/useNotification";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationDropdown } from "./NotificationDropdown";
import { api } from "@/lib/api";
import { useNotification } from "@/context/NotificationContext";

export default function Notifications() {
  const [open, setOpen] = useState(false);

  const { lastUpdate } = useNotification();

  const { notifications, unreadNotifications, mutate } = useNotifications(true);

  const closeMenu = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (lastUpdate) {
      mutate();
    }
  }, [lastUpdate, mutate]);
  useEffect(() => {
    const markAllRead = async () => {
      if (!unreadNotifications) return;
      try {
        const res = await api.patch(`notifications/mark-read`);
        if (res.data) {
          mutate();
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (open) {
      markAllRead();
    }
  }, [open, mutate, unreadNotifications]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <FaRegBell className="h-4 w-4" />
          {unreadNotifications > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
              {unreadNotifications > 99 ? "99+" : unreadNotifications}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <NotificationDropdown
        notifications={notifications}
        unreadNotifications={unreadNotifications}
        closeMenu={closeMenu}
      />
    </DropdownMenu>
  );
}
