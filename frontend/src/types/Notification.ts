export interface Notification {
  id: string;
  message: string;
  status: "read" | "unread";
  createdAt: string;
  fileId: string;
}

export interface NotificationData {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}
