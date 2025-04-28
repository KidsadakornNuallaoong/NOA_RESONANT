let socket: WebSocket | null = null;

export default function wsConnect(): WebSocket {
  if (socket && socket.readyState !== WebSocket.CLOSED) {
    return socket;
  }

  socket = new WebSocket("ws://localhost:8000/ws/sensor"); // แก้ URL ตามจริง

  socket.onopen = () => {
    console.log("✅ WebSocket connected");
  };

  socket.onerror = (error) => {
    console.error("❌ WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("🔌 WebSocket disconnected");
  };

  return socket;
}
