package sensitive

import (
	"GOLANG_SERVER/components/db"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

// AuthenRequest represents the structure of the request body
type AuthenRequest struct {
	Email  string `json:"email"`
	UserID string `json:"userID"`
	Pass   string `json:"pass"`
}

// AuthenDevice function to authenticate device
func AuthenDevice(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()
	if r.Method != http.MethodPost { // Allow only POST requests
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	// Parse the request body to get user details
	var deviceDetails map[string]string
	if err := json.NewDecoder(r.Body).Decode(&deviceDetails); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Handle both lowercase and uppercase keys
	email := deviceDetails["email"]
	if email == "" {
		email = deviceDetails["Email"]
	}
	pass := deviceDetails["pass"]
	if pass == "" {
		pass = deviceDetails["Pass"]
	}
	userID := deviceDetails["userID"]
	if userID == "" {
		userID = deviceDetails["UserID"]
	}

	// Check if user exists
	log.Println("Device authentication started")
	log.Println("Email: ", email)
	log.Println("Pass: ", pass)
	log.Println("UserID: ", userID)

	// TODO use Email find in the database
	_, err := db.FindUser(email)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	} else if err == nil {
		log.Println("User found")
	}

	// Hash device details
	hashedPass, err := bcrypt.GenerateFromPassword([]byte(pass), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	deviceHash := bson.M{
		"email":  email,
		"pass":   string(hashedPass),
		"userID": userID,
	}

	log.Println("Device hash: ", deviceHash)
	// Calculate the elapsed time
	elapsedTime := time.Since(startTime)
	log.Printf("Device Authentication time for  %s\n", elapsedTime)
}
