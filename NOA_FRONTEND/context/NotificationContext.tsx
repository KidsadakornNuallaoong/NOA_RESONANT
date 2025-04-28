import React, { createContext, useContext, useEffect, useState } from "react";
import {
  initNotificationWS,
  closeNotificationWS,
} from "@/service/wsNotificationService";
import { getToken } from "@/utils/secureStore";
import { jwtDecode } from "jwt-decode";

export interface NotificationItem {
  type: "warning" | "caution" | "success" | "expire";
  title: string;
  message: string;
  details: string;
  time: string;
  read?: boolean;
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
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
};

export const useNotificationCount = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("Must use within NotificationProvider");
  return context.notifications.filter((n) => !n.read).length;
};

// ✅ Mapping function
const mapIncomingToNotification = (data: any): NotificationItem | null => {
  // ❌ ไม่เอา Close กับ Normal
  if (data.predictedClass === "Close" || data.predictedClass === "Normal") {
    return null;
  }

  // ✅ เอาเฉพาะ Fault
  if (data.predictedClass === "Fault") {
    const maxProb = Math.max(
      ...(data.result?.map((r: number[]) => r[2]) ?? [0])
    );

    return {
      type: "warning", // Fault = warning
      title: "Prediction Alert",
      message: `Device ${data.deviceID} is predicted as Fault`,
      details: `Highest Probability: ${maxProb.toFixed(2)}%`,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: false,
    };
  }

  // ✅ กรณีข้อความทั่วไป
  return {
    type: data.type || "warning",
    title: data.title || "Notification",
    message: data.message || "You have a new message",
    details: data.details || "Details not provided",
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    read: false,
  };
};

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const wsUri = process.env.EXPO_PUBLIC_WEBSOCKET_URL; // WebSocket URL

  useEffect(() => {
    const setupWS = async () => {
      const token = await getToken();
      if (!token || !wsUri) return;

      const { userID } = jwtDecode<{ userID: string }>(token);
      const wsUrl = `${wsUri}/ws/notification?userID=${userID}`;

      initNotificationWS(wsUrl, (incomingData) => {
        const newNoti = mapIncomingToNotification(incomingData);
        if (!newNoti) return; // ❌ ถ้า null = ไม่เอาเข้า
        setNotifications((prev) => [newNoti, ...prev]);
      });
    };

    setupWS();
    return () => closeNotificationWS();
  }, []);

  const clearNotifications = () => setNotifications([]);
  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <NotificationContext.Provider
      value={{ notifications, clearNotifications, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
