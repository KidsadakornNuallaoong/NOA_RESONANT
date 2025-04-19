import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useNotifications } from "@/context/NotificationContext";

const iconMap = {
  warning: require("../assets/images/Warning.png"),
  caution: require("../assets/images/Caution.png"),
  success: require("../assets/images/Payment.png"),
  expire: require("../assets/images/Expire.png"),
};

const iconTextMap = {
  warning: require("../assets/images/Vector1.png"),
  caution: require("../assets/images/Vector2.png"),
  success: require("../assets/images/Vector3.png"),
  expire: require("../assets/images/Vector4.png"),
};

const colorMap = {
  warning: "#ff3b3b",
  caution: "#fbc02d",
  success: "#00c853",
  expire: "#ff6f00",
};

const Notification = () => {
  const { notifications, clearNotifications, markAllAsRead } =
    useNotifications();

  useEffect(() => {
    markAllAsRead();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ position: "absolute", left: 0 }}>
          <Link href={"/(tabs)/device"} asChild>
            <TouchableOpacity>
              <Ionicons name="arrow-back" size={30} color="#2d2d2d" />
            </TouchableOpacity>
          </Link>
        </View>
        <Text style={styles.headerText}>Notification</Text>
      </View>

      <View style={styles.box1}>
        <Image
          source={require("../assets/images/Notification.png")}
          style={styles.notificationIcon}
        />
        <View>
          <Text style={styles.infoTitle}>Information!</Text>
          <Text style={styles.infoText}>
            Your device is experiencing problem.{"\n"}Please check your device
          </Text>
        </View>
      </View>

      <View style={styles.box2}>
        <Text style={styles.todayText}>Today</Text>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearNotifications}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.noInformation}>
          <Text style={styles.noInfoText}>No information now.</Text>
          <Image
            source={require("../assets/images/Noinformation.png")}
            style={styles.noInfoImage}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {notifications.map((item, index) => (
            <View key={index} style={styles.notificationBox}>
              <View style={styles.row}>
                <Image source={iconMap[item.type]} style={styles.icon} />
                <View style={styles.textWrapper}>
                  <View style={styles.titleRow}>
                    <Text
                      style={[styles.title, { color: colorMap[item.type] }]}
                    >
                      {item.title}
                    </Text>
                    <Image
                      source={iconTextMap[item.type]}
                      style={styles.iconText}
                    />
                  </View>
                  <Text style={styles.message}>
                    <Text style={styles.bold}>{item.message}</Text>
                  </Text>
                  <Text style={styles.details}>{item.details}</Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 22,
    position: "relative",
  },
  headerText: {
    fontSize: 32,
    fontFamily: "Koulen",
    color: "#000",
  },
  box1: {
    backgroundColor: "#ffeaed",
    width: "100%",
    height: 86,
    borderRadius: 15,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingHorizontal: 15,
  },
  notificationIcon: {
    width: 32,
    height: 32,
    marginRight: 15,
  },
  infoTitle: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  infoText: {
    color: "#fd5c42",
    fontWeight: "bold",
  },
  box2: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  todayText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  clearButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  clearButtonText: {
    color: "#ed6047",
    fontWeight: "bold",
    fontSize: 16,
  },
  noInformation: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  noInfoText: {
    color: "#8c8c8c",
    fontWeight: "bold",
    marginBottom: 10,
  },
  noInfoImage: {
    width: 69,
    height: 69,
    resizeMode: "contain",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  notificationBox: {
    marginVertical: 10,
    padding: 10,
  },
  row: {
    flexDirection: "row",
  },
  icon: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
  textWrapper: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 5,
  },
  iconText: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  message: {
    fontSize: 14,
    marginTop: 2,
  },
  bold: {
    fontWeight: "bold",
  },
  details: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: "bold",
  },
  time: {
    fontSize: 12,
    color: "gray",
    marginTop: 4,
  },
});
