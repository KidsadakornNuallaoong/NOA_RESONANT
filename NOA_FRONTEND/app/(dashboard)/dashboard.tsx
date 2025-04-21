import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  LogBox,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useFonts } from "expo-font";
import DeviceIcon from "../../assets/icons/readiness_score.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import wsDashboard from "@/service/wsDashboard";

import { SvgProps } from "react-native-svg";

import {
  default as AccIcon,
  default as FrequencyIcon,
  default as VelocityAngularIcon,
  default as VibAngleIcon,
  default as VibDisplacementIcon,
  default as VibSpeedIcon,
} from "@/assets/icons/acute.svg";

import EachViewIconWhite from "../../assets/icons/modern-Icon/columnlist_nofill.svg";
import ListViewIconWhite from "@/assets/icons/modern-Icon/rowlist_fill.svg";

import ListViewIconBlack from "@/assets/icons/modern-Icon-black/filter_list.svg";
import EachViewIconBlack from "@/assets/icons/modern-Icon-black/widget_small.svg";
import DeviceBoard from "@/components/DeviceBoard";

// === Sensor Data ===
declare global {
  var websocket: WebSocket | undefined;
}

LogBox.ignoreLogs([
  "WebSocket error", // ignore specific warning
]);

// Or suppress all logs (not recommended for production debugging)
LogBox.ignoreAllLogs(true);

interface AxisData {
  Acceleration: number;
  VelocityAngular: number;
  VibrationSpeed: number;
  VibrationAngle: number;
  VibrationDisplacement: number;
  Frequency: number;
}

interface DataProps {
  userID: string;
  deviceID: string;
  data: {
    DeviceAddress: string;
    X: AxisData;
    Y: AxisData;
    Z: AxisData;
    Temperature: number;
  };
}

interface TitleValueProps {
  title: string;
  value: number;
}

interface DataItemProps {
  Icon: React.FC<SvgProps>;
  title: string;
  data: number;
}

const DataItem: React.FC<DataItemProps> = ({ Icon, title, data }) => (
  <View style={styles.dataItem}>
    <Icon width={25} height={25} color="#2d2d2d" />
    <Text style={[styles.title, styles.fontFamily]}>{title}</Text>
    <Text style={[styles.value, styles.fontFamily]}>
      {data.toFixed(2).padStart(5, "0")}
    </Text>
  </View>
);

const ViewData: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <View style={styles.dataContent}>{children}</View>;
};

const EachView: React.FC<{ data: DataProps }> = ({ data }) => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <ViewData>
          <DataItem
            Icon={AccIcon}
            title="X.ACC"
            data={data?.data.X.Acceleration as number}
          />
          <DataItem
            Icon={AccIcon}
            title="Y.ACC"
            data={data?.data.Y.Acceleration as number}
          />
          <DataItem
            Icon={AccIcon}
            title="Z.ACC"
            data={data?.data.Z.Acceleration as number}
          />
        </ViewData>
        <ViewData>
          <DataItem
            Icon={VelocityAngularIcon}
            title="X.Velocity"
            data={data?.data.X.VelocityAngular as number}
          />
          <DataItem
            Icon={VelocityAngularIcon}
            title="Y.Velocity"
            data={data?.data.Y.VelocityAngular as number}
          />
          <DataItem
            Icon={VelocityAngularIcon}
            title="Z.Velocity"
            data={data?.data.Z.VelocityAngular as number}
          />
        </ViewData>
        <ViewData>
          <DataItem
            Icon={VibSpeedIcon}
            title="X.Vibration"
            data={data?.data.X.VibrationSpeed as number}
          />
          <DataItem
            Icon={VibSpeedIcon}
            title="Y.Vibration"
            data={data?.data.Y.VibrationSpeed as number}
          />
          <DataItem
            Icon={VibSpeedIcon}
            title="Z.Vibration"
            data={data?.data.Z.VibrationSpeed as number}
          />
        </ViewData>
        <ViewData>
          <DataItem
            Icon={VibAngleIcon}
            title="X.Vibration"
            data={data?.data.X.VibrationAngle as number}
          />
          <DataItem
            Icon={VibAngleIcon}
            title="Y.Vibration"
            data={data?.data.Y.VibrationAngle as number}
          />
          <DataItem
            Icon={VibAngleIcon}
            title="Z.Vibration"
            data={data?.data.Z.VibrationAngle as number}
          />
        </ViewData>
        <ViewData>
          <DataItem
            Icon={VibDisplacementIcon}
            title="X.Vibration"
            data={data?.data.X.VibrationDisplacement as number}
          />
          <DataItem
            Icon={VibDisplacementIcon}
            title="Y.Vibration"
            data={data?.data.Y.VibrationDisplacement as number}
          />
          <DataItem
            Icon={VibDisplacementIcon}
            title="Z.Vibration"
            data={data?.data.Z.VibrationDisplacement as number}
          />
        </ViewData>
        <ViewData>
          <DataItem
            Icon={FrequencyIcon}
            title="X.Frequency"
            data={data?.data.X.Frequency as number}
          />
          <DataItem
            Icon={FrequencyIcon}
            title="Y.Frequency"
            data={data?.data.Y.Frequency as number}
          />
          <DataItem
            Icon={FrequencyIcon}
            title="Z.Frequency"
            data={data?.data.Z.Frequency as number}
          />
        </ViewData>
        <ViewData>
          <DataItem
            Icon={FrequencyIcon}
            title="Temperature"
            data={data?.data.Temperature as number}
          />
        </ViewData>
      </ScrollView>
    </View>
  );
};

