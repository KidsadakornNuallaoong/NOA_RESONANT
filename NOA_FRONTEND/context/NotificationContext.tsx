// ✅ NotificationContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  initNotificationWS,
  closeNotificationWS,
} from "@/service/wsNotificationService";
import { getToken } from "@/utils/secureStore";
import { jwtDecode } from "jwt-decode";
import Constants from "expo-constants";

export interface NotificationItem {
  type: "warning" | "caution" | "success" | "expire";
  title: string;
  message: string;
  details: string;
  time: string;
  read?: boolean; // ✅ เพิ่มฟิลด์ read
}

interface NotificationContextType {
  notifications: NotificationItem[];
  clearNotifications: () => void;
  markAllAsRead: () => void;
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

// ✅ Hook สำหรับแสดงจำนวน noti ที่ยังไม่ได้อ่าน
export const useNotificationCount = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("Must use within NotificationProvider");
  return context.notifications.filter((n) => !n.read).length;
};

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  useEffect(() => {
    const wsUri = Constants.expoConfig?.extra?.notiSocketUrl;
    const setupWS = async () => {
      const token = await getToken();
      if (!token || !wsUri) return;

      const { userID } = jwtDecode<{ userID: string }>(token);
      // const wsUrl = ${wsUri}/ws/notification?userID=${userID};
      const wsUrl = `${wsUri}/ws`;

      initNotificationWS(wsUrl, (parsed) => {
        console.log("📥 Received from WebSocket:", parsed); // ⬅️ ต้องเห็น
        const now = new Date();
        const newNoti: NotificationItem = {
          ...parsed,

          time: now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          read: false,
        };
        setNotifications((prev) => [newNoti, ...prev]);
      });
    };

    setupWS();
    return () => closeNotificationWS();
  }, []);

  const clearNotifications = () => setNotifications([]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, clearNotifications, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
