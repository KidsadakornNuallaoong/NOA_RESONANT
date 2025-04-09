package mosquitto

import (
	"encoding/json"
	"log"

	"GOLANG_SERVER/components/db"
	"GOLANG_SERVER/components/env"
	schema "GOLANG_SERVER/components/schema"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

var client mqtt.Client

// Handle MQTT connections and messages
func HandleMQTT() {
	// Create a new MQTT client
	opts := mqtt.NewClientOptions().AddBroker(env.GetEnv("MQTT_BROKER"))
	opts.SetClientID(env.GetEnv("MQTT_CLIENT_ID"))
	opts.SetUsername(env.GetEnv("MQTT_USERNAME"))
	opts.SetPassword(env.GetEnv("MQTT_PASSWORD"))
	client = mqtt.NewClient(opts)

	// Connect to the MQTT broker
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		log.Fatal("Error connecting to MQTT broker:", token.Error())
	}

	// Subscribe to the topic
	if token := client.Subscribe("vibration", 1, func(client mqtt.Client, msg mqtt.Message) {
		// log.Printf("Sub topic: %s\n", msg.Topic())

		// Process the message and store it in the database
		var data schema.GyroData
		// Unmarshal the JSON message into the GyroData struct
		if err := json.Unmarshal(msg.Payload(), &data); err != nil {
			log.Println("Error unmarshaling message:", err)
			return
		}
		if data != (schema.GyroData{}) { // if received data successfully, log it
			// log.Println("Received data from MQTT from topic:", msg.Topic())
			// log.Println("From device:", data.DeviceAddress)

			// Log the received data
			// log.Printf("Received data from MQTT topic '%s'\n", msg.Topic())

			// Store the data in the database
			if _, err := db.StoreGyroData(data); err != nil {
				log.Println("Error storing data in database:", err)
			}
			PublishMQTT("MQTT_TOPIC", string(msg.Payload())) // Publish the device address to the topic
		}

	}); token.Wait() && token.Error() != nil {
		log.Fatal("Error subscribing to topic:", token.Error())
	}

	log.Println("MQTT client ready to connect and subscribe to topic.")
}

// PublishMQTT publishes a message to the specified topic
func PublishMQTT(topic string, message string) error {
	// Publish the message to the topic
	if token := client.Publish(topic, 0, false, message); token.Wait() && token.Error() != nil {
		return token.Error()
	}
	return nil
}
