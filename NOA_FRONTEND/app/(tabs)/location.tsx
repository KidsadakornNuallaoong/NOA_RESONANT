import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const LocationScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 24 }} /> {/* Spacer to balance layout */}
        <Text style={styles.title}>FIELD LOCATION</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Factory Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/images/NOA.png")}
          style={styles.factoryImage}
          resizeMode="contain"
        />
      </View>

      {/* Zoom Buttons */}
      <View style={styles.zoomButtons}>
        <TouchableOpacity style={styles.zoomBtn}>
          <Ionicons name="search-outline" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomBtn}>
          <Ionicons name="search" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Under development notice */}
      <Text style={styles.devNote}>⚠️ This Feature is under development</Text>
    </SafeAreaView>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefefe",
  },
  header: {
    marginTop: 40,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: "Koulen",
    fontSize: 18,
    color: "#000",
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 40,
  },
  factoryImage: {
    width: 300,
    height: 300,
  },
  zoomButtons: {
    position: "absolute",
    bottom: 60,
    right: 20,
    gap: 12,
  },
  zoomBtn: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  devNote: {
    textAlign: "center",
    color: "#ff8800",
    fontSize: 14,
    marginBottom: 20,
    fontFamily: "Koulen",
  },
});
