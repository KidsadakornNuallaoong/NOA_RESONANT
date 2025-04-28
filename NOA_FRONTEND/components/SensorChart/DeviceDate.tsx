import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Device from "../../assets/icons/cable_colorable.svg";

interface DeviceDateProps {
  deviceName: string;
  userID: string;
  deviceID: string;
}

const DeviceDate = ({ deviceName, userID, deviceID }: DeviceDateProps) => {
  useEffect(() => {
    console.log("Device ID:", deviceID);
    console.log("User ID:", userID);
    console.log("Device Name:", deviceName);
  }, []);

  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const day = now.getDate();
      const month = now.toLocaleString("default", { month: "long" });
      const year = now.getFullYear();
      const date = `${day} ${month} ${year}`;

      const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      setDateStr(date);
      setTimeStr(time);
    };

    // 🔹 เรียกทันทีรอบแรกก่อน setInterval
    updateDateTime();

    // 🔁 แล้วค่อยเริ่ม interval
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ alignItems: "center", marginTop: hp("2%") }}>
      <View style={styles.infoCard}>
        <View>
          {/* <Text style={styles.infoLabel}>CURRENT DATE & TIME</Text> */}
          <Text style={styles.infoDate}>{dateStr}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginVertical: 5,
            }}
          >
            <Text style={styles.infoTime}>{timeStr}</Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Text style={[styles.deviceName, { color: "gray" }]}> from</Text>
              <Text style={styles.deviceName}>{deviceName}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={{ alignItems: "flex-end" }}>
          <View style={styles.statusRow}>
            <Device width={30} height={30} color={"#4CAF50"} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default DeviceDate;

const styles = StyleSheet.create({
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#2d2d2d",
    padding: 15,
    height: 60,
    width: 238,
    marginVertical: hp("2%"),
    marginBottom: 19,
    borderRadius: 12,
    justifyContent: "space-around",
    alignItems: "center",
  },
  infoLabel: {
    color: "#a0a0a0",
    fontSize: 16,
    fontFamily: "Koulen",
  },
  infoDate: {
    color: "#fff",
    fontSize: 25,
    fontFamily: "Koulen",
  },
  infoTime: {
    color: "gray",
    fontSize: 12,
    fontFamily: "Koulen",
  },
  divider: {
    height: "100%",
    width: 2,
    backgroundColor: "#444",
    marginHorizontal: 12,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: "#4CAF50",
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    color: "#bbb",
    fontSize: 14,
    fontFamily: "Koulen",
  },
  deviceLabel: {
    color: "#fff",
    fontSize: 30,
    fontFamily: "Koulen",
  },
  deviceName: {
    color: "#4CAF50",
    fontSize: 12,
    fontFamily: "Koulen",
  },
});
