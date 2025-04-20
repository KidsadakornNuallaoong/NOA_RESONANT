import React from "react";
import {
  StyleSheet,
  View
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { DataProps } from "./dashboard";


// === Component ===
const AccelerationScreen = () => {
  const [data, setData] = React.useState<DataProps | null>(null);
  const [id, setId] = React.useState<string | null>(null);
  const [userID, setUserID] = React.useState<string | null>(null);
  const [deviceName, setDeviceName] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedId = await AsyncStorage.getItem('id');
      const storedUserID = await AsyncStorage.getItem('userID');
      const storedDeviceName = await AsyncStorage.getItem('deviceName');

      console.log("Stored ID: ", storedId)
      console.log("Stored User ID: ", storedUserID)
      console.log("Stored Device Name: ", storedDeviceName)

      setId(storedId);
      setUserID(storedUserID);
      setDeviceName(storedDeviceName);
    };

    fetchData();
  }, []);

  const websocketURL = process.env.EXPO_PUBLIC_WEBSOCKET_URL + `/ws/boadcast?userID=${userID}&deviceID=${id}`

  useFocusEffect(
    React.useCallback(() => {
      let socket: WebSocket | null = null;

      const initializeWebSocket = () => {
        try {
          // * if it working refresh websocket connect
          if (globalThis.websocket) {
            globalThis.websocket.close();
            console.log('WebSocket connection closed before reinitializing');
          }

          globalThis.websocket = new WebSocket(websocketURL);
          socket = globalThis.websocket;
          socket.onopen = () => {
            console.log('WebSocket connection opened');
          };

          socket.onmessage = (event: MessageEvent) => {
            try {
              const message = event.data;
              const parsedData = JSON.parse(message);
              setData(parsedData);
            } catch (parseError) {
              console.error('Error parsing WebSocket message:', parseError);
            }
          };

          socket.onerror = (error: Event) => {
            const errorMessage = (error as any).message;
            if (errorMessage !== 'connection reset') {
              console.error('WebSocket error:', error);
            } else {
              console.log('WebSocket connection reset error handled silently');
            }
          };

          socket.onclose = (event: CloseEvent) => {
            console.log('WebSocket connection closed', event.reason || '');
          };
        } catch (error) {
          console.error('Error initializing WebSocket connection:', error);
        }
      };

      initializeWebSocket();

      return () => {
        if (socket) {
          socket.close();
          console.log('WebSocket connection cleaned up');
        }
      };
    }, [websocketURL])
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
      </View>
    </PaperProvider>
  );
};

export default AccelerationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
