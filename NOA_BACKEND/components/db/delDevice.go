package db

import (
	env "GOLANG_SERVER/components/env"
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
)

// DeleteDevice deletes a device from the database by its userID and deviceID
func DeleteDevice(userID, deviceID string) error {
	if userID == "" {
		return errors.New("userID is required")
	}
	if deviceID == "" {
		return errors.New("deviceID is required")
	}

	collection := client.Database(env.GetEnv("MONGO_DB")).Collection(env.GetEnv("MONGO_DEVICECOLLECTION"))
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Delete the device document
	filter := bson.M{"userID": userID, "deviceID": deviceID}
	result, err := collection.DeleteOne(ctx, filter)
	if err != nil {
		return err
	}

	if result.DeletedCount == 0 {
		return errors.New("no device found with the given userID and deviceID")
	}

	return nil
}
