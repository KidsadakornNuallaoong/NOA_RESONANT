// ✅ React & React Native imports
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";

// ✅ Expo & Navigation imports
import { Ionicons } from "@expo/vector-icons";
import { Link, useFocusEffect, useRouter } from "expo-router";

// ✅ Custom Components & Assets
import CreateDevice from "@/components/CreateDevice";
import DeviceIcon from "../../assets/icons/readiness_score_outlined.svg";
import Calendar from "../../assets/icons/Vector.svg";
import MostUsedSlider from "@/components/MostuseDevice";

// ✅ Storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Circular chart package
import CircularProgress from "react-native-circular-progress-indicator";
import { jwtDecode } from "jwt-decode";
import { getToken } from "@/utils/secureStore";
import { useNotificationCount } from "@/context/NotificationContext";

// ✅ Type for device
interface Device {
  id: string;
  name: string;
  usage: number;
  startDate: string;
  currentDate: string;
  bookmarked?: boolean;
}

interface JwtPayload {
  userID: string;
}

export default function DeviceScreen() {
  // ✅ State
  const [devices, setDevices] = useState<Device[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // ✅ Save devices to local storage
  const saveDevices = async (devices: Device[]) => {
    try {
      await AsyncStorage.setItem("DEVICES", JSON.stringify(devices));
    } catch (e) {
      console.error("Failed to save devices", e);
    }
  };

  const notificationCount = useNotificationCount();

  const sortedDevices = useMemo(() => {
    return [...devices].sort((a, b) => b.usage - a.usage);
  }, [devices]);

  // ✅ Load devices from local storage
  const loadDevicesFromServer = async () => {
    const token = await getToken();
    if (!token) return [];

    const decoded: JwtPayload = jwtDecode(token);
    const userID = decoded.userID;

    const API = `${process.env.EXPO_PUBLIC_API_URL}/device/getDevices`;

    const response = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID }),
    });

    if (!response.ok) throw new Error("Failed to fetch devices");

    const rawData = await response.json();

    // ✅ แปลงข้อมูลให้ตรง interface
    const devices: Device[] = rawData.map((item: any) => ({
      id: item.DeviceID,
      name: item.DeviceName,
      usage: item.Usage,
      startDate: formatDate(item.CreateDate),
      currentDate: formatDate(item.CurrentDate),
      bookmarked: item.Bookmark ?? false,
    }));

    return devices;
  };

  // ✅ แปลง ISO date เป็นรูปแบบที่ใช้ในแอป
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return `${date.toLocaleDateString("th-TH")} - ${date.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`;
  };

  useFocusEffect(
    useCallback(() => {
      const fetchDevices = async () => {
        const local = await loadDevices();
        setDevices(local); // แสดง local ทันที

        try {
          const server = await loadDevicesFromServer();
          setDevices(server); // อัปเดตด้วย server
          saveDevices(server);
        } catch (e) {
          console.error("Server fetch failed:", e);
        }
      };
      fetchDevices();
    }, [])
  );

  // ✅ Load devices from local storage
  const loadDevices = async () => {
    try {
      const json = await AsyncStorage.getItem("DEVICES");
      return json != null ? JSON.parse(json) : [];
    } catch (e) {
      console.error("Failed to load devices", e);
      return [];
    }
  };

  // ✅ Load devices once on component mount
  useFocusEffect(
    useCallback(() => {
      loadDevices().then((loaded) => {
        setDevices(loaded);
      });
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const loaded = await loadDevices(); // โหลดใหม่จาก local
    setDevices(loaded);
    setRefreshing(false);
  }, []);

  // ✅ Toggle bookmark state
  const handleBookmarkToggle = (id: string) => {
    const updated = devices.map((d) =>
      d.id === id ? { ...d, bookmarked: !d.bookmarked } : d
    );
    setDevices(updated);
    saveDevices(updated);
  };

  // ✅ Create device and save
  const handleCreate = (device: Device) => {
    const updated = [...devices, device];
    setDevices(updated);
    saveDevices(updated);
  };

  // ✅ Navigate to dashboard with device ID
  const handleNavigate = async (device: Device) => {
    const updatedDevices = devices.map((d) =>
      d.id === device.id ? { ...d, usage: (d.usage || 0) + 1 } : d
    );
    setDevices(updatedDevices);
    await AsyncStorage.setItem("DEVICES", JSON.stringify(updatedDevices));

    router.push({ pathname: "/dashboard", params: { id: device.id } });
  };

  // ✅ Prepare to show delete confirmation
  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  // // ✅ Delete confirmed device
  // const handleConfirmedDelete = () => {
  //   if (deleteId) {
  //     const updated = devices.filter((d) => d.id !== deleteId);
  //     setDevices(updated);
  //     saveDevices(updated);
  //   }
  //   setShowConfirm(false);
  //   setDeleteId(null);
  // };

  // Waiting for Delete API
  // ✅ Delete device from server (commented out for now)
  const handleConfirmedDelete = async () => {
    if (!deleteId) return;

    try {
      const token = await getToken();
      if (!token) return;

      const decoded: JwtPayload = jwtDecode(token);
      const userID = decoded.userID;

      const API = `${process.env.EXPO_PUBLIC_API_URL}/device/deleteDevice`;

      const response = await fetch(API, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID, deviceID: deleteId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete from backend");
      }

      // delelete at frontend
      const updated = devices.filter((d) => d.id !== deleteId);
      setDevices(updated);
      saveDevices(updated);
    } catch (err) {
      console.error("Delete device failed:", err);
      Alert.alert("Error", "Unable to delete device from server.");
    }

    setShowConfirm(false);
    setDeleteId(null);
  };

  // ✅ Update current date every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formatted = `${now.toLocaleDateString(
        "th-TH"
      )} - ${now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
      setDevices((prev) =>
        prev.map((device) => ({
          ...device,
          currentDate: formatted,
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Render donut charts (for grid)
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
              style={[styles.deviceName, { color: isEven ? "#fff" : "#000" }]}
            >
              Device : {item.name}
            </Text>
            <View style={[styles.statusDot]} />
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Ionicons
                name="expand"
                size={20}
                color={isEven ? "#fff" : "#000"}
              />
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
              {" "}
              {item.startDate}
            </Text>
            <Text
              style={[styles.dateValue, { color: isEven ? "#ccc" : "#444" }]}
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
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.statusDot} />
            <Text style={styles.deviceId}>{item.name}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Ionicons
              name={item.bookmarked ? "bookmark" : "bookmark-outline"}
              size={16}
              color="#40dd7f"
              onPress={() => handleBookmarkToggle(item.id)}
            />
            <Ionicons
              name="trash-outline"
              size={16}
              color="#ff4d4f"
              onPress={(e) => {
                e.stopPropagation(); // หยุดการ propagate ของ event
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

  const displayedDevices = devices.filter((d) => !d.bookmarked);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/NOA.png")}
          style={styles.logo}
        />
        <Link href={"/notify"} asChild>
          <TouchableOpacity style={{ position: "relative" }}>
            <Ionicons name="notifications" size={24} color="#000" />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notificationCount > 99 ? "99+" : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </Link>
      </View>

      <Text style={[styles.title, { marginTop: 30, fontWeight: "bold" }]}>
        Device the most used
      </Text>
      <Text style={[styles.title, { fontSize: 12 }]}>
        This is your most used device
      </Text>

      <MostUsedSlider devices={sortedDevices.slice(0, 4)} />

      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Device</Text>
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

      {devices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../../assets/images/NOA.png")}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyTitle}>No Devices Found</Text>
          <Text style={styles.emptySubtitle}>
            Tap the + button below to create your first device.
          </Text>
        </View>
      ) : (
        <>
          {/* แสดง list view ตามปกติ */}
          {viewMode === "list" && (
            <FlatList
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

      {/* Add CreateDevice component with higher z-index */}
      <View style={styles.createDeviceContainer}>
        <CreateDevice onCreate={handleCreate} />
      </View>

      {/* Modal with highest z-index */}
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
    paddingTop: 50,
    paddingHorizontal: 30,
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
    color: "#000",
    fontSize: 14,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  mostUsedCard: {
    marginTop: 10,
    backgroundColor: "#2d2d2d",
    borderRadius: 10,
    padding: 15,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  toggleIcon: {
    padding: 6,
    backgroundColor: "#ccc",
    borderRadius: 8,
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
    marginBottom: 10,
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
    flex: 1,
    backgroundColor: "#2d2d2d",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    minWidth: "48%",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  deviceId: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  rowCenter: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 4,
  },
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

  // Labels
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

  // Empty State
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

  // Delete Modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999, // ค่าสูงกว่า CreateDevice
    elevation: 20, // สูงกว่า CreateDevice
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
  createDeviceContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    elevation: 10,
  },
});
