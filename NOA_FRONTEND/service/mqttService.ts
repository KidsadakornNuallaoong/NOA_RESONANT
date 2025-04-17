// ✅ mqttService.ts
import init from "react_native_mqtt";
import AsyncStorage from "@react-native-async-storage/async-storage";

declare var Paho: any;

let client: any = null;

export const initMqtt = () => {
  init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    reconnect: true,
  });
};

export const connectMqtt = (
  host: string,
  port: number,
  clientId: string,
  onConnected: () => void
) => {
  client = new Paho.MQTT.Client(host, port, clientId);

  client.onConnectionLost = (res: any) => {
    if (res.errorCode !== 0) console.log("❌ Lost:", res.errorMessage);
  };

  client.connect({
    onSuccess: () => {
      console.log("✅ MQTT Connected");
      onConnected();
    },
    useSSL: false,
    timeout: 3,
    onFailure: (err: any) => {
      console.log("❌ MQTT Connect Failed:", err);
    },
  });
};

export const disconnectMqtt = () => {
  if (client?.isConnected()) {
    client.disconnect();
    console.log("🔌 Disconnected");
  }
};

export const subscribeToTopic = (
  topic: string,
  callback: (payload: string) => void
) => {
  if (!client?.isConnected()) return;

  client.subscribe(topic, { qos: 0 });

  client.onMessageArrived = (message: any) => {
    callback(message.payloadString);
  };
};
