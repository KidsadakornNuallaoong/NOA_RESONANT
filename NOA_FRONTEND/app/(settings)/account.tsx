import { getToken } from "@/utils/secureStore";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Link } from "expo-router";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface JwtPayload {
  userID: string;
}

interface User {
  username: string;
  phone: string;
  email: string;
  gender: string;
}

const AccountScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editableField, setEditableField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "***************",
    gender: "Select",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = await getToken();
      if (!token) return;

      const decoded: JwtPayload = jwtDecode(token);
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/userID`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: decoded.userID }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setFormData({
          username: data.username || "",
          phone: data.phone || "",
          email: data.email || "",
          password: "***************",
          gender: data.gender || "Select",
        });
      } else {
        console.log("User fetch failed");
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  // const handleSave = async () => {
  //   try {
  //     const token = await getToken();
  //     if (!token) return;

  //     const decoded: JwtPayload = jwtDecode(token);

  //     const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/updateUser`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userID: decoded.userID,
  //         ...formData,
  //       }),
  //     });

  //     if (res.ok) {
  //       Alert.alert("Success", "Changes saved successfully!");
  //       setEditableField(null);
  //     } else {
  //       Alert.alert("Error", "Failed to save changes.");
  //     }
  //   } catch (error) {
  //     console.error("Save error:", error);
  //     Alert.alert("Error", "An error occurred while saving.");
  //   }
  // };

  const renderField = (label: string, key: keyof typeof formData) => {
    const isEditing = editableField === key;
    const iconName = key === "gender" ? "chevron-down" : "pencil";

    return (
      <View style={styles.inputBox}>
        <View style={styles.horizontalRow}>
          <Text style={styles.inputLabel}>{label}</Text>

          {key === "gender" && isEditing ? (
            <Picker
              selectedValue={formData.gender}
              style={styles.picker}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, gender: value }))
              }
            >
              <Picker.Item label="Select" value="Select" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          ) : isEditing ? (
            <TextInput
              style={styles.inputValue}
              value={formData[key]}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, [key]: text }))
              }
              autoFocus
            />
          ) : (
            <Text style={styles.inputValue}>{formData[key]}</Text>
          )}

          <TouchableOpacity
            onPress={() => setEditableField(isEditing ? null : key)}
          >
            <Ionicons name={iconName} size={18} color="#4D67DE" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading || !user) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#40C375" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="light-content" translucent={false} />

      {/* Header */}
      <View style={styles.header}>
        <Link href={"/setting"} asChild>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
        </Link>
        <Image
          source={require("../../assets/images/NOA.png")}
          style={styles.avatar}
        />
        <Text style={styles.name}>{formData.username.toUpperCase()}</Text>
        <Text style={styles.email}>{formData.email}</Text>
      </View>

      {/* Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>USER INFORMATION</Text>
        {renderField("Name", "username")}
        {renderField("Phone", "phone")}
        {renderField("Email", "email")}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SECURITY</Text>
        {renderField("Password", "password")}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ADDITIONAL INFORMATION</Text>
        {renderField("Gender", "gender")}
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  email: {
    color: "#68d391",
    fontSize: 13,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  inputBox: {
    backgroundColor: "#E7E7E7",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  horizontalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputLabel: {
    color: "#666",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 12,
    minWidth: 70,
  },
  inputValue: {
    flex: 1,
    color: "#000",
    fontSize: 14,
  },
  picker: {
    flex: 1,
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#4D67DE",
    paddingVertical: 14,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AccountScreen;
