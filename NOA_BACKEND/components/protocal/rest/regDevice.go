package rest

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"GOLANG_SERVER/components/db"
)

func HandleRegisterDevice(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json") // Set the content type to JSON

	// Get the device address from the json request
	deviceAddress := r.URL.Query().Get("deviceAddress")
	if deviceAddress == "" {
		http.Error(w, "Device address not found", http.StatusBadRequest)
		return
	}

	// display device address
	log.Println("Device Address:", deviceAddress)

	// store device address to database
	if _, err := db.RegisterDevice(deviceAddress); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// send device address .json to client
	response := map[string]string{"deviceAddress": deviceAddress}
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, `{"message": "Device registered!"}`)
	// Calculate the elapsed time
	elapsedTime := time.Since(startTime)
	log.Printf("User Loging time for  %s\n", elapsedTime)
}
