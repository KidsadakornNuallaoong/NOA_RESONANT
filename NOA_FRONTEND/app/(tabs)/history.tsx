// ✅ PredictionHistory.tsx
import { usePredictionHistory } from "@/context/HistoryContext";
import React from "react";
import { ScrollView, StyleSheet, Text, View, Image } from "react-native";

const iconMap = {
  WARNING: require("../../assets/images/Warning.png"),
  CAUTION: require("../../assets/images/Caution.png"),
};

const iconTextMap = {
  WARNING: require("../../assets/images/Vector1.png"),
  CAUTION: require("../../assets/images/Vector2.png"),
};

const PredictionHistory: React.FC = () => {
  const { predictions } = usePredictionHistory();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerText, { fontFamily: "Koulen" }]}>
          PREDICTION HISTORY
        </Text>
      </View>

      <View style={styles.historyHeader}>
        <Text style={styles.historyText}>History</Text>
        <Image
          source={require("../../assets/images/History.png")}
          style={styles.historyIcon}
        />
      </View>

      {predictions.map((alert, index) => (
        <View key={index} style={styles.alertBox}>
          <Image source={iconMap[alert.type]} style={styles.alertIcon} />
          <View style={styles.alertTextContainer}>
            <Text
              style={[
                styles.alertType,
                alert.type === "WARNING" ? styles.warning : styles.caution,
              ]}
            >
              {alert.type}
              <Image
                source={iconTextMap[alert.type]}
                style={styles.icontext}
                resizeMode="contain"
              />
            </Text>
            <Text style={styles.alertDetail}>Device ID: {alert.deviceID}</Text>
            <Text style={styles.alertBold}>
              Probability:{" "}
              <Text style={styles.alertNormal}>
                {alert.probability.toFixed(2)}%
              </Text>
            </Text>
            <Text style={styles.alertTimeAgo}>{alert.time}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default PredictionHistory;

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
