package db

import (
	env "GOLANG_SERVER/components/env"
	"context"
	"errors"
	"log"
	"time"
)

// SaveDevice saves a new device to the database
func SaveDevice(deviceName, deviceID, userID, devicePassword string) error {
	collection := client.Database(env.GetEnv("MONGO_DB")).Collection(env.GetEnv("MONGO_DEVICECOLLECTION"))
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if len(deviceName) == 0 {
		return errors.New("device name is empty")

	}
	if len(deviceID) == 0 {
		return errors.New("device ID is empty")
	}
	if len(userID) == 0 {
		return errors.New("device email is empty")
	}
	if len(devicePassword) == 0 {
		return errors.New("device password is empty")
	}

	var createDate = time.Now()

	// Insert the new device into the database
	type Device struct {
		UserID      string    `bson:"userID"`
		Password    string    `bson:"password"`
		DeviceName  string    `bson:"deviceName"`
		DeviceID    string    `bson:"deviceID"`
		CreateDate  time.Time `bson:"createDate"`
		CurrentDate time.Time `bson:"currentDate"`
		Bookmark    bool      `bson:"bookmark"`
		Usage       int       `bson:"usage"`
		Status      bool      `bson:"status"`
	}

	// Insert the new device into the database
	device := Device{
		UserID:      userID,
		Password:    devicePassword,
		DeviceName:  deviceName,
		DeviceID:    deviceID,
		CreateDate:  createDate,
		CurrentDate: time.Now(),
		Bookmark:    false,
		Usage:       0,
		Status:      true,
	}

	_, err := collection.InsertOne(ctx, device)
	if err != nil {
		log.Println("Error saving device:", err)
		return err
	}

	log.Println("Device saved successfully:", deviceID)
	return nil
}
