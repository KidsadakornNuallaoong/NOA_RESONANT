let socketMap: { [key: string]: WebSocket } = {};

const WS_URL = process.env.EXPO_PUBLIC_WEBSOCKET_URL;

export default function wsDashboard(
  userID: string,
  deviceID: string
): WebSocket {
  const key = `${userID}_${deviceID}`;

  if (socketMap[key] && socketMap[key].readyState !== WebSocket.CLOSED) {
    return socketMap[key];
  }

  const socket = new WebSocket(
    `${WS_URL}/ws/boadcast?userID=${userID}&deviceID=${deviceID}`
  );

  socket.onopen = () => {
    console.log(`✅ WebSocket connected for ${deviceID}`);
  };

  socket.onclose = () => {
    console.log(`🔌 WebSocket disconnected for ${deviceID}`);
    delete socketMap[key];
  };

  socketMap[key] = socket;
  return socket;
}
