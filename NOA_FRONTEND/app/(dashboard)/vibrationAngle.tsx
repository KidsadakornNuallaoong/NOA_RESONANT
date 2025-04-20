import { StyleSheet, Text, View } from "react-native";
import React from "react";
import SensorChart from "@/components/SensorChart/SensorChart";
import { useLocalSearchParams } from "expo-router";

const VibrationAngleScreen = () => {
  const { id, userID, deviceName } = useLocalSearchParams();

  // ป้องกันกรณีเป็น string[]
  const deviceID = typeof id === "string" ? id : "";
  const user = typeof userID === "string" ? userID : "";
  const name = typeof deviceName === "string" ? deviceName : "";
  return (
    <View style={styles.container}>
      <SensorChart
        sensorKey="vibrationangle"
        title="VIBRATION ANGLE"
        unitLabel="(G)"
        userID={user}
        deviceID={deviceID}
        deviceName={name}
      />
    </View>
  );
};

export default VibrationAngleScreen;

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
