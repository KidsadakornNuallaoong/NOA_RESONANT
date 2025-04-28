import wsDashboard from "@/service/wsDashboard";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import AxisSelector from "./AxisSelector";
import ChartSection from "./ChartSection";
import DeviceDate from "./DeviceDate";
import SensorDataTable from "./SensorDataTable";

interface Props {
  sensorKey: keyof SensorReading["x"];
  title: string;
  unitLabel?: string;
  userID: string;
  deviceID: string;
  deviceName: string;
}

interface SensorReading {
  x: { [key: string]: number };
  y: { [key: string]: number };
  z: { [key: string]: number };
  datetime: string;
}

const SensorChart = ({
  sensorKey,
  title,
  unitLabel = "",
  userID,
  deviceID,
  deviceName,
}: Props) => {
  const [selectedAxes, setSelectedAxes] = useState({
    x: true,
    y: true,
    z: true,
  });
  const [xData, setXData] = useState<{ x: number; y: number }[]>([]);
  const [yData, setYData] = useState<{ x: number; y: number }[]>([]);
  const [zData, setZData] = useState<{ x: number; y: number }[]>([]);
  const [historyData, setHistoryData] = useState<
    { x: number; y: number; z: number }[]
  >([]);

  useFocusEffect(
    React.useCallback(() => {
      const socket = wsDashboard(userID, deviceID);

      const handleMessage = (event: MessageEvent) => {
        try {
          const payload = JSON.parse(event.data);
          const d = payload.data;
          const time = Date.now();
          const MAX_RECORDS = 200;
          const newReading: SensorReading = {
            datetime: new Date().toISOString(),
            x: {
              acceleration: d.X.Acceleration,
              velocityangular: d.X.VelocityAngular,
              vibrationspeed: d.X.VibrationSpeed,
              vibrationangle: d.X.VibrationAngle,
              vibrationdisplacement: d.X.VibrationDisplacement,
              frequency: d.X.Frequency,
            },
            y: {
              acceleration: d.Y.Acceleration,
              velocityangular: d.Y.VelocityAngular,
              vibrationspeed: d.Y.VibrationSpeed,
              vibrationangle: d.Y.VibrationAngle,
              vibrationdisplacement: d.Y.VibrationDisplacement,
              frequency: d.Y.Frequency,
            },
            z: {
              acceleration: d.Z.Acceleration,
              velocityangular: d.Z.VelocityAngular,
              vibrationspeed: d.Z.VibrationSpeed,
              vibrationangle: d.Z.VibrationAngle,
              vibrationdisplacement: d.Z.VibrationDisplacement,
              frequency: d.Z.Frequency,
            },
          };

          setXData((prev) => [
            ...prev.slice(-MAX_RECORDS + 1),
            { x: time, y: newReading.x[sensorKey] },
          ]);
          setYData((prev) => [
            ...prev.slice(-MAX_RECORDS + 1),
            { x: time, y: newReading.y[sensorKey] },
          ]);
          setZData((prev) => [
            ...prev.slice(-MAX_RECORDS + 1),
            { x: time, y: newReading.z[sensorKey] },
          ]);

          setHistoryData((prev) => [
            {
              x: newReading.x[sensorKey],
              y: newReading.y[sensorKey],
              z: newReading.z[sensorKey],
            },
            ...prev.slice(0, MAX_RECORDS + 1),
          ]);
        } catch (error) {
          console.error("WebSocket data error:", error);
        }
      };

      socket.addEventListener("message", handleMessage);

      return () => {
        socket.removeEventListener("message", handleMessage);
        socket.close();
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <DeviceDate deviceName={deviceName} deviceID={deviceID} userID={userID} />

      <View style={styles.headerRow}>
        <Text style={styles.title}>{title.toUpperCase()}: LINE PLOT</Text>
      </View>
      <View style={{ height: 230, width: "100%" }}>
        {xData.length === 0 && yData.length === 0 && zData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image
              source={require("../../assets/images/NOA.png")}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>No Data Available</Text>
            <Text style={styles.emptySubtitle}>
              Waiting for real-time sensor data to appear.
            </Text>
          </View>
        ) : (
          <ChartSection
            xData={xData}
            yData={yData}
            zData={zData}
            selectedAxes={selectedAxes}
          />
        )}
      </View>

      {/* ✅ แสดง AxisSelector เฉพาะเมื่อมีข้อมูล */}
      {xData.length > 0 || yData.length > 0 || zData.length > 0 ? (
        <AxisSelector
          selectedAxes={selectedAxes}
          setSelectedAxes={setSelectedAxes}
        />
      ) : null}

      {/* ✅ แสดงตารางเฉพาะเมื่อมีข้อมูล */}
      {xData.length > 0 || yData.length > 0 || zData.length > 0 ? (
        <SensorDataTable
          data={historyData}
          title={title}
          unitLabel={unitLabel}
        />
      ) : null}
    </View>
  );
};

export default SensorChart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: "Koulen",
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyImage: {
    width: 120,
    height: 100,
    marginBottom: 12,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#666",
    fontFamily: "Koulen",
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    fontFamily: "Koulen",
  },
});
