import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import uuid from "react-native-uuid";
import useDeviceIDSocket from "@/service/wsService";
import { getToken } from "@/utils/secureStore";
import { jwtDecode } from "jwt-decode";
import * as Clipboard from "expo-clipboard";

interface Props {
  onCreate: (device: {
    id: string;
    name: string;
    startDate: string;
    currentDate: string;
  }) => void;
}
interface JwtPayload {
  userID: string;
}
const CreateDevice: React.FC<Props> = ({ onCreate }) => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [deviceID, setDeviceID] = useState("");
  const [copied, setCopied] = useState(false);

  const now = new Date();
  const formatDate = (date: Date) =>
    `${date.toLocaleDateString("th-TH")} - ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

  // const handleNext = () => {
  //   if (!name.trim()) return Alert.alert("Error", "Enter device name");
  //   const id = (uuid.v4() as string).slice(0, 12);
  //   setDeviceId(id);
  //   setStep(2);
  // };

  const handleNext = async () => {
    const API = `${process.env.EXPO_PUBLIC_API_URL}/generteDeviceID`;
    if (!name.trim()) return Alert.alert("Error", "Enter device name");

    try {
      const response = await fetch(API);
      const data = await response.json();
      setDeviceID(data.deviceID);
      setStep(2);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch device ID");
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(deviceID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // เปลี่ยนกลับภายใน 2 วิ
  };

  const handleConfirm = async () => {
    if (!password.trim()) {
      Alert.alert("Error", "Enter your password");
      return;
    }
    try {
      const token = await getToken();
      if (!token) return;

      const decoded: JwtPayload = jwtDecode(token);
      const userID = decoded.userID;
      console.log("Sending to backend:", {
        userID,
        deviceID,
        password,
      });

      const API = `${process.env.EXPO_PUBLIC_API_URL}/createDevice`;

      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID, deviceID, password }),
      });

      if (!response.ok) {
        Alert.alert("Error", "Failed to create device");
        return;
      }

      const device = {
        id: deviceID,
        name,
        startDate: formatDate(now),
        currentDate: formatDate(now),
      };

      onCreate(device);
      reset();
    } catch (error) {
      console.error("Create device error:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const reset = () => {
    setVisible(false);
    setStep(1);
    setName("");
    setPassword("");
    setDeviceID("");
  };

  return (
    <>
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={() => setVisible(true)}>
          <Ionicons name="add-circle-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Image source={require("../assets/images/creatDevice.png")} />
            {step === 1 ? (
              <>
                <Text style={styles.title}>CREATE NEW DEVICE</Text>
                <TextInput
                  placeholder="Enter device name"
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
                <View style={styles.row}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={reset}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                    <Text style={styles.nextText}>Next</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.title}>DEVICE ID GENERATED</Text>
                <View style={styles.deviceIDBox}>
                  <Text style={styles.deviceIDText}>
                    Device ID :{" "}
                    <Text style={{ fontWeight: "500", color: "gray" }}>
                      {deviceID}
                    </Text>
                  </Text>
                  <TouchableOpacity onPress={handleCopy}>
                    <Ionicons
                      name={copied ? "checkmark-outline" : "copy-outline"}
                      size={20}
                      color={copied ? "#3fde7f" : "#999"}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.passwordRow}>
                  <TextInput
                    placeholder="Enter your password"
                    secureTextEntry={!showPassword}
                    style={[styles.inputPassword, { flex: 1 }]}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={22}
                      color="#999"
                      style={{ marginLeft: 10 }}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setStep(1)}
                  >
                    <Text style={styles.cancelText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.nextBtn}
                    onPress={handleConfirm}
                  >
                    <Text style={styles.nextText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CreateDevice;

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    right: 25,
    bottom: 30,
    backgroundColor: "#fff",
    borderRadius: 15,
    width: 70,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999, // 🔥 เพิ่มเข้าไป
    elevation: 10, // 🔥 Android
  },
  fab: {
    position: "absolute",
    backgroundColor: "#2d2d2d",
    borderRadius: 10,
    width: 58,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    elevation: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    width: "85%",
    borderRadius: 16,
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginVertical: 12,
  },
  input: {
    flexDirection: "row",
    backgroundColor: "#f0f5ff",
    borderRadius: 10,
    justifyContent: "space-between",
    width: "100%",
    fontSize: 16,
    paddingLeft: 16,
  },
  inputPassword: {
    flexDirection: "row",
    backgroundColor: "#f0f5ff",
    borderRadius: 10,
    justifyContent: "space-between",
    width: "100%",
    fontSize: 16,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f5ff",
    borderRadius: 10,
    paddingHorizontal: 12,
  },

  row: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 10,
    padding: 12,
    borderColor: "#gray",
    borderWidth: 0.3,
  },
  nextBtn: {
    flex: 1,
    backgroundColor: "#3fde7f",
    borderRadius: 10,
    padding: 12,
  },
  cancelText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 25,
  },
  nextText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 25,
    color: "#fff",
  },
  deviceIDBox: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: "space-between",
    width: "100%",
  },
  deviceIDText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