const ListDataItem: React.FC<{
  data: number;
  title: string;
  closeTitle: boolean;
}> = ({ data, title, closeTitle = false }) => (
  <View style={styles.listDataItem}>
    {!closeTitle && (
      <Text
        style={[
          styles.title,
          styles.fontFamily,
          {
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
          },
        ]}
      >
        {title}
      </Text>
    )}
    <Text style={[styles.value, styles.fontFamily]}>
      {data.toFixed(2).padStart(5, "0")}
    </Text>
  </View>
);

const ListViewData: React.FC<{
  children: React.ReactNode;
  title: string;
  isOrd: boolean;
}> = ({ children, title, isOrd }) => {
  return (
    <View
      style={[
        styles.listDataItem,
        {
          backgroundColor: isOrd ? "#EFF2FA" : "#fff",
          height: 100,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          styles.fontFamily,
          {
            fontSize: 14,
            fontWeight: "bold",
            textAlign: "center",
          },
        ]}
      >
        {title}
      </Text>
      <View style={styles.dataContent}>{children}</View>
    </View>
  );
};

const ListView: React.FC<{ data: DataProps }> = ({ data }) => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <ListViewData title="Acceleration (G)" isOrd={true}>
          <ListDataItem
            data={data?.data.X.Acceleration}
            title="X"
            closeTitle={false}
          />
          <ListDataItem
            data={data?.data.Y.Acceleration}
            title="Y"
            closeTitle={false}
          />
          <ListDataItem
            data={data?.data.Z.Acceleration}
            title="Z"
            closeTitle={false}
          />
        </ListViewData>
        <ListViewData title="Angular Velocity (°/s)" isOrd={false}>
          <ListDataItem
            data={data?.data.X.VelocityAngular}
            title="X"
            closeTitle={false}
          />
          <ListDataItem
            data={data?.data.Y.VelocityAngular}
            title="Y"
            closeTitle={false}
          />
          <ListDataItem
            data={data?.data.Z.VelocityAngular}
            title="Z"
            closeTitle={false}
          />
        </ListViewData>
        <ListViewData title="Vibration Speed (mm/s)" isOrd={true}>
          <ListDataItem
            data={data?.data.X.VibrationSpeed}
            title="X"
            closeTitle={false}
          />
          <ListDataItem
            data={data?.data.Y.VibrationSpeed}
            title="Y"
            closeTitle={false}
          />
          <ListDataItem
            data={data?.data.Z.VibrationSpeed}
            title="Z"
            closeTitle={false}
          />
        </ListViewData>
        <ListViewData title="Vibration Angle (°)" isOrd={false}>
          <ListDataItem
            data={data?.data.X.VibrationAngle}
            title="X"
            closeTitle={false}
          />
          <ListDataItem
            data={data?.data.Y.VibrationAngle}
            title="Y"
            closeTitle={false}
          />
          <ListDataItem
            data={data?.data.Z.VibrationAngle}
            title="Z"
            closeTitle={false}
          />
        </ListViewData>
        <ListViewData title="Vibration Displacement (µm)" isOrd={true}>
          <ListDataItem
            data={data?.data.X.VibrationDisplacement}
            title="X"
            closeTitle={false}
          />
          <ListDataItem
            data={data?.data.Y.VibrationDisplacement}
            title="Y"
            closeTitle={false}
          />
          <ListDataItem
            data={data?.data.Z.VibrationDisplacement}
            title="Z"
            closeTitle={false}
          />
        </ListViewData>
        <ListViewData title="Frequency (Hz)" isOrd={false}>
          <ListDataItem
            data={data?.data.X.Frequency}
            title="X"
            closeTitle={false}
          />
          <ListDataItem
            data={data?.data.Y.Frequency}
            title="Y"
            closeTitle={false}
          />
          <ListDataItem
            data={data?.data.Z.Frequency}
            title="Z"
            closeTitle={false}
          />
        </ListViewData>
        <ListViewData title="Temperature (°C)" isOrd={true}>
          <ListDataItem
            data={data?.data.Temperature}
            title="Temp"
            closeTitle={true}
          />
        </ListViewData>
      </ScrollView>
    </View>
  );
};

