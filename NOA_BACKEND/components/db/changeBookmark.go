package db

import (
	env "GOLANG_SERVER/components/env"
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
)

// UpdateBookmark updates the bookmark status of a device in the database
func UpdateBookmark(userID, deviceID string, bookmark bool) error {
	if userID == "" {
		return errors.New("userID is required")
	}
	if deviceID == "" {
		return errors.New("deviceID is required")
	}

	collection := client.Database(env.GetEnv("MONGO_DB")).Collection(env.GetEnv("MONGO_DEVICECOLLECTION"))
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Update the bookmark field for the specified device
	filter := bson.M{"userID": userID, "deviceID": deviceID}
	update := bson.M{"$set": bson.M{"bookmark": bookmark}}

	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		return errors.New("no device found with the given userID and deviceID")
	}

	return nil
}
