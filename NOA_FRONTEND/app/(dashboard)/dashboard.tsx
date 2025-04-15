import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useFonts } from "expo-font";
import DeviceIcon from "../../assets/icons/assistant_device.svg";
// === Sensor Data ===
const rawData = [
  { category: "Acceleration", values: { X: 28.356, Y: 16.258, Z: 16.935 } },
  { category: "VelocityAngul", values: { X: 23.586, Y: 24.986, Z: 30.525 } },
  { category: "VibrationSpd", values: { X: 10.562, Y: 25.658, Z: 40.895 } },
  { category: "VibrationAngle", values: { X: 10.562, Y: 25.658, Z: 40.895 } },
  { category: "Vibration Dis", values: { X: 10.562, Y: 25.658, Z: 40.895 } },
  { category: "Frequency", values: { X: 10.562, Y: 25.658, Z: 40.895 } },
];

const categoryMap: { [key: string]: string } = {
  Acceleration: "ACC",
  VelocityAngul: "VEL.ANG",
  VibrationSpd: "VIB.SPD",
  VibrationAngle: "VIB.ANG",
  "Vibration Dis": "VIB.DIS",
  Frequency: "FREQ",
};

const sensorData = rawData.flatMap((item) => {
  const shortLabel = categoryMap[item.category] || item.category;
  return Object.entries(item.values).map(([axis, value]) => ({
    label: `${axis}.${shortLabel}`,
    value,
  }));
});

export default function DashboardScreen() {
  const router = useRouter();

  // === Fonts ===
  const [fontLoaded] = useFonts({
    Koulen: require("../../assets/fonts/Koulen-Regular.ttf"),
  });

  // === Theme ===

  // === Time state ===
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      const date = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      setDateStr(date);
      setTimeStr(time);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!fontLoaded) return <Text>Loading...</Text>;

  const renderSensorItem = ({ item }: any) => (
    <View style={styles.sensorCard}>
      <DeviceIcon color={"#000"} width={18} height={18} />
      <Text style={styles.sensorLabel}>{item.label}</Text>
      <Text style={styles.sensorValue}>{item.value.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      {/* Header */}
      {/* <View style={styles.header}>
        <Ionicons name="chevron-back" size={26} color="#000" />
        <Text style={styles.title}>OVERVIEW</Text>
        <Ionicons name="ellipsis-vertical" size={20} color="#000" />
      </View> */}

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View>
          <Text style={styles.infoLabel}>CURRENT DATE & TIME</Text>
          <Text style={styles.infoDate}>{dateStr}</Text>
          <Text style={styles.infoTime}>{timeStr}</Text>
        </View>

        <View style={styles.divider} />

        <View style={{ alignItems: "flex-end" }}>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>ONLINE</Text>
          </View>
          <Text style={styles.deviceLabel}>DEVICE</Text>
          <Text style={styles.deviceName}>VIB01</Text>
        </View>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>VIBRATION SENSOR DATA NOW</Text>
        <View style={styles.toggleIcons}>
          <Ionicons name="filter" size={22} color="#555" />
          <Ionicons name="apps-outline" size={22} color="#000" />
        </View>
      </View>

      {/* Sensor Grid */}
      <FlatList
        key={"3cols"}
        data={sensorData}
        numColumns={3}
        keyExtractor={(item) => item.label}
        renderItem={renderSensorItem}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("5%"),
    marginTop: hp("5%"),
    marginBottom: hp("2%"),
  },
  flatList: {
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 20,
    fontFamily: "Koulen",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#222",
    padding: 15,
    height: 148,
    marginVertical: hp("7%"),
    marginBottom: 19,
    marginHorizontal: wp("5%"),
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
    color: "#d7d7d7",
    fontSize: 25,
    fontFamily: "Koulen",
  },
  infoTime: {
    color: "#d7d7d7",
    fontSize: 25,
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
    fontSize: 30,
    fontFamily: "Koulen",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp("8%"),
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Koulen",
    color: "#000",
  },
  toggleIcons: {
    flexDirection: "row",
    gap: 10,
  },
  gridContainer: {
    paddingHorizontal: wp("5%"),
    paddingBottom: hp("10%"),
  },
  sensorCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    width: wp("27%"),
    height: hp("10%"),
    marginHorizontal: wp("1.5%"),
    marginVertical: hp("1.5 %"),
  },
  sensorLabel: {
    fontSize: 16,
    fontFamily: "Koulen",
    marginHorizontal: 5,
    color: "#222",
  },
  sensorValue: {
    fontSize: 25,
    fontFamily: "Koulen",
    color: "#777",
    marginBottom: 2,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#222",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: {
    alignItems: "center",
  },
  navLabel: {
    fontSize: 10,
    fontFamily: "Koulen",
    color: "#fff",
    marginTop: 3,
  },
});
