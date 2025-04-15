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

interface Props {
  onCreate: (device: {
    id: string;
    name: string;
    startDate: string;
    currentDate: string;
  }) => void;
}

const CreateDevice: React.FC<Props> = ({ onCreate }) => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [deviceId, setDeviceId] = useState("");

  const now = new Date();
  const formatDate = (date: Date) =>
    `${date.toLocaleDateString("th-TH")} - ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  // useDeviceIDSocket((id) => {
  //   setDeviceId(id);
  //   setStep(2);
  // });

  const handleNext = () => {
    if (!name.trim()) return Alert.alert("Error", "Enter device name");
    const id = (uuid.v4() as string).slice(0, 12);
    setDeviceId(id);
    setStep(2);
  };

  // const handleNext = () => {
  //   if (!name.trim()) return Alert.alert("Error", "Enter device name");
  //   // deviceId will come from WebSocket when ready
  // };

  const handleConfirm = () => {
    if (!password.trim()) return Alert.alert("Error", "Enter your password");
    const device = {
      id: deviceId,
      name,
      startDate: formatDate(now),
      currentDate: formatDate(now),
    };
    onCreate(device);
    reset();
  };

  const reset = () => {
    setVisible(false);
    setStep(1);
    setName("");
    setPassword("");
    setDeviceId("");
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
                  <Text style={styles.deviceIDText}>{deviceId}</Text>
                  <Ionicons name="copy-outline" size={20} color="#999" />
                </View>
                <TextInput
                  placeholder="Enter your password"
                  secureTextEntry
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                />
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
    width: "100%",
    backgroundColor: "#f0f5ff",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    marginBottom: 10,
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
    fontWeight: "bold",
    fontSize: 16,
  },
});
