import React, { createContext, useContext, useEffect, useState } from "react";
import { getToken } from "@/utils/secureStore";
import { jwtDecode } from "jwt-decode";
import Constants from "expo-constants";
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
  const wsUri = Constants.expoConfig?.extra?.websocketUrl;

  useEffect(() => {
    const setupWS = async () => {
      const token = await getToken();
      if (!token || !wsUri) return;
      const { userID } = jwtDecode<{ userID: string }>(token);
      const wsUrl = `${wsUri}/ws/history?userID=${userID}`;

      initHistoryWS(wsUrl, (data) => {
        if (!data.predictedClass || !data.deviceID) return;
        const item: PredictionItem = {
          type: data.predictedClass === "Fault" ? "WARNING" : "CAUTION",
          deviceID: data.deviceID,
          predictionClass: data.predictionClass,
          probability: parseFloat(data.result?.[0]?.[2]?.toFixed(2)) || 0,
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
