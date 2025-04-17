import { StyleSheet, Text, View, Image, ScrollView, ImageSourcePropType } from "react-native";
import React from "react";

type AlertItem = {
  type: "WARNING" | "CAUTION";
  icon: ImageSourcePropType;
  date: string;
  time: string;
  imbalance: string;
  overheating: string;
  timeAgo: string;
  icontext?: ImageSourcePropType;
};

const alerts: AlertItem[] = [
  {
    type: "WARNING",
    icon: require("../../assets/images/Warning.png"),
    date: "13/1/2555",
    time: "20:04:55PM",
    imbalance: "90%",
    overheating: "95%",
    timeAgo: "20 min ago.",
    icontext: require("../../assets/images/Vector1.png"),
  },
  {
    type: "WARNING",
    icon: require("../../assets/images/Warning.png"),
    date: "23/1/2555",
    time: "00:00:00AM",
    imbalance: "70%",
    overheating: "85%",
    timeAgo: "20 min ago.",
    icontext: require("../../assets/images/Vector1.png"),
  },
  {
    type: "WARNING",
    icon: require("../../assets/images/Warning.png"),
    date: "2/2/2555",
    time: "00:00:00AM",
    imbalance: "80%",
    overheating: "75%",
    timeAgo: "20 min ago.",
    icontext: require("../../assets/images/Vector1.png"),
  },
  {
    type: "CAUTION",
    icon: require("../../assets/images/Caution.png"),
    date: "4/2/2555",
    time: "00:00:00AM",
    imbalance: "40%",
    overheating: "50%",
    timeAgo: "10 min ago.",
    icontext: require("../../assets/images/Vector2.png"),
  },
  {
    type: "CAUTION",
    icon: require("../../assets/images/Caution.png"),
    date: "11/2/2555",
    time: "00:00:00AM",
    imbalance: "50%",
    overheating: "35%",
    timeAgo: "10 min ago.",
    icontext: require("../../assets/images/Vector2.png"),
  },
  {
    type: "WARNING",
    icon: require("../../assets/images/Warning.png"),
    date: "18/3/2555",
    time: "00:00:00AM",
    imbalance: "87%",
    overheating: "78%",
    timeAgo: "20 min ago.",
    icontext: require("../../assets/images/Vector1.png"),
  },
  {
    type: "CAUTION",
    icon: require("../../assets/images/Caution.png"),
    date: "11/2/2555",
    time: "00:00:00AM",
    imbalance: "50%",
    overheating: "35%",
    timeAgo: "10 min ago.",
    icontext: require("../../assets/images/Vector2.png"),
  },
];

const PredictionHisory: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerText,{fontFamily: "Koulen"}]}>PREDICTION HISTORY</Text>
      </View>

      <View style={styles.historyHeader}>
        <Text style={styles.historyText}>History</Text>
        <Image
          source={require("../../assets/images/History.png")}
          style={styles.historyIcon}
          resizeMode="contain"
        />
      </View>

      {alerts.map((alert, index) => (
        <View key={index} style={styles.alertBox}>
          <Image source={alert.icon} style={styles.alertIcon} />
          <View style={styles.alertTextContainer}>
            <Text
              style={[
                styles.alertType,
                alert.type === "WARNING" ? styles.warning : styles.caution,
              ]}
            >
              {alert.type}
              {alert.icontext && (
                <Image
                  source={alert.icontext}
                  style={styles.icontext}
                  resizeMode="contain"
                />
              )}
            </Text>

            <Text style={styles.alertDetail}>
              Date: {alert.date} Time: {alert.time}
            </Text>
            <Text style={styles.alertBold}>
              Critical Alert:{" "}
              <Text style={styles.alertNormal}>
                Device 1×80AC requires attention
              </Text>
            </Text>
            <Text style={styles.alertBold}>
              Imbalance:{" "}
              <Text style={styles.alertNormal}>{alert.imbalance}</Text>{" "}
              Overheating:{" "}
              <Text style={styles.alertNormal}>{alert.overheating}</Text>
            </Text>
            <Text style={styles.alertTimeAgo}>{alert.timeAgo}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default PredictionHisory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    paddingHorizontal: 10,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 32,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginLeft: 10,
  },
  historyText: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 5,
  },
  historyIcon: {
    width: 27,
    height: 25,
    marginTop: 2,
  },
  alertBox: {
    flexDirection: "row",
    padding: 10,
    marginTop: 10,
  },
  alertIcon: {
    width: 35,
    height: 35,
    marginRight: 10,
    marginTop: 5,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertType: {
    fontSize: 16,
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
  },
  warning: {
    color: "red",
  },
  caution: {
    color: "#fbc02e",
  },
  alertDetail: {
    fontSize: 14,
    marginTop: 2,
  },
  alertBold: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 2,
  },
  alertNormal: {
    fontWeight: "normal",
  },
  alertTimeAgo: {
    fontSize: 12,
    color: "gray",
    marginTop: 2,
  },
  icontext: {
    width: 16,
    height: 16,
  },
});