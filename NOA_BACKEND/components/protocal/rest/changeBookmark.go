package rest

import (
	"encoding/json"
	"net/http"

	"GOLANG_SERVER/components/db"
)

// ChangeBookmark handles requests to update the bookmark status of a device
func ChangeBookmark(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse the request body to get the device ID and new bookmark status
	var requestBody map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	userID, ok := requestBody["userID"].(string)
	if !ok || userID == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	deviceID, ok := requestBody["deviceID"].(string)
	if !ok || deviceID == "" {
		http.Error(w, "Device ID is required", http.StatusBadRequest)
		return
	}

	bookmark, ok := requestBody["bookmark"].(bool)
	if !ok {
		http.Error(w, "Bookmark status is required and must be a boolean", http.StatusBadRequest)
		return
	}

	// Call the database function to update the bookmark status
	if err := db.UpdateBookmark(userID, deviceID, bookmark); err != nil {
		http.Error(w, "Failed to update bookmark: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Respond with success
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Bookmark updated successfully"}`))
}
