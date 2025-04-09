package ws

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"

	schema "GOLANG_SERVER/components/schema"
)

const MQTT_TOPIC = "your/mqtt/topic"
const FrameSize = 50 // Define the size of the sliding frame

var (
	clientMerge = make(map[*websocket.Conn]string) // Map of clients with identifiers
	frameMutex  sync.Mutex                         // Mutex to protect frame updates
)

func SendToSpecificClients(data []float64, targetID string) {
	clientsMutex.Lock()
	defer clientsMutex.Unlock()

	for client, clientID := range clientMerge {
		if clientID == targetID { // Send data to specific client with matching ID
			log.Printf("Sending data to client: %s, Data: %v\n", targetID, data)
			err := client.WriteJSON(data)
			if err != nil {
				log.Println("Error sending data to client:", err)
				client.Close()
				delete(clientMerge, client)
			}
		}
	}
}

func HandleWebSocketMerge(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error upgrading connection to WebSocket:", err)
		return
	}
	defer conn.Close()

	clientsMutex.Lock()
	clientMerge[conn] = "client1" // Assign a unique identifier to the client
	clientsMutex.Unlock()

	defer func() {
		clientsMutex.Lock()
		delete(clientMerge, conn)
		clientsMutex.Unlock()
	}()

	// Create unique frames for this WebSocket connection
	frameX := make([]float64, FrameSize)
	frameY := make([]float64, FrameSize)
	frameZ := make([]float64, FrameSize)

	// Create a unique channel to receive data for this WebSocket connection
	dataChan := make(chan []byte)
	go SubscribeMQTTTopic(dataChan)

	for {
		// Receive data from the channel
		data := <-dataChan
		log.Println("Received data from MQTT channel")

		// Decode the incoming MQTT data
		var mqttData schema.MQTTData
		err := json.Unmarshal(data, &mqttData)
		if err != nil {
			log.Println("Error decoding MQTT data:", err)
			continue
		}

		// Update the sliding frames for this connection
		updateFrames(frameX, frameY, frameZ, mqttData)

		// Log the updated frames
		log.Printf("Timestamp: %d, FrameX: %v, FrameY: %v, FrameZ: %v\n", mqttData.Timestamp, frameX, frameY, frameZ)

		// Send the updated frames to the client
		SendToSpecificClients(frameX, "client1")
	}
}

func updateFrames(frameX, frameY, frameZ []float64, data schema.MQTTData) {
	// Shift the frames to the left
	copy(frameX, frameX[1:])
	copy(frameY, frameY[1:])
	copy(frameZ, frameZ[1:])

	// Append the new acceleration values to the end of the frames
	frameX[FrameSize-1] = data.X.Acceleration
	frameY[FrameSize-1] = data.Y.Acceleration
	frameZ[FrameSize-1] = data.Z.Acceleration
}
