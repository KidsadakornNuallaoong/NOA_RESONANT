import { useEffect, useRef } from "react";

type Callback = (id: string) => void;

export default function useDeviceIDSocket(onReceive: Callback) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://104.214.174.39:8000/ws/getdeviceid");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send("user");
    };

    ws.onmessage = (event) => {
      console.log("WS message:", event.data); // 👈 debug log
      try {
        const data = JSON.parse(event.data);
        if (data.deviceID) {
          onReceive(data.deviceID);
        }
      } catch (err) {
        console.error("Invalid message:", event.data); // 👈 log error
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket closed");

    return () => {
      ws.close();
    };
  }, [onReceive]);
}
