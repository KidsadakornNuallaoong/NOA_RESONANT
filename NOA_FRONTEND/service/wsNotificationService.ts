let socket: WebSocket | null = null;

export const initNotificationWS = (
  url: string,
  onMessage: (data: any) => void
) => {
  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("✅ WebSocket connected for notification");
  };

  socket.onmessage = (event) => {
    try {
      const parsed = JSON.parse(event.data);
      onMessage(parsed);
    } catch (err) {
      console.warn("❌ Invalid WebSocket data", event.data);
    }
  };

  socket.onclose = () => {
    console.log("❎ WebSocket disconnected for Notification");
  };
};

export const closeNotificationWS = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
