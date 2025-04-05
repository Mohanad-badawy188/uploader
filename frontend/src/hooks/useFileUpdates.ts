import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { useNotification } from "@/context/NotificationContext";

export type FileUpdatePayload = {
  fileId: string;
  status: string;
  message?: string;
};

export function useFileUpdates(userId?: number) {
  const { setLastUpdate } = useNotification();
  useEffect(() => {
    if (!userId) return;

    const socket = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
      {
        query: { userId },
      }
    );

    socket.on("fileUpdate", (data: FileUpdatePayload) => {
      setLastUpdate(data);
      toast.info(data.message ?? `File ${data.fileId} updated`);
    });
    return () => {
      socket.disconnect();
    };
  }, [userId, setLastUpdate]);
}
