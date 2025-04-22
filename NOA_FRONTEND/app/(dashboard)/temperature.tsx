// TemperatureScreen.tsx
import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useState } from "react";
import DeviceDate from "@/components/SensorChart/DeviceDate";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import wsDashboard from "@/service/wsDashboard";
import TempData from "@/components/SensorChart/TempData";

const TemperatureScreen = () => {
  const { id, userID, deviceName } = useLocalSearchParams();

  const deviceID = typeof id === "string" ? id : "";
  const user = typeof userID === "string" ? userID : "";
  const name = typeof deviceName === "string" ? deviceName : "";

  const [temperature, setTemperature] = useState<number>(0);
  const [data, setData] = useState<{ timestamp: string; value: number }[]>([]);

  useFocusEffect(
    useCallback(() => {
      const socket = wsDashboard(user, deviceID);
      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const d = payload.data;
          const now = new Date();
          const time = now.toLocaleTimeString([], { hour12: true });
          setTemperature(d.Temperature);
          setData((prev) => [
            { timestamp: time, value: d.Temperature },
            ...prev.slice(0, 9),
          ]);
        } catch (err) {
          console.error("Temperature WS error", err);
        }
      };
      return () => socket.close();
    }, [user, deviceID])
  );

  return (
    <View style={styles.container}>
      <DeviceDate deviceID={deviceID} userID={user} deviceName={name} />
      <TempData value={temperature} />

      <Text style={styles.tableTitle}>TEMPERATURE</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.tableCol}>TIMESTAMP</Text>
        <Text style={styles.tableCol}>TEMPERATURE</Text>
      </View>

      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.row,
              { backgroundColor: index % 2 === 0 ? "#ffffff" : "#f2f4fa" },
            ]}
          >
            <Text style={styles.rowText}>{item.timestamp}</Text>
            <Text style={styles.rowText}>{item.value.toFixed(2)}°C</Text>
          </View>
        )}
      />
    </View>
  );
};

export default TemperatureScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Koulen",
    marginTop: 20,
    marginBottom: 6,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#111",
    padding: 10,
  },
  tableCol: {
    color: "#fff",
    fontFamily: "Koulen",
    fontSize: 13,
    flex: 1,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  rowText: {
    fontSize: 16,
    fontFamily: "Koulen",
    flex: 1,
    textAlign: "center",
  },
});
