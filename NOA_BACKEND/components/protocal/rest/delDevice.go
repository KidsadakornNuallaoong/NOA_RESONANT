package rest

import (
	"encoding/json"
	"net/http"

	"GOLANG_SERVER/components/db"
)

// HandleDeleteDevice handles the deletion of a device
func HandleDeleteDevice(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse the request body to get the device ID
	var requestBody map[string]string
	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	userID := requestBody["userID"]
	if userID == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	deviceID := requestBody["deviceID"]
	if deviceID == "" {
		http.Error(w, "Device ID is required", http.StatusBadRequest)
		return
	}

	// Call the database function to delete the device
	if err := db.DeleteDevice(userID, deviceID); err != nil {
		http.Error(w, "Failed to delete device: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Respond with success
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Device deleted successfully"}`))
}
