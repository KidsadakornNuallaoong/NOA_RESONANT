import React, { useEffect, useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import CreateDevice from "@/components/CreateDevice";
import DeviceIcon from "../../assets/icons/readiness_score_outlined.svg";
import Calendar from "../../assets/icons/Vector.svg";
import MostUsedSlider from "@/components/MostuseDevice";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Device {
  id: string;
  name: string;
  startDate: string;
  currentDate: string;
  bookmarked?: boolean;
}

export default function DeviceScreen() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const router = useRouter();

  const saveDevices = async (devices: Device[]) => {
    try {
      await AsyncStorage.setItem("DEVICES", JSON.stringify(devices));
    } catch (e) {
      console.error("Failed to save devices", e);
    }
  };

  const loadDevices = async () => {
    try {
      const json = await AsyncStorage.getItem("DEVICES");
      return json != null ? JSON.parse(json) : [];
    } catch (e) {
      console.error("Failed to load devices", e);
      return [];
    }
  };

  useEffect(() => {
    loadDevices().then((loaded) => setDevices(loaded));
  }, []);

  const handleBookmarkToggle = (id: string) => {
    const updated = devices.map((d) =>
      d.id === id ? { ...d, bookmarked: !d.bookmarked } : d
    );
    setDevices(updated);
    saveDevices(updated);
  };

  const handleCreate = (device: Device) => {
    const updated = [...devices, device];
    setDevices(updated);
    saveDevices(updated);
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

  const renderDevice = ({ item, index }: { item: Device; index: number }) => {
    const isEven = index % 2 === 0;
    return (
      <TouchableOpacity onPress={() => handleNavigate(item)}>
        <View
          style={[
            styles.deviceCard,
            { backgroundColor: isEven ? "#2d2d2d" : "#fff", borderWidth: 0.2 },
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
                color={isEven ? "#fff" : "#000"}
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

  const renderGridItem = ({ item }: { item: Device }) => (
    <TouchableOpacity onPress={() => handleNavigate(item)}>
      <View style={styles.gridCard}>
        <View style={styles.topRow}>
          <View style={styles.statusDot} />
          <Text style={styles.deviceId}>{item.name}</Text>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Ionicons
              name={item.bookmarked ? "bookmark" : "bookmark-outline"}
              size={16}
              color="#fff"
              onPress={() => handleBookmarkToggle(item.id)}
            />
            <Ionicons
              name="trash-outline"
              size={16}
              color="#ff4d4f"
              onPress={() => confirmDelete(item.id)}
            />
          </View>
        </View>
        <View style={styles.rowCenter}>
          <Text style={styles.orangeText}>60%</Text>
          <Text style={styles.grayText}>15%</Text>
        </View>
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
        <Image
          source={require("../../assets/images/NOA.png")}
          style={styles.logo}
        />
        <Link href={"/notify"} asChild>
          <TouchableOpacity>
            <Ionicons name="notifications" size={24} />
          </TouchableOpacity>
        </Link>
      </View>

      <Text style={[styles.title, { marginTop: 30, fontWeight: "bold" }]}>
        Device the most used
      </Text>
      <Text style={[styles.title, { fontSize: 12 }]}>
        This is your most used device
      </Text>

      <MostUsedSlider devices={devices.slice(0, 4)} />

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
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          key={viewMode}
          numColumns={viewMode === "grid" ? 2 : 1}
          renderItem={viewMode === "grid" ? renderGridItem : renderDevice}
          columnWrapperStyle={
            viewMode === "grid"
              ? { justifyContent: "space-between" }
              : undefined
          }
          style={{ marginTop: 20 }}
        />
      )}

      <CreateDevice onCreate={handleCreate} />
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
    padding: 15,
    marginBottom: 15,
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  deviceName: {
    color: "#fff",
    fontSize: 16,
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
    fontSize: 18,
    color: "#fff",
    fontFamily: "Koulen",
    marginHorizontal: 5,
  },
  dateValue: {
    color: "#8c8c8c",
    fontSize: 16,
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
    justifyContent: "space-between",
    marginVertical: 4,
  },

  // Labels
  orangeText: {
    color: "#ff9248",
    fontWeight: "bold",
  },
  grayText: {
    color: "#ccc",
    fontWeight: "bold",
  },
  labelRed: {
    color: "#ff5e5e",
    fontWeight: "bold",
  },
  labelGreen: {
    color: "#3fde7f",
    fontWeight: "bold",
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
