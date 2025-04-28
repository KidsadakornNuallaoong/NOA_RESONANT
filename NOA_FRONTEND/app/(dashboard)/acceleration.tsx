import SensorChart from "@/components/SensorChart/SensorChart";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";

// === Component ===
const AccelerationScreen = () => {
  const { id, userID, deviceName } = useLocalSearchParams();

  // ป้องกันกรณีเป็น string[]
  const deviceID = typeof id === "string" ? id : "";
  const user = typeof userID === "string" ? userID : "";
  const name = typeof deviceName === "string" ? deviceName : "";

  return (
    <View style={styles.container}>
      <SensorChart
        sensorKey="acceleration"
        title="ACCELERATION"
        unitLabel="(G)"
        userID={user}
        deviceID={deviceID}
        deviceName={name}
      />
    </View>
  );
};

export default AccelerationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
