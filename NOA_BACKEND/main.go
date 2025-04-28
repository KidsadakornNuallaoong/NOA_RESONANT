package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"GOLANG_SERVER/components/db"
	"GOLANG_SERVER/components/env"
	"GOLANG_SERVER/components/protocal/mosquitto"
	"GOLANG_SERVER/components/protocal/rest"
	"GOLANG_SERVER/components/protocal/ws"
<<<<<<< HEAD
=======
	"GOLANG_SERVER/components/sensitive"
>>>>>>> Final_BN
	"GOLANG_SERVER/components/user"
)

// Main function
func main() {
	// Load environment variables
	if err := env.LoadEnv(); err != nil {
		log.Fatal("Error loading environment variables:", err)
		return
	}

	// Get the port from the environment variables
	port, err := strconv.Atoi(env.GetEnv("PORT"))
	if err != nil {
		log.Fatal("Invalid port number:", err)
		return
	}

	// Connect to the database
	if _, err := db.Connect(); err == nil {
		// Welcome message
		fmt.Println("Message:", env.GetEnv("MESSAGE"))

		//TODO REST API route
<<<<<<< HEAD
		go http.HandleFunc("/", rest.HandleAPI)                                                  //*[DONE] API route
		go http.HandleFunc("/data", rest.HandleGetAllData)                                       //*[DONE] Get all data
		go http.HandleFunc("/store", rest.HandleStore)                                           //*[DONE] Store data
		go http.HandleFunc("/latest", rest.HandleGetLatestData)                                  //*[DONE] Get latest data
		go http.HandleFunc("/clean", rest.HandleCleanData)                                       //*[DONE] Clean data
		go http.HandleFunc("/registerdevice", rest.HandleRegisterDevice)                         //*[DONE] Register device
		go http.HandleFunc("/deviceaddresses", rest.HandleGetDeviceAddress)                      //*[DONE] Get device address
		go http.HandleFunc("/checkdeviceaddresses/", rest.HandleGetDeviceAddressByDeviceAddress) //*[DONE] Get device address by device address
		go http.HandleFunc("/data/", rest.HandleGetAllDataByDeviceAddress)                       //*[DONE] Get data use param
		go http.HandleFunc("/register", user.Register)                                           //*[DONE] Register user by Enail and Password
		go http.HandleFunc("/login", user.Login)                                                 //*[DONE] login user by Email and Password
		go http.HandleFunc("/sendotp", user.SendOTP)                                             //*[DONE] Send OTP to Email
		go http.HandleFunc("/forgotpassword", user.ForgotPasswordReq)                            //*[DONE] Forgot Password
		go http.HandleFunc("/verifyotp", user.VerifyOTP)                                         //*[DONE] Verify OTP

		//TODO--------------------------------------------------------------------------------------------------------------------------||
		//go http.HandleFunc("/authendevice", sensitive.AuthenDevice) //!Sensitive Authenticate device
		//go http.HandleFunc("/verifydevice", sensitive.VerifyDevice) //!Sensitive Verify device
=======

		//go http.HandleFunc("/", rest.HandleAPI)                 //*[DONE] API route
		//go http.HandleFunc("/latest", rest.HandleGetLatestData) //*[DONE] Get latest data

		//* Device route
		go http.HandleFunc("/device/generateDeviceID", rest.HandleGenerateDeviceID)                     //*[DONE] Generate device ID
		go http.HandleFunc("/device/createDevice", rest.HandleRegisterDevice)                           //*[DONE] Register device
		go http.HandleFunc("/device/getDevices", rest.HandleGetDeviceAddress)                           //*[DONE] Get device address
		go http.HandleFunc("/device/checkdeviceaddresses/", rest.HandleGetDeviceAddressByDeviceAddress) //*[DONE] Get device address by device address
		go http.HandleFunc("/device/deleteDevice", rest.HandleDeleteDevice)                             //*[DONE] Delete device
		go http.HandleFunc("/authendevice", sensitive.AuthenDevice)                                     //*[DONE] Authenticate device
		go http.HandleFunc("/device/changeBookmark", rest.ChangeBookmark)                               //*[DONE] Change bookmark

		//* User route
		go http.HandleFunc("/register", user.Register)                                                            //*[DONE] Register user by Enail and Password
		go http.HandleFunc("/login", user.Login)                                                                  //*[DONE] login user by Email and Password
		go http.HandleFunc("/sendotp", user.SendOTP)                                                              //*[DONE] Send OTP to Email
		go http.HandleFunc("/forgotpassword", user.ForgotPasswordReq)                                             //*[DONE] Forgot Password
		go http.HandleFunc("/verifyotp", user.VerifyOTP)                                                          //*[DONE] Verify OTP
		go http.Handle("/api/protected", sensitive.AuthMiddleware(http.HandlerFunc(sensitive.ProtectedResource))) //*[DONE] Protected resource
		go http.HandleFunc("/userID", user.GetUserByUserID)                                                       //*[DONE] Get user by userID

		//TODO--------------------------------------------------------------------------------------------------------------------------||

>>>>>>> Final_BN
		//go http.HandleFunc("/newpassword", user.ChangePassword)						  		 //TODO Change Password
		//go http.HandleFunc("/logout", user.Logout)							  				 //TODO Logout
		//go http.HandleFunc("/downloaddata")												  	 //?[Design] Download data as CSV or JSON file
		//go http.HandleFunc("/payment")												  		 //?[Design] Payment route
<<<<<<< HEAD
		//go http.HandleFunc("/notification")													 //?[Design] Notification route
		//go http.HandleFunc("/userprofile")													 //?[Design] User profile route
		//go http.HandleFunc("/userprofile/update")												 //?[Design] Update user profile route
		//go http.HandleFunc("/getprediction")													 //?[Design] Get prediction route
		//go http.HandleFunc("/prediction")														 //?[Design] Prediction route
		//TODO--------------------------------------------------------------------------------------------------------------------------||

		// TODO: WebSocket route
		http.HandleFunc("/ws", ws.HandleWebSocket) //*DONE Handle WebSocket connection

		go http.HandleFunc("/ws/test", ws.HandleWsTest)
		// TODO: Start MQTT client
		go mosquitto.HandleMQTT()
=======
		//go http.HandleFunc("/userprofile")													 //?[Design] User profile route

		//TODO--------------------------------------------------------------------------------------------------------------------------||

		// TODO: WebSocket route
		go http.HandleFunc("/ws/boadcast", ws.HandleWebSocketBoadcast)  //*DONE Handle WebSocket connection
		go http.HandleFunc("/ws/prediction", ws.HandleWebSocketPredict) //TODO Prediction route
		go http.HandleFunc("/ws/history", ws.HandleHistory)             //TODO Notification
		//go http.HandleFunc("/ws/notification", ws.HandleNotification)   //TODO Notification
		//* go http.HandleFunc("/ws/getdeviceid", ws.HandleGetDeviceIDWebSocket)

		//TODO: Start MQTT client--------------------------------------------------------------------------------------------------------------------------||

		go mosquitto.HandleMQTT()
		go ws.StartGlobalMQTTSubscriber()
		//go mosquitto.HandleWebSocketMerge()

		//TODO--------------------------------------------------------------------------------------------------------------------------||
>>>>>>> Final_BN

		// TODO: Start the server in a goroutine
		go func() {
			log.Println("Server started at Gyro Server.")
			if err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil); err != nil {
				log.Fatal("Error starting server:", err)
			}
		}()

		// Wait for 'q' or 'Q' to stop the server
		var input string
		for {
			fmt.Scanln(&input)
			if input == "q" || input == "Q" {
				fmt.Println("Server stopping...")
				break // Stop the server
			}
		}
	} else {
		fmt.Println("Error connecting to database something went wrong!!")
		return
	}
}
