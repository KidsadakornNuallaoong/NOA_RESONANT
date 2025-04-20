import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { clearToken, getToken } from "@/utils/secureStore";
import { Link, router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as Clipboard from "expo-clipboard";

interface JwtPayload {
  userID: string;
  message: string;
}

interface User {
  username: string;
  email: string;
}

export default function SettingScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("system");
  const [userID, setUserID] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [fontsLoaded] = useFonts({
    Koulen: require("../../assets/fonts/Koulen-Regular.ttf"),
  });

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#40C375" />
      </View>
    );
  }

  const handleCopyUserID = async () => {
    if (userID) {
      await Clipboard.setStringAsync(userID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const token = await getToken();
      if (!token) return;

      const decoded: JwtPayload = jwtDecode(token);
      const userID = decoded.userID;
      setUserID(userID);

      try {
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/userID`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID }),
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          console.log("Fetch user failed");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Confirm Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await clearToken();
          router.replace("/");
        },
        style: "destructive",
      },
    ]);
  };

  const renderThemeOption = (label: string, value: string, icon: any) => (
    <TouchableOpacity style={styles.optionRow} onPress={() => setTheme(value)}>
      <Ionicons name={icon} size={24} color="#444" />
      <Text style={styles.optionLabel}>{label}</Text>
      <View style={styles.radioOuter}>
        {theme === value && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#40C375" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#eeeeee" }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Image
          source={require("@/assets/images/NOA.png")} // ✅ เปลี่ยน path เป็นรูปจริง
          style={styles.avatar}
        />
        <Text style={styles.username}>{user?.username?.toUpperCase()}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {userID && (
          <View style={styles.userIdBox}>
            <Text style={styles.userIdLabel}>User ID : </Text>
            <View style={styles.userIdRow}>
              <Text style={styles.userIdValue}>
                {`${userID.slice(0, 6)}••••••${userID.slice(-4)}`}
              </Text>
              <TouchableOpacity onPress={handleCopyUserID}>
                <Ionicons
                  name={copied ? "checkmark" : "copy-outline"}
                  size={20}
                  color={copied ? "#40dd7f" : "#40dd7f"}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Account */}
      <ScrollView style={styles.card}>
        <Text style={[styles.sectionTitle]}>ACCOUNT SETTING</Text>
        <Link href={"/account"} asChild>
          <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="person-circle" size={24} color="#3182ce" />
            <Text style={styles.optionLabel}>Account</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#aaa" />
          </TouchableOpacity>
        </Link>
        <Link href={"/credit"} asChild>
          <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="card" size={24} color="#3182ce" />
            <Text style={styles.optionLabel}>Credit</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#aaa" />
          </TouchableOpacity>
        </Link>

        {/* Themes setting */}
        <Text style={styles.sectionTitle}>THEME SETTING</Text>
        {renderThemeOption("Light Mode", "light", "sunny")}
        {renderThemeOption("Dark Mode", "dark", "moon")}
        {renderThemeOption("System Default", "system", "settings")}

        {/* Other */}
        <Text style={styles.sectionTitle}>OTHER</Text>
        <TouchableOpacity style={styles.optionRow}>
          <Ionicons name="refresh-circle" size={24} color="#c53030" />
          <Text style={[styles.optionLabel]}>Reset Settings</Text>
        </TouchableOpacity>

        {/* Subscription */}
        <Link href={"/(settings)/subscription"} asChild>
          <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="refresh-circle" size={24} />
            <Text style={[styles.optionLabel]}>SUBSCRIPTION</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#aaa" />
          </TouchableOpacity>
        </Link>

        {/* Delete Accout */}
        <TouchableOpacity style={styles.optionRow}>
          <Text
            style={[styles.optionLabel, { color: "#c53030", fontSize: 18 }]}
          >
            Delete Account
          </Text>
        </TouchableOpacity>
        {/* Logut */}
        <TouchableOpacity style={styles.optionRow} onPress={handleLogout}>
          <Text
            style={[
              styles.optionLabel,
              { color: "#c53030", paddingBottom: 20, fontSize: 18 },
            ]}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headerContainer: {
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  username: {
    fontSize: 25,
    fontFamily: "Koulen",
    color: "#fff",
  },
  email: {
    fontSize: 14,
    color: "#68d391",
    fontWeight: "bold",
    marginTop: 4,
  },
  userIdBox: {
    backgroundColor: "#2d2d2d",
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 15,
    alignItems: "center",
    width: "43%",
  },
  userIdLabel: {
    fontSize: 14,
    color: "#aaa",
    fontFamily: "Koulen",
  },
  userIdRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  userIdValue: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Koulen",
  },
  card: {
    marginTop: -20,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 30,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Koulen",
    color: "#4d4d4d",
    marginTop: 5,
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: "#000",
    fontFamily: "Koulen",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#888",
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    backgroundColor: "#111",
    borderRadius: 5,
  },
  spanAccount: {
    marginTop: 30,
    alignSelf: "center",
    backgroundColor: "#ff4d4f",
    paddingHorizontal: 50,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 30,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
