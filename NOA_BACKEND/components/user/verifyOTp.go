// TODO: Description: This file includes the functions that are used to verify the OTP of the user.
package user

import (
	"GOLANG_SERVER/components/db"
	"encoding/json"
	"log"
	"net/http"
)

// VerifyOTP verifies the OTP of the user with token in 1 minute
func VerifyOTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost { // Allow only POST requests
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	// Parse the request body to get user details
	var userDetails map[string]string
	if err := json.NewDecoder(r.Body).Decode(&userDetails); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Handle both lowercase and uppercase keys
	email := userDetails["email"]
	if email == "" {
		email = userDetails["Email"]
	}
	otp := userDetails["otp"]
	if otp == "" {
		otp = userDetails["OTP"]
	}

	// Check if user exists
	user, err := db.FindUser(email)
	if err != nil {
		http.Error(w, "Invalid email.", http.StatusUnauthorized)
		return
	}

	log.Println("User:", user.ID+" "+"Forget Password")

	// Declare checkOTP and verify the OTP
	checkOTP := db.VerifyOTP(user.ID, otp)

	if checkOTP == "" {
		http.Error(w, "Invalid OTP.", http.StatusUnauthorized)
		return
	} else if checkOTP != otp {
		http.Error(w, "Invalid OTP.", http.StatusUnauthorized)
		return
	} else if checkOTP == otp {
		log.Println("OTP Verified")
	}

	// Send a response
	response := map[string]string{"message": "OTP verified"}

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// Verify the OTP

}
