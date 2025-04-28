package rest

import (
	"encoding/json"
	"net/http"

	"GOLANG_SERVER/components/db"
)

func HandleGetDeviceAddress(w http.ResponseWriter, r *http.Request) {
<<<<<<< HEAD
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json") // Set the content type to JSON

	// * get device address from database
	deviceAddresses, err := db.GetDeviceAddress()
=======
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var userDetail map[string]string
	if err := json.NewDecoder(r.Body).Decode(&userDetail); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	userID := userDetail["userID"]
	if userID == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	// ดึงข้อมูลอุปกรณ์จากฐานข้อมูล
	devices, err := db.GetDeviceAddress(userID)
>>>>>>> Final_BN
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

<<<<<<< HEAD
	// * send device addresses .json to client
	response := map[string][]string{"deviceAddresses": deviceAddresses}
	if err := json.NewEncoder(w).Encode(response); err != nil {
=======
	// ส่งข้อมูลกลับในรูปแบบ JSON
	if err := json.NewEncoder(w).Encode(devices); err != nil {
>>>>>>> Final_BN
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
