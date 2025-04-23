// ✅ NotificationContext.tsx (with mapping support for prediction data)
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
  if (!context)
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  return context;
};

export const useNotificationCount = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("Must use within NotificationProvider");
  return context.notifications.filter((n) => !n.read).length;
};

const mapIncomingToNotification = (data: any): NotificationItem => {
  if (data.predictedClass) {
    return {
      type: data.predictedClass === "Fault" ? "warning" : "caution",
      title: "Prediction Alert",
      message: `Device ${data.deviceID} is predicted as ${data.predictedClass}`,
      details: `Probability: ${data.result?.[0]?.[2]?.toFixed(2) ?? "?"}%`,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: false,
    };
  }

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

  useEffect(() => {
    const wsUri = Constants.expoConfig?.extra?.websocketUrl;

    const setupWS = async () => {
      const token = await getToken();
      if (!token || !wsUri) return;

      const { userID } = jwtDecode<{ userID: string }>(token);
      const wsUrl = `${wsUri}/ws/notificaton?userID=${userID}`;

      initNotificationWS(wsUrl, (incomingData) => {
        const newNoti = mapIncomingToNotification(incomingData);
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
