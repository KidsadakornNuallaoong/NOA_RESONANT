package user

import (
	"encoding/json"
	"log"
	"net/http"

	"GOLANG_SERVER/components/db"
	"GOLANG_SERVER/components/schema"

	"golang.org/x/crypto/bcrypt"
)

// Register handles user registration
func Register(w http.ResponseWriter, r *http.Request) {
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
	password := userDetails["password"]
	if password == "" {
		password = userDetails["Password"]
	}

	// Declare otp variable outside the if block
	var otp string

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Convert the user details to a User struct
	user := schema.User{
		Email:    email,
		Password: string(hashedPassword),
	}

	// Save user details to database
	if _, err := db.StoreUser(user); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	} else {
		log.Println("User registered successfully.")
		// Generate OTP and assign it to the otp variable
		otp = GenerateOTP()
		SendOTPEmail(email, otp)
		// Save the OTP in the database
		SaveOTP(email, otp)
	}

	// Send a response
	response := map[string]string{
		"message": "User registered successfully. Please check your email for the OTP.",
		"otp":     otp,
	}
	log.Println("User registered successfully.")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