interface PermissionsProps {
  id: string;
  userID: string;
  deviceName: string;
}
const dashboard = () => {
  const router = useRouter();
  // * check if userID and deviceID from local storage first and then from params
  const {
    id: paramId,
    userID: paramUserID,
    deviceName: paramDeviceName,
  } = useLocalSearchParams();

  const [id, setId] = React.useState<string | null>(null);
  const [userID, setUserID] = React.useState<string | null>(null);
  const [deviceName, setDeviceName] = React.useState<string | null>(null);

  const [viewState, setViewState] = React.useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const storedId = await AsyncStorage.getItem("id");
      const storedUserID = await AsyncStorage.getItem("userID");
      const storedDeviceName = await AsyncStorage.getItem("deviceName");

      setId((typeof paramId === "string" ? paramId : null) || storedId);
      setUserID(
        (typeof paramUserID === "string" ? paramUserID : null) || storedUserID
      );
      setDeviceName(
        (typeof paramDeviceName === "string" ? paramDeviceName : null) ||
          storedDeviceName
      );

      if (paramId) await AsyncStorage.setItem("id", paramId as string);
      if (paramUserID)
        await AsyncStorage.setItem("userID", paramUserID as string);
      if (paramDeviceName)
        await AsyncStorage.setItem("deviceName", paramDeviceName as string);
    };

    fetchData();
  }, [paramId, paramUserID, paramDeviceName]);

  const websocketURL =
    process.env.EXPO_PUBLIC_WEBSOCKET_URL +
    `/ws/boadcast?userID=${userID}&deviceID=${id}`;

  const [data, setData] = React.useState<DataProps | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      let socket: WebSocket | null = null;

      const initializeWebSocket = () => {
        try {
          // * if it working refresh websocket connect
          if (globalThis.websocket) {
            globalThis.websocket.close();
            console.log("WebSocket connection closed before reinitializing");
          }

          globalThis.websocket = new WebSocket(websocketURL);
          socket = globalThis.websocket;
          socket.onopen = () => {
            console.log("WebSocket connection opened");
          };

          socket.onmessage = (event: MessageEvent) => {
            try {
              const message = event.data;
              const parsedData = JSON.parse(message);
              setData(parsedData);
            } catch (parseError) {
              console.error("Error parsing WebSocket message:", parseError);
            }
          };

          socket.onerror = (error: Event) => {
            const errorMessage = (error as any).message;
            if (errorMessage !== "connection reset") {
              console.error("WebSocket error:", error);
            } else {
              console.log("WebSocket connection reset error handled silently");
            }
          };

          socket.onclose = (event: CloseEvent) => {
            console.log("WebSocket connection closed", event.reason || "");
          };
        } catch (error) {
          console.error("Error initializing WebSocket connection:", error);
        }
      };

      initializeWebSocket();

      return () => {
        if (socket) {
          socket.close();
          console.log("WebSocket connection cleaned up");
        }
      };
    }, [websocketURL])
  );

  const handleChangeToEachView = () => {
    setViewState(true);
  };

  const handleChangeToListView = () => {
    setViewState(false);
  };

  return (
    <View style={styles.container}>
      <DeviceBoard isOnline={true} deviceName={deviceName as string} />
      <View style={styles.dataTitleWrapper}>
        <Text style={[styles.dataTitle, styles.fontFamily]}>
          Vibration sensor data
        </Text>
        <View style={styles.btnWrapper}>
          <TouchableOpacity
            onPress={handleChangeToEachView}
            style={[
              styles.btn,
              viewState
                ? { backgroundColor: "#2d2d2d" }
                : { backgroundColor: "#fff" },
            ]}
          >
            {!viewState ? (
              <EachViewIconBlack width={20} height={20} />
            ) : (
              <EachViewIconWhite width={20} height={20} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleChangeToListView}
            style={[
              styles.btn,
              !viewState
                ? { backgroundColor: "#2d2d2d" }
                : { backgroundColor: "#fff" },
            ]}
          >
            {viewState ? (
              <ListViewIconBlack width={20} height={20} />
            ) : (
              <ListViewIconWhite width={20} height={20} />
            )}
          </TouchableOpacity>
        </View>
      </View>
      {viewState ? (
        <>
          {data?.data ? (
            <EachView data={data} />
          ) : (
            <Text>No data available</Text>
          )}
        </>
      ) : (
        <>
          {data?.data ? (
            <ListView data={data} />
          ) : (
            <Text>No data available</Text>
          )}
        </>
      )}
    </View>
  );
};

export default dashboard;
export { DataProps };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    paddingTop: 60 + 20,
    paddingBottom: 60 + 10,
    rowGap: 20,
  },
  dataItem: {
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
  },
  listDataItem: {
    flexDirection: "column",
    padding: 10,
    borderRadius: 8,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  dataContent: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
  },
  value: {
    fontSize: 20,
    opacity: 0.5,
    color: "#000",
    fontWeight: "bold",
  },
  fontFamily: {
    fontFamily: "Koulen",
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dataTitleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  btnWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  btn: {
    width: 30,
    height: 30,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
