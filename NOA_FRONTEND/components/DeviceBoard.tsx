import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

interface DateTimeProps {
  day: number;
  month: string;
  year: number;
  time: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  isDaytime: "AM" | "PM";
}

interface DeviceBoardProps {
  isOnline?: boolean;
  deviceName: string;
}

const DeviceBoard: React.FC<DeviceBoardProps> = ({ isOnline, deviceName }) => {
  // * current date and time
  const [date, setDate] = React.useState<DateTimeProps>({
    day: new Date().getDate(),
    month: new Date().toLocaleString("default", { month: "long" }),
    year: new Date().getFullYear(),
    time: {
      hours: new Date().getHours(),
      minutes: new Date().getMinutes(),
      seconds: new Date().getSeconds(),
    },
    isDaytime: new Date().getHours() >= 12 ? "PM" : "AM",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = new Date();
      setDate({
        day: currentDate.getDate(),
        month: currentDate.toLocaleString("default", { month: "long" }),
        year: currentDate.getFullYear(),
        time: {
          hours: currentDate.getHours(),
          minutes: currentDate.getMinutes(),
          seconds: currentDate.getSeconds(),
        },
        isDaytime: currentDate.getHours() >= 12 ? "PM" : "AM",
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.dateTime}>
        <Text
          style={[styles.dateTitle, styles.font]}
        >{`Current Date & Time`}</Text>
        <Text
          style={[styles.date, styles.font]}
        >{`${date.day} ${date.month} ${date.year}`}</Text>
        <Text style={[styles.time, styles.font]}>
          {`${date.time.hours.toString().padStart(2, "0")}:${date.time.minutes
            .toString()
            .padStart(2, "0")}:${date.time.seconds
            .toString()
            .padStart(2, "0")} ${date.isDaytime}`}
        </Text>
      </View>
      <View style={styles.line} />
      <View style={styles.device}>
        <View style={styles.statusTitle}>
          <View
            style={[
              styles.circleStatus,
              { backgroundColor: isOnline ? "#3FDE7F" : "#FF3D00" },
            ]}
          />
          <Text style={[styles.deviceStatus, styles.font]}>
            {isOnline ? `Online` : `Offline`}
          </Text>
        </View>
        <Text style={[styles.deviceTitle, styles.font]}>{`Device`}</Text>
        <Text
          style={[styles.deviceName, { color: isOnline ? "#3FDE7F" : "#aaa" }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {isOnline ? deviceName : "No connection"}
        </Text>
      </View>
    </View>
  );
};

export default DeviceBoard;

const styles = StyleSheet.create({
  container: {
    height: "20%",
    width: "100%",
    backgroundColor: "#2d2d2d",
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignSelf: "center",
    borderRadius: 10,
    flexDirection: "row",
    rowGap: 10,
  },
  font: {
    fontFamily: "Koulen",
    textTransform: "uppercase",
  },
  line: {
    height: "80%",
    width: 5,
    backgroundColor: "#fff",
    opacity: 0.2,
    marginTop: 20,
  },
  dateTitle: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.5,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dateTime: {
    flex: 2,
    justifyContent: "space-around",
    flexDirection: "column",
  },
  date: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  time: {
    fontSize: 23,
    color: "#fff",
    opacity: 0.8,

    fontWeight: "bold",
  },
  device: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "column",
  },
  deviceTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  deviceName: {
    fontSize: 20,
    color: "#3FDE7F",
    fontWeight: "bold",
    overflow: "hidden",
    width: "100%",
    textAlign: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
  deviceStatus: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.5,
    fontWeight: "bold",
    marginBottom: 10,
    paddingLeft: 10,
  },
  statusTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  circleStatus: {
    height: 10,
    width: 10,
    borderRadius: 50,
    marginTop: 5,
  },
});
