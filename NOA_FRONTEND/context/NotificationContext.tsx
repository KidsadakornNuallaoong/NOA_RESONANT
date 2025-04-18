import React, { createContext, useContext, useEffect, useState } from "react";
import {
  initNotificationWS,
  closeNotificationWS,
} from "@/service/wsNotificationService";
import { getToken } from "@/utils/secureStore";
import { jwtDecode } from "jwt-decode";

interface NotificationItem {
  type: "warning" | "caution" | "success" | "expire";
  title: string;
  message: string;
  details: string;
  time: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  return context;
};

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const wsUri = process.env.EXPO_PUBLIC_WS_URI;

  useEffect(() => {
    const setupWS = async () => {
      const token = await getToken();
      if (!token || !wsUri) return;

      const { userID } = jwtDecode<{ userID: string }>(token);
      const wsUrl = `${wsUri}/ws/notification/${userID}`;

      initNotificationWS(wsUrl, (parsed) => {
        const now = new Date();
        const newNoti: NotificationItem = {
          ...parsed,
          time: now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setNotifications((prev) => [newNoti, ...prev]);
      });
    };

    setupWS();
    return () => closeNotificationWS();
  }, []);

  const clearNotifications = () => setNotifications([]);

  return (
    <NotificationContext.Provider value={{ notifications, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
