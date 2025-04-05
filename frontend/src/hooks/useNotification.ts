import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

import type { NotificationData } from "@/types/Notification";
import { usePathname } from "next/navigation";

export function useNotifications(shouldFetch: boolean) {
  const pathname = usePathname();
  const isPublicPage = ["/login", "/signup"].includes(pathname);
  const allowedToFetch = typeof window !== "undefined" && !isPublicPage;

  const { data, error, isLoading, mutate } = useSWR<NotificationData>(
    shouldFetch && allowedToFetch ? "/notifications" : null,
    fetcher
  );

  return {
    notifications: data?.notifications ?? [],
    totalNotifications: data?.total ?? 0,
    unreadNotifications: data?.unreadCount ?? 0,
    isLoading,
    isError: !!error,
    mutate,
  };
}
