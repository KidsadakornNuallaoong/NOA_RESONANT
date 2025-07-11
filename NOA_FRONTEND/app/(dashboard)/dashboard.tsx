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
import AsyncStorage from "@react-native-async-storage/async-storage";

import { SvgProps } from "react-native-svg";

import AcceIcon from "@assets/icons/readiness_score.svg";
import VelAngIcon from "@assets/icons/device_hub.svg";
import VelSpdIcon from "@assets/icons/acute.svg";
import VibAngIcon from "@assets/icons/Group 1.svg";
import VibDisIcon from "@assets/icons/animation.svg";
import FreqIcon from "@assets/icons/earthquake.svg";

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
            Icon={AcceIcon}
            title="X.ACC"
            data={data?.data.X.Acceleration as number}
          />
          <DataItem
            Icon={AcceIcon}
            title="Y.ACC"
            data={data?.data.Y.Acceleration as number}
          />
          <DataItem
            Icon={AcceIcon}
            title="Z.ACC"
            data={data?.data.Z.Acceleration as number}
          />
        </ViewData>
        <ViewData>
          <DataItem
            Icon={VelAngIcon}
            title="X.Velocity"
            data={data?.data.X.VelocityAngular as number}
          />
          <DataItem
            Icon={VelAngIcon}
            title="Y.Velocity"
            data={data?.data.Y.VelocityAngular as number}
          />
          <DataItem
            Icon={VelAngIcon}
            title="Z.Velocity"
            data={data?.data.Z.VelocityAngular as number}
          />
        </ViewData>
        <ViewData>
          <DataItem
            Icon={VelSpdIcon}
            title="X.Vibration"
            data={data?.data.X.VibrationSpeed as number}
          />
          <DataItem
            Icon={VelSpdIcon}
            title="Y.Vibration"
            data={data?.data.Y.VibrationSpeed as number}
          />
          <DataItem
            Icon={VelSpdIcon}
            title="Z.Vibration"
            data={data?.data.Z.VibrationSpeed as number}
          />
        </ViewData>
        <ViewData>
          <DataItem
            Icon={VibAngIcon}
            title="X.Vibration"
            data={data?.data.X.VibrationAngle as number}
          />
          <DataItem
            Icon={VibAngIcon}
            title="Y.Vibration"
            data={data?.data.Y.VibrationAngle as number}
          />
          <DataItem
            Icon={VibAngIcon}
            title="Z.Vibration"
            data={data?.data.Z.VibrationAngle as number}
          />
        </ViewData>
        <ViewData>
          <DataItem
            Icon={VibDisIcon}
            title="X.Vibration"
            data={data?.data.X.VibrationDisplacement as number}
          />
          <DataItem
            Icon={VibDisIcon}
            title="Y.Vibration"
            data={data?.data.Y.VibrationDisplacement as number}
          />
          <DataItem
            Icon={VibDisIcon}
            title="Z.Vibration"
            data={data?.data.Z.VibrationDisplacement as number}
          />
        </ViewData>
        <ViewData>
          <DataItem
            Icon={FreqIcon}
            title="X.Frequency"
            data={data?.data.X.Frequency as number}
          />
          <DataItem
            Icon={FreqIcon}
            title="Y.Frequency"
            data={data?.data.Y.Frequency as number}
          />
          <DataItem
            Icon={FreqIcon}
            title="Z.Frequency"
            data={data?.data.Z.Frequency as number}
          />
        </ViewData>
        <ViewData>
          <DataItem
            Icon={FreqIcon}
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
  const {
    id: paramId,
    userID: paramUserID,
    deviceName: paramDeviceName,
  } = useLocalSearchParams();

  const [id, setId] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [viewState, setViewState] = useState<boolean>(false);
  const [data, setData] = useState<DataProps | null>(null);
  const [isParamsReady, setIsParamsReady] = useState(false);

  useEffect(() => {
    console.log("Params changed →", { paramId, paramUserID, paramDeviceName });

    const updateFromParams = async () => {
      const storedId = await AsyncStorage.getItem("id");
      const storedUserID = await AsyncStorage.getItem("userID");
      const storedDeviceName = await AsyncStorage.getItem("deviceName");

      const newId = (typeof paramId === "string" ? paramId : null) || storedId;
      const newUserID =
        (typeof paramUserID === "string" ? paramUserID : null) || storedUserID;
      const newDeviceName =
        (typeof paramDeviceName === "string" ? paramDeviceName : null) ||
        storedDeviceName;

      setId(newId);
      setUserID(newUserID);
      setDeviceName(newDeviceName);
      setIsParamsReady(true);
      console.log("Current deviceName:", deviceName);
      console.log("Updated state →", { newId, newUserID, newDeviceName });
    };

    updateFromParams();
  }, [paramId, paramUserID, paramDeviceName]);

  // ✅ WebSocket setup
  useFocusEffect(
    React.useCallback(() => {
      if (!id || !userID) return;

      let socket: WebSocket | null = null;
      const wsURL = `${process.env.EXPO_PUBLIC_WEBSOCKET_URL}/ws/boadcast?userID=${userID}&deviceID=${id}`;

      console.log("Connecting WebSocket with:", wsURL);

      if (globalThis.websocket) {
        globalThis.websocket.close();
      }

      socket = new WebSocket(wsURL);
      globalThis.websocket = socket;

      socket.onopen = () => console.log("WebSocket connected");
      socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          setData(parsed);
        } catch (err) {
          console.error("Parse error", err);
        }
      };
      socket.onerror = (err) => console.error("WebSocket error", err);
      socket.onclose = () => console.log("WebSocket closed");

      return () => {
        if (socket) {
          socket.close();
          console.log("WebSocket cleaned up");
        }
      };
    }, [id, userID]) // ✅ ให้ผูกกับ id/userID โดยตรง
  );

  // useFocusEffect(
  //   React.useCallback(() => {
  //     let socket: WebSocket | null = null;

  //     const initializeWebSocket = () => {
  //       try {
  //         // * if it working refresh websocket connect
  //         if (globalThis.websocket) {
  //           globalThis.websocket.close();
  //           console.log("WebSocket connection closed before reinitializing");
  //         }

  //         globalThis.websocket = new WebSocket(websocketURL);
  //         socket = globalThis.websocket;
  //         socket.onopen = () => {
  //           console.log("WebSocket connection opened");
  //         };

  //         socket.onmessage = (event: MessageEvent) => {
  //           try {
  //             const message = event.data;
  //             const parsedData = JSON.parse(message);
  //             setData(parsedData);
  //           } catch (parseError) {
  //             console.error("Error parsing WebSocket message:", parseError);
  //           }
  //         };

  //         socket.onerror = (error: Event) => {
  //           const errorMessage = (error as any).message;
  //           if (errorMessage !== "connection reset") {
  //             console.error("WebSocket error:", error);
  //           } else {
  //             console.log("WebSocket connection reset error handled silently");
  //           }
  //         };

  //         socket.onclose = (event: CloseEvent) => {
  //           console.log("WebSocket connection closed", event.reason || "");
  //         };
  //       } catch (error) {
  //         console.error("Error initializing WebSocket connection:", error);
  //       }
  //     };

  //     initializeWebSocket();

  //     return () => {
  //       if (socket) {
  //         socket.close();
  //         console.log("WebSocket connection cleaned up");
  //       }
  //     };
  //   }, [websocketURL])
  // );

  const handleChangeToEachView = () => {
    setViewState(true);
  };

  const handleChangeToListView = () => {
    setViewState(false);
  };

  return (
    <View style={styles.container}>
      {isParamsReady && deviceName ? (
        <DeviceBoard isOnline={true} deviceName={deviceName} />
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Loading Device Info...
        </Text>
      )}

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
      {data?.data ? (
        viewState ? (
          <EachView data={data} />
        ) : (
          <ListView data={data} />
        )
      ) : (
        <View style={styles.emptyState}>
          <Image
            source={require("../../assets/images/NOA.png")}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyTitle}>No Data Available</Text>
          <Text style={styles.emptySubtitle}>
            Waiting for real-time sensor data to appear.
          </Text>
        </View>
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyImage: {
    width: 140,
    height: 110,
    marginBottom: 20,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#666",
    fontFamily: "Koulen",
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    fontFamily: "Koulen",
  },
});
