"use client";

import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatDate } from "@/helper/formatDate";
import { Notification } from "@/types/Notification";
import { useRouter } from "next/navigation";

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadNotifications: number;
  closeMenu: () => void;
}

export function NotificationDropdown({
  notifications = [],
  unreadNotifications = 0,
  closeMenu,
}: NotificationDropdownProps) {
  const router = useRouter();
  const handleClickOnNotification = (notification: Notification) => {
    router.push(`/files/${notification.fileId}`);
    closeMenu();
  };
  return (
    <DropdownMenuContent className="w-80" align="end">
      <DropdownMenuLabel className="flex justify-between items-center">
        <span>Notifications</span>
        {unreadNotifications > 0 && (
          <span className="text-xs text-muted-foreground">
            {unreadNotifications} unread
          </span>
        )}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <div className="max-h-[300px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-4 px-2 text-center text-muted-foreground">
            No notifications
          </div>
        ) : (
          <DropdownMenuGroup>
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex flex-col items-start p-3 cursor-default",
                  notification.status === "unread" && "bg-muted/50"
                )}
              >
                <button onClick={() => handleClickOnNotification(notification)}>
                  <div className="text-start w-full cursor-pointer">
                    <p className="text-sm font-medium">
                      {notification.message}
                    </p>
                  </div>
                  <p className="text-start text-xs text-muted-foreground mt-1">
                    {formatDate(notification.createdAt)}
                  </p>
                </button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        )}
      </div>
    </DropdownMenuContent>
  );
}
