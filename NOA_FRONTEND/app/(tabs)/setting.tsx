import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { clearToken, clearRememberedEmail } from "@/utils/secureStore";
import { router } from "expo-router";

const SettingScreen = () => {
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await clearToken();
          // await clearRememberedEmail(); // ลบ email ที่จำไว้
          router.replace("/"); // ไปหน้า login
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setting</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d2d2d",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#A0F5C2",
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: "#ff4d4f",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
