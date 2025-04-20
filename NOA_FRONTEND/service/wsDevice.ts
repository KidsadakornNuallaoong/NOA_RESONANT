
let websocket: WebSocket | null = null;

export default function wsDevice({ id, userID }: { id: string; userID: string;}) {
    if (!id || !userID) {
        console.error("Device ID or User ID is not provided");
        return;
    }
    if (websocket) {
        websocket.close();
        console.log("WebSocket connection closed before reinitializing");
    }
  const ws = new WebSocket(process.env.EXPO_PUBLIC_WEBSOCKET_URL + `/ws/boadcast?userID=${userID}&deviceID=${id}`);
    websocket = ws;
    ws.onopen = () => {
        console.log("WebSocket connection opened");
        };
    ws.onmessage = (event) => {
        try {
            const message = event.data;
            const parsedData = JSON.parse(message);
            console.log("WebSocket message received: ", parsedData);
        } catch (parseError) {
            console.error("Error parsing WebSocket message:", parseError);
        }
    }
    ws.onerror = (error) => {
        const errorMessage = (error as any).message;
        if (errorMessage !== "connection reset") {
            console.error("WebSocket error:", error);
        } else {
            console.log("WebSocket connection reset error handled silently");
        }
    }
    ws.onclose = (event) => {
        console.log("WebSocket connection closed", event.reason || "");
    };
    return ws;
}