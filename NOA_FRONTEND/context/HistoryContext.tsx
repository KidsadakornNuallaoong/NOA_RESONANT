// ✅ PredictionContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getToken } from "@/utils/secureStore";
import { jwtDecode } from "jwt-decode";
import { closeHistoryWS, initHistoryWS } from "@/service/wsHistory";

export interface PredictionItem {
  type: "WARNING" | "CAUTION";
  deviceID: string;
  predictionClass: string;
  probability: number;
  time: string;
}

interface PredictionContextType {
  predictions: PredictionItem[];
  clearPredictions: () => void;
}

const PredictionContext = createContext<PredictionContextType | undefined>(
  undefined
);

export const usePredictionHistory = () => {
  const context = useContext(PredictionContext);
  if (!context)
    throw new Error(
      "usePredictionHistory must be used within PredictionProvider"
    );
  return context;
};

export const PredictionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [predictions, setPredictions] = useState<PredictionItem[]>([]);
  const wsUri = process.env.EXPO_PUBLIC_WEBSOCKET_URL;

  useEffect(() => {
    const setupWS = async () => {
      const token = await getToken();
      if (!token || !wsUri) return;
      const { userID } = jwtDecode<{ userID: string }>(token);
      const wsUrl = `${wsUri}/ws/history?userID=${userID}`; // use this one

      const classIndexMap = {
        Fault: 2,
        Normal: 1,
        Close: 0,
      };

      initHistoryWS(wsUrl, (data) => {
        if (!data.predictedClass || !data.deviceID || !data.result) return;

        const index =
          classIndexMap[data.predictedClass as keyof typeof classIndexMap];
        const probability =
          parseFloat(data.result[0]?.[index]?.toFixed(2)) || 0;

        // ถ้า predictedClass เป็น Close แล้วไม่ต้องแสดง
        if (data.predictedClass === "Close") return;

        const item: PredictionItem = {
          type: data.predictedClass === "Fault" ? "WARNING" : "CAUTION",
          deviceID: data.deviceID,
          predictionClass: data.predictedClass,
          probability,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setPredictions((prev) => [item, ...prev]);
      });
    };

    setupWS();
    return () => closeHistoryWS();
  }, []);

  const clearPredictions = () => setPredictions([]);

  return (
    <PredictionContext.Provider value={{ predictions, clearPredictions }}>
      {children}
    </PredictionContext.Provider>
  );
};
