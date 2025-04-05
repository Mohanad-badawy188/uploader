"use client";

import { FileUpdatePayload } from "@/hooks/useFileUpdates";
import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext<{
  lastUpdate: FileUpdatePayload | null;
  setLastUpdate: (update: FileUpdatePayload) => void;
}>({
  lastUpdate: null,
  setLastUpdate: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [lastUpdate, setLastUpdate] = useState<FileUpdatePayload | null>(null);

  return (
    <NotificationContext.Provider value={{ lastUpdate, setLastUpdate }}>
      {children}
    </NotificationContext.Provider>
  );
};
