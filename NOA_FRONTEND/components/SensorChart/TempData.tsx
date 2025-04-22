import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import TempIcon from "@/assets/icons/device_thermostat_fixed.svg";

interface Props {
  value: number;
}

const getColor = (value: number) => {
  if (value < 30) return "#3FDE7F"; // เขียว
  if (value < 50) return "#FFA726"; // ส้ม
  return "#EF5350"; // แดง
};

const TempGauge: React.FC<Props> = ({ value }) => {
  const color = getColor(value);

  return (
    <View style={styles.wrapper}>
      <AnimatedCircularProgress
        size={180}
        width={10}
        fill={value}
        tintColor={getColor(value)}
        backgroundColor="#2d2d2d"
        rotation={180}
        arcSweepAngle={360}
        duration={500}
      >
        {() => (
          <View style={styles.inner}>
            <TempIcon width={60} height={60} color="#fff" />
            <Text style={styles.tempText}>{value.toFixed(2)}°C</Text>
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};

export default TempGauge;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginVertical: 20,
  },
  inner: {
    backgroundColor: "#2d2d2d",
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  tempText: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "Koulen",
    marginTop: 6,
  },

  value: {
    marginTop: 6,
    fontSize: 24,
    fontFamily: "Koulen",
    color: "#fff",
  },
});
