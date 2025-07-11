import { getToken } from "@/utils/secureStore";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import DeviceIcon from "../../assets/icons/readiness_score_outlined.svg";
import Calendar from "../../assets/icons/Vector.svg";
import { widthPercentageToDP } from "react-native-responsive-screen";
import Constants from "expo-constants";

interface Device {
  id: string;
  name: string;
  startDate: string;
  currentDate: string;
  bookmarked?: boolean;
}

interface JwtPayload {
  userID: string;
}

export default function BookmarkScreen() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const saveDevices = async (devices: Device[]) => {
    try {
      await AsyncStorage.setItem("DEVICES", JSON.stringify(devices));
    } catch (e) {
      console.error("Failed to save devices", e);
    }
  };

  // const loadDevices = async () => {
  //   try {
  //     const json = await AsyncStorage.getItem("DEVICES");
  //     return json != null ? JSON.parse(json) : [];
  //   } catch (e) {
  //     console.error("Failed to load devices", e);
  //     return [];
  //   }
  // };

  const loadDevicesFromServer = async () => {
    const token = await getToken();
    if (!token) return [];

    const decoded: JwtPayload = jwtDecode(token);
    const userID = decoded.userID;

    const API = `${Constants.expoConfig?.extra?.apiUrl}/device/getDevices`;

    const response = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID }),
    });

    if (!response.ok) throw new Error("Failed to fetch devices");
    const data = await response.json();

    // ✅ คัดกรองเฉพาะ device ที่ Bookmark = true
    const bookmarkedDevices = data
      .filter((d: any) => d.Bookmark === true)
      .map((d: any) => ({
        id: d.DeviceID,
        name: d.DeviceName,
        startDate: new Date(d.CreateDate).toLocaleDateString("th-TH"),
        currentDate: formatCurrentDate(),
        bookmarked: d.Bookmark,
        usage: d.Usage,
        status: d.Status,
      }));

    return bookmarkedDevices;
  };
  useFocusEffect(
    useCallback(() => {
      const fetchDevices = async () => {
        try {
          const serverDevices = await loadDevicesFromServer();
          setDevices(serverDevices);
          saveDevices(serverDevices); // เก็บไว้ local (option)
        } catch (e) {
          console.error("Error loading from server:", e);
        }
      };
      fetchDevices();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    const loaded = await loadDevicesFromServer();
    const currentDateString = formatCurrentDate();
    const updatedDevices = loaded.map((device: Device) => ({
      ...device,
      currentDate: currentDateString,
    }));

    setDevices(updatedDevices);
    saveDevices(updatedDevices);
    setRefreshing(false);
  }, []);

  // Format start date (kept as is)
  const formatStartDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format current date to dd/mm/yyyy - h:mm AM/PM format
  const formatCurrentDate = () => {
    const now = new Date();

    // Format the date part as dd/mm/yyyy
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString(); // Months are 0-indexed
    const year = now.getFullYear();

    // Format the time part as h:mm AM/PM
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12; // Convert to 12-hour format

    // Combine into final format: dd/mm/yyyy - h:mm AM/PM
    return `${day}/${month}/${year} - ${hours12}:${minutes} ${ampm}`;
  };

  // Update current date for all devices
  const updateCurrentDates = useCallback(() => {
    const currentDateString = formatCurrentDate();
    setDevices((prevDevices) =>
      prevDevices.map((device) => ({
        ...device,
        currentDate: currentDateString,
      }))
    );
  }, []);

  // Update current time periodically
  useEffect(() => {
    // Update immediately on component mount
    updateCurrentDates();

    // Set up interval to update every minute
    const interval = setInterval(() => {
      updateCurrentDates();
    }, 60000); // Update every minute (60000 ms)

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [updateCurrentDates]);

  const handleBookmarkToggle = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return;

      const decoded: JwtPayload = jwtDecode(token);
      const userID = decoded.userID;

      const updatedDevices = devices.map((device) => {
        if (device.id === id) {
          return { ...device, bookmarked: !device.bookmarked };
        }
        return device;
      });

      setDevices(updatedDevices);
      await AsyncStorage.setItem("DEVICES", JSON.stringify(updatedDevices));

      const toggledDevice = updatedDevices.find((d) => d.id === id);
      const API = `${process.env.EXPO_PUBLIC_API_URL}/device/changeBookmark`;

      // ✅ ส่งข้อมูลไป backend เพื่อบันทึก Bookmark ใหม่
      await fetch(API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID,
          deviceID: id,
          bookmark: toggledDevice?.bookmarked ?? false,
        }),
      });
    } catch (error) {
      console.error("Failed to update bookmark:", error);
    }
  };

  const handleNavigate = (device: Device) => {
    router.push({ pathname: "/dashboard", params: { id: device.id } });
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleConfirmedDelete = () => {
    if (deleteId) {
      const updated = devices.filter((d) => d.id !== deleteId);
      setDevices(updated);
      saveDevices(updated);
    }
    setShowConfirm(false);
    setDeleteId(null);
  };

  const renderDevice = ({ item, index }: { item: Device; index: number }) => {
    const isEven = index % 2 === 0;
    return (
      <TouchableOpacity onPress={() => handleNavigate(item)}>
        <View
          style={[
            styles.deviceCard,
            {
              backgroundColor: isEven ? "#2d2d2d" : "#eff2fa",
            },
          ]}
        >
          <View style={styles.deviceRow}>
            <DeviceIcon
              width={25}
              height={25}
              color={isEven ? "white" : "black"}
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.deviceName, { color: isEven ? "#fff" : "#000" }]}
            >
              Device : {item.name}
            </Text>
            <View style={styles.statusDot} />
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Ionicons
                name={item.bookmarked ? "bookmark" : "bookmark-outline"}
                size={20}
                color={isEven ? "#40dd7f" : "#40dd7f"}
                onPress={() => handleBookmarkToggle(item.id)}
              />
              <Ionicons
                name="trash-outline"
                size={20}
                color="#ff4d4f"
                onPress={() => confirmDelete(item.id)}
              />
            </View>
          </View>
          <View style={styles.dateRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="time-outline" size={16} color="#4F82D9" />
              <Text style={[styles.label, { color: isEven ? "#fff" : "#000" }]}>
                START DATE
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Calendar width={16} height={16} />
              <Text style={[styles.label, { color: isEven ? "#fff" : "#000" }]}>
                CURRENT DATE
              </Text>
            </View>
          </View>
          <View style={styles.dateRow}>
            <Text
              style={[styles.dateValue, { color: isEven ? "#ccc" : "#444" }]}
            >
              {item.startDate}
            </Text>
            <Text
              style={[
                styles.dateValue,
                {
                  color: isEven ? "#ccc" : "#444",
                },
              ]}
            >
              {item.currentDate}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // ✅ Render each device card (List view)
  const renderDonut = () => {
    return (
      <View style={styles.chartRow}>
        {/* Fault */}
        <View
          style={styles.chartCol}
          pointerEvents="none"
          renderToHardwareTextureAndroid={true}
        >
          <CircularProgress
            value={50}
            maxValue={100}
            radius={20}
            progressValueColor="#fff"
            valueSuffix="%"
            titleColor="#ff5e5e"
            titleStyle={styles.titleText}
            activeStrokeColor="#ff9248"
            inActiveStrokeColor="#2d2d2d"
            activeStrokeWidth={5}
            inActiveStrokeWidth={5}
            duration={0} // เปลี่ยนจาก 1000 เป็น 0 เพื่อปิด animation
            clockwise={false}
            strokeLinecap="round"
          />
        </View>

        {/* Normal */}
        <View
          style={styles.chartCol}
          pointerEvents="none"
          renderToHardwareTextureAndroid={true}
        >
          <CircularProgress
            value={100}
            maxValue={100}
            radius={20}
            progressValueColor="#fff"
            valueSuffix="%"
            titleColor="#3fde7f"
            titleStyle={styles.titleText}
            activeStrokeColor="#3fde7f"
            inActiveStrokeColor="#2d2d2d"
            activeStrokeWidth={5}
            inActiveStrokeWidth={5}
            duration={0}
            clockwise={true}
            strokeLinecap="round"
          />
        </View>
      </View>
    );
  };

  // ✅ Render grid item
  const renderGridItem = ({ item }: { item: Device }) => (
    <TouchableOpacity onPress={() => handleNavigate(item)}>
      <View style={styles.gridCard}>
        <View style={styles.topRow}>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <View style={styles.statusDot} />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.deviceId, { flexShrink: 1 }]}
            >
              {item.name}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Ionicons
              name={item.bookmarked ? "bookmark" : "bookmark-outline"}
              size={16}
              color="#3fde7f"
              onPress={() => handleBookmarkToggle(item.id)}
            />
            <Ionicons
              name="trash-outline"
              size={16}
              color="#ff4d4f"
              onPress={(e) => {
                e.stopPropagation();
                confirmDelete(item.id);
              }}
            />
          </View>
        </View>

        {renderDonut()}
        <View style={styles.rowCenter}>
          <Text style={styles.labelRed}>Fault</Text>
          <Text style={styles.labelGreen}>Normal</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 32, fontFamily: "Koulen" }}>BOOKMARK</Text>
      </View>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { fontSize: 15 }]}>Bookmark</Text>
        <View style={styles.viewModeToggle}>
          <TouchableOpacity
            style={[
              styles.viewButton,
              viewMode === "list" && styles.activeButton,
            ]}
            onPress={() => setViewMode("list")}
          >
            <Ionicons
              name="filter-outline"
              size={20}
              color={viewMode === "list" ? "#fff" : "#000"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewButton,
              viewMode === "grid" && styles.activeButton,
            ]}
            onPress={() => setViewMode("grid")}
          >
            <Ionicons
              name="apps-outline"
              size={20}
              color={viewMode === "grid" ? "#fff" : "#000"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={{ marginTop: -10, fontSize: 12 }}>
        This is your bookmarked device.
      </Text>

      {devices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../../assets/images/NOA.png")}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyTitle}>No Bookmarked Devices</Text>
          <Text style={styles.emptySubtitle}>
            You have not bookmarked any devices yet.
          </Text>
        </View>
      ) : (
        <>
          {/* แสดง list view ตามปกติ */}
          {viewMode === "list" && (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={devices}
              keyExtractor={(item) => item.id}
              renderItem={renderDevice}
              style={{ marginTop: 20 }}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          )}

          {/* แสดง grid view แบบมีกราฟเมื่อ Modal ไม่เปิด */}
          {viewMode === "grid" && !showConfirm && (
            <FlatList
              data={devices}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              numColumns={2}
              renderItem={renderGridItem}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              style={{ marginTop: 20 }}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          )}

          {/* แสดง grid view แบบไม่มีกราฟเมื่อ Modal เปิด */}
          {viewMode === "grid" && showConfirm && (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={devices}
              keyExtractor={(item) => item.id}
              numColumns={2}
              refreshing={refreshing}
              onRefresh={onRefresh}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleNavigate(item)}>
                  <View style={styles.gridCard}>
                    <View style={styles.topRow}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <View style={styles.statusDot} />
                        <Text style={styles.deviceId}>{item.name}</Text>
                      </View>
                      <View style={{ flexDirection: "row", gap: 6 }}>
                        <Ionicons
                          name={
                            item.bookmarked ? "bookmark" : "bookmark-outline"
                          }
                          size={16}
                          color="#fff"
                          onPress={() => handleBookmarkToggle(item.id)}
                        />
                        <TouchableOpacity
                          onPress={() => confirmDelete(item.id)}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={16}
                            color="#ff4d4f"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    {/* ไม่แสดงกราฟในส่วนนี้ */}
                    <View style={styles.rowCenter}>
                      <Text style={styles.labelRed}>Fault</Text>
                      <Text style={styles.labelGreen}>Normal</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              style={{ marginTop: 20 }}
            />
          )}
        </>
      )}

      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmTitle}>DELETE THIS DEVICE?</Text>
            <Text style={styles.confirmMessage}>
              Once your device is deleted, it cannot be recovered.
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowConfirm(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={handleConfirmedDelete}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 40,
    paddingHorizontal: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 37,
    height: 28,
  },
  title: {
    color: "#000",
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  deviceCard: {
    backgroundColor: "#2d2d2d",
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
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
    fontSize: 15,
    color: "#fff",
    fontFamily: "Koulen",
    marginHorizontal: 5,
  },
  dateValue: {
    color: "#8c8c8c",
    fontSize: 14,
    fontFamily: "Koulen",
  },
  // Grid View
  gridCard: {
    backgroundColor: "#2d2d2d",
    borderRadius: 14,
    padding: 10,
    marginBottom: 15,
    width: widthPercentageToDP("38%"), // เปลี่ยนจาก minWidth เป็น wp%
    marginHorizontal: widthPercentageToDP("2%"), // เพื่อให้ spacing ซ้ายขวาสม่ำเสมอ
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  deviceId: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Koulen",
  },
  rowCenter: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 4,
  },
  // Labels
  chartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    paddingHorizontal: 4,
  },
  chartCol: {
    alignItems: "center",
    flex: 1,
  },
  titleText: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 2,
  },
  labelRed: {
    color: "#fff",
    fontFamily: "Koulen",
  },
  labelGreen: {
    color: "#fff",
    fontFamily: "Koulen",
  },
  // View Mode Toggle
  viewModeToggle: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 10,
    gap: 4,
  },
  viewButton: {
    padding: 6,
    borderRadius: 6,
  },
  activeButton: {
    backgroundColor: "#555",
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  emptyImage: {
    width: 140,
    height: 110,
    marginBottom: 20,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 10,
    fontFamily: "Koulen",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 30,
    fontFamily: "Koulen",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmModal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  confirmTitle: {
    fontSize: 25,
    fontFamily: "Koulen",
    marginBottom: 10,
    textAlign: "center",
  },
  confirmMessage: {
    fontSize: 13,
    fontFamily: "Koulen",
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
  },
  confirmButtons: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 12,
  },
  cancelText: {
    textAlign: "center",
    color: "#333",
    fontSize: 25,
    fontWeight: "bold",
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#E53935",
    borderRadius: 10,
    paddingVertical: 12,
  },
  deleteText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
  },
});
