// DeviceScreen.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CreateDevice from "@/components/CreateDevice";
import DeviceIcon from "../../assets/icons/readiness_score_outlined.svg";
import Calendar from "../../assets/icons/Vector.svg";
import { useFonts } from "expo-font";

interface Device {
  id: string;
  name: string;
  startDate: string;
  currentDate: string;
}

const DeviceScreen = () => {
  const [devices, setDevices] = useState<Device[]>([]);

  const [fontsLoaded] = useFonts({
    Koulen: require("../../assets/fonts/Koulen-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleCreate = (device: Device) => {
    setDevices((prev) => [...prev, device]);
  };

  const renderDevice = ({ item }: { item: Device }) => (
    <View style={styles.deviceCard}>
      <View style={styles.deviceRow}>
        <DeviceIcon width={20} height={20} color={"white"} />
        <Text style={styles.deviceName}>Device : {item.name}</Text>
        <View style={styles.statusDot} />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Ionicons name="expand" size={20} color="#fff" />
          <Ionicons name={"bookmark-outline"} size={20} color="#fff" />{" "}
        </View>
      </View>

      <View style={styles.dateRow}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="time-outline" size={16} color="#4F82D9" />
          <Text style={styles.label}>START DATE</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Calendar width={16} height={16} />
          <Text style={styles.label}>CURRENT DATE</Text>
        </View>
      </View>

      <View style={styles.dateRow}>
        <Text style={styles.dateValue}>{item.startDate}</Text>
        <Text style={[styles.dateValue, { marginLeft: 30 }]}>
          {item.currentDate}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/NOA.png")}
          style={styles.logo}
        />
        <Ionicons name="notifications" size={24} />
      </View>

      <Text style={[styles.title, { marginTop: 30, fontWeight: "bold" }]}>
        Device the most used
      </Text>
      <Text style={[styles.title, { fontSize: 12 }]}>
        This is your most used device
      </Text>

      <View style={styles.mostUsedCard}>
        <Text style={styles.deviceName}>Device Address: 1×80</Text>
        <Text style={styles.dateValue}>Graph: scatter plot</Text>
      </View>
      <Text style={{ fontWeight: "bold", marginVertical: 10, fontSize: 15 }}>
        Device
      </Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={renderDevice}
        style={{ marginTop: 20 }}
      />

      <CreateDevice onCreate={handleCreate} />
    </View>
  );
};

export default DeviceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 37,
    height: 28,
  },
  title: {
    color: "#2d2d2d",
    fontSize: 14,
  },
  mostUsedCard: {
    marginTop: 10,
    backgroundColor: "#2d2d2d",
    borderRadius: 10,
    padding: 15,
  },
  deviceCard: {
    backgroundColor: "#2d2d2d",
    borderRadius: 14,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  deviceName: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Koulen",
    flex: 1,
    marginLeft: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3fde7f",
    marginRight: 10,
  },
  dateRow: {
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Koulen",
    marginHorizontal: 4,
  },
  dateValue: {
    color: "#8c8c8c",
    fontSize: 14,
    marginTop: 2,
    fontFamily: "Koulen",
  },
});
